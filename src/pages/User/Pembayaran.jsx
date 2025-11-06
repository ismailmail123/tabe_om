import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CreditCard } from "lucide-react"

export default function Pembayaran() {
  const [cart, setCart] = useState([])
  const [form, setForm] = useState({
    nama: "",
    blok: "",
    nomorRegister: "",
    catatan: "",
  })
  const navigate = useNavigate()

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || []
    setCart(storedCart)
  }, [])

  const formatRupiah = (n) =>
    "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const handleSubmit = (e) => {
    e.preventDefault()

    const newTransaction = {
      id: Date.now(),
      date: new Date().toLocaleString("id-ID"),
      nama: form.nama,
      blok: form.blok,
      nomorRegister: form.nomorRegister,
      catatan: form.catatan,
      items: cart,
      total: total,
      status: "Menunggu Konfirmasi",
    }

    // Ambil data transaksi lama
    const existingTransactions =
      JSON.parse(localStorage.getItem("transactions")) || []

    // Tambahkan transaksi baru
    existingTransactions.push(newTransaction)

    // Simpan ke localStorage
    localStorage.setItem("transactions", JSON.stringify(existingTransactions))

    // Kosongkan keranjang
    localStorage.removeItem("cart")

    // Redirect ke halaman history
    navigate("/user/history")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Poppins']">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <CreditCard className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Formulir Pembayaran WBP
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nama WBP
            </label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
              placeholder="Masukkan nama lengkap WBP"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Blok / Kamar
              </label>
              <input
                type="text"
                name="blok"
                value={form.blok}
                onChange={(e) => setForm({ ...form, blok: e.target.value })}
                required
                placeholder="Contoh: Blok A-2"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nomor Register
              </label>
              <input
                type="text"
                name="nomorRegister"
                value={form.nomorRegister}
                onChange={(e) =>
                  setForm({ ...form, nomorRegister: e.target.value })
                }
                required
                placeholder="Masukkan nomor register WBP"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Catatan Tambahan
            </label>
            <textarea
              name="catatan"
              value={form.catatan}
              onChange={(e) => setForm({ ...form, catatan: e.target.value })}
              rows="3"
              placeholder="Tulis catatan tambahan (opsional)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            ></textarea>
          </div>

          {/* RINGKASAN PEMBELIAN */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Ringkasan Pembelian
            </h3>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-gray-700 mb-2"
              >
                <span>
                  {item.name}{" "}
                  <span className="text-sm text-gray-500">x{item.qty}</span>
                </span>
                <span className="font-medium">
                  {formatRupiah(item.price * item.qty)}
                </span>
              </div>
            ))}
            <div className="flex justify-between mt-4 text-lg font-semibold">
              <span>Total Pembayaran</span>
              <span className="text-green-700">{formatRupiah(total)}</span>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              Konfirmasi Pembayaran
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
