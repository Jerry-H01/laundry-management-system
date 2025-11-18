'use client'

import { useState } from 'react'
import { useDataStore } from '@/hooks/use-data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export function ReportsPage() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [reportType, setReportType] = useState('customers')
  const transactions = useDataStore((state) => state.transactions)
  const customers = useDataStore((state) => state.customers)
  const employees = useDataStore((state) => state.employees)
  const salaryPayments = useDataStore((state) => state.salaryPayments)

  const filterByDate = (items: any[], dateField: string) => {
    if (!dateRange.from || !dateRange.to) return items
    return items.filter((item) => {
      const itemDate = item[dateField]
      return itemDate >= dateRange.from && itemDate <= dateRange.to
    })
  }

  const generateCustomerReport = () => {
    const filteredTransactions = filterByDate(transactions, 'orderDate')
    const report = customers.map((cust) => {
      const custTransactions = filteredTransactions.filter((t) => t.customerId === cust.id)
      return {
        'Customer Name': cust.name,
        'Phone': cust.phone,
        'Address': cust.address,
        'Total Orders': custTransactions.length,
        'Total Weight (KG)': custTransactions.reduce((sum, t) => sum + t.weight, 0),
        'Total Amount': custTransactions.reduce((sum, t) => sum + t.amountToPay, 0),
        'Amount Paid': custTransactions.reduce((sum, t) => sum + t.amountPaid, 0),
        'Outstanding Balance': custTransactions.reduce((sum, t) => sum + t.balance, 0),
      }
    })
    return report.filter((r) => r['Total Orders'] > 0)
  }

  const generateTransactionReport = () => {
    return filterByDate(transactions, 'orderDate').map((t) => ({
      'Order ID': t.id,
      'Customer': customers.find((c) => c.id === t.customerId)?.name || 'Unknown',
      'Weight (KG)': t.weight,
      'Order Date': t.orderDate,
      'Collection Date': t.collectionDate,
      'Amount': t.amountToPay,
      'Paid': t.amountPaid,
      'Balance': t.balance,
      'Status': t.status,
    }))
  }

  const generateSalaryReport = () => {
    return filterByDate(salaryPayments, 'paymentDate').map((p) => ({
      'Employee': employees.find((e) => e.id === p.employeeId)?.name || 'Unknown',
      'Amount': p.amount,
      'Payment Date': p.paymentDate,
    }))
  }

  const getReport = () => {
    switch (reportType) {
      case 'customers':
        return generateCustomerReport()
      case 'transactions':
        return generateTransactionReport()
      case 'salaries':
        return generateSalaryReport()
      default:
        return []
    }
  }

  const downloadReport = () => {
    const report = getReport()
    if (report.length === 0) {
      alert('No data to export')
      return
    }

    const headers = Object.keys(report[0])
    const rows = report.map((item) => headers.map((header) => item[header as keyof typeof item]))

    let csv = headers.join(',') + '\n'
    rows.forEach((row) => {
      csv += row.join(',') + '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const report = getReport()

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Reports</h1>

      <Card className="bg-white border-0 shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            >
              <option value="customers">Customer Report</option>
              <option value="transactions">Transaction Report</option>
              <option value="salaries">Salary Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">From Date</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">To Date</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={downloadReport}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-white border-0 shadow-md overflow-hidden">
        {report.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600 text-lg">No data available for the selected filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  {Object.keys(report[0]).map((header) => (
                    <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {report.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {Object.values(item).map((value, cellIdx) => (
                      <td key={cellIdx} className="px-6 py-4 text-sm text-slate-600">
                        {typeof value === 'number' ? (
                          value.toLocaleString()
                        ) : (
                          value
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
