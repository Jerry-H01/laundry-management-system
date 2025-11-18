'use client'

import { useNavigation } from '@/context/navigation-context'
import { useDataStore } from '@/hooks/use-data-store'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Users, ShoppingCart, Receipt, Bell, DollarSign, BarChart3, LogOut } from 'lucide-react'

export function Sidebar() {
  const { currentPage, setCurrentPage, setIsAuthenticated } = useNavigation()
  const { currentAdmin, logout } = useDataStore()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'customers', label: 'Customers', icon: ShoppingCart },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'salary', label: 'Salary Payment', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ]

  const handleLogout = () => {
    logout()
    setIsAuthenticated(false)
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 border-r border-slate-700 flex flex-col h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cyan-400">LaundryPro</h1>
        <p className="text-sm text-slate-400 mt-1">Management System</p>
      </div>

      {currentAdmin && (
        <div className="mb-6 p-3 bg-slate-700 rounded-lg border border-slate-600">
          <p className="text-xs text-slate-400">Logged in as</p>
          <p className="text-sm font-semibold text-white truncate">{currentAdmin.name}</p>
        </div>
      )}

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <Button
              key={item.id}
              onClick={() => setCurrentPage(item.id as any)}
              variant={isActive ? 'default' : 'ghost'}
              className={`w-full justify-start gap-3 ${
                isActive ? 'bg-cyan-600 hover:bg-cyan-700' : 'hover:bg-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <Button
        onClick={handleLogout}
        variant="ghost"
        className="w-full justify-start gap-3 hover:bg-red-900/20 text-red-400 hover:text-red-300"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </Button>
    </aside>
  )
}
