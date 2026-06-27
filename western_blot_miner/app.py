"""Web interface: one search bar -> a table of western blot results.

Run it:
    uvicorn western_blot_miner.app:app --reload
then open http://127.0.0.1:8000
"""
from pathlib import Path

from fastapi import FastAPI, Query
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse

from . import config, db

app = FastAPI(title="Western Blot Miner")


@app.on_event("startup")
def _startup() -> None:
    db.init_db()


@app.get("/api/search")
def api_search(protein: str = Query(..., min_length=1), limit: int = 200) -> JSONResponse:
    results = db.search(protein, limit=limit)
    return JSONResponse(
        {
            "protein": protein,
            "stats": db.stats_for(protein),
            "results": results,
        }
    )


@app.get("/api/stats")
def api_stats() -> JSONResponse:
    return JSONResponse(db.global_stats())


@app.get("/api/figure")
def api_figure(path: str) -> FileResponse:
    """Serve a downloaded figure thumbnail, sandboxed to the figures dir."""
    target = Path(path).resolve()
    figdir = config.IMAGE_DIR.resolve()
    if not str(target).startswith(str(figdir)) or not target.is_file():
        return JSONResponse({"error": "not found"}, status_code=404)
    return FileResponse(target)


@app.get("/", response_class=HTMLResponse)
def index() -> str:
    return INDEX_HTML


INDEX_HTML = """
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Western Blot Miner</title>
<style>
  :root { --bg:#f7f7f5; --ink:#1d1d1f; --accent:#2b6cb0; --line:#e2e2e0; }
  * { box-sizing: border-box; }
  body { margin:0; font-family:-apple-system,Segoe UI,Roboto,sans-serif;
         background:var(--bg); color:var(--ink); }
  header { padding:48px 24px 24px; text-align:center; }
  h1 { margin:0 0 6px; font-size:30px; }
  .sub { color:#666; font-size:15px; }
  .searchbar { max-width:640px; margin:28px auto 0; display:flex; gap:8px; padding:0 24px; }
  input { flex:1; padding:14px 16px; font-size:17px; border:1px solid var(--line);
          border-radius:10px; outline:none; }
  input:focus { border-color:var(--accent); }
  button { padding:14px 22px; font-size:16px; background:var(--accent); color:#fff;
           border:none; border-radius:10px; cursor:pointer; }
  button:hover { background:#245a96; }
  .examples { max-width:640px; margin:10px auto 0; padding:0 24px; color:#888; font-size:13px; }
  .examples a { color:var(--accent); cursor:pointer; margin:0 6px; text-decoration:none; }
  .stats { max-width:1100px; margin:28px auto 0; padding:0 24px; color:#444; font-size:15px; }
  .wrap { max-width:1100px; margin:14px auto 60px; padding:0 24px; }
  table { width:100%; border-collapse:collapse; background:#fff; border-radius:10px; overflow:hidden;
          box-shadow:0 1px 3px rgba(0,0,0,.06); }
  th,td { text-align:left; padding:11px 13px; border-bottom:1px solid var(--line);
          font-size:14px; vertical-align:top; }
  th { background:#fafafa; font-weight:600; color:#555; position:sticky; top:0; }
  tr:last-child td { border-bottom:none; }
  .pill { display:inline-block; padding:2px 9px; border-radius:999px; font-size:12px; font-weight:600; }
  .up   { background:#e6f4ea; color:#1e7a3d; }
  .down { background:#fdecea; color:#b3261e; }
  .expr { background:#e8f0fe; color:#1a56c4; }
  .none { background:#f1f1f1; color:#666; }
  a.src { color:var(--accent); text-decoration:none; }
  .muted { color:#999; }
  .empty { text-align:center; color:#888; padding:50px 0; }
  img.thumb { max-height:46px; border-radius:4px; border:1px solid var(--line); }
</style>
</head>
<body>
  <header>
    <h1>🔬 Western Blot Miner</h1>
    <div class="sub">Type a protein name &rarr; every western blot result mined from the literature.</div>
  </header>

  <div class="searchbar">
    <input id="q" placeholder="e.g. TP53, GAPDH, Actin" autofocus
           onkeydown="if(event.key==='Enter')run()">
    <button onclick="run()">Search</button>
  </div>
  <div class="examples">Try:
    <a onclick="q.value='TP53';run()">TP53</a>
    <a onclick="q.value='GAPDH';run()">GAPDH</a>
    <a onclick="q.value='Actin';run()">Actin</a>
  </div>

  <div class="stats" id="stats"></div>
  <div class="wrap" id="out"></div>

<script>
const q = document.getElementById('q');
const out = document.getElementById('out');
const statsEl = document.getElementById('stats');

function pill(result) {
  const r = (result || '').toLowerCase();
  let cls = 'none', label = result || 'unclear';
  if (r.includes('up')) cls = 'up';
  else if (r.includes('down') || r.includes('not')) cls = 'down';
  else if (r.includes('express')) cls = 'expr';
  return `<span class="pill ${cls}">${label}</span>`;
}

function cell(v) { return v ? v : '<span class="muted">&mdash;</span>'; }

function srcLink(row) {
  if (row.pmid)  return `<a class="src" target="_blank" href="https://pubmed.ncbi.nlm.nih.gov/${row.pmid}/">PMID ${row.pmid}</a>`;
  if (row.pmcid) return `<a class="src" target="_blank" href="https://www.ncbi.nlm.nih.gov/pmc/articles/${row.pmcid}/">${row.pmcid}</a>`;
  if (row.doi)   return `<a class="src" target="_blank" href="https://doi.org/${row.doi}">DOI</a>`;
  return '<span class="muted">&mdash;</span>';
}

async function run() {
  const protein = q.value.trim();
  if (!protein) return;
  statsEl.textContent = 'Searching…';
  out.innerHTML = '';
  const resp = await fetch('/api/search?protein=' + encodeURIComponent(protein));
  const data = await resp.json();
  const s = data.stats || {};
  statsEl.innerHTML = `<b>${s.n_results||0}</b> western blot results from `
    + `<b>${s.n_papers||0}</b> papers across <b>${s.n_cell_lines||0}</b> cell lines/tissues `
    + `for &ldquo;${data.protein}&rdquo;.`;

  if (!data.results.length) {
    out.innerHTML = `<div class="empty">No results yet for &ldquo;${data.protein}&rdquo;.<br>`
      + `Ingest some first: <code>python -m western_blot_miner.pipeline --protein ${data.protein} --limit 30</code></div>`;
    return;
  }

  let rows = data.results.map(r => `
    <tr>
      <td><b>${cell(r.protein)}</b></td>
      <td>${cell(r.cell_line)}</td>
      <td>${cell(r.organism)}</td>
      <td>${cell(r.condition)}</td>
      <td>${pill(r.result)}</td>
      <td>${cell(r.antibody)}</td>
      <td>${cell(r.mol_weight_kda)}</td>
      <td>${r.image_path ? `<img class="thumb" src="/api/figure?path=${encodeURIComponent(r.image_path)}">` : ''}</td>
      <td>${srcLink(r)}<div class="muted">${cell(r.figure_id)}</div></td>
    </tr>`).join('');

  out.innerHTML = `<table>
    <thead><tr>
      <th>Protein</th><th>Cell line / tissue</th><th>Organism</th><th>Condition</th>
      <th>Result</th><th>Antibody</th><th>kDa</th><th>Blot</th><th>Source</th>
    </tr></thead>
    <tbody>${rows}</tbody></table>`;
}
</script>
</body>
</html>
"""
