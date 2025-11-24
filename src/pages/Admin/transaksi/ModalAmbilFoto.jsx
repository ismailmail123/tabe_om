import { useRef, useState } from "react";
import toast from "react-hot-toast";
import useOrderStore from "../../../stores/useOrderStore";
import { Camera, X, Upload } from "lucide-react";

const ModalAmbilFoto = ({ isOpen, onClose, transaction }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [note, setNote] = useState("");
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [usingCamera, setUsingCamera] = useState(false);

  const { updateOrderStatus } = useOrderStore();

  // Handle file upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Tidak ada file yang dipilih");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Silakan pilih file gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setUsingCamera(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle camera capture
  const bukaKamera = async () => {
    try {
      setUsingCamera(true);
      setImagePreview(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 1280, 
          height: 720,
          facingMode: 'environment' // Gunakan kamera belakang jika tersedia
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      toast.error("Gagal mengakses kamera: " + err.message);
      setUsingCamera(false);
    }
  };

  const ambilFotoDariKamera = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Set canvas size sama dengan video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const fotoData = canvas.toDataURL("image/jpeg", 0.8);
    
    setImagePreview(fotoData);
    
    // Stop kamera
    if (video.srcObject) {
      video.srcObject.getTracks().forEach((t) => t.stop());
    }
    setUsingCamera(false);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    // Stop kamera jika sedang aktif
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
    setUsingCamera(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    if (!imagePreview) {
      toast.error("Silakan ambil atau unggah foto bukti terlebih dahulu");
      setIsSending(false);
      return;
    }

    try {
      // Konversi base64 ke blob untuk dikirim ke backend
      let blob;
      if (imagePreview.startsWith('data:image')) {
        const response = await fetch(imagePreview);
        blob = await response.blob();
      } else {
        // Jika dari file input, gunakan file asli
        const file = fileInputRef.current.files[0];
        blob = file;
      }

      const formData = new FormData();
      formData.append("status", "completed");
      formData.append("note", note || "Bukti penerimaan barang oleh WBP");
      formData.append("purchase_receipt_photo", blob, "bukti_penerimaan.jpg");

      await updateOrderStatus(transaction.id, "completed", formData);

      toast.success("Foto bukti berhasil disimpan");
      setImagePreview(null);
      setNote("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsSending(false);
      onClose();
      
      // Reload halaman untuk update data terbaru
      setTimeout(() => {
        // window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Gagal menyimpan foto bukti:", error);
      toast.error("Gagal menyimpan foto bukti");
      setIsSending(false);
    }
  };

  if (!transaction) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div 
        className={`relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] transform transition-all duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        } flex flex-col`}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl p-5 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Ambil Foto Bukti Penerimaan</h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-1">
            {transaction.nama} - {transaction.blok}
          </p>
        </div>
        
        {/* Modal Body - Scrollable Area */}
        <div className="p-5 overflow-y-auto flex-1">
          <div className="mb-5 text-center">
            <div className="mx-auto bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-3">
              <Camera size={24} />
            </div>
            <p className="text-gray-700">
              Ambil foto bukti penerimaan barang oleh <span className="font-semibold text-blue-600">{transaction.nama}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Pastikan WBP terlihat jelas dalam foto
            </p>
          </div>

          {/* Camera View */}
          {usingCamera && (
            <div className="mb-4">
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              </div>
              <div className="flex justify-center gap-3 mt-3">
                <button
                  onClick={ambilFotoDariKamera}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Ambil Foto
                </button>
                <button
                  onClick={() => {
                    if (videoRef.current?.srcObject) {
                      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
                    }
                    setUsingCamera(false);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Batal
                </button>
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && !usingCamera ? (
            <div className="mb-5">
              <div className="relative mx-auto w-full">
                <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-green-300 bg-green-50">
                  <img
                    src={imagePreview}
                    alt="Preview bukti penerimaan"
                    className="w-full h-64 object-contain"
                  />
                </div>
                <button
                  onClick={removeImage}
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                Preview foto bukti penerimaan
              </p>
            </div>
          ) : !usingCamera ? (
            <div className="mb-5 text-center">
              <div className="mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-full h-40 flex flex-col items-center justify-center">
                <Camera className="text-gray-400 w-12 h-12 mb-3" />
                <p className="text-gray-500 text-sm">Belum ada bukti foto</p>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                Ambil foto menggunakan kamera atau unggah dari galeri
              </p>
            </div>
          ) : null}

          {/* Input Note */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan (Opsional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tambahkan catatan tentang penerimaan barang..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows="3"
            />
          </div>

          {/* Action Buttons */}
          {!usingCamera && (
            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={bukaKamera}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Camera size={20} />
                  Ambil Foto
                </button>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Upload size={20} />
                  Unggah Foto
                </button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Format: JPG, PNG | Maksimal 5MB
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-5 flex-shrink-0">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={!imagePreview || isSending}
              className={`px-6 py-2 font-medium rounded-xl transition-all duration-300 ${
                imagePreview && !isSending
                  ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                "Simpan Bukti Foto"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAmbilFoto;