'use client';

import { useState } from 'react';

interface SearchInputProps {
  placeholder: string;
  onSearch: (query: string) => void;
}

export function SearchInput({ placeholder, onSearch }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div style={{ display: 'flex', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        style={{
          flex: 1,
          padding: '16px 24px',
          background: 'rgba(255,255,255,.05)',
          border: '1px solid rgba(255,255,255,.14)',
          borderRadius: '8px',
          color: '#e7f0ee',
          fontSize: '16px',
          fontFamily: "'Manrope', sans-serif",
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(74,214,176,.5)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,.14)';
        }}
      />
    </div>
  );
}
