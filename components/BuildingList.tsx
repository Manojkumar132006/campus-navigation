'use client';

import { BuildingNode } from '@/types/campus';

interface BuildingListProps {
  buildings: string[];
  buildingNodes: Record<string, BuildingNode>;
  onBuildingSelect: (building: string) => void;
  onViewDetails?: (building: string) => void;
  selectedBuilding?: string;
}

export function BuildingList({
  buildings,
  buildingNodes,
  onBuildingSelect,
  onViewDetails,
  selectedBuilding
}: BuildingListProps) {
  const sortedBuildings = [...buildings].sort();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Buildings</h2>
        <p className="text-sm text-gray-600 mt-1">
          {sortedBuildings.length} location{sortedBuildings.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="overflow-y-auto max-h-[600px]">
        {sortedBuildings.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            No buildings found
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {sortedBuildings.map((building) => {
              const node = buildingNodes[building];
              const isSelected = selectedBuilding === building;

              return (
                <li key={building}>
                  <div
                    className={`flex items-center gap-2 px-4 py-3 hover:bg-blue-50 transition-colors ${
                      isSelected ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <button
                      onClick={() => onBuildingSelect(building)}
                      className="flex-1 flex items-center gap-3 text-left min-h-[44px]"
                    >
                      <span className="text-2xl flex-shrink-0">{node.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                          {building}
                        </div>
                        <div className="text-xs text-gray-500 capitalize mt-0.5">
                          {node.type} {node.floors ? `• ${node.floors} floors` : ''}
                        </div>
                      </div>
                    </button>
                    {node.floors && node.floors > 0 && onViewDetails && (
                      <button
                        onClick={() => onViewDetails(building)}
                        className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors min-h-[44px] flex-shrink-0"
                        title="View rooms"
                      >
                        Rooms
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
