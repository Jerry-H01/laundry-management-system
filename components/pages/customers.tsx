'use client'

import { useState } from 'react'
import { useDataStore, Customer } from '@/hooks/use-data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2, Plus } from 'lucide-react'
import { CustomerForm } from '@/components/forms/customer-form'

export function CustomersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const customers = useDataStore((state) => state.customers)
  const addCustomer = useDataStore((state) => state.addCustomer)
  const updateCustomer = useDataStore((state) => state.updateCustomer)
  const deleteCustomer = useDataStore((state) => state.deleteCustomer)

  const handleSave = (data: Omit<Customer, 'id'>) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data)
    } else {
      addCustomer(data)
    }
    setIsFormOpen(false)
    setEditingCustomer(null)
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
        <Button
          onClick={() => {
            setEditingCustomer(null)
            setIsFormOpen(true)
          }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      {isFormOpen && (
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingCustomer(null)
          }}
        />
      )}

      <Card className="bg-white border-0 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Address</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Transactions</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{cust.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cust.phone}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cust.address}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cust.totalTransactions}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setEditingCustomer(cust)
                          setIsFormOpen(true)
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteCustomer(cust.id)}
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
