'use client'

import { useDataStore } from '@/hooks/use-data-store'
import { useNavigation } from '@/context/navigation-context'
import { EmployeesPage } from './employees'
import { CustomersPage } from './customers'
import { TransactionsPage } from './transactions'
import { NotificationsPage } from './notifications'
import { SalaryPage } from './salary'
import { ReportsPage } from './reports'
import { Card } from '@/components/ui/card'
import { Users, ShoppingCart, Receipt, TrendingUp } from 'lucide-react'

function DashboardView() {
  const metrics = useDataStore((state) => state.getMetrics())
  const transactions = useDataStore((state) => state.transactions)
  const employees = useDataStore((state) => state.employees)

  const stats = [
    { label: 'Total Employees', value: metrics.totalEmployees, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Customers', value: metrics.totalCustomers, icon: ShoppingCart, color: 'bg-emerald-500' },
    { label: 'Total Transactions', value: metrics.totalTransactions, icon: Receipt, color: 'bg-amber-500' },
    { label: 'Pending Transactions', value: metrics.pendingTransactions, icon: TrendingUp, color: 'bg-rose-500' },
  ]

  const recentTransactions = transactions.slice(-5).reverse()

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="bg-white border-0 shadow-md">
              <div className="p-6">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border-0 shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <p className="text-slate-500 text-sm">No transactions yet</p>
              ) : (
                recentTransactions.map((trans) => (
                  <div key={trans.id} className="pb-4 border-b border-slate-200 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-slate-900">Order #{trans.id}</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          trans.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {trans.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">Weight: {trans.weight} KG | Amount: GHS {trans.amountPaid}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>

        <Card className="bg-white border-0 shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Collection Reminders</h2>
            <div className="space-y-4">
              {transactions
                .filter((t) => t.status === 'pending')
                .slice(0, 5)
                .map((trans) => (
                  <div key={trans.id} className="pb-4 border-b border-slate-200 last:border-b-0">
                    <p className="font-semibold text-slate-900 mb-1">Collection Due</p>
                    <p className="text-sm text-slate-600">Date: {trans.collectionDate}</p>
                    <p className="text-sm text-rose-600 font-semibold">Balance: GHS {trans.balance}</p>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Income Statistics</h2>
        <Card className="bg-white border-0 shadow-md p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-slate-600 text-sm mb-1">Total Income</p>
              <p className="text-2xl font-bold text-emerald-600">GHS {metrics.totalIncome}</p>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-1">Pending Amount</p>
              <p className="text-2xl font-bold text-amber-600">
                GHS {transactions.filter((t) => t.status === 'pending').reduce((sum, t) => sum + t.balance, 0)}
              </p>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-1">Total Employees</p>
              <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { currentPage } = useNavigation()

  const pages = {
    dashboard: <DashboardView />,
    employees: <EmployeesPage />,
    customers: <CustomersPage />,
    transactions: <TransactionsPage />,
    notifications: <NotificationsPage />,
    salary: <SalaryPage />,
    reports: <ReportsPage />,
  }

  return pages[currentPage as keyof typeof pages]
}
