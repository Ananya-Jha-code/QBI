'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Manrope', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* HERO SECTION - FULL VIEWPORT FIT */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 56px', position: 'relative', textAlign: 'center' }}>
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '5px', color: '#4ad6b0', marginBottom: '24px' }}>
          PROTEIN&nbsp;DISCOVERY&nbsp;PLATFORM
        </div>

        {/* Hero Text - Single Lines */}
        <div style={{ marginBottom: '24px', maxWidth: '1200px' }}>
          <h1
            style={{
              fontFamily: '"Newsreader", serif',
              fontWeight: 400,
              fontSize: '56px',
              lineHeight: 1.2,
              letterSpacing: '-1.5px',
              margin: '0 0 12px 0',
              color: '#e7f0ee',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'clip',
            }}
          >
            <span
              style={{
                textDecoration: 'line-through',
                textDecorationColor: '#ff6b6b',
                textDecorationThickness: '2px',
              }}
            >
              Manual review, buried evidence
            </span>
          </h1>
          <h2
            style={{
              fontFamily: '"Newsreader", serif',
              fontWeight: 400,
              fontSize: '56px',
              lineHeight: 1.2,
              letterSpacing: '-1.5px',
              margin: '0',
              color: '#e7f0ee',
              fontStyle: 'italic',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'clip',
            }}
          >
            Protein evidence, made searchable.
          </h2>
        </div>

        {/* Vercel-inspired Search Bar */}
        <div style={{ maxWidth: '650px', margin: '24px auto 20px', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.12)',
              borderRadius: '10px',
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
            <span style={{ fontSize: '16px', opacity: 0.6 }}>🔍</span>
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
                fontSize: '14px',
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
                  borderRadius: '4px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontSize: '11px',
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
              height: '48px',
              padding: '0 40px',
              borderRadius: '24px',
              background: '#4ad6b0',
              color: '#04130f',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s',
              marginTop: '12px',
            }}
          >
            UCSF QBI 2026 Demo
          </div>
        </Link>

        {/* STATS SECTION - COMPACT, IN-VIEW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '60px', marginTop: '40px', width: '100%', maxWidth: '900px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#4ad6b0', marginBottom: '6px' }}>12.4K+</div>
            <div style={{ fontSize: '12px', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.8px' }}>BLOTS EXTRACTED</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#e0a458', marginBottom: '6px' }}>2800+</div>
            <div style={{ fontSize: '12px', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.8px' }}>PAPERS INDEXED</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#8fb6ff', marginBottom: '6px' }}>520+</div>
            <div style={{ fontSize: '12px', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.8px' }}>UNIQUE PROTEINS</div>
          </div>
        </div>
      </section>
    </div>
  );
}
