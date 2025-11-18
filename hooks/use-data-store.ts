import { create } from 'zustand'

export interface Admin {
  id: string
  username: string
  password: string
  name: string
}

export interface Employee {
  id: string
  name: string
  phone: string
  role: string
  salary: number
  address: string
  status: 'active' | 'inactive'
}

export interface Customer {
  id: string
  name: string
  phone: string
  address: string
  totalTransactions: number
}

export interface Transaction {
  id: string
  customerId: string
  employeeId: string
  weight: number
  orderDate: string
  collectionDate: string
  amountToPay: number
  amountPaid: number
  balance: number
  status: 'pending' | 'completed'
}

export interface SalaryPayment {
  id: string
  employeeId: string
  amount: number
  paymentDate: string
}

interface DataStore {
  currentAdmin: Admin | null
  login: (username: string, password: string) => boolean
  logout: () => void
  
  employees: Employee[]
  customers: Customer[]
  transactions: Transaction[]
  salaryPayments: SalaryPayment[]
  
  addEmployee: (employee: Omit<Employee, 'id'>) => void
  updateEmployee: (id: string, employee: Omit<Employee, 'id'>) => void
  deleteEmployee: (id: string) => void
  
  addCustomer: (customer: Omit<Customer, 'id'>) => void
  updateCustomer: (id: string, customer: Omit<Customer, 'id'>) => void
  deleteCustomer: (id: string) => void
  
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  
  addSalaryPayment: (payment: Omit<SalaryPayment, 'id'>) => void
  
  getMetrics: () => {
    totalEmployees: number
    totalCustomers: number
    totalTransactions: number
    pendingTransactions: number
    totalIncome: number
  }
}

let metricsCache: ReturnType<DataStore['getMetrics']> | null = null
let lastState: { employees: Employee[], customers: Customer[], transactions: Transaction[], salaryPayments: SalaryPayment[] } | null = null

const SEEDED_ADMINS: Admin[] = [
  { id: '1', username: 'admin', password: 'admin123', name: 'Admin User' },
  { id: '2', username: 'manager', password: 'manager123', name: 'Manager' },
]

export const useDataStore = create<DataStore>((set, get) => ({
  currentAdmin: null,
  
  login: (username, password) => {
    const admin = SEEDED_ADMINS.find(a => a.username === username && a.password === password)
    if (admin) {
      set({ currentAdmin: admin })
      return true
    }
    return false
  },
  
  logout: () => set({ currentAdmin: null }),

  employees: [
    { id: '1', name: 'Ahmad Khan', phone: '03001234567', role: 'Manager', salary: 50000, address: 'Karachi', status: 'active' },
    { id: '2', name: 'Fatima Ali', phone: '03009876543', role: 'Staff', salary: 25000, address: 'Karachi', status: 'active' },
  ],
  customers: [
    { id: '1', name: 'Hassan Ahmed', phone: '03101234567', address: 'Clifton', totalTransactions: 5 },
    { id: '2', name: 'Zainab Khan', phone: '03109876543', address: 'Defence', totalTransactions: 3 },
  ],
  transactions: [
    {
      id: '1',
      customerId: '1',
      employeeId: '1',
      weight: 5,
      orderDate: '2025-01-15',
      collectionDate: '2025-01-17',
      amountToPay: 500,
      amountPaid: 500,
      balance: 0,
      status: 'completed',
    },
    {
      id: '2',
      customerId: '2',
      employeeId: '2',
      weight: 3,
      orderDate: '2025-01-16',
      collectionDate: '2025-01-18',
      amountToPay: 300,
      amountPaid: 0,
      balance: 300,
      status: 'pending',
    },
  ],
  salaryPayments: [
    { id: '1', employeeId: '1', amount: 50000, paymentDate: '2025-01-01' },
  ],

  addEmployee: (employee) =>
    set((state) => ({
      employees: [...state.employees, { ...employee, id: Date.now().toString() }],
    })),

  updateEmployee: (id, employee) =>
    set((state) => ({
      employees: state.employees.map((e) => (e.id === id ? { ...employee, id } : e)),
    })),

  deleteEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((e) => e.id !== id),
    })),

  addCustomer: (customer) =>
    set((state) => ({
      customers: [...state.customers, { ...customer, id: Date.now().toString() }],
    })),

  updateCustomer: (id, customer) =>
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...customer, id } : c)),
    })),

  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [...state.transactions, { ...transaction, id: Date.now().toString() }],
    })),

  updateTransaction: (id, transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...transaction, id } : t)),
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  addSalaryPayment: (payment) =>
    set((state) => ({
      salaryPayments: [...state.salaryPayments, { ...payment, id: Date.now().toString() }],
    })),

  getMetrics: () => {
    const state = get()
    const stateChanged = lastState === null || 
      lastState.employees !== state.employees ||
      lastState.customers !== state.customers ||
      lastState.transactions !== state.transactions ||
      lastState.salaryPayments !== state.salaryPayments

    if (stateChanged) {
      const totalIncome = state.transactions
        .filter((t) => t.status === 'completed')
        .reduce((sum, t) => sum + t.amountPaid, 0)
      const pendingTransactions = state.transactions.filter((t) => t.status === 'pending').length

      metricsCache = {
        totalEmployees: state.employees.length,
        totalCustomers: state.customers.length,
        totalTransactions: state.transactions.length,
        pendingTransactions,
        totalIncome,
      }
      lastState = {
        employees: state.employees,
        customers: state.customers,
        transactions: state.transactions,
        salaryPayments: state.salaryPayments,
      }
    }

    return metricsCache!
  },
}))
