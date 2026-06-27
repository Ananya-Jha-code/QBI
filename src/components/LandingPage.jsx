import { SearchInput } from './SearchInput';

export function LandingPage({ onSearch }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 40px',
        background: 'linear-gradient(135deg, rgba(6,9,12,1) 0%, rgba(6,9,12,0.8) 100%)',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '700px' }}>
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#e7f0ee',
            margin: '0 0 20px 0',
            fontFamily: '"Newsreader", serif',
            letterSpacing: '-1px',
          }}
        >
          Western Blot Miner
        </h1>

        <p
          style={{
            fontSize: '20px',
            color: '#a9bdb5',
            margin: '0 0 60px 0',
            lineHeight: '1.6',
            fontWeight: 300,
          }}
        >
          Instantly search for published western blot results across scientific literature.
          Type a protein name to discover every cell line where it's been detected.
        </p>

        <SearchInput
          placeholder="Search for a protein (e.g., TP53, GAPDH, BRCA1)"
          onSearch={onSearch}
        />

        <div
          style={{
            marginTop: '60px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px',
            paddingTop: '40px',
            borderTop: '1px solid rgba(255,255,255,.08)',
          }}
        >
          <div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#4ad6b0' }}>
              847+
            </div>
            <div style={{ fontSize: '14px', color: '#a9bdb5', marginTop: '8px' }}>
              Western blot results
            </div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#e0a458' }}>
              312+
            </div>
            <div style={{ fontSize: '14px', color: '#a9bdb5', marginTop: '8px' }}>
              Scientific papers
            </div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#8fb6ff' }}>
              200+
            </div>
            <div style={{ fontSize: '14px', color: '#a9bdb5', marginTop: '8px' }}>
              Unique proteins
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
