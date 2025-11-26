'use client';

import { useState, useEffect } from 'react';
import { useRoomLabels } from '@/contexts/RoomLabelContext';
import { useRoomTags } from '@/contexts/RoomTagContext';
import { Tag, TagCategory } from '@/types/roomTags';

interface RoomTagEditorProps {
  building: string;
  floor: number;
  roomNumber: string;
  onClose: () => void;
}

type TabType = 'labels' | 'tags';

const SUGGESTED_LABELS = [
  'Club Office',
  'Study Room',
  'Hangout',
  'Meeting Room',
  'Lab',
  'Workshop',
  'Lounge',
  'Common Room'
];

export function RoomTagEditor({
  building,
  floor,
  roomNumber,
  onClose
}: RoomTagEditorProps) {
  const { getLabels, addLabel, removeLabel } = useRoomLabels();
  const {
    categories,
    tags,
    getRoomTags,
    applyTag,
    removeTag,
    createTag,
    getChildTags
  } = useRoomTags();

  const [activeTab, setActiveTab] = useState<TabType>('tags');
  const [existingLabels, setExistingLabels] = useState<string[]>([]);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const labels = getLabels(building, floor, roomNumber);
    setExistingLabels(labels);
    
    const roomTags = getRoomTags(building, floor, roomNumber);
    setExistingTags(roomTags);
  }, [building, floor, roomNumber, getLabels, getRoomTags]);

  // Label handlers
  const handleAddLabel = () => {
    setError('');
    setSuccess('');
    
    if (!newLabel.trim()) {
      setError('Label cannot be empty');
      return;
    }

    if (newLabel.length > 50) {
      setError('Label must be 1-50 characters');
      return;
    }

    if (existingLabels.includes(newLabel.trim())) {
      setError('Label already exists');
      return;
    }

    try {
      addLabel(building, floor, roomNumber, newLabel.trim());
      setExistingLabels([...existingLabels, newLabel.trim()]);
      setNewLabel('');
      setSuccess('Label added successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add label');
    }
  };

  const handleRemoveLabel = (label: string) => {
    try {
      removeLabel(building, floor, roomNumber, label);
      setExistingLabels(existingLabels.filter(l => l !== label));
      setSuccess('Label removed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove label');
    }
  };

  // Tag handlers
  const handleApplyTag = (tagId: string) => {
    setError('');
    setSuccess('');
    
    try {
      applyTag(building, floor, roomNumber, tagId);
      const updatedTags = getRoomTags(building, floor, roomNumber);
      setExistingTags(updatedTags);
      setSuccess('Tag applied successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply tag');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setError('');
    setSuccess('');
    
    try {
      removeTag(building, floor, roomNumber, tagId);
      setExistingTags(existingTags.filter(t => t.id !== tagId));
      setSuccess('Tag removed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove tag');
    }
  };

  const handleCreateCustomTag = () => {
    setError('');
    setSuccess('');
    
    if (!newTagName.trim()) {
      setError('Tag name cannot be empty');
      return;
    }

    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    try {
      const newTag = createTag(newTagName.trim(), selectedCategory);
      handleApplyTag(newTag.id);
      setNewTagName('');
      setSuccess('Custom tag created and applied');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tag');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  // Filter tags by search query and category
  const getFilteredTags = () => {
    let filtered = tags;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tag => 
        tag.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getTagsByCategory = (categoryId: string) => {
    return getFilteredTags().filter(tag => 
      tag.categoryId === categoryId && !tag.parentTagId
    );
  };

  const isTagApplied = (tagId: string) => {
    return existingTags.some(t => t.id === tagId);
  };

  const renderTagWithHierarchy = (tag: Tag, level: number = 0) => {
    const applied = isTagApplied(tag.id);
    const children = getChildTags(tag.id);

    return (
      <div key={tag.id} style={{ marginLeft: `${level * 20}px` }}>
        <button
          onClick={() => applied ? handleRemoveTag(tag.id) : handleApplyTag(tag.id)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors mb-1 ${
            applied
              ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          style={{
            borderLeft: `4px solid ${tag.color}`
          }}
          aria-pressed={applied}
          aria-label={`${applied ? 'Remove' : 'Apply'} ${tag.name} tag`}
        >
          <span className="flex items-center justify-between">
            <span>{tag.name}</span>
            {applied && <span className="text-xs">✓</span>}
          </span>
        </button>
        {children.map(child => renderTagWithHierarchy(child, level + 1))}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">Label & Tag Room</h2>
          <p className="text-sm text-gray-600 mt-1">
            {building} - Floor {floor} - Room {roomNumber}
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('tags')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'tags'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Structured Tags
            </button>
            <button
              onClick={() => setActiveTab('labels')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'labels'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quick Labels
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
              {success}
            </div>
          )}

          {/* Tags Tab */}
          {activeTab === 'tags' && (
            <div>
              {/* Applied Tags */}
              {existingTags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Applied Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {existingTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        style={{
                          backgroundColor: `${tag.color}20`,
                          color: tag.color,
                          border: `2px solid ${tag.color}`
                        }}
                      >
                        <span>{tag.name}</span>
                        <button
                          onClick={() => handleRemoveTag(tag.id)}
                          className="font-bold min-w-[20px] min-h-[20px] hover:opacity-70"
                          aria-label={`Remove ${tag.name}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Tags */}
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tags..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tag Categories */}
              <div className="space-y-4">
                {categories.map((category) => {
                  const categoryTags = getTagsByCategory(category.id);
                  if (categoryTags.length === 0) return null;

                  return (
                    <div key={category.id}>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </h3>
                      <div className="space-y-1">
                        {categoryTags.map(tag => renderTagWithHierarchy(tag))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Create Custom Tag */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Create Custom Tag</h3>
                <div className="flex gap-2 mb-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleCreateCustomTag)}
                    placeholder="Enter custom tag name..."
                    maxLength={50}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleCreateCustomTag}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Create & Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Labels Tab */}
          {activeTab === 'labels' && (
            <div>
              {/* Existing Labels */}
              {existingLabels.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Labels</h3>
                  <div className="flex flex-wrap gap-2">
                    {existingLabels.map((label, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        <span>{label}</span>
                        <button
                          onClick={() => handleRemoveLabel(label)}
                          className="text-blue-600 hover:text-blue-800 font-bold min-w-[20px] min-h-[20px]"
                          aria-label={`Remove ${label}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Label */}
              <div className="mb-4">
                <label htmlFor="newLabel" className="block text-sm font-semibold text-gray-700 mb-2">
                  Add New Label
                </label>
                <div className="flex gap-2">
                  <input
                    id="newLabel"
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAddLabel)}
                    placeholder="Enter label (max 50 characters)"
                    maxLength={50}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddLabel}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Suggested Labels */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Suggested Labels</h3>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_LABELS.map((label, index) => (
                    <button
                      key={index}
                      onClick={() => setNewLabel(label)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
