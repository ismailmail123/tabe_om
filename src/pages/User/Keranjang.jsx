import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"

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
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 font-['Poppins']">
        <img
          src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
          alt="Empty cart"
          className="w-40 mb-4 opacity-80"
        />
        <h2 className="text-xl font-semibold">Keranjangmu masih kosong!</h2>
        <button
          onClick={() => navigate("/user/belanja")}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
        >
          Belanja Sekarang
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 font-['Poppins'] min-h-screen bg-gray-50">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart size={28} className="text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Keranjang Belanja</h2>
      </div>

      <div className="grid gap-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center bg-white shadow-md rounded-xl p-4 transition hover:shadow-lg"
          >
            <img
              src={item.image || "https://via.placeholder.com/80"}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            />

            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-gray-800 text-lg">
                {item.name}
              </h3>
              <p className="text-blue-600 font-medium">
                {formatRupiah(item.price)}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleReduce(item.id)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md font-bold"
              >
                -
              </button>
              <span className="text-gray-800 font-semibold w-6 text-center">
                {item.qty}
              </span>
              <button
                onClick={() => handleAdd(item.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              className="ml-4 text-red-500 hover:text-red-600 font-semibold"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-md">
        <div className="text-lg font-semibold text-gray-800">
          Total: <span className="text-blue-700">{formatRupiah(total)}</span>
        </div>
        <button
          onClick={() => navigate("/user/pembayaran")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          Lanjut ke Pembayaran
        </button>
      </div>
    </div>
  )
}
