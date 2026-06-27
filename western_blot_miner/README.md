# 🔬 Western Blot Miner

Type a protein name → see every published western blot result for it across the
literature. The tool searches PubMed Central Open Access, pulls figure captions
and methods, uses Claude to decide which figures are western blots and extract
structured facts (protein, cell line, condition, result, antibody…), and serves
it all behind a single search bar.

This is the QBI Hackathon MVP: **one flow working end to end** —
`protein name → results table`.

## Pipeline

```
PMC search (E-utilities)
        │
        ▼
BioC full text  ──►  figure captions + methods   (free, no auth)
        │
        ▼
caption pre-filter  ──►  keeps only WB-looking figures (saves LLM calls)
        │
        ▼
Claude (classify + extract)  ──►  is this a western blot? + structured records
        │                          (caption + methods, plus the image if available)
        ▼
SQLite  ──►  searchable by protein / cell line / organism
        │
        ▼
Web UI (FastAPI)  ──►  search bar + results table + source links
```

## Setup

```bash
cd western_blot_miner/..              # be in the parent of this package
python -m venv .venv && source .venv/bin/activate
pip install -r western_blot_miner/requirements.txt

export ANTHROPIC_API_KEY=sk-ant-...   # required
export NCBI_API_KEY=...               # optional, higher rate limit
```

(See `.env.example` for all variables.)

## 1. Ingest some data

```bash
# Text-only (fast, reliable): captions + methods → Claude
python -m western_blot_miner.pipeline --protein TP53 --limit 30

# With figure images sent to Claude's vision model (slower, richer)
python -m western_blot_miner.pipeline --protein GAPDH --limit 20 --with-images
```

Re-runs are idempotent — already-processed figures are skipped, so you can
build the database incrementally across several proteins.

## 2. Launch the search interface

```bash
uvicorn western_blot_miner.app:app --reload
# open http://127.0.0.1:8000
```

Type `TP53`, hit Enter, get a table of every mined result with links back to
each source paper.

## Files

| File          | Role                                                        |
|---------------|-------------------------------------------------------------|
| `config.py`   | Paths, model name, API endpoints, keyword filter            |
| `pmc.py`      | PMC search (E-utilities) + structured full text (BioC API)  |
| `images.py`   | Optional figure-image download via the PMC OA package       |
| `extract.py`  | Claude classification + structured extraction (vision + text) |
| `db.py`       | SQLite schema, inserts, search queries                      |
| `pipeline.py` | Orchestrates ingestion; CLI entry point                     |
| `app.py`      | FastAPI backend + single-page search UI                     |

## Notes & accuracy

- The model only reports facts it can justify from the caption / methods /
  image, and flags figures that are *not* western blots (bar charts,
  microscopy, Coomassie gels) so they don't pollute the database.
- Each row carries a confidence score and links back to the source paper, so
  results are auditable — pick well-known proteins (TP53, GAPDH, Actin) to
  spot-check extraction quality, as the project brief recommends.
- Data source: PubMed Central Open Access (free APIs, no auth needed for BioC).
  Restricting the search to `open access[filter]` guarantees figures and full
  text are available.
- Model defaults to `claude-opus-4-8`. For large bulk runs set
  `WBM_MODEL=claude-sonnet-4-6` to cut cost.
