"""End-to-end local PDF pipeline.

Run it:
    python -m western_blot_miner.pipeline papers/example.pdf
"""
import argparse
import json
import os
from pathlib import Path

from . import env, pdf_preprocess, supabase_loader, vlm_extract


def run_pdf_pipeline(pdf_path: str | Path) -> dict:
    """Preprocess a PDF, run the configured VLM, and stream positives to Supabase."""
    pdf_path = Path(pdf_path)
    summary = pdf_preprocess.preprocess_pdf(
        pdf_path=pdf_path,
        paper_id=None,
        out_dir=None,
        dpi=_env_int("WBM_PDF_DPI", pdf_preprocess.DEFAULT_DPI),
        min_candidate_score=_env_float(
            "WBM_MIN_CANDIDATE_SCORE",
            pdf_preprocess.DEFAULT_MIN_CANDIDATE_SCORE,
        ),
        min_llm_score=_env_float("WBM_MIN_LLM_SCORE", pdf_preprocess.DEFAULT_MIN_LLM_SCORE),
    )
    print(
        f"Rendered {summary['pages']} pages; "
        f"{summary['candidate_count']} candidates after CV filtering; "
        f"{summary['llm_candidate_count']} candidates above VLM threshold."
    )
    print(f"Paper ID: {summary['paper_id']}")
    print(f"Output: {summary['out_dir']}")

    supabase_stream_path = Path(summary["out_dir"]) / "supabase_rows_streamed.jsonl"

    def upload_positive(record: dict) -> int:
        rows = supabase_loader.flatten_json([record])
        if not rows:
            return 0
        with supabase_stream_path.open("a", encoding="utf-8") as handle:
            for row in rows:
                handle.write(json.dumps(row) + "\n")
        uploaded = supabase_loader.upload_rows(
            rows,
            table_name=os.environ.get("SUPABASE_TABLE", supabase_loader.DEFAULT_TABLE_NAME),
            idempotent=_env_bool("SUPABASE_IDEMPOTENT", True),
        )
        print(
            f"Supabase upload: {uploaded} rows from {record['candidate_path']}",
            flush=True,
        )
        return uploaded

    vlm_summary = vlm_extract.run_vlm_extraction(
        run_dir=summary["out_dir"],
        model=os.environ.get("WBM_VLM_MODEL", vlm_extract.DEFAULT_VLM_MODEL),
        max_tokens=_env_int("WBM_VLM_MAX_TOKENS", vlm_extract.DEFAULT_MAX_TOKENS),
        timeout=_env_int("WBM_VLM_TIMEOUT", vlm_extract.DEFAULT_TIMEOUT),
        resume=True,
        on_positive=upload_positive,
    )
    print(
        f"VLM results: {vlm_summary['results']} records; "
        f"{vlm_summary['positive_results']} western blot positives."
    )
    print(
        "Supabase streamed during VLM extraction: "
        f"{vlm_summary['streamed_positive_rows']} rows"
    )

    flattened_path = Path(summary["out_dir"]) / "supabase_rows.json"
    supabase_summary = supabase_loader.convert_and_upload(
        json_path=vlm_summary["positives_json"],
        output_path=flattened_path,
        upload=False,
    )
    print(f"Supabase rows: {supabase_summary['rows']} written to {flattened_path}")

    return {
        "preprocess": summary,
        "vlm": vlm_summary,
        "supabase": supabase_summary,
    }


def main() -> None:
    env.load_env()

    ap = argparse.ArgumentParser(
        description="Extract western blot data from a PDF and write positives to Supabase."
    )
    ap.add_argument("pdf", type=Path, help="Path to the paper PDF")
    args = ap.parse_args()
    run_pdf_pipeline(args.pdf)


def _env_bool(name: str, default: bool) -> bool:
    value = os.environ.get(name)
    if value is None:
        return default
    return value.strip().lower() not in {"0", "false", "no", "off"}


def _env_int(name: str, default: int) -> int:
    value = os.environ.get(name)
    return int(value) if value else default


def _env_float(name: str, default: float) -> float:
    value = os.environ.get(name)
    return float(value) if value else default


if __name__ == "__main__":
    main()
