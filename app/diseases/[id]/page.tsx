'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDiseaseById, searchVOCs, searchReceptors, Disease, VOC, Receptor } from '@/lib/data';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DiseaseDetailPage({ params }: PageProps) {
  const [disease, setDisease] = useState<Disease | null>(null);
  const [vocs, setVocs] = useState<VOC[]>([]);
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

      const diseaseData = await getDiseaseById(resolvedParams.id);
      setDisease(diseaseData);

      if (diseaseData) {
        // Get related VOCs and receptors
        const allVocs = await searchVOCs('');
        const allReceptors = await searchReceptors('');

        setVocs(allVocs.slice(0, 5));
        setReceptors(allReceptors.slice(0, 5));
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

  if (!disease) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#a9bdb5' }}>Disease not found</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '56px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <Link href="/diseases">
          <div style={{ fontSize: '13px', color: '#6f857d', marginBottom: '32px', cursor: 'pointer' }}>
            ← Back to Diseases
          </div>
        </Link>

        {/* Header - FR 5.1 */}
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
            {disease.name}
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
                VOC BIOMARKERS
              </div>
              <div style={{ fontSize: '24px', fontFamily: '"IBM Plex Mono", monospace', color: '#e0a458' }}>
                {disease.vocBiomarkers.length}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6f857d', marginBottom: '8px', fontFamily: '"IBM Plex Mono", monospace' }}>
                ASSOCIATED RECEPTORS
              </div>
              <div style={{ fontSize: '24px', fontFamily: '"IBM Plex Mono", monospace', color: '#8fb6ff' }}>
                {disease.receptors.length}
              </div>
            </div>
          </div>
        </div>

        {/* VOC Biomarkers - FR 5.1 */}
        {disease.vocBiomarkers.length > 0 && (
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
              VOC Biomarkers
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
              }}
            >
              {disease.vocBiomarkers.slice(0, 10).map((voc, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(224,164,88,.08)',
                    border: '1px solid rgba(224,164,88,.2)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#e0a458',
                    fontFamily: '"IBM Plex Mono", monospace',
                  }}
                >
                  {voc}
                </div>
              ))}
            </div>
            {disease.vocBiomarkers.length > 10 && (
              <div style={{ marginTop: '16px', fontSize: '12px', color: '#6f857d' }}>
                +{disease.vocBiomarkers.length - 10} more biomarkers
              </div>
            )}
          </div>
        )}

        {/* Associated Receptors - FR 5.1, 5.2 */}
        {receptors.length > 0 && (
          <div style={{ marginBottom: '56px' }}>
            <h2
              style={{
                fontFamily: '"Newsreader", serif',
                fontSize: '32px',
                fontWeight: 5,
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

        {/* Links to molecules - FR 5.2 */}
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
              Explore Related Molecules
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
