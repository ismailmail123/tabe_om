// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { CheckCircle, Clock, Package, Truck, Home, CreditCard, User, MapPin, Phone, Mail } from "lucide-react";
// import useOrderStore from "../../stores/useOrderStore";
// import useAuthStore from "../../stores/useAuthStore";
// import toast, { Toaster } from "react-hot-toast";
// import PaymentConfirmationModal from "./PaymentConfirmationModal";

// // Komponen Animasi Pesawat
// const AirplaneAnimation = ({ status, progress = 0 }) => {
//   const airplaneStatus = status?.toLowerCase();
//   const isDelivered = airplaneStatus === 'delivered' || airplaneStatus === 'completed';
//   const isShipped = airplaneStatus === 'shipped' || airplaneStatus === 'on_delivery';
//   const isProcessing = airplaneStatus === 'processing' || airplaneStatus === 'paid';
  
//   // Hitung progress untuk animasi
//   const animationProgress = isDelivered ? 100 : isShipped ? 70 : isProcessing ? 30 : 0;

//   return (
//     <div className="relative w-full py-8">
//       {/* Garis Progress */}
//       <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 transform -translate-y-1/2 z-0"></div>
      
//       {/* Progress Fill */}
//       <div 
//         className="absolute top-1/2 left-0 h-1 bg-green-500 transform -translate-y-1/2 z-10 transition-all duration-1000 ease-in-out"
//         style={{ width: `${animationProgress}%` }}
//       ></div>
      
//       {/* Checkpoints */}
//       <div className="flex justify-between items-center relative z-20">
//         {/* Checkpoint 1: Order Placed */}
//         <div className="flex flex-col items-center">
//           <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
//             animationProgress >= 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
//           }`}>
//             <Clock size={20} />
//           </div>
//           <span className={`text-xs font-medium ${animationProgress >= 0 ? 'text-green-600' : 'text-gray-400'}`}>
//             Pesanan Dibuat
//           </span>
//         </div>
        
//         {/* Checkpoint 2: Processing */}
//         <div className="flex flex-col items-center">
//           <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
//             animationProgress >= 30 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
//           }`}>
//             <Package size={20} />
//           </div>
//           <span className={`text-xs font-medium ${animationProgress >= 30 ? 'text-green-600' : 'text-gray-400'}`}>
//             Diproses
//           </span>
//         </div>
        
//         {/* Checkpoint 3: Shipped */}
//         <div className="flex flex-col items-center">
//           <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
//             animationProgress >= 70 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
//           }`}>
//             <Truck size={20} />
//           </div>
//           <span className={`text-xs font-medium ${animationProgress >= 70 ? 'text-green-600' : 'text-gray-400'}`}>
//             Dikirim
//           </span>
//         </div>
        
//         {/* Checkpoint 4: Delivered */}
//         <div className="flex flex-col items-center">
//           <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
//             animationProgress >= 100 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
//           }`}>
//             <Home size={20} />
//           </div>
//           <span className={`text-xs font-medium ${animationProgress >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
//             Sampai
//           </span>
//         </div>
//       </div>
      
//       {/* Pesawat */}
//       <div 
//         className="absolute top-1/2 transform -translate-y-1/2 z-30 transition-all duration-1000 ease-in-out"
//         style={{ left: `${animationProgress}%`, marginLeft: '-24px' }}
//       >
//         <div className="relative">
//           {/* Pesawat */}
//           <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transform rotate-45 shadow-lg flex items-center justify-center">
//             <div className="transform -rotate-45 text-white">
//               ✈️
//             </div>
//           </div>
          
//           {/* Trail effect */}
//           {isShipped && (
//             <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
//               <div className="flex space-x-1">
//                 {[...Array(3)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
//                     style={{ animationDelay: `${i * 0.2}s` }}
//                   ></div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Komponen Card Pesanan
// const OrderCard = ({ order, onViewDetail }) => {
//   const getStatusColor = (status) => {
//     switch(status?.toLowerCase()) {
//       case 'pending':
//         return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-4 h-4" /> };
//       case 'paid':
//         return { bg: 'bg-blue-100', text: 'text-blue-800', icon: <CreditCard className="w-4 h-4" /> };
//       case 'processing':
//         return { bg: 'bg-purple-100', text: 'text-purple-800', icon: <Package className="w-4 h-4" /> };
//       case 'shipped':
//       case 'on_delivery':
//         return { bg: 'bg-orange-100', text: 'text-orange-800', icon: <Truck className="w-4 h-4" /> };
//       case 'delivered':
//       case 'completed':
//         return { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
//       case 'cancelled':
//         return { bg: 'bg-red-100', text: 'text-red-800', icon: <Clock className="w-4 h-4" /> };
//       default:
//         return { bg: 'bg-gray-100', text: 'text-gray-800', icon: <Clock className="w-4 h-4" /> };
//     }
//   };

//   const statusInfo = getStatusColor(order.status);
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('id-ID', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     }).format(date);
//   };

//   const totalAmount = order.total_amount || order.items?.reduce((sum, item) => {
//     return sum + (item.price * item.quantity);
//   }, 0) || 0;

//   return (
//     <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
//       <div className="p-6">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-6">
//           <div>
//             <h3 className="text-lg font-bold text-gray-800">Order #{order.order_number || order.id}</h3>
//             <p className="text-sm text-gray-500 mt-1">{formatDate(order.created_at)}</p>
//           </div>
//           <div className="flex flex-col items-end gap-2">
//             {/* Status Pembayaran */}
//             <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${
//               order.payment_status === 'pending' 
//                 ? 'bg-yellow-100 text-yellow-800' 
//                 : 'bg-green-100 text-green-800'
//             }`}>
//               <CreditCard className="w-4 h-4" />
//               <span className="font-medium text-sm capitalize">
//                 {order.payment_status === 'pending' ? 'Belum Bayar' : 'Lunas'}
//               </span>
//             </div>
            
//             {/* Status Pesanan */}
//             <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${statusInfo.bg} ${statusInfo.text}`}>
//               {statusInfo.icon}
//               <span className="font-medium text-sm capitalize">
//                 {order.status?.replace('_', ' ') || 'Pending'}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Info Pengiriman */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div className="space-y-2">
//             <div className="flex items-center gap-2 text-gray-700">
//               <User className="w-4 h-4" />
//               <span className="font-medium">Penerima:</span>
//               <span>{order.wbp_name || '-'}</span>
//             </div>
//             <div className="flex items-center gap-2 text-gray-700">
//               <MapPin className="w-4 h-4" />
//               <span className="font-medium">Lokasi:</span>
//               <span>{order.wbp_room || '-'}</span>
//             </div>
//           </div>
//           <div className="space-y-2">
//             <div className="flex items-center gap-2 text-gray-700">
//               <User className="w-4 h-4" />
//               <span className="font-medium">Pengirim:</span>
//               <span>{order.wbp_sender || '-'}</span>
//             </div>
//             <div className="flex items-center gap-2 text-gray-700">
//               <CreditCard className="w-4 h-4" />
//               <span className="font-medium">Pembayaran:</span>
//               <span className="capitalize">{order.payment_method || '-'}</span>
//             </div>
//           </div>
//         </div>

//         {/* Animasi Pesawat */}
//         <div className="mb-6">
//           <AirplaneAnimation status={order.status} />
//         </div>

//         {/* Daftar Produk */}
//         <div className="mb-6">
//           <h4 className="font-semibold text-gray-800 mb-3">Detail Produk</h4>
//           <div className="space-y-3">
//             {order.items?.slice(0, 2).map((item, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//                     📦
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-800">{item.variant?.name || 'Produk'}</p>
//                     <p className="text-sm text-gray-500">Qty: {item.quantity} × Rp {item.price?.toLocaleString('id-ID') || '0'}</p>
//                   </div>
//                 </div>
//                 <p className="font-bold text-blue-600">
//                   Rp {(item.price * item.quantity).toLocaleString('id-ID')}
//                 </p>
//               </div>
//             ))}
            
//             {order.items?.length > 2 && (
//               <p className="text-center text-gray-500 text-sm">
//                 + {order.items.length - 2} produk lainnya
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Total dan Actions */}
//         <div className="flex justify-between items-center pt-6 border-t border-gray-100">
//           <div>
//             <p className="text-gray-500 text-sm">Total Pembayaran</p>
//             <p className="text-2xl font-bold text-green-600">
//               Rp {totalAmount.toLocaleString('id-ID')}
//             </p>
//           </div>
//           <div className="flex gap-3">
//             {order.payment_status === 'pending' && (
//               <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
//                 Bayar Sekarang
//               </button>
//             )}
//             <button
//               onClick={onViewDetail}
//               className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition"
//             >
//               Lihat Detail
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Komponen Detail Pesanan Modal
// const OrderDetailModal = ({ order, isOpen, onClose }) => {
//   if (!isOpen) return null;

//   const totalAmount = order.total_amount || order.items?.reduce((sum, item) => {
//     return sum + (item.price * item.quantity);
//   }, 0) || 0;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-8">
//           {/* Header */}
//           <div className="flex justify-between items-start mb-8">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">Detail Pesanan</h2>
//               <p className="text-gray-500">#{order.order_number || order.id}</p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 text-2xl"
//             >
//               ×
//             </button>
//           </div>

//           {/* Status Section */}
//           <div className="mb-8">
//             <AirplaneAnimation status={order.status} />
//           </div>

//           {/* Informasi Pesanan */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             {/* Informasi Penerima */}
//             <div className="bg-gray-50 rounded-xl p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Penerima</h3>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-sm text-gray-500">Nama WBP</p>
//                   <p className="font-medium">{order.wbp_name || '-'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Blok/Kamar</p>
//                   <p className="font-medium">{order.wbp_room || '-'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Nomor Register</p>
//                   <p className="font-medium">{order.wbp_register_number || '-'}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Informasi Pengirim */}
//             <div className="bg-gray-50 rounded-xl p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pengirim</h3>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-sm text-gray-500">Nama Pengirim</p>
//                   <p className="font-medium">{order.wbp_sender || '-'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Metode Pembayaran</p>
//                   <p className="font-medium capitalize">{order.payment_method || '-'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Status Pembayaran</p>
//                   <p className={`font-medium ${
//                     order.payment_status === 'pending' ? 'text-yellow-600' : 'text-green-600'
//                   }`}>
//                     {order.payment_status === 'pending' ? 'Belum Dibayar' : 'Lunas'}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Status Pesanan</p>
//                   <p className="font-medium capitalize">{order.status?.replace('_', ' ') || 'Pending'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Tanggal Pesanan</p>
//                   <p className="font-medium">
//                     {new Date(order.created_at).toLocaleDateString('id-ID', {
//                       day: 'numeric',
//                       month: 'long',
//                       year: 'numeric',
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     })}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Daftar Produk */}
//           <div className="mb-8">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Produk Dipesan</h3>
//             <div className="space-y-4">
//               {order.items?.map((item, index) => (
//                 <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
//                   <div className="flex items-center gap-4">
//                     <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
//                       <span className="text-2xl">📦</span>
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-800">{item.variant?.name || 'Produk'}</p>
//                       <p className="text-sm text-gray-500">Varian: {item.variant?.variant_name || 'Standar'}</p>
//                       <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-blue-600">
//                       Rp {(item.price * item.quantity).toLocaleString('id-ID')}
//                     </p>
//                     <p className="text-sm text-gray-500">Rp {item.price?.toLocaleString('id-ID')} per item</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Total */}
//           <div className="border-t border-gray-200 pt-6">
//             <div className="flex justify-between items-center mb-2">
//               <p className="text-gray-600">Subtotal</p>
//               <p className="font-medium">Rp {totalAmount.toLocaleString('id-ID')}</p>
//             </div>
//             <div className="flex justify-between items-center mb-2">
//               <p className="text-gray-600">Biaya Admin</p>
//               <p className="text-green-600 font-medium">Gratis</p>
//             </div>
//             <div className="flex justify-between items-center text-xl font-bold mt-4 pt-4 border-t border-gray-200">
//               <p>Total Pembayaran</p>
//               <p className="text-green-600">Rp {totalAmount.toLocaleString('id-ID')}</p>
//             </div>
//           </div>

//           {/* Catatan */}
//           {order.note && (
//             <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <h4 className="font-medium text-blue-800 mb-2">Catatan Pesanan</h4>
//               <p className="text-blue-700">{order.note}</p>
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-gray-200">
//             <button
//               onClick={onClose}
//               className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
//             >
//               Tutup
//             </button>
//             {order.payment_status === 'pending' && (
//               <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
//                 Bayar Sekarang
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Komponen Utama Halaman Transaksi
// const Transaksi = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false); // State untuk modal pembayara
//   const navigate = useNavigate();
//   const { fetchOrder, orders } = useOrderStore();
//   const authUser = useAuthStore((state) => state.authUser);


//   // Filter hanya order dengan payment_status = 'pending'
//   const pendingOrders = useMemo(() => {
//     return orders.filter(order => order.payment_status === 'pending');
//   }, [orders]);

//   useEffect(() => {
//     const loadOrders = async () => {
//       try {
//         setIsLoading(true);
//         await fetchOrder();
//       } catch (error) {
//         console.error('Error loading orders:', error);
//         toast.error('Terjadi kesalahan saat memuat data transaksi');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadOrders();
//   }, [fetchOrder]);

//   console.log("Ini orders pending:", pendingOrders);

//   const handleViewDetail = (order) => {
//     setSelectedOrder(order);
//     setShowDetailModal(true);
//   };

//   const handlePayNow = (order) => {
//     // Navigasi ke halaman pembayaran atau trigger modal pembayaran
//     toast.success('Mengarahkan ke halaman pembayaran...');
//     // navigate(`/payment/${order.id}`);
//   };
//    const handleOpenPaymentModal = (order) => {
//     setSelectedOrder(order);
//     setShowPaymentModal(true);
//   };

//   const handlePaymentSuccess = () => {
//     // Refresh data setelah pembayaran berhasil
//     fetchOrder();
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
//         <div className="text-center">
//           <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Memuat Transaksi...</h2>
//           <p className="text-gray-600">Sedang mengambil data pesanan Anda</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Toaster position="top-center" />
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//           <div className="container mx-auto px-4 py-12">
//             <div className="flex flex-col md:flex-row justify-between items-center">
//               <div>
//                 <h1 className="text-3xl md:text-4xl font-bold mb-2">Pesanan Belum Dibayar</h1>
//                 <p className="text-blue-100">Selesaikan pembayaran untuk pesanan yang belum dibayar</p>
//               </div>
//               <div className="mt-4 md:mt-0">
//                 <button
//                   onClick={() => navigate('/user/belanja')}
//                   className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg"
//                 >
//                   Belanja Lagi
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="container mx-auto px-4 py-8 -mt-8">
//           {/* Stats Card - Khusus Pending Orders */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm">Total Pesanan Belum Bayar</p>
//                   <p className="text-3xl font-bold text-gray-800">{pendingOrders.length}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
//                   <CreditCard className="w-6 h-6 text-yellow-600" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm">Total Nominal</p>
//                   <p className="text-3xl font-bold text-green-600">
//                     Rp {pendingOrders.reduce((total, order) => {
//                       const orderTotal = order.total_amount || order.items?.reduce((sum, item) => {
//                         return sum + (item.price * item.quantity);
//                       }, 0) || 0;
//                       return total + orderTotal;
//                     }, 0).toLocaleString('id-ID')}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                   <CreditCard className="w-6 h-6 text-green-600" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm">Pesanan Tertua</p>
//                   <p className="text-lg font-bold text-gray-800">
//                     {pendingOrders.length > 0 
//                       ? new Date(Math.min(...pendingOrders.map(o => new Date(o.created_at)))).toLocaleDateString('id-ID')
//                       : '-'
//                     }
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <Clock className="w-6 h-6 text-blue-600" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Informasi */}
//           <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8 rounded-r-lg">
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-yellow-800">
//                   <strong>Perhatian:</strong> Pesanan akan otomatis dibatalkan jika tidak dibayar dalam waktu 24 jam. Segera selesaikan pembayaran untuk menghindari pembatalan otomatis.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Daftar Pesanan */}
//           {pendingOrders.length === 0 ? (
//             <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//               <div className="w-32 h-32 mx-auto mb-6 opacity-80">
//                 <div className="text-6xl">🎉</div>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-3">Tidak Ada Pesanan Belum Dibayar</h3>
//               <p className="text-gray-600 mb-8">Semua pesanan Anda sudah terbayar. Lanjutkan berbelanja!</p>
//               <button
//                 onClick={() => navigate('/user/belanja')}
//                 className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition transform hover:scale-105 shadow-lg"
//               >
//                 Lanjutkan Belanja
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">Pesanan Menunggu Pembayaran</h2>
//                 <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
//                   {pendingOrders.length} pesanan
//                 </span>
//               </div>
//               {pendingOrders.map((order) => (
//                 <OrderCard
//                   key={order.id}
//                   order={order}
//                   onViewDetail={() => handleViewDetail(order)}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal Detail */}
//       {selectedOrder && (
//         <OrderDetailModal
//           order={selectedOrder}
//           isOpen={showDetailModal}
//           onClose={() => setShowDetailModal(false)}
//         />
//       )}

//       {/* Modal Konfirmasi Pembayaran */}
//       {selectedOrder && (
//         <PaymentConfirmationModal
//           order={selectedOrder}
//           isOpen={showPaymentModal}
//           onClose={() => setShowPaymentModal(false)}
//           onConfirm={handlePaymentSuccess}
//         />
//       )}

//       {/* Floating Action Button */}
//       <button
//         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//         className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center"
//       >
//         ↑
//       </button>
//     </>
//   );
// };

// export default Transaksi;


import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  Home, 
  CreditCard, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Search,
  Filter,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Check,
  X,
  RefreshCw,
  Upload
} from "lucide-react";
import useOrderStore from "../../stores/useOrderStore";
import useAuthStore from "../../stores/useAuthStore";
import toast, { Toaster } from "react-hot-toast";
import usePaymentStore from "../../stores/usePaymentStore";

// Komponen Animasi Status
const StatusAnimation = ({ status }) => {
  const statusProgress = {
    'pending': { progress: 0, label: 'Menunggu', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    'process': { progress: 30, label: 'Diproses', color: 'text-blue-600', bg: 'bg-blue-100' },
    'on_delivery': { progress: 70, label: 'Pembayaran Diterima', color: 'text-orange-600', bg: 'bg-orange-100' },
    'completed': { progress: 100, label: 'Selesai', color: 'text-green-600', bg: 'bg-green-100' },
    'cancelled': { progress: 0, label: 'Dibatalkan', color: 'text-red-600', bg: 'bg-red-100' }
  };

  const currentStatus = statusProgress[status] || statusProgress['pending'];

  return (
    <div className="relative w-full">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${currentStatus.bg.replace('bg-', 'bg-')} transition-all duration-500`}
          style={{ width: `${currentStatus.progress}%` }}
        ></div>
      </div>
      
      {/* Status Indicators */}
      <div className="flex justify-between mt-2">
        {Object.entries(statusProgress).map(([key, value]) => (
          <div key={key} className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
              status === key ? currentStatus.bg : 'bg-gray-200'
            }`}>
              {status === key && (
                <div className={`w-2 h-2 rounded-full ${currentStatus.color.replace('text-', 'bg-')}`}></div>
              )}
            </div>
            <span className={`text-xs ${status === key ? currentStatus.color : 'text-gray-400'}`}>
              {value.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Komponen Card Riwayat Transaksi
const HistoryCard = ({ order, onViewDetail, onConfirmPayment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return { 
          bg: 'bg-yellow-100', 
          text: 'text-yellow-800', 
          icon: <Clock className="w-4 h-4" />,
          badge: 'Menunggu Pembayaran'
        };
      case 'paid':
      case 'process':
        return { 
          bg: 'bg-blue-100', 
          text: 'text-blue-800', 
          icon: <Package className="w-4 h-4" />,
          badge: 'Diproses'
        };
      case 'shipped':
      case 'on_delivery':
        return { 
          bg: 'bg-orange-100', 
          text: 'text-orange-800', 
          icon: <Truck className="w-4 h-4" />,
          badge: 'Dalam Pengiriman'
        };
      case 'delivered':
      case 'completed':
        return { 
          bg: 'bg-green-100', 
          text: 'text-green-800', 
          icon: <CheckCircle className="w-4 h-4" />,
          badge: 'Selesai'
        };
      case 'cancelled':
        return { 
          bg: 'bg-red-100', 
          text: 'text-red-800', 
          icon: <X className="w-4 h-4" />,
          badge: 'Dibatalkan'
        };
      default:
        return { 
          bg: 'bg-gray-100', 
          text: 'text-gray-800', 
          icon: <Clock className="w-4 h-4" />,
          badge: 'Pending'
        };
    }
  };

  const getPaymentStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Belum Bayar' };
      case 'paid':
      case 'process':
        return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Lunas' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' };
      case 'completed':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Pending' };
    }
  };

  const statusInfo = getStatusColor(order.status);
  const paymentStatusInfo = getPaymentStatusColor(order.payment_status);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotal = () => {
    if (order.total_amount) return order.total_amount;
    if (order.items) {
      return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    return 0;
  };

  const totalAmount = calculateTotal();
  const itemCount = order.items?.length || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-gray-800">
                Order #{order.order_number || order.order_id}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatusInfo.bg} ${paymentStatusInfo.text}`}>
                {paymentStatusInfo.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(order.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                {itemCount} item{itemCount > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${statusInfo.bg} ${statusInfo.text}`}>
              {statusInfo.icon}
              <span className="font-medium text-sm">
                {statusInfo.badge}
              </span>
            </div>
            
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>

        {/* Progress Status */}
        <div className="mb-6">
          <StatusAnimation status={order.status} />
        </div>

        {/* Info Singkat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Penerima</p>
                <p className="font-medium">{order.order_data[0].wbp_name || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Lokasi</p>
                <p className="font-medium">{order.order_data[0].wbp_room || '-'}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Pengirim</p>
                <p className="font-medium">{order.order_data[0].wbp_sender || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Metode</p>
                <p className="font-medium capitalize">{order.payment_method || '-'}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            {order.payment?.proof_of_payment && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500">Bukti Pembayaran</p>
                  <p className="font-medium text-green-600">Tersedia</p>
                </div>
              </div>
            )}
            {order.payment_date && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Tanggal Bayar</p>
                  <p className="font-medium">{formatDate(order.payment_date)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Produk Preview */}
        {!isExpanded && order.items?.slice(0, 2).map((item, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">📦</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{item.variant?.name || 'Produk'}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>
            </div>
            <p className="font-bold text-blue-600">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-2 text-gray-600 hover:text-blue-600 flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Sembunyikan
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Lihat Detail
                </>
              )}
            </button>
            
            {/* Tombol Download Invoice */}
            <button className="px-3 py-2 text-gray-600 hover:text-blue-600 flex items-center gap-1">
              <Download className="w-4 h-4" />
              Invoice
            </button>
          </div>
          
          <div className="flex gap-3">
            {order.payment_status === 'pending' && (
              <button
                onClick={() => onConfirmPayment(order)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Konfirmasi Bayar
              </button>
            )}
            
            <button
              onClick={() => onViewDetail(order)}
              className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Detail
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Detail Produk</h4>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📦</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.variant?.name || 'Produk'}</p>
                      <p className="text-sm text-gray-500">
                        Varian: {item.variant?.variant_name || 'Standar'}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-sm text-gray-600">
                          Harga: {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.price)} per item
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg p-4 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Biaya Admin</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Komponen Modal Konfirmasi Pembayaran
const PaymentConfirmationModal = ({ order, isOpen, onClose, onConfirm }) => {
  const [paymentStatus, setPaymentStatus] = useState('process');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const {updatePaymentStatus} = usePaymentStore();

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewImage(null);
      setPaymentStatus('process');
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format file tidak didukung. Gunakan JPG, PNG, GIF, atau PDF');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file terlalu besar. Maksimal 5MB');
        return;
      }

      setSelectedFile(file);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null);
      }
    }
  };

  const handleSubmit = async () => {
    console.log("click", order)
    // Validasi untuk status 'process'
    if (paymentStatus === 'process' && !selectedFile) {
      toast.error('Untuk status "Sudah Bayar", bukti pembayaran harus diupload');
      return;
    }

    try {
      setIsUploading(true);
      
      // Pastikan order.id ada
      if (!order || !order.order_id) {
        toast.error('Data order tidak valid');
        return;
      }

      const formData = new FormData();
      
      // Tambahkan payment_status
      formData.append('payment_status', paymentStatus);
      
      // Tambahkan file jika ada
      if (selectedFile) {
        formData.append('proof_of_payment', selectedFile);
      }

      // Log untuk debugging
      console.log('Submitting payment update for order:', {
        orderId: order.order_id,
        orderNumber: order.order_number,
        paymentStatus,
        hasFile: !!selectedFile
      });

      // Panggil updatePaymentStatus dengan order.id (order_id)
      const result = await updatePaymentStatus(order.order_id, formData);
      
      console.log('Payment update result:', result);
      
      toast.success('Status pembayaran berhasil diperbarui!');
      
      // Tutup modal dan refresh data
      onClose();
      if (onConfirm) {
        onConfirm();
      }
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      // Error sudah ditangani di zustand store
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotal = () => {
    if (order.total_amount) return order.total_amount;
    if (order.items) {
      return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    return 0;
  };

  const totalAmount = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Konfirmasi Pembayaran</h2>
              <p className="text-gray-500 text-sm">
                Order #{order.order_number || order.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={isUploading}
            >
              ×
            </button>
          </div>

          {/* Informasi Order */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total Pembayaran:</span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Transfer ke: <span className="font-medium">BANK BRI - 1234-5678-9012</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Atas Nama: <span className="font-medium">PT. Babs Indonesia</span>
            </div>
          </div>

          {/* Status Pembayaran */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'process', label: 'Sudah Bayar', color: 'bg-green-500', icon: <Check className="w-4 h-4" /> },
                { value: 'pending', label: 'Pending', color: 'bg-yellow-500', icon: <Clock className="w-4 h-4" /> },
                { value: 'cancelled', label: 'Batalkan', color: 'bg-red-500', icon: <X className="w-4 h-4" /> },
                { value: 'completed', label: 'Selesai', color: 'bg-blue-500', icon: <CheckCircle className="w-4 h-4" /> },
              ].map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => setPaymentStatus(status.value)}
                  className={`px-4 py-3 rounded-lg border transition-all ${
                    paymentStatus === status.value
                      ? `border-2 ${status.color.replace('bg-', 'border-')} ${status.color} text-white`
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  disabled={isUploading}
                >
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-2">
                      {status.icon}
                      <span className="font-medium text-sm">{status.label}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Informasi tambahan berdasarkan status */}
            {paymentStatus === 'process' && (
              <p className="text-sm text-yellow-600 mt-2">
                <AlertCircle className="inline w-4 h-4 mr-1" />
                Untuk status "Sudah Bayar", wajib upload bukti pembayaran
              </p>
            )}
          </div>

          {/* Upload Bukti Pembayaran */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bukti Pembayaran {paymentStatus === 'process' && <span className="text-red-500">*</span>}
              <span className="text-xs text-gray-500 ml-1">(maks. 5MB, JPG/PNG/GIF/PDF)</span>
            </label>
            
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  selectedFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isUploading && document.getElementById('file-upload').click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="text-green-600">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                    </div>
                    <p className="font-medium text-gray-800 truncate">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreviewImage(null);
                      }}
                      className="text-red-600 text-sm hover:text-red-800 mt-2"
                      disabled={isUploading}
                    >
                      Hapus File
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-gray-400 mb-2">
                      <Upload className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-gray-600">
                      <span className="font-medium text-blue-600">Klik untuk upload</span> atau drag & drop
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, GIF, PDF (maks. 5MB)
                    </p>
                  </div>
                )}
              </div>

              {previewImage && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview:
                  </label>
                  <div className="border rounded-lg overflow-hidden">
                    <img 
                      src={previewImage} 
                      alt="Preview bukti pembayaran" 
                      className="w-full h-48 object-contain bg-gray-50"
                    />
                  </div>
                </div>
              )}
            </div>

            {paymentStatus === 'process' && !selectedFile && (
              <p className="text-red-500 text-sm mt-2">
                <AlertCircle className="inline w-4 h-4 mr-1" />
                Bukti pembayaran wajib diupload untuk konfirmasi pembayaran
              </p>
            )}
          </div>

          {/* Catatan */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Catatan Penting:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Pastikan bukti pembayaran jelas dan terbaca</li>
                  <li>Status akan diverifikasi oleh admin setelah konfirmasi</li>
                  <li>Pesanan dapat dibatalkan otomatis jika tidak dikonfirmasi dalam 24 jam</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUploading || (paymentStatus === 'process' && !selectedFile)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                isUploading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Konfirmasi Pembayaran
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen Detail Pesanan Modal
const OrderDetailModal = ({ order, isOpen, onClose, onPayNow }) => {
  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotal = () => {
    if (order.total_amount) return order.total_amount;
    if (order.items) {
      return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    return 0;
  };

  const totalAmount = calculateTotal();

  const getPaymentStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'text-yellow-600';
      case 'process': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getOrderStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'text-yellow-600';
      case 'process': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Detail Pesanan</h2>
              <p className="text-gray-500">#{order.order_number || order.order_id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Status Section */}
          <div className="mb-8">
            <StatusAnimation status={order.status} />
          </div>

          {/* Informasi Pesanan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Informasi Penerima */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informasi Penerima
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nama WBP</p>
                  <p className="font-medium">{order.order_data[0].wbp_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blok/Kamar</p>
                  <p className="font-medium">{order.order_data[0].wbp_room || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nomor Register</p>
                  <p className="font-medium">{order.order_data[0].wbp_register_number || '-'}</p>
                </div>
                {order.note && (
                  <div>
                    <p className="text-sm text-gray-500">Catatan</p>
                    <p className="font-medium text-gray-700 bg-yellow-50 p-2 rounded">{order.note}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Informasi Pengirim */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informasi Pengirim
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nama Pengirim</p>
                  <p className="font-medium">{order.order_data[0].wbp_sender || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Metode Pembayaran</p>
                  <p className="font-medium capitalize">{order.payment_method || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status Pembayaran</p>
                  <p className={`font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                    {order.payment_status === 'pending' ? 'Belum Dibayar' : 
                     order.payment_status === 'process' ? 'Sudah Bayar' :
                     order.payment_status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status Pesanan</p>
                  <p className={`font-medium capitalize ${getOrderStatusColor(order.status)}`}>
                    {order.status?.replace('_', ' ') || 'Pending'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Pesanan</p>
                  <p className="font-medium">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {order.payment_date && (
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Pembayaran</p>
                    <p className="font-medium">
                      {new Date(order.payment_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Daftar Produk */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Produk Dipesan
            </h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.variant?.name || 'Produk'}</p>
                      <p className="text-sm text-gray-500">Varian: {item.variant?.variant_name || 'Standar'}</p>
                      <div className="flex items-center gap-6 mt-2">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-sm text-gray-600">
                          Harga: {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.price)} per item
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">{formatCurrency(totalAmount)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Biaya Admin</p>
                <p className="text-green-600 font-medium">Gratis</p>
              </div>
              <div className="border-t border-gray-300 pt-3 mt-2">
                <div className="flex justify-between items-center text-xl font-bold">
                  <p>Total Pembayaran</p>
                  <p className="text-green-600">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bukti Pembayaran */}
          {order?.proof_of_payment && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Bukti Pembayaran
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-800">Bukti pembayaran telah diupload</p>
                    <p className="text-sm text-green-600 mt-1">
                      {order.payment_date ? 
                        `Tanggal upload: ${new Date(order.payment_date).toLocaleDateString('id-ID')}` : 
                        'Tersedia untuk diverifikasi'}
                    </p>
                  </div>
                  <a 
                    href={order.proof_of_payment} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Lihat Bukti
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Tutup
            </button>
            {order.payment_status === 'pending' && (
              <button 
                onClick={() => {
                  onClose();
                  onPayNow && onPayNow();
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Konfirmasi Pembayaran
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen Utama Riwayat Transaksi
const RiwayatTransaksi = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const navigate = useNavigate();
  const { fetchOrder, orders } = useOrderStore();
  const authUser = useAuthStore((state) => state.authUser);

  // Load orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        await fetchOrder();
      } catch (error) {
        console.error('Error loading orders:', error);
        toast.error('Terjadi kesalahan saat memuat data transaksi');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [fetchOrder]);

  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.wbp_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.wbp_sender?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "all" || order.payment_status === statusFilter;

      // Date filter
      let matchesDate = true;
      if (dateFilter !== "all") {
        const orderDate = new Date(order.created_at);
        const today = new Date();
        
        switch(dateFilter) {
          case "today":
            matchesDate = orderDate.toDateString() === today.toDateString();
            break;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            matchesDate = orderDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            matchesDate = orderDate >= monthAgo;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by newest first
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.payment_status === 'pending').length;
    const completedOrders = orders.filter(o => o.payment_status === 'completed' || o.status === 'completed').length;
    const totalRevenue = orders.reduce((sum, order) => {
      const total = order.total_amount || order.items?.reduce((s, item) => s + (item.price * item.quantity), 0) || 0;
      return sum + total;
    }, 0);

    return { totalOrders, pendingOrders, completedOrders, totalRevenue };
  }, [orders]);

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleOpenPaymentModal = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    fetchOrder();
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchOrder().finally(() => setIsLoading(false));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Memuat Riwayat Transaksi...</h2>
          <p className="text-gray-600">Sedang mengambil data pesanan Anda</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Riwayat Transaksi</h1>
                <p className="text-blue-100">Lihat dan kelola semua pesanan Anda</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <button
                  onClick={() => navigate('/user/belanja')}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg"
                >
                  Belanja Lagi
                </button>
                <button
                  onClick={handleRefresh}
                  className="bg-blue-700 hover:bg-blue-800 px-6 py-2.5 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="container mx-auto px-4 py-8 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Pesanan</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Belum Dibayar</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Selesai</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Pengeluaran</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari order, penerima, atau pengirim..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-48">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Belum Bayar</option>
                    <option value="process">Sudah Bayar</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Date Filter */}
              <div className="w-full md:w-48">
                <div className="relative">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">Semua Waktu</option>
                    <option value="today">Hari Ini</option>
                    <option value="week">7 Hari Terakhir</option>
                    <option value="month">30 Hari Terakhir</option>
                  </select>
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Order List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-32 h-32 mx-auto mb-6 opacity-80">
                <div className="text-6xl">📋</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Tidak Ada Transaksi</h3>
              <p className="text-gray-600 mb-8">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all" 
                  ? "Tidak ditemukan transaksi dengan filter yang dipilih" 
                  : "Belum ada transaksi yang tercatat. Mulai berbelanja sekarang!"}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("all");
                  navigate('/user/belanja');
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition transform hover:scale-105 shadow-lg"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Semua Transaksi <span className="text-blue-600">({filteredOrders.length})</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Urutkan: </span>
                  <select className="border-none focus:ring-0 text-blue-600 font-medium">
                    <option>Terbaru</option>
                    <option>Terlama</option>
                    <option>Total Tertinggi</option>
                  </select>
                </div>
              </div>
              
              {filteredOrders.map((order) => (
                <HistoryCard
                  key={order.order_id}
                  order={order}
                  onViewDetail={() => handleViewDetail(order)}
                  onConfirmPayment={() => handleOpenPaymentModal(order)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedOrder && (
        <>
          <OrderDetailModal
            order={selectedOrder}
            isOpen={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            onPayNow={() => {
              setShowDetailModal(false);
              handleOpenPaymentModal(selectedOrder);
            }}
          />
          
          <PaymentConfirmationModal
            order={selectedOrder}
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onConfirm={handlePaymentSuccess}
          />
        </>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center z-40"
      >
        ↑
      </button>
    </>
  );
};

export default RiwayatTransaksi;