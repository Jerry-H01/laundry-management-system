'use client'

import { useState } from 'react'
import { useDataStore, Transaction } from '@/hooks/use-data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2, Plus, Check } from 'lucide-react'
import { TransactionForm } from '@/components/forms/transaction-form'

export function TransactionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const transactions = useDataStore((state) => state.transactions)
  const addTransaction = useDataStore((state) => state.addTransaction)
  const updateTransaction = useDataStore((state) => state.updateTransaction)
  const deleteTransaction = useDataStore((state) => state.deleteTransaction)
  const customers = useDataStore((state) => state.customers)
  const employees = useDataStore((state) => state.employees)

  const handleSave = (data: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data)
    } else {
      addTransaction(data)
    }
    setIsFormOpen(false)
    setEditingTransaction(null)
  }

  const handleMarkCompleted = (id: string) => {
    const trans = transactions.find((t) => t.id === id)
    if (trans) {
      updateTransaction(id, { ...trans, status: 'completed' })
    }
  }

  const getCustomerName = (id: string) => customers.find((c) => c.id === id)?.name || 'Unknown'
  const getEmployeeName = (id: string) => employees.find((e) => e.id === id)?.name || 'Unknown'

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
        <Button
          onClick={() => {
            setEditingTransaction(null)
            setIsFormOpen(true)
          }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </div>

      {isFormOpen && (
        <TransactionForm
          transaction={editingTransaction}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingTransaction(null)
          }}
        />
      )}

      <Card className="bg-white border-0 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Weight (KG)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Order Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Collection</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Balance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions.map((trans) => (
                <tr key={trans.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{getCustomerName(trans.customerId)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{trans.weight} KG</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{trans.orderDate}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{trans.collectionDate}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">GHS {trans.amountToPay}</td>
                  <td className="px-6 py-4 text-sm text-rose-600 font-medium">GHS {trans.balance}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        trans.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {trans.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      {trans.status === 'pending' && (
                        <Button
                          onClick={() => handleMarkCompleted(trans.id)}
                          variant="ghost"
                          size="sm"
                          className="text-emerald-600 hover:bg-emerald-50"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          setEditingTransaction(trans)
                          setIsFormOpen(true)
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteTransaction(trans.id)}
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
