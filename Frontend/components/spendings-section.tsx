"use client"

import type React from "react"

import { useState } from "react"
import { useMoneyMap } from "../../Schema/MoneyMapContext"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Trash2, Plus } from "lucide-react"

export default function SpendingsSection() {
  const { userData, addSpending, deleteSpending } = useMoneyMap()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [amountDeposited, setAmountDeposited] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !amountDeposited) return

    addSpending({
      title,
      amountDeposited: Number.parseFloat(amountDeposited),
    })

    setTitle("")
    setAmountDeposited("")
    setShowForm(false)
  }

  const totalSpending = userData.spendings.reduce((sum, s) => sum + s.amountDeposited, 0)

  return (
    <Card className="p-8 bg-slate-900/40 backdrop-blur border border-orange-500/40 hover:border-orange-400 transition-all duration-300 shadow-lg hover:shadow-orange-500/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Spendings</h2>
          <p className="text-sm text-orange-200/60 mt-1">Monitor and track your spending habits</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 gap-2 shadow-lg hover:shadow-orange-500/50 uppercase font-semibold"
        >
          <Plus size={18} />
          Add Spending
        </Button>
      </div>

      {/* Summary */}
      <div className="bg-slate-800/50 p-4 rounded-lg mb-6 border border-orange-500/30 hover:border-orange-400 transition-all backdrop-blur">
        <p className="text-xs text-orange-300 mb-1 uppercase tracking-wider font-semibold">Total Spending</p>
        <p className="text-3xl font-bold text-orange-400">
          {userData.profile.currency} {totalSpending.toFixed(2)}
        </p>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 p-6 rounded-lg mb-6 space-y-4 border border-orange-500/30 backdrop-blur"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Spending category (e.g., Groceries)"
            className="w-full px-4 py-2 border border-orange-500/30 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all backdrop-blur"
            required
          />
          <input
            type="number"
            step="0.01"
            value={amountDeposited}
            onChange={(e) => setAmountDeposited(e.target.value)}
            placeholder="Amount spent"
            className="w-full px-4 py-2 border border-orange-500/30 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all backdrop-blur"
            required
          />
          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 uppercase font-semibold"
            >
              Add Spending
            </Button>
            <Button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 uppercase font-semibold"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Spendings List */}
      <div className="space-y-3">
        {userData.spendings.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No spendings recorded yet</p>
        ) : (
          userData.spendings.map((spending) => (
            <div
              key={spending.id}
              className="bg-slate-800/50 p-4 rounded-lg flex items-center justify-between border border-orange-500/30 hover:border-orange-400 transition-all hover:bg-slate-800/70 backdrop-blur"
            >
              <div className="flex-1">
                <p className="font-semibold text-white">{spending.title}</p>
                <p className="text-lg text-orange-400 font-semibold mt-1">
                  {userData.profile.currency} {spending.amountDeposited.toFixed(2)}
                </p>
              </div>
              <Button
                onClick={() => deleteSpending(spending.id)}
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
