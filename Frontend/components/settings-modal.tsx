"use client"

import { useState } from "react"
import { useMoneyMap } from "../../Schema/MoneyMapContext"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ChevronDown } from "lucide-react"

const WORLD_CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar", country: "United States" },
  { code: "EUR", symbol: "€", name: "Euro", country: "European Union" },
  { code: "GBP", symbol: "£", name: "British Pound", country: "United Kingdom" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", country: "Japan" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "Australia" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", country: "Canada" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", country: "Switzerland" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", country: "China" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", country: "India" },
  { code: "MXN", symbol: "$", name: "Mexican Peso", country: "Mexico" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", country: "Singapore" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", country: "Hong Kong" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", country: "New Zealand" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", country: "Sweden" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", country: "Norway" },
  { code: "DKK", symbol: "kr", name: "Danish Krone", country: "Denmark" },
  { code: "ZAR", symbol: "R", name: "South African Rand", country: "South Africa" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", country: "Brazil" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", country: "Russia" },
  { code: "KRW", symbol: "₩", name: "South Korean Won", country: "South Korea" },
  { code: "THB", symbol: "฿", name: "Thai Baht", country: "Thailand" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", country: "Malaysia" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", country: "Philippines" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", country: "Indonesia" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong", country: "Vietnam" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", country: "Pakistan" },
  { code: "BGN", symbol: "лв", name: "Bulgarian Lev", country: "Bulgaria" },
  { code: "HRK", symbol: "kn", name: "Croatian Kuna", country: "Croatia" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna", country: "Czech Republic" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint", country: "Hungary" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty", country: "Poland" },
  { code: "RON", symbol: "lei", name: "Romanian Leu", country: "Romania" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", country: "Turkey" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", country: "United Arab Emirates" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", country: "Saudi Arabia" },
  { code: "QAR", symbol: "ر.ق", name: "Qatari Riyal", country: "Qatar" },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar", country: "Kuwait" },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar", country: "Bahrain" },
  { code: "OMR", symbol: "ر.ع.", name: "Omani Rial", country: "Oman" },
  { code: "JOD", symbol: "د.ا", name: "Jordanian Dinar", country: "Jordan" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel", country: "Israel" },
  { code: "EGP", symbol: "£", name: "Egyptian Pound", country: "Egypt" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", country: "Nigeria" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi", country: "Ghana" },
  { code: "KES", symbol: "Sh", name: "Kenyan Shilling", country: "Kenya" },
  { code: "UGX", symbol: "Sh", name: "Ugandan Shilling", country: "Uganda" },
  { code: "ETB", symbol: "Br", name: "Ethiopian Birr", country: "Ethiopia" },
  { code: "CLP", symbol: "$", name: "Chilean Peso", country: "Chile" },
  { code: "COP", symbol: "$", name: "Colombian Peso", country: "Colombia" },
  { code: "PEN", symbol: "S/", name: "Peruvian Sol", country: "Peru" },
  { code: "ARS", symbol: "$", name: "Argentine Peso", country: "Argentina" },
]

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { userData, changeCurrency, logout } = useMoneyMap()
  const [selectedCurrency, setSelectedCurrency] = useState(userData.profile.currency)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency)
    changeCurrency(currency)
    setIsDropdownOpen(false)
    setSearchQuery("")
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  const filteredCurrencies = WORLD_CURRENCIES.filter(
    (curr) =>
      curr.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      curr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      curr.country.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedCurrencyData = WORLD_CURRENCIES.find((c) => c.code === selectedCurrency)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] flex flex-col bg-slate-900 border-2 border-cyan-500/50 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/30 bg-gradient-to-r from-slate-900 to-slate-800">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 uppercase tracking-wider">
            SETTINGS
          </h2>
          <p className="text-xs text-cyan-300/70 mt-1">SYSTEM SETTINGS</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Currency Selection */}
          <div>
            <h3 className="text-sm font-bold text-cyan-300 mb-3 uppercase tracking-widest">CURRENCY PROTOCOL</h3>
            <div className="relative">
              {/* Dropdown Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-3 rounded-lg border-2 border-cyan-500/50 bg-slate-800 hover:bg-slate-700 text-white transition-all duration-300 flex items-center justify-between group hover:border-cyan-400"
              >
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-semibold">{selectedCurrencyData?.code}</span>
                  <span className="text-slate-400">{selectedCurrencyData?.symbol}</span>
                  <span className="text-xs text-slate-500">{selectedCurrencyData?.name}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-cyan-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border-2 border-cyan-500/50 rounded-lg shadow-2xl z-10 overflow-hidden">
                  {/* Search Input */}
                  <div className="p-3 border-b border-cyan-500/30 bg-slate-900">
                    <input
                      type="text"
                      placeholder="Search currency..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-cyan-500/30 rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                    />
                  </div>

                  {/* Currency List */}
                  <div className="max-h-64 overflow-y-auto">
                    {filteredCurrencies.length > 0 ? (
                      filteredCurrencies.map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => handleCurrencyChange(curr.code)}
                          className={`w-full px-4 py-3 text-left transition-all duration-200 border-b border-slate-700/50 last:border-b-0 ${
                            selectedCurrency === curr.code
                              ? "bg-cyan-500/20 border-l-4 border-l-cyan-400"
                              : "hover:bg-slate-700/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-cyan-300">
                                {curr.code} {curr.symbol}
                              </div>
                              <div className="text-xs text-slate-400">{curr.name}</div>
                              <div className="text-xs text-slate-500">{curr.country}</div>
                            </div>
                            {selectedCurrency === curr.code && (
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-slate-400 text-sm">No currencies found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="pt-4 border-t border-cyan-500/30">
            <h3 className="text-sm font-bold text-cyan-300 mb-3 uppercase tracking-widest">ACCOUNT INFO</h3>
            <div className="space-y-2 text-sm bg-slate-800/50 p-3 rounded border border-cyan-500/20">
              <p>
                <span className="text-cyan-300">USERNAME:</span>
                <span className="text-slate-300 ml-2">
                  {userData.profile.firstName} {userData.profile.lastName}
                </span>
              </p>
              <p>
                <span className="text-cyan-300">EMAIL:</span>
                <span className="text-slate-300 ml-2">{userData.profile.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sign Out Button - Fixed at Bottom */}
        <div className="p-6 border-t border-cyan-500/30 bg-gradient-to-r from-slate-900 to-slate-800">
          <Button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-lg transition-all duration-300 uppercase tracking-wider shadow-lg hover:shadow-red-500/50"
          >
            SIGN-OUT
          </Button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-300 transition-colors text-xl font-bold"
        >
          ✕
        </button>
      </Card>
    </div>
  )
}