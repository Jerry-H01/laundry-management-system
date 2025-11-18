'use client'

import { useNavigation } from '@/context/navigation-context'
import { LoginPage } from '@/components/pages/login'
import { Sidebar } from '@/components/sidebar'
import { DashboardPage } from '@/components/pages/dashboard'

export default function Home() {
  const { isAuthenticated } = useNavigation()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <DashboardPage />
      </main>
    </div>
  )
}
