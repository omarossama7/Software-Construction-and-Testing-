"use client"

import { Card } from "../components/ui/card"
import type { InvestmentCategory } from "../../Schema/MoneyMapContext"

interface InvestmentRecommendationProps {
  leftover: number
  investmentCategories: InvestmentCategory[]
  currency: string
}

export default function InvestmentRecommendation({
  leftover,
  investmentCategories,
  currency,
}: InvestmentRecommendationProps) {
  if (leftover === 0) {
    return (
      <Card className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Investment Recommendations</h3>
        <p className="text-slate-400">
          No leftover funds available for investment. Reduce your expenses or increase your salary to start investing.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Investment Recommendations</h3>
        <p className="text-slate-400">
          You have{" "}
          <span className="font-bold text-emerald-400">
            {currency} {leftover.toFixed(2)}
          </span>{" "}
          available to invest. Here's our recommended allocation:
        </p>
      </div>

      <div className="space-y-3">
        {investmentCategories.map((category) => {
          const amount = (leftover * category.percentage) / 100
          return (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-emerald-500/50 transition-all hover:bg-slate-700/70"
            >
              <div className="flex-1">
                <p className="font-semibold text-white text-lg">{category.name}</p>
                <p className="text-sm text-slate-400">{category.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-400 text-lg">
                  {currency} {amount.toFixed(2)}
                </p>
                <p className="text-sm text-slate-400 font-medium">{category.percentage}%</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-emerald-950/50 border border-emerald-700 rounded-lg">
        <p className="text-emerald-200 text-sm">
          💡 These recommendations are based on your available leftover funds. Adjust your investment categories in
          settings to customize your allocation strategy.
        </p>
      </div>
    </Card>
  )
}
