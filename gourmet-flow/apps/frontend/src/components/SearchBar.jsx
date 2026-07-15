import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  return (
    <div className="bg-surface p-2 rounded-2xl shadow-xl border border-outline-variant/30 flex flex-col md:flex-row gap-2 max-w-xl">
      <div className="flex-1 flex items-center px-4 gap-3">
        <span className="material-symbols-outlined text-primary">location_on</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          className="w-full border-none focus:ring-0 font-body-md text-on-surface-variant bg-transparent"
          placeholder="Enter your delivery address..."
          type="text"
        />
      </div>
      <button onClick={handleSearch} className="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2">
        <span>Search Restaurants</span>
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
  );
}
