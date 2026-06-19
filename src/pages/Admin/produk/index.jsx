import React, { useState, useEffect } from "react";
import useProductStore from "../../../stores/useProductStore";
import useCategoryStore from "../../../stores/useCategoryStore";
import useVariantStore from "../../../stores/useVariantStore";
import { useNavigate } from "react-router-dom";

const Produk = () => {
  const {
    products,
    isLoading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductAvailability,
  } = useProductStore();

  const { categories, fetchCategories } = useCategoryStore();
  const { fetchVariantsByProductId } = useVariantStore();

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    category_id: "",
    description: "",
    image: null,
  });

  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceSyncing, setPriceSyncing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const formatRupiah = (n) => {
    const angka = Math.floor(Number(n) || 0);
    return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category_id) {
      alert("Nama, harga, dan kategori wajib diisi!");
      return;
    }
    try {
      const productData = { ...formData, image: imageFile };
      if (editing) {
        await updateProduct(formData.id, productData);
      } else {
        await createProduct(productData);
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  // PERBAIKAN: handleEdit sekarang otomatis mengisi harga dari variant termurah
  // (jika produk punya variant), tapi tetap bisa diedit manual oleh admin.
  // Kalau produk belum punya variant sama sekali, harga produk yang tersimpan tetap dipakai.
  const handleEdit = async (product) => {
    // 1. Buka form dengan harga produk yang tersimpan dulu (fallback default)
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      category_id: product.category_id?.toString() || "",
      description: product.description || "",
      image: product.img_url,
    });
    setPreview(product.img_url || null);
    setImageFile(null);
    setEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 2. Ambil data variant produk ini, lalu sinkronkan harga ke variant termurah
    setPriceSyncing(true);
    try {
      await fetchVariantsByProductId(product.id);
      // Ambil langsung dari store (bukan dari closure hook) supaya datanya pasti yang terbaru
      const productVariants = useVariantStore.getState().variants;

      if (Array.isArray(productVariants) && productVariants.length > 0) {
        const cheapestVariant = productVariants.reduce((cheapest, current) =>
          Number(current.price) < Number(cheapest.price) ? current : cheapest
        );

        setFormData((prev) => ({
          ...prev,
          price: cheapestVariant.price.toString(),
        }));
      }
      // Kalau productVariants kosong, harga produk yang tersimpan (sudah di-set di langkah 1) tetap dipakai.
    } catch (error) {
      console.error("Gagal mengambil variant untuk auto-fill harga:", error);
      // Fallback aman: harga produk yang tersimpan tetap dipakai, tidak mengubah apa pun.
    } finally {
      setPriceSyncing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      setDeletingId(id);
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleToggleAvailability = async (productId, currentAvailability) => {
    try {
      await updateProductAvailability(productId, currentAvailability);
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const resetForm = () => {
    setFormData({ id: null, name: "", price: "", category_id: "", description: "", image: null });
    setPreview(null);
    setImageFile(null);
    setEditing(false);
    setShowForm(false);
    setPriceSyncing(false);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const filteredProducts = (Array.isArray(products) ? products : []).filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-gray-50";

  return (
    <div className="min-h-screen bg-[#F0F4FF] p-4 pb-24 md:p-6 md:pb-6 font-['Poppins']">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#1E2B4A]">Kelola Produk</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {filteredProducts.length} produk terdaftar
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); if (editing) resetForm(); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm
              ${showForm && !editing
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"}`}
          >
            {showForm && !editing ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Tutup Form
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Produk
              </>
            )}
          </button>
        </div>

        {/* ── Form Tambah/Edit ── */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${editing ? "bg-amber-400" : "bg-blue-500"}`} />
              <h2 className="font-semibold text-[#1E2B4A] text-sm">
                {editing ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Nama Produk <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Contoh: Mie Goreng Spesial"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                    Harga <span className="text-red-400">*</span>
                    {priceSyncing && (
                      <span className="text-[10px] text-blue-500 font-normal flex items-center gap-1">
                        <span className="w-2.5 h-2.5 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin inline-block" />
                        menyesuaikan dari variant termurah...
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Contoh: 15000"
                    value={formData.price}
                    onChange={handleChange}
                    className={inputClass}
                    disabled={priceSyncing}
                    required
                  />
                  {editing && !priceSyncing && (
                    <p className="text-[11px] text-gray-400">
                      Harga otomatis disesuaikan dari variant termurah (jika ada), tapi tetap bisa diubah manual.
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Kategori <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      className={inputClass + " appearance-none pr-9 cursor-pointer"}
                      required
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {categories.length === 0 && (
                    <p className="text-[11px] text-amber-500">Belum ada kategori tersedia</p>
                  )}
                </div>

                {/* Image upload */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Foto Produk</label>
                  <label className="flex items-center gap-3 cursor-pointer border border-dashed border-gray-300 rounded-xl px-4 py-2.5 hover:border-blue-400 hover:bg-blue-50/30 transition group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-sm text-gray-500 group-hover:text-blue-600 transition truncate">
                      {imageFile ? imageFile.name : "Klik untuk upload gambar"}
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Deskripsi</label>
                <textarea
                  name="description"
                  placeholder="Tulis deskripsi produk..."
                  value={formData.description}
                  onChange={handleChange}
                  className={inputClass}
                  rows={3}
                />
              </div>

              {/* Preview */}
              {preview && (
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{imageFile?.name || "Foto saat ini"}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Preview foto produk</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setPreview(null); setImageFile(null); }}
                    className="w-7 h-7 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-gray-400 transition flex-shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isLoading || priceSyncing}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
                >
                  {isLoading ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Tambah Produk"}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-xl transition"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ── Product list ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* List header */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 className="font-semibold text-[#1E2B4A] text-sm flex-1">Daftar Produk</h2>
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                type="search"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 w-full sm:w-52 transition"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-10 text-center">
              <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-400">Memuat produk...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500">
                {searchTerm ? "Produk tidak ditemukan" : "Belum ada produk"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {searchTerm ? "Coba kata kunci lain" : "Tambah produk pertama kamu"}
              </p>
            </div>
          ) : (
            <>
              {/* ── Desktop table (md+) ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Foto</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-5 py-3">
                          {product.img_url ? (
                            <img
                              src={product.img_url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-xl border border-gray-100"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <p className="font-semibold text-[#1E2B4A] leading-tight">{product.name}</p>
                          {product.description && (
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.description}</p>
                          )}
                        </td>
                        <td className="px-5 py-3 font-bold text-blue-600">{formatRupiah(product.price)}</td>
                        <td className="px-5 py-3">
                          <span className="inline-block bg-blue-50 text-blue-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                            {product.category?.name || `Kategori ${product.category_id}`}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => handleToggleAvailability(product.id, !product.availability)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                              ${product.availability
                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                : "bg-red-50 text-red-500 hover:bg-red-100"}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full inline-block ${product.availability ? "bg-emerald-500" : "bg-red-400"}`} />
                            {product.availability ? "Tersedia" : "Habis"}
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/dashboard/produk/${product.id}`)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                              title="Detail"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={deletingId === product.id}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition disabled:opacity-50"
                              title="Hapus"
                            >
                              {deletingId === product.id ? (
                                <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile cards (< md) ── */}
              <div className="md:hidden divide-y divide-gray-50">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-4 flex gap-3">
                    {/* Thumb */}
                    {product.img_url ? (
                      <img
                        src={product.img_url}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-[#1E2B4A] text-sm leading-tight line-clamp-2">{product.name}</p>
                        <button
                          onClick={() => handleToggleAvailability(product.id, !product.availability)}
                          className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition
                            ${product.availability
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${product.availability ? "bg-emerald-500" : "bg-red-400"}`} />
                          {product.availability ? "Tersedia" : "Habis"}
                        </button>
                      </div>

                      <p className="text-blue-600 font-bold text-sm mt-1">{formatRupiah(product.price)}</p>

                      <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1">
                        {product.category?.name || `Kategori ${product.category_id}`}
                      </span>

                      {/* Mobile action buttons */}
                      <div className="flex gap-2 mt-2.5">
                        <button
                          onClick={() => navigate(`/dashboard/produk/${product.id}`)}
                          className="flex-1 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 py-1.5 rounded-lg bg-amber-50 text-amber-600 text-xs font-semibold hover:bg-amber-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="flex-1 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50"
                        >
                          {deletingId === product.id ? "..." : "Hapus"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Produk;