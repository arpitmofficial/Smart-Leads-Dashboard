import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { LeadStatus, LeadSource, LeadFilters } from '../../types';

interface LeadFiltersProps {
  filters: LeadFilters;
  onFilterChange: (filters: Partial<LeadFilters>) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const LeadFiltersComponent: React.FC<LeadFiltersProps> = ({
  filters,
  onFilterChange,
  searchValue,
  onSearchChange,
}) => {
  const hasActiveFilters = filters.status || filters.source || filters.sortBy !== 'latest';

  const clearFilters = () => {
    onFilterChange({ status: '', source: '', sortBy: 'latest', page: 1 });
    onSearchChange('');
  };

  const selectBase =
    'px-3 py-2.5 rounded-xl text-sm font-medium bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all cursor-pointer appearance-none';

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search leads by name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          id="lead-search-input"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-medium">Filters:</span>
        </div>

        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ status: (e.target.value as LeadStatus) || '', page: 1 })}
          className={selectBase}
          id="filter-status"
        >
          <option value="">All Statuses</option>
          {Object.values(LeadStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={filters.source || ''}
          onChange={(e) => onFilterChange({ source: (e.target.value as LeadSource) || '', page: 1 })}
          className={selectBase}
          id="filter-source"
        >
          <option value="">All Sources</option>
          {Object.values(LeadSource).map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>

        <select
          value={filters.sortBy || 'latest'}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as 'latest' | 'oldest', page: 1 })}
          className={selectBase}
          id="filter-sort"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-500/10 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export default LeadFiltersComponent;
