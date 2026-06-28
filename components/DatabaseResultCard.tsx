'use client';

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
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1px',
        backgroundColor: 'rgba(255,255,255,.08)',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Main Content Area */}
      <div
        style={{
          backgroundColor: '#06090c',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Target */}
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
                TARGET
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '16px',
                  color: '#4ad6b0',
                  lineHeight: 1.4,
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
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#6f857d',
                  marginBottom: '6px',
                  letterSpacing: '0.5px',
                }}
              >
                SAMPLE
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '16px',
                  color: '#e7f0ee',
                  lineHeight: 1.4,
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
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#6f857d',
                  marginBottom: '6px',
                  letterSpacing: '0.5px',
                }}
              >
                BLOT TYPE
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '16px',
                  color: '#e7f0ee',
                  lineHeight: 1.4,
                }}
              >
                {data.western_blot_type.replace('_', ' / ')}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Condition */}
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
                CONDITION
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '16px',
                  color: '#e7f0ee',
                  lineHeight: 1.4,
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
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#6f857d',
                  marginBottom: '6px',
                  letterSpacing: '0.5px',
                }}
              >
                BAND DETECTED
              </div>
              <div
                style={{
                  fontFamily: '"Newsreader", serif',
                  fontSize: '16px',
                  color: data.band_detected ? '#4ad6b0' : '#ff6b6b',
                  lineHeight: 1.4,
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
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#6f857d',
                  marginBottom: '6px',
                  letterSpacing: '0.5px',
                }}
              >
                PAPER ID
              </div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '14px',
                  color: '#a9bdb5',
                  lineHeight: 1.4,
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
              ADDITIONAL INFO
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {data.organism && (
                <div>
                  <span style={{ color: '#6f857d', fontSize: '11px' }}>Organism: </span>
                  <span style={{ color: '#e7f0ee', fontSize: '13px' }}>{data.organism}</span>
                </div>
              )}
              {data.treatment_context && (
                <div>
                  <span style={{ color: '#6f857d', fontSize: '11px' }}>Treatment: </span>
                  <span style={{ color: '#e7f0ee', fontSize: '13px' }}>{data.treatment_context}</span>
                </div>
              )}
              {data.figure_label && (
                <div>
                  <span style={{ color: '#6f857d', fontSize: '11px' }}>Figure: </span>
                  <span style={{ color: '#e7f0ee', fontSize: '13px' }}>{data.figure_label}</span>
                </div>
              )}
              {data.page && (
                <div>
                  <span style={{ color: '#6f857d', fontSize: '11px' }}>Page: </span>
                  <span style={{ color: '#e7f0ee', fontSize: '13px' }}>{data.page}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
