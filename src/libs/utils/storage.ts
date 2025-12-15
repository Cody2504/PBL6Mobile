/**
 * Storage Utilities
 * Type-safe wrapper for AsyncStorage operations
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

// ============================================================
// Storage Wrapper
// ============================================================

export const storage = {
  /**
   * Get item from storage
   */
  async get<T = string>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value === null) return null

      // Try to parse as JSON, fallback to raw string
      try {
        return JSON.parse(value) as T
      } catch {
        return value as unknown as T
      }
    } catch (error) {
      console.error(`[Storage] Error getting ${key}:`, error)
      return null
    }
  },

  /**
   * Set item in storage
   */
  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      const stringValue =
        typeof value === 'string' ? value : JSON.stringify(value)
      await AsyncStorage.setItem(key, stringValue)
      return true
    } catch (error) {
      console.error(`[Storage] Error setting ${key}:`, error)
      return false
    }
  },

  /**
   * Remove item from storage
   */
  async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`[Storage] Error removing ${key}:`, error)
      return false
    }
  },

  /**
   * Remove multiple items from storage
   */
  async removeMultiple(keys: string[]): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove(keys)
      return true
    } catch (error) {
      console.error(`[Storage] Error removing multiple keys:`, error)
      return false
    }
  },

  /**
   * Get multiple items from storage
   */
  async getMultiple<T extends Record<string, unknown>>(
    keys: string[],
  ): Promise<Partial<T>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys)
      const result: Record<string, unknown> = {}

      for (const [key, value] of pairs) {
        if (value !== null) {
          try {
            result[key] = JSON.parse(value)
          } catch {
            result[key] = value
          }
        }
      }

      return result as Partial<T>
    } catch (error) {
      console.error(`[Storage] Error getting multiple keys:`, error)
      return {}
    }
  },

  /**
   * Set multiple items in storage
   */
  async setMultiple(items: Record<string, unknown>): Promise<boolean> {
    try {
      const pairs: [string, string][] = Object.entries(items).map(
        ([key, value]) => [
          key,
          typeof value === 'string' ? value : JSON.stringify(value),
        ],
      )
      await AsyncStorage.multiSet(pairs)
      return true
    } catch (error) {
      console.error(`[Storage] Error setting multiple keys:`, error)
      return false
    }
  },

  /**
   * Clear all storage
   */
  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear()
      return true
    } catch (error) {
      console.error(`[Storage] Error clearing storage:`, error)
      return false
    }
  },

  /**
   * Get all keys in storage
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys()
      return keys as string[]
    } catch (error) {
      console.error(`[Storage] Error getting all keys:`, error)
      return []
    }
  },
}
