import React, { useState, useEffect } from "react"
import SidebarAdmin from "../../components/SidebarAdmin"
import { CheckCircle, Upload, Printer } from "lucide-react"

export default function Transaksi() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const storedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || []
    setTransactions(storedTransactions)
  }, [])

  const formatRupiah = (n) =>
    "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  const handleKonfirmasi = (id) => {
    const updated = transactions.map((trx) =>
      trx.id === id ? { ...trx, status: "Dikonfirmasi" } : trx
    )
    setTransactions(updated)
    localStorage.setItem("transactions", JSON.stringify(updated))
  }

  const handleUploadBukti = (e, id) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const updated = transactions.map((trx) =>
        trx.id === id
          ? { ...trx, status: "Selesai", buktiFoto: reader.result }
          : trx
      )
      setTransactions(updated)
      localStorage.setItem("transactions", JSON.stringify(updated))
    }
    reader.readAsDataURL(file)
  }

  // 🧾 Fungsi Cetak Struk
  const handlePrint = (trx) => {
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Pembelian - ${trx.nama}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; margin-bottom: 10px; }
            p { margin: 4px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #000; padding: 6px; font-size: 13px; }
            th { background: #f0f0f0; }
            .total { font-weight: bold; text-align: right; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #555; }
          </style>
        </head>
        <body>
          <h2>🛒 Struk Pembelian TabeOM</h2>
          <p><strong>Nama WBP:</strong> ${trx.nama}</p>
          <p><strong>Blok:</strong> ${trx.blok}</p>
          <p><strong>No. Register:</strong> ${trx.nomorRegister}</p>
          <p><strong>Nama Pengirim:</strong> ${trx.namaPengirim || "-"}</p>
          <p><strong>Tanggal:</strong> ${trx.date}</p>
          <hr/>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Harga</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${
                trx.items
                  ?.map(
                    (item, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${item.name}</td>
                  <td>${item.qty}</td>
                  <td>${formatRupiah(item.price)}</td>
                  <td>${formatRupiah(item.price * item.qty)}</td>
                </tr>`
                  )
                  .join("") || ""
              }
              <tr>
                <td colspan="4" class="total">Total Pembayaran</td>
                <td class="total">${formatRupiah(trx.total)}</td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            <p>Terima kasih telah berbelanja di Koperasi TabeOM 🙏</p>
            <p>Harap simpan struk ini sebagai bukti pembelian dari keluarga.</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-['Poppins']">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Daftar Transaksi Pengguna
        </h1>

        {transactions.length === 0 ? (
          <p className="text-gray-600">Belum ada transaksi yang masuk.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full border-collapse">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">No</th>
                  <th className="px-4 py-3 text-left">Nama WBP</th>
                  <th className="px-4 py-3 text-left">Blok</th>
                  <th className="px-4 py-3 text-left">No. Register</th>
                  <th className="px-4 py-3 text-left">Nama Pengirim</th>
                  <th className="px-4 py-3 text-left">Tanggal</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Bukti Foto</th>
                  <th className="px-4 py-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trx, index) => (
                  <tr key={trx.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{trx.nama}</td>
                    <td className="px-4 py-3">{trx.blok}</td>
                    <td className="px-4 py-3">{trx.nomorRegister}</td>
                    <td className="px-4 py-3">{trx.namaPengirim || "-"}</td>
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

                    {/* Kolom Bukti Foto */}
                    <td className="px-4 py-3">
                      {trx.buktiFoto ? (
                        <img
                          src={trx.buktiFoto}
                          alt="Bukti"
                          className="w-20 h-20 object-cover rounded-lg shadow"
                        />
                      ) : (
                        <span className="text-gray-400 italic">
                          Belum ada foto
                        </span>
                      )}
                    </td>

                    {/* Kolom Aksi */}
                    <td className="px-4 py-3 flex items-center space-x-3">
                      {trx.status === "Menunggu Konfirmasi" && (
                        <button
                          onClick={() => handleKonfirmasi(trx.id)}
                          title="Konfirmasi Transaksi"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <CheckCircle size={22} />
                        </button>
                      )}

                      {trx.status === "Dikonfirmasi" && (
                        <label
                          title="Upload Bukti Barang Diterima"
                          className="text-green-600 hover:text-green-800 cursor-pointer"
                        >
                          <Upload size={22} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadBukti(e, trx.id)}
                            className="hidden"
                          />
                        </label>
                      )}

                      {trx.status === "Selesai" && (
                        <button
                          onClick={() => handlePrint(trx)}
                          title="Cetak Struk Pembelian"
                          className="text-gray-700 hover:text-gray-900"
                        >
                          <Printer size={22} />
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
