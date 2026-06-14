import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  CreditCard,
  Banknote,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Store,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import useAuthStore from "../../stores/useAuthStore";
import useCartStore from "../../stores/useCartStore";
import useOrderStore from "../../stores/useOrderStore";
import toast, { Toaster } from "react-hot-toast";

/* ─── helpers ─────────────────────────────────────────── */
const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

/* ─── CartItem ─────────────────────────────────────────── */
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

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };
  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    touchEndX.current = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 0) setSwipeOffset(Math.min(diff, 80));
    else if (diff < 0 && showDelete) { setSwipeOffset(0); setShowDelete(false); }
  };
  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (swipeOffset > 50 && !showDelete) { setShowDelete(true); setSwipeOffset(80); }
    else if (swipeOffset < 50 && !showDelete) setSwipeOffset(0);
  };
  const handleMouseLeave = () => {
    if (swipeOffset > 0 && !showDelete) setSwipeOffset(0);
  };
  const confirmDelete = () => {
    if (window.confirm("Hapus item ini dari keranjang?")) {
      onRemove(); setShowDelete(false); setSwipeOffset(0);
    } else { setShowDelete(false); setSwipeOffset(0); }
  };

  return (
    <div
      ref={itemRef}
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseLeave={handleMouseLeave}
    >
      {/* swipe delete bg */}
      <div
        className={`absolute right-0 top-0 h-full w-20 bg-red-500 flex flex-col items-center justify-center gap-1 transition-transform duration-200 ${
          showDelete ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button onClick={confirmDelete} className="text-white flex flex-col items-center gap-1">
          <Trash2 size={18} />
          <span className="text-xs font-semibold">Hapus</span>
        </button>
      </div>

      <div
        className={`flex items-start gap-3 py-4 transition-transform duration-200 ${
          isUnavailable ? "opacity-50" : ""
        }`}
        style={{
          transform: showDelete ? "translateX(-80px)" : `translateX(-${swipeOffset}px)`,
        }}
      >
        {/* checkbox */}
        <div className="pt-1 shrink-0">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => isUnavailable ? onOutOfStockClick() : onToggleSelect()}
            disabled={isUnavailable}
          />
        </div>

        {/* image */}
        <button
          onClick={() =>
            !isUnavailable &&
            navigate(`/product-detail/${item.variant?.product?.id}/detail`)
          }
          className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50"
          disabled={isUnavailable}
        >
          <img
            src={item.variant?.img_url || "https://via.placeholder.com/64"}
            className="w-full h-full object-cover"
            alt={item.variant?.name || "Product"}
          />
        </button>

        {/* info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
            {item.variant?.name || "Produk"}
          </p>

          {isUnavailable && (
            <span className="inline-block mt-1 text-xs font-medium text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              {isDeleted ? "Tidak tersedia" : "Stok habis"}
            </span>
          )}

          <p className="text-blue-600 font-bold text-sm mt-1">
            {formatRupiah(item.variant?.price || 0)}
          </p>

          <div className="flex items-center justify-between mt-2.5">
            {/* stepper */}
            <div
              className={`inline-flex items-center border border-gray-200 rounded-full overflow-hidden ${
                isUnavailable ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <button
                onClick={(e) => { e.stopPropagation(); onDecrement(); }}
                disabled={isUnavailable}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
              >
                <Minus size={13} />
              </button>
              <span className="w-7 text-center text-sm font-semibold text-gray-700">
                {item.quantity}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onIncrement(); }}
                disabled={isUnavailable}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
              >
                <Plus size={13} />
              </button>
            </div>

            {/* subtotal */}
            <p className="text-xs text-gray-500">
              Subtotal:{" "}
              <span className="font-semibold text-gray-700">
                {formatRupiah((item.variant?.price || 0) * item.quantity)}
              </span>
            </p>
          </div>
        </div>

        {/* desktop delete */}
        <button
          onClick={() => {
            if (window.confirm("Hapus item ini dari keranjang?")) onRemove();
          }}
          disabled={isUnavailable}
          className="hidden md:flex shrink-0 w-8 h-8 items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

/* ─── PaymentMethodOption ──────────────────────────────── */
const PaymentMethodOption = ({ icon: Icon, title, description, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left rounded-xl p-4 border-2 transition-all duration-150 ${
      selected
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 bg-white hover:border-gray-300"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
          selected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
          selected ? "border-blue-500 bg-blue-500" : "border-gray-300"
        }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </div>
  </button>
);

/* ─── Pembayaran ───────────────────────────────────────── */
const Pembayaran = ({ cartItems, onBack, onSuccess }) => {
  const [form, setForm] = useState({
    wbp_name: "",
    wbp_room: "",
    wbp_register_number: "",
    wbp_sender: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [error, setError] = useState(null);

  const { createOrder } = useOrderStore();
  const navigate = useNavigate();

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const subtotal = safeCartItems.reduce(
    (s, i) => s + (i?.variant?.price || 0) * (i?.quantity || 0),
    0
  );

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!form.wbp_name.trim()) {
      setError("Nama WBP wajib diisi"); toast.error("Nama WBP wajib diisi");
      setIsSubmitting(false); return;
    }
    if (!form.wbp_room.trim()) {
      setError("Blok/Kamar wajib diisi"); toast.error("Blok/Kamar wajib diisi");
      setIsSubmitting(false); return;
    }
    if (!form.wbp_sender.trim()) {
      setError("Nama Pengirim wajib diisi"); toast.error("Nama Pengirim wajib diisi");
      setIsSubmitting(false); return;
    }

    try {
      const orderData = {
        items: safeCartItems.map((i) => ({ variant_id: i.variant?.id, quantity: i.quantity })),
        payment_method: paymentMethod,
        wbp_name: form.wbp_name.trim(),
        wbp_room: form.wbp_room.trim(),
        wbp_register_number: form.wbp_register_number.trim(),
        wbp_sender: form.wbp_sender.trim(),
        note: form.note.trim(),
      };

      const result = await createOrder(orderData);

      if (result.status === "success") {
        localStorage.setItem("notifTransaksi", "true");
        toast.success("✅ Pesanan berhasil dibuat!");
        if (onSuccess) onSuccess();
        navigate(`/user/payment/${result.data.order_id}`);
      } else {
        const msg = result.message || "Gagal membuat pesanan";
        setError(msg); toast.error(msg);
      }
    } catch (err) {
      let msg = "Terjadi kesalahan saat membuat pesanan";
      if (err.response?.data) {
        msg = typeof err.response.data === "string"
          ? err.response.data
          : err.response.data.message || err.response.data.error || msg;
        msg += ` (Status: ${err.response.status})`;
      } else if (err.request) {
        msg = "Tidak ada respons dari server. Periksa koneksi Anda.";
      } else {
        msg = err.message || msg;
      }
      setError(msg); toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />

      {/* ── header (tidak sticky, cukup di atas konten) ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="font-bold text-gray-900 text-lg">Formulir Pemesanan</h1>
      </div>

      {/* ── konten (scroll bebas, TIDAK ada fixed footer) ── */}
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* error banner */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* metode pembayaran */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
            <CreditCard size={16} className="text-blue-500" />
            Metode Pembayaran <span className="text-red-500">*</span>
          </h2>
          <PaymentMethodOption
            icon={Banknote}
            title="Transfer Bank"
            description="Transfer ke rekening, lalu konfirmasi ke admin"
            selected={paymentMethod === "transfer"}
            onClick={() => setPaymentMethod("transfer")}
          />
          {paymentMethod === "transfer" && (
            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-wide">
                Info Rekening Tujuan
              </p>
              <div className="space-y-1 text-sm text-blue-700">
                <p>🏦 <span className="font-medium">Bank BCA</span></p>
                <p>📋 No. Rek: <span className="font-bold tracking-widest">1234567890</span></p>
                <p>👤 Atas Nama: <span className="font-medium">Nama Toko</span></p>
              </div>
              <p className="text-xs text-blue-500 mt-3 pt-2 border-t border-blue-200">
                Konfirmasi pembayaran ke admin via WhatsApp setelah transfer.
              </p>
            </div>
          )}
        </div>

        {/* data penerima */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <Store size={16} className="text-blue-500" />
            Data Penerima (WBP)
          </h2>

          {/* nama wbp */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Nama WBP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.wbp_name}
              onChange={(e) => setField("wbp_name", e.target.value)}
              placeholder="Nama lengkap WBP"
              disabled={isSubmitting}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition placeholder:text-gray-400"
            />
          </div>

          {/* blok + register */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Blok / Kamar <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.wbp_room}
                onChange={(e) => setField("wbp_room", e.target.value)}
                placeholder="cth: Blok A-2"
                disabled={isSubmitting}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                No. Register
              </label>
              <input
                type="text"
                value={form.wbp_register_number}
                onChange={(e) => setField("wbp_register_number", e.target.value)}
                placeholder="Opsional"
                disabled={isSubmitting}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* nama pengirim */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Nama Pengirim <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.wbp_sender}
              onChange={(e) => setField("wbp_sender", e.target.value)}
              placeholder="Nama Anda (pengirim pembayaran)"
              disabled={isSubmitting}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition placeholder:text-gray-400"
            />
          </div>

          {/* catatan */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Catatan <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea
              value={form.note}
              onChange={(e) => setField("note", e.target.value)}
              rows={3}
              placeholder="Tulis catatan tambahan..."
              disabled={isSubmitting}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition resize-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* ringkasan */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-4">
            <ShoppingBag size={16} className="text-blue-500" />
            Ringkasan Pesanan
          </h2>
          <div className="space-y-2">
            {safeCartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 truncate max-w-[65%]">
                  {item.variant?.name || "Produk"}{" "}
                  <span className="text-gray-400">×{item.quantity}</span>
                </span>
                <span className="font-semibold text-gray-800 shrink-0">
                  {formatRupiah((item.variant?.price || 0) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-dashed border-gray-200 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span className="flex items-center gap-1">
                <Tag size={13} /> Biaya Admin
              </span>
              <span className="font-medium">Gratis</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total Bayar</span>
            <span className="font-bold text-blue-600 text-lg">{formatRupiah(subtotal)}</span>
          </div>
        </div>

        {/* info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-800">
            Pesanan akan diproses setelah pembayaran dikonfirmasi oleh admin.
            Silakan lakukan transfer sesuai instruksi di atas.
          </p>
        </div>

        {/* ── tombol INLINE (tidak fixed, tidak tertutup) ── */}
        <div className="flex gap-3 pt-2 pb-8">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
          >
            Kembali
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-[2] py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition active:scale-[0.98] ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Konfirmasi Pesanan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Keranjang (main) ─────────────────────────────────── */
const Keranjang = () => {
  const [expandedSellers, setExpandedSellers] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartError, setCartError] = useState(null);
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);

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
    (async () => {
      try {
        setIsLoading(true);
        setCartError(null);
        await fetchCarts();
      } catch {
        setCartError("Gagal memuat keranjang. Silakan coba lagi.");
        toast.error("Gagal memuat keranjang.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fetchCarts]);

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const groupedItems = safeCartItems.reduce((acc, item) => {
    if (!item?.variant?.product) return acc;
    const sid = item.variant.product.user_id;
    if (!acc[sid])
      acc[sid] = {
        sellerName: item.variant.product.user?.nama || "Penjual",
        items: [],
        subtotal: 0,
      };
    acc[sid].items.push(item);
    acc[sid].subtotal += (item.variant?.price || 0) * (item.quantity || 0);
    return acc;
  }, {});

  useEffect(() => {
    if (safeCartItems.length > 0 && Object.keys(expandedSellers).length === 0) {
      const init = {};
      Object.keys(groupedItems).forEach((k) => { init[k] = true; });
      setExpandedSellers(init);
    }
  }, [safeCartItems]);

  const selectedSubtotal = Object.values(groupedItems).reduce((sum, seller) =>
    sum +
    seller.items
      .filter(
        (i) =>
          selectedCart.some((c) => c.id === i.id) &&
          i.variant?.stock > 0 &&
          !i.variant?.is_delete
      )
      .reduce(
        (s, i) =>
          s +
          (i.variant?.price || 0) *
            (selectedCart.find((c) => c.id === i.id)?.quantity || i.quantity || 0),
        0
      ),
    0
  );

  const totalAvailableItems = safeCartItems.filter(
    (i) => i.variant?.stock > 0 && !i.variant?.is_delete
  ).length;

  const selectedCount = selectedCart.filter(
    (i) => i.variant?.stock > 0 && !i.variant?.is_delete
  ).length;

  const handleCheckout = () => {
    if (!selectedCount) { toast.error("Pilih minimal satu produk"); return; }
    if (selectedCart.some((i) => i.variant?.stock <= 0 || i.variant?.is_delete)) {
      toast.error("Hapus produk tidak tersedia terlebih dahulu"); return;
    }
    if (selectedSubtotal < 10000) { toast.error("Minimum belanja Rp 10.000"); return; }
    setShowCheckout(true);
  };

  if (showCheckout)
    return (
      <Pembayaran
        cartItems={selectedCart}
        onBack={() => setShowCheckout(false)}
        onSuccess={() => { setShowCheckout(false); navigate("/user/orders"); }}
      />
    );

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Memuat keranjang…</p>
      </div>
    );

  if (cartError)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-gray-50 text-center">
        <AlertCircle size={44} className="text-red-400" />
        <h2 className="font-bold text-gray-800 text-lg">Gagal Memuat Keranjang</h2>
        <p className="text-gray-500 text-sm">{cartError}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
        >
          Coba Lagi
        </button>
      </div>
    );

  if (safeCartItems.length === 0)
    return (
      <>
        <Toaster position="top-center" />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
            <ShoppingBag size={40} className="text-blue-500" />
          </div>
          <h2 className="font-bold text-gray-800 text-xl">Keranjang masih kosong</h2>
          <p className="text-gray-500 text-sm max-w-xs">
            Belum ada produk yang ditambahkan. Yuk mulai belanja!
          </p>
          <button
            onClick={() => navigate("/user/belanja")}
            className="mt-1 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition"
          >
            Mulai Belanja
          </button>
        </div>
      </>
    );

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50">

        {/* header */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2 md:mt-14">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-900 text-lg">Keranjang</h1>
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {totalAvailableItems}
          </span>
        </div>

        {/* list */}
        <div className="max-w-2xl mx-auto px-3 py-4 space-y-3">
          {Object.entries(groupedItems).map(([sellerId, seller]) => {
            const availItems = seller.items.filter(
              (i) => i.variant?.stock > 0 && !i.variant?.is_delete
            );
            const allSelected =
              availItems.length > 0 &&
              availItems.every((i) => selectedCart.some((c) => c.id === i.id));
            const hasUnavailable = seller.items.some(
              (i) => i.variant?.stock <= 0 || i.variant?.is_delete
            );
            const isExpanded = expandedSellers[sellerId] ?? true;

            return (
              <div
                key={sellerId}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* seller header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={() => {
                      if (hasUnavailable) {
                        toast.error("Ada produk yang tidak tersedia"); return;
                      }
                      toggleSellerSelection(sellerId);
                    }}
                    disabled={hasUnavailable || availItems.length === 0}
                  />
                  <Store size={14} className="text-gray-400 shrink-0" />
                  <span className="font-semibold text-gray-700 text-sm flex-1 truncate">
                    {seller.sellerName}
                  </span>
                  {hasUnavailable && (
                    <span className="text-xs text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full shrink-0">
                      Stok habis
                    </span>
                  )}
                  <button
                    onClick={() =>
                      setExpandedSellers((p) => ({ ...p, [sellerId]: !p[sellerId] }))
                    }
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition shrink-0"
                  >
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>

                {/* items */}
                {isExpanded && (
                  <div className="px-4 divide-y divide-gray-50">
                    {seller.items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onRemove={() => removeCartItem(item.id)}
                        onIncrement={() => incrementCartItemQuantity(item.id)}
                        onDecrement={() => decrementCartItemQuantity(item.id)}
                        isSelected={selectedCart.some((c) => c.id === item.id)}
                        onToggleSelect={() => toggleCartSelection(item)}
                        onOutOfStockClick={() => toast.error("Produk ini tidak tersedia")}
                        navigate={navigate}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* ── checkout summary + button INLINE (tidak fixed) ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-2">
            {/* pilih semua */}
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
              <Checkbox
                checked={selectedCount > 0 && selectedCount === totalAvailableItems}
                onCheckedChange={() => {
                  if (selectedCount === totalAvailableItems) {
                    clearSelectedCart();
                  } else {
                    Object.keys(groupedItems).forEach((sid) => {
                      const hasUnavail = groupedItems[sid].items.some(
                        (i) => i.variant?.stock <= 0 || i.variant?.is_delete
                      );
                      if (!hasUnavail) toggleSellerSelection(sid);
                    });
                  }
                }}
              />
              <span className="text-sm text-gray-600">
                Pilih semua ({totalAvailableItems} produk)
              </span>
            </div>

            {/* total */}
            <div className="flex justify-between items-center py-4">
              <div>
                <p className="text-xs text-gray-500">{selectedCount} produk dipilih</p>
                <p className="font-bold text-blue-600 text-xl mt-0.5">
                  {formatRupiah(selectedSubtotal)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600 font-medium">✓ Gratis biaya admin</p>
                <p className="text-xs text-gray-400 mt-0.5">Min. belanja Rp 10.000</p>
              </div>
            </div>

            {/* checkout button */}
            <button
              onClick={handleCheckout}
              disabled={selectedCount === 0}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition active:scale-[0.98] ${
                selectedCount === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <ShoppingBag size={16} />
              {selectedCount > 0
                ? `Checkout (${selectedCount} produk)`
                : "Pilih produk dulu"}
            </button>
          </div>
        </div>

        <footer className="bg-gray-800 text-white py-4 text-xs mt-6">
          <div className="container mx-auto px-4 text-center">
            <p>© 2025 All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Keranjang;