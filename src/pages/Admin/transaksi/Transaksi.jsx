import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  Camera,
  Printer,
  XCircle,
  Trash2,
  RefreshCw,
  History,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import useOrderStore from "../../../stores/useOrderStore";
import toast from "react-hot-toast";
import ModalAmbilFoto from ".//ModalAmbilFoto";

export default function Transaksi() {
  const [transactions, setTransactions] = useState([]);
  const [activeTrx, setActiveTrx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [showModalFoto, setShowModalFoto] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModalHistory, setShowModalHistory] = useState(false);
  const [selectedOrderHistory, setSelectedOrderHistory] = useState([]);
  const { fetchOrder, updateOrderStatus } = useOrderStore();

  // Fetch transactions from backend
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      console.log("Loading transactions...");

      const orders = await fetchOrder();
      console.log("Orders from store:", orders);

      if (orders && Array.isArray(orders)) {
        // Transform backend data to match frontend format
        const transformedTransactions = orders.map((order) => {
          console.log("Processing order:", order);

          // Ambil data dari order_data jika ada, atau gunakan fallback
          const orderData =
            order.order_data && order.order_data.length > 0
              ? order.order_data[0]
              : {};

          return {
            id: order.order_id || order.id,
            nama: orderData.wbp_name || order.user?.nama || "-",
            blok: orderData.wbp_room || "-",
            nomorRegister: orderData.wbp_register_number || "-",
            namaPengirim: orderData.wbp_sender || "-",
            date: new Date(
              order.order_date || order.created_at
            ).toLocaleDateString("id-ID"),
            total: order.total || order.total_price,
            status: mapOrderStatus(order.status),
            items:
              order.items?.map((item) => ({
                name: item.product_name || item.name,
                qty: item.quantity,
                price: parseFloat(item.price) || 0,
              })) || [],
            buktiFoto: order.purchase_receipt_photo || null,
            // Simpan data order history dari API
            orderHistory: order.order_historie || [],
            orderCode: order.order_code,
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
          };
        });

        console.log("Transformed transactions:", transformedTransactions);
        setTransactions(transformedTransactions);
      } else {
        console.log("No orders found or invalid format");
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Gagal memuat data transaksi");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  console.log(
    "buktiFoto transactions:",
    transactions.filter((trx) => trx.buktiFoto)
  );

  // Toggle expand/collapse row untuk mobile
  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Fungsi untuk membuka modal foto
  const bukaModalFoto = (trx) => {
    setSelectedTransaction(trx);
    setShowModalFoto(true);
  };

  // Fungsi untuk menutup modal foto
  const tutupModalFoto = () => {
    setShowModalFoto(false);
    setSelectedTransaction(null);
  };

  // Fungsi untuk membuka modal history
  const bukaModalHistory = (trx) => {
    setSelectedOrderHistory(trx.orderHistory || []);
    setShowModalHistory(true);
  };

  // Fungsi untuk menutup modal history
  const tutupModalHistory = () => {
    setShowModalHistory(false);
    setSelectedOrderHistory([]);
  };

  // Map backend status to frontend status
  const mapOrderStatus = (backendStatus) => {
    const statusMap = {
      pending: "Menunggu Konfirmasi",
      process: "Dikonfirmasi",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    };
    return statusMap[backendStatus] || backendStatus;
  };

  // Map frontend status to backend status
  const mapToBackendStatus = (frontendStatus) => {
    const statusMap = {
      "Menunggu Konfirmasi": "pending",
      Dikonfirmasi: "process",
      Selesai: "completed",
      Dibatalkan: "cancelled",
    };
    return statusMap[frontendStatus] || frontendStatus;
  };

  const formatRupiah = (n) => {
    if (!n) return "Rp 0";
    return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Format tanggal untuk ditampilkan
  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Map status untuk tampilan history
  const mapHistoryStatus = (status) => {
    const statusMap = {
      pending: "Menunggu Konfirmasi",
      process: "Dikonfirmasi",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    };
    return statusMap[status] || status;
  };

  // Update order status in backend
  const handleKonfirmasi = async (id) => {
    try {
      console.log("Confirming order:", id);
      await updateOrderStatus(id, "confirmed");
      toast.success("Transaksi berhasil dikonfirmasi");
      loadTransactions(); // Reload data
    } catch (error) {
      console.error("Error confirming transaction:", error);
      toast.error("Gagal mengkonfirmasi transaksi");
    }
  };

  // 🧾 CETAK STRUK
  const handlePrint = (trx) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Pembelian - ${trx.nama}</title>
          <style>
            @media print {
              @page { size: 80mm auto; margin: 5mm; }
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 13px;
              margin: 0;
              padding: 10px;
              width: 80mm;
            }
            .header {
              text-align: center;
              border-bottom: 1px dashed #000;
              padding-bottom: 5px;
              margin-bottom: 5px;
            }
            .header h2 { margin: 0; font-size: 16px; }
            .info { line-height: 1.4; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 3px 0; text-align: left; }
            th { border-bottom: 1px dashed #000; }
            .total {
              border-top: 1px dashed #000;
              font-weight: bold;
              text-align: right;
              padding-top: 3px;
            }
            .footer {
              border-top: 1px dashed #000;
              margin-top: 10px;
              text-align: center;
              font-size: 12px;
              padding-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>KOPERASI TABEOM</h2>
            <div>Jl. Mawar No. 9 Kel. Pallantikan Kec. Bantaeng Kab. Bantaeng.</div>
            <div>Telp. (0411) 123456</div>
          </div>
          <div class="info">
            <b>Nama WBP:</b> ${trx.nama}<br/>
            <b>Kamar:</b> ${trx.blok}<br/>
            <b>No. Register:</b> ${trx.nomorRegister}<br/>
            <b>Pengirim:</b> ${trx.namaPengirim || "-"}<br/>
            <b>Tanggal:</b> ${trx.date}<br/>
          </div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Barang</th>
                <th>Qty</th>
                <th style="text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${trx.items
                ?.map(
                  (item, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${item.name}</td>
                  <td>${item.qty}</td>
                  <td style="text-align:right;">${formatRupiah(
                    item.price * item.qty
                  )}</td>
                </tr>`
                )
                .join("")}
              <tr>
                <td colspan="3" class="total">TOTAL</td>
                <td class="total">${formatRupiah(trx.total)}</td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            <p>Struk ini wajib diperlihatkan saat penerimaan barang.</p>
            <p>Terima kasih telah berbelanja di Koperasi TabeOM 🙏</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // 🎥 KAMERA - Tetap sama
  const bukaKamera = async (trx) => {
    setActiveTrx(trx);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      alert("Gagal mengakses kamera: " + err.message);
    }
  };

  const ambilFoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const fotoData = canvas.toDataURL("image/png");

    try {
      // Update status ke backend dengan mengirim foto
      await updateOrderStatus(activeTrx.id, "completed", fotoData);

      // Update local state
      const updated = transactions.map((trx) =>
        trx.id === activeTrx.id
          ? {
              ...trx,
              status: "Selesai",
              buktiFoto: fotoData,
            }
          : trx
      );

      if (video.srcObject) {
        video.srcObject.getTracks().forEach((t) => t.stop());
      }
      setActiveTrx(null);
      setTransactions(updated);
      toast.success("Foto bukti berhasil disimpan");
    } catch (error) {
      console.error("Error saving photo:", error);
      toast.error("Gagal menyimpan foto bukti");
    }
  };

  const batalKamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
    setActiveTrx(null);
  };

  const hapusFoto = async (id) => {
    if (!window.confirm("Hapus foto bukti dan ambil ulang?")) return;

    try {
      await updateOrderStatus(id, "confirmed");

      const updated = transactions.map((trx) =>
        trx.id === id
          ? { ...trx, status: "Dikonfirmasi", buktiFoto: null }
          : trx
      );
      setTransactions(updated);
      toast.success("Foto berhasil dihapus");
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Gagal menghapus foto");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 font-['Poppins']">
        <main className="flex-1 p-1 relative">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Memuat data transaksi...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-['Poppins']">
      <main className="flex-1 p-1 relative">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Daftar Transaksi Pengguna
        </h1>

        {/* === POPUP KAMERA === */}
        {activeTrx && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 relative w-[90%] max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                Ambil Foto Bukti Penerimaan Barang
              </h2>
              <video
                ref={videoRef}
                className="rounded-lg shadow-md border border-gray-300 w-full h-64 object-cover"
              />
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="hidden"
              />
              <div className="flex justify-center gap-4 mt-5">
                <button
                  onClick={ambilFoto}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-medium shadow"
                >
                  Ambil Foto
                </button>
                <button
                  onClick={batalKamera}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-full font-medium shadow flex items-center gap-1"
                >
                  <XCircle size={18} /> Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === MODAL ORDER HISTORY === */}
        {showModalHistory && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  Riwayat Order
                </h2>
                <button
                  onClick={tutupModalHistory}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {selectedOrderHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <History size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Tidak ada riwayat order</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedOrderHistory.map((history, index) => (
                      <div
                        key={history.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                              {selectedOrderHistory.length - index}
                            </div>
                            <div>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  history.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : history.status === "process"
                                    ? "bg-blue-100 text-blue-800"
                                    : history.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {mapHistoryStatus(history.status)}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatTanggal(history.created_at)}
                          </span>
                        </div>
                        
                        {history.note && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              {history.note}
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-2 flex justify-between text-xs text-gray-500">
                          <span>ID: {history.id}</span>
                          <span>Order ID: {history.order_id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={tutupModalHistory}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === DAFTAR TRANSAKSI === */}
        {transactions.length === 0 ? (
          <p className="text-gray-600">Belum ada transaksi yang masuk.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            {/* TAMPILAN DESKTOP */}
            <table className="min-w-full border-collapse hidden md:table">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Kamar</th>
                  <th className="px-4 py-3">No. Reg</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Foto</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trx, i) => (
                  <tr key={trx.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">{trx.nama}</td>
                    <td className="px-4 py-3">{trx.blok}</td>
                    <td className="px-4 py-3">{trx.nomorRegister}</td>
                    <td className="px-4 py-3">{trx.date}</td>
                    <td className="px-4 py-3">{formatRupiah(trx.total)}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        trx.status === "Selesai"
                          ? "text-green-600"
                          : trx.status === "Dikonfirmasi"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {trx.status}
                    </td>
                    <td className="px-4 py-3">
                      {trx.buktiFoto ? (
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src={trx.buktiFoto}
                            alt="Bukti"
                            className="w-20 h-20 object-cover rounded-lg shadow-md border"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">
                          Belum ada foto
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      {trx.status === "Menunggu Konfirmasi" && (
                        <button
                          onClick={() => handleKonfirmasi(trx.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Konfirmasi"
                        >
                          <CheckCircle size={22} />
                        </button>
                      )}

                      {/* 🔁 Printer tetap bisa dipakai kapan saja */}
                      <button
                        onClick={() => handlePrint(trx)}
                        className="text-gray-700 hover:text-gray-900"
                        title="Cetak Struk"
                      >
                        <Printer size={22} />
                      </button>

                      {/* Kamera tetap bisa dipakai kapan sudah dicetak */}
                      {(trx.status === "Dikonfirmasi" ||
                        trx.status === "Selesai") && (
                        <button
                          onClick={() => bukaModalFoto(trx)}
                          className="text-green-600 hover:text-green-800"
                          title="Ambil Foto Bukti"
                        >
                          <Camera size={22} />
                        </button>
                      )}

                      {/* Tombol History - hanya untuk order yang selesai */}
                      {trx.status === "Selesai" && trx.orderHistory && trx.orderHistory.length > 0 && (
                        <button
                          onClick={() => bukaModalHistory(trx)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Lihat Riwayat Order"
                        >
                          <History size={22} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TAMPILAN MOBILE */}
            <div className="md:hidden">
              {transactions.map((trx, i) => (
                <div key={trx.id} className="border-b p-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleRow(trx.id)}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{trx.nama}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {trx.date} • {formatRupiah(trx.total)}
                      </div>
                      <div className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                        trx.status === "Selesai"
                          ? "bg-green-100 text-green-800"
                          : trx.status === "Dikonfirmasi"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {trx.status}
                      </div>
                    </div>
                    <div className="ml-4">
                      {expandedRows.has(trx.id) ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                  </div>

                  {expandedRows.has(trx.id) && (
                    <div className="mt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Kamar:</span>
                          <p>{trx.blok}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">No. Reg:</span>
                          <p>{trx.nomorRegister}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Pengirim:</span>
                          <p>{trx.namaPengirim || "-"}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Total:</span>
                          <p className="font-semibold">{formatRupiah(trx.total)}</p>
                        </div>
                      </div>

                      {/* Foto Bukti */}
                      <div>
                        <span className="font-medium text-gray-600 text-sm">Foto Bukti:</span>
                        {trx.buktiFoto ? (
                          <div className="mt-1">
                            <img
                              src={trx.buktiFoto}
                              alt="Bukti"
                              className="w-24 h-24 object-cover rounded-lg shadow border"
                            />
                          </div>
                        ) : (
                          <p className="text-gray-400 italic text-sm">Belum ada foto</p>
                        )}
                      </div>

                      {/* Items */}
                      {trx.items && trx.items.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-600 text-sm">Items:</span>
                          <div className="mt-1 space-y-1">
                            {trx.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.name} (x{item.qty})</span>
                                <span>{formatRupiah(item.price * item.qty)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Aksi */}
                      <div className="flex flex-wrap gap-3 pt-2 border-t">
                        {trx.status === "Menunggu Konfirmasi" && (
                          <button
                            onClick={() => handleKonfirmasi(trx.id)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                            title="Konfirmasi"
                          >
                            <CheckCircle size={18} />
                            <span>Konfirmasi</span>
                          </button>
                        )}

                        <button
                          onClick={() => handlePrint(trx)}
                          className="flex items-center gap-1 text-gray-700 hover:text-gray-900 text-sm"
                          title="Cetak Struk"
                        >
                          <Printer size={18} />
                          <span>Cetak</span>
                        </button>

                        {(trx.status === "Dikonfirmasi" || trx.status === "Selesai") && (
                          <button
                            onClick={() => bukaModalFoto(trx)}
                            className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm"
                            title="Ambil Foto Bukti"
                          >
                            <Camera size={18} />
                            <span>Foto</span>
                          </button>
                        )}

                        {trx.status === "Selesai" && trx.orderHistory && trx.orderHistory.length > 0 && (
                          <button
                            onClick={() => bukaModalHistory(trx)}
                            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm"
                            title="Lihat Riwayat Order"
                          >
                            <History size={18} />
                            <span>Riwayat</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <ModalAmbilFoto
        isOpen={showModalFoto}
        onClose={tutupModalFoto}
        transaction={selectedTransaction}
      />
    </div>
  );
}
