export interface HoodmapsStyleConfig {
  colors: {
    academic: string;
    hostels: string;
    canteen: string;
    recreational: string;
    administrative: string;
    miscellaneous: string;
    facility: string;
  };
  strokeWidth: number;
  borderRadius: number;
  minZoneSize: number;
}

export interface SearchResult {
  type: 'building' | 'room';
  name: string;
  building?: string;
  floor?: number;
  roomNumber?: string;
  labels?: string[];
  matchedLabel?: string; // Which label matched the search
}

export interface ZoneSize {
  width: number;
  height: number;
}
