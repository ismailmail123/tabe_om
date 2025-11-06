import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"

// 🧩 Admin pages
import AdminLayout from "../pages/Admin/Layout"
import Dashboard from "../pages/Admin/Dashboard"
import Produk from "../pages/Admin/Produk"
import Transaksi from "../pages/Admin/Transaksi"

// 👤 User pages
import UserLayout from "../pages/User/Layout"
import Belanja from "../pages/User/Belanja"
import Keranjang from "../pages/User/Keranjang"
import History from "../pages/User/History"
import Pembayaran from "../pages/User/Pembayaran"
import DetailProduk from "../pages/User/DetailProduk"

import { isLoggedIn, getRole } from "../utils/auth"

// 🔐 Proteksi halaman sesuai role
const ProtectedRoute = ({ children, role }) => {
  if (!isLoggedIn() || getRole() !== role) {
    return <Navigate to="/login" replace />
  }
  return children
}

const RoutesIndex = () => {
  return (
    <Routes>
      {/* 🌐 Halaman umum */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

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
  )
}

export default RoutesIndex
