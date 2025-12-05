"use client"

import type React from "react"

import { useState } from "react"
import { useMoneyMap } from "../../Schema/MoneyMapContext"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { DollarSign } from "lucide-react"

export default function SalarySection() {
  const { userData, updateProfile, getMonthlyTotals, getLeftoverAmount } = useMoneyMap()
  const [isEditing, setIsEditing] = useState(false)
  const [salaryInput, setSalaryInput] = useState((userData.profile.monthlySalary ?? 0).toString())

  const handleSalaryUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    const salary = Number.parseFloat(salaryInput)
    if (!isNaN(salary) && salary >= 0) {
      updateProfile({ monthlySalary: salary })
      setIsEditing(false)
    }
  }

  const totals = getMonthlyTotals()
  const totalExpenses = totals.totalBillsNeeded + totals.totalInvestmentNeeded + totals.totalSpending
  const leftover = getLeftoverAmount()
  const salaryPercentageUsed =
    (userData.profile.monthlySalary ?? 0) > 0 ? (totalExpenses / (userData.profile.monthlySalary ?? 0)) * 100 : 0

  return (
    <Card className="p-8 bg-slate-900/40 backdrop-blur border border-cyan-500/40 hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-green-500 rounded-lg shadow-lg shadow-cyan-500/50">
            <DollarSign className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Monthly Salary</h2>
            <p className="text-sm text-cyan-200/60">Set your income to calculate leftover funds</p>
          </div>
        </div>
      </div>

      {!isEditing ? (
        <div className="space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-cyan-500/30 backdrop-blur">
            <p className="text-sm text-cyan-300 mb-2 uppercase tracking-wider font-semibold">Current Monthly Salary</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-4">
              {userData.profile.currency} {(userData.profile.monthlySalary ?? 0).toFixed(2)}
            </p>
            <Button
              onClick={() => {
                setSalaryInput((userData.profile.monthlySalary ?? 0).toString())
                setIsEditing(true)
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white uppercase font-semibold shadow-lg hover:shadow-cyan-500/50"
            >
              Update Salary
            </Button>
          </div>

          {(userData.profile.monthlySalary ?? 0) > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-yellow-500/30 hover:border-yellow-400 transition-all backdrop-blur">
                <p className="text-xs text-yellow-300 mb-2 uppercase tracking-wider font-semibold">Total Expenses</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {userData.profile.currency} {totalExpenses.toFixed(2)}
                </p>
                <p className="text-xs text-slate-400 mt-2">{salaryPercentageUsed.toFixed(1)}% of salary</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/30 hover:border-green-400 transition-all backdrop-blur">
                <p className="text-xs text-green-300 mb-2 uppercase tracking-wider font-semibold">Leftover Amount</p>
                <p className={`text-2xl font-bold ${leftover > 0 ? "text-green-400" : "text-red-400"}`}>
                  {userData.profile.currency} {leftover.toFixed(2)}
                </p>
                <p className="text-xs text-slate-400 mt-2">{(100 - salaryPercentageUsed).toFixed(1)}% available</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all backdrop-blur">
                <p className="text-xs text-cyan-300 mb-2 uppercase tracking-wider font-semibold">Savings Rate</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {((leftover / (userData.profile.monthlySalary ?? 1)) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-slate-400 mt-2">of monthly income</p>
              </div>
            </div>
          )}

          {(userData.profile.monthlySalary ?? 0) === 0 && (
            <div className="bg-cyan-950/50 border border-cyan-500/50 p-4 rounded-lg backdrop-blur">
              <p className="text-cyan-200 text-sm">
                💡 Set your monthly salary to enable investment recommendations and track your savings rate.
              </p>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSalaryUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-cyan-300 mb-2 uppercase tracking-wider">
              Monthly Salary ({userData.profile.currency})
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              placeholder="Enter your monthly salary"
              className="w-full px-4 py-3 border border-cyan-500/30 rounded-lg bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-lg backdrop-blur"
              autoFocus
              required
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-semibold uppercase shadow-lg hover:shadow-cyan-500/50"
            >
              Save Salary
            </Button>
            <Button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white uppercase font-semibold"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Card>
  )
}
