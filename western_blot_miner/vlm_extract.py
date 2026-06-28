"""OpenAI-compatible VLM extraction for local PDF candidates.

The model backend is intentionally configurable. It can point at RunPod/vLLM,
OpenAI-compatible local servers, or another compatible vision-language model.
"""
from __future__ import annotations

import base64
import io
import json
import os
from pathlib import Path
from typing import Any, Callable

from . import pdf_preprocess


DEFAULT_VLM_MODEL = "Qwen/Qwen3-VL-8B-Instruct"
DEFAULT_MAX_TOKENS = 8192
DEFAULT_TIMEOUT = 300

PROMPT = """
You are given ONE cropped candidate image from a scientific paper and paper text.

Return ONLY valid JSON. No markdown. No prose.

Use the IMAGE as the source of truth for:
- whether this is a western blot/immunoblot/protein band panel
- visible target labels
- visible lanes
- whether each band is present, absent, or uncertain

Use the PAPER TEXT only for:
- figure caption
- biological sample / cell line / tissue / organism
- treatment context
- abbreviation expansion

Do not use text to invent bands not visible in the image.
Use nearby page text, figure/caption context, and methods snippets to infer biological_sample, cell_line_tissue, organism, and sample_type. Prefer the caption/nearby page text over general methods text. If multiple samples are plausible, list them separated by "; " and add a warning.
If unclear, use "".

If this is not a western blot/immunoblot/protein band panel, return:
{"is_western_blot": false, "reason": "not a western blot"}

If it is a western blot/immunoblot/protein band panel, return:
{
  "is_western_blot": true,
  "panel_label": null,
  "figure_label": "",
  "figure_caption": "",
  "biological_sample": "",
  "cell_line_tissue": "",
  "organism": "",
  "sample_type": "",
  "treatment_context": "",
  "targets_top_to_bottom": [
    {"row_index": 1, "target": "", "is_loading_control": false, "confidence": "low"}
  ],
  "lanes_left_to_right": [
    {"lane_index": 1, "condition": "", "confidence": "low"}
  ],
  "bands": [
    {"row_index": 1, "target": "", "lane_index": 1, "band_state": "present", "confidence": "low"}
  ],
  "warnings": []
}

Rules:
- One band entry is required for every visible target row x every visible lane.
- band_state must be "present", "absent", or "uncertain".
- Use "uncertain" for faint, smeared, cropped, merged, or ambiguous bands.
- Do not estimate fold change or intensity.
- Read target names exactly as visible in the image.
- Loading controls include Actin, beta-actin, GAPDH, Tubulin, HSP90, Vinculin, and total protein.
- If lane labels are shown as + / - grids, encode condition as readable text, e.g. "Drug +; siRNA -".
""".strip()


def parse_json(raw: str) -> Any:
    """Parse model JSON, tolerating code fences, thinking tags, and extra text."""
    raw = raw.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()

    while "<think>" in raw and "</think>" in raw:
        start = raw.find("<think>")
        end = raw.find("</think>", start)
        raw = (raw[:start] + raw[end + len("</think>") :]).strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    start = raw.find("{")
    end = raw.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(raw[start : end + 1])
        except json.JSONDecodeError:
            pass

    return {"error": "bad_json", "raw": raw[:1200]}


class OpenAICompatibleVLM:
    """Small HTTP client for OpenAI-compatible vision chat completion APIs."""

    def __init__(
        self,
        base_url: str | None = None,
        api_key: str | None = None,
        model: str | None = None,
        timeout: int = DEFAULT_TIMEOUT,
    ) -> None:
        self.base_url = (
            base_url
            or os.environ.get("WBM_VLM_BASE_URL", "")
            or os.environ.get("WBM_QWEN_BASE_URL", "")
        ).rstrip("/")
        self.api_key = (
            api_key
            or os.environ.get("WBM_VLM_API_KEY", "")
            or os.environ.get("WBM_QWEN_API_KEY", "")
        )
        self.model = (
            model
            or os.environ.get("WBM_VLM_MODEL", "")
            or os.environ.get("WBM_QWEN_MODEL", "")
            or DEFAULT_VLM_MODEL
        )
        self.timeout = timeout

        if not self.base_url:
            raise ValueError("VLM base URL is required via --vlm-base-url or WBM_VLM_BASE_URL")
        if not self.api_key:
            raise ValueError("VLM API key is required via --vlm-api-key or WBM_VLM_API_KEY")

    def extract_candidate(
        self,
        candidate_path: str | Path,
        text_context: str,
        max_tokens: int = DEFAULT_MAX_TOKENS,
    ) -> Any:
        try:
            import requests
        except ImportError as exc:  # pragma: no cover - depends on local env
            raise RuntimeError("requests is required for VLM extraction") from exc

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": image_data_url(candidate_path)},
                        },
                        {
                            "type": "text",
                            "text": f"{PROMPT}\n\n--- LOCAL TEXT ---\n{text_context}",
                        },
                    ],
                }
            ],
            "temperature": 0,
            "max_tokens": max_tokens,
        }
        response = requests.post(
            f"{self.base_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=self.timeout,
        )
        response.raise_for_status()
        data = response.json()
        raw = data["choices"][0]["message"]["content"]
        return parse_json(raw)


def image_data_url(path: str | Path, max_side: int = 1200) -> str:
    """Return a resized crop as a PNG data URL."""
    img = pdf_preprocess.load_for_vlm(path, max_side=max_side)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/png;base64,{encoded}"


def run_vlm_extraction(
    run_dir: str | Path,
    base_url: str | None = None,
    api_key: str | None = None,
    model: str | None = None,
    max_tokens: int = DEFAULT_MAX_TOKENS,
    timeout: int = DEFAULT_TIMEOUT,
    limit: int | None = None,
    resume: bool = True,
    on_positive: Callable[[dict[str, Any]], int] | None = None,
) -> dict[str, Any]:
    """Run the configured VLM over LLM-threshold PDF candidates."""
    run_dir = Path(run_dir)
    candidates_path = run_dir / "llm_candidates.json"
    contexts_path = run_dir / "candidate_contexts.jsonl"
    output_jsonl = run_dir / "vlm_extractions.jsonl"
    output_json = run_dir / "vlm_extractions.json"
    positives_json = run_dir / "vlm_extractions_positive_only.json"

    candidates = json.loads(candidates_path.read_text(encoding="utf-8"))
    contexts = _read_contexts(contexts_path)
    if limit is not None:
        candidates = candidates[:limit]

    done_paths = set()
    results = []
    if resume and output_jsonl.exists():
        with output_jsonl.open(encoding="utf-8") as handle:
            for line in handle:
                if not line.strip():
                    continue
                record = json.loads(line)
                results.append(record)
                done_paths.add(record["candidate_path"])

    extractor = OpenAICompatibleVLM(
        base_url=base_url,
        api_key=api_key,
        model=model,
        timeout=timeout,
    )

    output_mode = "a" if resume else "w"
    streamed_positive_rows = 0
    with output_jsonl.open(output_mode, encoding="utf-8") as handle:
        for idx, candidate in enumerate(candidates, 1):
            candidate_path = candidate["candidate_path"]
            if candidate_path in done_paths:
                continue
            context = contexts.get(candidate_path, "")
            print(
                f"{idx}/{len(candidates)} "
                f"score={candidate['cv_score']:.3f} "
                f"page={candidate['page']} "
                f"{candidate_path}"
            )
            try:
                extraction = extractor.extract_candidate(
                    candidate_path=candidate_path,
                    text_context=context,
                    max_tokens=max_tokens,
                )
            except Exception as exc:
                extraction = {
                    "error": "vlm_request_failed",
                    "message": str(exc),
                }

            record = {**candidate, "extraction": extraction}
            results.append(record)
            handle.write(json.dumps(record) + "\n")
            handle.flush()
            if (
                on_positive is not None
                and isinstance(extraction, dict)
                and extraction.get("is_western_blot") is True
            ):
                streamed_positive_rows += on_positive(record)

    output_json.write_text(json.dumps(results, indent=2), encoding="utf-8")
    positives = [
        result
        for result in results
        if isinstance(result.get("extraction"), dict)
        and result["extraction"].get("is_western_blot") is True
    ]
    positives_json.write_text(json.dumps(positives, indent=2), encoding="utf-8")

    summary = {
        "run_dir": str(run_dir),
        "model": extractor.model,
        "candidates": len(candidates),
        "results": len(results),
        "positive_results": len(positives),
        "streamed_positive_rows": streamed_positive_rows,
        "output_jsonl": str(output_jsonl),
        "output_json": str(output_json),
        "positives_json": str(positives_json),
    }
    (run_dir / "vlm_summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    return summary


def _read_contexts(path: Path) -> dict[str, str]:
    contexts = {}
    with path.open(encoding="utf-8") as handle:
        for line in handle:
            if not line.strip():
                continue
            record = json.loads(line)
            contexts[record["candidate_path"]] = record["text_context"]
    return contexts
