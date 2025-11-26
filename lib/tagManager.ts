import {
  Tag,
  TagCategory,
  RoomTagAssociation,
  TagStorage,
  TagStatistic,
  TagValidationError,
  TagStorageError,
  TAG_ERROR_MESSAGES
} from '@/types/roomTags';

const STORAGE_KEY = 'campus-tag-storage';
const VERSION_KEY = 'campus-tag-version';
const CURRENT_VERSION = 1;

// Default categories
const DEFAULT_CATEGORIES: Omit<TagCategory, 'createdAt'>[] = [
  {
    id: 'cat-activities',
    name: 'Activities',
    color: '#3B82F6',
    icon: '🎯',
    isSystem: true
  },
  {
    id: 'cat-facilities',
    name: 'Facilities',
    color: '#10B981',
    icon: '🏢',
    isSystem: true
  },
  {
    id: 'cat-accessibility',
    name: 'Accessibility',
    color: '#8B5CF6',
    icon: '♿',
    isSystem: true
  },
  {
    id: 'cat-amenities',
    name: 'Amenities',
    color: '#F59E0B',
    icon: '⭐',
    isSystem: true
  }
];

// Default tags
const DEFAULT_TAGS: Omit<Tag, 'createdAt' | 'updatedAt' | 'color'>[] = [
  // Activities
  { id: 'tag-dance', name: 'Dance Club', categoryId: 'cat-activities', isSystem: true },
  { id: 'tag-music', name: 'Music Club', categoryId: 'cat-activities', isSystem: true },
  { id: 'tag-art', name: 'Art Club', categoryId: 'cat-activities', isSystem: true },
  { id: 'tag-robotics', name: 'Robotics Club', categoryId: 'cat-activities', isSystem: true },
  { id: 'tag-drama', name: 'Drama Club', categoryId: 'cat-activities', isSystem: true },
  
  // Facilities
  { id: 'tag-lab', name: 'Laboratory', categoryId: 'cat-facilities', isSystem: true },
  { id: 'tag-workshop', name: 'Workshop', categoryId: 'cat-facilities', isSystem: true },
  { id: 'tag-study', name: 'Study Room', categoryId: 'cat-facilities', isSystem: true },
  { id: 'tag-meeting', name: 'Meeting Room', categoryId: 'cat-facilities', isSystem: true },
  { id: 'tag-lounge', name: 'Lounge', categoryId: 'cat-facilities', isSystem: true },
  
  // Accessibility
  { id: 'tag-wheelchair', name: 'Wheelchair Accessible', categoryId: 'cat-accessibility', isSystem: true },
  { id: 'tag-elevator', name: 'Elevator Access', categoryId: 'cat-accessibility', isSystem: true },
  { id: 'tag-ramp', name: 'Ramp Available', categoryId: 'cat-accessibility', isSystem: true },
  
  // Amenities
  { id: 'tag-wifi', name: 'WiFi Available', categoryId: 'cat-amenities', isSystem: true },
  { id: 'tag-projector', name: 'Projector', categoryId: 'cat-amenities', isSystem: true },
  { id: 'tag-whiteboard', name: 'Whiteboard', categoryId: 'cat-amenities', isSystem: true },
  { id: 'tag-ac', name: 'Air Conditioning', categoryId: 'cat-amenities', isSystem: true }
];

export class TagManager {
  private storage: TagStorage;
  private colorIndex: number = 0;

  constructor() {
    this.storage = this.loadFromStorage();
  }

  private loadFromStorage(): TagStorage {
    if (typeof window === 'undefined') {
      return this.createEmptyStorage();
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const version = localStorage.getItem(VERSION_KEY);

      if (!data || !version) {
        return this.initializeDefaultTags();
      }

      const parsed = JSON.parse(data) as TagStorage;
      
      // Validate structure
      if (!parsed.categories || !parsed.tags || !parsed.roomAssociations) {
        return this.initializeDefaultTags();
      }

      return parsed;
    } catch (error) {
      console.error('Failed to load tags from storage:', error);
      return this.initializeDefaultTags();
    }
  }

  private createEmptyStorage(): TagStorage {
    return {
      categories: {},
      tags: {},
      roomAssociations: {},
      version: CURRENT_VERSION
    };
  }

  private initializeDefaultTags(): TagStorage {
    const now = Date.now();
    const storage = this.createEmptyStorage();

    // Add default categories
    DEFAULT_CATEGORIES.forEach(cat => {
      storage.categories[cat.id] = {
        ...cat,
        createdAt: now
      };
    });

    // Add default tags
    DEFAULT_TAGS.forEach(tag => {
      const category = storage.categories[tag.categoryId];
      storage.tags[tag.id] = {
        ...tag,
        color: category.color,
        createdAt: now,
        updatedAt: now
      };
    });

    this.saveToStorage(storage);
    return storage;
  }

  private saveToStorage(storage?: TagStorage): void {
    if (typeof window === 'undefined') {
      return;
    }

    const dataToSave = storage || this.storage;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
    } catch (error) {
      console.error('Failed to save tags to storage:', error);
      throw new TagStorageError(TAG_ERROR_MESSAGES.STORAGE_FULL);
    }
  }

  private generateKey(building: string, floor: number, room: string): string {
    return `${building}-${floor}-${room}`;
  }

  private validateTagName(name: string): void {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      throw new TagValidationError(TAG_ERROR_MESSAGES.TAG_NAME_EMPTY);
    }
    if (trimmed.length > 50) {
      throw new TagValidationError(TAG_ERROR_MESSAGES.TAG_NAME_TOO_LONG);
    }
  }

  private generateColor(): string {
    const hue = (this.colorIndex * 137.508) % 360;
    const saturation = 65 + (this.colorIndex % 3) * 10;
    const lightness = 50 + (this.colorIndex % 2) * 10;
    this.colorIndex++;
    return this.hslToHex(hue, saturation, lightness);
  }

  private hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Category operations

  createCategory(name: string, color: string, icon: string): TagCategory {
    const trimmedName = name.trim();
    if (trimmedName.length === 0 || trimmedName.length > 30) {
      throw new TagValidationError('Category name must be 1-30 characters');
    }

    const id = this.generateUUID();
    const now = Date.now();

    const category: TagCategory = {
      id,
      name: trimmedName,
      color: color || this.generateColor(),
      icon: icon || '📁',
      isSystem: false,
      createdAt: now
    };

    this.storage.categories[id] = category;
    this.saveToStorage();

    return category;
  }

  getCategory(categoryId: string): TagCategory | null {
    return this.storage.categories[categoryId] || null;
  }

  getAllCategories(): TagCategory[] {
    return Object.values(this.storage.categories);
  }

  deleteCategory(categoryId: string): void {
    const category = this.storage.categories[categoryId];
    if (!category) {
      return;
    }

    if (category.isSystem) {
      throw new TagValidationError('System categories cannot be deleted');
    }

    // Check if any tags use this category
    const tagsInCategory = Object.values(this.storage.tags).filter(
      tag => tag.categoryId === categoryId
    );

    if (tagsInCategory.length > 0) {
      throw new TagValidationError('Cannot delete category with existing tags');
    }

    delete this.storage.categories[categoryId];
    this.saveToStorage();
  }

  // Tag operations

  createTag(name: string, categoryId: string, parentTagId?: string): Tag {
    this.validateTagName(name);

    const category = this.getCategory(categoryId);
    if (!category) {
      throw new TagValidationError(TAG_ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    // Check for duplicate name in category
    const existingTag = Object.values(this.storage.tags).find(
      tag => tag.categoryId === categoryId && tag.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (existingTag) {
      throw new TagValidationError(TAG_ERROR_MESSAGES.TAG_DUPLICATE);
    }

    const id = this.generateUUID();
    const now = Date.now();

    const tag: Tag = {
      id,
      name: name.trim(),
      categoryId,
      parentTagId,
      color: category.color,
      isSystem: false,
      createdAt: now,
      updatedAt: now
    };

    this.storage.tags[id] = tag;
    this.saveToStorage();

    return tag;
  }

  getTag(tagId: string): Tag | null {
    return this.storage.tags[tagId] || null;
  }

  getTagsByCategory(categoryId: string): Tag[] {
    return Object.values(this.storage.tags).filter(
      tag => tag.categoryId === categoryId
    );
  }

  getAllTags(): Tag[] {
    return Object.values(this.storage.tags);
  }

  updateTag(tagId: string, updates: Partial<Tag>): void {
    const tag = this.storage.tags[tagId];
    if (!tag) {
      throw new TagValidationError('Tag not found');
    }

    if (tag.isSystem) {
      throw new TagValidationError('System tags cannot be modified');
    }

    if (updates.name !== undefined) {
      this.validateTagName(updates.name);
    }

    this.storage.tags[tagId] = {
      ...tag,
      ...updates,
      id: tag.id, // Prevent ID change
      isSystem: tag.isSystem, // Prevent system flag change
      updatedAt: Date.now()
    };

    this.saveToStorage();
  }

  deleteTag(tagId: string): void {
    const tag = this.storage.tags[tagId];
    if (!tag) {
      return;
    }

    if (tag.isSystem) {
      throw new TagValidationError(TAG_ERROR_MESSAGES.SYSTEM_TAG_DELETE);
    }

    // Remove tag from all rooms
    Object.keys(this.storage.roomAssociations).forEach(roomKey => {
      const association = this.storage.roomAssociations[roomKey];
      association.tagIds = association.tagIds.filter(id => id !== tagId);
      association.updatedAt = Date.now();

      if (association.tagIds.length === 0) {
        delete this.storage.roomAssociations[roomKey];
      }
    });

    // Update child tags to have no parent
    Object.values(this.storage.tags).forEach(t => {
      if (t.parentTagId === tagId) {
        t.parentTagId = undefined;
        t.updatedAt = Date.now();
      }
    });

    delete this.storage.tags[tagId];
    this.saveToStorage();
  }

  // Room-tag associations

  applyTagToRoom(building: string, floor: number, room: string, tagId: string): void {
    const tag = this.getTag(tagId);
    if (!tag) {
      throw new TagValidationError('Tag not found');
    }

    const key = this.generateKey(building, floor, room);
    const now = Date.now();

    if (this.storage.roomAssociations[key]) {
      // Room exists, add tag if not already present
      if (!this.storage.roomAssociations[key].tagIds.includes(tagId)) {
        this.storage.roomAssociations[key].tagIds.push(tagId);
        this.storage.roomAssociations[key].updatedAt = now;
      }
    } else {
      // Create new room association
      this.storage.roomAssociations[key] = {
        roomKey: key,
        tagIds: [tagId],
        updatedAt: now
      };
    }

    this.saveToStorage();
  }

  removeTagFromRoom(building: string, floor: number, room: string, tagId: string): void {
    const key = this.generateKey(building, floor, room);
    const association = this.storage.roomAssociations[key];

    if (association) {
      association.tagIds = association.tagIds.filter(id => id !== tagId);
      association.updatedAt = Date.now();

      if (association.tagIds.length === 0) {
        delete this.storage.roomAssociations[key];
      }

      this.saveToStorage();
    }
  }

  getRoomTags(building: string, floor: number, room: string): Tag[] {
    const key = this.generateKey(building, floor, room);
    const association = this.storage.roomAssociations[key];

    if (!association) {
      return [];
    }

    return association.tagIds
      .map(id => this.storage.tags[id])
      .filter(tag => tag !== undefined);
  }

  getRoomsByTag(tagId: string): RoomTagAssociation[] {
    return Object.values(this.storage.roomAssociations).filter(
      association => association.tagIds.includes(tagId)
    );
  }

  // Utility operations

  getTagUsageCount(tagId: string): number {
    return this.getRoomsByTag(tagId).length;
  }

  getTagStatistics(): TagStatistic[] {
    const stats: TagStatistic[] = [];

    Object.values(this.storage.tags).forEach(tag => {
      const category = this.storage.categories[tag.categoryId];
      stats.push({
        tag,
        categoryName: category?.name || 'Unknown',
        usageCount: this.getTagUsageCount(tag.id)
      });
    });

    // Sort by usage count descending
    stats.sort((a, b) => b.usageCount - a.usageCount);

    return stats;
  }

  exportTags(): string {
    return JSON.stringify(this.storage, null, 2);
  }

  importTags(jsonData: string): void {
    try {
      const imported = JSON.parse(jsonData) as TagStorage;

      // Validate structure
      if (!imported.categories || !imported.tags || !imported.roomAssociations) {
        throw new TagValidationError(TAG_ERROR_MESSAGES.IMPORT_INVALID);
      }

      // Validate each category
      for (const catId in imported.categories) {
        const cat = imported.categories[catId];
        if (!cat.id || !cat.name || !cat.color) {
          throw new TagValidationError(TAG_ERROR_MESSAGES.IMPORT_INVALID);
        }
      }

      // Validate each tag
      for (const tagId in imported.tags) {
        const tag = imported.tags[tagId];
        if (!tag.id || !tag.name || !tag.categoryId) {
          throw new TagValidationError(TAG_ERROR_MESSAGES.IMPORT_INVALID);
        }
      }

      // Merge with existing data
      Object.keys(imported.categories).forEach(catId => {
        if (!this.storage.categories[catId]) {
          this.storage.categories[catId] = imported.categories[catId];
        }
      });

      Object.keys(imported.tags).forEach(tagId => {
        if (!this.storage.tags[tagId]) {
          this.storage.tags[tagId] = imported.tags[tagId];
        }
      });

      Object.keys(imported.roomAssociations).forEach(roomKey => {
        if (!this.storage.roomAssociations[roomKey]) {
          this.storage.roomAssociations[roomKey] = imported.roomAssociations[roomKey];
        } else {
          // Merge tag IDs
          const existingIds = this.storage.roomAssociations[roomKey].tagIds;
          const newIds = imported.roomAssociations[roomKey].tagIds;
          const mergedIds = Array.from(new Set([...existingIds, ...newIds]));
          this.storage.roomAssociations[roomKey].tagIds = mergedIds;
          this.storage.roomAssociations[roomKey].updatedAt = Date.now();
        }
      });

      this.saveToStorage();
    } catch (error) {
      if (error instanceof TagValidationError) {
        throw error;
      }
      throw new TagValidationError(TAG_ERROR_MESSAGES.IMPORT_INVALID);
    }
  }

  clearAllTags(): void {
    this.storage = this.initializeDefaultTags();
  }

  getAllRoomAssociations(): RoomTagAssociation[] {
    return Object.values(this.storage.roomAssociations);
  }
}
