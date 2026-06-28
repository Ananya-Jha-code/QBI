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

interface ResultsTableProps {
  results: DatabaseResult[];
}

export default function ResultsTable({ results }: ResultsTableProps) {
  return (
    <div style={{ overflowX: 'auto', marginTop: '24px' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
          fontFamily: '"Newsreader", serif',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '2px solid rgba(74,214,176,.3)' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#4ad6b0', fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px' }}>TARGET</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#4ad6b0', fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px' }}>SAMPLE</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#4ad6b0', fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px' }}>CONDITION</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#4ad6b0', fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px' }}>TYPE</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#4ad6b0', fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px' }}>DETECTED</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#4ad6b0', fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px' }}>PAPER</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr
              key={result.id}
              style={{
                borderBottom: '1px solid rgba(255,255,255,.06)',
                backgroundColor: index % 2 === 0 ? 'rgba(74,214,176,.02)' : 'transparent',
              }}
            >
              <td style={{ padding: '12px', color: '#4ad6b0', fontWeight: 600 }}>
                {result.target}
              </td>
              <td style={{ padding: '12px', color: '#e7f0ee' }}>
                {result.sample}
              </td>
              <td style={{ padding: '12px', color: '#e7f0ee', maxWidth: '200px', wordBreak: 'break-word' }}>
                {result.condition}
              </td>
              <td style={{ padding: '12px', color: '#a9bdb5', fontSize: '13px' }}>
                {result.western_blot_type.replace(/_/g, ' / ')}
              </td>
              <td style={{ padding: '12px', textAlign: 'center', color: result.band_detected ? '#4ad6b0' : '#ff6b6b', fontWeight: 600 }}>
                {result.band_detected ? '✓' : '✗'}
              </td>
              <td style={{ padding: '12px', color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px' }}>
                {result.paper_id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
