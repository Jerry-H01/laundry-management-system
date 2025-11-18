'use client'

import { useState } from 'react'
import { useDataStore } from '@/hooks/use-data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SalaryPaymentForm } from '@/components/forms/salary-payment-form'

export function SalaryPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const employees = useDataStore((state) => state.employees)
  const salaryPayments = useDataStore((state) => state.salaryPayments)
  const addSalaryPayment = useDataStore((state) => state.addSalaryPayment)

  const handleSave = (data: { employeeId: string; amount: number; paymentDate: string }) => {
    addSalaryPayment(data)
    setIsFormOpen(false)
  }

  const getEmployeeName = (id: string) => employees.find((e) => e.id === id)?.name || 'Unknown'

  const totalPaid = salaryPayments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Salary Payment</h1>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Record Payment
        </Button>
      </div>

      {isFormOpen && (
        <SalaryPaymentForm
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-0 shadow-md p-6">
          <p className="text-slate-600 text-sm mb-1">Total Paid</p>
          <p className="text-3xl font-bold text-emerald-600">GHS {totalPaid}</p>
        </Card>
        <Card className="bg-white border-0 shadow-md p-6">
          <p className="text-slate-600 text-sm mb-1">Total Employees</p>
          <p className="text-3xl font-bold text-blue-600">{employees.length}</p>
        </Card>
        <Card className="bg-white border-0 shadow-md p-6">
          <p className="text-slate-600 text-sm mb-1">Payments This Month</p>
          <p className="text-3xl font-bold text-amber-600">{salaryPayments.length}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border-0 shadow-md overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Employee Salaries</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Employee</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Monthly Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">{emp.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">GHS {emp.salary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="bg-white border-0 shadow-md overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Payment History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Employee</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {salaryPayments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm text-slate-600 text-center">
                      No payments recorded
                    </td>
                  </tr>
                ) : (
                  salaryPayments
                    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
                    .map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">{getEmployeeName(payment.employeeId)}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">GHS {payment.amount}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{payment.paymentDate}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
