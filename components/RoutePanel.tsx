'use client';

import { useState } from 'react';
import { RouteResult } from '@/types/campus';
import { RoomToRoomRoute } from '@/types/navigation';
import { RoomSelector } from './RoomSelector';

interface RoutePanelProps {
  buildings: string[];
  onRouteRequest: (start: string, end: string) => void;
  onRoomRouteRequest: (startRoom: string, endRoom: string) => void;
  route?: RouteResult | null;
  roomRoute?: RoomToRoomRoute | null;
}

export function RoutePanel({ 
  buildings, 
  onRouteRequest, 
  onRoomRouteRequest, 
  route, 
  roomRoute 
}: RoutePanelProps) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState('');

  const handleGetDirections = () => {
    setError('');

    if (!start || !end) {
      setError('Please enter both start and end locations');
      return;
    }

    if (start.trim().toLowerCase() === end.trim().toLowerCase()) {
      setError('Start and end locations must be different');
      return;
    }

    // Use unified room navigation for all locations
    onRoomRouteRequest(start.trim(), end.trim());
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h2>
      
      <div className="space-y-4">
        {/* Start Location */}
        <RoomSelector
          value={start}
          onChange={setStart}
          label="From"
          placeholder="E.g., E-203, Annapurna Canteen, JSK Greens"
        />

        {/* End Location */}
        <RoomSelector
          value={end}
          onChange={setEnd}
          label="To"
          placeholder="E.g., A-008, Coca-Cola Canteen, Ground"
        />

        {/* Get Directions Button */}
        <button
          onClick={handleGetDirections}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors min-h-[44px]"
        >
          Get Directions
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Route Display */}
        {roomRoute && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {roomRoute.steps.length > 0 ? (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Directions: {roomRoute.start.roomNumber} → {roomRoute.end.roomNumber}
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-gray-700 mb-3">
                  <span className="font-medium">Estimated Time:</span> {roomRoute.estimatedTime}
                  <span className="mx-2">•</span>
                  <span className="font-medium">Steps:</span> {roomRoute.totalSteps}
                </div>
                <div className="space-y-2">
                  {roomRoute.steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-white rounded-lg p-3 border border-blue-200"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {step.type === 'room' && '📍'}
                          {step.type === 'corridor' && '🚶'}
                          {step.type === 'stairs' && '🪜'}
                          {step.type === 'elevator' && '🛗'}
                          {step.type === 'building' && '🏢'}
                          {step.type === 'campus_path' && '🗺️'}
                          {' '}
                          {step.description}
                        </div>
                        {step.building && (
                          <div className="text-xs text-gray-500 mt-1">
                            {step.building}
                            {step.floor !== undefined && ` - ${step.floor === 0 ? 'Ground Floor' : `Floor ${step.floor}`}`}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                Location not found. Please check your input and try again.
                <div className="mt-2 text-xs">
                  <strong>Valid formats:</strong>
                  <br />• Rooms: E-203, A-008, P-101
                  <br />• Locations: Annapurna Canteen, JSK Greens, Ground
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
