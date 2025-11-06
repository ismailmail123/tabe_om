import React from 'react';
import { useNavigate } from 'react-router-dom';

const KoperasiRutan = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 bg-white shadow-sm py-4 px-4 md:px-20 flex justify-between items-center">
        <div
          onClick={() => navigate('/')}
          className="font-bold text-xl text-blue-700 cursor-pointer select-none"
        >
          TabeOM
        </div>
        <ul className="flex space-x-6 items-center">
          <li>
          </li>
          <li>
          </li>
          <li>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Login
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[85vh] bg-gradient-to-br from-blue-50 to-white py-16 px-4 md:px-20 flex flex-col lg:flex-row items-center justify-between">
        <div className="flex-1 max-w-2xl mb-8 lg:mb-0 lg:pr-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-800 leading-tight mb-6">
            Bantu Keluarga WBP Lebih Mudah
          </h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Melalui website Koperasi Rutan, Anda dapat dengan mudah membelikan
            kebutuhan untuk keluarga WBP tanpa harus datang langsung. Pesan barang,
            lakukan pembayaran online, dan koperasi akan menyerahkan barang langsung
            ke penerima beserta bukti pembelian.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            Mulai Pesan Sekarang
          </button>
        </div>
        <div className="flex-1 flex justify-center lg:justify-end">
          <img
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80"
            alt="Koperasi Rutan"
            className="w-full max-w-md rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Location Section */}
      <section className="py-12 px-4 md:px-20 bg-white text-center" id="lokasi">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-6 flex items-center justify-center">
          <svg
            className="w-8 h-8 mr-3 text-blue-700"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
          </svg>
          Lokasi Koperasi
        </h2>
        <p className="text-gray-700 text-lg max-w-4xl mx-auto">
          Rutan Kelas IIB Bantaeng, Jalan Mawar No. 9, Kelurahan Pallantikan, Kecamatan Bantaeng, Kabupaten Bantaeng
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6 text-center mt-8">
        <p className="text-sm md:text-base">
          © 2025 Koperasi Rutan. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default KoperasiRutan;