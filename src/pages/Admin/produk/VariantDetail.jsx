import React from "react";

const VariantDetail = ({ variant, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Detail Variant</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Gambar Variant */}
            <div className="flex justify-center">
              {variant.img_url ? (
                <img
                  src={variant.img_url}
                  alt={variant.name}
                  className="w-48 h-48 object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Tidak ada gambar</span>
                </div>
              )}
            </div>

            {/* Info Variant */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nama Variant</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{variant.name}</p>
              </div>

              {variant.sku && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">SKU</label>
                  <p className="text-gray-900 font-medium mt-1">{variant.sku}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Harga</label>
                  <p className="text-xl font-bold text-blue-600 mt-1">
                    Rp {Number(variant.price).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Stok</label>
                  <p className={`text-lg font-semibold mt-1 ${
                    parseInt(variant.stock) > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {variant.stock} unit
                  </p>
                </div>
              </div>

              {variant.product && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Produk Induk</label>
                  <p className="text-gray-900 mt-1">{variant.product.name}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t">
              <button
                onClick={onEdit}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantDetail;