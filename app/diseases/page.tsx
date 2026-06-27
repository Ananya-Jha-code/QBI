'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { searchDiseases, Disease } from '@/lib/data';
import { SearchInput } from '@/components/SearchInput';

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDiseases = async () => {
      const results = await searchDiseases('');
      setDiseases(results);
      setLoading(false);
    };
    loadDiseases();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      const results = await searchDiseases('');
      setDiseases(results);
      return;
    }
    const results = await searchDiseases(query);
    setDiseases(results);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '56px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header - FR 4.1 */}
        <div style={{ marginBottom: '56px', textAlign: 'center' }}>
          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', letterSpacing: '2px', color: '#4ad6b0', marginBottom: '20px' }}>
            DISEASES
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
            Disease Explorer
          </h1>
          <p style={{ fontSize: '18px', color: '#a9bdb5', margin: 0 }}>
            Search diseases and explore VOC biomarker associations
          </p>
        </div>

        {/* Search - FR 4.1, 4.2 */}
        <div style={{ marginBottom: '56px' }}>
          <SearchInput
            placeholder="Search by disease name..."
            onSearch={handleSearch}
          />
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#a9bdb5', padding: '40px' }}>
            Loading diseases...
          </div>
        ) : diseases.length === 0 ? (
          // FR 4.3: No results message
          <div style={{ textAlign: 'center', color: '#6f857d', padding: '40px' }}>
            <p style={{ fontSize: '18px', margin: 0 }}>No diseases found</p>
            <p style={{ fontSize: '14px', color: '#6f857d' }}>Try a different search term</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1px', border: '1px solid rgba(255,255,255,.08)' }}>
            {diseases.map((disease) => (
              <Link key={disease.id} href={`/diseases/${disease.id}`}>
                <div
                  className="vt-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 200px 200px 48px',
                    gap: '20px',
                    alignItems: 'center',
                    padding: '24px 32px',
                    background: 'rgba(255,255,255,.02)',
                    borderBottom: '1px solid rgba(255,255,255,.08)',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: '"Newsreader", serif', fontSize: '18px', fontWeight: 500, marginBottom: '4px' }}>
                      {disease.name}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#a9bdb5', marginBottom: '4px' }}>Biomarkers</div>
                    <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: '#e0a458' }}>
                      {disease.vocBiomarkers.length} VOCs
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#a9bdb5', marginBottom: '4px' }}>Receptors</div>
                    <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: '#8fb6ff' }}>
                      {disease.receptors.length} receptors
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
