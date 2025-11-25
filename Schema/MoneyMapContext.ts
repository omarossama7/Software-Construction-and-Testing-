"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useState, useEffect, createElement } from "react"

export interface Bill {
  id: string
  title: string
  amountNeeded: number
  amountDeposited: number
  dueDate: string
}

export interface Investment {
  id: string
  title: string
  amountNeeded: number
  amountDeposited: number
}

export interface Spending {
  id: string
  title: string
  amountDeposited: number
}

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  currency: string
  isSetup: boolean
  monthlySalary: number
}

export interface InvestmentCategory {
  id: string
  name: string
  percentage: number
  description: string
}

export interface UserData {
  userId: string
  profile: UserProfile
  bills: Bill[]
  investments: Investment[]
  spendings: Spending[]
  investmentCategories: InvestmentCategory[]
}

interface MoneyMapContextType {
  userData: UserData
  isLoading: boolean
  isLoggedIn: boolean
  updateProfile: (profile: Partial<UserProfile>) => void
  addBill: (bill: Omit<Bill, "id">) => void
  updateBill: (id: string, bill: Partial<Bill>) => void
  deleteBill: (id: string) => void
  addInvestment: (investment: Omit<Investment, "id">) => void
  updateInvestment: (id: string, investment: Partial<Investment>) => void
  deleteInvestment: (id: string) => void
  addSpending: (spending: Omit<Spending, "id">) => void
  updateSpending: (id: string, spending: Partial<Spending>) => void
  deleteSpending: (id: string) => void
  setInvestmentCategories: (categories: InvestmentCategory[]) => void
  getMonthlyTotals: () => {
    totalBillsNeeded: number
    totalBillsDeposited: number
    totalInvestmentNeeded: number
    totalInvestmentDeposited: number
    totalSpending: number
  }
  getSpendingAlerts: () => Array<{ title: string; message: string; type: "shortage" | "warning" }>
  getLeftoverAmount: () => number
  login: (email: string, password: string) => boolean
  signup: (firstName: string, lastName: string, email: string, password: string, currency: string) => boolean
  logout: () => void
  changeCurrency: (currency: string) => void
}

const MoneyMapContext = createContext<MoneyMapContextType | undefined>(undefined) as React.Context<MoneyMapContextType | undefined>

const DEFAULT_INVESTMENT_CATEGORIES: InvestmentCategory[] = [
  { id: "1", name: "Stocks", percentage: 40, description: "Equity investments" },
  { id: "2", name: "Bonds", percentage: 30, description: "Fixed income securities" },
  { id: "3", name: "Real Estate", percentage: 20, description: "Property investments" },
  { id: "4", name: "Crypto", percentage: 10, description: "Digital assets" },
  { id: "5", name: "Other", percentage: 0, description: "Custom investment category" }
]

export function MoneyMapProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>({
    userId: "user-1",
    profile: {
      firstName: "",
      lastName: "",
      email: "",
      currency: "USD",
      isSetup: false,
      monthlySalary: 0,
    },
    bills: [],
    investments: [],
    spendings: [],
    investmentCategories: DEFAULT_INVESTMENT_CATEGORIES,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("moneymap-data")
    const loggedIn = localStorage.getItem("moneymap-logged-in")
    if (saved) {
      try {
        setUserData(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load saved data:", e)
      }
    }
    if (loggedIn === "true") {
      setIsLoggedIn(true)
    }
    setIsLoading(false)
  }, [])


  useEffect(() => {
    localStorage.setItem("moneymap-data", JSON.stringify(userData))
  }, [userData])

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }))
  }

  const addBill = (bill: Omit<Bill, "id">) => {
    const newBill: Bill = {
      ...bill,
      id: Date.now().toString(),
    }
    setUserData((prev) => ({
      ...prev,
      bills: [...prev.bills, newBill],
    }))
  }

  const updateBill = (id: string, bill: Partial<Bill>) => {
    setUserData((prev) => ({
      ...prev,
      bills: prev.bills.map((b) => (b.id === id ? { ...b, ...bill } : b)),
    }))
  }

  const deleteBill = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      bills: prev.bills.filter((b) => b.id !== id),
    }))
  }

  const addInvestment = (investment: Omit<Investment, "id">) => {
    const newInvestment: Investment = {
      ...investment,
      id: Date.now().toString(),
    }
    setUserData((prev) => ({
      ...prev,
      investments: [...prev.investments, newInvestment],
    }))
  }

  const updateInvestment = (id: string, investment: Partial<Investment>) => {
    setUserData((prev) => ({
      ...prev,
      investments: prev.investments.map((inv) => (inv.id === id ? { ...inv, ...investment } : inv)),
    }))
  }

  const deleteInvestment = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      investments: prev.investments.filter((inv) => inv.id !== id),
    }))
  }

  const addSpending = (spending: Omit<Spending, "id">) => {
    const newSpending: Spending = {
      ...spending,
      id: Date.now().toString(),
    }
    setUserData((prev) => ({
      ...prev,
      spendings: [...prev.spendings, newSpending],
    }))
  }

  const updateSpending = (id: string, spending: Partial<Spending>) => {
    setUserData((prev) => ({
      ...prev,
      spendings: prev.spendings.map((s) => (s.id === id ? { ...s, ...spending } : s)),
    }))
  }

  const deleteSpending = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      spendings: prev.spendings.filter((s) => s.id !== id),
    }))
  }

  const setInvestmentCategories = (categories: InvestmentCategory[]) => {
    setUserData((prev) => ({
      ...prev,
      investmentCategories: categories,
    }))
  }

  const getMonthlyTotals = () => {
    const totalBillsNeeded = userData.bills.reduce((sum, b) => sum + b.amountNeeded, 0)
    const totalBillsDeposited = userData.bills.reduce((sum, b) => sum + b.amountDeposited, 0)
    const totalInvestmentNeeded = userData.investments.reduce((sum, inv) => sum + inv.amountNeeded, 0)
    const totalInvestmentDeposited = userData.investments.reduce((sum, inv) => sum + inv.amountDeposited, 0)
    const totalSpending = userData.spendings.reduce((sum, s) => sum + s.amountDeposited, 0)

    return {
      totalBillsNeeded,
      totalBillsDeposited,
      totalInvestmentNeeded,
      totalInvestmentDeposited,
      totalSpending,
    }
  }

  const getSpendingAlerts = () => {
    const alerts: Array<{ title: string; message: string; type: "shortage" | "warning" }> = []
    const totals = getMonthlyTotals()

    if (totals.totalBillsDeposited < totals.totalBillsNeeded) {
      alerts.push({
        title: "Bills Shortage",
        message: `You're short by ${userData.profile.currency} ${(totals.totalBillsNeeded - totals.totalBillsDeposited).toFixed(2)} for bills this month`,
        type: "shortage",
      })
    }

    if (totals.totalInvestmentDeposited < totals.totalInvestmentNeeded) {
      alerts.push({
        title: "Investment Shortage",
        message: `You're short by ${userData.profile.currency} ${(totals.totalInvestmentNeeded - totals.totalInvestmentDeposited).toFixed(2)} for investments`,
        type: "warning",
      })
    }

    if (totals.totalSpending > totals.totalBillsNeeded) {
      alerts.push({
        title: "High Spending Alert",
        message: `Your spending (${userData.profile.currency} ${totals.totalSpending.toFixed(2)}) exceeds bills needed`,
        type: "warning",
      })
    }

    return alerts
  }

  const getLeftoverAmount = () => {
    const totals = getMonthlyTotals()
    const totalNeeded = totals.totalBillsNeeded + totals.totalInvestmentNeeded + totals.totalSpending
    return Math.max(0, userData.profile.monthlySalary - totalNeeded)
  }

  const login = (email: string, password: string) => {
    const saved = localStorage.getItem("moneymap-users")
    const users = saved ? JSON.parse(saved) : []
    const user = users.find((u: any) => u.email === email && u.password === password)
    if (user) {
      setUserData(user.data)
      setIsLoggedIn(true)
      localStorage.setItem("moneymap-logged-in", "true")
      return true
    }
    return false
  }

  const signup = (firstName: string, lastName: string, email: string, password: string, currency: string) => {
    const saved = localStorage.getItem("moneymap-users")
    const users = saved ? JSON.parse(saved) : []
    if (users.find((u: any) => u.email === email)) {
      return false
    }
    const newUser = {
      email,
      password,
      data: {
        userId: Date.now().toString(),
        profile: {
          firstName,
          lastName,
          email,
          currency,
          isSetup: true,
          monthlySalary: 0,
        },
        bills: [],
        investments: [],
        spendings: [],
        investmentCategories: DEFAULT_INVESTMENT_CATEGORIES,
      },
    }
    users.push(newUser)
    localStorage.setItem("moneymap-users", JSON.stringify(users))
    setUserData(newUser.data)
    setIsLoggedIn(true)
    localStorage.setItem("moneymap-logged-in", "true")
    return true
  }

  const logout = () => {
    setIsLoggedIn(false)
    localStorage.setItem("moneymap-logged-in", "false")
    setUserData({
      userId: "user-1",
      profile: {
        firstName: "",
        lastName: "",
        email: "",
        currency: "USD",
        isSetup: false,
        monthlySalary: 0,
      },
      bills: [],
      investments: [],
      spendings: [],
      investmentCategories: DEFAULT_INVESTMENT_CATEGORIES,
    })
  }

  const changeCurrency = (currency: string) => {
    updateProfile({ currency })
  }

  return createElement(
    MoneyMapContext.Provider,
    {
      value: {
        userData,
        isLoading,
        isLoggedIn,
        updateProfile,
        addBill,
        updateBill,
        deleteBill,
        addInvestment,
        updateInvestment,
        deleteInvestment,
        addSpending,
        updateSpending,
        deleteSpending,
        setInvestmentCategories,
        getMonthlyTotals,
        getSpendingAlerts,
        getLeftoverAmount,
        login,
        signup,
        logout,
        changeCurrency,
      },
    },
    children
  )
}

export function useMoneyMap() {
  const schema = useContext(MoneyMapContext)
  if (!schema) {
    throw new Error("useMoneyMap must be used within MoneyMapProvider")
  }
  return schema
}