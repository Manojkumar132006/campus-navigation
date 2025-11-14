import { ZoneStyle, CategoryColors } from '@/types/roomLabels';

export const HOODMAPS_COLORS: CategoryColors = {
  academic: '#FCD34D',      // Bold yellow
  hostels: '#60A5FA',       // Bold blue
  canteen: '#F87171',       // Bold red
  recreational: '#4ADE80',  // Bold green
  administrative: '#A78BFA', // Bold purple
  miscellaneous: '#9CA3AF', // Gray
  facility: '#9CA3AF'       // Gray (mapped from facility)
};

const STROKE_COLORS: Record<string, string> = {
  '#FCD34D': '#F59E0B',  // Yellow stroke
  '#60A5FA': '#2563EB',  // Blue stroke
  '#F87171': '#DC2626',  // Red stroke
  '#4ADE80': '#16A34A',  // Green stroke
  '#A78BFA': '#7C3AED',  // Purple stroke
  '#9CA3AF': '#6B7280'   // Gray stroke
};

export class HoodmapsStyleEngine {
  constructor() {}

  getZoneStyle(buildingType: string, buildingName: string = ''): ZoneStyle {
    const fillColor = HOODMAPS_COLORS[buildingType as keyof CategoryColors] || HOODMAPS_COLORS.miscellaneous;
    const strokeColor = this.getContrastingStroke(fillColor);
    
    return {
      fillColor,
      strokeColor,
      strokeWidth: 3,
      borderRadius: 12,
      label: this.generatePlayfulLabel(buildingName, buildingType),
      icon: this.getIconForType(buildingType)
    };
  }

  generatePlayfulLabel(buildingName: string, buildingType: string): string {
    // Always return the original building name
    // Users can label individual rooms with custom names like "Dance Club", "Art Club"
    return buildingName;
  }

  getContrastingStroke(fillColor: string): string {
    return STROKE_COLORS[fillColor] || '#6B7280';
  }

  private getIconForType(buildingType: string): string {
    const icons: Record<string, string> = {
      academic: '📚',
      hostels: '🏠',
      canteen: '🍽️',
      recreational: '🌳',
      administrative: '🏛️',
      facility: '🏗️',
      miscellaneous: '📍'
    };

    return icons[buildingType] || '📍';
  }
}
