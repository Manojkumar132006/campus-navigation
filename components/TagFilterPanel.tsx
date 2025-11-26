'use client';

import { useState, useEffect } from 'react';
import { useRoomTags } from '@/contexts/RoomTagContext';
import { Tag, TagCategory } from '@/types/roomTags';

interface TagFilterPanelProps {
  onFilterChange: (selectedTagIds: string[]) => void;
  matchAll?: boolean;
  onMatchAllChange?: (matchAll: boolean) => void;
}

export function TagFilterPanel({
  onFilterChange,
  matchAll = true,
  onMatchAllChange
}: TagFilterPanelProps) {
  const { categories, tags } = useRoomTags();
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());
  const [isMatchAll, setIsMatchAll] = useState(matchAll);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    onFilterChange(Array.from(selectedTagIds));
  }, [selectedTagIds, onFilterChange]);

  const handleTagToggle = (tagId: string) => {
    const newSelected = new Set(selectedTagIds);
    if (newSelected.has(tagId)) {
      newSelected.delete(tagId);
    } else {
      newSelected.add(tagId);
    }
    setSelectedTagIds(newSelected);
  };

  const handleMatchAllToggle = () => {
    const newValue = !isMatchAll;
    setIsMatchAll(newValue);
    if (onMatchAllChange) {
      onMatchAllChange(newValue);
    }
  };

  const handleClearAll = () => {
    setSelectedTagIds(new Set());
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getTagsByCategory = (categoryId: string): Tag[] => {
    return tags.filter(tag => tag.categoryId === categoryId);
  };

  const getCategoryTagCount = (categoryId: string): number => {
    const categoryTags = getTagsByCategory(categoryId);
    return categoryTags.filter(tag => selectedTagIds.has(tag.id)).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Filter by Tags</h3>
        {selectedTagIds.size > 0 && (
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {selectedTagIds.size}
          </span>
        )}
      </div>

      {/* Match All/Any Toggle */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Filter Mode:</span>
          <button
            onClick={handleMatchAllToggle}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              isMatchAll
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            aria-pressed={isMatchAll}
            aria-label={`Switch to ${isMatchAll ? 'Match Any' : 'Match All'} mode`}
          >
            {isMatchAll ? 'Match All (AND)' : 'Match Any (OR)'}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {isMatchAll
            ? 'Show rooms that have ALL selected tags'
            : 'Show rooms that have ANY selected tag'}
        </p>
      </div>

      {/* Clear All Button */}
      {selectedTagIds.size > 0 && (
        <button
          onClick={handleClearAll}
          className="w-full mb-4 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition-colors"
        >
          Clear All Filters
        </button>
      )}

      {/* Category Filters */}
      <div className="space-y-2">
        {categories.map((category) => {
          const categoryTags = getTagsByCategory(category.id);
          if (categoryTags.length === 0) return null;

          const isExpanded = expandedCategories.has(category.id);
          const selectedCount = getCategoryTagCount(category.id);

          return (
            <div key={category.id} className="border border-gray-200 rounded-md">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
                aria-expanded={isExpanded}
                aria-controls={`category-${category.id}`}
              >
                <div className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span className="font-medium text-gray-900">{category.name}</span>
                  {selectedCount > 0 && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      {selectedCount}
                    </span>
                  )}
                </div>
                <span className="text-gray-500">
                  {isExpanded ? '▼' : '▶'}
                </span>
              </button>

              {/* Category Tags */}
              {isExpanded && (
                <div
                  id={`category-${category.id}`}
                  className="px-3 py-2 space-y-1 bg-gray-50"
                >
                  {categoryTags.map((tag) => {
                    const isSelected = selectedTagIds.has(tag.id);
                    return (
                      <label
                        key={tag.id}
                        className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleTagToggle(tag.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          aria-label={`Filter by ${tag.name}`}
                        />
                        <span
                          className="flex-1 text-sm"
                          style={{ color: isSelected ? tag.color : 'inherit' }}
                        >
                          {tag.name}
                        </span>
                        {isSelected && (
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No tag categories available</p>
        </div>
      )}

      {/* Active Filters Summary */}
      {selectedTagIds.size > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-1">
            {Array.from(selectedTagIds).map((tagId) => {
              const tag = tags.find(t => t.id === tagId);
              if (!tag) return null;
              return (
                <span
                  key={tagId}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                    border: `1px solid ${tag.color}`
                  }}
                >
                  {tag.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
