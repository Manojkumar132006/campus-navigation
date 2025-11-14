'use client';

import { useState, useMemo, useCallback } from 'react';
import { CampusGraph } from '@/lib/campusGraph';
import { RouteCalculator } from '@/lib/routeCalculator';
import { RoomNavigator } from '@/lib/roomNavigation';
import { EnhancedSearchService } from '@/lib/enhancedSearchService';
import { campusData } from '@/lib/campusData';
import { RouteResult, SearchResult, BuildingNode } from '@/types/campus';
import { RoomToRoomRoute } from '@/types/navigation';
import { SearchResult as EnhancedSearchResult } from '@/types/hoodmapsStyle';
import { CampusMap } from '@/components/CampusMap';
import { HoodmapsStyleMap } from '@/components/HoodmapsStyleMap';
import { SearchBar } from '@/components/SearchBar';
import { EnhancedSearchBar } from '@/components/EnhancedSearchBar';
import { BuildingList } from '@/components/BuildingList';
import { RoutePanel } from '@/components/RoutePanel';
import { BuildingDetails } from '@/components/BuildingDetails';
import { CategoryFilter } from '@/components/CategoryFilter';
import { RoomLabelEditor } from '@/components/RoomLabelEditor';
import { RoomLabelProvider, useRoomLabels } from '@/contexts/RoomLabelContext';

function HomePageContent() {
  // Initialize graph and route calculator
  const graph = useMemo(() => new CampusGraph(campusData), []);
  const routeCalculator = useMemo(() => new RouteCalculator(graph), [graph]);
  const roomNavigator = useMemo(() => new RoomNavigator(graph), [graph]);
  
  // Get room labels from context
  const { roomLabelManager, roomLabels } = useRoomLabels();
  
  // Initialize enhanced search service
  const enhancedSearchService = useMemo(
    () => new EnhancedSearchService(graph, roomLabelManager),
    [graph, roomLabelManager]
  );

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState<string | undefined>();
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [roomRoute, setRoomRoute] = useState<RoomToRoomRoute | null>(null);
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const [showBuildingDetails, setShowBuildingDetails] = useState<BuildingNode | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  // Hoodmaps-specific state
  const [useHoodmapsStyle, setUseHoodmapsStyle] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [roomEditorOpen, setRoomEditorOpen] = useState<{
    building: string;
    floor: number;
    roomNumber: string;
  } | null>(null);

  // Get filtered buildings and rooms based on search
  const filteredBuildings = useMemo(() => {
    const results = graph.search(searchQuery);
    setSearchResults(results);
    // Return only building names for the building list
    return results
      .filter(r => r.type === 'building')
      .map(r => r.name);
  }, [graph, searchQuery]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle building selection
  const handleBuildingSelect = useCallback((building: string) => {
    setSelectedBuilding(building);
    setRoute(null); // Clear route when selecting a building
  }, []);

  // Handle building details view
  const handleShowBuildingDetails = useCallback((building: string) => {
    const buildingInfo = graph.getBuildingInfo(building);
    if (buildingInfo) {
      setShowBuildingDetails(buildingInfo);
    }
  }, [graph]);

  // Handle navigation request (unified for all locations)
  const handleNavigationRequest = useCallback((startLocation: string, endLocation: string) => {
    const result = roomNavigator.calculateRoomRoute(startLocation, endLocation);
    if (!result) {
      // Create an error result
      setRoomRoute({
        start: { building: '', floor: 0, roomNumber: startLocation },
        end: { building: '', floor: 0, roomNumber: endLocation },
        steps: [],
        totalSteps: 0,
        estimatedTime: '0 min'
      });
    } else {
      setRoomRoute(result);
    }
    setRoute(null); // Clear any old route
    setSelectedBuilding(undefined); // Clear single building selection
  }, [roomNavigator]);

  // Handle category filter toggle
  const handleCategoryToggle = useCallback((category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  }, []);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  // Handle enhanced search result selection
  const handleEnhancedSearchResult = useCallback((result: EnhancedSearchResult) => {
    if (result.type === 'building') {
      setSelectedBuilding(result.name);
    } else if (result.building) {
      // For room results, show the building and potentially open room editor
      setSelectedBuilding(result.building);
      // Optionally open room editor
      if (result.floor !== undefined && result.roomNumber) {
        setRoomEditorOpen({
          building: result.building,
          floor: result.floor,
          roomNumber: result.roomNumber
        });
      }
    }
  }, []);

  // Handle room click (for opening label editor)
  const handleRoomClick = useCallback((building: string, floor: number, roomNumber: string) => {
    setRoomEditorOpen({ building, floor, roomNumber });
  }, []);

  // Handle view toggle
  const handleToggleView = useCallback(() => {
    const newValue = !useHoodmapsStyle;
    setUseHoodmapsStyle(newValue);
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('campus-map-style', newValue ? 'hoodmaps' : 'classic');
    }
  }, [useHoodmapsStyle]);

  // Load view preference on mount
  useMemo(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('campus-map-style');
      if (stored) {
        setUseHoodmapsStyle(stored === 'hoodmaps');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campus Navigation</h1>
              <p className="text-sm text-gray-600 mt-1">Find your way around campus</p>
            </div>
            {/* View Toggle */}
            <button
              onClick={handleToggleView}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors min-w-[44px] min-h-[44px]"
            >
              {useHoodmapsStyle ? '🗺️ Classic View' : '🎨 Hoodmaps View'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          {useHoodmapsStyle ? (
            <EnhancedSearchBar
              searchService={enhancedSearchService}
              onResultSelect={handleEnhancedSearchResult}
            />
          ) : (
            <SearchBar onSearch={handleSearch} />
          )}
        </div>

        {/* Category Filter (Hoodmaps only) */}
        {useHoodmapsStyle && (
          <div className="mb-6">
            <CategoryFilter
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Building List - Left Side */}
          <div className="lg:col-span-4">
            <BuildingList
              buildings={filteredBuildings}
              buildingNodes={campusData.nodes}
              onBuildingSelect={handleBuildingSelect}
              onViewDetails={handleShowBuildingDetails}
              selectedBuilding={selectedBuilding}
            />
          </div>

          {/* Map and Route Panel - Right Side */}
          <div className="lg:col-span-8 space-y-6">
            <div className="h-[600px]">
              {useHoodmapsStyle ? (
                <HoodmapsStyleMap
                  graphData={campusData}
                  highlightedBuilding={selectedBuilding}
                  route={route?.path}
                  categoryFilter={selectedCategories}
                  onBuildingClick={handleBuildingSelect}
                  onRoomClick={handleRoomClick}
                  roomLabels={roomLabels}
                />
              ) : (
                <CampusMap
                  graphData={campusData}
                  highlightedBuilding={selectedBuilding}
                  route={route?.path}
                  onBuildingClick={handleBuildingSelect}
                />
              )}
            </div>
            <RoutePanel
              buildings={graph.getBuildings()}
              onRouteRequest={handleNavigationRequest}
              onRoomRouteRequest={handleNavigationRequest}
              route={route}
              roomRoute={roomRoute}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {/* Collapsible Building List */}
          <div>
            <button
              onClick={() => setIsListCollapsed(!isListCollapsed)}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between mb-4 min-h-[44px]"
            >
              <span className="font-medium text-gray-900">
                {isListCollapsed ? 'Show' : 'Hide'} Building List
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isListCollapsed ? '' : 'rotate-180'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {!isListCollapsed && (
              <BuildingList
                buildings={filteredBuildings}
                buildingNodes={campusData.nodes}
                onBuildingSelect={handleBuildingSelect}
                onViewDetails={handleShowBuildingDetails}
                selectedBuilding={selectedBuilding}
              />
            )}
          </div>

          {/* Map */}
          <div className="h-[500px]">
            {useHoodmapsStyle ? (
              <HoodmapsStyleMap
                graphData={campusData}
                highlightedBuilding={selectedBuilding}
                route={route?.path}
                categoryFilter={selectedCategories}
                onBuildingClick={handleBuildingSelect}
                onRoomClick={handleRoomClick}
                roomLabels={roomLabels}
              />
            ) : (
              <CampusMap
                graphData={campusData}
                highlightedBuilding={selectedBuilding}
                route={route?.path}
                onBuildingClick={handleBuildingSelect}
              />
            )}
          </div>

          {/* Route Panel */}
          <RoutePanel
            buildings={graph.getBuildings()}
            onRouteRequest={handleNavigationRequest}
            onRoomRouteRequest={handleNavigationRequest}
            route={route}
            roomRoute={roomRoute}
          />
        </div>

        {/* Search Results with Rooms */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Search Results ({searchResults.length})
            </h3>
            <div className="space-y-2">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (result.type === 'building') {
                      handleBuildingSelect(result.name);
                    } else if (result.building) {
                      handleShowBuildingDetails(result.building);
                    }
                  }}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300 min-h-[44px]"
                >
                  {result.type === 'building' ? (
                    <div>
                      <div className="font-medium text-gray-900">{result.name}</div>
                      <div className="text-sm text-gray-500">Building</div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium text-gray-900">
                        {result.roomNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.building} - Floor {result.floor}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {searchQuery && searchResults.length === 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800">
              No buildings or rooms match &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </main>

      {/* Building Details Modal */}
      {showBuildingDetails && (
        <BuildingDetails
          building={showBuildingDetails}
          onClose={() => setShowBuildingDetails(null)}
        />
      )}

      {/* Room Label Editor Modal */}
      {roomEditorOpen && (
        <RoomLabelEditor
          building={roomEditorOpen.building}
          floor={roomEditorOpen.floor}
          roomNumber={roomEditorOpen.roomNumber}
          onClose={() => setRoomEditorOpen(null)}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <RoomLabelProvider>
      <HomePageContent />
    </RoomLabelProvider>
  );
}
