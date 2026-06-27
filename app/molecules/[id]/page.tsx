'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getVOCById, searchDiseases, searchReceptors, VOC, Disease, Receptor } from '@/lib/data';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MoleculeDetailPage({ params }: PageProps) {
  const [voc, setVoc] = useState<VOC | null>(null);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [receptors, setReceptors] = useState<Receptor[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const p = await params;
      setResolvedParams(p);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const loadData = async () => {
      if (!resolvedParams) return;

      const vocData = await getVOCById(resolvedParams.id);
      setVoc(vocData);

      if (vocData) {
        // Find related diseases and receptors
        const relatedDiseases = await searchDiseases('');
        const relatedReceptors = await searchReceptors('');

        setDiseases(relatedDiseases.slice(0, 3));
        setReceptors(relatedReceptors.slice(0, 3));
      }

      setLoading(false);
    };

    loadData();
  }, [resolvedParams]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#a9bdb5' }}>Loading...</div>
      </div>
    );
  }

  if (!voc) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#a9bdb5' }}>Molecule not found</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '56px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <Link href="/molecules">
          <div style={{ fontSize: '13px', color: '#6f857d', marginBottom: '32px', cursor: 'pointer' }}>
            ← Back to Molecules
          </div>
        </Link>

        {/* Header - FR 3.1 */}
        <div style={{ marginBottom: '56px' }}>
          <h1
            style={{
              fontFamily: '"Newsreader", serif',
              fontSize: '64px',
              fontWeight: 400,
              letterSpacing: '-1px',
              margin: '0 0 24px',
            }}
          >
            {voc.name}
          </h1>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '32px',
              borderTop: '1px solid rgba(255,255,255,.08)',
              paddingTop: '32px',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: '#6f857d', marginBottom: '8px', fontFamily: '"IBM Plex Mono", monospace' }}>
                CHEMICAL FORMULA
              </div>
              <div style={{ fontSize: '18px', fontFamily: '"IBM Plex Mono", monospace' }}>{voc.formula}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6f857d', marginBottom: '8px', fontFamily: '"IBM Plex Mono", monospace' }}>
                MOLECULAR WEIGHT
              </div>
              <div style={{ fontSize: '18px', fontFamily: '"IBM Plex Mono", monospace' }}>
                {voc.molecularWeight} g/mol
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6f857d', marginBottom: '8px', fontFamily: '"IBM Plex Mono", monospace' }}>
                CAS NUMBER
              </div>
              <div style={{ fontSize: '18px', fontFamily: '"IBM Plex Mono", monospace' }}>{voc.cas}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6f857d', marginBottom: '8px', fontFamily: '"IBM Plex Mono", monospace' }}>
                CLASSIFICATION
              </div>
              <div style={{ fontSize: '18px' }}>{voc.class}</div>
            </div>
          </div>
        </div>

        {/* Associated Diseases - FR 3.2 */}
        {diseases.length > 0 && (
          <div style={{ marginBottom: '56px' }}>
            <h2
              style={{
                fontFamily: '"Newsreader", serif',
                fontSize: '32px',
                fontWeight: 500,
                marginBottom: '24px',
                letterSpacing: '-.5px',
              }}
            >
              Associated Diseases
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              {diseases.map((disease) => (
                <Link key={disease.id} href={`/diseases/${disease.id}`}>
                  <div
                    style={{
                      padding: '24px',
                      background: 'rgba(74,214,176,.04)',
                      border: '1px solid rgba(74,214,176,.2)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(74,214,176,.5)';
                      e.currentTarget.style.background = 'rgba(74,214,176,.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(74,214,176,.2)';
                      e.currentTarget.style.background = 'rgba(74,214,176,.04)';
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
                      {disease.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6f857d' }}>
                      {disease.vocBiomarkers.length} biomarkers
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Associated Receptors - FR 3.2 */}
        {receptors.length > 0 && (
          <div style={{ marginBottom: '56px' }}>
            <h2
              style={{
                fontFamily: '"Newsreader", serif',
                fontSize: '32px',
                fontWeight: 500,
                marginBottom: '24px',
                letterSpacing: '-.5px',
              }}
            >
              Associated Receptors
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              {receptors.map((receptor) => (
                <Link key={receptor.id} href={`/receptors/${receptor.id}`}>
                  <div
                    style={{
                      padding: '24px',
                      background: 'rgba(143,182,255,.04)',
                      border: '1px solid rgba(143,182,255,.2)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(143,182,255,.5)';
                      e.currentTarget.style.background = 'rgba(143,182,255,.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(143,182,255,.2)';
                      e.currentTarget.style.background = 'rgba(143,182,255,.04)';
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px', color: '#8fb6ff' }}>
                      {receptor.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6f857d' }}>
                      {receptor.vocLigands.length} ligands
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Identifiers */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '32px' }}>
          <h2
            style={{
              fontFamily: '"Newsreader", serif',
              fontSize: '24px',
              fontWeight: 500,
              marginBottom: '24px',
            }}
          >
            Database References
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {voc.hmdbId && (
              <div>
                <div style={{ fontSize: '12px', color: '#6f857d', marginBottom: '8px' }}>HMDB ID</div>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px' }}>
                  {voc.hmdbId}
                </div>
              </div>
            )}
            {voc.pubchemId && (
              <div>
                <div style={{ fontSize: '12px', color: '#6f857d', marginBottom: '8px' }}>PubChem ID</div>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px' }}>
                  {voc.pubchemId}
                </div>
              </div>
            )}
            {voc.chebId && (
              <div>
                <div style={{ fontSize: '12px', color: '#6f857d', marginBottom: '8px' }}>ChEBI ID</div>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px' }}>
                  {voc.chebId}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
