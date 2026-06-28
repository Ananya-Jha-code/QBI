'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchInput } from '@/components/SearchInput';
import ResultsCard from '@/components/ResultsCard';
import DatabaseResultCard from '@/components/DatabaseResultCard';

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

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<DatabaseResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setShowResults(false);
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    setShowResults(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data: SearchResponse = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#06090c', paddingTop: '40px' }}>
      {/* Search Bar */}
      <div style={{ padding: '40px 56px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <SearchInput
          placeholder="Search for a protein or experimental condition (e.g., 'Show western blot evidence for phospho-TBK1 in p53 wild-type versus p53 knockout mouse embryonic fibroblasts.')"
          onSearch={handleSearch}
        />
      </div>

      {/* Results Section */}
      <div style={{ padding: '60px 56px', maxWidth: '1000px', margin: '0 auto' }}>
        {showResults ? (
          <div>
            {/* Results Header */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '16px', fontWeight: 600, color: '#4ad6b0' }}>RESULTS</span>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '16px', fontWeight: 600, color: '#6f857d' }}>-</span>
                <span style={{ fontFamily: '"Newsreader", serif', fontSize: '20px', fontWeight: 400, color: '#e7f0ee' }}>Western Blot Evidence</span>
              </div>
              <p style={{ fontFamily: '"Newsreader", serif', fontSize: '14px', color: '#a9bdb5', lineHeight: 1.6, marginTop: '12px' }}>
                {loading ? 'Searching database...' : `Found ${results.length} result${results.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontFamily: '"Newsreader", serif', fontSize: '16px', color: '#a9bdb5' }}>
                  Querying database...
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div
                style={{
                  padding: '24px',
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  borderRadius: '8px',
                  color: '#ff6b6b',
                  fontFamily: '"Newsreader", serif',
                  fontSize: '14px',
                  marginBottom: '40px',
                }}
              >
                Error: {error}
              </div>
            )}

            {/* Results Cards */}
            {!loading && results.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {results.map((result) => (
                  <DatabaseResultCard key={result.id} data={result} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && results.length === 0 && !error && (
              <div style={{ textAlign: 'center', paddingTop: '40px', color: '#a9bdb5' }}>
                <p style={{ fontFamily: '"Newsreader", serif', fontSize: '16px', lineHeight: 1.6 }}>
                  No results found for your query.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: '80px', color: '#a9bdb5' }}>
            <p style={{ fontFamily: '"Newsreader", serif', fontSize: '18px', lineHeight: 1.6 }}>
              Enter a natural language query to search for western blot evidence
            </p>
            <p style={{ fontFamily: '"Newsreader", serif', fontSize: '14px', marginTop: '12px', color: '#6f857d' }}>
              Example: "Show western blot evidence for phospho-TBK1 in p53 wild-type versus p53 knockout mouse embryonic fibroblasts."
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
