'use client';

import { useState } from 'react';

interface SearchInputProps {
  placeholder: string;
  onSearch: (query: string) => void;
  initialValue?: string;
}

export function SearchInput({ placeholder, onSearch, initialValue = '' }: SearchInputProps) {
  const [query, setQuery] = useState(initialValue);

  const submit = () => {
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div style={{ display: 'flex', width: '100%', maxWidth: '720px', margin: '0 auto', gap: '0' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        style={{
          flex: 1,
          padding: '16px 24px',
          background: 'rgba(255,255,255,.05)',
          border: '1px solid rgba(255,255,255,.14)',
          borderRight: 'none',
          borderRadius: '8px 0 0 8px',
          color: '#e7f0ee',
          fontSize: '16px',
          fontFamily: "'Manrope', sans-serif",
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(74,214,176,.5)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.14)'; }}
      />
      <button
        onClick={submit}
        style={{
          padding: '16px 28px',
          background: '#4ad6b0',
          border: 'none',
          borderRadius: '0 8px 8px 0',
          color: '#04130f',
          fontSize: '13px',
          fontWeight: 700,
          fontFamily: '"IBM Plex Mono", monospace',
          letterSpacing: '0.5px',
          cursor: 'pointer',
          transition: 'background 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#3bbf9d'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#4ad6b0'; }}
      >
        SEARCH
      </button>
    </div>
  );
}
