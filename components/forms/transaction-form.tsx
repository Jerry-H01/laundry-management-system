'use client'

import { useState, useEffect } from 'react'
import { Transaction, useDataStore } from '@/hooks/use-data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TransactionFormProps {
  transaction: Transaction | null
  onSave: (data: Omit<Transaction, 'id'>) => void
  onCancel: () => void
}

export function TransactionForm({ transaction, onSave, onCancel }: TransactionFormProps) {
  const customers = useDataStore((state) => state.customers)
  const employees = useDataStore((state) => state.employees)

  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>(
    transaction || {
      customerId: '',
      employeeId: '',
      weight: 0,
      orderDate: new Date().toISOString().split('T')[0],
      collectionDate: new Date().toISOString().split('T')[0],
      amountToPay: 0,
      amountPaid: 0,
      balance: 0,
      status: 'pending',
    }
  )

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      balance: prev.amountToPay - prev.amountPaid,
    }))
  }, [formData.amountToPay, formData.amountPaid])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card className="bg-white border-0 shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        {transaction ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Customer</label>
            <select
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            >
              <option value="">Select Customer</option>
              {customers.map((cust) => (
                <option key={cust.id} value={cust.id}>{cust.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Employee</label>
            <select
              required
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Weight (KG)</label>
            <input
              type="number"
              required
              min="0"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Order Date</label>
            <input
              type="date"
              required
              value={formData.orderDate}
              onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Collection Date</label>
            <input
              type="date"
              required
              value={formData.collectionDate}
              onChange={(e) => setFormData({ ...formData, collectionDate: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Amount to Pay (GHS)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.amountToPay}
              onChange={(e) => setFormData({ ...formData, amountToPay: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Amount Paid (GHS)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.amountPaid}
              onChange={(e) => setFormData({ ...formData, amountPaid: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'completed' })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Balance (Auto-calculated)</label>
            <input
              type="number"
              disabled
              value={formData.balance}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
          >
            Save
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="px-8"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
