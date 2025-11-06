import React, { useState, useEffect } from "react"

const Produk = () => {
  const [produkList, setProdukList] = useState([])
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    category: "",
    desc: "",
    image: "", // 🖼️ Tambah field foto
  })
  const [editing, setEditing] = useState(false)
  const [preview, setPreview] = useState(null) // untuk menampilkan pratinjau foto

  // 🔄 Load produk dari localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products")) || []
    setProdukList(stored)
  }, [])

  // 💾 Simpan ke localStorage
  const saveToStorage = (data) => {
    localStorage.setItem("products", JSON.stringify(data))
    setProdukList(data)
  }

  // 🧾 Input handler
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // 📸 Upload Foto Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result })
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // ➕ Tambah / Simpan produk baru
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.stock) {
      alert("Nama, harga, dan stok wajib diisi!")
      return
    }

    let updatedList

    if (editing) {
      updatedList = produkList.map((p) =>
        p.id === formData.id ? formData : p
      )
      setEditing(false)
    } else {
      const newProduct = { ...formData, id: Date.now() }
      updatedList = [...produkList, newProduct]
    }

    saveToStorage(updatedList)
    setFormData({
      id: null,
      name: "",
      price: "",
      stock: "",
      category: "",
      desc: "",
      image: "",
    })
    setPreview(null)
  }

  // ✏️ Edit produk
  const handleEdit = (product) => {
    setFormData(product)
    setPreview(product.image || null)
    setEditing(true)
  }

  // 🗑️ Hapus produk
  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      const updated = produkList.filter((p) => p.id !== id)
      saveToStorage(updated)
    }
  }

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
          />
          <input
            type="number"
            name="price"
            placeholder="Harga"
            value={formData.price}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stok"
            value={formData.stock}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="text"
            name="category"
            placeholder="Kategori (contoh: Makanan Ringan)"
            value={formData.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <textarea
          name="desc"
          placeholder="Deskripsi produk"
          value={formData.desc}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-4"
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

        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg"
        >
          {editing ? "Simpan Perubahan" : "Tambah Produk"}
        </button>
      </form>

      {/* 📦 Daftar Produk */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Daftar Produk</h2>
        {produkList.length === 0 ? (
          <p className="text-gray-500">Belum ada produk</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="p-3 border">Foto</th>
                <th className="p-3 border">Nama</th>
                <th className="p-3 border">Harga</th>
                <th className="p-3 border">Stok</th>
                <th className="p-3 border">Kategori</th>
                <th className="p-3 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {produkList.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50">
                  <td className="p-3 border text-center">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-lg mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Tidak ada foto</span>
                    )}
                  </td>
                  <td className="p-3 border">{p.name}</td>
                  <td className="p-3 border">Rp {Number(p.price).toLocaleString()}</td>
                  <td className="p-3 border">{p.stock}</td>
                  <td className="p-3 border">{p.category}</td>
                  <td className="p-3 border space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Produk
