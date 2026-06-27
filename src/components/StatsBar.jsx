export function StatsBar({ totalResults, totalPapers, query }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255,255,255,.08)',
        background: 'rgba(6,9,12,.4)',
        backdropFilter: 'blur(8px)',
        gap: '40px',
      }}
    >
      <div>
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: '#a9bdb5' }}>
          RESULTS
        </span>
        <div style={{ fontSize: '24px', fontWeight: 600, color: '#e7f0ee', marginTop: '6px' }}>
          {totalResults}
          <span style={{ fontSize: '16px', color: '#a9bdb5', marginLeft: '8px' }}>
            from {totalPapers} papers
          </span>
        </div>
      </div>

      <div style={{ borderLeft: '1px solid rgba(255,255,255,.08)', height: '40px' }} />

      <div>
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: '#a9bdb5' }}>
          SEARCH QUERY
        </span>
        <div style={{ fontSize: '18px', fontWeight: 500, color: '#4ad6b0', marginTop: '6px' }}>
          {query || 'All proteins'}
        </div>
      </div>
    </div>
  );
}
