import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { Classroom } from '@/features/classroom/hooks/use-teams-screen'

interface TeamsCacheContextType {
  cachedTeams: Classroom[]
  setCachedTeams: (teams: Classroom[]) => void
  invalidateCache: () => void
  isCacheValid: boolean
  markCacheAsValid: () => void
}

const TeamsCacheContext = createContext<TeamsCacheContextType | undefined>(undefined)

interface TeamsCacheProviderProps {
  children: ReactNode
}

export function TeamsCacheProvider({ children }: TeamsCacheProviderProps) {
  const [cachedTeams, setCachedTeamsState] = useState<Classroom[]>([])
  const [isCacheValid, setIsCacheValid] = useState(false)

  const setCachedTeams = useCallback((teams: Classroom[]) => {
    setCachedTeamsState(teams)
    setIsCacheValid(true)
  }, [])

  const invalidateCache = useCallback(() => {
    setIsCacheValid(false)
  }, [])

  const markCacheAsValid = useCallback(() => {
    setIsCacheValid(true)
  }, [])

  return (
    <TeamsCacheContext.Provider
      value={{
        cachedTeams,
        setCachedTeams,
        invalidateCache,
        isCacheValid,
        markCacheAsValid,
      }}
    >
      {children}
    </TeamsCacheContext.Provider>
  )
}

export function useTeamsCache() {
  const context = useContext(TeamsCacheContext)
  if (context === undefined) {
    throw new Error('useTeamsCache must be used within a TeamsCacheProvider')
  }
  return context
}
