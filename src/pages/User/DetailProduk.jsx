import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductStore from "../../stores/useProductStore";
import useAuthStore from "../../stores/useAuthStore";
import toast from "react-hot-toast";
import useCartStore from "../../stores/useCartStore";
import { User } from "lucide-react";

const DetailProduk = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchProductById, productDetail, fetchProducts, products } = useProductStore();
  const { addCartItem } = useCartStore();
  const { authUser } = useAuthStore();

  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Format Rupiah — strip decimals
  const formatRupiah = (n) => {
    const angka = Math.floor(Number(n) || 0);
    return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    fetchProductById(id);
    fetchProducts();
  }, [id, fetchProductById, fetchProducts]);

  // ── Handle add to cart ──
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Pilih variant terlebih dahulu");
      return;
    }
    if (selectedVariant.stock <= 0) {
      toast.error("Stok variant ini sudah habis");
      return;
    }
    try {
      const result = await addCartItem({ id: selectedVariant.id, ...selectedVariant });
      if (result && result.success === false) {
        toast.error(result.error || "Gagal menambahkan ke keranjang");
        return;
      }
      setIsCartModalOpen(false);
      setSelectedVariant(null);
      toast.success("Berhasil ditambahkan ke keranjang");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Terjadi kesalahan";
      toast.error(msg);
    }
  };

  // ── Rating helpers ──
  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  const calculateAverageRating = () => {
    if (!productDetail?.variant) return 0;
    let total = 0, count = 0;
    productDetail.variant.forEach((v) =>
      v.review?.forEach((r) => {
        if (r.rating > 0) { total += r.rating; count++; }
      })
    );
    return count > 0 ? total / count : 0;
  };

  const countValidReviews = () => {
    if (!productDetail?.variant) return 0;
    return productDetail.variant.reduce(
      (acc, v) => acc + (v.review?.filter((r) => r.rating > 0).length || 0), 0
    );
  };

  const averageRating = calculateAverageRating();
  const validReviewCount = countValidReviews();
  const allReviews = (productDetail?.variant?.flatMap((v) => v.review) || [])
    .filter((r) => r.rating > 0);

  const isOutOfStock = () => {
    if (productDetail?.variant?.length) return productDetail.variant.every((v) => v.stock <= 0);
    return productDetail?.stock <= 0;
  };
  const outOfStock = isOutOfStock();

  const rekomendasi = products.filter((p) => p.id !== productDetail?.id).slice(0, 4);

  // ── Not found ──
  if (!productDetail) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center font-['Poppins']">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-[#1E2B4A] font-semibold text-base mb-1">Produk tidak ditemukan</h2>
          <p className="text-gray-400 text-sm mb-5">Produk ini mungkin sudah tidak tersedia.</p>
          <button
            onClick={() => navigate("/user/belanja")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF] py-8 px-4 md:px-8 font-['Poppins']">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* ── Back nav ── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke katalog
        </button>

        {/* ── Main card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Image panel */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center min-h-72 md:min-h-96 p-8">
              {!imgError && productDetail.img_url ? (
                <img
                  src={productDetail.img_url}
                  alt={productDetail.name}
                  className="max-h-72 object-contain drop-shadow-md"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex flex-col items-center text-blue-200">
                  <svg className="w-20 h-20 mb-2" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs">Tidak ada foto</span>
                </div>
              )}

              {/* Out of stock ribbon */}
              {outOfStock && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  Stok Habis
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="p-7 flex flex-col">
              {/* Category */}
              {productDetail.category && (
                <span className="inline-block self-start bg-blue-50 text-blue-600 text-[10px] font-semibold px-2.5 py-1 rounded-full mb-3 uppercase tracking-wide">
                  {Array.isArray(productDetail.category)
                    ? productDetail.category[0]?.name || productDetail.category[0]?.nama
                    : productDetail.category?.name || productDetail.category}
                </span>
              )}

              <h1 className="text-xl font-bold text-[#1E2B4A] leading-snug mb-2">
                {productDetail.name}
              </h1>

              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {productDetail.desc || productDetail.description || "Tidak ada deskripsi."}
              </p>

              {/* Price */}
              <div className="mb-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Harga</p>
                <p className="text-2xl font-bold text-blue-600">{formatRupiah(productDetail.price)}</p>
              </div>

              {/* Rating + stock row */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-sm font-semibold text-[#1E2B4A]">{averageRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({validReviewCount} ulasan)</span>
                </div>

                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                  ${outOfStock
                    ? "bg-red-50 text-red-400"
                    : productDetail.stock <= 5
                    ? "bg-amber-50 text-amber-500"
                    : "bg-emerald-50 text-emerald-600"}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full inline-block
                    ${outOfStock ? "bg-red-400" : productDetail.stock <= 5 ? "bg-amber-400" : "bg-emerald-400"}`}
                  />
                  {outOfStock ? "Habis" : `Stok: ${productDetail.stock}`}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-auto space-y-2">
                <button
                  onClick={() => setIsCartModalOpen(true)}
                  disabled={outOfStock}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all
                    ${outOfStock
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 hover:shadow-md hover:shadow-blue-200 active:scale-[0.98]"
                    }`}
                >
                  {outOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
                </button>

                {validReviewCount > 0 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="w-full py-2.5 rounded-xl text-sm text-blue-600 font-medium border border-blue-100 hover:bg-blue-50 transition"
                  >
                    {showAllReviews ? "Sembunyikan ulasan" : `Lihat ${validReviewCount} ulasan`}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Reviews section ── */}
          {showAllReviews && (
            <div className="border-t border-gray-100 px-7 py-6">
              <h2 className="text-sm font-bold text-[#1E2B4A] uppercase tracking-wider mb-4">
                Ulasan Pembeli
              </h2>

              {allReviews.length === 0 ? (
                <p className="text-gray-400 text-sm">Belum ada ulasan.</p>
              ) : (
                <div className="divide-y divide-gray-50 space-y-0">
                  {allReviews.map((review, index) => (
                    <div key={index} className="flex gap-4 py-4">
                      <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-semibold text-[#1E2B4A] truncate">
                            {review.user?.name || "Anonim"}
                          </span>
                          <span className="text-[11px] text-gray-400 flex-shrink-0">
                            {new Date(review.rating_time).toLocaleDateString("id-ID", {
                              year: "numeric", month: "short", day: "numeric",
                            })}
                          </span>
                        </div>
                        {renderStars(review.rating)}
                        {review.comment && (
                          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Rekomendasi ── */}
        {rekomendasi.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1E2B4A] uppercase tracking-wider mb-4 pl-1">
              Produk Lainnya
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {rekomendasi.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/user/produk/${item.id}`)}
                  className="bg-white border border-gray-100 rounded-2xl p-3 text-start hover:shadow-md hover:shadow-blue-100/60 hover:-translate-y-0.5 hover:border-blue-200 transition-all duration-200 group"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl h-24 flex items-center justify-center mb-3 overflow-hidden">
                    <img
                      src={item.img_url || "https://via.placeholder.com/100"}
                      alt={item.name}
                      className="max-h-20 object-contain group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => { e.target.style.display = "none" }}
                    />
                  </div>
                  <h3 className="text-xs font-semibold text-[#1E2B4A] line-clamp-2 mb-1 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-blue-600 text-xs font-bold">{formatRupiah(item.price)}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Variant modal ── */}
      {isCartModalOpen && (
        <div
          className="fixed inset-0 bg-[#1E2B4A]/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCartModalOpen(false);
              setSelectedVariant(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">

            {/* Modal header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[#1E2B4A] text-base">Pilih Variant</h3>
                <p className="text-xs text-gray-400 mt-0.5">{productDetail.name}</p>
              </div>
              <button
                onClick={() => { setIsCartModalOpen(false); setSelectedVariant(null); }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Variant grid */}
            <div className="p-5 max-h-[55vh] overflow-y-auto">
              {!productDetail?.variant?.length ? (
                <p className="text-gray-400 text-sm text-center py-6">Tidak ada variant tersedia.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {productDetail.variant.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const isEmpty = variant.stock <= 0;

                    return (
                      <button
                        key={variant.id}
                        onClick={() => !isEmpty && setSelectedVariant(variant)}
                        disabled={isEmpty}
                        className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all text-center
                          ${isEmpty
                            ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                            : isSelected
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-100 hover:border-blue-200 hover:bg-blue-50/30"
                          }`}
                      >
                        {/* Selected checkmark */}
                        {isSelected && !isEmpty && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}

                        {/* Sold-out badge */}
                        {isEmpty && (
                          <span className="absolute top-2 right-2 bg-red-100 text-red-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            HABIS
                          </span>
                        )}

                        {/* Variant avatar */}
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-sm font-bold mb-2
                          ${isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                          {variant.name?.split(" ").map((w) => w[0]).join("").slice(0, 2) || "V"}
                        </div>

                        <p className="text-xs font-semibold text-[#1E2B4A] leading-tight mb-1">
                          {variant.name || "Variant"}
                        </p>
                        <p className={`text-xs font-bold ${isSelected ? "text-blue-600" : "text-gray-600"}`}>
                          {formatRupiah(variant.price)}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {isEmpty ? "Habis" : `${variant.stock} tersisa`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-5 pb-5 pt-3 border-t border-gray-100">
              {selectedVariant && (
                <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-2.5 mb-3">
                  <span className="text-xs text-blue-700 font-medium">Dipilih: {selectedVariant.name}</span>
                  <span className="text-xs font-bold text-blue-700">{formatRupiah(selectedVariant.price)}</span>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock <= 0}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all
                  ${selectedVariant && selectedVariant.stock > 0
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 active:scale-[0.98]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {!selectedVariant
                  ? "Pilih variant dulu"
                  : selectedVariant.stock <= 0
                  ? "Stok habis"
                  : "Tambah ke Keranjang"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailProduk;