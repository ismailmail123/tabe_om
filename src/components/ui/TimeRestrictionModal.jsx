import { ShoppingBag } from "lucide-react"

const TimeRestrictionModal = ({ onLogout }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center">
        
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mx-auto mb-5">
          <ShoppingBag className="text-red-500 w-10 h-10" />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          TABE OM Sudah Tutup
        </h2>
        <p className="text-gray-500 mb-2">
          Jam Operasional Belanja:
        </p>
        <p className="text-lg font-bold text-green-600 mb-4">
          08.00 WIB — 20.00 WIB
        </p>
        <p className="text-gray-500 mb-6">
          Maaf, belanja tidak dapat dilakukan di luar jam operasional.
          Silakan kembali besok.
        </p>
        <button
          onClick={onLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TimeRestrictionModal;