'use client';

import { useState } from 'react';

interface Figure {
  url: string;
  caption: string;
}

interface ResultsCardData {
  id: number;
  model: string;
  comparison: string;
  readout: string;
  control: string;
  result: string;
  experimentType: string;
  paper: string;
  doi: string;
  confidence: number;
  figures: Figure[];
}

interface ResultsCardProps {
  data: ResultsCardData;
}

export default function ResultsCard({ data }: ResultsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [currentFigureIndex, setCurrentFigureIndex] = useState(0);

  const currentFigure = data.figures[currentFigureIndex];

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
            {/* Model */}
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
                MODEL
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '14px',
                  color: '#e7f0ee',
                  lineHeight: 1.3,
                }}
              >
                {data.model}
              </div>
            </div>

            {/* Comparison */}
            <div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#6f857d',
                  marginBottom: '6px',
                  letterSpacing: '0.5px',
                }}
              >
                COMPARISON
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '16px',
                  color: '#e7f0ee',
                  lineHeight: 1.4,
                }}
              >
                {data.comparison}
              </div>
            </div>

            {/* Readout */}
            <div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#6f857d',
                  marginBottom: '6px',
                  letterSpacing: '0.5px',
                }}
              >
                READOUT
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '16px',
                  color: '#4ad6b0',
                  lineHeight: 1.4,
                }}
              >
                {data.readout}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Control */}
            <div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#6f857d',
                  marginBottom: '6px',
                  letterSpacing: '0.5px',
                }}
              >
                CONTROL
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '16px',
                  color: '#a9bdb5',
                  lineHeight: 1.4,
                }}
              >
                {data.control}
              </div>
            </div>

            {/* Experiment Type */}
            <div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#6f857d',
                  marginBottom: '6px',
                  letterSpacing: '0.5px',
                }}
              >
                EXPERIMENT TYPE
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '16px',
                  color: '#e7f0ee',
                  lineHeight: 1.4,
                }}
              >
                {data.experimentType}
              </div>
            </div>
          </div>
        </div>

        {/* Result */}
        <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6f857d',
              marginBottom: '8px',
              letterSpacing: '0.5px',
            }}
          >
            RESULT
          </div>
          <div
            style={{
              fontFamily: '"Newsreader", serif',
              fontSize: '15px',
              color: '#e7f0ee',
              lineHeight: 1.6,
            }}
          >
            {data.result}
          </div>
        </div>

        {/* Confidence */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '8px' }}>
          <div
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6f857d',
              letterSpacing: '0.5px',
            }}
          >
            CONFIDENCE
          </div>
          <div
            style={{
              fontFamily: '"Newsreader", serif',
              fontSize: '15px',
              color: '#4ad6b0',
              fontWeight: 600,
            }}
          >
            {(data.confidence * 100).toFixed(0)}%
          </div>
        </div>
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
          // Expanded view with figure carousel
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Figure Image */}
            <div
              style={{
                flex: 1,
                backgroundColor: '#000000',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '240px',
              }}
            >
              <img
                src={currentFigure.url}
                alt={currentFigure.caption}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Navigation & Info */}
            <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,.06)', backgroundColor: '#06090c' }}>
              {/* Figure Counter */}
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '9px',
                  fontWeight: 600,
                  color: '#4ad6b0',
                  marginBottom: '6px',
                  textAlign: 'center',
                  letterSpacing: '0.3px',
                }}
              >
                FIGURE {currentFigureIndex + 1} of {data.figures.length}
              </div>

              {/* Caption */}
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '11px',
                  color: '#a9bdb5',
                  lineHeight: 1.3,
                  marginBottom: '10px',
                  maxHeight: '50px',
                  overflow: 'auto',
                }}
              >
                {currentFigure.caption}
              </div>

              {/* Navigation Arrows */}
              {data.figures.length > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '6px',
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentFigureIndex((i) => (i - 1 + data.figures.length) % data.figures.length);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(74,214,176,.12)',
                      border: '1px solid rgba(74,214,176,.25)',
                      color: '#4ad6b0',
                      padding: '5px',
                      borderRadius: '3px',
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(74,214,176,.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(74,214,176,.12)';
                    }}
                  >
                    ←
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentFigureIndex((i) => (i + 1) % data.figures.length);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(74,214,176,.12)',
                      border: '1px solid rgba(74,214,176,.25)',
                      color: '#4ad6b0',
                      padding: '5px',
                      borderRadius: '3px',
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(74,214,176,.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(74,214,176,.12)';
                    }}
                  >
                    →
                  </button>
                </div>
              )}

              {/* DOI Link */}
              <div
                style={{
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255,255,255,.06)',
                }}
              >
                <div
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '9px',
                    fontWeight: 600,
                    color: '#6f857d',
                    marginBottom: '4px',
                    letterSpacing: '0.3px',
                  }}
                >
                  DOI
                </div>
                <a
                  href={`https://doi.org/${data.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '9px',
                    color: '#4ad6b0',
                    wordBreak: 'break-all',
                    textDecoration: 'none',
                    lineHeight: 1.2,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  {data.doi}
                </a>
              </div>
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
