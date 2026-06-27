'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Navigation() {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px 56px',
        borderBottom: '1px solid rgba(255,255,255,.07)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'rgba(6,9,12,.88)',
        backdropFilter: 'blur(14px)',
      }}
    >
      {/* Logo */}
      <Link href="/">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 32 32" style={{ width: '24px', height: '24px' }} xmlns="http://www.w3.org/2000/svg">
            <g stroke="#4ad6b0" strokeWidth="1.2" fill="none">
              <path d="M 8 8 L 12 5 L 16 8 L 16 14 L 12 17 L 8 14 Z" />
              <path d="M 12 14 L 16 11 L 20 14 L 20 20 L 16 23 L 12 20 Z" />
              <path d="M 16 20 L 20 17 L 24 20 L 24 26 L 20 29 L 16 26 Z" />
            </g>
            <circle cx="16" cy="16" r="1.5" fill="#4ad6b0" opacity="0.6" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <span
              style={{
                fontFamily: '"Newsreader", serif',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: '20px',
                letterSpacing: '-.3px',
                color: '#e7f0ee',
              }}
            >
              HiveBlot
            </span>
            <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', color: '#4ad6b0', letterSpacing: '.6px' }}>
              PROTEIN DISCOVERY
            </span>
          </div>
        </div>
      </Link>

      <div style={{ flex: 1 }} />

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '34px', marginRight: '36px' }}>
        <Link href="/search">
          <span className="vt-navlink" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12.5px', letterSpacing: '1.2px' }}>
            SEARCH
          </span>
        </Link>
        <Link href="/about">
          <span className="vt-navlink" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12.5px', letterSpacing: '1.2px' }}>
            ABOUT
          </span>
        </Link>
        <Link href="/learn">
          <span className="vt-navlink" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12.5px', letterSpacing: '1.2px' }}>
            LEARN
          </span>
        </Link>
      </div>

    </nav>
  );
}
