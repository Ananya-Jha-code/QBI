'use client';

export default function About() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Manrope', sans-serif" }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '88px 56px 60px' }}>
        <h1 style={{ fontSize: '64px', fontWeight: 600, marginBottom: '24px' }}>
          About HiveBlot
        </h1>
        <p style={{ fontSize: '18px', color: '#a9bdb5', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
          Western blotting is one of the most fundamental techniques in molecular biology, used in nearly 8-9% of all protein-related publications. But this data is trapped in millions of PDF figures, locked behind paywalls, scattered across the literature.
        </p>
      </section>

      {/* The Problem */}
      <section style={{ padding: '80px 56px', borderTop: '1px solid rgba(255,255,255,.07)', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '42px', fontWeight: 600, marginBottom: '32px' }}>The Problem</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#e0a458' }}>
              Lost Knowledge
            </h3>
            <p style={{ color: '#a9bdb5', lineHeight: 1.7 }}>
              Every western blot tells a story about which proteins are expressed in which cell lines under what conditions. That story is locked in a figure caption.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#8fb6ff' }}>
              Wasted Time
            </h3>
            <p style={{ color: '#a9bdb5', lineHeight: 1.7 }}>
              A researcher wanting to know if protein X is expressed in cell line Y must manually search PubMed, open dozens of papers, scan figures, and read captions. This takes hours or days.
            </p>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section style={{ padding: '80px 56px', borderTop: '1px solid rgba(255,255,255,.07)', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '42px', fontWeight: 600, marginBottom: '32px' }}>The Solution</h2>
        <p style={{ color: '#a9bdb5', lineHeight: 1.7, marginBottom: '32px' }}>
          HiveBlot uses computer vision and language models to automatically:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '40px' }}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔬</div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Identify</h3>
            <p style={{ color: '#a9bdb5', fontSize: '14px', lineHeight: 1.6 }}>
              Detect western blot images in published papers
            </p>
          </div>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📖</div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Extract</h3>
            <p style={{ color: '#a9bdb5', fontSize: '14px', lineHeight: 1.6 }}>
              Parse protein names, cell lines, conditions, and results from captions
            </p>
          </div>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Aggregate</h3>
            <p style={{ color: '#a9bdb5', fontSize: '14px', lineHeight: 1.6 }}>
              Build a searchable database linking proteins to cell lines
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '80px 56px', borderTop: '1px solid rgba(255,255,255,.07)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '42px', fontWeight: 600, marginBottom: '60px' }}>By the Numbers</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '80px', maxWidth: '1000px', margin: '0 auto' }}>
          <div>
            <div style={{ fontSize: '52px', fontWeight: 700, color: '#4ad6b0', marginBottom: '12px' }}>2.8K+</div>
            <div style={{ color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', letterSpacing: '1px' }}>PAPERS PROCESSED</div>
          </div>
          <div>
            <div style={{ fontSize: '52px', fontWeight: 700, color: '#e0a458', marginBottom: '12px' }}>12.4K+</div>
            <div style={{ color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', letterSpacing: '1px' }}>BLOTS INDEXED</div>
          </div>
          <div>
            <div style={{ fontSize: '52px', fontWeight: 700, color: '#8fb6ff', marginBottom: '12px' }}>520+</div>
            <div style={{ color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', letterSpacing: '1px' }}>PROTEINS TRACKED</div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section style={{ padding: '80px 56px', borderTop: '1px solid rgba(255,255,255,.07)', backgroundColor: 'rgba(74,214,176,.04)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 600, marginBottom: '32px', textAlign: 'center' }}>Why It Matters</h2>
          <p style={{ color: '#a9bdb5', lineHeight: 1.8, fontSize: '16px' }}>
            HiveBlot democratizes access to western blot data. Instead of taking hours to discover that a protein is expressed in a cell line, researchers can answer that question in seconds. This accelerates experimental design, reduces redundant work, and makes protein expression knowledge immediately actionable.
          </p>
          <p style={{ color: '#a9bdb5', lineHeight: 1.8, fontSize: '16px', marginTop: '20px' }}>
            The database grows with every new publication, creating a living resource that bridges the gap between published results and active research.
          </p>
        </div>
      </section>
    </div>
  );
}
