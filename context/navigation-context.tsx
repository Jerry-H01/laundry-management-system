'use client'

import { createContext, useContext, useState, useMemo, ReactNode } from 'react'

type Page = 'dashboard' | 'employees' | 'customers' | 'transactions' | 'notifications' | 'salary' | 'reports'

interface NavigationContextType {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  isAuthenticated: boolean
  setIsAuthenticated: (authenticated: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const value = useMemo(
    () => ({ currentPage, setCurrentPage, isAuthenticated, setIsAuthenticated }),
    [currentPage, isAuthenticated]
  )

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider')
  }
  return context
}
