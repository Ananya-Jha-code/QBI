'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { searchVOCs, VOC } from '@/lib/data';
import { SearchInput } from '@/components/SearchInput';

export default function MoleculesPage() {
  const [vocs, setVocs] = useState<VOC[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVOCs = async () => {
      const results = await searchVOCs('');
      setVocs(results.slice(0, 50));
      setLoading(false);
    };
    loadVOCs();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      const results = await searchVOCs('');
      setVocs(results.slice(0, 50));
      return;
    }
    const results = await searchVOCs(query);
    setVocs(results);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '56px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header - FR 2.1 */}
        <div style={{ marginBottom: '56px', textAlign: 'center' }}>
          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', letterSpacing: '2px', color: '#4ad6b0', marginBottom: '20px' }}>
            MOLECULES
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
            Volatile Organic Compounds
          </h1>
          <p style={{ fontSize: '18px', color: '#a9bdb5', margin: 0 }}>
            Search and explore VOC molecules from our database
          </p>
        </div>

        {/* Search - FR 2.1, 2.2 */}
        <div style={{ marginBottom: '56px' }}>
          <SearchInput
            placeholder="Search by name, formula, or CAS number..."
            onSearch={handleSearch}
          />
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#a9bdb5', padding: '40px' }}>
            Loading molecules...
          </div>
        ) : vocs.length === 0 ? (
          // FR 2.3: No results message
          <div style={{ textAlign: 'center', color: '#6f857d', padding: '40px' }}>
            <p style={{ fontSize: '18px', margin: 0 }}>No molecules found</p>
            <p style={{ fontSize: '14px', color: '#6f857d' }}>Try a different search term</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1px', border: '1px solid rgba(255,255,255,.08)' }}>
            {vocs.map((voc) => (
              <Link key={voc.id} href={`/molecules/${voc.id}`}>
                <div
                  className="vt-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 150px 48px',
                    gap: '20px',
                    alignItems: 'center',
                    padding: '24px 32px',
                    background: 'rgba(255,255,255,.02)',
                    borderBottom: '1px solid rgba(255,255,255,.08)',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: '"Newsreader", serif', fontSize: '18px', fontWeight: 500, marginBottom: '4px' }}>
                      {voc.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6f857d', fontFamily: '"IBM Plex Mono", monospace' }}>
                      {voc.formula} · MW {voc.molecularWeight}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#a9bdb5', marginBottom: '4px' }}>Found in</div>
                    <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: '#4ad6b0' }}>
                      {voc.timesFound} studies
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#a9bdb5', marginBottom: '4px' }}>Class</div>
                    <div style={{ fontSize: '13px', color: '#e7f0ee' }}>{voc.class || '—'}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '12px', color: '#6f857d' }}>
                    {voc.cas}
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
