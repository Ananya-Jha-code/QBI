import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { SearchInput } from './components/SearchInput';
import { ResultsTable } from './components/ResultsTable';
import { StatsBar } from './components/StatsBar';
import { FilterSidebar } from './components/FilterSidebar';
import { LandingPage } from './components/LandingPage';
import { MOCK_DATA } from './mockData';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCellLine, setSelectedCellLine] = useState('');
  const [selectedOrganism, setSelectedOrganism] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    // Simulate API delay
    setTimeout(() => {
      let results = MOCK_DATA.filter((item) => {
        const proteinMatch =
          item.protein.toLowerCase().includes(query.toLowerCase()) ||
          item.canonical_name?.toLowerCase().includes(query.toLowerCase());
        
        const cellLineMatch = !selectedCellLine || item.cell_line === selectedCellLine;
        const organismMatch = !selectedOrganism || item.organism === selectedOrganism;

        return proteinMatch && cellLineMatch && organismMatch;
      });

      setFilteredResults(results);
      setIsLoading(false);
    }, 300);
  };

  const handleCellLineChange = (cellLine) => {
    setSelectedCellLine(cellLine);
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleOrganismChange = (organism) => {
    setSelectedOrganism(organism);
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleLogoClick = () => {
    setSearchQuery('');
    setFilteredResults([]);
    setHasSearched(false);
    setSelectedCellLine('');
    setSelectedOrganism('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#06090c' }}>
      <Navigation onLogoClick={handleLogoClick} />

      {!hasSearched ? (
        <LandingPage onSearch={handleSearch} />
      ) : (
        <>
          <StatsBar
            totalResults={filteredResults.length}
            totalPapers={new Set(filteredResults.map((r) => r.paper_pmid)).size}
            query={searchQuery}
          />

          <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
            <FilterSidebar
              onCellLineChange={handleCellLineChange}
              onOrganismChange={handleOrganismChange}
              selectedCellLine={selectedCellLine}
              selectedOrganism={selectedOrganism}
            />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={{ padding: '24px 40px', borderBottom: '1px solid rgba(255,255,255,.08)', background: 'rgba(6,9,12,.3)' }}>
                <SearchInput
                  placeholder="Search for a protein (e.g., TP53, GAPDH, BRCA1)"
                  onSearch={handleSearch}
                />
              </div>

              <ResultsTable
                results={filteredResults}
                isLoading={isLoading}
                hasSearched={hasSearched}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
