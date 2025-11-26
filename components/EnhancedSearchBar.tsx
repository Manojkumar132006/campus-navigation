'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchResult } from '@/types/hoodmapsStyle';
import { EnhancedSearchService } from '@/lib/enhancedSearchService';

interface EnhancedSearchBarProps {
  searchService: EnhancedSearchService;
  onResultSelect: (result: SearchResult) => void;
}

export function EnhancedSearchBar({
  searchService,
  onResultSelect
}: EnhancedSearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      const searchResults = searchService.search(query);
      setResults(searchResults);
      setIsOpen(true);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchService]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleSelectResult = (result: SearchResult) => {
    onResultSelect(result);
    setIsOpen(false);
    setQuery('');
  };

  const buildingResults = results.filter(r => r.type === 'building');
  const roomResults = results.filter(r => r.type === 'room');

  const highlightMatch = (text: string, query: string) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.substring(0, index)}
        <span className="bg-yellow-200 font-semibold">
          {text.substring(index, index + query.length)}
        </span>
        {text.substring(index + query.length)}
      </>
    );
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search buildings, room labels, or tags..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px]"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No buildings or rooms match &apos;{query}&apos;</p>
            </div>
          ) : (
            <>
              {/* Building Results */}
              {buildingResults.length > 0 && (
                <div className="border-b border-gray-200">
                  <div className="px-4 py-2 bg-gray-50">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase">Buildings</h3>
                  </div>
                  {buildingResults.map((result, index) => (
                    <button
                      key={`building-${index}`}
                      onClick={() => handleSelectResult(result)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 min-h-[44px]"
                    >
                      <span className="text-2xl">🏢</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {highlightMatch(result.name, query)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Room Results */}
              {roomResults.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase">Rooms</h3>
                  </div>
                  {roomResults.map((result, index) => (
                    <button
                      key={`room-${index}`}
                      onClick={() => handleSelectResult(result)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 min-h-[44px]"
                    >
                      <span className="text-2xl">🚪</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {highlightMatch(result.name, query)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {result.building} - Floor {result.floor} - Room {result.roomNumber}
                        </p>
                        {/* Labels */}
                        {result.labels && result.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.labels.map((label, i) => (
                              <span
                                key={`label-${i}`}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Tags */}
                        {result.tags && result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="text-xs px-2 py-0.5 rounded"
                                style={{
                                  backgroundColor: `${tag.color}20`,
                                  color: tag.color,
                                  border: `1px solid ${tag.color}`
                                }}
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
