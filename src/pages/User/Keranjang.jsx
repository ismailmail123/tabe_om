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
  Package,
  CheckCircle2,
  Store,
} from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import useAuthStore from "../../stores/useAuthStore";
import useCartStore from "../../stores/useCartStore";
import useOrderStore from "../../stores/useOrderStore";
import toast, { Toaster } from "react-hot-toast";

/* ─── helpers ──────────────────────────────────────────────── */
const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

/* ─── CartItem ──────────────────────────────────────────────── */
const CartItem = ({ item, onRemove, onIncrement, onDecrement, isSelected, onToggleSelect, navigate, onOutOfStockClick }) => {
  const touchStartX = useRef(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);

  const isOutOfStock = item.variant?.stock <= 0;
  const isDeleted = item.variant?.is_delete;
  const isUnavailable = isOutOfStock || isDeleted;

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; setIsSwiping(true); };
  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const diff = touchStartX.current - e.touches[0].clientX;
    if (diff > 0) setSwipeOffset(Math.min(diff, 80));
    else if (diff < 0 && showDelete) { setSwipeOffset(0); setShowDelete(false); }
  };
  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (swipeOffset > 50) { setShowDelete(true); setSwipeOffset(80); }
    else { setSwipeOffset(0); }
  };

  const confirmDelete = () => {
    if (window.confirm("Hapus item ini dari keranjang?")) { onRemove(); setShowDelete(false); setSwipeOffset(0); }
    else { setShowDelete(false); setSwipeOffset(0); }
  };

  return (
    <div className="relative overflow-hidden" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {/* swipe-to-delete bg */}
      <div className={`absolute right-0 top-0 h-full w-20 bg-red-500 flex items-center justify-center transition-transform duration-200 ${showDelete ? "translate-x-0" : "translate-x-full"}`}>
        <button onClick={confirmDelete} className="text-white text-xs font-bold flex flex-col items-center gap-1">
          <Trash2 size={16} /><span>Hapus</span>
        </button>
      </div>

      <div
        className={`flex items-center gap-3 py-4 px-1 transition-transform duration-200 ${isUnavailable ? "opacity-50" : ""}`}
        style={{ transform: showDelete ? "translateX(-80px)" : `translateX(-${swipeOffset}px)` }}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => isUnavailable ? onOutOfStockClick() : onToggleSelect()}
          disabled={isUnavailable}
          className="mt-1 shrink-0"
        />

        <button
          onClick={() => !isUnavailable && navigate(`/product-detail/${item.variant?.product?.id}/detail`)}
          className="shrink-0 rounded-xl overflow-hidden border border-gray-100"
          disabled={isUnavailable}
        >
          <img
            src={item.variant?.img_url || "https://via.placeholder.com/64"}
            className="w-16 h-16 object-cover"
            alt={item.variant?.name || "Product"}
          />
        </button>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm leading-snug truncate">{item.variant?.name || "Produk"}</p>
          {isUnavailable && (
            <span className="inline-block mt-0.5 text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              {isDeleted ? "Tidak tersedia" : "Stok habis"}
            </span>
          )}
          <p className="text-[#2563EB] font-bold text-sm mt-1">{formatRupiah(item.variant?.price || 0)}</p>

          <div className="flex items-center justify-between mt-2">
            {/* qty stepper */}
            <div className={`flex items-center border rounded-full overflow-hidden text-sm ${isUnavailable ? "opacity-40 pointer-events-none" : ""}`}>
              <button
                onClick={(e) => { e.stopPropagation(); onDecrement(); }}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600"
                disabled={isUnavailable}
              ><Minus size={13} /></button>
              <span className="w-7 text-center font-semibold text-gray-700 text-xs">{item.quantity}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onIncrement(); }}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600"
                disabled={isUnavailable}
              ><Plus size={13} /></button>
            </div>

            <p className="text-xs text-gray-500 font-medium">
              Subtotal: <span className="text-gray-700 font-semibold">{formatRupiah((item.variant?.price || 0) * item.quantity)}</span>
            </p>
          </div>
        </div>

        {/* desktop delete */}
        <button
          onClick={() => { if (window.confirm("Hapus item ini?")) onRemove(); }}
          className="hidden md:flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition shrink-0"
          disabled={isUnavailable}
        ><Trash2 size={16} /></button>
      </div>
    </div>
  );
};

/* ─── PaymentMethodOption ───────────────────────────────────── */
const PaymentMethodOption = ({ icon: Icon, title, description, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left border-2 rounded-2xl p-4 transition-all duration-200 ${selected ? "border-[#2563EB] bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected ? "bg-[#2563EB] text-white" : "bg-gray-100 text-gray-500"}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${selected ? "border-[#2563EB] bg-[#2563EB]" : "border-gray-300"}`}>
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </div>
  </button>
);

/* ─── Pembayaran ────────────────────────────────────────────── */
const Pembayaran = ({ cartItems, onBack, onSuccess }) => {
  const [form, setForm] = useState({ wbp_name: "", wbp_room: "", wbp_register_number: "", wbp_sender: "", note: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [error, setError] = useState(null);
  const { createOrder } = useOrderStore();
  const navigate = useNavigate();

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const subtotal = safeCartItems.reduce((s, i) => s + (i?.variant?.price || 0) * (i?.quantity || 0), 0);

  const setField = (key, val) => { setForm(f => ({ ...f, [key]: val })); setError(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    if (!form.wbp_name.trim()) { setError("Nama WBP wajib diisi"); toast.error("Nama WBP wajib diisi"); setIsSubmitting(false); return; }
    if (!form.wbp_room.trim()) { setError("Blok/Kamar wajib diisi"); toast.error("Blok/Kamar wajib diisi"); setIsSubmitting(false); return; }
    if (!form.wbp_sender.trim()) { setError("Nama Pengirim wajib diisi"); toast.error("Nama Pengirim wajib diisi"); setIsSubmitting(false); return; }
    try {
      const orderData = {
        items: safeCartItems.map(i => ({ variant_id: i.variant?.id, quantity: i.quantity })),
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
      if (err.response?.data) msg = typeof err.response.data === "string" ? err.response.data : err.response.data.message || err.response.data.error || msg;
      setError(msg); toast.error(msg);
    } finally { setIsSubmitting(false); }
  };

  const InputField = ({ label, required, placeholder, name, value, onChange, type = "text" }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={isSubmitting}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none bg-gray-50 focus:bg-white transition placeholder:text-gray-400"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Toaster position="top-center" />
      {/* header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} disabled={isSubmitting} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="font-bold text-gray-900 text-lg">Formulir Pemesanan</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 pb-32">
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* metode pembayaran */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <CreditCard size={18} className="text-[#2563EB]" /> Metode Pembayaran
          </h2>
          <PaymentMethodOption
            icon={Banknote}
            title="Transfer Bank"
            description="Transfer ke rekening, lalu konfirmasi ke admin"
            selected={paymentMethod === "transfer"}
            onClick={() => setPaymentMethod("transfer")}
          />
          {paymentMethod === "transfer" && (
            <div className="mt-3 bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs font-semibold text-blue-800 mb-2">Info Rekening Tujuan</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>🏦 Bank BCA</p>
                <p>📋 No. Rek: <span className="font-bold tracking-wider">1234567890</span></p>
                <p>👤 Atas Nama: Nama Toko</p>
              </div>
              <p className="text-xs text-blue-600 mt-2 pt-2 border-t border-blue-200">Konfirmasi ke admin via WhatsApp setelah transfer.</p>
            </div>
          )}
        </div>

        {/* data penerima */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Package size={18} className="text-[#2563EB]" /> Data Penerima (WBP)
          </h2>
          <InputField label="Nama WBP" required name="wbp_name" value={form.wbp_name} onChange={v => setField("wbp_name", v)} placeholder="Nama lengkap WBP" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Blok / Kamar" required name="wbp_room" value={form.wbp_room} onChange={v => setField("wbp_room", v)} placeholder="cth: Blok A-2" />
            <InputField label="No. Register" name="wbp_register_number" value={form.wbp_register_number} onChange={v => setField("wbp_register_number", v)} placeholder="Opsional" />
          </div>
          <InputField label="Nama Pengirim" required name="wbp_sender" value={form.wbp_sender} onChange={v => setField("wbp_sender", v)} placeholder="Nama Anda (pengirim pembayaran)" />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catatan <span className="text-gray-400 font-normal">(opsional)</span></label>
            <textarea
              value={form.note}
              onChange={e => setField("note", e.target.value)}
              rows={3}
              placeholder="Tulis catatan tambahan..."
              disabled={isSubmitting}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none bg-gray-50 focus:bg-white transition resize-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* ringkasan */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#2563EB]" /> Ringkasan Pesanan
          </h2>
          <div className="space-y-2">
            {safeCartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 truncate max-w-[60%]">{item.variant?.name || "Produk"} <span className="text-gray-400">×{item.quantity}</span></span>
                <span className="font-semibold text-gray-800">{formatRupiah((item.variant?.price || 0) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-gray-200 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span><span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Biaya Admin</span><span className="font-medium">Gratis 🎉</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Bayar</span><span className="text-[#2563EB]">{formatRupiah(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex gap-3 max-w-2xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
        >Kembali</button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex-[2] py-3 rounded-2xl font-bold text-sm text-white transition flex items-center justify-center gap-2 ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#2563EB] hover:bg-[#1d4ed8] active:scale-[0.98]"}`}
        >
          {isSubmitting ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Memproses...</>
          ) : (
            <><CheckCircle2 size={16} /> Konfirmasi Pesanan</>
          )}
        </button>
      </div>
    </div>
  );
};

/* ─── Keranjang (main) ──────────────────────────────────────── */
const Keranjang = () => {
  const [expandedSellers, setExpandedSellers] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartError, setCartError] = useState(null);
  const navigate = useNavigate();

  const {
    cartItems, selectedCart, fetchCarts, removeCartItem,
    incrementCartItemQuantity, decrementCartItemQuantity,
    toggleCartSelection, toggleSellerSelection, clearSelectedCart,
  } = useCartStore();

  useEffect(() => {
    (async () => {
      try { setIsLoading(true); setCartError(null); await fetchCarts(); }
      catch { setCartError("Gagal memuat keranjang. Silakan coba lagi."); toast.error("Gagal memuat keranjang."); }
      finally { setIsLoading(false); }
    })();
  }, [fetchCarts]);

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const groupedItems = safeCartItems.reduce((acc, item) => {
    if (!item?.variant?.product) return acc;
    const sid = item.variant.product.user_id;
    if (!acc[sid]) acc[sid] = { sellerName: item.variant.product.user?.nama || "Penjual", items: [], subtotal: 0 };
    acc[sid].items.push(item);
    acc[sid].subtotal += (item.variant?.price || 0) * (item.quantity || 0);
    return acc;
  }, {});

  useEffect(() => {
    if (safeCartItems.length > 0 && Object.keys(expandedSellers).length === 0) {
      const init = {};
      Object.keys(groupedItems).forEach(k => { init[k] = true; });
      setExpandedSellers(init);
    }
  }, [safeCartItems]);

  const selectedSubtotal = Object.values(groupedItems).reduce((sum, seller) =>
    sum + seller.items
      .filter(i => selectedCart.some(c => c.id === i.id) && i.variant?.stock > 0 && !i.variant?.is_delete)
      .reduce((s, i) => s + (i.variant?.price || 0) * (selectedCart.find(c => c.id === i.id)?.quantity || i.quantity || 0), 0), 0);

  const totalAvailableItems = safeCartItems.filter(i => i.variant?.stock > 0 && !i.variant?.is_delete).length;
  const selectedCount = selectedCart.filter(i => i.variant?.stock > 0 && !i.variant?.is_delete).length;

  const handleCheckout = () => {
    if (!selectedCount) { toast.error("Pilih minimal satu produk"); return; }
    if (selectedCart.some(i => i.variant?.stock <= 0 || i.variant?.is_delete)) { toast.error("Hapus produk tidak tersedia dulu"); return; }
    if (selectedSubtotal < 10000) { toast.error("Minimum belanja Rp 10.000"); return; }
    setShowCheckout(true);
  };

  if (showCheckout) return <Pembayaran cartItems={selectedCart} onBack={() => setShowCheckout(false)} onSuccess={() => { setShowCheckout(false); navigate("/user/orders"); }} />;

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50">
      <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">Memuat keranjang…</p>
    </div>
  );

  if (cartError) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-gray-50 text-center">
      <AlertCircle size={48} className="text-red-400" />
      <h2 className="font-bold text-gray-800 text-lg">Gagal Memuat Keranjang</h2>
      <p className="text-gray-500 text-sm">{cartError}</p>
      <button onClick={() => window.location.reload()} className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1d4ed8] transition">Coba Lagi</button>
    </div>
  );

  if (safeCartItems.length === 0) return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center">
          <ShoppingBag size={48} className="text-[#2563EB]" />
        </div>
        <h2 className="font-bold text-gray-800 text-xl">Keranjang masih kosong</h2>
        <p className="text-gray-500 text-sm max-w-xs">Belum ada produk yang ditambahkan. Yuk mulai belanja!</p>
        <button onClick={() => navigate("/user/belanja")} className="mt-2 bg-[#2563EB] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-[#1d4ed8] active:scale-[0.98] transition">
          Mulai Belanja
        </button>
      </div>
    </>
  );

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 md:mt-14">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-gray-900 text-lg">Keranjang</h1>
            <span className="bg-[#2563EB] text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalAvailableItems}</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-3 py-4 space-y-3 pb-40">
          {Object.entries(groupedItems).map(([sellerId, seller]) => {
            const availItems = seller.items.filter(i => i.variant?.stock > 0 && !i.variant?.is_delete);
            const allSelected = availItems.length > 0 && availItems.every(i => selectedCart.some(c => c.id === i.id));
            const hasUnavailable = seller.items.some(i => i.variant?.stock <= 0 || i.variant?.is_delete);
            const isExpanded = expandedSellers[sellerId] ?? true;

            return (
              <div key={sellerId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* seller header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={() => {
                      if (hasUnavailable) { toast.error("Ada produk yang tidak tersedia"); return; }
                      toggleSellerSelection(sellerId);
                    }}
                    disabled={hasUnavailable || availItems.length === 0}
                  />
                  <Store size={15} className="text-gray-400" />
                  <span className="font-semibold text-gray-700 text-sm flex-1">{seller.sellerName}</span>
                  {hasUnavailable && <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Ada stok habis</span>}
                  <button
                    onClick={() => setExpandedSellers(prev => ({ ...prev, [sellerId]: !prev[sellerId] }))}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* items */}
                {isExpanded && (
                  <div className="px-4 divide-y divide-gray-50">
                    {seller.items.map(item => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onRemove={() => removeCartItem(item.id)}
                        onIncrement={() => incrementCartItemQuantity(item.id)}
                        onDecrement={() => decrementCartItemQuantity(item.id)}
                        isSelected={selectedCart.some(c => c.id === item.id)}
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
        </div>

        {/* sticky checkout bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="max-w-2xl mx-auto px-4 py-3">
            {/* mini summary */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedCount > 0 && selectedCount === totalAvailableItems}
                  onCheckedChange={() => {
                    if (selectedCount === totalAvailableItems) clearSelectedCart();
                    else Object.keys(groupedItems).forEach(sid => {
                      if (!groupedItems[sid].items.some(i => i.variant?.stock <= 0 || i.variant?.is_delete))
                        toggleSellerSelection(sid);
                    });
                  }}
                />
                <span className="text-xs text-gray-500">Pilih semua ({totalAvailableItems})</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{selectedCount} produk dipilih</p>
                <p className="font-bold text-[#2563EB] text-base leading-tight">{formatRupiah(selectedSubtotal)}</p>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={selectedCount === 0}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition active:scale-[0.98] ${selectedCount === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#2563EB] hover:bg-[#1d4ed8]"}`}
            >
              <ShoppingBag size={16} />
              Checkout {selectedCount > 0 ? `(${selectedCount} produk)` : ""}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Keranjang;