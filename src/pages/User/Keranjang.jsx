import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react"

export default function Keranjang() {
  const [cart, setCart] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || []
    setCart(storedCart)
  }, [])

  const updateCart = (newCart) => {
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const handleAdd = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    )
    updateCart(updated)
  }

  const handleReduce = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
      .filter((item) => item.qty > 0)
    updateCart(updated)
  }

  const handleDelete = (id) => {
    const updated = cart.filter((item) => item.id !== id)
    updateCart(updated)
  }

  const formatRupiah = (n) =>
    "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-700 font-['Poppins']">
        <img
          src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
          alt="Empty cart"
          className="w-44 mb-6 opacity-80"
        />
        <h2 className="text-2xl font-semibold mb-2">Keranjangmu masih kosong!</h2>
        <p className="text-gray-500 mb-5">Ayo belanja dan temukan produk terbaik!</p>
        <button
          onClick={() => navigate("/user/belanja")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md transition transform hover:scale-[1.02]"
        >
          Belanja Sekarang
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 font-['Poppins'] min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-2 rounded-lg">
          <ShoppingCart size={26} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
          Keranjang Belanja
        </h2>
      </div>

      {/* List Produk */}
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border border-gray-100"
          >
            <img
              src={item.image || "https://via.placeholder.com/100"}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-xl border border-gray-200"
            />

            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-gray-800 text-lg leading-tight">
                {item.name}
              </h3>
              <p className="text-blue-600 font-medium">
                {formatRupiah(item.price)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Subtotal:{" "}
                <span className="font-medium text-gray-700">
                  {formatRupiah(item.price * item.qty)}
                </span>
              </p>
            </div>

            {/* Tombol Qty */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-2 py-1">
              <button
                onClick={() => handleReduce(item.id)}
                className="p-1 rounded-md hover:bg-gray-200 transition"
              >
                <Minus size={16} />
              </button>
              <span className="text-gray-800 font-semibold w-6 text-center">
                {item.qty}
              </span>
              <button
                onClick={() => handleAdd(item.id)}
                className="p-1 rounded-md hover:bg-gray-200 transition"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Tombol Hapus */}
            <button
              onClick={() => handleDelete(item.id)}
              className="ml-4 text-red-500 hover:text-red-600 transition p-2"
              title="Hapus item"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Total & Checkout */}
      <div className="mt-10 flex flex-col sm:flex-row justify-between items-center bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <div className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
          Total:{" "}
          <span className="text-blue-700">{formatRupiah(total)}</span>
        </div>
        <button
          onClick={() => navigate("/user/pembayaran")}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium shadow-md transition transform hover:scale-[1.02]"
        >
          Lanjut ke Pembayaran
        </button>
      </div>
    </div>
  )
}
