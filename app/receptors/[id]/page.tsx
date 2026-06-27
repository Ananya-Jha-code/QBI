'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getReceptorById, searchVOCs, searchDiseases, Receptor, VOC, Disease } from '@/lib/data';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ReceptorDetailPage({ params }: PageProps) {
  const [receptor, setReceptor] = useState<Receptor | null>(null);
  const [vocs, setVocs] = useState<VOC[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
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

      const receptorData = await getReceptorById(resolvedParams.id);
      setReceptor(receptorData);

      if (receptorData) {
        const allVocs = await searchVOCs('');
        const allDiseases = await searchDiseases('');

        setVocs(allVocs.slice(0, 8));
        setDiseases(allDiseases.slice(0, 5));
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

  if (!receptor) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#a9bdb5' }}>Receptor not found</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '56px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <Link href="/receptors">
          <div style={{ fontSize: '13px', color: '#6f857d', marginBottom: '32px', cursor: 'pointer' }}>
            ← Back to Receptors
          </div>
        </Link>

        {/* Header - FR 7.1 */}
        <div style={{ marginBottom: '56px' }}>
          <h1
            style={{
              fontFamily: '"Newsreader", serif',
              fontSize: '64px',
              fontWeight: 400,
              letterSpacing: '-1px',
              margin: '0 0 24px',
              color: '#8fb6ff',
            }}
          >
            {receptor.name}
          </h1>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
              borderTop: '1px solid rgba(255,255,255,.08)',
              paddingTop: '32px',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: '#6f857d', marginBottom: '8px', fontFamily: '"IBM Plex Mono", monospace' }}>
                RECEPTOR ID
              </div>
              <div style={{ fontSize: '18px', fontFamily: '"IBM Plex Mono", monospace' }}>
                {receptor.id.toUpperCase()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6f857d', marginBottom: '8px', fontFamily: '"IBM Plex Mono", monospace' }}>
                VOC LIGANDS
              </div>
              <div style={{ fontSize: '24px', fontFamily: '"IBM Plex Mono", monospace', color: '#4ad6b0' }}>
                {receptor.vocLigands.length}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6f857d', marginBottom: '8px', fontFamily: '"IBM Plex Mono", monospace' }}>
                ASSOCIATED DISEASES
              </div>
              <div style={{ fontSize: '24px', fontFamily: '"IBM Plex Mono", monospace', color: '#e0a458' }}>
                {receptor.diseases.length}
              </div>
            </div>
          </div>
        </div>

        {/* Tissue Expression - FR 7.1 */}
        {receptor.tissueExpression && receptor.tissueExpression.length > 0 && (
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
              Tissue Expression
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
              }}
            >
              {receptor.tissueExpression.map((tissue, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(143,182,255,.08)',
                    border: '1px solid rgba(143,182,255,.2)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#8fb6ff',
                  }}
                >
                  {tissue}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VOC Ligands - FR 7.1, 7.2 */}
        {receptor.vocLigands.length > 0 && (
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
              VOC Ligands
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
              }}
            >
              {receptor.vocLigands.slice(0, 12).map((voc, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(74,214,176,.08)',
                    border: '1px solid rgba(74,214,176,.2)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#4ad6b0',
                    fontFamily: '"IBM Plex Mono", monospace',
                  }}
                >
                  {voc}
                </div>
              ))}
            </div>
            {receptor.vocLigands.length > 12 && (
              <div style={{ marginTop: '16px', fontSize: '12px', color: '#6f857d' }}>
                +{receptor.vocLigands.length - 12} more ligands
              </div>
            )}
          </div>
        )}

        {/* Associated Diseases - FR 7.1, 7.2 */}
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
                      background: 'rgba(224,164,88,.04)',
                      border: '1px solid rgba(224,164,88,.2)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(224,164,88,.5)';
                      e.currentTarget.style.background = 'rgba(224,164,88,.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(224,164,88,.2)';
                      e.currentTarget.style.background = 'rgba(224,164,88,.04)';
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px', color: '#e0a458' }}>
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

        {/* Links to molecules - FR 7.2 */}
        {vocs.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '32px' }}>
            <h2
              style={{
                fontFamily: '"Newsreader", serif',
                fontSize: '24px',
                fontWeight: 500,
                marginBottom: '24px',
              }}
            >
              Explore Molecules
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
              }}
            >
              {vocs.map((voc) => (
                <Link key={voc.id} href={`/molecules/${voc.id}`}>
                  <div
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(74,214,176,.08)',
                      border: '1px solid rgba(74,214,176,.2)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '13px',
                      color: '#4ad6b0',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(74,214,176,.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(74,214,176,.08)';
                    }}
                  >
                    {voc.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
