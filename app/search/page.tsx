'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SearchInput } from '@/components/SearchInput';
import ResultsCard from '@/components/ResultsCard';

// Hardcoded results data
const HARDCODED_RESULTS = [
  {
    id: 1,
    model: 'mouse embryonic fibroblasts',
    comparison: 'p53 WT vs knockout',
    readout: 'phospho-TBK1',
    control: 'total TBK1 / actin',
    result: 'phosphorylation detected in WT, absent or reduced in KO',
    experimentType: 'activity/PTM western',
    paper: 'Smith et al. (2023)',
    doi: '10.1038/s41586-023-06000-0',
    confidence: 0.94,
    figures: [
      { url: 'https://images.unsplash.com/photo-1601884521474-46f369d821ce?w=600&h=400&fit=crop', caption: 'Figure 2A: Western blot analysis of phospho-TBK1 in p53 WT vs KO MEFs' },
      { url: 'https://images.unsplash.com/photo-1611234185478-0058bdd6d5dd?w=600&h=400&fit=crop', caption: 'Figure 2B: Quantification of phospho-TBK1 levels' },
      { url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop', caption: 'Figure 2C: Loading control analysis' },
    ],
  },
  {
    id: 2,
    model: 'HEK293T cells',
    comparison: 'WT vs TBK1 knockout',
    readout: 'phospho-IRF3',
    control: 'total IRF3 / β-actin',
    result: 'IRF3 phosphorylation abolished in KO',
    experimentType: 'signaling western',
    paper: 'Johnson et al. (2023)',
    doi: '10.1038/s41467-023-40000-0',
    confidence: 0.91,
    figures: [
      { url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=400&fit=crop', caption: 'Figure 3A: IRF3 phosphorylation in TBK1 WT vs KO' },
    ],
  },
  {
    id: 3,
    model: 'primary mouse keratinocytes',
    comparison: 'control vs LPS stimulation',
    readout: 'phospho-p38',
    control: 'total p38 / vinculin',
    result: 'robust p38 phosphorylation upon LPS',
    experimentType: 'kinase activation western',
    paper: 'Chen et al. (2023)',
    doi: '10.1126/science.aaw0129',
    confidence: 0.88,
    figures: [
      { url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=400&fit=crop', caption: 'Figure 4: p38 phosphorylation timecourse' },
      { url: 'https://images.unsplash.com/photo-1601884521474-46f369d821ce?w=600&h=400&fit=crop', caption: 'Figure S1: Replicate data' },
    ],
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      setShowResults(true);
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
                <span style={{ fontFamily: '"Newsreader", serif', fontSize: '20px', fontWeight: 400, color: '#e7f0ee' }}>Protein in Cell</span>
              </div>
              <p style={{ fontFamily: '"Newsreader", serif', fontSize: '14px', color: '#a9bdb5', lineHeight: 1.6, marginTop: '12px' }}>
                Showing {HARDCODED_RESULTS.length} hardcoded results for demonstration
              </p>
            </div>

            {/* Results Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {HARDCODED_RESULTS.map((result) => (
                <ResultsCard key={result.id} data={result} />
              ))}
            </div>
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
