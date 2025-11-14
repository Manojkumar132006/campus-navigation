'use client';

import { CampusGraphData, BuildingNode } from '@/types/campus';
import { RoomLabelStorage } from '@/types/roomLabels';
import { ZoneSize } from '@/types/hoodmapsStyle';
import { mapSettings } from '@/lib/campusData';
import { HoodmapsStyleEngine } from '@/lib/hoodmapsStyleEngine';
import { useState, useMemo } from 'react';

interface HoodmapsStyleMapProps {
  graphData: CampusGraphData;
  highlightedBuilding?: string;
  highlightedRoom?: { building: string; floor: number; roomNumber: string };
  route?: string[];
  categoryFilter?: string[];
  onBuildingClick?: (buildingName: string) => void;
  onRoomClick?: (building: string, floor: number, roomNumber: string) => void;
  roomLabels: RoomLabelStorage;
}

export function HoodmapsStyleMap({
  graphData,
  highlightedBuilding,
  highlightedRoom,
  route = [],
  categoryFilter = [],
  onBuildingClick,
  onRoomClick,
  roomLabels
}: HoodmapsStyleMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  const styleEngine = useMemo(() => new HoodmapsStyleEngine(), []);
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

  // Calculate zone size based on building properties
  const calculateZoneSize = (building: BuildingNode): ZoneSize => {
    const baseSize = 60;
    const floorMultiplier = building.floors || 1;
    const roomsPerFloor = 10; // Default
    const roomMultiplier = roomsPerFloor / 10;
    
    return {
      width: baseSize + (floorMultiplier * 8),
      height: baseSize + (roomMultiplier * 8)
    };
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

  // Check if building should be dimmed based on category filter
  const shouldDimBuilding = (buildingType: string): boolean => {
    if (categoryFilter.length === 0) return false;
    return !categoryFilter.includes(buildingType);
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
        {/* Background */}
        <rect width={viewBoxWidth} height={viewBoxHeight} fill="#F9FAFB" />

        {/* Draw pathways as dashed lines */}
        <g className="pathways">
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
                stroke={isHighlighted ? '#3b82f6' : '#D1D5DB'}
                strokeWidth={isHighlighted ? 3 : 2}
                strokeDasharray="5,5"
                className="transition-all"
                opacity={0.6}
              />
            );
          })}
        </g>

        {/* Draw zones (buildings as rounded rectangles) */}
        <g className="zones">
          {Object.entries(graphData.nodes).map(([name, building]) => {
            const zoneSize = calculateZoneSize(building);
            const style = styleEngine.getZoneStyle(building.type, name);
            const isHighlighted = highlightedBuilding === name;
            const isInRoute = route.includes(name);
            const isHovered = hoveredBuilding === name;
            const isDimmed = shouldDimBuilding(building.type);

            const opacity = isDimmed ? 0.3 : 1;
            const strokeWidth = isHighlighted ? 4 : style.strokeWidth;

            return (
              <g
                key={name}
                onClick={() => onBuildingClick?.(name)}
                onMouseEnter={() => setHoveredBuilding(name)}
                onMouseLeave={() => setHoveredBuilding(null)}
                className="cursor-pointer"
                style={{ pointerEvents: 'all' }}
                opacity={opacity}
              >
                {/* Zone rectangle */}
                <rect
                  x={building.x - zoneSize.width / 2}
                  y={building.y - zoneSize.height / 2}
                  width={zoneSize.width}
                  height={zoneSize.height}
                  rx={style.borderRadius}
                  ry={style.borderRadius}
                  fill={style.fillColor}
                  stroke={isHighlighted || isInRoute ? '#3b82f6' : style.strokeColor}
                  strokeWidth={strokeWidth}
                  className="transition-all"
                  style={{
                    filter: isHovered ? 'brightness(1.1)' : 'none'
                  }}
                />
                
                {/* Micro-icon */}
                <text
                  x={building.x}
                  y={building.y - 8}
                  textAnchor="middle"
                  fontSize="20"
                  className="pointer-events-none select-none"
                >
                  {style.icon}
                </text>

                {/* Zone label */}
                <text
                  x={building.x}
                  y={building.y + 12}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="600"
                  fill="#374151"
                  className="pointer-events-none select-none"
                >
                  {style.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
