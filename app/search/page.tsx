'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchInput } from '@/components/SearchInput';

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

interface SearchResponse {
  count: number;
  results: DatabaseResult[];
  question?: string;
}

const TABLE_COLUMNS: { key: keyof DatabaseResult; label: string }[] = [
  { key: 'paper_id', label: 'Paper ID' },
  { key: 'target', label: 'Target' },
  { key: 'sample', label: 'Sample' },
  { key: 'condition', label: 'Condition' },
  { key: 'western_blot_type', label: 'Blot Type' },
  { key: 'band_detected', label: 'Band Detected' },
  { key: 'organism', label: 'Organism' },
  { key: 'treatment_context', label: 'Treatment' },
  { key: 'figure_label', label: 'Figure' },
];

function CellValue({ col, result }: { col: keyof DatabaseResult; result: DatabaseResult }) {
  const value = result[col];
  if (col === 'band_detected') {
    return (
      <span style={{ color: value ? '#4ad6b0' : '#ff6b6b', fontWeight: 600 }}>
        {value ? 'Yes' : 'No'}
      </span>
    );
  }
  if (col === 'western_blot_type' && typeof value === 'string') {
    return <span>{value.replace(/_/g, ' ')}</span>;
  }
  if (value === null || value === undefined || value === '') {
    return <span style={{ color: '#3a504a' }}>—</span>;
  }
  return <span>{String(value)}</span>;
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [results, setResults] = useState<DatabaseResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) handleSearch(initialQuery);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    setResults([]);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) throw new Error('Search failed');

      const data: SearchResponse = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#06090c', fontFamily: "'Manrope', sans-serif" }}>
      {/* Search Bar */}
      <div style={{ padding: '40px 56px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <SearchInput
          placeholder="e.g. Show me all p53 western blots in A549 cells treated with Nutlin"
          onSearch={handleSearch}
          initialValue={initialQuery}
        />
      </div>

      {/* Results Section */}
      <div style={{ padding: '48px 56px' }}>
        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '80px 20px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#4ad6b0',
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: '#6f857d', letterSpacing: '1px' }}>
              QUERYING DATABASE...
            </div>
            <style>{`@keyframes pulse { 0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }`}</style>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ padding: '20px 24px', background: 'rgba(255,107,107,.08)', border: '1px solid rgba(255,107,107,.25)', borderRadius: '8px', color: '#ff6b6b', fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px' }}>
            Error: {error}
          </div>
        )}

        {/* Results Table */}
        {!loading && results.length > 0 && (
          <div>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', fontWeight: 600, color: '#4ad6b0', letterSpacing: '1px' }}>
                {results.length} RESULT{results.length !== 1 ? 'S' : ''}
              </span>
            </div>
            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(255,255,255,.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.03)' }}>
                    {TABLE_COLUMNS.map((col) => (
                      <th
                        key={col.key}
                        style={{
                          padding: '14px 16px',
                          textAlign: 'left',
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#6f857d',
                          letterSpacing: '0.8px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {col.label.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, idx) => (
                    <tr
                      key={result.id}
                      style={{
                        borderBottom: idx < results.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(74,214,176,.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)'; }}
                    >
                      {TABLE_COLUMNS.map((col) => (
                        <td
                          key={col.key}
                          style={{
                            padding: '14px 16px',
                            fontFamily: col.key === 'paper_id' ? '"IBM Plex Mono", monospace' : "'Manrope', sans-serif",
                            fontSize: col.key === 'paper_id' ? '12px' : '14px',
                            color: '#e7f0ee',
                            verticalAlign: 'middle',
                          }}
                        >
                          <CellValue col={col.key} result={result} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && searched && results.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6f857d' }}>
            <p style={{ fontFamily: '"Newsreader", serif', fontSize: '18px', lineHeight: 1.6 }}>No results found for your query.</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !searched && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6f857d' }}>
            <p style={{ fontFamily: '"Newsreader", serif', fontSize: '20px', lineHeight: 1.6 }}>
              Enter a natural language query to search western blot evidence.
            </p>
            <p style={{ fontFamily: '"Newsreader", serif', fontSize: '14px', marginTop: '12px', color: '#3a504a' }}>
              Example: &ldquo;Show me all p53 western blots in A549 cells treated with Nutlin&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  );
}
