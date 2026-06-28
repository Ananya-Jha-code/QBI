'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const TYPEWRITER_TEXT = 'Experiment-level evidence, searchable.';

function TypewriterHeadline() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const [isCursorFading, setIsCursorFading] = useState(false);

  useEffect(() => {
    let typingTimeout: ReturnType<typeof setTimeout> | undefined;
    let cursorFadeTimeout: ReturnType<typeof setTimeout> | undefined;
    let cursorHideTimeout: ReturnType<typeof setTimeout> | undefined;
    let currentIndex = 0;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleCount(TYPEWRITER_TEXT.length);
      setShowCursor(false);
      return;
    }

    const typeNextCharacter = () => {
      currentIndex += 1;
      setVisibleCount(currentIndex);

      if (currentIndex >= TYPEWRITER_TEXT.length) {
        cursorFadeTimeout = setTimeout(() => {
          setIsCursorFading(true);
        }, 800);
        cursorHideTimeout = setTimeout(() => {
          setShowCursor(false);
        }, 1680);
        return;
      }

      const currentCharacter = TYPEWRITER_TEXT[currentIndex - 1];
      const nextDelay = currentCharacter === ',' ? 96 : currentCharacter === ' ' ? 34 : 52 + (currentIndex % 4) * 4;
      typingTimeout = setTimeout(typeNextCharacter, nextDelay);
    };

    const startTimeout = setTimeout(() => {
      setShowCursor(true);
      setIsCursorFading(false);
      typeNextCharacter();
    }, 850);

    return () => {
      clearTimeout(startTimeout);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      if (cursorFadeTimeout) {
        clearTimeout(cursorFadeTimeout);
      }
      if (cursorHideTimeout) {
        clearTimeout(cursorHideTimeout);
      }
    };
  }, []);

  return (
    <span className="typewriter-headline" aria-label={TYPEWRITER_TEXT}>
      <span className="typewriter-reserve" aria-hidden="true">
        {TYPEWRITER_TEXT}
      </span>
      <span className="typewriter-visible" aria-hidden="true">
        {TYPEWRITER_TEXT.slice(0, visibleCount)}
        {showCursor && <span className={`typewriter-cursor ${isCursorFading ? 'typewriter-cursor-done' : ''}`} />}
      </span>
    </span>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const EXAMPLE_QUERIES = [
    'phospho-TBK1 in p53 WT vs KO MEFs',
    'EGFR after erlotinib in A549 cells',
    'BRCA1–BARD1 co-IP in human cells',
  ];

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Manrope', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <section
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 56px',
          position: 'relative',
          textAlign: 'center',
          overflow: 'hidden',
          isolation: 'isolate',
          background: '#06090c',
        }}
      >
        <video
          aria-hidden="true"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/hive.png"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: -2,
            pointerEvents: 'none',
          }}
        >
          <source src="/videos/hive-background-v3.mp4" type="video/mp4" />
        </video>

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            background:
              'radial-gradient(circle at center, rgba(6,9,12,.38) 0%, rgba(6,9,12,.58) 46%, rgba(6,9,12,.84) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 'clamp(9px, 1.5vw, 13px)',
            letterSpacing: 'clamp(3px, 0.5vw, 5px)',
            color: '#4ad6b0',
            marginBottom: 'clamp(12px, 2vh, 24px)',
          }}
        >
          FIGURE-LEVEL WESTERN BLOT EVIDENCE
        </div>

        {/* Main Headlines */}
        <div style={{ marginBottom: 'clamp(16px, 4vh, 32px)', maxWidth: '95vw' }}>
          <h1
            style={{
              fontFamily: '"Newsreader", serif',
              fontWeight: 400,
              fontSize: 'clamp(20px, 5vw, 52px)',
              lineHeight: 1.2,
              letterSpacing: '-1.5px',
              margin: '0 0 clamp(6px, 1.5vh, 12px) 0',
              color: '#e7f0ee',
            }}
          >
            <span
              style={{
                position: 'relative',
                display: 'inline-block',
              }}
            >
              Protein mentions, missing context
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '-0.02em',
                  right: '-0.02em',
                  top: '54%',
                  height: '3px',
                  borderRadius: '999px',
                  background: '#ff6b6b',
                  transform: 'translateY(-50%)',
                }}
              />
            </span>
          </h1>
          <h2
            style={{
              fontFamily: '"Newsreader", serif',
              fontWeight: 400,
              fontSize: 'clamp(26px, 6vw, 62px)',
              lineHeight: 1.2,
              letterSpacing: '-1.5px',
              margin: '0',
              color: '#e7f0ee',
              fontStyle: 'italic',
            }}
          >
            <TypewriterHeadline />
          </h2>
        </div>

        {/* Supporting Sentence */}
        <div
          style={{
            maxWidth: '720px',
            marginBottom: 'clamp(24px, 4vh, 40px)',
            fontFamily: '"Newsreader", serif',
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: '#a9bdb5',
            lineHeight: 1.7,
          }}
        >
          Search published western blots by readout, model, perturbation, and experiment type—then inspect the original figure, controls, caption, paper, and confidence behind every result.
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: '750px', margin: '0 auto clamp(24px, 3vh, 36px)', width: '92vw' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(12px, 1.5vw, 16px)',
              padding: 'clamp(14px, 2.2vh, 20px) clamp(20px, 2.5vw, 32px)',
              background: 'rgba(255,255,255,.12)',
              border: '1.5px solid rgba(255,255,255,.25)',
              borderRadius: 'clamp(12px, 1.5vw, 16px)',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 24px rgba(74,214,176,.2)',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor = 'rgba(74,214,176,.8)';
              event.currentTarget.style.background = 'rgba(255,255,255,.15)';
              event.currentTarget.style.boxShadow = '0 0 32px rgba(74,214,176,.35)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor = 'rgba(255,255,255,.25)';
              event.currentTarget.style.background = 'rgba(255,255,255,.12)';
              event.currentTarget.style.boxShadow = '0 0 24px rgba(74,214,176,.2)';
            }}
          >
            <span style={{ fontSize: 'clamp(16px, 2.2vw, 20px)', opacity: 0.8 }}>🔍</span>
            <input
              type="text"
              placeholder="e.g. phospho-TBK1 · p53 WT vs KO · mouse embryonic fibroblasts"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#e7f0ee',
                fontSize: 'clamp(14px, 2vw, 18px)',
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
                  background: 'rgba(74,214,176,.25)',
                  border: 'none',
                  color: '#e7f0ee',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(74,214,176,.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(74,214,176,.25)';
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Example Query Chips */}
          <div
            style={{
              display: 'flex',
              gap: 'clamp(8px, 1.5vw, 12px)',
              marginTop: 'clamp(16px, 2vh, 24px)',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {EXAMPLE_QUERIES.map((query, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(query)}
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: 'clamp(12px, 1.5vw, 14px)',
                  color: '#a9bdb5',
                  backgroundColor: 'rgba(74,214,176,.08)',
                  border: '1px solid rgba(74,214,176,.2)',
                  borderRadius: '20px',
                  padding: 'clamp(8px, 1vh, 12px) clamp(12px, 1.5vw, 16px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(74,214,176,.15)';
                  e.currentTarget.style.color = '#e7f0ee';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(74,214,176,.08)';
                  e.currentTarget.style.color = '#a9bdb5';
                }}
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/search">
          <div
            className="vt-teal"
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(8px, 1vh, 12px)',
              height: 'auto',
              padding: '0 clamp(20px, 3.5vw, 36px)',
              borderRadius: 'clamp(18px, 1.8vw, 24px)',
              background: '#4ad6b0',
              color: '#04130f',
              fontWeight: 700,
              fontFamily: '"IBM Plex Mono", monospace',
              letterSpacing: '0.5px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              marginTop: 'clamp(24px, 3vh, 40px)',
            }}
          >
            <div
              style={{
                fontSize: 'clamp(12px, 1.5vw, 16px)',
                fontWeight: 700,
                paddingTop: 'clamp(8px, 1.5vh, 12px)',
                paddingBottom: 'clamp(4px, 0.8vh, 8px)',
              }}
            >
              SEARCH WESTERN BLOT EVIDENCE
            </div>
            <div
              style={{
                fontSize: 'clamp(10px, 1.2vw, 12px)',
                fontWeight: 500,
                color: '#04130f',
                opacity: 0.85,
                paddingBottom: 'clamp(8px, 1.5vh, 12px)',
              }}
            >
              Built for UCSF QBI Hackathon 2026
            </div>
          </div>
        </Link>

        {/* Stats Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(30px, 6vw, 80px)', marginTop: 'clamp(40px, 6vh, 80px)', width: '100%', maxWidth: '90vw' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(24px, 5vw, 44px)', fontWeight: 700, color: '#4ad6b0', marginBottom: 'clamp(4px, 1vh, 8px)' }}>12.4K+</div>
            <div style={{ fontSize: 'clamp(10px, 1.5vw, 13px)', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: 'clamp(0.6px, 0.3vw, 1px)' }}>EVIDENCE RECORDS EXTRACTED</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(24px, 5vw, 44px)', fontWeight: 700, color: '#e0a458', marginBottom: 'clamp(4px, 1vh, 8px)' }}>2,800+</div>
            <div style={{ fontSize: 'clamp(10px, 1.5vw, 13px)', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: 'clamp(0.6px, 0.3vw, 1px)' }}>SOURCE PAPERS INDEXED</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(24px, 5vw, 44px)', fontWeight: 700, color: '#a78bfa', marginBottom: 'clamp(4px, 1vh, 8px)' }}>520+</div>
            <div style={{ fontSize: 'clamp(10px, 1.5vw, 13px)', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: 'clamp(0.6px, 0.3vw, 1px)' }}>PROTEIN TARGETS COVERED</div>
          </div>
        </div>
      </section>
    </div>
  );
}
