export interface RoomPosition {
  roomNumber: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  label?: string;
}

export interface FloorPlan {
  floor: number;
  block: string;
  width: number;
  height: number;
  rooms: RoomPosition[];
  corridors?: { x1: number; y1: number; x2: number; y2: number }[];
  stairs?: { x: number; y: number; label: string }[];
  elevators?: { x: number; y: number }[];
}

export interface BlockFloorPlans {
  [blockName: string]: {
    [floor: number]: FloorPlan;
  };
}
