import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, CreditCard } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import useAuthStore from "../../stores/useAuthStore";
import useCartStore from "../../stores/useCartStore";
import useOrderStore from "../../stores/useOrderStore"; // Import useOrderStore
import toast, { Toaster } from "react-hot-toast";

const CartItem = ({
  item,
  onRemove,
  onIncrement,
  onDecrement,
  isSelected,
  onToggleSelect,
  navigate,
  onOutOfStockClick,
}) => {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const itemRef = useRef(null);

  const isOutOfStock = item.variant?.stock <= 0;
  const isDeleted = item.variant?.is_delete;
  const isUnavailable = isOutOfStock || isDeleted;

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    console.log("Increment isolated");
    onIncrement();
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    console.log("Decrement isolated");
    onDecrement();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;

    touchEndX.current = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;

    if (diff > 0) {
      setSwipeOffset(Math.min(diff, 80));
    } else if (diff < 0 && showDelete) {
      setSwipeOffset(0);
      setShowDelete(false);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);

    if (swipeOffset > 50 && !showDelete) {
      setShowDelete(true);
      setSwipeOffset(80);
    } else if (swipeOffset < 50 && !showDelete) {
      setSwipeOffset(0);
    }
  };

  const handleMouseLeave = () => {
    if (swipeOffset > 0 && !showDelete) {
      setSwipeOffset(0);
    }
  };

  const confirmDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      onRemove();
      setShowDelete(false);
      setSwipeOffset(0);
    } else {
      setShowDelete(false);
      setSwipeOffset(0);
    }
  };

  const handleToggleSelect = () => {
    if (isUnavailable) {
      onOutOfStockClick();
      return;
    }
    onToggleSelect();
  };

  return (
    <div
      ref={itemRef}
      className="relative mb-4 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`absolute right-0 top-0 h-full w-20 bg-red-500 flex items-center justify-center transition-transform duration-300 ${
          showDelete ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button onClick={confirmDelete} className="text-white font-bold">
          HAPUS
        </button>
      </div>

      <div
        className={`flex items-center gap-4 p-2 border-b bg-white transition-transform duration-300 ${
          isSwiping ? "cursor-grabbing" : "cursor-grab"
        } ${isUnavailable ? "opacity-60" : ""}`}
        style={{
          transform: showDelete
            ? "translateX(-80px)"
            : `translateX(-${swipeOffset}px)`,
        }}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleToggleSelect}
          disabled={isUnavailable}
        />
        <button
          onClick={() =>
            !isUnavailable &&
            navigate(`/product-detail/${item.variant?.product?.id}/detail`)
          }
          className="flex-shrink-0"
          disabled={isUnavailable}
        >
          <img
            src={item.variant.img_url}
            className="w-16 h-16 object-cover rounded"
            alt={item.variant.name}
          />
        </button>
        <div className="flex-1">
          <h3 className="font-medium">{item.variant?.name}</h3>
          {isUnavailable && (
            <div className="text-red-500 text-sm font-medium mt-1">
              {isDeleted ? "Produk tidak tersedia" : "Stok Habis"}
            </div>
          )}
          <div className="flex items-center gap-4 mt-2">
            <p className="text-blue-700 font-bold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(item.variant.price)}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                className={`px-2 py-1 border rounded transition ${
                  isUnavailable
                    ? "bg-gray-100 cursor-not-allowed text-gray-400"
                    : "hover:bg-gray-100"
                }`}
                disabled={isUnavailable}
              >
                -
              </button>
              <span
                className={`min-w-[20px] text-center ${
                  isUnavailable ? "text-gray-400" : ""
                }`}
              >
                {item.quantity}
              </span>
              <button
                onClick={handleIncrement}
                className={`px-2 py-1 border rounded transition ${
                  isUnavailable
                    ? "bg-gray-100 cursor-not-allowed text-gray-400"
                    : "hover:bg-gray-100"
                }`}
                disabled={isUnavailable}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
              onRemove();
            }
          }}
          className={`text-red-500 hover:text-red-700 hidden md:block transition ${
            isUnavailable
              ? "text-gray-400 hover:text-gray-400 cursor-not-allowed"
              : ""
          }`}
          disabled={isUnavailable}
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

// Komponen Pembayaran yang sudah diintegrasikan dengan useOrderStore
const Pembayaran = ({ cartItems, onBack, onSuccess }) => {
  const [form, setForm] = useState({
    nama: "",
    blok: "",
    nomorRegister: "",
    namaPengirim: "",
    catatan: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createOrder } = useOrderStore();
  const { removeCartItem, clearSelectedCart } = useCartStore();

  const formatRupiah = (n) =>
    "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const total = cartItems.reduce((sum, item) => sum + item.variant?.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for order creation
      const orderData = {
        items: cartItems.map(item => ({
          variant_id: item.variant?.id,
          quantity: item.quantity
        })),
        payment_method: "transfer", // Default payment method
        wbp_name: form.nama,
        wbp_room: form.blok,
        wbp_register_number: form.nomorRegister,
        wbp_sender: form.namaPengirim,
        note: form.catatan
      };

      // Create order using useOrderStore
      const result = await createOrder(orderData);

      if (result.status === 'success') {
        // Remove ordered items from cart
        cartItems.forEach(item => {
          removeCartItem(item.id);
        });
        clearSelectedCart();

        // Set notification for new transaction
        localStorage.setItem("notifTransaksi", "true");

        // Add notification for admin
        const adminNotifs = JSON.parse(localStorage.getItem("adminNotifications")) || [];
        adminNotifs.push({
          id: result.data.data.order_id,
          message: `Transaksi baru dari ${form.nama} (${form.namaPengirim}) - Total ${formatRupiah(total)}`,
          time: new Date().toLocaleString("id-ID"),
          read: false,
          data: result.data.data,
        });
        localStorage.setItem("adminNotifications", JSON.stringify(adminNotifs));

        toast.success("✅ Pembayaran berhasil dikonfirmasi! Menunggu verifikasi admin.");
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Order creation error:", error);
      // Error message is already handled in useOrderStore
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Poppins']">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="bg-none border-none cursor-pointer p-0 mr-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <CreditCard className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Formulir Pembayaran WBP
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Nama WBP */}
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Input Blok dan Register */}
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                disabled={isSubmitting}
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Nama Pengirim */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nama Pengirim
            </label>
            <input
              type="text"
              name="namaPengirim"
              value={form.namaPengirim}
              onChange={(e) =>
                setForm({ ...form, namaPengirim: e.target.value })
              }
              required
              placeholder="Masukkan nama pengirim pembayaran"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Catatan */}
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              disabled={isSubmitting}
            ></textarea>
          </div>

          {/* Ringkasan Pembelian */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Ringkasan Pembelian
            </h3>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-gray-700 mb-2"
              >
                <span>
                  {item.variant?.name}{" "}
                  <span className="text-sm text-gray-500">x{item.quantity}</span>
                </span>
                <span className="font-medium">
                  {formatRupiah(item.variant?.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="flex justify-between mt-4 text-lg font-semibold">
              <span>Total Pembayaran</span>
              <span className="text-green-700">{formatRupiah(total)}</span>
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Memproses..." : "Konfirmasi Pembayaran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Keranjang = () => {
  const [expandedSellers, setExpandedSellers] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);
  
  // Use Zustand stores
  const {
    cartItems,
    selectedCart,
    fetchCarts,
    removeCartItem,
    incrementCartItemQuantity,
    decrementCartItemQuantity,
    toggleCartSelection,
    toggleSellerSelection,
    clearSelectedCart,
  } = useCartStore();

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  console.log("Cart Items:", cartItems);

  // Group items by seller
  const groupedItems = cartItems?.reduce((acc, item) => {
    const sellerId = item.variant?.product?.user_id;
    if (!acc[sellerId]) {
      acc[sellerId] = {
        sellerName: item.variant?.product?.user?.nama,
        items: [],
        subtotal: 0,
      };
    }
    acc[sellerId].items.push(item);
    acc[sellerId].subtotal += item.variant?.price * item.quantity;
    return acc;
  }, {});

  console.log("Grouped Items:", groupedItems);

  useEffect(() => {
    if (
      cartItems &&
      cartItems.length > 0 &&
      Object.keys(expandedSellers).length === 0
    ) {
      const initialExpanded = {};
      Object.keys(groupedItems).forEach((sellerId) => {
        initialExpanded[sellerId] = true;
      });
      setExpandedSellers(initialExpanded);
    }
  }, [cartItems, groupedItems, expandedSellers]);

  const selectedSubtotal = Object.values(groupedItems || {})?.reduce(
    (sum, seller) => {
      const sellerTotal = seller.items
        .filter(
          (item) =>
            selectedCart.some((cartItem) => cartItem.id === item.id) &&
            item.variant?.stock > 0 &&
            !item.variant?.is_delete
        )
        .reduce((s, item) => {
          const selectedItem = selectedCart.find(
            (cartItem) => cartItem.id === item.id
          );
          return (
            s + item.variant?.price * (selectedItem?.quantity || item.quantity)
          );
        }, 0);
      return sum + sellerTotal;
    },
    0
  );

  const handleToggleSeller = (sellerId) => {
    const seller = groupedItems[sellerId];

    const hasUnavailable = seller.items.some(
      (item) => item.variant?.stock <= 0 || item.variant?.is_delete
    );

    if (hasUnavailable) {
      toast.error(
        "Tidak bisa memilih seller karena ada produk yang tidak tersedia"
      );
      return;
    }

    toggleSellerSelection(sellerId);
  };

  const handleUnavailableClick = () => {
    toast.error("Produk ini tidak tersedia");
  };

  const handleCheckout = () => {
    if (selectedCart.length === 0) {
      toast.error("Pilih minimal satu produk untuk checkout");
      return;
    }
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    navigate("/user/history");
  };

  const totalAvailableItems = cartItems.filter(
    (item) => item.variant?.stock > 0 && !item.variant?.is_delete
  ).length;

  // Tampilkan komponen Pembayaran jika showCheckout true
  if (showCheckout) {
    return (
      <Pembayaran 
        cartItems={selectedCart} 
        onBack={() => setShowCheckout(false)}
        onSuccess={handleCheckoutSuccess}
      />
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="container min-h-screen flex flex-col mx-auto p-4 pb-16 md:pb-0 md:mt-14">
        <div className="flex">
          <span>
            <button
              onClick={() => navigate(-1)}
              className="bg-none border-none cursor-pointer p-0"
            >
              <ArrowLeft className="fw-bold me-3 mt-1" />
            </button>
          </span>
          <span>
            <h1 className="text-2xl font-bold mb-6">
              Keranjang Saya{" "}
              <span className="text-blue-700"> ({totalAvailableItems})</span>
            </h1>
          </span>
        </div>

        {Object.entries(groupedItems || {}).map(([sellerId, seller]) => {
          const availableItems = seller.items.filter(
            (item) => item.variant?.stock > 0 && !item.variant?.is_delete
          );
          
          const allAvailableSelected = availableItems.length > 0 &&
            availableItems.every((item) =>
              selectedCart.some((selected) => selected.id === item.id)
            );

          const hasUnavailable = seller.items.some(
            (item) => item.variant?.stock <= 0 || item.variant?.is_delete
          );

          return (
            <div
              key={sellerId}
              className="bg-white rounded-lg shadow-md mb-6 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allAvailableSelected}
                    onCheckedChange={() => handleToggleSeller(sellerId)}
                    disabled={hasUnavailable || availableItems.length === 0}
                  />
                  <span className="font-semibold">{seller.sellerName}</span>
                  {hasUnavailable && (
                    <span className="text-red-500 text-sm ml-2">
                      (Ada produk yang tidak tersedia)
                    </span>
                  )}
                </div>
                <button
                  onClick={() =>
                    setExpandedSellers((prev) => ({
                      ...prev,
                      [sellerId]: !prev[sellerId],
                    }))
                  }
                  className="text-blue-700 hover:text-blue-900"
                >
                  {expandedSellers[sellerId] ? "Sembunyikan" : "Lihat Detail"}
                </button>
              </div>

              {expandedSellers[sellerId] &&
                seller.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={() => removeCartItem(item.id)}
                    onIncrement={() => incrementCartItemQuantity(item.id)}
                    onDecrement={() => decrementCartItemQuantity(item.id)}
                    isSelected={selectedCart.some(
                      (cartItem) => cartItem.id === item.id
                    )}
                    onToggleSelect={() => toggleCartSelection(item)}
                    onOutOfStockClick={handleUnavailableClick}
                    navigate={navigate}
                  />
                ))}
            </div>
          );
        })}

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Total Belanja</h2>
            <div className="text-right">
              <p className="text-gray-600">
                Total Item:{" "}
                {
                  selectedCart.filter(
                    (item) =>
                      item.variant?.stock > 0 && !item.variant?.is_delete
                  ).length
                }
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(selectedSubtotal)}
              </p>
            </div>
          </div>

          {/* Tombol Checkout */}
          <button
            onClick={handleCheckout}
            disabled={selectedCart.length === 0}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
              selectedCart.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span>Checkout</span>
            </div>
          </button>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-4 text-xs mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Keranjang;