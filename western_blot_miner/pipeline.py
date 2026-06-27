"""End-to-end ingestion pipeline.

    PMC search  ->  BioC full text  ->  caption pre-filter  ->  Claude extract  ->  SQLite

Run it:
    python -m western_blot_miner.pipeline --protein TP53 --limit 30
    python -m western_blot_miner.pipeline --protein GAPDH --limit 50 --with-images
"""
import argparse
import time
from pathlib import Path
from typing import Optional

from . import config, db, extract, images, pmc


def ingest_protein(
    protein: str,
    limit: int = 30,
    with_images: bool = False,
    polite_delay: float = 0.4,
) -> dict:
    """Search PMC for a protein, extract western blot records, store them."""
    db.init_db()
    pmcids = pmc.search_pmc(protein, limit=limit)
    print(f"Found {len(pmcids)} open-access PMC articles for '{protein}'.")

    totals = {"articles": 0, "figures_seen": 0, "figures_extracted": 0, "records": 0}

    for i, pmcid in enumerate(pmcids, 1):
        print(f"[{i}/{len(pmcids)}] {pmcid}")
        article = pmc.fetch_article(pmcid)
        if article is None:
            print("    (no BioC document; skipping)")
            continue
        totals["articles"] += 1

        # Pre-filter to western-blot-looking figures to save LLM calls.
        candidates = [f for f in article.figures if pmc.is_western_blot_caption(f.caption)]
        if not candidates:
            continue

        image_map: dict[str, Path] = {}
        if with_images:
            image_map = images.download_figures(pmcid)

        for fig in candidates:
            totals["figures_seen"] += 1
            if db.figure_already_processed(pmcid, fig.figure_id):
                continue

            image_path: Optional[Path] = None
            if with_images:
                image_path = images.resolve_image(fig, image_map)

            extraction = extract.extract_figure(
                caption=fig.caption,
                methods=article.methods,
                image_path=image_path,
            )
            db.mark_figure_processed(pmcid, fig.figure_id)

            if extraction is None or not extraction.is_western_blot:
                continue
            totals["figures_extracted"] += 1

            rows = []
            for rec in extraction.records:
                rows.append(
                    {
                        "protein": rec.protein,
                        "protein_norm": rec.protein.upper(),
                        "cell_line": rec.cell_line,
                        "organism": rec.organism,
                        "mol_weight_kda": rec.mol_weight_kda,
                        "antibody": rec.antibody,
                        "condition": rec.condition,
                        "result": rec.result,
                        "pmid": article.pmid,
                        "pmcid": pmcid,
                        "doi": article.doi,
                        "figure_id": fig.figure_id,
                        "figure_caption": fig.caption[:2000],
                        "image_path": str(image_path) if image_path else None,
                        "confidence": extraction.confidence,
                    }
                )
            inserted = db.insert_records(rows)
            totals["records"] += inserted
            print(f"    {fig.figure_id}: +{inserted} records "
                  f"(conf {extraction.confidence:.2f})")

        time.sleep(polite_delay)  # be kind to NCBI

    print(
        f"\nDone. Articles: {totals['articles']}, "
        f"WB figures extracted: {totals['figures_extracted']}, "
        f"records stored: {totals['records']}."
    )
    return totals


def main() -> None:
    ap = argparse.ArgumentParser(description="Mine western blot data from PMC.")
    ap.add_argument("--protein", required=True, help="Protein name, e.g. TP53")
    ap.add_argument("--limit", type=int, default=30, help="Max PMC articles to scan")
    ap.add_argument(
        "--with-images",
        action="store_true",
        help="Also download figure images and send them to the vision model",
    )
    args = ap.parse_args()
    ingest_protein(args.protein, limit=args.limit, with_images=args.with_images)


if __name__ == "__main__":
    main()
