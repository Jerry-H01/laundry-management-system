'use client'

import { useState } from 'react'
import { useDataStore } from '@/hooks/use-data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SalaryPaymentFormProps {
  onSave: (data: { employeeId: string; amount: number; paymentDate: string }) => void
  onCancel: () => void
}

export function SalaryPaymentForm({ onSave, onCancel }: SalaryPaymentFormProps) {
  const employees = useDataStore((state) => state.employees)
  const [formData, setFormData] = useState({
    employeeId: '',
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const selectedEmployee = employees.find((emp) => emp.id === formData.employeeId)

  return (
    <Card className="bg-white border-0 shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Record Salary Payment</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Employee</label>
            <select
              required
              value={formData.employeeId}
              onChange={(e) => {
                const selectedEmp = employees.find((emp) => emp.id === e.target.value)
                setFormData({
                  ...formData,
                  employeeId: e.target.value,
                  amount: selectedEmp?.salary || 0,
                })
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Payment Date</label>
            <input
              type="date"
              required
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-900 mb-2">Amount (GHS)</label>
            <div className="flex gap-2">
              <input
                type="number"
                required
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
              {selectedEmployee && (
                <Button
                  type="button"
                  onClick={() => setFormData({ ...formData, amount: selectedEmployee.salary })}
                  variant="outline"
                  className="px-4"
                >
                  Use Salary
                </Button>
              )}
            </div>
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
