'use client'

import { useDataStore } from '@/hooks/use-data-store'
import { Card } from '@/components/ui/card'
import { AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function NotificationsPage() {
  const transactions = useDataStore((state) => state.transactions)
  const customers = useDataStore((state) => state.customers)

  const today = new Date().toISOString().split('T')[0]
  const upcomingCollections = transactions
    .filter((t) => t.status === 'pending')
    .sort((a, b) => new Date(a.collectionDate).getTime() - new Date(b.collectionDate).getTime())

  const getCustomerName = (id: string) => customers.find((c) => c.id === id)?.name || 'Unknown'

  const getStatus = (collectionDate: string) => {
    if (collectionDate < today) return 'overdue'
    if (collectionDate === today) return 'due'
    return 'upcoming'
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Collection Reminders</h1>

      <div className="space-y-4">
        {upcomingCollections.length === 0 ? (
          <Card className="bg-white border-0 shadow-md p-8 text-center">
            <p className="text-slate-600 text-lg">No pending collections</p>
          </Card>
        ) : (
          upcomingCollections.map((trans) => {
            const status = getStatus(trans.collectionDate)
            const statusConfig = {
              overdue: { color: 'bg-rose-50 border-rose-200', icon: AlertCircle, iconColor: 'text-rose-600', badge: 'bg-rose-100 text-rose-700' },
              due: { color: 'bg-amber-50 border-amber-200', icon: Clock, iconColor: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
              upcoming: { color: 'bg-blue-50 border-blue-200', icon: CheckCircle, iconColor: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
            }
            const config = statusConfig[status]
            const Icon = config.icon

            return (
              <Card key={trans.id} className={`${config.color} border shadow-md`}>
                <div className="p-6 flex items-start gap-4">
                  <Icon className={`${config.iconColor} w-6 h-6 flex-shrink-0 mt-1`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{getCustomerName(trans.customerId)}</h3>
                        <p className="text-sm text-slate-600">Collection Date: {trans.collectionDate}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}>
                        {status === 'overdue' ? 'Overdue' : status === 'due' ? 'Due Today' : 'Upcoming'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-current border-opacity-10">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Weight</p>
                        <p className="font-semibold text-slate-900">{trans.weight} KG</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Amount Due</p>
                        <p className="font-semibold text-slate-900">PKR {trans.balance}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Order Date</p>
                        <p className="font-semibold text-slate-900">{trans.orderDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
