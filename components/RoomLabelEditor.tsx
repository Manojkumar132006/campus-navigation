'use client';

import { useState, useEffect } from 'react';
import { useRoomLabels } from '@/contexts/RoomLabelContext';

interface RoomLabelEditorProps {
  building: string;
  floor: number;
  roomNumber: string;
  onClose: () => void;
}

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

export function RoomLabelEditor({
  building,
  floor,
  roomNumber,
  onClose
}: RoomLabelEditorProps) {
  const { getLabels, addLabel, removeLabel } = useRoomLabels();
  const [existingLabels, setExistingLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const labels = getLabels(building, floor, roomNumber);
    setExistingLabels(labels);
  }, [building, floor, roomNumber, getLabels]);

  const handleAddLabel = () => {
    setError('');
    
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add label');
    }
  };

  const handleRemoveLabel = (label: string) => {
    try {
      removeLabel(building, floor, roomNumber, label);
      setExistingLabels(existingLabels.filter(l => l !== label));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove label');
    }
  };

  const handleSuggestedLabel = (label: string) => {
    setNewLabel(label);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddLabel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Label Room</h2>
          <p className="text-sm text-gray-600 mt-1">
            {building} - Floor {floor} - Room {roomNumber}
          </p>
        </div>

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
              onKeyPress={handleKeyPress}
              placeholder="Enter label (max 50 characters)"
              maxLength={50}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddLabel}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors min-w-[44px] min-h-[44px]"
            >
              Add
            </button>
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-1">{error}</p>
          )}
        </div>

        {/* Suggested Labels */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Suggested Labels</h3>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_LABELS.map((label, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedLabel(label)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors min-h-[32px]"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium transition-colors min-w-[44px] min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
