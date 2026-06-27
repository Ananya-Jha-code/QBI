'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Manrope', sans-serif" }}>
      {/* HERO SECTION */}
      <section style={{ textAlign: 'center', padding: '88px 56px 0', position: 'relative' }}>
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12.5px', letterSpacing: '5px', color: '#4ad6b0', marginBottom: '36px' }}>
          PROTEIN&nbsp;DISCOVERY&nbsp;PLATFORM
        </div>
        <h1
          style={{
            fontFamily: '"Newsreader", serif',
            fontWeight: 400,
            fontSize: '80px',
            lineHeight: 0.97,
            letterSpacing: '-2px',
            margin: '0 auto 30px',
            maxWidth: '900px',
          }}
        >
          Mine the blots.<br />
          <em>Extract the truth.</em>
        </h1>
        <p style={{ fontSize: '19px', lineHeight: 1.65, color: '#a9bdb5', maxWidth: '620px', margin: '0 auto 40px', fontWeight: 500 }}>
          HiveBlot aggregates thousands of published western blot results into a searchable database. Discover protein expression patterns in seconds.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          <Link href="/search">
            <div
              className="vt-teal"
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '56px',
                padding: '0 32px',
                borderRadius: '30px',
                background: '#4ad6b0',
                color: '#04130f',
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              Launch search
            </div>
          </Link>
          <Link href="/search?quick=true">
            <div
              className="vt-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '56px',
                padding: '0 32px',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,.22)',
                color: '#a9bdb5',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              Quick preview
            </div>
          </Link>
        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '80px', padding: '120px 56px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,.07)' }}>
        <div>
          <div style={{ fontSize: '48px', fontWeight: 700, color: '#4ad6b0', marginBottom: '12px' }}>12.4K+</div>
          <div style={{ fontSize: '14px', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '1px' }}>BLOTS EXTRACTED</div>
        </div>
        <div>
          <div style={{ fontSize: '48px', fontWeight: 700, color: '#e0a458', marginBottom: '12px' }}>2800+</div>
          <div style={{ fontSize: '14px', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '1px' }}>PAPERS INDEXED</div>
        </div>
        <div>
          <div style={{ fontSize: '48px', fontWeight: 700, color: '#8fb6ff', marginBottom: '12px' }}>520+</div>
          <div style={{ fontSize: '14px', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '1px' }}>UNIQUE PROTEINS</div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ padding: '120px 56px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
        <h2 style={{ fontSize: '48px', fontWeight: 600, textAlign: 'center', marginBottom: '80px' }}>
          How HiveBlot works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '60px', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Search</h3>
            <p style={{ color: '#a9bdb5', lineHeight: 1.6, fontSize: '15px' }}>
              Type any protein name and instantly access all published western blot results for that protein.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📊</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Discover</h3>
            <p style={{ color: '#a9bdb5', lineHeight: 1.6, fontSize: '15px' }}>
              See which cell lines express your protein, how conditions affect expression, and what researchers used.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔗</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Link</h3>
            <p style={{ color: '#a9bdb5', lineHeight: 1.6, fontSize: '15px' }}>
              Every result links directly to the source paper on PubMed. Trace findings back to the original research.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
