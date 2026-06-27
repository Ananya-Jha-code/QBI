'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { searchReceptors, Receptor } from '@/lib/data';
import { SearchInput } from '@/components/SearchInput';

export default function ReceptorsPage() {
  const [receptors, setReceptors] = useState<Receptor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReceptors = async () => {
      const results = await searchReceptors('');
      setReceptors(results);
      setLoading(false);
    };
    loadReceptors();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      const results = await searchReceptors('');
      setReceptors(results);
      return;
    }
    const results = await searchReceptors(query);
    setReceptors(results);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '56px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header - FR 6.1 */}
        <div style={{ marginBottom: '56px', textAlign: 'center' }}>
          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', letterSpacing: '2px', color: '#4ad6b0', marginBottom: '20px' }}>
            RECEPTORS
          </div>
          <h1
            style={{
              fontFamily: '"Newsreader", serif',
              fontSize: '56px',
              fontWeight: 400,
              letterSpacing: '-1px',
              margin: '0 0 24px',
            }}
          >
            Olfactory Receptor Atlas
          </h1>
          <p style={{ fontSize: '18px', color: '#a9bdb5', margin: 0 }}>
            Search olfactory receptors and explore their ligand profiles and tissue expression
          </p>
        </div>

        {/* Search - FR 6.1, 6.2 */}
        <div style={{ marginBottom: '56px' }}>
          <SearchInput
            placeholder="Search by receptor name or ID..."
            onSearch={handleSearch}
          />
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#a9bdb5', padding: '40px' }}>
            Loading receptors...
          </div>
        ) : receptors.length === 0 ? (
          // FR 6.3: No results message
          <div style={{ textAlign: 'center', color: '#6f857d', padding: '40px' }}>
            <p style={{ fontSize: '18px', margin: 0 }}>No receptors found</p>
            <p style={{ fontSize: '14px', color: '#6f857d' }}>Try a different search term</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1px', border: '1px solid rgba(255,255,255,.08)' }}>
            {receptors.map((receptor) => (
              <Link key={receptor.id} href={`/receptors/${receptor.id}`}>
                <div
                  className="vt-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 200px 200px 200px 48px',
                    gap: '20px',
                    alignItems: 'center',
                    padding: '24px 32px',
                    background: 'rgba(255,255,255,.02)',
                    borderBottom: '1px solid rgba(255,255,255,.08)',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: '"Newsreader", serif', fontSize: '18px', fontWeight: 500, marginBottom: '4px', color: '#8fb6ff' }}>
                      {receptor.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6f857d', fontFamily: '"IBM Plex Mono", monospace' }}>
                      {receptor.id.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#a9bdb5', marginBottom: '4px' }}>Ligands</div>
                    <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: '#4ad6b0' }}>
                      {receptor.vocLigands.length} VOCs
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#a9bdb5', marginBottom: '4px' }}>Diseases</div>
                    <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: '#e0a458' }}>
                      {receptor.diseases.length}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#a9bdb5', marginBottom: '4px' }}>Tissues</div>
                    <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: '#a9bdb5' }}>
                      {receptor.tissueExpression?.length || 0}
                    </div>
                  </div>
                  <span className="vt-arrow" style={{ fontSize: '20px', justifySelf: 'end' }}>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
