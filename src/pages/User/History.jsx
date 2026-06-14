import React, { useEffect, useState, useRef } from "react"
import { Clock, Info, X, Image as ImageIcon, CreditCard, Wallet, ChevronDown, ChevronUp, ShoppingBag, CheckCircle, AlertCircle, XCircle, Package } from "lucide-react"
import useOrderStore from "../../stores/useOrderStore"
import usePaymentStore from "../../stores/usePaymentStore"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const statusConfig = {
  pending:   { label: "Menunggu",    color: "amber" },
  process:   { label: "Dikonfirmasi", color: "blue"  },
  completed: { label: "Selesai",     color: "green" },
  cancelled: { label: "Dibatalkan",  color: "red"   },
}

const paymentStatusConfig = {
  pending:   { label: "Belum Dibayar", color: "amber" },
  completed: { label: "Lunas",         color: "green" },
  failed:    { label: "Gagal",         color: "red"   },
  cancelled: { label: "Dibatalkan",    color: "red"   },
}

const colorClass = {
  amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400" },
  blue:  { bg: "bg-blue-50",  text: "text-blue-700",  border: "border-blue-200",  dot: "bg-blue-400"  },
  green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-400" },
  red:   { bg: "bg-red-50",   text: "text-red-700",   border: "border-red-200",   dot: "bg-red-400"   },
}

function StatusBadge({ config, value }) {
  const cfg = config[value]
  if (!cfg) return <span className="text-xs text-gray-400">—</span>
  const c = colorClass[cfg.color]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text} border ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {cfg.label}
    </span>
  )
}

const formatRupiah = (n) =>
  "Rp " + (n || 0).toLocaleString("id-ID")

const tabs = [
  { id: "all",       label: "Semua"        },
  { id: "pending",   label: "Menunggu"     },
  { id: "process",   label: "Dikonfirmasi" },
  { id: "completed", label: "Selesai"      },
  { id: "cancelled", label: "Dibatalkan"   },
]

export default function History() {
  const [activeTab, setActiveTab]                   = useState("all")
  const [expandedId, setExpandedId]                 = useState(null)
  const [selected, setSelected]                     = useState(null)
  const [showPaymentModal, setShowPaymentModal]     = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("transfer")

  const { orders, fetchOrder }                              = useOrderStore()
  const { createPayment, fetchPaymentByOrderId, isLoading: paymentLoading } = usePaymentStore()
  const navigate   = useNavigate()
  const modalRef   = useRef(null)
  const tabScrollRef = useRef(null)

  useEffect(() => { fetchOrder() }, [fetchOrder])

  useEffect(() => {
    if (selected?.id) fetchPaymentByOrderId(selected.id)
  }, [selected, fetchPaymentByOrderId])

  const filtered = (orders || []).filter(o =>
    activeTab === "all" ? true : o.status === activeTab
  )

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id)

  const openDetail = (order) => {
    setSelected(order)
    setTimeout(() => modalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80)
  }

  const handlePayment = async () => {
    if (!selected?.order_id) { toast.error("Data order tidak valid"); return }
    try {
      const result = await createPayment(selected.order_id, { payment_method: selectedPaymentMethod })
      if (result && selectedPaymentMethod === "COD") {
        setShowPaymentModal(false)
        setSelected(null)
        await fetchOrder()
        toast.success("Pembayaran COD berhasil diproses!")
      } else if (result && selectedPaymentMethod === "transfer") {
        toast.success("Mengarahkan ke halaman pembayaran...")
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins']">

      {/* ─── Header ────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 pt-5 pb-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 bg-blue-50 rounded-xl">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Riwayat Pembelian</h1>
          </div>
          <p className="text-sm text-gray-500 ml-11">Pantau status dan riwayat transaksi kamu</p>
        </div>
      </div>

      {/* ─── Tabs (sticky, scroll horizontal) ─────────────── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto overflow-x-auto scrollbar-none" ref={tabScrollRef}>
          <div className="flex min-w-max px-4 sm:px-6">
            {tabs.map(tab => {
              const count = tab.id === "all"
                ? (orders || []).length
                : (orders || []).filter(o => o.status === tab.id).length
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-3.5 text-sm font-medium whitespace-nowrap transition-colors
                    ${activeTab === tab.id
                      ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-t"
                      : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium
                      ${activeTab === tab.id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── Content ───────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6">

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-medium text-gray-700 mb-1">Belum ada transaksi</p>
            <p className="text-sm text-gray-400">
              {activeTab === "all"
                ? "Transaksimu akan muncul di sini"
                : `Tidak ada transaksi "${tabs.find(t => t.id === activeTab)?.label}"`
              }
            </p>
          </div>
        )}

        {/* ── Desktop Table ─────────────────────────────────── */}
        {filtered.length > 0 && (
          <>
            <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tanggal</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama WBP</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pembayaran</th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-4 text-gray-600">
                        {new Date(order.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-800">
                        {order.order_data?.[0]?.wbp_name || "—"}
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {formatRupiah(order.total)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge config={statusConfig} value={order.status} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge config={paymentStatusConfig} value={order.payment_status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => navigate(`/user/payment/${order.order_id}`)}
                          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Info size={13} />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ───────────────────────────────── */}
            <div className="sm:hidden space-y-2.5">
              {filtered.map((order) => {
                const isOpen = expandedId === order.id
                const orderDate = new Date(order.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit", month: "short", year: "numeric"
                })
                const wbpName = order.order_data?.[0]?.wbp_name || "—"

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden
                      ${isOpen ? "border-blue-200 shadow-sm" : "border-gray-100"}`}
                  >
                    {/* Card header – always visible */}
                    <button
                      className="w-full text-left p-4"
                      onClick={() => toggleExpand(order.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Left */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{wbpName}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{orderDate}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            <StatusBadge config={statusConfig} value={order.status} />
                            <StatusBadge config={paymentStatusConfig} value={order.payment_status} />
                          </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <p className="font-bold text-gray-900 text-sm">{formatRupiah(order.total)}</p>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors
                            ${isOpen ? "bg-blue-100" : "bg-gray-100"}`}>
                            {isOpen
                              ? <ChevronUp size={14} className="text-blue-600" />
                              : <ChevronDown size={14} className="text-gray-500" />
                            }
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isOpen && (
                      <div className="border-t border-gray-50 px-4 pb-4 pt-3">

                        {/* Order meta */}
                        <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">ID Pesanan</span>
                            <span className="font-medium text-gray-800 font-mono text-xs">#{order.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tanggal</span>
                            <span className="text-gray-800">{orderDate}</span>
                          </div>
                        </div>

                        {/* Items */}
                        {order.items?.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Daftar Barang</p>
                            <div className="space-y-1.5">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                                  <span className="font-medium text-gray-800">{formatRupiah(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-sm font-semibold">
                              <span className="text-gray-700">Total</span>
                              <span className="text-blue-700">{formatRupiah(order.total)}</span>
                            </div>
                          </div>
                        )}

                        {/* Receipt photo */}
                        {order.purchase_receipt_photo && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                              <ImageIcon size={11} /> Bukti Pengambilan
                            </p>
                            <img
                              src={order.purchase_receipt_photo}
                              alt="Bukti Pengambilan"
                              className="w-full rounded-xl border border-gray-100 object-cover max-h-48"
                            />
                          </div>
                        )}

                        {/* CTA */}
                        <button
                          onClick={() => navigate(`/user/payment/${order.order_id}`)}
                          className="w-full mt-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <Info size={15} />
                          Lihat Detail Lengkap
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* ─── Modal Detail ──────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div
            ref={modalRef}
            className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl max-h-[92vh] overflow-y-auto relative"
          >
            {/* Drag handle (mobile) */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="px-5 pb-6 pt-2 sm:pt-5">
              {/* Modal header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Info size={17} className="text-blue-600" /> Detail Transaksi
                </h2>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Status row */}
              <div className="flex gap-2 mb-4">
                <StatusBadge config={statusConfig} value={selected.status} />
                <StatusBadge config={paymentStatusConfig} value={selected.payment_status} />
              </div>

              {/* Meta info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm mb-4">
                {[
                  ["ID Pesanan", `#${selected.id}`],
                  ["Nama WBP",   selected.order_data?.[0]?.wbp_name || "—"],
                  ["Tanggal",    new Date(selected.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-800 text-right">{val}</span>
                  </div>
                ))}
              </div>

              {/* Items */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Daftar Barang</p>
                {selected.items?.length > 0 ? (
                  <div className="space-y-2">
                    {selected.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                        <span className="font-medium text-gray-900">{formatRupiah(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Tidak ada data barang.</p>
                )}
              </div>

              {/* Receipt photo */}
              {selected.purchase_receipt_photo && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <ImageIcon size={11} /> Bukti Pengambilan
                  </p>
                  <img
                    src={selected.purchase_receipt_photo}
                    alt="Bukti Pengambilan"
                    className="w-full rounded-xl border border-gray-100"
                  />
                </div>
              )}

              {selected.buktiFoto && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <ImageIcon size={11} /> Bukti Penyerahan Barang
                  </p>
                  <img
                    src={selected.buktiFoto}
                    alt="Bukti Penyerahan"
                    className="w-full rounded-xl border border-gray-100 object-cover max-h-60"
                  />
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center py-3.5 px-4 bg-blue-50 rounded-xl mb-4">
                <span className="font-medium text-gray-700">Total Pembayaran</span>
                <span className="font-bold text-blue-700 text-base">{formatRupiah(selected.total)}</span>
              </div>

              {/* Pay button */}
              {selected.payment_status === "pending" && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors mb-3"
                >
                  <CreditCard size={17} />
                  Lanjutkan Pembayaran
                </button>
              )}

              <button
                onClick={() => setSelected(null)}
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Pembayaran ──────────────────────────────── */}
      {showPaymentModal && selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[80vh] overflow-y-auto">

            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="px-5 pb-6 pt-2 sm:pt-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Wallet size={17} className="text-green-600" /> Pilih Metode Bayar
                </h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Order summary */}
              <div className="bg-gray-50 rounded-xl p-3.5 mb-5 flex justify-between text-sm">
                <span className="text-gray-500">#{selected.id}</span>
                <span className="font-bold text-gray-900">{formatRupiah(selected.total)}</span>
              </div>

              {/* Payment options */}
              <div className="space-y-2.5 mb-5">
                <label className={`flex items-center gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${selectedPaymentMethod === "transfer" ? "border-blue-500 bg-blue-50/50" : "border-gray-100 hover:border-gray-200"}`}>
                  <input
                    type="radio"
                    name="pay"
                    value="transfer"
                    checked={selectedPaymentMethod === "transfer"}
                    onChange={e => setSelectedPaymentMethod(e.target.value)}
                    className="accent-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-sm text-gray-900">Transfer Bank</span>
                    </div>
                    <p className="text-xs text-gray-500">Virtual Account, e-wallet, atau kartu debit</p>
                  </div>
                </label>

                {/* COD option (commented-out in original, kept hidden) */}
              </div>

              {selectedPaymentMethod === "transfer" && (
                <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3.5 mb-5">
                  <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Kamu akan diarahkan ke halaman Midtrans untuk menyelesaikan pembayaran.
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  disabled={paymentLoading}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {paymentLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CreditCard size={15} />
                      Bayar Sekarang
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}