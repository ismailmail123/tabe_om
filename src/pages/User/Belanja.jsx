import React, { useState, useEffect } from "react"
import useProductStore from "../../stores/useProductStore"
import useCartStore from "../../stores/useCartStore"
import { useNavigate } from "react-router-dom"

const KoperasiBelanja = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [navigatingProductId, setNavigatingProductId] = useState(null)
  const navigate = useNavigate()

  const { fetchProducts, products, isLoading } = useProductStore()
  const { fetchCarts, cartItems } = useCartStore()

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProducts(), fetchCarts()])
      setIsInitialLoad(false)
    }
    loadData()
  }, [fetchProducts, fetchCarts])

  const formatRupiah = (n) =>
    "Rp " + (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  const getSafeCategory = (product) => {
    if (!product) return ""
    if (Array.isArray(product.category)) {
      if (product.category.length > 0)
        return product.category[0].name || product.category[0].nama || ""
      return ""
    }
    const category = product.category || product.kategori || ""
    if (typeof category === "object") return category.name || category.nama || ""
    return category
  }

  const getSafeName = (product) => {
    if (!product) return "Produk tanpa nama"
    const name = product.name || product.product_name || product.nama || ""
    if (typeof name === "object") return JSON.stringify(name)
    return name
  }

  const getSafeDescription = (product) => {
    if (!product) return ""
    const desc = product.description || product.desc || product.deskripsi || ""
    if (typeof desc === "object") return JSON.stringify(desc)
    return desc
  }

  const handleProductClick = async (productId) => {
    setNavigatingProductId(productId)
    await new Promise((resolve) => setTimeout(resolve, 500))
    navigate(`/user/produk/${productId}`)
  }

  const filteredProducts = (Array.isArray(products) ? products : []).filter((product) => {
    const safeName = getSafeName(product)
    const safeDesc = getSafeDescription(product)
    const safeCategory = getSafeCategory(product)
    const matchesSearch =
      !searchTerm ||
      safeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeDesc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || safeCategory === selectedCategory
    return matchesSearch && matchesCategory
  })

  const uniqueCategories = () => [
    ...new Set(
      (Array.isArray(products) ? products : [])
        .map((p) => getSafeCategory(p))
        .filter(Boolean)
    ),
  ]

  const getTotalCartItems = () => {
    if (!Array.isArray(cartItems)) return 0
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0)
  }

  /* ─── Skeleton loader ─── */
  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] py-8 px-4 md:px-8 font-['Poppins']">
        <div className="max-w-[1120px] mx-auto">
          {/* Header skeleton */}
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse" />
              <div>
                <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-3 w-44 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-9 w-32 bg-gray-200 rounded-full animate-pulse" />
          </header>

          {/* Search skeleton */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 h-12 bg-white rounded-xl animate-pulse border border-gray-100 shadow-sm" />
            <div className="w-48 h-12 bg-white rounded-xl animate-pulse border border-gray-100 shadow-sm" />
          </div>

          {/* Card skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="w-full h-44 bg-gray-100 rounded-xl mb-4 animate-pulse" />
                <div className="h-3 w-20 bg-gray-100 rounded-full animate-pulse mb-3" />
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse mb-1" />
                <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse mb-4" />
                <div className="flex justify-between items-center">
                  <div className="h-6 w-28 bg-blue-100 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const totalItems = getTotalCartItems()

  return (
    <div className="min-h-screen bg-[#F0F4FF] py-8 px-4 md:px-8 font-['Poppins']">

      {/* ── Navigating overlay ── */}
      {navigatingProductId && (
        <div className="fixed inset-0 bg-[#1E2B4A]/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-4 max-w-xs w-full mx-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
            </div>
            <p className="text-[#1E2B4A] font-semibold text-base">Memuat detail produk…</p>
            <p className="text-gray-400 text-xs text-center">Harap tunggu sebentar</p>
          </div>
        </div>
      )}

      <div className="max-w-[1120px] mx-auto">

        {/* ── Header ── */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="w-12 h-12 bg-gradient-to-br from-[#1E2B4A] to-[#3B82F6] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-200">
              T
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1E2B4A] leading-tight">TabeOM</h1>
              <p className="text-gray-500 text-xs">Belanja untuk keluarga WBP</p>
            </div>
          </div>

          {/* Cart badge */}
          <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-2 shadow-sm">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13H5.4M9 20a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            <span className="text-gray-500 text-sm">Keranjang:</span>
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
              {totalItems}
            </span>
          </div>
        </header>

        {/* ── Search & Filter bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="search"
              placeholder="Cari produk..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {uniqueCategories().map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* ── Results count ── */}
        {!isInitialLoad && (
          <p className="text-xs text-gray-400 mb-4 pl-1">
            Menampilkan <strong className="text-gray-600">{filteredProducts.length}</strong> produk
            {searchTerm && <> untuk "<strong className="text-blue-500">{searchTerm}</strong>"</>}
          </p>
        )}

        {/* ── Product grid ── */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => {
              const safeName     = getSafeName(product)
              const safeDesc     = getSafeDescription(product)
              const safePrice    = product.price || product.harga || 0
              const safeImage    = product.img_url || product.image || product.image_url || ""
              const safeStock    = product.stock || product.stok || 0
              const safeCategory = getSafeCategory(product)
              const isNavigating = navigatingProductId === product.id
              const lowStock     = safeStock > 0 && safeStock <= 5

              return (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  disabled={navigatingProductId !== null}
                  className={`
                    group relative bg-white text-start rounded-2xl border shadow-sm
                    flex flex-col overflow-hidden
                    transition-all duration-200
                    ${isNavigating
                      ? "border-blue-300 shadow-blue-100 shadow-md scale-[0.99]"
                      : "border-gray-100 hover:shadow-lg hover:shadow-blue-100/60 hover:-translate-y-0.5 hover:border-blue-200"}
                    disabled:opacity-60 disabled:cursor-not-allowed
                  `}
                >
                  {/* Product image */}
                  <div className="relative w-full h-44 bg-gray-50 overflow-hidden">
                    {safeImage ? (
                      <img
                        src={safeImage}
                        alt={safeName}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = "none"
                          e.target.nextSibling.style.display = "flex"
                        }}
                      />
                    ) : null}

                    {/* Fallback illustration */}
                    <div
                      className={`absolute inset-0 flex flex-col items-center justify-center text-gray-300 ${safeImage ? "hidden" : "flex"}`}
                    >
                      <svg className="w-12 h-12 mb-1" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">Tidak ada foto</span>
                    </div>

                    {/* Loading overlay */}
                    {isNavigating && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
                      </div>
                    )}

                    {/* Low stock ribbon */}
                    {lowStock && (
                      <div className="absolute top-2 right-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        Stok menipis
                      </div>
                    )}

                    {/* Out of stock overlay */}
                    {safeStock === 0 && (
                      <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Habis</span>
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-4">
                    {/* Category badge */}
                    {safeCategory && (
                      <span className="inline-block self-start bg-blue-50 text-blue-600 text-[10px] font-semibold px-2.5 py-1 rounded-full mb-2 tracking-wide uppercase">
                        {safeCategory}
                      </span>
                    )}

                    <h3 className="font-semibold text-[#1E2B4A] text-sm mb-1 leading-snug line-clamp-2">
                      {safeName}
                    </h3>

                    <p className="text-gray-400 text-xs flex-1 mb-3 line-clamp-2 leading-relaxed">
                      {safeDesc || "Tidak ada deskripsi"}
                    </p>

                    {/* Price row */}
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <p className="text-[10px] text-gray-400 mb-0.5">Harga</p>
                        <p className="font-bold text-blue-600 text-base leading-tight">
                          {formatRupiah(safePrice)}
                        </p>
                      </div>

                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                        ${safeStock === 0
                          ? "bg-red-50 text-red-400"
                          : lowStock
                          ? "bg-amber-50 text-amber-500"
                          : "bg-emerald-50 text-emerald-600"}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full inline-block
                          ${safeStock === 0 ? "bg-red-400" : lowStock ? "bg-amber-400" : "bg-emerald-400"}`}
                        />
                        {safeStock === 0 ? "Habis" : `${safeStock} tersisa`}
                      </div>
                    </div>

                    {/* CTA strip */}
                    <div className={`mt-3 py-2 rounded-xl text-center text-xs font-semibold transition-colors
                      ${safeStock === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white"}`}
                    >
                      {safeStock === 0 ? "Stok habis" : "Lihat Detail →"}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center text-center px-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
            </div>
            <h3 className="text-[#1E2B4A] font-semibold text-base mb-1">Produk tidak ditemukan</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Coba ubah kata kunci pencarian atau pilih kategori yang berbeda.
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => { setSearchTerm(""); setSelectedCategory("") }}
                className="mt-5 px-5 py-2 bg-blue-500 text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default KoperasiBelanja