'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchBar({ value, onChange, placeholder = 'Search...', onSearch }) {
  const [localValue, setLocalValue] = useState(value || '');
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedValue);
    } else if (onChange) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, onSearch]);

  const handleClear = () => {
    setLocalValue('');
    if (onSearch) onSearch('');
    if (onChange) onChange('');
  };

  return (
    <div className="relative">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
}
