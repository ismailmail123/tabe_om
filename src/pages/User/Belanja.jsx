import React, { useState, useEffect } from "react"
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react"

const KoperasiBelanja = () => {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  // 🔄 Load produk & cart dari localStorage
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || []
    setProducts(storedProducts)
    const storedCart = JSON.parse(localStorage.getItem("cart")) || []
    setCart(storedCart)
  }, [])

  const formatRupiah = (n) =>
    "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  // 💾 Simpan perubahan cart
  const saveCart = (newCart) => {
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  // ➕ Tambah ke keranjang
  const addToCart = (productId) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const existingItem = cart.find((item) => item.id === productId)
    let updatedCart

    if (existingItem) {
      if (existingItem.qty + 1 > product.stock) {
        alert("Stok tidak cukup!")
        return
      }
      updatedCart = cart.map((item) =>
        item.id === productId ? { ...item, qty: item.qty + 1 } : item
      )
    } else {
      updatedCart = [...cart, { ...product, qty: 1 }]
    }

    saveCart(updatedCart)
  }

  // ➖ Kurangi jumlah
  const decreaseQty = (productId) => {
    const updatedCart = cart
      .map((item) =>
        item.id === productId ? { ...item, qty: item.qty - 1 } : item
      )
      .filter((item) => item.qty > 0)
    saveCart(updatedCart)
  }

  // ❌ Hapus item
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId)
    saveCart(updatedCart)
  }

  // 🔍 Filter produk
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const uniqueCategories = () => [...new Set(products.map((p) => p.category))]
  const totalHarga = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-transparent py-7 px-4 md:px-8 font-['Poppins']">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              T
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TabeOM</h1>
              <p className="text-gray-600 text-sm">Belanja untuk keluarga WBP</p>
            </div>
          </div>
          <div className="text-gray-600 text-sm">
            Total Item: <strong>{cart.reduce((a, b) => a + b.qty, 0)}</strong>
          </div>
        </header>

        {/* 🔍 Filter & Kategori */}
        <section className="bg-white rounded-xl p-5 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="search"
              placeholder="Cari produk..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {uniqueCategories().map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 🛍️ Grid Produk */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all p-4 flex flex-col"
              >
                {/* 🖼️ Foto Produk */}
                <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm font-medium">
                      Tidak ada foto
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 text-sm flex-1">{product.desc}</p>

                <div className="mt-2 font-bold text-blue-600 text-lg">
                  {formatRupiah(product.price)}
                </div>

                <button
                  onClick={() => addToCart(product.id)}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                >
                  Tambah ke Keranjang
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 🛒 Keranjang Modern */}
<section className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mt-8">
  <div className="flex items-center gap-2 mb-5">
    <ShoppingCart size={20} className="text-blue-600" />
    <h2 className="text-xl font-semibold text-gray-900">
      Keranjang Belanja
    </h2>
  </div>

  {cart.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <img
        src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
        alt="Empty cart"
        className="w-32 mb-4 opacity-70"
      />
      <p>Keranjang masih kosong</p>
    </div>
  ) : (
    <>
      <ul className="divide-y divide-gray-100">
        {cart.map((item) => (
          <li
            key={item.id}
            className="py-4 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-gray-50 rounded-xl transition-all px-2"
          >
            {/* Info Produk */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              )}
              <div>
                <h4 className="font-medium text-gray-800 text-base">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {formatRupiah(item.price)}
                </p>
              </div>
            </div>

            {/* Tombol Qty dan Aksi */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 shadow-inner">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="p-1 hover:bg-gray-200 rounded-full transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 text-gray-700"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                  </svg>
                </button>
                <span className="px-3 font-semibold text-gray-800 min-w-[24px] text-center">
                  {item.qty}
                </span>
                <button
                  onClick={() => addToCart(item.id)}
                  className="p-1 hover:bg-gray-200 rounded-full transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 text-gray-700"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-600 transition p-1.5"
                title="Hapus dari keranjang"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.343.052.682.108 1.02.168m-1.02-.168L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .565c.337-.06.677-.116 1.02-.168m0 0L4.772 5.79m0 0L5.84 19.673A2.25 2.25 0 008.084 21.75h7.832a2.25 2.25 0 002.244-2.077L19.228 5.79m-12-.565V4.5c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v.725m-7.5 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Total Belanja */}
      <div className="border-t border-gray-200 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-lg font-semibold text-gray-800">
          Total:{" "}
          <span className="text-green-700">{formatRupiah(totalHarga)}</span>
        </div>
      </div>
    </>
  )}
</section>

      </div>
    </div>
  )
}

export default KoperasiBelanja
