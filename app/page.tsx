'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Manrope', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* HERO SECTION - FULL VIEWPORT FIT */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 56px', position: 'relative', textAlign: 'center' }}>
        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 'clamp(9px, 1.5vw, 13px)', letterSpacing: 'clamp(3px, 0.5vw, 5px)', color: '#4ad6b0', marginBottom: 'clamp(16px, 3vh, 32px)' }}>
          PROTEIN&nbsp;DISCOVERY&nbsp;PLATFORM
        </div>

        {/* Hero Text - Single Lines - Responsive */}
        <div style={{ marginBottom: 'clamp(16px, 4vh, 32px)', maxWidth: '95vw' }}>
          <h1
            style={{
              fontFamily: '"Newsreader", serif',
              fontWeight: 400,
              fontSize: 'clamp(28px, 7vw, 72px)',
              lineHeight: 1.2,
              letterSpacing: '-1.5px',
              margin: '0 0 clamp(6px, 1.5vh, 16px) 0',
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
              fontSize: 'clamp(28px, 7vw, 72px)',
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

        {/* Vercel-inspired Search Bar - Responsive */}
        <div style={{ maxWidth: '650px', margin: 'clamp(16px, 3vh, 32px) auto clamp(12px, 2vh, 24px)', width: '90vw' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(8px, 1vw, 12px)',
              padding: 'clamp(10px, 1.5vh, 14px) clamp(16px, 2vw, 24px)',
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.12)',
              borderRadius: 'clamp(8px, 1vw, 12px)',
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
            <span style={{ fontSize: 'clamp(14px, 2vw, 18px)', opacity: 0.6 }}>🔍</span>
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
                fontSize: 'clamp(12px, 1.8vw, 16px)',
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

        {/* CTA Button - Responsive */}
        <Link href="/search">
          <div
            className="vt-teal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 'clamp(40px, 6vh, 56px)',
              padding: '0 clamp(28px, 5vw, 48px)',
              borderRadius: 'clamp(20px, 2vw, 28px)',
              background: '#4ad6b0',
              color: '#04130f',
              fontSize: 'clamp(12px, 1.8vw, 16px)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s',
              marginTop: 'clamp(8px, 1.5vh, 16px)',
            }}
          >
            UCSF QBI 2026 Demo
          </div>
        </Link>

        {/* STATS SECTION - COMPACT, IN-VIEW - Responsive */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(30px, 6vw, 80px)', marginTop: 'clamp(24px, 4vh, 48px)', width: '100%', maxWidth: '90vw' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(24px, 5vw, 44px)', fontWeight: 700, color: '#4ad6b0', marginBottom: 'clamp(4px, 1vh, 8px)' }}>12.4K+</div>
            <div style={{ fontSize: 'clamp(10px, 1.5vw, 13px)', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: 'clamp(0.6px, 0.3vw, 1px)' }}>BLOTS EXTRACTED</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(24px, 5vw, 44px)', fontWeight: 700, color: '#e0a458', marginBottom: 'clamp(4px, 1vh, 8px)' }}>2800+</div>
            <div style={{ fontSize: 'clamp(10px, 1.5vw, 13px)', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: 'clamp(0.6px, 0.3vw, 1px)' }}>PAPERS INDEXED</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(24px, 5vw, 44px)', fontWeight: 700, color: '#8fb6ff', marginBottom: 'clamp(4px, 1vh, 8px)' }}>520+</div>
            <div style={{ fontSize: 'clamp(10px, 1.5vw, 13px)', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: 'clamp(0.6px, 0.3vw, 1px)' }}>UNIQUE PROTEINS</div>
          </div>
        </div>
      </section>
    </div>
  );
}
