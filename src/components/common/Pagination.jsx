'use client';

import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

export default function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1 }) {
  const generatePages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - siblingCount);
    const end = Math.min(totalPages, currentPage + siblingCount);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (start > 1) {
      pages.unshift('...');
      pages.unshift(1);
    }
    if (end < totalPages) {
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FiChevronsLeft size={18} />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FiChevronLeft size={18} />
      </button>

      <div className="flex gap-1">
        {generatePages().map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`min-w-[36px] h-9 px-3 rounded-lg transition ${
              page === currentPage
                ? 'bg-purple-600 text-white'
                : page === '...'
                ? 'cursor-default hover:bg-transparent'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FiChevronRight size={18} />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FiChevronsRight size={18} />
      </button>
    </div>
  );
}
