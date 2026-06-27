export function ResultsTable({ results, isLoading, hasSearched }) {
  if (isLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace' }}>
            Loading results...
          </div>
        </div>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#a9bdb5' }}>
            Search for a protein to get started
          </div>
          <div style={{ fontSize: '14px', color: '#6f857d', marginTop: '8px' }}>
            e.g., TP53, GAPDH, BRCA1
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#a9bdb5' }}>
            No results found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,.08)', position: 'sticky', top: 0, background: 'rgba(6,9,12,.6)' }}>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Protein
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Cell Line
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Result
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Condition
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Paper
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Confidence
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Image
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr
              key={result.id}
              className="table-row"
              style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}
            >
              <td style={{ padding: '14px 20px', fontSize: '14px', color: '#e7f0ee', fontWeight: 500 }}>
                {result.protein}
              </td>
              <td style={{ padding: '14px 20px', fontSize: '14px', color: '#a9bdb5' }}>
                {result.cell_line}
              </td>
              <td style={{ padding: '14px 20px', fontSize: '14px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: getResultColor(result.result),
                    color: '#04130f',
                  }}
                >
                  {result.result}
                </span>
              </td>
              <td style={{ padding: '14px 20px', fontSize: '13px', color: '#a9bdb5', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {result.condition || '—'}
              </td>
              <td style={{ padding: '14px 20px', fontSize: '13px' }}>
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${result.paper_pmid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#4ad6b0', textDecoration: 'none', fontWeight: 500 }}
                >
                  {result.paper_pmid}
                </a>
              </td>
              <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: '13px', color: '#a9bdb5' }}>
                {(result.confidence * 100).toFixed(0)}%
              </td>
              <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                {result.figure_url && (
                  <img
                    src={result.figure_url}
                    alt="Western blot"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      opacity: 0.8,
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getResultColor(result) {
  switch (result) {
    case 'detected':
      return '#4ad6b0';
    case 'upregulated':
      return '#e0a458';
    case 'downregulated':
      return '#ff6b6b';
    case 'not_detected':
      return '#8fb6ff';
    default:
      return '#a9bdb5';
  }
}
