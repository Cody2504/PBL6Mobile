import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { UserProfile } from '@/features/profile/types'

interface ProfileCacheContextType {
  cachedProfile: UserProfile | null
  setCachedProfile: (profile: UserProfile | null) => void
  invalidateCache: () => void
  isCacheValid: boolean
  markCacheAsValid: () => void
}

const ProfileCacheContext = createContext<ProfileCacheContextType | undefined>(undefined)

interface ProfileCacheProviderProps {
  children: ReactNode
}

export function ProfileCacheProvider({ children }: ProfileCacheProviderProps) {
  const [cachedProfile, setCachedProfileState] = useState<UserProfile | null>(null)
  const [isCacheValid, setIsCacheValid] = useState(false)

  const setCachedProfile = useCallback((profile: UserProfile | null) => {
    setCachedProfileState(profile)
    if (profile) {
      setIsCacheValid(true)
    }
  }, [])

  const invalidateCache = useCallback(() => {
    setIsCacheValid(false)
  }, [])

  const markCacheAsValid = useCallback(() => {
    setIsCacheValid(true)
  }, [])

  return (
    <ProfileCacheContext.Provider
      value={{
        cachedProfile,
        setCachedProfile,
        invalidateCache,
        isCacheValid,
        markCacheAsValid,
      }}
    >
      {children}
    </ProfileCacheContext.Provider>
  )
}

export function useProfileCache() {
  const context = useContext(ProfileCacheContext)
  if (context === undefined) {
    throw new Error('useProfileCache must be used within a ProfileCacheProvider')
  }
  return context
}
