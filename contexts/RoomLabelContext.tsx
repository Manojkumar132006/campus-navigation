'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { RoomLabelManager } from '@/lib/roomLabelManager';
import { RoomLabel, RoomLabelStorage } from '@/types/roomLabels';

interface RoomLabelContextType {
  roomLabelManager: RoomLabelManager;
  roomLabels: RoomLabelStorage;
  addLabel: (buildingName: string, floor: number, roomNumber: string, label: string) => void;
  removeLabel: (buildingName: string, floor: number, roomNumber: string, label: string) => void;
  getLabels: (buildingName: string, floor: number, roomNumber: string) => string[];
  searchByLabel: (query: string) => RoomLabel[];
  refreshLabels: () => void;
}

const RoomLabelContext = createContext<RoomLabelContextType | undefined>(undefined);

export function RoomLabelProvider({ children }: { children: React.ReactNode }) {
  const [roomLabelManager] = useState(() => new RoomLabelManager());
  const [roomLabels, setRoomLabels] = useState<RoomLabelStorage>({});

  const refreshLabels = useCallback(() => {
    const allLabels = roomLabelManager.getAllLabeledRooms();
    const storage: RoomLabelStorage = {};
    
    allLabels.forEach(room => {
      const key = `${room.buildingName}-${room.floor}-${room.roomNumber}`;
      storage[key] = room;
    });
    
    setRoomLabels(storage);
  }, [roomLabelManager]);

  useEffect(() => {
    refreshLabels();
  }, [refreshLabels]);

  const addLabel = useCallback((buildingName: string, floor: number, roomNumber: string, label: string) => {
    roomLabelManager.addLabel(buildingName, floor, roomNumber, label);
    refreshLabels();
  }, [roomLabelManager, refreshLabels]);

  const removeLabel = useCallback((buildingName: string, floor: number, roomNumber: string, label: string) => {
    roomLabelManager.removeLabel(buildingName, floor, roomNumber, label);
    refreshLabels();
  }, [roomLabelManager, refreshLabels]);

  const getLabels = useCallback((buildingName: string, floor: number, roomNumber: string) => {
    return roomLabelManager.getLabels(buildingName, floor, roomNumber);
  }, [roomLabelManager]);

  const searchByLabel = useCallback((query: string) => {
    return roomLabelManager.searchByLabel(query);
  }, [roomLabelManager]);

  const value: RoomLabelContextType = {
    roomLabelManager,
    roomLabels,
    addLabel,
    removeLabel,
    getLabels,
    searchByLabel,
    refreshLabels
  };

  return (
    <RoomLabelContext.Provider value={value}>
      {children}
    </RoomLabelContext.Provider>
  );
}

export function useRoomLabels(): RoomLabelContextType {
  const context = useContext(RoomLabelContext);
  if (context === undefined) {
    throw new Error('useRoomLabels must be used within a RoomLabelProvider');
  }
  return context;
}
