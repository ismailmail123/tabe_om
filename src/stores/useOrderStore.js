// stores/useOrderStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../lib/axios";

const useOrderStore = create((set, get) => ({
    authUser: JSON.parse(localStorage.getItem("authUser")) || null,
    isLoading: false,
    orders: [],
    orderById: null,


    createOrder: async(orderData) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Anda harus login terlebih dahulu");
            throw new Error("User not authenticated");
        }

        try {
            console.log("Creating order with data:", orderData);
            console.log("Using token:", token);

            const response = await axiosInstance.post(
                "/orders",
                orderData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    // HAPUS withCredentials atau set ke false
                    withCredentials: false,
                }
            );

            const responseData = response.data.data;
            console.log("Order created successfully:", responseData);

            // Clear selected cart items
            const cartStore = (await
                import ("./useCartStore")).default;
            cartStore.getState().clearSelectedCart();

            toast.success("Order berhasil dibuat!");

            return {
                status: 'success',
                data: responseData,
                message: 'Order created successfully'
            };

        } catch (error) {
            console.error("Order creation error:", error);
            let errorMessage = "Gagal membuat pesanan";

            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
                console.error("Error response:", error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            }

            toast.error(errorMessage);
            throw error;
        }
    },

    // ... fungsi lainnya tetap sama
    // fetchOrder: async() => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         if (!token) {
    //             console.error("Token not found. Unable to fetch orders.");
    //             return;
    //         }

    //         const response = await axiosInstance.get("/orders", {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             withCredentials: false,
    //         });
    //         set({ orders: response.data.data });
    //     } catch (error) {
    //         console.error("Fetch orders error:", error);
    //     }
    // },

    fetchOrder: async() => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token not found. Unable to fetch orders.");
                return [];
            }

            const response = await axiosInstance.get("/orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: false,
            });

            console.log("Orders response:", response.data.data);

            // // Pastikan kita mengembalikan data yang benar
            // if (response.data && response.data.data) {
            //     set({ orders: response.data.data });
            //     return response.data.data;
            // } else {
            //     console.error("Invalid response format:", response.data);
            //     return [];
            // }

            set({ orders: response.data.data });
            return response.data.data;
        } catch (error) {
            console.error("Fetch orders error:", error);
            toast.error("Gagal memuat data transaksi");
            return [];
        }
    },

    // Update order status
    // updateOrderStatus: async(orderId, status) => {
    //     const token = localStorage.getItem("token");
    //     if (!token) {
    //         toast.error("Anda harus login terlebih dahulu");
    //         throw new Error("User not authenticated");
    //     }

    //     try {
    //         const response = await axiosInstance.put(
    //             `/orders/${orderId}/status`, { status }, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                     "Content-Type": "application/json",
    //                 },
    //                 withCredentials: false,
    //             }
    //         );

    //         toast.success("Status order berhasil diperbarui");
    //         return response.data;
    //     } catch (error) {
    //         console.error("Update order status error:", error);
    //         let errorMessage = "Gagal memperbarui status order";

    //         if (error.response) {
    //             errorMessage = error.response.data.message || errorMessage;
    //         }

    //         toast.error(errorMessage);
    //         throw error;
    //     }
    // },
    updateOrderStatus: async(orderId, status, formData = null) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Anda harus login terlebih dahulu");
            throw new Error("User not authenticated");
        }

        try {
            let requestData;
            let headers = {
                Authorization: `Bearer ${token}`,
            };

            if (formData instanceof FormData) {
                // Jika menggunakan FormData (untuk upload file)
                requestData = formData;
                // Jangan set Content-Type untuk FormData, biarkan browser set otomatis
            } else {
                // Jika hanya update status tanpa file
                requestData = { status };
                headers["Content-Type"] = "application/json";
            }

            console.log("Sending update request for order:", orderId);
            console.log("Request data:", requestData);

            const response = await axiosInstance.put(
                `/orders/${orderId}/status`,
                requestData, {
                    headers: headers,
                    withCredentials: false,
                }
            );

            console.log("Update response:", response.data);
            toast.success("Status order berhasil diperbarui");
            return response.data;
        } catch (error) {
            console.error("Update order status error:", error);
            let errorMessage = "Gagal memperbarui status order";

            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
                console.error("Error response:", error.response.data);
            }

            toast.error(errorMessage);
            throw error;
        }
    },

    fetchOrderById: async(orderId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found. Unable to fetch order.");
            return;
        }

        try {
            const response = await axiosInstance.get(`/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: false,
            });
            set({ orderById: response.data.data || [] });
        } catch (error) {
            console.error("Fetch order error:", error);
            throw error;
        }
    },

    setOrders: (orders) => set({ orders }),

    cancelOrder: async(orderId, setError) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found. Unable to cancel order.");
            setError("Token not found. Unable to cancel order.");
            return;
        }

        try {
            const response = await axiosInstance.put(
                `/orders/${orderId}/cancel`,
                null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: false,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Cancel order error:", error);
            if (error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to cancel order. Please try again.");
            }
            throw error;
        }
    },
}));

export default useOrderStore;