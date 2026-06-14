import React, { useEffect, useState, useRef } from "react"
import {
  Clock, Info, X, Image as ImageIcon, CreditCard, Wallet,
  ChevronDown, ChevronUp, ShoppingBag, CheckCircle2,
  XCircle, AlertCircle, Loader2, ArrowRight, Package
} from "lucide-react"
import useOrderStore from "../../stores/useOrderStore"
import usePaymentStore from "../../stores/usePaymentStore"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

/* ─── Helpers ────────────────────────────────────────────────── */
const formatRupiah = (n) =>
  "Rp " + (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric"
  })

/* ─── Status Config ──────────────────────────────────────────── */
const ORDER_STATUS = {
  pending:   { label: "Menunggu",     color: "amber",  Icon: AlertCircle  },
  process:   { label: "Dikonfirmasi", color: "blue",   Icon: Loader2      },
  completed: { label: "Selesai",      color: "emerald",Icon: CheckCircle2 },
  cancelled: { label: "Dibatalkan",   color: "red",    Icon: XCircle      },
}

const PAYMENT_STATUS = {
  pending:   { label: "Belum Dibayar", color: "amber"  },
  completed: { label: "Lunas",         color: "emerald"},
  failed:    { label: "Gagal",         color: "red"    },
  cancelled: { label: "Dibatalkan",    color: "red"    },
}

const colorMap = {
  amber:   { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-400"   },
  blue:    { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-400"    },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
  red:     { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     dot: "bg-red-400"     },
  gray:    { bg: "bg-gray-50",    text: "text-gray-600",    border: "border-gray-200",    dot: "bg-gray-400"    },
}

function StatusBadge({ type, value, size = "sm" }) {
  const map = type === "order" ? ORDER_STATUS : PAYMENT_STATUS
  const cfg = map[value] || { label: value, color: "gray" }
  const c   = colorMap[cfg.color] || colorMap.gray
  const sz  = size === "xs" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1"
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sz} ${c.bg} ${c.text} border ${c.border}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {cfg.label}
    </span>
  )
}

/* ─── Tabs ───────────────────────────────────────────────────── */
const TABS = [
  { id: "all",       label: "Semua"        },
  { id: "pending",   label: "Menunggu"     },
  { id: "process",   label: "Dikonfirmasi" },
  { id: "completed", label: "Selesai"      },
  { id: "cancelled", label: "Dibatalkan"   },
]

/* ─── Empty State ─────────────────────────────────────────────── */
function EmptyState({ activeTab }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
        <ShoppingBag className="w-11 h-11 text-blue-300" />
      </div>
      <p className="font-semibold text-gray-700 text-lg mb-1">Belum ada transaksi</p>
      <p className="text-sm text-gray-400">
        {activeTab === "all"
          ? "Transaksi kamu akan muncul di sini."
          : `Tidak ada transaksi berstatus "${TABS.find(t => t.id === activeTab)?.label}".`}
      </p>
    </div>
  )
}

/* ─── Order Card (Mobile) ─────────────────────────────────────── */
function OrderCard({ order, expanded, onToggle, onDetail }) {
  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden
      ${expanded ? "border-blue-200 shadow-md" : "border-gray-100 shadow-sm hover:border-blue-100 hover:shadow"}`}>

      {/* Card Header */}
      <button
        className="w-full text-left px-4 py-3 flex items-center gap-3"
        onClick={onToggle}
      >
        {/* Icon */}
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Package className="w-5 h-5 text-blue-500" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-gray-800 text-sm truncate">
              {order.order_data?.[0]?.wbp_name || "—"}
            </span>
            <span className="font-bold text-emerald-600 text-sm flex-shrink-0">
              {formatRupiah(order.total)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-gray-400">{formatDate(order.created_at)}</span>
            <StatusBadge type="order"   value={order.status}         size="xs" />
            <StatusBadge type="payment" value={order.payment_status} size="xs" />
          </div>
        </div>

        {/* Chevron */}
        <div className="flex-shrink-0 text-gray-300">
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </button>

      {/* Expanded Body */}
      {expanded && (
        <div className="border-t border-gray-50 px-5 pb-5 pt-4 space-y-4">
          {/* Items */}
          {order.items?.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate mr-2">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                  <span className="flex-shrink-0 font-medium">{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Receipt Photo */}
          {order.purchase_receipt_photo && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                <ImageIcon size={14} /> Bukti Pengambilan
              </p>
              <img
                src={order.purchase_receipt_photo}
                alt="Bukti Pengambilan"
                className="w-full max-w-[220px] rounded-xl border object-cover"
              />
            </div>
          )}

          {/* CTA — lebih besar dan mudah di-tap */}
          <button
            onClick={onDetail}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-semibold
              flex items-center justify-center gap-2 transition-colors"
          >
            Detail Lengkap <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── Detail Modal ───────────────────────────────────────────── */
function DetailModal({ selected, paymentById, onClose, onPayment }) {
  if (!selected) return null

  const needsPayment = selected.payment_status === "pending"

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-xl overflow-hidden animate-slideUp max-h-[92vh] flex flex-col">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Detail Transaksi</h3>
            <p className="text-sm text-gray-400 mt-0.5">#{selected.id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-5 space-y-5">

            {/* Info Row */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Nama WBP", value: selected.order_data?.[0]?.wbp_name || "—" },
                { label: "Tanggal",  value: formatDate(selected.created_at) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3.5">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
                </div>
              ))}
            </div>

            {/* Status Row */}
            <div className="flex gap-2 flex-wrap">
              <div className="flex-1 bg-gray-50 rounded-xl p-3.5 min-w-[140px]">
                <p className="text-xs text-gray-400 mb-2">Status Order</p>
                <StatusBadge type="order" value={selected.status} />
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-3.5 min-w-[140px]">
                <p className="text-xs text-gray-400 mb-2">Status Pembayaran</p>
                <StatusBadge type="payment" value={selected.payment_status} />
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Daftar Barang</p>
              <div className="bg-gray-50 rounded-xl overflow-hidden divide-y divide-gray-100">
                {selected.items?.length > 0 ? (
                  selected.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-3.5 text-sm">
                      <div>
                        <span className="font-medium text-gray-800">{item.name}</span>
                        <span className="text-gray-400 ml-1 text-xs">×{item.quantity}</span>
                      </div>
                      <span className="text-gray-700 font-medium">{formatRupiah(item.price * item.quantity)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 px-4 py-3">Tidak ada data barang.</p>
                )}
              </div>
            </div>

            {/* Photos */}
            {selected.purchase_receipt_photo && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-blue-500" /> Bukti Pengambilan
                </p>
                <img
                  src={selected.purchase_receipt_photo}
                  alt="Bukti Pengambilan"
                  className="w-full max-w-xs rounded-xl border object-cover"
                />
              </div>
            )}

            {selected.buktiFoto && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-blue-500" /> Bukti Penyerahan
                </p>
                <img
                  src={selected.buktiFoto}
                  alt="Bukti Penyerahan"
                  className="w-full rounded-xl border object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-5 border-t border-gray-100 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">Total Pembayaran</span>
            <span className="text-xl font-bold text-emerald-600">{formatRupiah(selected.total)}</span>
          </div>
          {needsPayment ? (
            <button
              onClick={onPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold
                flex items-center justify-center gap-2 transition-colors text-base"
            >
              <CreditCard size={18} /> Lanjutkan Pembayaran
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold
                transition-colors text-base"
            >
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Payment Modal ──────────────────────────────────────────── */
function PaymentModal({ selected, onClose, onConfirm, isLoading, method, setMethod }) {
  if (!selected) return null
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-[60] p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl overflow-hidden animate-slideUp">
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg">Pilih Pembayaran</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Order Summary */}
          <div className="bg-blue-50 rounded-xl px-4 py-3.5 flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600 font-medium">Order #{selected.id}</p>
              <p className="text-xs text-blue-400">{selected.order_data?.[0]?.wbp_name || "—"}</p>
            </div>
            <span className="font-bold text-blue-700 text-lg">{formatRupiah(selected.total)}</span>
          </div>

          {/* Method Options */}
          <div className="space-y-2">
            <label
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${method === "transfer" ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-gray-200"}`}
            >
              <input
                type="radio"
                name="method"
                value="transfer"
                checked={method === "transfer"}
                onChange={() => setMethod("transfer")}
                className="sr-only"
              />
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                ${method === "transfer" ? "bg-blue-100" : "bg-gray-100"}`}>
                <CreditCard className={`w-5 h-5 ${method === "transfer" ? "text-blue-600" : "text-gray-400"}`} />
              </div>
              <div className="flex-1">
                <p className={`font-semibold text-base ${method === "transfer" ? "text-blue-800" : "text-gray-700"}`}>
                  Transfer Bank
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Virtual Account, e-wallet & transfer
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors
                ${method === "transfer" ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}>
                {method === "transfer" && (
                  <div className="w-full h-full rounded-full bg-white scale-[0.4] transform" />
                )}
              </div>
            </label>
          </div>

          {method === "transfer" && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              Anda akan diarahkan ke halaman pembayaran Midtrans untuk menyelesaikan transaksi.
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-4 rounded-xl font-semibold text-base transition-colors"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-4 rounded-xl
                font-semibold text-base flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <><Loader2 size={17} className="animate-spin" /> Memproses…</>
              ) : (
                <><CreditCard size={17} /> Bayar Sekarang</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function History() {
  const [selected,              setSelected]              = useState(null)
  const [activeTab,             setActiveTab]             = useState("all")
  const [showPaymentModal,      setShowPaymentModal]      = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("transfer")
  const [expandedOrder,         setExpandedOrder]         = useState(null)

  const { orders, fetchOrder }                                                              = useOrderStore()
  const { createPayment, fetchPaymentByOrderId, paymentById, isLoading: paymentLoading }   = usePaymentStore()
  const navigate = useNavigate()

  useEffect(() => { fetchOrder() }, [fetchOrder])
  useEffect(() => {
    if (selected?.id) fetchPaymentByOrderId(selected.id)
  }, [selected, fetchPaymentByOrderId])

  const filteredOrders = orders?.filter(o => activeTab === "all" || o.status === activeTab) || []

  const handlePayment = async () => {
    if (!selected?.order_id) { toast.error("Data order tidak valid"); return }
    try {
      const result = await createPayment(selected.order_id, { payment_method: selectedPaymentMethod })
      if (result && selectedPaymentMethod === "COD") {
        setShowPaymentModal(false)
        await fetchOrder()
        setSelected(null)
        toast.success("Pembayaran COD berhasil diproses!")
      } else if (result) {
        toast.success("Mengarahkan ke halaman pembayaran…")
      }
    } catch (e) { console.error(e) }
  }

  const tabCounts = TABS.reduce((acc, t) => {
    acc[t.id] = t.id === "all" ? orders?.length || 0 : orders?.filter(o => o.status === t.id).length || 0
    return acc
  }, {})

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.25s ease-out both; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/*
        ── PERBAIKAN UTAMA ──────────────────────────────────────────────
        1. `pb-24` pada wrapper utama  →  konten tidak tertutup bottom navbar
           (sesuaikan nilainya dengan tinggi navbar kamu, biasanya 64–80px)
        2. Elemen-elemen diperbesar di seluruh komponen (font, padding, icon)
        ────────────────────────────────────────────────────────────────
      */}
      <div className="min-h-screen bg-gray-50 font-['Inter',_'Poppins',_sans-serif]">

        {/* ── Page Header — compact ── */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">Riwayat Belanja</h1>
              <p className="text-xs text-gray-400 leading-tight">
                {orders?.length ? `${orders.length} transaksi total` : "Belum ada transaksi"}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-0 pb-0 min-w-max">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap
                    transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {tab.label}
                  {tabCounts[tab.id] > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none
                      ${activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                      {tabCounts[tab.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Konten utama ─────────────────────────────────────────────
            pb-24 = ruang 96px di bawah agar tidak tertutup bottom navbar.
            Kalau navbar-mu lebih tinggi, naikkan ke pb-28 atau pb-32.
        ──────────────────────────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-5 pb-24">

          {filteredOrders.length === 0 ? (
            <EmptyState activeTab={activeTab} />
          ) : (
            <>
              {/* ── Desktop Table ── */}
              <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Tanggal", "Nama WBP", "Total", "Status Order", "Pembayaran", ""].map(h => (
                        <th key={h} className={`py-4 px-5 text-sm font-semibold text-gray-500 ${h === "" ? "text-center" : "text-left"}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="py-4 px-5 text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-sm font-medium text-gray-800">
                            {order.order_data?.[0]?.wbp_name || "—"}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-sm font-bold text-emerald-600">
                            {formatRupiah(order.total)}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <StatusBadge type="order" value={order.status} />
                        </td>
                        <td className="py-4 px-5">
                          <StatusBadge type="payment" value={order.payment_status} />
                        </td>
                        <td className="py-4 px-5 text-center">
                          <button
                            onClick={() => navigate(`/user/payment/${order.order_id}`)}
                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700
                              text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                          >
                            Detail <ArrowRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile Cards ── */}
              <div className="md:hidden space-y-3">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    expanded={expandedOrder === order.id}
                    onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    onDetail={() => navigate(`/user/payment/${order.order_id}`)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <DetailModal
          selected={selected}
          paymentById={paymentById}
          onClose={() => setSelected(null)}
          onPayment={() => setShowPaymentModal(true)}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && selected && (
        <PaymentModal
          selected={selected}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePayment}
          isLoading={paymentLoading}
          method={selectedPaymentMethod}
          setMethod={setSelectedPaymentMethod}
        />
      )}
    </>
  )
}