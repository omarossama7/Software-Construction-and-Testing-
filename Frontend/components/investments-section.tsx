"use client"

import type React from "react"

import { useState } from "react"
import { useMoneyMap } from "../../Schema/MoneyMapContext"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Trash2, Plus } from "lucide-react"

export default function InvestmentsSection() {
  const { userData, addInvestment, deleteInvestment } = useMoneyMap()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [amountNeeded, setAmountNeeded] = useState("")
  const [amountDeposited, setAmountDeposited] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !amountNeeded || !amountDeposited) return

    addInvestment({
      title,
      amountNeeded: Number.parseFloat(amountNeeded),
      amountDeposited: Number.parseFloat(amountDeposited),
    })

    setTitle("")
    setAmountNeeded("")
    setAmountDeposited("")
    setShowForm(false)
  }

  const totalNeeded = userData.investments.reduce((sum, inv) => sum + inv.amountNeeded, 0)
  const totalDeposited = userData.investments.reduce((sum, inv) => sum + inv.amountDeposited, 0)
  const shortage = Math.max(0, totalNeeded - totalDeposited)

  return (
    <Card className="p-8 bg-slate-900/40 backdrop-blur border border-purple-500/40 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-purple-500/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Investments</h2>
          <p className="text-sm text-purple-200/60 mt-1">Track and manage your investment portfolio</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 gap-2 shadow-lg hover:shadow-purple-500/50 uppercase font-semibold"
        >
          <Plus size={18} />
          Add Investment
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/30 hover:border-purple-400 transition-all backdrop-blur">
          <p className="text-xs text-purple-300 mb-1 uppercase tracking-wider font-semibold">Total Needed</p>
          <p className="text-2xl font-bold text-purple-400">
            {userData.profile.currency} {totalNeeded.toFixed(2)}
          </p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-emerald-500/30 hover:border-emerald-400 transition-all backdrop-blur">
          <p className="text-xs text-emerald-300 mb-1 uppercase tracking-wider font-semibold">Total Deposited</p>
          <p className="text-2xl font-bold text-emerald-400">
            {userData.profile.currency} {totalDeposited.toFixed(2)}
          </p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-pink-500/30 hover:border-pink-400 transition-all backdrop-blur">
          <p className="text-xs text-pink-300 mb-1 uppercase tracking-wider font-semibold">Shortage</p>
          <p className={`text-2xl font-bold ${shortage > 0 ? "text-pink-400" : "text-emerald-400"}`}>
            {userData.profile.currency} {shortage.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 p-6 rounded-lg mb-6 space-y-4 border border-purple-500/30 backdrop-blur"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Investment title (e.g., Stock Portfolio)"
            className="w-full px-4 py-2 border border-purple-500/30 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all backdrop-blur"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              step="0.01"
              value={amountNeeded}
              onChange={(e) => setAmountNeeded(e.target.value)}
              placeholder="Amount needed"
              className="px-4 py-2 border border-purple-500/30 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all backdrop-blur"
              required
            />
            <input
              type="number"
              step="0.01"
              value={amountDeposited}
              onChange={(e) => setAmountDeposited(e.target.value)}
              placeholder="Amount deposited"
              className="px-4 py-2 border border-purple-500/30 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all backdrop-blur"
              required
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 uppercase font-semibold"
            >
              Add Investment
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

      {/* Investments List */}
      <div className="space-y-3">
        {userData.investments.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No investments added yet</p>
        ) : (
          userData.investments.map((inv) => (
            <div
              key={inv.id}
              className="bg-slate-800/50 p-4 rounded-lg flex items-center justify-between border border-purple-500/30 hover:border-purple-400 transition-all hover:bg-slate-800/70 backdrop-blur"
            >
              <div className="flex-1">
                <p className="font-semibold text-white">{inv.title}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-sm">
                    Needed:{" "}
                    <span className="text-purple-400 font-semibold">
                      {userData.profile.currency} {inv.amountNeeded.toFixed(2)}
                    </span>
                  </span>
                  <span className="text-sm">
                    Deposited:{" "}
                    <span className="text-emerald-400 font-semibold">
                      {userData.profile.currency} {inv.amountDeposited.toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>
              <Button
                onClick={() => deleteInvestment(inv.id)}
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
