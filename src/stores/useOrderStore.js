// stores/useOrderStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

const useOrderStore = create((set, get) => ({
    authUser: JSON.parse(localStorage.getItem("authUser")) || null,
    isLoading: false,

    // Fungsi untuk mendapatkan token
    getToken: () => {
        const authUser = JSON.parse(localStorage.getItem("authUser")) || null;
        return authUser.token || null;
    },

    createOrder: async(orderData) => {
        const token = get().getToken();
        if (!token) {
            toast.error("Anda harus login terlebih dahulu");
            throw new Error("User not authenticated");
        }

        try {
            console.log("Creating order with data:", orderData);
            console.log("Using token:", token);

            const response = await axios.post(
                "http://localhost:8001/api/orders",
                orderData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    // HAPUS withCredentials atau set ke false
                    withCredentials: false,
                }
            );

            const responseData = response.data;
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
    fetchOrder: async() => {
        try {
            const token = get().getToken();
            if (!token) {
                console.error("Token not found. Unable to fetch orders.");
                return;
            }

            const response = await axios.get("http://localhost:8001/api/orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: false,
            });
            set({ orders: response.data.data });
        } catch (error) {
            console.error("Fetch orders error:", error);
        }
    },

    fetchOrderById: async(orderId) => {
        const token = get().getToken();
        if (!token) {
            console.error("Token not found. Unable to fetch order.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8001/api/orders/${orderId}`, {
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
        const token = get().getToken();
        if (!token) {
            console.error("Token not found. Unable to cancel order.");
            setError("Token not found. Unable to cancel order.");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8001/api/orders/${orderId}/cancel`,
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