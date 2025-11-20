import React, { useState, useEffect, useRef } from "react"
import {
  CheckCircle,
  Camera,
  Printer,
  XCircle,
  Trash2,
  RefreshCw,
} from "lucide-react"

export default function Transaksi() {
  const [transactions, setTransactions] = useState([])
  const [activeTrx, setActiveTrx] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("transactions")) || []
    setTransactions(stored)
  }, [])

  const formatRupiah = (n) =>
    "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  const updateLocal = (data) => {
    setTransactions(data)
    localStorage.setItem("transactions", JSON.stringify(data))
  }

  const handleKonfirmasi = (id) => {
    const updated = transactions.map((trx) =>
      trx.id === id ? { ...trx, status: "Dikonfirmasi" } : trx
    )
    updateLocal(updated)
  }

  // === 🧾 CETAK STRUK ===
  const handlePrint = (trx) => {
    const printWindow = window.open("", "_blank")
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
    `)
    printWindow.document.close()
    printWindow.print()
  }

  // === 🎥 KAMERA ===
  const bukaKamera = async (trx) => {
    setActiveTrx(trx)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      alert("Gagal mengakses kamera: " + err.message)
    }
  }

  const ambilFoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const fotoData = canvas.toDataURL("image/png")

    const updated = transactions.map((trx) =>
      trx.id === activeTrx.id
        ? { ...trx, status: "Selesai", buktiFoto: fotoData }
        : trx
    )

    video.srcObject.getTracks().forEach((t) => t.stop())
    setActiveTrx(null)
    updateLocal(updated)
  }

  const batalKamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop())
    }
    setActiveTrx(null)
  }

  const hapusFoto = (id) => {
    if (!window.confirm("Hapus foto bukti dan ambil ulang?")) return
    const updated = transactions.map((trx) =>
      trx.id === id ? { ...trx, status: "Dikonfirmasi", buktiFoto: null } : trx
    )
    updateLocal(updated)
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
              <canvas ref={canvasRef} width={640} height={480} className="hidden" />
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

        {/* === DAFTAR TRANSAKSI === */}
        {transactions.length === 0 ? (
          <p className="text-gray-600">Belum ada transaksi yang masuk.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full border-collapse">
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
                          <div className="flex gap-2">
                            <button
                              onClick={() => bukaKamera(trx)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Ambil Ulang Foto"
                            >
                              <RefreshCw size={20} />
                            </button>
                            <button
                              onClick={() => hapusFoto(trx.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Hapus Foto"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
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
                          onClick={() => bukaKamera(trx)}
                          className="text-green-600 hover:text-green-800"
                          title="Ambil Foto Bukti"
                        >
                          <Camera size={22} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
