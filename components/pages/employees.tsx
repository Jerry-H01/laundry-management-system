'use client'

import { useState } from 'react'
import { useDataStore, Employee } from '@/hooks/use-data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2, Plus } from 'lucide-react'
import { EmployeeForm } from '@/components/forms/employee-form'

export function EmployeesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const employees = useDataStore((state) => state.employees)
  const addEmployee = useDataStore((state) => state.addEmployee)
  const updateEmployee = useDataStore((state) => state.updateEmployee)
  const deleteEmployee = useDataStore((state) => state.deleteEmployee)

  const handleSave = (data: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, data)
    } else {
      addEmployee(data)
    }
    setIsFormOpen(false)
    setEditingEmployee(null)
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
        <Button
          onClick={() => {
            setEditingEmployee(null)
            setIsFormOpen(true)
          }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      {isFormOpen && (
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingEmployee(null)
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Salary</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{emp.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{emp.phone}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{emp.role}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">GHS {emp.salary}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        emp.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setEditingEmployee(emp)
                          setIsFormOpen(true)
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteEmployee(emp.id)}
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
