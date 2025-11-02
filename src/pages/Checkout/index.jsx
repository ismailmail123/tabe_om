import React, { useState, useEffect, useRef } from 'react';

const KoperasiBelanja = () => {
  // Data produk
  const [products, setProducts] = useState([
    { id: 1, name: "Sabun Mandi", price: 5000, stock: 50, category: "Kebutuhan Diri", desc: "Sabun batang 70g" },
    { id: 2, name: "Sikat Gigi", price: 7000, stock: 30, category: "Kebutuhan Diri", desc: "Sikat gigi medium" },
    { id: 3, name: "Sampo", price: 12000, stock: 20, category: "Kebutuhan Diri", desc: "Sampo 100ml" },
    { id: 4, name: "Indomie Goreng", price: 3500, stock: 100, category: "Makanan Ringan", desc: "Mie instan" },
    { id: 5, name: "Biskuit", price: 8000, stock: 40, category: "Makanan Ringan", desc: "Biskuit 200g" },
    { id: 6, name: "Pulpen", price: 3000, stock: 60, category: "Alat Tulis", desc: "Pulpen hitam" },
    { id: 7, name: "Kaos Kaki", price: 15000, stock: 15, category: "Pakaian", desc: "Kaos kaki katun" },
    { id: 8, name: "Masker", price: 2000, stock: 200, category: "Kebutuhan Diri", desc: "Masker medis" },
    { id: 9, name: "Permen", price: 2000, stock: 80, category: "Makanan Ringan", desc: "Permen kecil" }
  ]);

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: '',
    wbpName: '',
    roomNumber: '',
    phone: '',
    paymentMethod: 'transfer',
    note: ''
  });

  const modalRef = useRef(null);

  // Utility functions
  const formatRupiah = (n) => {
    return 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const uniqueCategories = () => {
    const categories = new Set(products.map(p => p.category));
    return [...categories];
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Cart calculations
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Cart functions
  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === productId);
      
      if (existingItem) {
        if (existingItem.qty + 1 > product.stock) {
          alert('Stok tidak cukup');
          return currentCart;
        }
        return currentCart.map(item =>
          item.id === productId ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...currentCart, { ...product, qty: 1 }];
      }
    });
  };

  const updateQuantity = (productId, change) => {
    setCart(currentCart => {
      const item = currentCart.find(i => i.id === productId);
      if (!item) return currentCart;

      const product = products.find(p => p.id === productId);
      const newQty = item.qty + change;

      if (newQty < 1) return currentCart;
      if (newQty > product.stock) {
        alert('Stok tidak cukup');
        return currentCart;
      }

      return currentCart.map(i =>
        i.id === productId ? { ...i, qty: newQty } : i
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  // Modal functions
  const handleOpenModal = () => {
    if (cart.length === 0) {
      alert('Keranjang kosong');
      return;
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    // Create order object
    const order = {
      id: 'ORD' + Date.now(),
      ...formData,
      items: cart.map(item => ({ name: item.name, price: item.price, qty: item.qty })),
      createdAt: new Date(),
      total: cartTotal
    };

    // In production: Send order to server via API
    console.log('Order created:', order);

    // Print receipt
    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Struk Koperasi Rutan</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 300px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 10px; }
          .line { border-top: 1px dashed #ccc; margin: 10px 0; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { font-weight: bold; margin-top: 10px; }
          .footer { text-align: center; margin-top: 15px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h3>KOPERASI RUTAN</h3>
          <div>${new Date(order.createdAt).toLocaleString('id-ID')}</div>
        </div>
        <div class="line"></div>
        <div><strong>Untuk WBP:</strong> ${order.wbpName}</div>
        <div><strong>Kamar:</strong> ${order.roomNumber}</div>
        <div><strong>Dari:</strong> ${order.buyerName}</div>
        <div class="line"></div>
        ${order.items.map(item => `
          <div class="item">
            <div>${item.qty}x ${item.name}</div>
            <div>${formatRupiah(item.qty * item.price)}</div>
          </div>
        `).join('')}
        <div class="line"></div>
        <div class="item total">
          <div>Total</div>
          <div>${formatRupiah(order.total)}</div>
        </div>
        <div style="margin-top: 8px; font-size: 12px;">
          Metode: ${order.paymentMethod.replace('-', ' ')}
        </div>
        ${order.note ? `<div style="margin-top: 6px; font-size: 12px;">Catatan: ${order.note}</div>` : ''}
        <div class="line"></div>
        <div class="footer">
          Bukti pembelian — tunjukkan ke kasir untuk verifikasi & ambil barang
        </div>
      </body>
      </html>
    `);
    
    receiptWindow.document.close();
    receiptWindow.print();

    // Reset cart and form
    setCart([]);
    setFormData({
      buyerName: '',
      wbpName: '',
      roomNumber: '',
      phone: '',
      paymentMethod: 'transfer',
      note: ''
    });
    setShowModal(false);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-transparent py-7 px-4 md:px-8 font-['Poppins']">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        
        {/* Header */}
        <header className="col-span-1 lg:col-span-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              T
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TabeOM</h1>
              <p className="text-gray-600 text-sm">Belanja untuk keluarga WBP</p>
            </div>
          </div>
          <div className="text-gray-600 text-sm">
            Buka: <strong>08:00 - 15:00</strong>
          </div>
        </header>

        {/* Catalog Section */}
        <section className="bg-white rounded-xl p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Daftar Produk</h2>
            <div className="text-gray-600 text-sm">Pilih & tambahkan ke keranjang</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="search"
              placeholder="Cari produk (mis. sabun, rokok—jika diperbolehkan)"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {uniqueCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                Produk tidak ditemukan
              </div>
            ) : (
              filteredProducts.map(product => (
                <div key={product.id} className="bg-gradient-to-b from-white to-blue-50 rounded-xl p-4 border border-blue-100 flex flex-col hover:shadow-md transition-shadow">
                  <div className="w-full h-32 bg-blue-50 rounded-lg flex items-center justify-center font-semibold text-gray-500 mb-3">
                    {product.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{product.desc}</p>
                  </div>
                  <div className="mt-2">
                    <div className="font-bold text-blue-600 text-lg">{formatRupiah(product.price)}</div>
                    <div className="text-gray-500 text-xs">Stok: {product.stock}</div>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-medium transition-colors"
                    >
                      Tambah ke Keranjang
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Cart Section */}
        <aside className="bg-white rounded-xl p-5 shadow-lg sticky top-7 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Keranjang</h2>
          <div className="text-gray-600 text-sm mb-4">
            Items: <span className="font-semibold">{cartCount}</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 mb-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Keranjang kosong
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-gray-600 text-xs">
                      {formatRupiah(item.price)} • Subtotal: <strong>{formatRupiah(item.qty * item.price)}</strong>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="min-w-6 text-center font-medium">{item.qty}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-gray-600 text-sm">Subtotal</div>
                <div className="font-bold text-gray-900 text-xl">{formatRupiah(cartTotal)}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-600 text-sm">Metode</div>
                <div className="text-gray-600 text-sm">Transfer / QRIS / Bayar di kasir</div>
              </div>
            </div>

            <button
              onClick={handleOpenModal}
              disabled={cart.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 px-4 rounded-xl font-bold transition-all disabled:cursor-not-allowed"
            >
              Checkout & Bayar
            </button>
            
            <div className="text-gray-600 text-xs mt-3 text-center">
              Setelah checkout, pesanan akan muncul di dashboard kasir untuk diproses dan dicetak struk.
            </div>
          </div>
        </aside>
      </div>

      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            ref={modalRef}
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Form Checkout</h3>
              
              <form onSubmit={handleSubmitOrder}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Nama Pengirim (Keluarga)</label>
                    <input
                      type="text"
                      name="buyerName"
                      required
                      placeholder="Contoh: Ibu Siti"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.buyerName}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Nama WBP</label>
                    <input
                      type="text"
                      name="wbpName"
                      required
                      placeholder="Contoh: Andi Pratama"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.wbpName}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Kamar / Blok</label>
                    <input
                      type="text"
                      name="roomNumber"
                      required
                      placeholder="Contoh: Blok B-12"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.roomNumber}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">No. HP (opsional)</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="0812xxxx (opsional)"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.phone}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-600 text-sm mb-2">Metode Pembayaran</label>
                  <select
                    name="paymentMethod"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.paymentMethod}
                    onChange={handleFormChange}
                  >
                    <option value="transfer">Transfer Bank</option>
                    <option value="qris">QRIS</option>
                    <option value="bayar-di-kasir">Bayar di kasir</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-600 text-sm mb-2">Catatan (opsional)</label>
                  <textarea
                    name="note"
                    rows="3"
                    placeholder="Catatan untuk kasir, mis. jangan bungkus plastik"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    value={formData.note}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
                  <div className="text-gray-600 text-sm">
                    Total yang dibayar: <strong className="text-lg text-gray-900">{formatRupiah(cartTotal)}</strong>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Konfirmasi & Buat Pesanan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KoperasiBelanja;