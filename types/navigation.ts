export interface RoomLocation {
  building: string;
  floor: number;
  roomNumber: string;
}

export interface NavigationStep {
  type: 'room' | 'corridor' | 'stairs' | 'elevator' | 'building' | 'campus_path';
  description: string;
  location?: string;
  floor?: number;
  building?: string;
}

export interface RoomToRoomRoute {
  start: RoomLocation;
  end: RoomLocation;
  steps: NavigationStep[];
  totalSteps: number;
  estimatedTime?: string;
}
