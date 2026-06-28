"""Flatten VLM western blot JSON and upload band records to Supabase."""
from __future__ import annotations

import argparse
import json
import os
import time
from pathlib import Path
from typing import Any

import requests

from . import env


DEFAULT_TABLE_NAME = "western_blot_records"


def determine_blot_type(target: str | None, loading: bool) -> str:
    """Classify a target row for downstream querying."""
    if loading:
        return "loading_control"

    target_norm = (target or "").strip().lower()
    if target_norm.startswith("p") and len(target_norm) > 1:
        return "phospho_signaling"

    return "total_protein"


def load_json(path: str | Path) -> list[dict[str, Any]]:
    with Path(path).open(encoding="utf-8") as handle:
        return json.load(handle)


def flatten_json(data: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Expand positive VLM figure-level extractions into band-level rows."""
    rows: list[dict[str, Any]] = []

    for figure in data:
        extraction = figure.get("extraction")
        if not isinstance(extraction, dict):
            continue
        if extraction.get("is_western_blot") is not True:
            continue

        sample = (
            extraction.get("cell_line_tissue")
            or extraction.get("biological_sample")
            or extraction.get("sample_type")
            or None
        )
        organism = extraction.get("organism") or None

        lane_lookup = {
            lane.get("lane_index"): lane.get("condition")
            for lane in extraction.get("lanes_left_to_right", [])
            if isinstance(lane, dict)
        }
        row_lookup = {
            target.get("row_index"): target
            for target in extraction.get("targets_top_to_bottom", [])
            if isinstance(target, dict)
        }
        target_lookup = {
            target.get("target"): target
            for target in extraction.get("targets_top_to_bottom", [])
            if isinstance(target, dict) and target.get("target")
        }

        for band in extraction.get("bands", []):
            if not isinstance(band, dict):
                continue

            target = band.get("target")
            row_index = band.get("row_index")
            target_info = row_lookup.get(row_index) or target_lookup.get(target) or {}
            if not target:
                target = target_info.get("target")
            if not target:
                continue

            rows.append(
                {
                    "paper_id": figure.get("paper_id"),
                    "page": figure.get("page"),
                    "western_blot_type": determine_blot_type(
                        target,
                        bool(target_info.get("is_loading_control", False)),
                    ),
                    "sample": sample,
                    "organism": organism,
                    "target": target,
                    "condition": lane_lookup.get(band.get("lane_index")),
                    "band_detected": band.get("band_state") == "present",
                }
            )

    return rows


def upload_rows(
    rows: list[dict[str, Any]],
    supabase_url: str | None = None,
    supabase_key: str | None = None,
    table_name: str = DEFAULT_TABLE_NAME,
    idempotent: bool = False,
    chunk_size: int = 500,
) -> int:
    """Upload rows to Supabase using the PostgREST endpoint."""
    supabase_url = (supabase_url or os.environ.get("SUPABASE_URL", "")).rstrip("/")
    supabase_key = supabase_key or os.environ.get("SUPABASE_KEY", "")
    if not supabase_url:
        raise ValueError("SUPABASE_URL is required")
    if not supabase_key:
        raise ValueError("SUPABASE_KEY is required")

    endpoint = f"{supabase_url}/rest/v1/{table_name}"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }

    uploaded = 0
    if idempotent:
        rows = [
            row for row in rows
            if not _row_exists(endpoint, headers, row)
        ]

    for start in range(0, len(rows), chunk_size):
        chunk = rows[start : start + chunk_size]
        response = requests.post(endpoint, headers=headers, json=chunk, timeout=120)
        response.raise_for_status()
        uploaded += len(chunk)
    return uploaded


def convert_and_upload(
    json_path: str | Path,
    output_path: str | Path | None = None,
    upload: bool = False,
    supabase_url: str | None = None,
    supabase_key: str | None = None,
    table_name: str = DEFAULT_TABLE_NAME,
    idempotent: bool = False,
) -> dict[str, Any]:
    data = load_json(json_path)
    rows = flatten_json(data)

    if output_path is not None:
        Path(output_path).write_text(json.dumps(rows, indent=2), encoding="utf-8")

    uploaded = 0
    if upload:
        uploaded = upload_rows(
            rows,
            supabase_url=supabase_url,
            supabase_key=supabase_key,
            table_name=table_name,
            idempotent=idempotent,
        )

    return {
        "figures": len(data),
        "rows": len(rows),
        "uploaded": uploaded,
        "output_path": str(output_path) if output_path else None,
    }


def watch_jsonl_and_upload(
    jsonl_path: str | Path,
    state_path: str | Path | None = None,
    output_path: str | Path | None = None,
    supabase_url: str | None = None,
    supabase_key: str | None = None,
    table_name: str = DEFAULT_TABLE_NAME,
    poll_seconds: float = 5.0,
    stop_after_idle_seconds: float | None = None,
    start_at_end: bool = False,
) -> dict[str, Any]:
    """Watch a VLM JSONL file and upload positive records as they appear."""
    jsonl_path = Path(jsonl_path)
    state_path = Path(state_path) if state_path else jsonl_path.with_suffix(".upload_state.json")
    output_path = Path(output_path) if output_path else jsonl_path.with_name("supabase_rows_streamed.jsonl")

    if start_at_end and not state_path.exists():
        line_offset = _count_lines(jsonl_path)
        _write_upload_state(state_path, line_offset)
    else:
        line_offset = _read_upload_state(state_path)
    uploaded_total = 0
    positive_figures = 0
    idle_started_at: float | None = None

    while True:
        uploaded_this_pass = 0
        line_count = 0
        if jsonl_path.exists():
            with jsonl_path.open(encoding="utf-8") as handle:
                for line_count, line in enumerate(handle, 1):
                    if line_count <= line_offset:
                        continue
                    if not line.strip():
                        continue

                    record = json.loads(line)
                    rows = flatten_json([record])
                    line_offset = line_count
                    _write_upload_state(state_path, line_offset)
                    if not rows:
                        continue

                    positive_figures += 1
                    with output_path.open("a", encoding="utf-8") as out:
                        for row in rows:
                            out.write(json.dumps(row) + "\n")

                    uploaded = upload_rows(
                        rows,
                        supabase_url=supabase_url,
                        supabase_key=supabase_key,
                        table_name=table_name,
                        idempotent=True,
                    )
                    uploaded_total += uploaded
                    uploaded_this_pass += uploaded
                    print(
                        f"Uploaded {uploaded} rows from {record.get('candidate_path')} "
                        f"(total {uploaded_total})",
                        flush=True,
                    )

        if uploaded_this_pass:
            idle_started_at = None
        elif stop_after_idle_seconds is not None:
            now = time.monotonic()
            if idle_started_at is None:
                idle_started_at = now
            elif now - idle_started_at >= stop_after_idle_seconds:
                break

        time.sleep(poll_seconds)

    return {
        "line_offset": line_offset,
        "positive_figures": positive_figures,
        "uploaded": uploaded_total,
        "state_path": str(state_path),
        "output_path": str(output_path),
    }


def main() -> None:
    env.load_env()

    parser = argparse.ArgumentParser(description="Load VLM western blot JSON into Supabase.")
    parser.add_argument("json_path", type=Path, help="Positive-only VLM JSON path")
    parser.add_argument("--output", type=Path, help="Write flattened rows to this JSON file")
    parser.add_argument("--upload", action="store_true", help="Upload flattened rows to Supabase")
    parser.add_argument("--watch-jsonl", action="store_true", help="Watch a VLM JSONL file and upload positives as they arrive")
    parser.add_argument("--state", type=Path, help="State file for --watch-jsonl line offsets")
    parser.add_argument("--supabase-url", help="Supabase project URL")
    parser.add_argument("--supabase-key", help="Supabase API key")
    parser.add_argument(
        "--table",
        default=os.environ.get("SUPABASE_TABLE", DEFAULT_TABLE_NAME),
        help="Supabase table name",
    )
    parser.add_argument(
        "--idempotent",
        action="store_true",
        help="Skip rows that already match paper_id,page,target,condition",
    )
    parser.add_argument("--poll-seconds", type=float, default=5.0, help="Polling interval for --watch-jsonl")
    parser.add_argument("--stop-after-idle-seconds", type=float, help="Stop watch mode after this much idle time")
    parser.add_argument("--start-at-end", action="store_true", help="In watch mode, skip currently written JSONL lines")
    args = parser.parse_args()

    if args.watch_jsonl:
        summary = watch_jsonl_and_upload(
            args.json_path,
            state_path=args.state,
            output_path=args.output,
            supabase_url=args.supabase_url,
            supabase_key=args.supabase_key,
            table_name=args.table,
            poll_seconds=args.poll_seconds,
            stop_after_idle_seconds=args.stop_after_idle_seconds,
            start_at_end=args.start_at_end,
        )
    else:
        summary = convert_and_upload(
            args.json_path,
            output_path=args.output,
            upload=args.upload,
            supabase_url=args.supabase_url,
            supabase_key=args.supabase_key,
            table_name=args.table,
            idempotent=args.idempotent,
        )
    print(json.dumps(summary, indent=2))


def _read_upload_state(path: Path) -> int:
    if not path.exists():
        return 0
    try:
        return int(json.loads(path.read_text(encoding="utf-8")).get("line_offset", 0))
    except (OSError, json.JSONDecodeError, TypeError, ValueError):
        return 0


def _write_upload_state(path: Path, line_offset: int) -> None:
    path.write_text(json.dumps({"line_offset": line_offset}, indent=2), encoding="utf-8")


def _count_lines(path: Path) -> int:
    if not path.exists():
        return 0
    with path.open(encoding="utf-8") as handle:
        return sum(1 for _ in handle)


def _row_exists(endpoint: str, headers: dict[str, str], row: dict[str, Any]) -> bool:
    params = {
        "select": "id",
        "limit": "1",
    }
    for key in ("paper_id", "page", "target", "condition"):
        value = row.get(key)
        if value is None:
            params[key] = "is.null"
        else:
            params[key] = f"eq.{value}"

    response = requests.get(endpoint, headers=headers, params=params, timeout=60)
    response.raise_for_status()
    return bool(response.json())


if __name__ == "__main__":
    main()
