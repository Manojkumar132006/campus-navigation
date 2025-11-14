'use client';

import { useState } from 'react';
import { BuildingNode } from '@/types/campus';
import { getRoomsByBlock, getRoomsByFloor } from '@/lib/roomData';
import { FloorPlanViewer } from './FloorPlanViewer';
import floorPlansData from '@/config/floor-plans.json';
import { FloorPlan } from '@/types/floorplan';

interface BuildingDetailsProps {
  building: BuildingNode;
  onClose: () => void;
}

export function BuildingDetails({ building, onClose }: BuildingDetailsProps) {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<'list' | 'floorplan'>('list');
  
  const rooms = getRoomsByBlock(building.name);
  const hasRooms = rooms.length > 0;

  const floorRooms = selectedFloor !== null ? getRoomsByFloor(building.name, selectedFloor) : [];
  
  // Get floor plan for selected floor
  const floorPlans = (floorPlansData as any)[building.name] || {};
  const currentFloorPlan: FloorPlan | null = selectedFloor !== null ? floorPlans[selectedFloor] : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{building.emoji}</span>
            <div>
              <h2 className="text-xl font-bold">{building.name}</h2>
              <p className="text-blue-100 text-sm capitalize">{building.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors min-w-[44px] min-h-[44px]"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {building.description && (
            <p className="text-gray-600 mb-4">{building.description}</p>
          )}

          {hasRooms ? (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Floors: Ground + {building.floors} {building.floors === 1 ? 'floor' : 'floors'}
                </h3>
                <p className="text-sm text-gray-600">
                  Total Rooms: {rooms.length}
                </p>
              </div>

              {/* Floor Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Floor
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: (building.floors || 0) + 1 }, (_, i) => i).map((floor) => (
                    <button
                      key={floor}
                      onClick={() => setSelectedFloor(floor)}
                      className={`py-2 px-4 rounded-lg font-medium transition-colors min-h-[44px] ${
                        selectedFloor === floor
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {floor === 0 ? 'Ground' : `Floor ${floor}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode Toggle */}
              {selectedFloor !== null && (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors min-h-[44px] ${
                        viewMode === 'list'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      List View
                    </button>
                    <button
                      onClick={() => setViewMode('floorplan')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors min-h-[44px] ${
                        viewMode === 'floorplan'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      disabled={!currentFloorPlan}
                    >
                      Floor Plan {!currentFloorPlan && '(N/A)'}
                    </button>
                  </div>
                </div>
              )}

              {/* Room List View */}
              {selectedFloor !== null && viewMode === 'list' && (
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Rooms on {selectedFloor === 0 ? 'Ground Floor' : `Floor ${selectedFloor}`}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {floorRooms.map((room) => (
                      <button
                        key={room.roomNumber}
                        onClick={() => setSelectedRoom(room.roomNumber)}
                        className={`bg-gray-50 border rounded-lg p-3 text-center hover:bg-blue-50 hover:border-blue-300 transition-colors ${
                          selectedRoom === room.roomNumber
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{room.roomNumber}</div>
                        <div className="text-xs text-gray-500 mt-1">Room</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Floor Plan View */}
              {selectedFloor !== null && viewMode === 'floorplan' && currentFloorPlan && (
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Floor Plan - {selectedFloor === 0 ? 'Ground Floor' : `Floor ${selectedFloor}`}
                  </h4>
                  <div className="h-[500px] bg-gray-100 rounded-lg">
                    <FloorPlanViewer
                      floorPlan={currentFloorPlan}
                      selectedRoom={selectedRoom}
                      onRoomClick={setSelectedRoom}
                    />
                  </div>
                </div>
              )}

              {/* No Floor Plan Available */}
              {selectedFloor !== null && viewMode === 'floorplan' && !currentFloorPlan && (
                <div className="text-center py-8 text-gray-500">
                  <p>Floor plan not available for this floor</p>
                  <p className="text-sm mt-2">Add floor plan in config/floor-plans.json</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>This location has no rooms</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
