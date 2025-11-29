import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";

// 🧩 Admin pages
import AdminLayout from "../pages/Admin/Layout";
import Dashboard from "../pages/Admin/Dashboard";
import Produk from "../pages/Admin/produk";
import Transaksi from "../pages/Admin/transaksi/Transaksi";

// 👤 User pages
import UserLayout from "../pages/User/Layout";
import Belanja from "../pages/User/Belanja";
import Keranjang from "../pages/User/Keranjang";
import History from "../pages/User/History";
import Pembayaran from "../pages/User/Pembayaran";
import DetailProduk from "../pages/User/DetailProduk";
import DetailProdukAdmin from "../pages/Admin/produk/detailProduk";
import CategoryForm from "../pages/Admin/manajement/AddCategory";
import CategoryDetail from "../pages/Admin/manajement/DetailCategory";
import CategoryList from "../pages/Admin/manajement/CategoryList";
import UserManajement from "../pages/Admin/manajement/UserManajement";
import AuthCallback from "../pages/Login/AuthCallback";

import { isLoggedIn, getRole } from "../utils/auth";

// 🔐 Proteksi halaman sesuai role
const ProtectedRoute = ({ children, role }) => {
  console.log("ProtectedRoute check for role:", role);
  if (!isLoggedIn() || getRole() !== role) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RoutesIndex = () => {
  
  return (
    
    <Routes>
      {/* 🌐 Halaman umum */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* 👨‍💼 Halaman Admin */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* default redirect ke home dashboard */}
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Dashboard />} />
        <Route path="produk" element={<Produk />} />
        <Route path="transaksi" element={<Transaksi />} />
        <Route path="produk/:id" element={<DetailProdukAdmin />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/add" element={<CategoryForm />} />
        <Route path="categories/edit/:id" element={<CategoryForm />} />
        <Route path="categories/:id" element={<CategoryDetail />} />
        <Route path="user-manajemen" element={<UserManajement />} />
      </Route>

      {/* 👤 Halaman User */}
      <Route
        path="/user"
        element={
          <ProtectedRoute role="user">
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="belanja" replace />} />
        <Route path="belanja" element={<Belanja />} />
        <Route path="keranjang" element={<Keranjang />} />
        <Route path="pembayaran" element={<Pembayaran />} />
        <Route path="history" element={<History />} />
        <Route path="produk/:id" element={<DetailProduk />} />
      </Route>

      {/* 🚫 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default RoutesIndex;
