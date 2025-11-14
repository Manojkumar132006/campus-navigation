'use client';

import { useState } from 'react';
import { FloorPlan } from '@/types/floorplan';

interface FloorPlanViewerProps {
  floorPlan: FloorPlan;
  onRoomClick?: (roomNumber: string) => void;
  selectedRoom?: string;
}

export function FloorPlanViewer({ floorPlan, onRoomClick, selectedRoom }: FloorPlanViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded shadow-md transition-colors min-w-[44px] min-h-[44px]"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded shadow-md transition-colors min-w-[44px] min-h-[44px]"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={handleZoomReset}
          className="bg-white hover:bg-gray-100 text-gray-700 text-xs py-2 px-3 rounded shadow-md transition-colors min-w-[44px] min-h-[44px]"
          aria-label="Reset zoom"
        >
          Reset
        </button>
      </div>

      {/* Floor Plan SVG */}
      <svg
        viewBox={`0 0 ${floorPlan.width} ${floorPlan.height}`}
        className="w-full h-full"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`
        }}
      >
        {/* Background */}
        <rect
          x="0"
          y="0"
          width={floorPlan.width}
          height={floorPlan.height}
          fill="#f9fafb"
          stroke="#e5e7eb"
          strokeWidth="2"
        />

        {/* Corridors */}
        {floorPlan.corridors?.map((corridor, index) => (
          <line
            key={`corridor-${index}`}
            x1={corridor.x1}
            y1={corridor.y1}
            x2={corridor.x2}
            y2={corridor.y2}
            stroke="#d1d5db"
            strokeWidth="20"
            strokeLinecap="round"
          />
        ))}

        {/* Rooms */}
        {floorPlan.rooms.map((room) => {
          const isSelected = selectedRoom === room.roomNumber;
          const width = room.width || 80;
          const height = room.height || 60;

          return (
            <g
              key={room.roomNumber}
              onClick={() => onRoomClick?.(room.roomNumber)}
              className="cursor-pointer"
              style={{ pointerEvents: 'all' }}
            >
              {/* Room rectangle */}
              <rect
                x={room.x}
                y={room.y}
                width={width}
                height={height}
                fill={isSelected ? '#3b82f6' : '#ffffff'}
                stroke={isSelected ? '#1e40af' : '#9ca3af'}
                strokeWidth={isSelected ? 3 : 2}
                rx="4"
                className="transition-all hover:fill-blue-50"
              />
              
              {/* Room number */}
              <text
                x={room.x + width / 2}
                y={room.y + height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight={isSelected ? 'bold' : 'normal'}
                fill={isSelected ? '#ffffff' : '#374151'}
                className="pointer-events-none select-none"
              >
                {room.roomNumber}
              </text>
              
              {/* Room label */}
              {room.label && (
                <text
                  x={room.x + width / 2}
                  y={room.y + height / 2 + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fill={isSelected ? '#e0e7ff' : '#6b7280'}
                  className="pointer-events-none select-none"
                >
                  {room.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Stairs */}
        {floorPlan.stairs?.map((stair, index) => (
          <g key={`stair-${index}`}>
            <rect
              x={stair.x - 25}
              y={stair.y - 25}
              width="50"
              height="50"
              fill="#fef3c7"
              stroke="#f59e0b"
              strokeWidth="2"
              rx="4"
            />
            <text
              x={stair.x}
              y={stair.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20"
            >
              🚶
            </text>
            <text
              x={stair.x}
              y={stair.y + 35}
              textAnchor="middle"
              fontSize="10"
              fill="#92400e"
            >
              {stair.label}
            </text>
          </g>
        ))}

        {/* Elevators */}
        {floorPlan.elevators?.map((elevator, index) => (
          <g key={`elevator-${index}`}>
            <rect
              x={elevator.x - 25}
              y={elevator.y - 25}
              width="50"
              height="50"
              fill="#dbeafe"
              stroke="#3b82f6"
              strokeWidth="2"
              rx="4"
            />
            <text
              x={elevator.x}
              y={elevator.y + 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20"
            >
              🛗
            </text>
            <text
              x={elevator.x}
              y={elevator.y + 35}
              textAnchor="middle"
              fontSize="10"
              fill="#1e40af"
            >
              Elevator
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-xs">
        <div className="font-semibold text-gray-700 mb-2">
          Floor {floorPlan.floor === 0 ? 'Ground' : floorPlan.floor} - Block {floorPlan.block}
        </div>
        <div className="space-y-1 text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-gray-400 rounded"></div>
            <span>Room</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🚶</span>
            <span>Stairs</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🛗</span>
            <span>Elevator</span>
          </div>
        </div>
      </div>
    </div>
  );
}
