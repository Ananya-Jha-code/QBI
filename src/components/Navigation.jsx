export function Navigation({ onLogoClick }) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '26px 56px',
        borderBottom: '1px solid rgba(255,255,255,.07)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'rgba(6,9,12,.88)',
        backdropFilter: 'blur(14px)',
      }}
    >
      {/* Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        onClick={onLogoClick}
      >
        <div
          style={{
            width: '22px',
            height: '22px',
            border: '1px solid rgba(255,255,255,.35)',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              background: '#4ad6b0',
              borderRadius: '50%',
              boxShadow: '0 0 7px #4ad6b0',
            }}
          />
        </div>
        <span
          style={{
            fontFamily: '"Newsreader", serif',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: '21px',
            letterSpacing: '-.2px',
            color: '#e7f0ee',
          }}
        >
          Western Blot Miner
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Info */}
      <div style={{ fontSize: '13px', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace' }}>
        QBI Hackathon 2026
      </div>
    </nav>
  );
}
