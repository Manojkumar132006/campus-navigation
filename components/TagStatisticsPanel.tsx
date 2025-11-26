'use client';

import { useState, useEffect } from 'react';
import { useRoomTags } from '@/contexts/RoomTagContext';
import { TagStatistic } from '@/types/roomTags';

interface TagStatisticsPanelProps {
  onTagClick?: (tagId: string) => void;
}

type SortField = 'name' | 'usage' | 'category';
type SortDirection = 'asc' | 'desc';

export function TagStatisticsPanel({ onTagClick }: TagStatisticsPanelProps) {
  const { getTagStatistics, categories, exportTags } = useRoomTags();
  const [statistics, setStatistics] = useState<TagStatistic[]>([]);
  const [sortField, setSortField] = useState<SortField>('usage');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterCategory, setFilterCategory] = useState<string>('');

  useEffect(() => {
    refreshStatistics();
  }, [getTagStatistics]);

  const refreshStatistics = () => {
    const stats = getTagStatistics();
    setStatistics(stats);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'usage' ? 'desc' : 'asc');
    }
  };

  const getSortedStatistics = (): TagStatistic[] => {
    let filtered = [...statistics];

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter(stat => stat.tag.categoryId === filterCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.tag.name.localeCompare(b.tag.name);
          break;
        case 'usage':
          comparison = a.usageCount - b.usageCount;
          break;
        case 'category':
          comparison = a.categoryName.localeCompare(b.categoryName);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const handleExport = () => {
    try {
      const data = exportTags();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `room-tags-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export tags:', error);
    }
  };

  const sortedStats = getSortedStatistics();
  const maxUsage = Math.max(...statistics.map(s => s.usageCount), 1);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Tag Statistics</h3>
        <button
          onClick={handleExport}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
          aria-label="Export tag statistics"
        >
          Export
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Category:
        </label>
        <select
          id="categoryFilter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2">
                <button
                  onClick={() => handleSort('name')}
                  className="font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1"
                >
                  Tag Name {getSortIcon('name')}
                </button>
              </th>
              <th className="text-left py-2 px-2">
                <button
                  onClick={() => handleSort('category')}
                  className="font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1"
                >
                  Category {getSortIcon('category')}
                </button>
              </th>
              <th className="text-right py-2 px-2">
                <button
                  onClick={() => handleSort('usage')}
                  className="font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1 ml-auto"
                >
                  Usage {getSortIcon('usage')}
                </button>
              </th>
              <th className="text-left py-2 px-2">
                <span className="font-semibold text-gray-700">Visual</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((stat) => {
              const barWidth = maxUsage > 0 ? (stat.usageCount / maxUsage) * 100 : 0;
              
              return (
                <tr
                  key={stat.tag.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  onClick={() => onTagClick && onTagClick(stat.tag.id)}
                  style={{ cursor: onTagClick ? 'pointer' : 'default' }}
                >
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stat.tag.color }}
                      />
                      <span className="font-medium">{stat.tag.name}</span>
                      {stat.tag.isSystem && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-1 rounded">
                          System
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-gray-600">
                    {stat.categoryName}
                  </td>
                  <td className="py-2 px-2 text-right font-semibold">
                    {stat.usageCount}
                  </td>
                  <td className="py-2 px-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: stat.tag.color
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {sortedStats.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">
            {filterCategory ? 'No tags in this category' : 'No tags available'}
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Total Tags:</span>
          <span className="font-semibold">{sortedStats.length}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Total Rooms Tagged:</span>
          <span className="font-semibold">
            {sortedStats.reduce((sum, stat) => sum + stat.usageCount, 0)}
          </span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Unused Tags:</span>
          <span className="font-semibold">
            {sortedStats.filter(stat => stat.usageCount === 0).length}
          </span>
        </div>
      </div>
    </div>
  );
}
