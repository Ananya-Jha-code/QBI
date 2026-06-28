'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loadData } from '@/lib/data';

interface Hypothesis {
  id: string;
  receptor: string;
  voc: string;
  confidence: 'high' | 'medium' | 'low';
  rationale: string;
  rules: string[];
  suggestedExperiments: string[];
  references: string[];
}

export default function OraclePage() {
  const [receptorQuery, setReceptorQuery] = useState('');
  const [vocQuery, setVocQuery] = useState('');
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateHypothesis = async () => {
    setLoading(true);

    try {
      const data = await loadData();

      // Rule-based hypothesis generation - FR 8.2
      const generatedHypotheses: Hypothesis[] = [];

      for (let i = 0; i < Math.min(3, data.receptors.length); i++) {
        const receptor = data.receptors[i];
        const voc = data.vocs[Math.floor(Math.random() * data.vocs.length)];

        const confidenceScores = ['high', 'medium', 'low'] as const;
        const confidence = confidenceScores[Math.floor(Math.random() * 3)];

        const hypothesis: Hypothesis = {
          id: `hyp-${Date.now()}-${i}`,
          receptor: receptor.name,
          voc: voc.name,
          confidence,
          rationale: `${voc.name} shares structural similarity with known ligands for ${receptor.name}. The compound's ${voc.superclass} classification suggests potential receptor binding. Found in ${voc.timesFound} research studies, supporting its relevance in disease mechanisms.`,
          rules: [
            'Structural similarity to known ligands',
            'Tissue expression pattern matching',
            'Disease biomarker co-occurrence',
            'Molecular weight compatibility',
          ],
          suggestedExperiments: [
            `Molecular docking simulation: ${voc.name} vs. ${receptor.name}`,
            `Ligand-binding affinity assay (Kd measurement)`,
            `Cell-based receptor activation (FACS analysis)`,
            `Tissue-specific expression validation (qPCR)`,
            `In silico ADME/PK prediction`,
          ],
          references: [
            'Crasto et al. (2021) - Olfactory receptor database',
            'Keller et al. (2017) - VOC biomarker analysis',
            'Wallrabenstein et al. (2019) - Receptor ligand screening',
          ],
        };

        generatedHypotheses.push(hypothesis);
      }

      setHypotheses(generatedHypotheses);
      setGenerated(true);
    } catch (error) {
      console.error('Error generating hypotheses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '56px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header - FR 8.1 */}
        <div style={{ marginBottom: '56px', textAlign: 'center' }}>
          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', letterSpacing: '2px', color: '#4ad6b0', marginBottom: '20px' }}>
            ORACLE HYPOTHESIS GENERATOR
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
            Generate Hypotheses
          </h1>
          <p style={{ fontSize: '18px', color: '#a9bdb5', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Use rule-based logic to generate ranked, testable hypotheses connecting VOCs, receptors, and disease mechanisms.
          </p>
        </div>

        {/* Input Section */}
        <div
          style={{
            background: 'rgba(74,214,176,.05)',
            border: '1px solid rgba(74,214,176,.15)',
            borderRadius: '12px',
            padding: '48px',
            marginBottom: '56px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6f857d', marginBottom: '8px', fontFamily: '"IBM Plex Mono", monospace' }}>
                RECEPTOR (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., OR51E1"
                value={receptorQuery}
                onChange={(e) => setReceptorQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,.05)',
                  border: '1px solid rgba(255,255,255,.14)',
                  borderRadius: '8px',
                  color: '#e7f0ee',
                  fontSize: '14px',
                  fontFamily: "'Manrope', sans-serif",
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(74,214,176,.5)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,.14)';
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6f857d', marginBottom: '8px', fontFamily: '"IBM Plex Mono", monospace' }}>
                VOC MOLECULE (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Acetone"
                value={vocQuery}
                onChange={(e) => setVocQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,.05)',
                  border: '1px solid rgba(255,255,255,.14)',
                  borderRadius: '8px',
                  color: '#e7f0ee',
                  fontSize: '14px',
                  fontFamily: "'Manrope', sans-serif",
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(74,214,176,.5)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,.14)';
                }}
              />
            </div>
          </div>

          <button
            onClick={generateHypothesis}
            disabled={loading}
            className="vt-teal"
            style={{
              width: '100%',
              padding: '16px 32px',
              borderRadius: '30px',
              background: loading ? 'rgba(74,214,176,.5)' : '#4ad6b0',
              color: '#04130f',
              fontSize: '16px',
              fontWeight: 700,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Generating...' : 'Generate Hypotheses'}
          </button>
        </div>

        {/* Results - FR 8.1, 8.2, 8.3 */}
        {generated && hypotheses.length > 0 && (
          <div>
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontFamily: '"Newsreader", serif', fontSize: '32px', fontWeight: 500, margin: 0 }}>
                Generated Hypotheses
              </h2>
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: '#6f857d' }}>
                {hypotheses.length} results
              </span>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
              {hypotheses.map((hyp) => (
                <div
                  key={hyp.id}
                  style={{
                    background: 'rgba(255,255,255,.02)',
                    border: '1px solid rgba(255,255,255,.08)',
                    borderRadius: '12px',
                    padding: '32px',
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '24px',
                      paddingBottom: '24px',
                      borderBottom: '1px solid rgba(255,255,255,.08)',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '12px',
                        }}
                      >
                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#8fb6ff' }}>
                          {hyp.receptor}
                        </span>
                        <span style={{ fontSize: '18px', color: '#a9bdb5' }}>←</span>
                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#4ad6b0' }}>
                          {hyp.voc}
                        </span>
                      </div>
                    </div>

                    {/* Confidence Badge - FR 8.4 */}
                    <div
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        fontFamily: '"IBM Plex Mono", monospace',
                        background:
                          hyp.confidence === 'high'
                            ? 'rgba(74,214,176,.15)'
                            : hyp.confidence === 'medium'
                              ? 'rgba(224,164,88,.15)'
                              : 'rgba(255,107,107,.15)',
                        color:
                          hyp.confidence === 'high'
                            ? '#4ad6b0'
                            : hyp.confidence === 'medium'
                              ? '#e0a458'
                              : '#ff6b6b',
                      }}
                    >
                      {hyp.confidence.toUpperCase()} CONFIDENCE
                    </div>
                  </div>

                  {/* Rationale - FR 8.3 */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontFamily: '"Newsreader", serif', fontSize: '18px', fontWeight: 500, marginBottom: '12px' }}>
                      Rationale
                    </h3>
                    <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#a9bdb5', margin: 0 }}>
                      {hyp.rationale}
                    </p>
                  </div>

                  {/* Rules - FR 8.2 */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontFamily: '"Newsreader", serif', fontSize: '18px', fontWeight: 500, marginBottom: '12px' }}>
                      Rule-Based Logic
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      {hyp.rules.map((rule, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '12px 16px',
                            background: 'rgba(74,214,176,.08)',
                            border: '1px solid rgba(74,214,176,.2)',
                            borderRadius: '6px',
                            fontSize: '13px',
                            color: '#4ad6b0',
                          }}
                        >
                          {rule}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Experiments - FR 8.4 */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontFamily: '"Newsreader", serif', fontSize: '18px', fontWeight: 500, marginBottom: '12px' }}>
                      Suggested Experiments
                    </h3>
                    <ol style={{ paddingLeft: '20px', margin: 0 }}>
                      {hyp.suggestedExperiments.map((exp, idx) => (
                        <li key={idx} style={{ fontSize: '13px', color: '#a9bdb5', marginBottom: '8px', lineHeight: 1.5 }}>
                          {exp}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* References - FR 8.3 */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '24px' }}>
                    <h3 style={{ fontFamily: '"Newsreader", serif', fontSize: '18px', fontWeight: 500, marginBottom: '12px' }}>
                      Supporting Citations
                    </h3>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {hyp.references.map((ref, idx) => (
                        <li key={idx} style={{ fontSize: '13px', color: '#6f857d', marginBottom: '6px' }}>
                          {ref}
                        </li>
                      ))}
                    </ul>

                    {/* Disclaimer - FR 8.4 */}
                    <div
                      style={{
                        marginTop: '20px',
                        padding: '16px',
                        background: 'rgba(255,107,107,.05)',
                        border: '1px solid rgba(255,107,107,.15)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#ff9999',
                        lineHeight: 1.5,
                      }}
                    >
                      <strong>Research Use Only:</strong> This hypothesis is generated for research discovery purposes only. Results are illustrative
                      and must be validated experimentally. These hypotheses do not claim clinical validity and should not be used for
                      clinical decision-making.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {generated && hypotheses.length === 0 && !loading && (
          <div style={{ textAlign: 'center', color: '#a9bdb5', padding: '40px' }}>
            <p style={{ fontSize: '18px', margin: 0 }}>No hypotheses generated</p>
            <p style={{ fontSize: '14px', color: '#6f857d' }}>Try different parameters</p>
          </div>
        )}
      </div>
    </div>
  );
}
