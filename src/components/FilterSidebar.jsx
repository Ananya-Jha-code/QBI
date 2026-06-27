export function FilterSidebar({ onCellLineChange, onOrganismChange, selectedCellLine, selectedOrganism }) {
  const cellLines = ['HeLa', 'MCF-7', 'HCT116', 'U2OS', 'A549', 'HEK293', 'CHO', 'HepG2'];
  const organisms = ['Homo sapiens', 'Mus musculus', 'Rattus norvegicus', 'Drosophila melanogaster'];

  return (
    <div
      style={{
        width: '280px',
        borderRight: '1px solid rgba(255,255,255,.08)',
        padding: '24px',
        background: 'rgba(6,9,12,.2)',
      }}
    >
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#e7f0ee', marginBottom: '20px', textTransform: 'uppercase', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '1px' }}>
        Filters
      </h3>

      <div style={{ marginBottom: '32px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#a9bdb5', marginBottom: '12px', fontFamily: '"IBM Plex Mono", monospace' }}>
          Cell Line
        </label>
        <select
          value={selectedCellLine}
          onChange={(e) => onCellLineChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'rgba(255,255,255,.04)',
            border: '1px solid rgba(255,255,255,.12)',
            borderRadius: '6px',
            color: '#e7f0ee',
            fontSize: '14px',
            fontFamily: 'Manrope, sans-serif',
            outline: 'none',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(74,214,176,.5)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)';
          }}
        >
          <option value="">All cell lines</option>
          {cellLines.map((line) => (
            <option key={line} value={line} style={{ background: '#06090c', color: '#e7f0ee' }}>
              {line}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', color: '#a9bdb5', marginBottom: '12px', fontFamily: '"IBM Plex Mono", monospace' }}>
          Organism
        </label>
        <select
          value={selectedOrganism}
          onChange={(e) => onOrganismChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'rgba(255,255,255,.04)',
            border: '1px solid rgba(255,255,255,.12)',
            borderRadius: '6px',
            color: '#e7f0ee',
            fontSize: '14px',
            fontFamily: 'Manrope, sans-serif',
            outline: 'none',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(74,214,176,.5)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)';
          }}
        >
          <option value="">All organisms</option>
          {organisms.map((org) => (
            <option key={org} value={org} style={{ background: '#06090c', color: '#e7f0ee' }}>
              {org}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
