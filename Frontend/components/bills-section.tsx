"use client"

import type React from "react"

import { useState } from "react"
import { useMoneyMap } from "../../Schema/MoneyMapContext"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Trash2, Plus } from "lucide-react"

export default function BillsSection() {
  const { userData, addBill, updateBill, deleteBill } = useMoneyMap()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [amountNeeded, setAmountNeeded] = useState("")
  const [amountDeposited, setAmountDeposited] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [dateError, setDateError] = useState("")

  const formatDateToDDMMYYYY = (dateString: string): string => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const getTodayDateString = (): string => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !amountNeeded || !amountDeposited || !dueDate) return

    const selectedDate = new Date(dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      setDateError("Due date cannot be in the past")
      return
    }

    setDateError("")
    addBill({
      title,
      amountNeeded: Number.parseFloat(amountNeeded),
      amountDeposited: Number.parseFloat(amountDeposited),
      dueDate,
    })

    setTitle("")
    setAmountNeeded("")
    setAmountDeposited("")
    setDueDate("")
    setShowForm(false)
  }

  const totalNeeded = userData.bills.reduce((sum, b) => sum + b.amountNeeded, 0)
  const totalDeposited = userData.bills.reduce((sum, b) => sum + b.amountDeposited, 0)
  const shortage = Math.max(0, totalNeeded - totalDeposited)

  return (
    <Card className="p-8 bg-slate-900/40 backdrop-blur border border-cyan-500/40 hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Bills</h2>
          <p className="text-sm text-cyan-200/60 mt-1">Track and manage your monthly bills</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 gap-2 shadow-lg hover:shadow-cyan-500/50 uppercase font-semibold"
        >
          <Plus size={18} />
          Add Bill
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all backdrop-blur">
          <p className="text-xs text-cyan-300 mb-1 uppercase tracking-wider font-semibold">Total Needed</p>
          <p className="text-2xl font-bold text-cyan-400">
            {userData.profile.currency} {totalNeeded.toFixed(2)}
          </p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/30 hover:border-green-400 transition-all backdrop-blur">
          <p className="text-xs text-green-300 mb-1 uppercase tracking-wider font-semibold">Total Deposited</p>
          <p className="text-2xl font-bold text-green-400">
            {userData.profile.currency} {totalDeposited.toFixed(2)}
          </p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-yellow-500/30 hover:border-yellow-400 transition-all backdrop-blur">
          <p className="text-xs text-yellow-300 mb-1 uppercase tracking-wider font-semibold">Shortage</p>
          <p className={`text-2xl font-bold ${shortage > 0 ? "text-yellow-400" : "text-green-400"}`}>
            {userData.profile.currency} {shortage.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 p-6 rounded-lg mb-6 space-y-4 border border-cyan-500/30 backdrop-blur"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bill title (e.g., Electricity)"
            className="w-full px-4 py-2 border border-cyan-500/30 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur"
            required
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              step="0.01"
              value={amountNeeded}
              onChange={(e) => setAmountNeeded(e.target.value)}
              placeholder="Amount needed"
              className="px-4 py-2 border border-cyan-500/30 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur"
              required
            />
            <input
              type="number"
              step="0.01"
              value={amountDeposited}
              onChange={(e) => setAmountDeposited(e.target.value)}
              placeholder="Amount deposited"
              className="px-4 py-2 border border-cyan-500/30 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur"
              required
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value)
                setDateError("")
              }}
              min={getTodayDateString()}
              className="px-4 py-2 border border-cyan-500/30 rounded-lg bg-slate-700/50 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur"
              required
            />
          </div>
          {dateError && <p className="text-red-400 text-sm font-semibold">{dateError}</p>}
          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 uppercase font-semibold"
            >
              Add Bill
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowForm(false)
                setDateError("")
              }}
              className="flex-1 bg-slate-700 hover:bg-slate-600 uppercase font-semibold"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Bills List */}
      <div className="space-y-3">
        {userData.bills.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No bills added yet</p>
        ) : (
          userData.bills.map((bill) => (
            <div
              key={bill.id}
              className="bg-slate-800/50 p-4 rounded-lg flex items-center justify-between border border-cyan-500/30 hover:border-cyan-400 transition-all hover:bg-slate-800/70 backdrop-blur"
            >
              <div className="flex-1">
                <p className="font-semibold text-white">{bill.title}</p>
                <p className="text-sm text-cyan-200/60">Due: {formatDateToDDMMYYYY(bill.dueDate)}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-sm">
                    Needed:{" "}
                    <span className="text-cyan-400 font-semibold">
                      {userData.profile.currency} {bill.amountNeeded.toFixed(2)}
                    </span>
                  </span>
                  <span className="text-sm">
                    Deposited:{" "}
                    <span className="text-green-400 font-semibold">
                      {userData.profile.currency} {bill.amountDeposited.toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>
              <Button
                onClick={() => deleteBill(bill.id)}
                className="bg-red-600 hover:bg-red-700 gap-2 shadow-lg hover:shadow-red-500/50"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
