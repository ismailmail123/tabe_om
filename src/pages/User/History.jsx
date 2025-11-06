import React, { useEffect, useState } from "react"
import { Clock, Info, X, Image as ImageIcon } from "lucide-react"

export default function History() {
  const [transactions, setTransactions] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("transactions")) || []
    setTransactions(data)
  }, [])

  const formatRupiah = (n) =>
    "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-['Poppins']">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Clock className="w-7 h-7 text-blue-600 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Riwayat Pembelanjaan
        </h2>
      </div>

      {/* Jika belum ada transaksi */}
      {transactions.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7466/7466149.png"
            alt="Empty"
            className="w-24 mx-auto mb-3 opacity-80"
          />
          <p className="text-gray-600 font-medium">
            Belum ada riwayat transaksi 💸
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="py-3 px-4 border-b text-gray-700">Tanggal</th>
                <th className="py-3 px-4 border-b text-gray-700">Nama WBP</th>
                <th className="py-3 px-4 border-b text-gray-700">Total Harga</th>
                <th className="py-3 px-4 border-b text-gray-700">Status</th>
                <th className="py-3 px-4 border-b text-center text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50 transition duration-150 text-gray-800"
                >
                  <td className="py-2 px-4 border-b">{trx.date}</td>
                  <td className="py-2 px-4 border-b">{trx.nama || "-"}</td>
                  <td className="py-2 px-4 border-b">
                    {formatRupiah(trx.total || 0)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        trx.status === "Selesai"
                          ? "bg-green-100 text-green-700"
                          : trx.status === "Dikonfirmasi"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {trx.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => setSelected(trx)}
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
      )}

      {/* Modal Detail */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={22} />
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Info className="text-blue-600" /> Detail Transaksi
            </h3>

            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <span className="font-medium">Nama WBP:</span>{" "}
                {selected.nama || "-"}
              </p>
              <p>
                <span className="font-medium">Tanggal:</span> {selected.date}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {selected.status || "Menunggu"}
              </p>
            </div>

            <div className="border-t mt-4 pt-4">
              <h4 className="font-semibold text-gray-800 mb-2">
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
                        {item.name} x{item.qty}
                      </span>
                      <span>{formatRupiah(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Tidak ada data barang.</p>
              )}
            </div>

            {/* 🖼️ Foto Bukti Penyerahan */}
            {selected.buktiFoto && (
              <div className="mt-5">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                  <ImageIcon size={18} className="text-blue-600" />
                  Bukti Penyerahan Barang
                </h4>
                <img
                  src={selected.buktiFoto}
                  alt="Bukti Penyerahan"
                  className="w-full h-64 object-cover rounded-lg border shadow-sm"
                />
              </div>
            )}

            <div className="flex justify-between mt-6 font-semibold text-gray-800">
              <span>Total Pembayaran</span>
              <span className="text-green-600">
                {formatRupiah(selected.total || 0)}
              </span>
            </div>

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
      )}
    </div>
  )
}
