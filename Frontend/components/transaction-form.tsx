
"use client"

import type React from "react"
import { useState } from "react"
import { useMoneyMap } from "../../Schema/MoneyMapContext"
import { Button } from "../components/ui/button"

interface TransactionFormProps {
  month: string
  onClose: () => void
}

export default function TransactionForm({ month, onClose }: TransactionFormProps) {
  const { userData, addBill, addInvestment, addSpending } = useMoneyMap()
  const [type, setType] = useState<"bill" | "investment" | "spending">("bill")
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !amount) return

    const transactionData = {
      title,
      amountNeeded: type === "spending" ? 0 : Number.parseFloat(amount),
      amountDeposited: type === "spending" ? Number.parseFloat(amount) : 0,
      dueDate: type === "bill" ? dueDate : ""
    }

    if (type === "bill") {
      addBill(transactionData)
    } else if (type === "investment") {
      addInvestment(transactionData)
    } else {
      addSpending(transactionData)
    }

    setTitle("")
    setAmount("")
    setDueDate("")
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "bill" | "investment" | "spending")}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        >
          <option value="bill">Bill</option>
          <option value="investment">Investment</option>
          <option value="spending">Spending</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {type === "spending" ? "Amount Spent" : "Amount Needed"}
        </label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />
      </div>

      {type === "bill" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
          Add {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
        <Button type="button" onClick={onClose} className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-900">
          Cancel
        </Button>
      </div>
    </form>
  )
}
