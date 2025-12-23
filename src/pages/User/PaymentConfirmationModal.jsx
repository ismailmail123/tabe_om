import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useOrderStore from "../../stores/useOrderStore";
import { AlertCircle, Check, CheckCircle, Clock, Upload, X } from "lucide-react";
import usePaymentStore from "../../stores/usePaymentStore";

// Komponen Modal Konfirmasi Pembayaran
// const PaymentConfirmationModal = ({ order, isOpen, onClose, onConfirm }) => {
//   const [paymentStatus, setPaymentStatus] = useState('process');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [previewImage, setPreviewImage] = useState(null);
//   const updatePaymentStatus = useOrderStore((state) => state.updatePaymentStatus);

//   useEffect(() => {
//     if (!isOpen) {
//       setSelectedFile(null);
//       setPreviewImage(null);
//       setPaymentStatus('process');
//     }
//   }, [isOpen]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validasi tipe file
//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
//       if (!allowedTypes.includes(file.type)) {
//         toast.error('Format file tidak didukung. Gunakan JPG, PNG, GIF, atau PDF');
//         return;
//       }

//       // Validasi ukuran file (maksimal 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('Ukuran file terlalu besar. Maksimal 5MB');
//         return;
//       }

//       setSelectedFile(file);

//       // Buat preview untuk gambar
//       if (file.type.startsWith('image/')) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setPreviewImage(reader.result);
//         };
//         reader.readAsDataURL(file);
//       } else {
//         setPreviewImage(null);
//       }
//     }
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile && paymentStatus === 'process') {
//       toast.error('Untuk status "Sudah Bayar", bukti pembayaran harus diupload');
//       return;
//     }

//     try {
//       setIsUploading(true);

//       // Buat form data untuk mengirim file
//       const formData = new FormData();
//       formData.append('payment_status', paymentStatus);
//       if (selectedFile) {
//         formData.append('proof_of_payment', selectedFile);
//       }

//       await updatePaymentStatus(order.id, formData);

//       toast.success('Status pembayaran berhasil diperbarui!');
//       onClose();
//       onConfirm(); // Refresh data atau update UI
//     } catch (error) {
//       console.error('Error updating payment:', error);
//       // Error sudah ditangani di store
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const getTotalAmount = () => {
//     return order.total_amount || order.items?.reduce((sum, item) => {
//       return sum + (item.price * item.quantity);
//     }, 0) || 0;
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h2 className="text-xl font-bold text-gray-800">Konfirmasi Pembayaran</h2>
//               <p className="text-gray-500 text-sm">Order #{order.order_number || order.id}</p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 text-2xl"
//               disabled={isUploading}
//             >
//               ×
//             </button>
//           </div>

//           {/* Informasi Order */}
//           <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-gray-600">Total Pembayaran:</span>
//               <span className="text-xl font-bold text-green-600">
//                 Rp {getTotalAmount().toLocaleString('id-ID')}
//               </span>
//             </div>
//             <div className="text-sm text-gray-500">
//               Transfer ke: <span className="font-medium">BANK BRI - 1234-5678-9012</span>
//             </div>
//           </div>

//           {/* Status Pembayaran */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Status Pembayaran
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               {[
//                 { value: 'process', label: 'Sudah Bayar', color: 'bg-green-500' },
//                 { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
//                 { value: 'cancelled', label: 'Batalkan', color: 'bg-red-500' },
//                 { value: 'completed', label: 'Selesai', color: 'bg-blue-500' },
//               ].map((status) => (
//                 <button
//                   key={status.value}
//                   type="button"
//                   onClick={() => setPaymentStatus(status.value)}
//                   className={`px-4 py-3 rounded-lg border transition-all ${
//                     paymentStatus === status.value
//                       ? `border-2 ${status.color.replace('bg-', 'border-')} ${status.color} text-white`
//                       : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
//                     <span className="font-medium">{status.label}</span>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Upload Bukti Pembayaran */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Bukti Pembayaran {paymentStatus === 'process' && <span className="text-red-500">*</span>}
//             </label>
            
//             <div className="space-y-4">
//               {/* Upload Area */}
//               <div
//                 className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
//                   selectedFile
//                     ? 'border-green-500 bg-green-50'
//                     : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
//                 }`}
//                 onClick={() => document.getElementById('file-upload').click()}
//               >
//                 <input
//                   id="file-upload"
//                   type="file"
//                   className="hidden"
//                   accept="image/*,.pdf"
//                   onChange={handleFileChange}
//                 />
                
//                 {selectedFile ? (
//                   <div className="space-y-2">
//                     <div className="text-green-600">
//                       <CheckCircle className="w-12 h-12 mx-auto mb-2" />
//                     </div>
//                     <p className="font-medium text-gray-800">{selectedFile.name}</p>
//                     <p className="text-sm text-gray-500">
//                       {(selectedFile.size / 1024).toFixed(2)} KB
//                     </p>
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedFile(null);
//                         setPreviewImage(null);
//                       }}
//                       className="text-red-600 text-sm hover:text-red-800 mt-2"
//                     >
//                       Hapus File
//                     </button>
//                   </div>
//                 ) : (
//                   <div>
//                     <div className="text-gray-400 mb-2">
//                       <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                       </svg>
//                     </div>
//                     <p className="text-gray-600">
//                       <span className="font-medium text-blue-600">Klik untuk upload</span> atau drag & drop
//                     </p>
//                     <p className="text-sm text-gray-500 mt-1">
//                       PNG, JPG, GIF, atau PDF (maks. 5MB)
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Preview Image */}
//               {previewImage && (
//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Preview:
//                   </label>
//                   <div className="border rounded-lg overflow-hidden">
//                     <img 
//                       src={previewImage} 
//                       alt="Preview" 
//                       className="w-full h-48 object-contain bg-gray-50"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Note untuk PDF */}
//               {selectedFile && selectedFile.type === 'application/pdf' && (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//                   <div className="flex items-center text-yellow-800">
//                     <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     <span className="text-sm font-medium">File PDF terpilih</span>
//                   </div>
//                   <p className="text-sm text-yellow-700 mt-1">
//                     Pastikan bukti pembayaran dalam PDF jelas terbaca
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Validasi */}
//             {paymentStatus === 'process' && !selectedFile && (
//               <p className="text-red-500 text-sm mt-2">
//                 Bukti pembayaran wajib diupload untuk konfirmasi pembayaran
//               </p>
//             )}
//           </div>

//           {/* Note Tambahan */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Catatan (Opsional)
//             </label>
//             <textarea
//               placeholder="Tambahkan catatan atau keterangan pembayaran..."
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               rows="3"
//             />
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3 pt-4 border-t border-gray-200">
//             <button
//               onClick={onClose}
//               disabled={isUploading}
//               className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
//             >
//               Batal
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={isUploading || (paymentStatus === 'process' && !selectedFile)}
//               className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
//                 isUploading
//                   ? 'bg-blue-400 cursor-not-allowed'
//                   : 'bg-blue-600 hover:bg-blue-700'
//               } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
//             >
//               {isUploading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Memproses...
//                 </div>
//               ) : (
//                 'Konfirmasi Pembayaran'
//               )}
//             </button>
//           </div>

//           {/* Informasi Tambahan */}
//           <div className="mt-6 pt-4 border-t border-gray-200">
//             <div className="bg-gray-50 rounded-lg p-3">
//               <p className="text-sm text-gray-600">
//                 <strong>Note:</strong> Setelah konfirmasi, admin akan memverifikasi pembayaran Anda.
//                 Status akan berubah setelah verifikasi selesai.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const PaymentConfirmationModal = ({ order, isOpen, onClose, onConfirm }) => {
  const [paymentStatus, setPaymentStatus] = useState('process');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const updatePaymentStatus = usePaymentStore((state) => state.updatePaymentStatus);

  console.log('Rendering PaymentConfirmationModal with order:', order);
  console.log("tessssssssssssssssssss")

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
    // Validasi untuk status 'process'
    if (paymentStatus === 'process' && !selectedFile) {
      toast.error('Untuk status "Sudah Bayar", bukti pembayaran harus diupload');
      return;
    }

    try {
      setIsUploading(true);
      
      // Pastikan order.id ada
      if (!order || !order.id) {
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
        orderId: order.id,
        orderNumber: order.order_number,
        paymentStatus,
        hasFile: !!selectedFile
      });

      // Panggil updatePaymentStatus dengan order.id (order_id)
      const result = await updatePaymentStatus(order.id, formData);
      
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

export default PaymentConfirmationModal;