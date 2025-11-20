import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductStore from "../../stores/useProductStore";
import useAuthStore from "../../stores/useAuthStore";
import toast from "react-hot-toast";

import useCartStore from "../../stores/useCartStore";

const DetailProduk = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { fetchProductById, productId, fetchProducts, products } = useProductStore();
  const {addCartItem, cartItems} = useCartStore();
  const { logout, authUser } = useAuthStore();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Format Rupiah
  const formatRupiah = (n) => {
    if (!n) return "Rp 0";
    return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Fetch data
  useEffect(() => {
    fetchProductById(id);
    fetchProducts();
  }, [id, fetchProductById, fetchProducts]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle Add to Cart dari modal variant
const handleAddToCart = async () => {
  if (!selectedVariant) {
    toast.error("Silakan pilih variant terlebih dahulu");
    return;
  }

  if (selectedVariant.stock <= 0) {
    toast.error("Maaf, stok untuk variant ini sudah habis");
    return;
  }

  try {
    const result = await addCartItem({
      id: selectedVariant.id,
      ...selectedVariant,
    });

    // Cek jika result mengindikasikan error
    if (result && result.success === false) {
      toast.error(result.error || "Gagal menambahkan ke keranjang");
      return;
    }

    // Jika berhasil
    setIsCartModalOpen(false);
    setSelectedVariant(null);
    toast.success("Berhasil menambahkan ke keranjang");
  } catch (error) {
    console.error("Gagal menambahkan ke keranjang:", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data?.error;
      toast.error(errorMessage || "Gagal menambahkan ke keranjang");
    } else if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("Terjadi kesalahan saat menambahkan ke keranjang");
    }
  }
};

  // Handle Add to Cart langsung (dari kode pertama)
 const handleDirectAddToCart = () => {
  // Cek stok
  if (productId.stock <= 0) {
    toast.error("Maaf, stok produk ini sudah habis");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find((item) => item.id === productId.id);
  
  if (existing) {
    if (existing.qty >= productId.stock) {
      toast.error("Stok tidak mencukupi");
      return;
    }
    existing.qty += 1;
  } else {
    cart.push({ ...productId, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  toast.success(`${productId.name} telah ditambahkan ke keranjang!`);
};

  // Fungsi untuk render rating bintang
  const renderStars = (rating) => {
    const filledStars = rating || 0;
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-${index < filledStars ? "yellow" : "gray"}-500`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!productId?.variant) return 0;
    let totalRating = 0;
    let reviewCount = 0;

    productId.variant.forEach((variant) => {
      variant.review?.forEach((review) => {
        if (review.rating !== null && review.rating > 0) {
          totalRating += review.rating;
          reviewCount++;
        }
      });
    });

    return reviewCount > 0 ? totalRating / reviewCount : 0;
  };

  // Count valid reviews
  const countValidReviews = () => {
    if (!productId?.variant) return 0;
    let count = 0;
    productId.variant.forEach((variant) => {
      count += variant.review?.filter(
        (review) => review.rating !== null && review.rating > 0
      ).length || 0;
    });
    return count;
  };

  const averageRating = calculateAverageRating();
  const validReviewCount = countValidReviews();
  const allReviews = productId?.variant?.flatMap((v) => v.review) || [];

  // Check stock
  const isOutOfStock = () => {
    if (productId?.variant && Array.isArray(productId.variant)) {
      return productId.variant.every(v => v.stock <= 0);
    }
    return productId?.stock <= 0;
  };

  const outOfStock = isOutOfStock();

  // Produk rekomendasi
  const rekomendasi = products.filter((p) => p.id !== productId?.id).slice(0, 4);

  if (!productId) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Produk tidak ditemukan</h2>
        <button onClick={() => navigate("/user/belanja")} className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg">
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50/40 py-10 px-4 font-['Poppins']">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* Header dengan dropdown menu */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline flex items-center">
            ← Kembali
          </button>
          
        </div>

        {/* Detail produk - TAMPILAN UTAMA DARI KODE PERTAMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-100 rounded-lg h-64 flex items-center justify-center text-5xl font-bold text-blue-500">
            {productId.name.split(" ").map((w) => w[0]).join("")}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{productId.name}</h1>
            <p className="text-gray-600 mb-3">{productId.desc}</p>
            <div className="text-blue-600 text-2xl font-semibold mb-2">{formatRupiah(productId.price)}</div>
            <p className="text-sm text-gray-500 mb-4">Stok: {productId.stock}</p>

            {/* Rating Section dari kode kedua */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-1 text-sm">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="font-bold">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500">({validReviewCount} Ulasan)</span>
              </div>
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-blue-600 text-sm"
              >
                {showAllReviews ? "Tutup" : "Lihat Semua"}
              </button>
            </div>

            {/* Tombol dari kode pertama - dengan modal variant */}
            <button
              onClick={() => setIsCartModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors w-full"
            >
              Tambah ke Keranjang
            </button>
          </div>
        </div>

        {/* All Reviews Section */}
        {showAllReviews && (
          <div className="mt-6 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Semua Ulasan</h2>
            {allReviews.length === 0 ? (
              <p className="text-gray-500">Belum ada ulasan untuk produk ini</p>
            ) : (
              allReviews
                .filter((review) => review.rating !== null && review.rating !== 0)
                .map((review, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="size-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold">
                        {review.user?.name || "Anonymous"}
                      </div>
                      {renderStars(review.rating)}
                      {review.comment && (
                        <p className="text-gray-600 mt-2">{review.comment}</p>
                      )}
                      <div className="text-sm text-gray-500 mt-2">
                        {new Date(review.rating_time).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>

      {/* Rekomendasi */}
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Produk Lainnya</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {rekomendasi.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/user/produk/${item.id}`)}
              className="bg-white border border-gray-100 rounded-lg p-3 cursor-pointer hover:shadow-md transition"
            >
              <div className="bg-blue-50 rounded-md h-20 flex items-center justify-center text-blue-500 font-bold">
                {item.name.split(" ").map((w) => w[0]).join("")}
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mt-2">{item.name}</h3>
              <p className="text-blue-600 text-sm">{formatRupiah(item.price)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Pilih Variant dari kode kedua */}
      {isCartModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Pilih Variant</h3>
              <button
                onClick={() => {
                  setIsCartModalOpen(false);
                  setSelectedVariant(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Variant</h4>
                <div className="grid grid-cols-2 gap-4">
  {productId?.variant?.map((variant) => (
    <div
      key={variant.id}
      onClick={() => variant.stock > 0 && setSelectedVariant(variant)}
      className={`relative flex flex-col items-center p-2 rounded-lg border hover:shadow-md transition-shadow cursor-pointer ${
        selectedVariant?.id === variant.id
          ? "ring-2 ring-blue-500"
          : ""
      } ${
        variant.stock <= 0 
          ? "opacity-50 cursor-not-allowed bg-gray-100" 
          : ""
      }`}
    >
      {/* Indicator variant habis */}
      {variant.stock <= 0 && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-70 rounded-lg flex items-center justify-center">
          <span className="text-xs font-bold text-gray-600 bg-white px-2 py-1 rounded">
            HABIS
          </span>
        </div>
      )}
      
      {selectedVariant?.id === variant.id && variant.stock > 0 && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      
      <div className="bg-blue-50 rounded-md w-16 h-16 flex items-center justify-center text-blue-500 font-bold mb-2">
        {variant.name?.split(" ").map((w) => w[0]).join("") || "V"}
      </div>
      <p className="text-sm text-center font-medium">
        {variant.name || "Variant"}
      </p>
      <p className="text-xs text-gray-500">
        {formatRupiah(variant.price)}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Stok: {variant.stock}
      </p>
    </div>
  ))}
</div>
              </div>
            </div>

            <div className="p-4 border-t flex gap-2 bg-gray-50">
              {selectedVariant?.type === "pre order" ? (
                <button className="bg-transparent border-0 w-full">
                  {/* <WhatsAppButton
                    phoneNumber={productId?.seller?.phone_number}
                    message={`Halo, saya ingin pre-order produk: ${productId.name} - ${selectedVariant?.name}`}
                  >
                    <div className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold">
                      <FaWhatsapp className="text-xl" />
                      <span>Pesan via WhatsApp</span>
                    </div>
                  </WhatsAppButton> */}
                </button>
              ) : (
                <button
  className={`flex-1 py-3 rounded-xl font-semibold transition ${
    selectedVariant && selectedVariant.stock > 0
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
  onClick={handleAddToCart}
  disabled={!selectedVariant || selectedVariant.stock <= 0}
>
  {selectedVariant?.stock <= 0 ? "Stok Habis" : "Tambah ke Keranjang"}
</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailProduk;
