'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Manrope', sans-serif" }}>
      {/* HERO SECTION */}
      <section style={{ textAlign: 'center', padding: '88px 56px 0', position: 'relative' }}>
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12.5px', letterSpacing: '5px', color: '#4ad6b0', marginBottom: '36px' }}>
          PROTEIN&nbsp;DISCOVERY&nbsp;PLATFORM
        </div>

        <div style={{ marginBottom: '30px', position: 'relative', display: 'inline-block' }}>
          <h1
            style={{
              fontFamily: '"Newsreader", serif',
              fontWeight: 400,
              fontSize: '80px',
              lineHeight: 0.97,
              letterSpacing: '-2px',
              margin: '0',
              maxWidth: '900px',
              position: 'relative',
            }}
          >
            <span
              style={{
                textDecoration: 'line-through',
                textDecorationColor: '#ff6b6b',
                textDecorationThickness: '3px',
                color: '#e7f0ee',
              }}
            >
              Manual review, buried evidence
            </span>
            <br />
            <em style={{ fontStyle: 'italic', color: '#e7f0ee', fontWeight: 400 }}>
              Protein evidence, made searchable.
            </em>
          </h1>
        </div>

        {/* Vercel-inspired Search Bar */}
        <div
          style={{
            maxWidth: '700px',
            margin: '50px auto 40px',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 24px',
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.12)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(74,214,176,.5)';
              e.currentTarget.style.background = 'rgba(255,255,255,.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)';
              e.currentTarget.style.background = 'rgba(255,255,255,.04)';
            }}
          >
            <span style={{ fontSize: '18px', opacity: 0.6 }}>🔍</span>
            <input
              type="text"
              placeholder="Search proteins (e.g., TP53, EGFR, BRCA1)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#e7f0ee',
                fontSize: '16px',
                fontFamily: "'Manrope', sans-serif",
                outline: 'none',
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                }
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'rgba(74,214,176,.2)',
                  border: 'none',
                  color: '#4ad6b0',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(74,214,176,.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(74,214,176,.2)';
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/search">
          <div
            className="vt-teal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '56px',
              padding: '0 48px',
              borderRadius: '30px',
              background: '#4ad6b0',
              color: '#04130f',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            UCSF QBI 2026 Demo
          </div>
        </Link>
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
    </div>
  );
}
