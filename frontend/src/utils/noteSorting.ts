import type { NoteInfo } from '../types/api';

/**
 * Priority order mapping for sorting
 * Higher numbers = higher priority
 */
const PRIORITY_ORDER = {
  'high': 3,
  'medium': 2,
  'low': 1
} as const;

type Priority = 'low' | 'medium' | 'high';

/**
 * Sorts notes by priority (high → medium → low), then by creation date (newest first), then by title
 * @param notes - Array of notes to sort
 * @returns Sorted array of notes
 */
export function sortNotesByPriority(notes: NoteInfo[]): NoteInfo[] {
  return [...notes].sort((a, b) => {
    // Primary sort: Priority (high → medium → low)
    const priorityDiff = PRIORITY_ORDER[b.priority as Priority] - PRIORITY_ORDER[a.priority as Priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Secondary sort: Creation date (newest first)
    if (a.created_at && b.created_at) {
      const dateDiff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (dateDiff !== 0) return dateDiff;
    } else if (a.created_at) {
      return -1; // a has date, b doesn't, so a comes first
    } else if (b.created_at) {
      return 1; // b has date, a doesn't, so b comes first
    }

    // Tertiary sort: Title (alphabetical)
    return a.title.localeCompare(b.title);
  });
}

/**
 * Gets the priority order value for a given priority level
 * @param priority - The priority level
 * @returns Numeric priority value (higher = more important)
 */
export function getPriorityOrder(priority: string): number {
  return PRIORITY_ORDER[priority as Priority] || 0;
}
