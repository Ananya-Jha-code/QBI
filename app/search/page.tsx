'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SearchInput } from '@/components/SearchInput';

const MOCK_PROTEINS = [
  { name: 'TP53', canonical: 'Tumor protein p53', results: 847, papers: 312 },
  { name: 'EGFR', canonical: 'Epidermal growth factor receptor', results: 623, papers: 287 },
  { name: 'BRCA1', canonical: 'Breast cancer type 1 susceptibility protein', results: 456, papers: 198 },
  { name: 'AKT', canonical: 'RAC-alpha serine/threonine-protein kinase', results: 534, papers: 224 },
  { name: 'ERK', canonical: 'Extracellular signal-regulated kinase 1/2', results: 412, papers: 176 },
  { name: 'GAPDH', canonical: 'Glyceraldehyde 3-phosphate dehydrogenase', results: 1243, papers: 445 },
];

const MOCK_RESULTS = [
  { id: 1, protein: 'TP53', cellLine: 'HeLa', result: 'upregulated', condition: 'Doxorubicin 1μM, 24h', paper: '34567890', year: 2023, confidence: 0.92 },
  { id: 2, protein: 'TP53', cellLine: 'MCF-7', result: 'detected', condition: 'Untreated', paper: '34567891', year: 2023, confidence: 0.88 },
  { id: 3, protein: 'TP53', cellLine: 'HCT116', result: 'upregulated', condition: '5-FU treatment', paper: '34567892', year: 2022, confidence: 0.94 },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState('');

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim()) {
      setResults([]);
      setSearchedQuery('');
      return;
    }

    setLoading(true);
    setSearchedQuery(searchQuery);

    setTimeout(() => {
      const filtered = MOCK_RESULTS.filter(r =>
        r.protein.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 300);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#06090c', paddingTop: '40px' }}>
      {/* Search Bar */}
      <div style={{ padding: '40px 56px', borderBottom: '1px solid rgba(255,255,255,.07)', textAlign: 'center' }}>
        <SearchInput placeholder="Search for a protein (e.g., TP53, EGFR, BRCA1)" onSearch={handleSearch} />
      </div>

      {/* Results Section */}
      <div style={{ padding: '60px 56px', maxWidth: '1200px', margin: '0 auto' }}>
        {!searchedQuery ? (
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '40px' }}>Popular Proteins</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
              {MOCK_PROTEINS.map((protein) => (
                <div
                  key={protein.name}
                  className="vt-row"
                  style={{
                    padding: '24px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,.08)',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSearch(protein.name)}
                >
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#4ad6b0', marginBottom: '8px' }}>
                    {protein.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#a9bdb5', marginBottom: '16px', lineHeight: 1.5 }}>
                    {protein.canonical}
                  </div>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#6f857d' }}>
                    <span>{protein.results} results</span>
                    <span>•</span>
                    <span>{protein.papers} papers</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', paddingTop: '60px' }}>
            <div style={{ fontSize: '16px', color: '#a9bdb5' }}>Searching for {searchedQuery}...</div>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '12px' }}>
                {results.length} Results for "{searchedQuery}"
              </h2>
              <p style={{ color: '#a9bdb5' }}>
                Found {results.length} western blot records across {new Set(results.map(r => r.paper)).size} papers
              </p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace' }}>
                    CELL LINE
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace' }}>
                    RESULT
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace' }}>
                    CONDITION
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace' }}>
                    PAPER
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#a9bdb5', fontFamily: '"IBM Plex Mono", monospace' }}>
                    CONFIDENCE
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="vt-row" style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                    <td style={{ padding: '14px 12px', fontSize: '14px', fontWeight: 500 }}>
                      {result.cellLine}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '14px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: result.result === 'upregulated' ? '#e0a458' : '#4ad6b0',
                          color: '#04130f',
                        }}
                      >
                        {result.result}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#a9bdb5' }}>
                      {result.condition}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '13px' }}>
                      <Link href={`https://pubmed.ncbi.nlm.nih.gov/${result.paper}`} target="_blank">
                        <span style={{ color: '#4ad6b0', textDecoration: 'none', fontWeight: 500 }}>
                          {result.paper}
                        </span>
                      </Link>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', fontSize: '13px', color: '#a9bdb5' }}>
                      {(result.confidence * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: '60px' }}>
            <div style={{ fontSize: '16px', color: '#a9bdb5' }}>No results found for "{searchedQuery}"</div>
          </div>
        )}
      </div>
    </div>
  );
}
