/**
 * User info caching utility for efficient user data fetching
 */

import { profileService, UserProfile } from '../services/profileService';

// In-memory cache for user information
const userCache = new Map<number, UserProfile>();

/**
 * Get user information by ID with caching
 * @param userId - User ID
 * @returns UserProfile or null if fetch fails
 */
export async function getUserInfo(userId: number): Promise<UserProfile | null> {
  // Check cache first
  if (userCache.has(userId)) {
    return userCache.get(userId)!;
  }

  // Fetch from API
  try {
    const response = await profileService.getUserById(userId);
    if (response.success && response.data) {
      userCache.set(userId, response.data);
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    return null;
  }
}

/**
 * Batch fetch user information for multiple user IDs with caching
 * Fetches in parallel with limited concurrency to avoid overwhelming the server
 * @param userIds - Array of user IDs
 * @returns Map of user ID to UserProfile (only includes successfully fetched users)
 */
export async function batchGetUserInfo(userIds: number[]): Promise<Map<number, UserProfile>> {
  const results = new Map<number, UserProfile>();

  // Remove duplicates
  const uniqueIds = [...new Set(userIds)];

  // Separate cached and uncached users
  const uncachedIds: number[] = [];

  uniqueIds.forEach((id) => {
    if (userCache.has(id)) {
      results.set(id, userCache.get(id)!);
    } else {
      uncachedIds.push(id);
    }
  });

  // If all users are cached, return immediately
  if (uncachedIds.length === 0) {
    return results;
  }

  // Fetch uncached users in parallel batches (limit concurrency to 5)
  const BATCH_SIZE = 5;
  for (let i = 0; i < uncachedIds.length; i += BATCH_SIZE) {
    const batch = uncachedIds.slice(i, i + BATCH_SIZE);
    const promises = batch.map((id) => getUserInfo(id));
    const batchResults = await Promise.allSettled(promises);

    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        results.set(batch[index], result.value);
      }
    });
  }

  return results;
}

/**
 * Clear the user cache
 * Useful for logout or when user data needs to be refreshed
 */
export function clearUserCache(): void {
  userCache.clear();
}

/**
 * Pre-cache user information
 * Useful for preloading known user data
 * @param userId - User ID
 * @param userInfo - User profile data
 */
export function cacheUserInfo(userId: number, userInfo: UserProfile): void {
  userCache.set(userId, userInfo);
}
