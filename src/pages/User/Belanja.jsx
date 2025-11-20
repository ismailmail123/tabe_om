import React, { useState, useEffect } from "react"
import useProductStore from "../../stores/useProductStore"
import useCartStore from "../../stores/useCartStore"
import { useNavigate } from "react-router-dom"

const KoperasiBelanja = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [navigatingProductId, setNavigatingProductId] = useState(null)
  const navigate = useNavigate();

  const { 
    fetchProducts, 
    products, 
    isLoading 
  } = useProductStore()
  const { 
    fetchCarts,
    cartItems,
  } = useCartStore()

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProducts(), fetchCarts()])
      setIsInitialLoad(false)
    }
    loadData()
  }, [fetchProducts, fetchCarts])

  const formatRupiah = (n) =>
    "Rp " + (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  // Helper function untuk mendapatkan kategori yang aman
  const getSafeCategory = (product) => {
    if (!product) return ""
    
    if (Array.isArray(product.category)) {
      if (product.category.length > 0) {
        return product.category[0].name || product.category[0].nama || ""
      }
      return ""
    }
    
    const category = product.category || product.kategori || ""
    
    if (typeof category === 'object') {
      return category.name || category.nama || ""
    }
    
    return category
  }

  // Helper function untuk mendapatkan nama yang aman
  const getSafeName = (product) => {
    if (!product) return "Produk tanpa nama"
    
    const name = product.name || product.product_name || product.nama || ""
    
    if (typeof name === 'object') {
      return JSON.stringify(name)
    }
    
    return name
  }

  // Helper function untuk mendapatkan deskripsi yang aman
  const getSafeDescription = (product) => {
    if (!product) return ""
    
    const desc = product.description || product.desc || product.deskripsi || ""
    
    if (typeof desc === 'object') {
      return JSON.stringify(desc)
    }
    
    return desc
  }

  // Fungsi untuk handle klik produk dengan loading state
  const handleProductClick = async (productId) => {
    setNavigatingProductId(productId)
    
    // Simulasikan loading sebentar sebelum navigasi
    await new Promise(resolve => setTimeout(resolve, 500))
    
    navigate(`/user/produk/${productId}`)
  }

  // Filter produk berdasarkan pencarian dan kategori
  const filteredProducts = (Array.isArray(products) ? products : []).filter((product) => {
    const safeName = getSafeName(product)
    const safeDesc = getSafeDescription(product)
    const safeCategory = getSafeCategory(product)
    
    const matchesSearch =
      !searchTerm ||
      safeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeDesc.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory =
      !selectedCategory || safeCategory === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Dapatkan kategori unik untuk dropdown
  const uniqueCategories = () => [
    ...new Set(
      (Array.isArray(products) ? products : [])
        .map((p) => getSafeCategory(p))
        .filter(Boolean)
    )
  ]

  // Hitung total item di cart
  const getTotalCartItems = () => {
    if (!Array.isArray(cartItems)) return 0
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0)
  }

  // Tampilkan loading hanya saat initial load
  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-transparent py-7 px-4 md:px-8 font-['Poppins']">
        <div className="max-w-[1100px] mx-auto">
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
              Total Item: <strong>0</strong>
            </div>
          </header>

          <section className="bg-white rounded-xl p-5 shadow-lg mb-8">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-blue-50/50"></div>
              <div className="px-4 py-3 border border-gray-200 rounded-xl bg-white w-48"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-blue-100 shadow-sm p-4"
                >
                  <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5 mb-2"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-full mt-3"></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-transparent py-7 px-4 md:px-8 font-['Poppins']">
      {/* Loading Overlay saat navigasi ke detail produk */}
      {navigatingProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Memuat Produk</h3>
              <p className="text-gray-600 text-center text-sm">
                Sedang membuka halaman detail produk...
              </p>
            </div>
          </div>
        </div>
      )}

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
            Total Item: <strong>{getTotalCartItems()}</strong>
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
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const safeName = getSafeName(product)
                const safeDesc = getSafeDescription(product)
                const safePrice = product.price || product.harga || 0
                const safeImage = product.img_url || product.image || product.image_url || ""
                const safeStock = product.stock || product.stok || 0
                const safeCategory = getSafeCategory(product)

                return (
                  <button
                    key={product.id}
                    className="bg-white text-start rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all p-4 flex flex-col cursor-pointer hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleProductClick(product.id)}
                    disabled={navigatingProductId !== null}
                  >
                    {/* Loading indicator untuk produk yang sedang diklik */}
                    {navigatingProductId === product.id && (
                      <div className="absolute inset-0 bg-white bg-opacity-80 rounded-xl flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    )}

                    {/* 🖼️ Foto Produk */}
                    <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                      {safeImage ? (
                        <img
                          src={safeImage}
                          alt={safeName}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div className={`text-gray-400 text-sm font-medium ${safeImage ? 'hidden' : 'flex flex-col items-center justify-center'}`}>
                        <span>Tidak ada foto</span>
                      </div>
                    </div>

                    {/* Badge Kategori */}
                    {safeCategory && (
                      <div className="mb-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {safeCategory}
                        </span>
                      </div>
                    )}

                    <h3 className="font-semibold text-gray-900 mb-1">{safeName}</h3>
                    <p className="text-gray-600 text-sm flex-1 mb-2">
                      {safeDesc.length > 100 ? `${safeDesc.substring(0, 100)}...` : safeDesc}
                    </p>

                    <div className="flex justify-between items-center mt-auto">
                      <div className="font-bold text-blue-600 text-lg">
                        {formatRupiah(safePrice)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Stok: {safeStock}
                      </div>
                    </div>
                    
                  </button>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-lg mb-2">Produk tidak ditemukan</p>
                <p className="text-sm">Coba ubah kata kunci pencarian atau pilih kategori lain</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default KoperasiBelanja