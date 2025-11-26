import { Tag, TagValidationError, TAG_ERROR_MESSAGES } from '@/types/roomTags';
import { TagManager } from './tagManager';

const MAX_HIERARCHY_DEPTH = 3;

export class TagHierarchyManager {
  private tagManager: TagManager;

  constructor(tagManager: TagManager) {
    this.tagManager = tagManager;
  }

  /**
   * Get all child tags of a parent tag
   */
  getChildTags(parentTagId: string): Tag[] {
    return this.tagManager.getAllTags().filter(
      tag => tag.parentTagId === parentTagId
    );
  }

  /**
   * Get the parent tag of a given tag
   */
  getParentTag(tagId: string): Tag | null {
    const tag = this.tagManager.getTag(tagId);
    if (!tag || !tag.parentTagId) {
      return null;
    }
    return this.tagManager.getTag(tag.parentTagId);
  }

  /**
   * Get the full path from root to the given tag
   * Returns array of tags from root to the given tag
   */
  getTagPath(tagId: string): Tag[] {
    const path: Tag[] = [];
    let currentTag = this.tagManager.getTag(tagId);

    while (currentTag) {
      path.unshift(currentTag);
      if (currentTag.parentTagId) {
        currentTag = this.tagManager.getTag(currentTag.parentTagId);
      } else {
        break;
      }
    }

    return path;
  }

  /**
   * Validate that creating a parent-child relationship is valid
   * Checks for:
   * - Same category
   * - No circular references
   * - Maximum depth not exceeded
   */
  validateHierarchy(tagId: string, parentTagId: string): boolean {
    const tag = this.tagManager.getTag(tagId);
    const parentTag = this.tagManager.getTag(parentTagId);

    if (!tag || !parentTag) {
      throw new TagValidationError('Tag or parent tag not found');
    }

    // Check same category
    if (tag.categoryId !== parentTag.categoryId) {
      throw new TagValidationError(TAG_ERROR_MESSAGES.PARENT_CATEGORY_MISMATCH);
    }

    // Check for circular reference
    if (this.detectCircularReference(tagId, parentTagId)) {
      throw new TagValidationError(TAG_ERROR_MESSAGES.CIRCULAR_REFERENCE);
    }

    // Check maximum depth
    const parentDepth = this.getMaxDepth(parentTagId);
    if (parentDepth >= MAX_HIERARCHY_DEPTH) {
      throw new TagValidationError(TAG_ERROR_MESSAGES.HIERARCHY_TOO_DEEP);
    }

    return true;
  }

  /**
   * Get the maximum depth of the hierarchy starting from this tag
   * A tag with no children has depth 1
   * A tag with children has depth 1 + max(child depths)
   */
  getMaxDepth(tagId: string): number {
    const tag = this.tagManager.getTag(tagId);
    if (!tag) {
      return 0;
    }

    const children = this.getChildTags(tagId);
    if (children.length === 0) {
      // Leaf node - count depth from root
      return this.getTagPath(tagId).length;
    }

    // Return max depth of children
    const childDepths = children.map(child => this.getMaxDepth(child.id));
    return Math.max(...childDepths);
  }

  /**
   * Detect if setting parentTagId as parent of tagId would create a circular reference
   */
  private detectCircularReference(tagId: string, parentTagId: string): boolean {
    // If parentTagId is the same as tagId, it's circular
    if (tagId === parentTagId) {
      return true;
    }

    // Walk up the parent chain from parentTagId
    // If we encounter tagId, it's circular
    let currentId: string | undefined = parentTagId;
    const visited = new Set<string>();

    while (currentId) {
      if (visited.has(currentId)) {
        // Already visited this node, there's a cycle in existing data
        return true;
      }
      visited.add(currentId);

      if (currentId === tagId) {
        return true;
      }

      const currentTag = this.tagManager.getTag(currentId);
      currentId = currentTag?.parentTagId;
    }

    return false;
  }

  /**
   * Get all root tags (tags with no parent) in a category
   */
  getRootTags(categoryId: string): Tag[] {
    return this.tagManager.getTagsByCategory(categoryId).filter(
      tag => !tag.parentTagId
    );
  }

  /**
   * Get the hierarchy tree for a category
   * Returns root tags with their children nested
   */
  getHierarchyTree(categoryId: string): TagNode[] {
    const rootTags = this.getRootTags(categoryId);
    return rootTags.map(tag => this.buildTagNode(tag));
  }

  private buildTagNode(tag: Tag): TagNode {
    const children = this.getChildTags(tag.id);
    return {
      tag,
      children: children.map(child => this.buildTagNode(child))
    };
  }

  /**
   * Promote all children of a tag to root level (remove their parent)
   */
  promoteChildren(parentTagId: string): void {
    const children = this.getChildTags(parentTagId);
    children.forEach(child => {
      this.tagManager.updateTag(child.id, { parentTagId: undefined });
    });
  }

  /**
   * Get the depth level of a specific tag (1 for root, 2 for first level child, etc.)
   */
  getTagLevel(tagId: string): number {
    return this.getTagPath(tagId).length;
  }
}

// Helper interface for tree representation
export interface TagNode {
  tag: Tag;
  children: TagNode[];
}
