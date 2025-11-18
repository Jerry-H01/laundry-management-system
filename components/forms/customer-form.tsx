'use client'

import { useState } from 'react'
import { Customer } from '@/hooks/use-data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CustomerFormProps {
  customer: Customer | null
  onSave: (data: Omit<Customer, 'id'>) => void
  onCancel: () => void
}

export function CustomerForm({ customer, onSave, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>(
    customer || {
      name: '',
      phone: '',
      address: '',
      totalTransactions: 0,
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card className="bg-white border-0 shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        {customer ? 'Edit Customer' : 'Add New Customer'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-900 mb-2">Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
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
