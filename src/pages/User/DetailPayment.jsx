import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  Package, 
  Download, 
  Copy, 
  Printer, 
  Home,
  User,
  MapPin,
  Phone,
  Calendar,
  FileText,
  Banknote,
  CheckSquare,
  XCircle,
  Upload
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import axiosInstance from "../../lib/axios.js";
import useAuthStore from "../../stores/useAuthStore.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import useOrderStore from "../../stores/useOrderStore.js";
import qris from "../../assets/images/qris.jpeg";


const PaymentDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
   const [copiedTotal, setCopiedTotal] = useState(false);
  // const {fetchOrderById, orderById} = useOrderStore();

  // useEffect(() => {
  //   fetchOrderById(orderId);
  // }, [orderId]);

  // console.log("order dari id", orderById);

  // console.log("order ini di detail:", order);

//   const copyToClipboard1= (text) => {
//   navigator.clipboard.writeText(text);
//   toast.success("Berhasil disalin ke clipboard!");
// };

console.log("ini order", order)

// Fungsi untuk menyalin total pembayaran
const copyTotalPayment = () => {
  const totalText = formatCurrency(order.total);
  navigator.clipboard.writeText(`${totalText}`)
    .then(() => {
      setCopiedTotal(true);
      toast.success("Total pembayaran berhasil disalin!");
      // Reset status setelah 2 detik
      setTimeout(() => setCopiedTotal(false), 2000);
    })
    .catch(err => {
      console.error('Gagal menyalin: ', err);
      // Fallback untuk browser lama
      const textArea = document.createElement('textarea');
      textArea.value = `${totalText}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedTotal(true);
      toast.success("Total pembayaran berhasil disalin!");
      setTimeout(() => setCopiedTotal(false), 2000);
    });
};

  // Informasi rekening bank (bisa dari config atau API)
  const bankAccounts = [
    {
      bank_name: "Bank BCA",
      account_number: "1234567890",
      account_name: "Nama Toko Anda",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg"
    },
    {
      bank_name: "Bank Mandiri",
      account_number: "0987654321",
      account_name: "Nama Toko Anda",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Bank_Mandiri_logo_2016.svg"
    }
  ];

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.data) {
        setOrder(response.data.data);
        
        // Jika ada payment_proof, set URL-nya
        if (response.data.data.payment?.payment_proof) {
          setPaymentProofUrl(response.data.data.payment.payment_proof);
        }
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Gagal memuat detail pesanan");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi file
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error("Ukuran file maksimal 5MB");
        return;
      }
      
      if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) {
        toast.error("Format file harus JPG, PNG, atau PDF");
        return;
      }
      
      setSelectedFile(file);
      
      // Preview file
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPaymentProofUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const uploadPaymentProof = async () => {
    if (!selectedFile) {
      toast.error("Pilih file bukti pembayaran terlebih dahulu");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('proof_of_payment', selectedFile);

      const token = localStorage.getItem("token");
      await axiosInstance.post(`/payments/${orderId}/payment-by-order`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Bukti pembayaran berhasil diunggah!");
      fetchOrderDetails(); // Refresh data
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Gagal mengunggah bukti pembayaran");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Berhasil disalin ke clipboard!");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'process': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'process': return <Package className="w-5 h-5 text-blue-600" />;
      case 'pending': 
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'process': return 'Diproses';
      case 'pending': return 'Menunggu';
      case 'cancelled': return 'Dibatalkan';
      default: return 'Menunggu';
    }
  };

  const getPaymentMethodInfo = (method) => {
    switch (method) {
      case 'COD':
        return {
          icon: <Truck className="w-6 h-6" />,
          title: 'Cash on Delivery (COD)',
          description: 'Bayar saat barang diterima',
          color: 'text-blue-600'
        };
      case 'transfer':
      case 'manual_transfer':
        return {
          icon: <Banknote className="w-6 h-6" />,
          title: 'Transfer Manual',
          description: 'Transfer ke rekening bank',
          color: 'text-green-600'
        };
      default:
        return {
          icon: <CreditCard className="w-6 h-6" />,
          title: method || 'Pembayaran',
          description: '',
          color: 'text-gray-600'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-20 h-20 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-6">Pesanan dengan ID {orderId} tidak ditemukan</p>
        <button
          onClick={() => navigate('/user/orders')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Kembali ke Daftar Pesanan
        </button>
      </div>
    );
  }

  const paymentMethodInfo = getPaymentMethodInfo(order.payment_method);
  const isTransferPayment = ['transfer'].includes(order.payment_method);
  const needsPaymentProof = isTransferPayment && order.payment_status === 'pending';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 font-['Poppins']">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Detail Pembayaran</h1>
                <p className="text-gray-600 text-sm">ID Pesanan: #{order.order_code}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Cetak</span>
              </button>
              <Link
                to="/user/belanja"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Belanja Lagi</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Status Pesanan</h2>
              <p className="text-gray-600">Lacak perkembangan pesanan Anda</p>
            </div>
            <div className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)} flex items-center gap-2`}>
              {getStatusIcon(order.status)}
              {getStatusText(order.status)}
            </div>
          </div>

          <div className="relative">
            {/* Timeline */}
            <div className="flex justify-between mb-4">
              {['cancelled', 'pending',  'process', 'completed'].map((stage, index) => (
                <div key={stage} className="flex flex-col items-center relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    stage === order.status 
                      ? 'bg-blue-600 text-white' 
                      : index < ['cancelled', 'pending', 'process', 'completed'].indexOf(order.status) 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium capitalize">{stage.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
            <div className="absolute top-5 left-20 right-20 h-1 bg-gray-200">
              <div 
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${(['cancelled', 'pending', 'process', 'completed'].indexOf(order.status) + 1) * 33.33}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details & Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-600" />
                Produk Dipesan
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition">
                    <img
                      src={item.img_url || item.product_image_url || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product_name || item.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{item.variant_name}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-900 font-medium">{formatCurrency(item.price)}</p>
                          <p className="text-sm text-gray-600">x{item.quantity}</p>
                        </div>
                        <p className="font-bold text-blue-700">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

             {/* Order History Timeline */}
{order.order_history && order.order_history.length > 0 && (
  <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Riwayat Pesanan</h2>
    
    <div className="relative">
      {order.order_history.slice().reverse().map((history, index) => (
        <div key={history.id} className="flex gap-4 pb-6 last:pb-0 relative">
          {/* Timeline line */}
          {index < order.order_history.length - 1 && (
            <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200"></div>
          )}
          
          {/* Icon */}
          <div className="relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              history.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {history.status === 'completed' ? (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <CheckCircle className="w-4 h-4 text-blue-600" />
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 capitalize">
                  {history.status.replace('_', ' ')}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{history.note}</p>
                
                {/* Tampilkan gambar bukti penyerahan hanya di status completed */}
                {history.status === 'completed' && order.purchase_receipt_photo && (
                  <div className="mt-3">
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                      <p className="text-green-700 font-medium text-sm mb-2">
                        ✅ Pesanan telah selesai
                      </p>
                      <div className="mt-2">
                        <p className="text-gray-700 text-sm mb-2">Bukti Penyerahan:</p>
                        <button 
                          onClick={() => window.open(order.purchase_receipt_photo, '_blank')}
                          className="block max-w-xs hover:opacity-90 transition-opacity"
                        >
                          <img 
                            src={order.purchase_receipt_photo} 
                            alt="Bukti Penyerahan Pesanan" 
                            className="rounded-lg border border-gray-300 shadow-sm w-full"
                          />
                          <p className="text-gray-500 text-xs mt-1 text-center">
                            Klik untuk melihat ukuran penuh
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Jika status completed tapi tidak ada foto */}
                {history.status === 'completed' && !order.purchase_receipt_photo && (
                  <div className="mt-3">
                    <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                      <p className="text-green-700 font-medium text-sm">
                        ✅ Pesanan telah selesai dan diterima
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                {formatDate(history.created_at)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
    
    {/* Order Summary - Kode asli tetap */}
    <div className="mt-8 pt-6 border-t">
      <div className="space-y-3">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Biaya Admin</span>
          <span>Gratis</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-3 border-t">
          <span>Total Pembayaran</span>
          <div className="flex items-center gap-2">
            <span className="text-green-700">{formatCurrency(order.total)}</span>
            <button
              onClick={copyTotalPayment}
              className={`ml-2 p-1.5 rounded-md transition-colors ${
                copiedTotal 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="Salin total pembayaran"
            >
              {copiedTotal ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
            </div>

            {/* Customer & Delivery Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                Informasi Pemesan
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Nama Pemesan</p>
                      <p className="font-medium text-gray-900">{order.order_data[0]?.wbp_sender || 'Anonim'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Catatan</p>
                      <p className="font-medium text-gray-900">{order.order_data[0]?.note || 'Tidak ada pesan'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Alamat Pengiriman</p>
                      <p className="font-medium text-gray-900">Lapas / Rutan (Penjualan khusus WBP)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Pesanan</p>
                      <p className="font-medium text-gray-900">{formatDate(order.order_data[0]?.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Info */}
          <div className="space-y-6">
            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
                Metode Pembayaran
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`p-3 rounded-lg ${paymentMethodInfo.color} bg-opacity-10`}>
                    {paymentMethodInfo.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{paymentMethodInfo.title}</h3>
                    <p className="text-sm text-gray-600">{paymentMethodInfo.description}</p>
                  </div>
                </div>

                {/* Status Pembayaran */}
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Status Pembayaran</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.payment_status)}`}>
                      {getStatusText(order.payment_status)}
                    </span>
                  </div>
                  
                  {order.payment?.payment_date && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tanggal Pembayaran</span>
                      <span className="font-medium">{formatDate(order.payment.payment_date)}</span>
                    </div>
                  )}
                </div>

                {/* Payment Code */}
                {order.payment?.payment_code && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-800 font-medium">Kode Pembayaran</span>
                      <button
                        onClick={() => copyToClipboard(order.payment.payment_code)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Copy className="w-4 h-4" />
                        Salin
                      </button>
                    </div>
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <code className="text-lg font-mono font-bold text-blue-700">
                        {order.payment.payment_code}
                      </code>
                    </div>
                    <p className="text-sm text-blue-600 mt-2">
                      Gunakan kode ini saat transfer untuk mempermudah verifikasi
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Transfer Info */}
            {order.payment_status !=='completed'  && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Banknote className="w-6 h-6 text-green-600" />
                  Transfer QRIS Berikut
                </h2>
                
                <div className="space-y-4">
                  <img
                    src={qris} alt="QRIS" className="w-48 mx-auto mb-4"
                     />
                </div>

                {/* Transfer Instructions */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Instruksi Transfer
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Transfer sesuai jumlah: <span className="font-bold">{formatCurrency(order.total)}</span>  yang dapat disalin pada total pembayaran </li>
                    <li>• Gunakan kode pembayaran jika ada</li>
                    <li>• Simpan bukti transfer</li>
                    <li>• Upload bukti transfer di bawah ini</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Payment Proof Upload */}
            {needsPaymentProof && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-purple-600" />
                  Upload Bukti Transfer
                </h2>
                
                <div className="space-y-4">
                  {/* Preview */}
                  {paymentProofUrl && (
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      {paymentProofUrl.startsWith('data:image/') ? (
                        <img
                          src={paymentProofUrl}
                          alt="Bukti transfer"
                          className="w-full max-h-64 object-contain rounded"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">File bukti transfer</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                    <input
                      type="file"
                      id="paymentProof"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="paymentProof" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-10 h-10 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Klik untuk upload</p>
                          <p className="text-sm text-gray-600">Format: JPG, PNG, PDF (max 5MB)</p>
                        </div>
                        {selectedFile && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {selectedFile.name}
                          </p>
                        )}
                      </div>
                    </label>
                  </div>

                  <button
                    onClick={uploadPaymentProof}
                    disabled={uploading || !selectedFile}
                    className={`w-full py-3 rounded-lg font-medium text-white transition ${
                      uploading || !selectedFile
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {uploading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Mengunggah...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <CheckSquare className="w-5 h-5" />
                        Konfirmasi Pembayaran
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Bantuan & Dukungan</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.open('https://wa.me/6285342545607', '_blank')}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  <Phone className="w-5 h-5" />
                  Hubungi Admin via WhatsApp
                </button>
                
                <button
                  onClick={() => navigate('/user/history')}
                  className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Lihat Pesanan Lainnya
                </button>
                
                <button
                  onClick={() => navigate('/user/belanja')}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Lanjut Belanja
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-gray-600">Butuh bantuan? Hubungi kami di support@toko.com</p>
            <p className="text-gray-500 text-sm mt-2">
              © {new Date().getFullYear()} Toko Online. Hak Cipta Dilindungi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;