import React, { useState, useEffect } from "react";
import useProductStore from "../../../stores/useProductStore";
import useCategoryStore from "../../../stores/useCategoryStore";
import { useNavigate } from "react-router-dom";

const Produk = () => {
  const {
    products,
    isLoading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductAvailability
  } = useProductStore();

  const {
    categories,
    fetchCategories
  } = useCategoryStore();

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
  const navigate = useNavigate();

  // 🔄 Load produk dan kategori saat komponen mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // 🧾 Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 📸 Upload Foto Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ➕ Tambah / Update produk
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category_id) {
      alert("Nama, harga, dan kategori wajib diisi!");
      return;
    }

    try {
      const productData = {
        ...formData,
        image: imageFile,
      };

      if (editing) {
        await updateProduct(formData.id, productData);
      } else {
        await createProduct(productData);
      }

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  // ✏️ Edit produk
  const handleEdit = (product) => {
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
  };

  // 🗑️ Hapus produk
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // 🔄 Toggle ketersediaan produk
  const handleToggleAvailability = async (productId, currentAvailability) => {
    try {
      await updateProductAvailability(productId, currentAvailability);
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  // 🔄 Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      price: "",
      category_id: "",
      description: "",
      image: null,
    });
    setPreview(null);
    setImageFile(null);
    setEditing(false);
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="p-6 font-['Poppins']">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Kelola Produk</h1>

      {/* 🧾 Form Tambah/Edit */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md mb-8"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nama Produk"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Harga"
            value={formData.price}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
            required
          />
          
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
            required
          >
            <option value="">Pilih Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <div className="flex items-center justify-center">
            {categories.length === 0 && (
              <span className="text-sm text-gray-500">
                {useCategoryStore.getState().isLoading ? "Loading kategori..." : "Tidak ada kategori"}
              </span>
            )}
          </div>
        </div>

        <textarea
          name="description"
          placeholder="Deskripsi produk"
          value={formData.description}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-4"
          rows="3"
        ></textarea>

        {/* 📸 Upload Gambar */}
        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-1">
            Foto Produk
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          />
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border shadow"
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Loading..." : editing ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
          
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-lg"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* 📦 Daftar Produk */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Daftar Produk</h2>
        
        {isLoading ? (
          <p className="text-gray-500">Loading produk...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">Belum ada produk</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 text-left">
                  <th className="p-3 border">Foto</th>
                  <th className="p-3 border">Nama</th>
                  <th className="p-3 border">Harga</th>
                  <th className="p-3 border">Kategori</th>
                  <th className="p-3 border">Ketersediaan</th>
                  <th className="p-3 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50">
                    <td className="p-3 border text-center">
                      {product.img_url ? (
                        <img
                          src={product.img_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg mx-auto"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">Tidak ada foto</span>
                      )}
                    </td>
                    <td className="p-3 border font-medium">{product.name}</td>
                    <td className="p-3 border">Rp {Number(product.price).toLocaleString()}</td>
                    <td className="p-3 border">
                      {product.category?.name || `ID: ${product.category_id}`}
                    </td>
                    <td className="p-3 border">
                      <button
                        onClick={() => handleToggleAvailability(product.id, !product.availability)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          product.availability 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {product.availability ? 'Tersedia' : 'Habis'}
                      </button>
                    </td>
                    {/* <td className="p-3 border space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Hapus
                      </button>
                    </td> */}
<td className="p-3 border space-x-2">
  <button
    onClick={() => navigate(`/dashboard/produk/${product.id}`)}
    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
  >
    Detail
  </button>
  <button
    onClick={() => handleEdit(product)}
    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(product.id)}
    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
  >
    Hapus
  </button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Produk;