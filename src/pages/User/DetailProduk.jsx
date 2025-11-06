import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DetailProduk = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products] = useState([
    { id: 1, name: "Sabun Mandi", price: 5000, stock: 50, category: "Kebutuhan Diri", desc: "Sabun batang 70g" },
    { id: 2, name: "Sikat Gigi", price: 7000, stock: 30, category: "Kebutuhan Diri", desc: "Sikat gigi medium" },
    { id: 3, name: "Sampo", price: 12000, stock: 20, category: "Kebutuhan Diri", desc: "Sampo 100ml" },
    { id: 4, name: "Indomie Goreng", price: 3500, stock: 100, category: "Makanan Ringan", desc: "Mie instan" },
    { id: 5, name: "Biskuit", price: 8000, stock: 40, category: "Makanan Ringan", desc: "Biskuit 200g" },
    { id: 6, name: "Pulpen", price: 3000, stock: 60, category: "Alat Tulis", desc: "Pulpen hitam" },
    { id: 7, name: "Kaos Kaki", price: 15000, stock: 15, category: "Pakaian", desc: "Kaos kaki katun" },
    { id: 8, name: "Masker", price: 2000, stock: 200, category: "Kebutuhan Diri", desc: "Masker medis" },
    { id: 9, name: "Permen", price: 2000, stock: 80, category: "Makanan Ringan", desc: "Permen kecil" },
  ]);

  const product = products.find((p) => p.id === parseInt(id));
  const formatRupiah = (n) => "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Produk tidak ditemukan</h2>
        <button onClick={() => navigate("/user/belanja")} className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg">
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  // Produk lain untuk ditampilkan di bawah
  const rekomendasi = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-blue-50/40 py-10 px-4 font-['Poppins']">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* Detail produk */}
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-4">
          ← Kembali
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-100 rounded-lg h-64 flex items-center justify-center text-5xl font-bold text-blue-500">
            {product.name.split(" ").map((w) => w[0]).join("")}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-3">{product.desc}</p>
            <div className="text-blue-600 text-2xl font-semibold mb-2">{formatRupiah(product.price)}</div>
            <p className="text-sm text-gray-500 mb-4">Stok: {product.stock}</p>
            <button
  onClick={() => {
    // Ambil cart dari localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 }); 
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.name} telah ditambahkan ke keranjang!`);
  }}
  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
>
  Tambah ke Keranjang
</button>
          </div>
        </div>
      </div>

      {/* Rekomendasi */}
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Produk Lainnya</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {rekomendasi.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/user/produk/${item.id}`)}
              className="bg-white border border-gray-100 rounded-lg p-3 cursor-pointer hover:shadow-md transition"
            >
              <div className="bg-blue-50 rounded-md h-20 flex items-center justify-center text-blue-500 font-bold">
                {item.name.split(" ").map((w) => w[0]).join("")}
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mt-2">{item.name}</h3>
              <p className="text-blue-600 text-sm">{formatRupiah(item.price)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailProduk;
