import React, { useEffect, useState, useRef } from "react"
import { Clock, Info, X, Image as ImageIcon, CreditCard, Wallet, ChevronDown, ChevronUp } from "lucide-react"
import useOrderStore from "../../stores/useOrderStore"
import usePaymentStore from "../../stores/usePaymentStore"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function History() {
  const [selected, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("transfer")
  const [expandedOrder, setExpandedOrder] = useState(null)
  
  const { orders, fetchOrder } = useOrderStore()

  const navigate = useNavigate()
  const { 
    createPayment, 
    fetchPaymentByOrderId, 
    paymentById,
    isLoading: paymentLoading 
  } = usePaymentStore()

  // Ref untuk scroll ke modal detail
  const detailModalRef = useRef(null)

  const statusMap = {
    'pending': 'Menunggu',
    'process': 'Dikonfirmasi', 
    'completed': 'Selesai',
    'cancelled': 'Dibatalkan'
  }

  const paymentStatusMap = {
    'pending': 'Menunggu Pembayaran',
    'completed': 'Lunas',
    'failed': 'Gagal',
    'cancelled': 'Dibatalkan'
  }

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  useEffect(() => {
    if (selected && selected.id) {
      fetchPaymentByOrderId(selected.id)
    }
  }, [selected, fetchPaymentByOrderId])

  const filteredOrders = orders?.filter(order => {
    if (activeTab === "all") return true
    return order.status === activeTab
  }) || []

  const formatRupiah = (n) =>
    "Rp " + (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  // Handle pembayaran dengan validasi
  const handlePayment = async () => {
    if (!selected || !selected.order_id) {
      toast.error("Data order tidak valid")
      return
    }

    try {
      console.log("Processing payment for order:", selected.order_id)
      const result = await createPayment(selected.order_id, {
        payment_method: selectedPaymentMethod
      })

      if (result && selectedPaymentMethod === 'transfer') {
        toast.success("Mengarahkan ke halaman pembayaran...")
        // Untuk transfer, akan otomatis redirect ke Midtrans
      } else if (result && selectedPaymentMethod === 'COD') {
        // Untuk COD, tutup modal dan refresh data
        setShowPaymentModal(false)
        await fetchOrder() // Refresh data order
        setSelected(null) // Tutup modal detail
        toast.success("Pembayaran COD berhasil diproses!")
      }
    } catch (error) {
      console.error('Payment error:', error)
      // Error sudah dihandle di store
    }
  }

  // Cek apakah order perlu tombol pembayaran
  const needsPayment = (order) => {
    return order.payment_status === 'pending'
  }

  const handleViewDetail = (order) => {
    setSelected(order)
    // Scroll ke modal setelah render
    setTimeout(() => {
      if (detailModalRef.current) {
        detailModalRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        })
      }
    }, 100)
  }

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const tabs = [
    { id: "all", label: "Semua" },
    { id: "pending", label: "Menunggu" },
    { id: "process", label: "Dikonfirmasi" },
    { id: "completed", label: "Selesai" },
    { id: "cancelled", label: "Dibatalkan" }
  ]

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-['Poppins']">
      {/* Header */}
      <div className="flex items-center mb-4 sm:mb-6">
        <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 mr-2" />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Riwayat Pembelanjaan
        </h2>
      </div>

      {/* Tabs Filter - Horizontal Scroll di Mobile */}
      <div className="bg-white rounded-lg shadow mb-4 sm:mb-6 overflow-x-auto">
        <div className="flex min-w-max border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-center transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jika belum ada transaksi */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7466/7466149.png"
            alt="Empty"
            className="w-20 sm:w-24 mx-auto mb-3 opacity-80"
          />
          <p className="text-gray-600 font-medium text-sm sm:text-base">
            {activeTab === "all" 
              ? "Belum ada riwayat transaksi 💸" 
              : `Tidak ada transaksi dengan status "${tabs.find(t => t.id === activeTab)?.label}"`
            }
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-blue-100 text-left">
                  <th className="py-3 px-4 border-b text-gray-700">Tanggal</th>
                  <th className="py-3 px-4 border-b text-gray-700">Nama WBP</th>
                  <th className="py-3 px-4 border-b text-gray-700">Total Harga</th>
                  <th className="py-3 px-4 border-b text-gray-700">Status</th>
                  <th className="py-3 px-4 border-b text-gray-700">Status Pembayaran</th>
                  <th className="py-3 px-4 border-b text-center text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-blue-50 transition duration-150 text-gray-800"
                  >
                    <td className="py-2 px-4 border-b">
                      {new Date(order.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-2 px-4 border-b">{order.order_data?.[0]?.wbp_name || "-"}</td>
                    <td className="py-2 px-4 border-b">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "process"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {statusMap[order.status] || order.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.payment_status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.payment_status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.payment_status === "failed" || order.payment_status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {paymentStatusMap[order.payment_status] || order.payment_status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        // onClick={() => handleViewDetail(order)}
                        onClick={()=> navigate(`/user/payment/${order.order_id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 mx-auto transition"
                      >
                        <Info size={15} /> Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                {/* Header Card */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleOrderExpand(order.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                      </p>
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {order.order_data?.[0]?.wbp_name || "-"}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 text-sm">
                        {formatRupiah(order.total)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {expandedOrder === order.id ? (
                          <ChevronUp size={16} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "process"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {statusMap[order.status] || order.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.payment_status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.payment_status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.payment_status === "failed" || order.payment_status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {paymentStatusMap[order.payment_status] || order.payment_status}
                    </span>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedOrder === order.id && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                    {/* Informasi Order */}
                    <div className="space-y-2 text-sm text-gray-700 mb-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Order ID:</span>
                        <span>#{order.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Tanggal:</span>
                        <span>{new Date(order.created_at).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>

                    {/* Daftar Barang */}
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-800 text-sm mb-2">
                        Daftar Barang
                      </h4>
                      {order.items && order.items.length > 0 ? (
                        <div className="space-y-1">
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-gray-700 text-xs"
                            >
                              <span>
                                {item.name} x{item.quantity}
                              </span>
                              <span>{formatRupiah(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-xs">Tidak ada data barang.</p>
                      )}
                    </div>

                    {/* Bukti Pengambilan */}
                    {order.purchase_receipt_photo && (
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-1">
                          <ImageIcon size={14} className="text-blue-600" />
                          Bukti Pengambilan
                        </h4>
                        <img
                          src={order.purchase_receipt_photo}
                          alt="Bukti Pengambilan"
                          className="w-full max-w-xs rounded-lg border shadow-sm"
                        />
                      </div>
                    )}

                    {/* Tombol Aksi */}
                    <div className="flex gap-2 pt-2">
                      <button
                        // onClick={() => handleViewDetail(order)}
                        onClick={()=> navigate(`/user/payment/${order.order_id}`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-xs font-medium flex items-center justify-center gap-1 transition"
                      >
                        <Info size={12} />
                        Detail Lengkap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal Detail */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            ref={detailModalRef}
            className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-fadeIn"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10"
            >
              <X size={22} />
            </button>

            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Info className="text-blue-600" /> Detail Transaksi
              </h3>

              <div className="space-y-3 text-gray-700 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Order ID:</span>
                  <span>#{selected.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Nama WBP:</span>
                  <span>{selected.order_data?.[0]?.wbp_name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tanggal:</span>
                  <span>{new Date(selected.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status Order:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selected.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : selected.status === "process"
                        ? "bg-blue-100 text-blue-700"
                        : selected.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {statusMap[selected.status] || selected.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status Pembayaran:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selected.payment_status === "completed"
                        ? "bg-green-100 text-green-700"
                        : selected.payment_status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : selected.payment_status === "failed" || selected.payment_status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {paymentStatusMap[selected.payment_status] || selected.payment_status}
                  </span>
                </div>
              </div>

              {/* Bukti Pengambilan */}
              {selected.purchase_receipt_photo && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">
                    Bukti Pengambilan:
                  </h4>
                  <div className="flex justify-start">
                    <img 
                      className="w-full max-w-xs rounded-lg border shadow-sm" 
                      src={selected.purchase_receipt_photo} 
                      alt="Bukti Pengambilan"
                    />
                  </div>
                </div>
              )}

              <div className="border-t mt-4 pt-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                  Daftar Barang
                </h4>
                {selected.items && selected.items.length > 0 ? (
                  <div className="space-y-2">
                    {selected.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-gray-700 text-sm"
                      >
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>{formatRupiah(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Tidak ada data barang.</p>
                )}
              </div>

              {/* 🖼️ Foto Bukti Penyerahan */}
              {selected.buktiFoto && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-1 text-sm sm:text-base">
                    <ImageIcon size={16} className="text-blue-600" />
                    Bukti Penyerahan Barang
                  </h4>
                  <img
                    src={selected.buktiFoto}
                    alt="Bukti Penyerahan"
                    className="w-full h-48 sm:h-64 object-cover rounded-lg border shadow-sm"
                  />
                </div>
              )}

              <div className="flex justify-between mt-6 font-semibold text-gray-800 text-sm sm:text-base">
                <span>Total Pembayaran</span>
                <span className="text-green-600">
                  {formatRupiah(selected.total)}
                </span>
              </div>

              {/* Tombol Bayar - Hanya tampil jika status pembayaran pending */}
              {needsPayment(selected) && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition text-sm sm:text-base"
                  >
                    <CreditCard size={18} />
                    Lanjutkan Pembayaran
                  </button>
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pembayaran */}
      {showPaymentModal && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-fadeIn">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={22} />
            </button>

            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Wallet className="text-green-600" /> Pilih Metode Pembayaran
              </h3>

              <div className="space-y-4">
                {/* Informasi Order */}
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-700">
                    <span className="font-medium">Order ID:</span> #{selected.id}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700">
                    <span className="font-medium">Total:</span> {formatRupiah(selected.total)}
                  </p>
                </div>

                {/* Pilihan Metode Pembayaran */}
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={selectedPaymentMethod === "transfer"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="text-green-600 focus:ring-green-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="font-medium text-sm sm:text-base">Transfer Bank</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Bayar via transfer bank, Virtual Account, atau e-wallet
                      </p>
                    </div>
                  </label>

                  {/* <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={selectedPaymentMethod === "COD"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="text-green-600 focus:ring-green-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                        <span className="font-medium text-sm sm:text-base">COD (Cash on Delivery)</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Bayar saat barang diterima
                      </p>
                    </div>
                  </label> */}
                </div>

                {/* Informasi Metode Terpilih */}
                {selectedPaymentMethod === "transfer" && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-xs sm:text-sm text-yellow-800">
                      Anda akan diarahkan ke halaman pembayaran Midtrans untuk menyelesaikan transaksi.
                    </p>
                  </div>
                )}

                {selectedPaymentMethod === "COD" && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs sm:text-sm text-green-800">
                      Pesanan akan diproses dan Anda dapat membayar ketika barang sudah diterima.
                    </p>
                  </div>
                )}

                {/* Tombol Aksi */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition text-sm sm:text-base"
                    disabled={paymentLoading}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50 text-sm sm:text-base"
                  >
                    {paymentLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} />
                        {selectedPaymentMethod === 'transfer' ? 'Bayar Sekarang' : 'Pilih COD'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}