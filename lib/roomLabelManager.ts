import { RoomLabel, RoomLabelStorage } from '@/types/roomLabels';

const STORAGE_KEY = 'campus-room-labels';

export class RoomLabelManager {
  private storage: RoomLabelStorage;

  constructor() {
    this.storage = this.loadFromStorage();
  }

  private loadFromStorage(): RoomLabelStorage {
    if (typeof window === 'undefined') {
      return {};
    }
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load room labels from storage:', error);
      return {};
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.storage));
    } catch (error) {
      console.error('Failed to save room labels to storage:', error);
      throw new Error('Storage limit reached. Please delete some room labels.');
    }
  }

  private generateKey(buildingName: string, floor: number, roomNumber: string): string {
    return `${buildingName}-${floor}-${roomNumber}`;
  }

  addLabel(buildingName: string, floor: number, roomNumber: string, label: string): void {
    if (!label || label.length === 0 || label.length > 50) {
      throw new Error('Label must be 1-50 characters');
    }

    const key = this.generateKey(buildingName, floor, roomNumber);
    const now = Date.now();

    if (this.storage[key]) {
      // Room exists, add label if not already present
      if (!this.storage[key].labels.includes(label)) {
        this.storage[key].labels.push(label);
        this.storage[key].updatedAt = now;
      }
    } else {
      // Create new room label entry
      this.storage[key] = {
        buildingName,
        floor,
        roomNumber,
        labels: [label],
        createdAt: now,
        updatedAt: now
      };
    }

    this.saveToStorage();
  }

  removeLabel(buildingName: string, floor: number, roomNumber: string, label: string): void {
    const key = this.generateKey(buildingName, floor, roomNumber);
    
    if (this.storage[key]) {
      this.storage[key].labels = this.storage[key].labels.filter(l => l !== label);
      this.storage[key].updatedAt = Date.now();

      // Remove room entry if no labels left
      if (this.storage[key].labels.length === 0) {
        delete this.storage[key];
      }

      this.saveToStorage();
    }
  }

  getLabels(buildingName: string, floor: number, roomNumber: string): string[] {
    const key = this.generateKey(buildingName, floor, roomNumber);
    return this.storage[key]?.labels || [];
  }

  searchByLabel(query: string): RoomLabel[] {
    if (!query) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    const results: RoomLabel[] = [];

    for (const key in this.storage) {
      const room = this.storage[key];
      const hasMatch = room.labels.some(label => 
        label.toLowerCase().includes(lowerQuery)
      );

      if (hasMatch) {
        results.push(room);
      }
    }

    return results;
  }

  getAllLabeledRooms(): RoomLabel[] {
    return Object.values(this.storage);
  }

  clearAllLabels(): void {
    this.storage = {};
    this.saveToStorage();
  }

  exportLabels(): string {
    return JSON.stringify(this.storage, null, 2);
  }

  importLabels(jsonData: string): void {
    try {
      const imported = JSON.parse(jsonData);
      
      // Validate structure
      if (typeof imported !== 'object' || imported === null) {
        throw new Error('Invalid label data format');
      }

      // Validate each entry
      for (const key in imported) {
        const room = imported[key];
        if (!room.buildingName || !room.labels || !Array.isArray(room.labels)) {
          throw new Error('Invalid label data format');
        }
      }

      this.storage = imported;
      this.saveToStorage();
    } catch (error) {
      throw new Error('Invalid label data format');
    }
  }
}
