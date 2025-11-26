'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TagManager } from '@/lib/tagManager';
import { TagSearchService } from '@/lib/tagSearchService';
import { TagHierarchyManager } from '@/lib/tagHierarchyManager';
import {
  Tag,
  TagCategory,
  RoomTagAssociation,
  TagStatistic,
  TagSearchResult
} from '@/types/roomTags';

interface RoomTagContextType {
  // Managers
  tagManager: TagManager;
  searchService: TagSearchService;
  hierarchyManager: TagHierarchyManager;
  
  // State
  categories: TagCategory[];
  tags: Tag[];
  roomAssociations: RoomTagAssociation[];
  
  // Category operations
  createCategory: (name: string, color: string, icon: string) => TagCategory;
  getCategory: (categoryId: string) => TagCategory | null;
  deleteCategory: (categoryId: string) => void;
  
  // Tag operations
  createTag: (name: string, categoryId: string, parentTagId?: string) => Tag;
  getTag: (tagId: string) => Tag | null;
  getTagsByCategory: (categoryId: string) => Tag[];
  updateTag: (tagId: string, updates: Partial<Tag>) => void;
  deleteTag: (tagId: string) => void;
  
  // Room-tag operations
  applyTag: (building: string, floor: number, room: string, tagId: string) => void;
  removeTag: (building: string, floor: number, room: string, tagId: string) => void;
  getRoomTags: (building: string, floor: number, room: string) => Tag[];
  
  // Search and filter
  searchTags: (query: string) => Tag[];
  searchByTag: (query: string) => TagSearchResult[];
  filterRoomsByTags: (tagIds: string[], matchAll: boolean) => RoomTagAssociation[];
  
  // Statistics
  getTagStatistics: () => TagStatistic[];
  getTagUsageCount: (tagId: string) => number;
  
  // Import/Export
  exportTags: () => string;
  importTags: (jsonData: string) => void;
  
  // Hierarchy
  getChildTags: (parentTagId: string) => Tag[];
  getParentTag: (tagId: string) => Tag | null;
  getTagPath: (tagId: string) => Tag[];
  validateHierarchy: (tagId: string, parentTagId: string) => boolean;
  
  // Refresh
  refreshTags: () => void;
}

const RoomTagContext = createContext<RoomTagContextType | undefined>(undefined);

export function RoomTagProvider({ children }: { children: React.ReactNode }) {
  const [tagManager] = useState(() => new TagManager());
  const [searchService] = useState(() => new TagSearchService(tagManager));
  const [hierarchyManager] = useState(() => new TagHierarchyManager(tagManager));
  
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [roomAssociations, setRoomAssociations] = useState<RoomTagAssociation[]>([]);

  const refreshTags = useCallback(() => {
    setCategories(tagManager.getAllCategories());
    setTags(tagManager.getAllTags());
    setRoomAssociations(tagManager.getAllRoomAssociations());
  }, [tagManager]);

  useEffect(() => {
    refreshTags();
  }, [refreshTags]);

  // Category operations
  const createCategory = useCallback((name: string, color: string, icon: string) => {
    const category = tagManager.createCategory(name, color, icon);
    refreshTags();
    return category;
  }, [tagManager, refreshTags]);

  const getCategory = useCallback((categoryId: string) => {
    return tagManager.getCategory(categoryId);
  }, [tagManager]);

  const deleteCategory = useCallback((categoryId: string) => {
    tagManager.deleteCategory(categoryId);
    refreshTags();
  }, [tagManager, refreshTags]);

  // Tag operations
  const createTag = useCallback((name: string, categoryId: string, parentTagId?: string) => {
    const tag = tagManager.createTag(name, categoryId, parentTagId);
    refreshTags();
    return tag;
  }, [tagManager, refreshTags]);

  const getTag = useCallback((tagId: string) => {
    return tagManager.getTag(tagId);
  }, [tagManager]);

  const getTagsByCategory = useCallback((categoryId: string) => {
    return tagManager.getTagsByCategory(categoryId);
  }, [tagManager]);

  const updateTag = useCallback((tagId: string, updates: Partial<Tag>) => {
    tagManager.updateTag(tagId, updates);
    refreshTags();
  }, [tagManager, refreshTags]);

  const deleteTag = useCallback((tagId: string) => {
    tagManager.deleteTag(tagId);
    refreshTags();
  }, [tagManager, refreshTags]);

  // Room-tag operations
  const applyTag = useCallback((building: string, floor: number, room: string, tagId: string) => {
    tagManager.applyTagToRoom(building, floor, room, tagId);
    refreshTags();
  }, [tagManager, refreshTags]);

  const removeTag = useCallback((building: string, floor: number, room: string, tagId: string) => {
    tagManager.removeTagFromRoom(building, floor, room, tagId);
    refreshTags();
  }, [tagManager, refreshTags]);

  const getRoomTags = useCallback((building: string, floor: number, room: string) => {
    return tagManager.getRoomTags(building, floor, room);
  }, [tagManager]);

  // Search and filter
  const searchTags = useCallback((query: string) => {
    return searchService.searchTags(query);
  }, [searchService]);

  const searchByTag = useCallback((query: string) => {
    return searchService.searchByTag(query);
  }, [searchService]);

  const filterRoomsByTags = useCallback((tagIds: string[], matchAll: boolean) => {
    return searchService.getRoomsByTagFilter(tagIds, matchAll);
  }, [searchService]);

  // Statistics
  const getTagStatistics = useCallback(() => {
    return tagManager.getTagStatistics();
  }, [tagManager]);

  const getTagUsageCount = useCallback((tagId: string) => {
    return tagManager.getTagUsageCount(tagId);
  }, [tagManager]);

  // Import/Export
  const exportTags = useCallback(() => {
    return tagManager.exportTags();
  }, [tagManager]);

  const importTags = useCallback((jsonData: string) => {
    tagManager.importTags(jsonData);
    refreshTags();
  }, [tagManager, refreshTags]);

  // Hierarchy
  const getChildTags = useCallback((parentTagId: string) => {
    return hierarchyManager.getChildTags(parentTagId);
  }, [hierarchyManager]);

  const getParentTag = useCallback((tagId: string) => {
    return hierarchyManager.getParentTag(tagId);
  }, [hierarchyManager]);

  const getTagPath = useCallback((tagId: string) => {
    return hierarchyManager.getTagPath(tagId);
  }, [hierarchyManager]);

  const validateHierarchy = useCallback((tagId: string, parentTagId: string) => {
    return hierarchyManager.validateHierarchy(tagId, parentTagId);
  }, [hierarchyManager]);

  const value: RoomTagContextType = {
    tagManager,
    searchService,
    hierarchyManager,
    categories,
    tags,
    roomAssociations,
    createCategory,
    getCategory,
    deleteCategory,
    createTag,
    getTag,
    getTagsByCategory,
    updateTag,
    deleteTag,
    applyTag,
    removeTag,
    getRoomTags,
    searchTags,
    searchByTag,
    filterRoomsByTags,
    getTagStatistics,
    getTagUsageCount,
    exportTags,
    importTags,
    getChildTags,
    getParentTag,
    getTagPath,
    validateHierarchy,
    refreshTags
  };

  return (
    <RoomTagContext.Provider value={value}>
      {children}
    </RoomTagContext.Provider>
  );
}

export function useRoomTags(): RoomTagContextType {
  const context = useContext(RoomTagContext);
  if (context === undefined) {
    throw new Error('useRoomTags must be used within a RoomTagProvider');
  }
  return context;
}
