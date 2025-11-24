import React, { useEffect, useState } from "react";
import { Package, ShoppingCart, Users, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import useProductStore from "../../stores/useProductStore";
import useOrderStore from "../../stores/useOrderStore";
import useAuthStore from "../../stores/useAuthStore";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalTransactions: 0,
    totalWBP: 0,
  });

  const [loading, setLoading] = useState({
    products: false,
    orders: false,
    users: false,
    wallet: false
  });

  const { fetchProducts, products } = useProductStore();
  const { fetchOrder, orders } = useOrderStore();
  const { fetchUsers, userLists } = useAuthStore();

  // Status colors untuk pie chart
  const statusColors = {
    completed: "#10B981",
    cancelled: "#EF4444",
    pending: "#F59E0B",
    process: "#3B82F6",
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // useEffect(() => {
  //   fetchOrder();
  // }, [fetchOrder]);

  // console.log("Orders in dashboard:", orders);

  const loadAllData = async () => {
    try {
      setLoading({ products: true, orders: true, users: true, wallet: true });
      
      await Promise.all([
        fetchProducts(),
        fetchOrder(),
        fetchUsers(),
      ]);

      // Hitung total user unik (WBP) - disesuaikan dengan struktur data yang ada
      const uniqueUsers = new Set();
      orders.forEach((order) => {
        if (order.user_id) {
          uniqueUsers.add(order.user_id);
        }
      });

      setSummary({
        totalProducts: products.length,
        totalTransactions: orders.length,
        totalWBP: uniqueUsers.size,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading({ products: false, orders: false, users: false, wallet: false });
    }
  };

  console.log("Orders data:", orders);

  // Fungsi untuk menghitung order hari ini
  const getTodayOrders = () => {
    const today = new Date().toISOString().split('T')[0];
    return orders?.filter(order => {
      if (!order.created_at) return false;
      const orderDate = new Date(order.created_at).toISOString().split('T')[0];
      return orderDate === today;
    }).length;
  };

  // Fungsi untuk menghitung order minggu ini
  const getWeeklyOrders = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    return orders?.filter(order => {
      if (!order.created_at) return false;
      const orderDate = new Date(order.created_at);
      return orderDate >= startOfWeek && orderDate <= endOfWeek;
    }).length;
  };

  // Hitung progress
  const todayOrders = getTodayOrders();
  const weeklyOrders = getWeeklyOrders();
  const targetToday = 50;
  const targetWeekly = 200;
  const progressToday = (todayOrders / targetToday) * 100;
  const progressWeekly = (weeklyOrders / targetWeekly) * 100;

  // Data untuk pie chart - distribusi status order
  const statusDistribution = orders?.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object?.keys(statusDistribution)?.map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: statusDistribution[status],
    color: statusColors[status] || "#6B7280",
  }));

  // Recent orders
  const recentOrders = orders.slice(-5).reverse();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  

  // Reload functions
  const reloadProducts = async () => {
    setLoading(prev => ({ ...prev, products: true }));
    try {
      await fetchProducts();
      setSummary(prev => ({ ...prev, totalProducts: products.length }));
    } catch (error) {
      console.error("Error reloading products:", error);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const reloadOrders = async () => {
    setLoading(prev => ({ ...prev, orders: true }));
    try {
      await fetchOrder();
      setSummary(prev => ({ ...prev, totalTransactions: orders.length }));
    } catch (error) {
      console.error("Error reloading orders:", error);
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Poppins']">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">
          Dashboard Admin
        </h2>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </div>

      {/* Stats Grid - Diperbarui seperti kode kedua */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        {/* Today Orders Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow relative">
          {loading.orders && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-xl z-10">
              <RefreshCw className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
          )}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="text-sm text-gray-500 mb-1">Order Hari Ini</h3>
                <button
                  onClick={reloadOrders}
                  className="ml-2 text-gray-400 hover:text-orange-500"
                  disabled={loading.orders}
                >
                  <RefreshCw className={`w-4 h-4 ${loading.orders ? "animate-spin" : ""}`} />
                </button>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {todayOrders}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span>Target: {targetToday}</span>
              <span className={`flex items-center ${
                progressToday >= 100 ? "text-green-600" : "text-orange-600"
              }`}>
                {progressToday >= 100 ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {Math.min(progressToday, 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                style={{ width: `${Math.min(progressToday, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Weekly Orders Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow relative">
          {loading.orders && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-xl z-10">
              <RefreshCw className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
          )}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="text-sm text-gray-500 mb-1">Order Minggu Ini</h3>
                <button
                  onClick={reloadOrders}
                  className="ml-2 text-gray-400 hover:text-orange-500"
                  disabled={loading.orders}
                >
                  <RefreshCw className={`w-4 h-4 ${loading.orders ? "animate-spin" : ""}`} />
                </button>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {weeklyOrders}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span>Target: {targetWeekly}</span>
              <span className={`flex items-center ${
                progressWeekly >= 100 ? "text-green-600" : "text-orange-600"
              }`}>
                {progressWeekly >= 100 ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {Math.min(progressWeekly, 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                style={{ width: `${Math.min(progressWeekly, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Total Products Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow relative">
          {loading.products && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-xl z-10">
              <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          )}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="text-sm text-gray-500 mb-1">Total Produk</h3>
                <button
                  onClick={reloadProducts}
                  className="ml-2 text-gray-400 hover:text-blue-500"
                  disabled={loading.products}
                >
                  <RefreshCw className={`w-4 h-4 ${loading.products ? "animate-spin" : ""}`} />
                </button>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {summary.totalProducts}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Order Status Distribution */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg relative">
          {loading.orders && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-xl z-10">
              <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Distribusi Status Order
            </h3>
            <button
              onClick={reloadOrders}
              className="flex items-center text-sm text-orange-600 hover:text-orange-800"
              disabled={loading.orders}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading.orders ? "animate-spin" : ""}`} />
              Refresh Data
            </button>
          </div>
          <div className="h-80">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                    }}
                    formatter={(value, name, props) => [
                      `${value} orders`,
                      name,
                    ]}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    formatter={(value, entry, index) => (
                      <span className="text-sm text-gray-600 flex items-center">
                        <span
                          className="inline-block w-3 h-3 mr-2 rounded-full"
                          style={{ backgroundColor: pieData[index].color }}
                        ></span>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                  <p className="text-gray-500">Tidak ada data order</p>
                  <button
                    onClick={reloadOrders}
                    className="mt-2 text-orange-600 hover:text-orange-800 text-sm flex items-center justify-center mx-auto"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Coba lagi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-xl shadow-lg relative">
          {loading.orders && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-xl z-10">
              <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Order Terbaru</h3>
            <button
              onClick={reloadOrders}
              className="flex items-center text-sm text-orange-600 hover:text-orange-800"
              disabled={loading.orders}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading.orders ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.order_id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      Order #{order.order_code || order.order_id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status || 'unknown'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Tidak ada order terbaru
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Ringkasan Transaksi</h3>
          <button
            onClick={reloadOrders}
            className="flex items-center text-sm text-orange-600 hover:text-orange-800"
            disabled={loading.orders}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading.orders ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              Rp.{" "}
              {orders
                .reduce((sum, order) => sum + (order.total || 0), 0)
                .toLocaleString("id-ID")}
            </p>
            <p className="text-sm text-gray-500">Total Pendapatan</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {orders.length}
            </p>
            <p className="text-sm text-gray-500">Total Order</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              Rp.{" "}
              {orders.length > 0
                ? (
                    orders.reduce((sum, order) => sum + (order.total || 0), 0) /
                    orders.length
                  ).toLocaleString("id-ID", { maximumFractionDigits: 0 })
                : "0"}
            </p>
            <p className="text-sm text-gray-500">Rata-rata Nilai Order</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {orders.reduce((sum, order) => sum + (order.items?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0), 0)}
            </p>
            <p className="text-sm text-gray-500">Total Item Terjual</p>
          </div>
        </div>
      </div>
    </div>
  );
}