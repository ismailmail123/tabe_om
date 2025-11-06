import React, { useState, useEffect } from "react"

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

        {/* 🛒 Keranjang */}
        <section className="bg-white rounded-xl p-5 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Keranjang Belanja
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Keranjang masih kosong
            </p>
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="py-3 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      {/* Tampilkan foto kecil di keranjang */}
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatRupiah(item.price)} x {item.qty}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 rounded"
                      >
                        -
                      </button>
                      <span className="font-semibold">{item.qty}</span>
                      <button
                        onClick={() => addToCart(item.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-3 text-red-600 hover:text-red-800 font-medium"
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200 mt-4 pt-4 text-right font-semibold text-blue-700">
                Total: {formatRupiah(totalHarga)}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default KoperasiBelanja
