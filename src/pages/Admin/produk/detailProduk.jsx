import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductStore from "../../../stores/useProductStore";
import useVariantStore from "../../../stores/useVariantStore";
import VariantForm from "./VariantForm";
import VariantDetail from "./VariantDetail";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productDetail, fetchProductById, isLoading, clearProductDetail } = useProductStore();
  const { variants, fetchVariantsByProductId, deleteVariant, clearVariants } = useVariantStore();
  
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [showVariantDetail, setShowVariantDetail] = useState(null);

  // PERBAIKAN: Gunakan variants dari store secara langsung
  const safeVariants = Array.isArray(variants) ? variants : [];

  useEffect(() => {
    if (id) {
      console.log('Fetching product and variants for ID:', id);
      fetchProductById(id);
      fetchVariantsByProductId(id);
    }

    return () => {
      clearProductDetail();
      clearVariants();
    };
  }, [id, fetchProductById, fetchVariantsByProductId, clearProductDetail, clearVariants]);

  const handleAddVariant = () => {
    setEditingVariant(null);
    setShowVariantForm(true);
  };

  const handleEditVariant = (variant) => {
    setEditingVariant(variant);
    setShowVariantForm(true);
  };

  const handleViewVariant = (variant) => {
    setShowVariantDetail(variant);
  };

  const handleDeleteVariant = async (variantId) => {
    if (window.confirm("Yakin ingin menghapus variant ini?")) {
      try {
        await deleteVariant(variantId, id);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting variant:", error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowVariantForm(false);
    setEditingVariant(null);
  };

  const handleCloseDetail = () => {
    setShowVariantDetail(null);
  };

  // Hitung total stok dari safeVariants
  const calculateTotalStock = () => {
    return safeVariants.reduce((total, variant) => {
      const stock = parseInt(variant.stock) || 0;
      return total + stock;
    }, 0);
  };

  const totalStock = calculateTotalStock();

  if (isLoading && !productDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!productDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Produk tidak ditemukan</h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Kembali ke Daftar Produk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins']">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Detail Produk</h1>
            </div>
            <button
              onClick={handleAddVariant}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Variant
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Gambar Produk */}
                <div>
                  {productDetail?.img_url ? (
                    <img
                      src={productDetail?.img_url}
                      alt={productDetail.name}
                      className="w-full h-80 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">Tidak ada gambar</span>
                    </div>
                  )}
                </div>

                {/* Detail Produk */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{productDetail.name}</h1>
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-3xl font-bold text-blue-600">
                        Rp {Number(productDetail.price).toLocaleString()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          productDetail.availability
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {productDetail.availability ? "Tersedia" : "Habis"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Kategori</label>
                      <p className="text-gray-900 font-medium">
                        {productDetail.category?.name || `ID: ${productDetail.category_id}`}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                      <p className="text-gray-700 mt-1 leading-relaxed">
                        {productDetail.description || "Tidak ada deskripsi"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Stok Total</label>
                      <p className="text-gray-900 font-medium text-lg">
                        {productDetail?.stock} unit
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Variants List - PERBAIKAN: Gunakan safeVariants bukan productDetail.variant */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Daftar Variant</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {productDetail.variant?.length} variant
                </span>
              </div>

              {productDetail.variant?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada variant</h3>
                  <p className="text-gray-500 mb-4">Tambahkan variant pertama untuk produk ini</p>
                  <button
                    onClick={handleAddVariant}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    Tambah Variant
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {productDetail.variant?.map((variant) => (
                    <div
                      key={variant.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Variant Image */}
                        <div className="flex-shrink-0">
                          {variant?.img_url ? (
                            <img
                              src={variant?.img_url}
                              alt={variant.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-400">No img</span>
                            </div>
                          )}
                        </div>

                        {/* Variant Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{variant.name}</h3>
                              {variant.sku && (
                                <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
                              )}
                            </div>
                            <span className="text-lg font-bold text-blue-600">
                              Rp {Number(variant.price).toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              parseInt(variant.stock) > 0 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              Stok: {variant.stock}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewVariant(variant)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleEditVariant(variant)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Edit Variant"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleDeleteVariant(variant.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Variant"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Stats */}
          <div className="space-y-6">
            {/* Product Stats */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Produk</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Variant</span>
                  <span className="font-semibold text-blue-600">{productDetail.variant?.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Stok</span>
                  <span className="font-semibold text-green-600">
                    {productDetail?.stock} unit
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-semibold ${
                    productDetail.availability ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {productDetail.availability ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <button
                  onClick={handleAddVariant}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Variant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showVariantForm && (
        <VariantForm
          product={productDetail}
          variant={editingVariant}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
          fetchProductById={fetchProductById}        />
      )}

      {showVariantDetail && (
        <VariantDetail
          variant={showVariantDetail}
          onClose={handleCloseDetail}
          onEdit={() => {
            handleCloseDetail();
            handleEditVariant(showVariantDetail);
          }}
        />
      )}
    </div>
  );
};

export default ProductDetail;