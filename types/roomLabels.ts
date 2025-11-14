export interface RoomLabel {
  buildingName: string;
  floor: number;
  roomNumber: string;
  labels: string[]; // Multiple labels per room
  createdAt: number;
  updatedAt: number;
}

export interface RoomLabelStorage {
  [key: string]: RoomLabel; // key: "BuildingName-Floor-RoomNumber"
}

export interface ZoneStyle {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  borderRadius: number;
  label: string;
  icon: string;
}

export interface CategoryColors {
  academic: string;
  hostels: string;
  canteen: string;
  recreational: string;
  administrative: string;
  miscellaneous: string;
  facility: string; // Map to miscellaneous
}
