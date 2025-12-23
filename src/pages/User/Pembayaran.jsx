// import React, { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { CreditCard } from "lucide-react"

// export default function Pembayaran() {
//   const [cart, setCart] = useState([])
//   const [form, setForm] = useState({
//     nama: "",
//     blok: "",
//     nomorRegister: "",
//     namaPengirim: "",
//     catatan: "",
//   })
//   const navigate = useNavigate()

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || []
//     setCart(storedCart)
//   }, [])

//   const formatRupiah = (n) =>
//     "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

//   const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     // data transaksi baru
//     const newTransaction = {
//       id: Date.now(),
//       date: new Date().toLocaleString("id-ID"),
//       nama: form.nama,
//       blok: form.blok,
//       nomorRegister: form.nomorRegister,
//       namaPengirim: form.namaPengirim,
//       catatan: form.catatan,
//       items: cart,
//       total,
//       status: "Menunggu Konfirmasi",
//     }

//     // Simpan ke localStorage untuk user
//     const existingTransactions =
//       JSON.parse(localStorage.getItem("transactions")) || []
//     existingTransactions.push(newTransaction)
//     localStorage.setItem("transactions", JSON.stringify(existingTransactions))

//     // Setelah transaksi sukses disimpan
// localStorage.setItem("notifTransaksi", true)


//     // 🔔 Tambahkan juga notifikasi untuk admin
//     const adminNotifs = JSON.parse(localStorage.getItem("adminNotifications")) || []
//     adminNotifs.push({
//       id: newTransaction.id,
//       message: `Transaksi baru dari ${form.nama} (${form.namaPengirim}) - Total ${formatRupiah(total)}`,
//       time: newTransaction.date,
//       read: false,
//       data: newTransaction,
//     })
//     localStorage.setItem("adminNotifications", JSON.stringify(adminNotifs))

//     // Hapus keranjang setelah konfirmasi
//     localStorage.removeItem("cart")

//     alert("✅ Pembayaran berhasil dikonfirmasi! Menunggu verifikasi admin.")
//     navigate("/user/history")
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-['Poppins']">
//       <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
//         <div className="flex items-center gap-3 mb-8">
//           <CreditCard className="w-8 h-8 text-green-600" />
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Formulir Pembayaran WBP
//           </h2>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Input Nama WBP */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-2">
//               Nama WBP
//             </label>
//             <input
//               type="text"
//               name="nama"
//               value={form.nama}
//               onChange={(e) => setForm({ ...form, nama: e.target.value })}
//               required
//               placeholder="Masukkan nama lengkap WBP"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
//             />
//           </div>

//           {/* Input Blok dan Register */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Blok / Kamar
//               </label>
//               <input
//                 type="text"
//                 name="blok"
//                 value={form.blok}
//                 onChange={(e) => setForm({ ...form, blok: e.target.value })}
//                 required
//                 placeholder="Contoh: Blok A-2"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Nomor Register
//               </label>
//               <input
//                 type="text"
//                 name="nomorRegister"
//                 value={form.nomorRegister}
//                 onChange={(e) =>
//                   setForm({ ...form, nomorRegister: e.target.value })
//                 }
//                 required
//                 placeholder="Masukkan nomor register WBP"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
//               />
//             </div>
//           </div>

//           {/* Nama Pengirim */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-2">
//               Nama Pengirim
//             </label>
//             <input
//               type="text"
//               name="namaPengirim"
//               value={form.namaPengirim}
//               onChange={(e) =>
//                 setForm({ ...form, namaPengirim: e.target.value })
//               }
//               required
//               placeholder="Masukkan nama pengirim pembayaran"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
//             />
//           </div>

//           {/* Catatan */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-2">
//               Catatan Tambahan
//             </label>
//             <textarea
//               name="catatan"
//               value={form.catatan}
//               onChange={(e) => setForm({ ...form, catatan: e.target.value })}
//               rows="3"
//               placeholder="Tulis catatan tambahan (opsional)"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
//             ></textarea>
//           </div>

//           {/* Ringkasan Pembelian */}
//           <div className="border-t pt-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               Ringkasan Pembelian
//             </h3>
//             {cart.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex justify-between items-center text-gray-700 mb-2"
//               >
//                 <span>
//                   {item.name}{" "}
//                   <span className="text-sm text-gray-500">x{item.qty}</span>
//                 </span>
//                 <span className="font-medium">
//                   {formatRupiah(item.price * item.qty)}
//                 </span>
//               </div>
//             ))}
//             <div className="flex justify-between mt-4 text-lg font-semibold">
//               <span>Total Pembayaran</span>
//               <span className="text-green-700">{formatRupiah(total)}</span>
//             </div>
//           </div>

//           {/* Tombol Submit */}
//           <div className="pt-6 flex justify-end">
//             <button
//               type="submit"
//               className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
//             >
//               Konfirmasi Pembayaran
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }



import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CreditCard, Truck, Banknote } from "lucide-react"
import { toast } from "react-hot-toast"

export default function Pembayaran() {
  const [cart, setCart] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    wbp_name: "",
    wbp_room: "",
    wbp_register_number: "",
    wbp_sender: "",
    note: "",
  })
  const navigate = useNavigate()

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || []
    setCart(storedCart)
    
    // Cek jika cart kosong
    if (storedCart.length === 0) {
      toast.error("Keranjang belanja kosong")
      navigate("/cart")
    }
  }, [navigate])

  const formatRupiah = (n) =>
    "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const total = subtotal // Tanpa biaya admin

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Format data sesuai dengan backend
      const orderData = {
        items: cart.map(item => ({
          variant_id: item.variant_id || item.id, // Pastikan ada variant_id
          quantity: item.qty
        })),
        payment_method: paymentMethod,
        wbp_name: form.wbp_name,
        wbp_room: form.wbp_room,
        wbp_register_number: form.wbp_register_number,
        wbp_sender: form.wbp_sender,
        note: form.note,
      }

      // Ambil token dari localStorage
      const token = localStorage.getItem("token")
      
      if (!token) {
        toast.error("Anda harus login terlebih dahulu")
        navigate("/login")
        return
      }

      // Kirim ke backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Gagal membuat pesanan')
      }

      // Berhasil
      toast.success("Pesanan berhasil dibuat!")
      
      // Simpan notifikasi untuk user
      localStorage.setItem("notifTransaksi", true)
      
      // Hapus keranjang
      localStorage.removeItem("cart")

      // Navigasi berdasarkan metode pembayaran
      if (paymentMethod === 'COD') {
        navigate("/user/orders")
      } else {
        // Untuk transfer, arahkan ke halaman instruksi
        navigate(`/order/confirmation/${result.data.order_id}`)
      }

    } catch (error) {
      console.error("Error creating order:", error)
      toast.error(error.message || "Terjadi kesalahan saat membuat pesanan")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Komponen metode pembayaran
  const PaymentMethodOption = ({ method, icon: Icon, title, description }) => (
    <div 
      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
        paymentMethod === method 
          ? 'border-green-500 bg-green-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => setPaymentMethod(method)}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          paymentMethod === method ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
        }`}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          paymentMethod === method ? 'border-green-500 bg-green-500' : 'border-gray-300'
        }`}>
          {paymentMethod === method && (
            <div className="w-2 h-2 rounded-full bg-white"></div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-['Poppins']">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-1">Lengkapi data untuk menyelesaikan pesanan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom kiri - Form dan metode pembayaran */}
          <div className="lg:col-span-2 space-y-6">
            {/* Form Data WBP */}
            <div className="bg-white rounded-xl shadow-sm p-5 md:p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">Data WBP</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nama WBP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.wbp_name}
                      onChange={(e) => setForm({ ...form, wbp_name: e.target.value })}
                      required
                      placeholder="Nama lengkap WBP"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Blok/Kamar <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.wbp_room}
                      onChange={(e) => setForm({ ...form, wbp_room: e.target.value })}
                      required
                      placeholder="Contoh: Blok A-2"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nomor Register
                    </label>
                    <input
                      type="text"
                      value={form.wbp_register_number}
                      onChange={(e) => setForm({ ...form, wbp_register_number: e.target.value })}
                      placeholder="Nomor register WBP"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nama Pengirim <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.wbp_sender}
                      onChange={(e) => setForm({ ...form, wbp_sender: e.target.value })}
                      required
                      placeholder="Nama pengirim"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    rows="3"
                    placeholder="Contoh: Warna merah, ukuran besar, dll."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none"
                  ></textarea>
                </div>

                {/* Metode Pembayaran */}
                <div className="pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Metode Pembayaran</h3>
                  <div className="space-y-3">
                    <PaymentMethodOption
                      method="COD"
                      icon={Truck}
                      title="Cash on Delivery (COD)"
                      description="Bayar saat barang diterima"
                    />
                    <PaymentMethodOption
                      method="transfer"
                      icon={Banknote}
                      title="Transfer Manual"
                      description="Transfer ke rekening bank, konfirmasi ke admin"
                    />
                  </div>
                  
                  {paymentMethod === 'transfer' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Instruksi Transfer:</h4>
                      <p className="text-sm text-blue-700 whitespace-pre-line">
                        Silakan lakukan transfer ke rekening berikut:
                        {"\n"}Bank: BCA
                        {"\n"}No. Rekening: 1234567890
                        {"\n"}Atas Nama: Nama Toko
                        {"\n\n"}Setelah transfer, harap konfirmasi ke admin melalui WhatsApp atau menu konfirmasi pembayaran.
                      </p>
                    </div>
                  )}
                </div>

                {/* Tombol Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                    isSubmitting || cart.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memproses...
                    </span>
                  ) : (
                    `Buat Pesanan - ${formatRupiah(total)}`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Kolom kanan - Ringkasan Pesanan */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Pesanan</h3>
              
              {/* Daftar Produk */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <CreditCard size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate">{item.name}</h4>
                      {item.variant_name && (
                        <p className="text-sm text-gray-500">Varian: {item.variant_name}</p>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-600">
                          {item.qty} × {formatRupiah(item.price)}
                        </span>
                        <span className="font-medium text-gray-800">
                          {formatRupiah(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rincian Harga */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">{formatRupiah(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya Admin</span>
                  <span className="text-green-600">Gratis</span>
                </div>

                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span className="text-green-700">{formatRupiah(total)}</span>
                </div>
              </div>

              {/* Info Tambahan */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">Perhatian:</span> Pastikan data WBP sudah benar. 
                  {paymentMethod === 'COD' 
                    ? ' Pembayaran dilakukan saat barang diterima.' 
                    : ' Setelah transfer, konfirmasi ke admin untuk proses pengiriman.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}