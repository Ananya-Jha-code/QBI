'use client';

import { useState } from 'react';

interface DatabaseResult {
  id: number;
  paper_id: string;
  page: number | null;
  western_blot_type: string;
  sample: string;
  organism: string | null;
  treatment_context: string | null;
  figure_label: string | null;
  target: string;
  condition: string;
  band_detected: boolean;
  confidence: number | null;
}

interface DatabaseResultCardProps {
  data: DatabaseResult;
}

export default function DatabaseResultCard({ data }: DatabaseResultCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: expanded ? '1fr 240px' : '1fr 56px',
        gap: '0',
        backgroundColor: 'rgba(255,255,255,.07)',
        borderRadius: '6px',
        overflow: 'hidden',
        transition: 'grid-template-columns 0.25s ease',
        border: '1px solid rgba(255,255,255,.06)',
      }}
    >
      {/* Main Content Area */}
      <div
        style={{
          backgroundColor: '#06090c',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Target */}
            <div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#6f857d',
                  marginBottom: '4px',
                  letterSpacing: '0.4px',
                }}
              >
                TARGET
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '14px',
                  color: '#4ad6b0',
                  lineHeight: 1.3,
                }}
              >
                {data.target}
              </div>
            </div>

            {/* Sample */}
            <div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#6f857d',
                  marginBottom: '4px',
                  letterSpacing: '0.4px',
                }}
              >
                SAMPLE
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '14px',
                  color: '#e7f0ee',
                  lineHeight: 1.3,
                }}
              >
                {data.sample}
              </div>
            </div>

            {/* Western Blot Type */}
            <div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#6f857d',
                  marginBottom: '4px',
                  letterSpacing: '0.4px',
                }}
              >
                BLOT TYPE
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '14px',
                  color: '#e7f0ee',
                  lineHeight: 1.3,
                }}
              >
                {data.western_blot_type.replace('_', ' / ')}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Condition */}
            <div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#6f857d',
                  marginBottom: '4px',
                  letterSpacing: '0.4px',
                }}
              >
                CONDITION
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '14px',
                  color: '#e7f0ee',
                  lineHeight: 1.3,
                }}
              >
                {data.condition}
              </div>
            </div>

            {/* Band Detected */}
            <div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#6f857d',
                  marginBottom: '4px',
                  letterSpacing: '0.4px',
                }}
              >
                BAND DETECTED
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '14px',
                  color: data.band_detected ? '#4ad6b0' : '#ff6b6b',
                  lineHeight: 1.3,
                  fontWeight: 600,
                }}
              >
                {data.band_detected ? '✓ Yes' : '✗ No'}
              </div>
            </div>

            {/* Paper ID */}
            <div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#6f857d',
                  marginBottom: '4px',
                  letterSpacing: '0.4px',
                }}
              >
                PAPER ID
              </div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '13px',
                  color: '#a9bdb5',
                  lineHeight: 1.3,
                }}
              >
                {data.paper_id}
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        {(data.organism || data.treatment_context || data.figure_label || data.page) && (
          <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {data.organism && (
                <div>
                  <span style={{ color: '#6f857d', fontSize: '10px', fontWeight: 600 }}>Organism: </span>
                  <span style={{ color: '#e7f0ee', fontSize: '12px' }}>{data.organism}</span>
                </div>
              )}
              {data.treatment_context && (
                <div>
                  <span style={{ color: '#6f857d', fontSize: '10px', fontWeight: 600 }}>Treatment: </span>
                  <span style={{ color: '#e7f0ee', fontSize: '12px' }}>{data.treatment_context}</span>
                </div>
              )}
              {data.figure_label && (
                <div>
                  <span style={{ color: '#6f857d', fontSize: '10px', fontWeight: 600 }}>Figure: </span>
                  <span style={{ color: '#e7f0ee', fontSize: '12px' }}>{data.figure_label}</span>
                </div>
              )}
              {data.page && (
                <div>
                  <span style={{ color: '#6f857d', fontSize: '10px', fontWeight: 600 }}>Page: </span>
                  <span style={{ color: '#e7f0ee', fontSize: '12px' }}>{data.page}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Citation Tab / Expanded Section */}
      <div
        style={{
          backgroundColor: '#0a0d0f',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid rgba(255,255,255,.06)',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          // Expanded view - placeholder for future figure data
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                fontFamily: '"Newsreader", serif',
                fontSize: '12px',
                color: '#a9bdb5',
                textAlign: 'center',
                padding: '20px',
              }}
            >
              Figure data coming soon
            </div>
          </div>
        ) : (
          // Collapsed view - Citation tab
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '8px',
            }}
          >
            <div
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '9px',
                fontWeight: 600,
                color: '#4ad6b0',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                letterSpacing: '0.8px',
              }}
            >
              CITATION
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
