import React, { useEffect, useState } from "react"
import { Package, ShoppingCart, Users } from "lucide-react"

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalTransactions: 0,
    totalWBP: 0,
  })

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products")) || []
    const transactions = JSON.parse(localStorage.getItem("transactions")) || []

    // Hitung total user unik (berdasarkan nama atau nomor register)
    const uniqueWBP = new Set(
      transactions.map((t) => `${t.nama}-${t.nomorRegister}`)
    )

    setSummary({
      totalProducts: products.length,
      totalTransactions: transactions.length,
      totalWBP: uniqueWBP.size,
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Poppins']">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">
        Dashboard Admin
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Produk */}
        <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4 border-l-4 border-blue-500">
          <Package className="w-10 h-10 text-blue-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-600">Total Produk</h3>
            <p className="text-3xl font-semibold text-gray-800">
              {summary.totalProducts}
            </p>
          </div>
        </div>

        {/* Total Transaksi */}
        <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4 border-l-4 border-green-500">
          <ShoppingCart className="w-10 h-10 text-green-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-600">
              Total Transaksi
            </h3>
            <p className="text-3xl font-semibold text-gray-800">
              {summary.totalTransactions}
            </p>
          </div>
        </div>

        {/* Total WBP */}
        <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4 border-l-4 border-yellow-500">
          <Users className="w-10 h-10 text-yellow-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-600">Total WBP</h3>
            <p className="text-3xl font-semibold text-gray-800">
              {summary.totalWBP}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
