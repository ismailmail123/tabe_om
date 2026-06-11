const TimeRestrictionModal = ({ onLogout }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="text-6xl mb-4">🕗</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          TABE OM Sudah Tutup
        </h2>
        <p className="text-gray-500 mb-6">
          Maaf, belanja tidak dapat dilakukan mulai pukul{" "}
          <span className="font-semibold text-red-500">20.00 WIB</span>.
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