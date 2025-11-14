'use client';

import { CampusGraphData } from '@/types/campus';
import { mapSettings } from '@/lib/campusData';
import { useState } from 'react';

interface CampusMapProps {
  graphData: CampusGraphData;
  highlightedBuilding?: string;
  route?: string[];
  onBuildingClick?: (buildingName: string) => void;
}

export function CampusMap({
  graphData,
  highlightedBuilding,
  route = [],
  onBuildingClick
}: CampusMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const viewBoxWidth = mapSettings.viewBoxWidth;
  const viewBoxHeight = mapSettings.viewBoxHeight;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Check if an edge is part of the route
  const isEdgeInRoute = (node1: string, node2: string): boolean => {
    if (route.length < 2) return false;
    for (let i = 0; i < route.length - 1; i++) {
      if (
        (route[i] === node1 && route[i + 1] === node2) ||
        (route[i] === node2 && route[i + 1] === node1)
      ) {
        return true;
      }
    }
    return false;
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

      {/* SVG Map */}
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-full cursor-move"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Draw edges */}
        <g>
          {graphData.edges.map(([node1, node2], index) => {
            const building1 = graphData.nodes[node1];
            const building2 = graphData.nodes[node2];
            const isHighlighted = isEdgeInRoute(node1, node2);

            return (
              <line
                key={index}
                x1={building1.x}
                y1={building1.y}
                x2={building2.x}
                y2={building2.y}
                stroke={isHighlighted ? '#3b82f6' : '#d1d5db'}
                strokeWidth={isHighlighted ? 4 : 2}
                className="transition-all"
              />
            );
          })}
        </g>

        {/* Draw buildings */}
        <g>
          {Object.entries(graphData.nodes).map(([name, building]) => {
            const isHighlighted = highlightedBuilding === name;
            const isInRoute = route.includes(name);

            return (
              <g
                key={name}
                onClick={() => onBuildingClick?.(name)}
                className="cursor-pointer"
                style={{ pointerEvents: 'all' }}
              >
                {/* Building circle */}
                <circle
                  cx={building.x}
                  cy={building.y}
                  r={isHighlighted ? 28 : 24}
                  fill={isHighlighted ? '#3b82f6' : isInRoute ? '#60a5fa' : '#ffffff'}
                  stroke={isHighlighted ? '#1e40af' : isInRoute ? '#3b82f6' : '#9ca3af'}
                  strokeWidth={isHighlighted ? 3 : 2}
                  className="transition-all hover:fill-blue-100"
                />
                
                {/* Emoji */}
                <text
                  x={building.x}
                  y={building.y + 6}
                  textAnchor="middle"
                  fontSize="20"
                  className="pointer-events-none select-none"
                >
                  {building.emoji}
                </text>

                {/* Building name */}
                <text
                  x={building.x}
                  y={building.y + 45}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#374151"
                  fontWeight={isHighlighted ? 'bold' : 'normal'}
                  className="pointer-events-none select-none"
                >
                  {name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
