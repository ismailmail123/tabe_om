// // stores/usePaymentStore.js
// import { create } from "zustand";
// import toast from "react-hot-toast";
// import axiosInstance from "../lib/axios";

// const usePaymentStore = create((set, get) => ({
//     authUser: JSON.parse(localStorage.getItem("authUser")) || null,
//     isLoading: false,
//     payments: [],
//     paymentById: null,

//     // Fetch all payments
//     fetchPayments: async() => {
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 console.error("Token not found. Unable to fetch payments.");
//                 return [];
//             }

//             set({ isLoading: true });

//             const response = await axiosInstance.get("/payments", {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 withCredentials: false,
//             });

//             console.log("Payments response:", response.data.data);

//             set({ payments: response.data.data || [] });
//             return response.data.data;
//         } catch (error) {
//             console.error("Fetch payments error:", error);
//             toast.error("Gagal memuat data pembayaran");
//             return [];
//         } finally {
//             set({ isLoading: false });
//         }
//     },

//     // Create payment
//     createPayment: async(orderId, paymentData) => {
//         const token = localStorage.getItem("token");
//         if (!token) {
//             toast.error("Anda harus login terlebih dahulu");
//             throw new Error("User not authenticated");
//         }

//         try {
//             set({ isLoading: true });
//             console.log("Creating payment for order:", orderId);
//             console.log("Payment data:", paymentData);
//             // Validasi orderId
//             if (!orderId) {
//                 toast.error("Order ID tidak valid");
//                 throw new Error("Invalid order ID");
//             }

//             const response = await axiosInstance.post(
//                 `/payments/${orderId}/payment-by-order`,
//                 paymentData, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                     withCredentials: false,
//                 }
//             );

//             const responseData = response.data;
//             console.log("Payment created successfully:", responseData);

//             // If it's transfer payment, redirect to Midtrans
//             if (paymentData.payment_method === 'transfer' && responseData.payment_url) {
//                 // Redirect to Midtrans payment page
//                 window.location.href = responseData.payment_url;
//             }

//             toast.success(
//                 paymentData.payment_method === 'COD' ?
//                 "Pembayaran COD berhasil diproses" :
//                 "Silakan lanjutkan pembayaran"
//             );

//             return {
//                 status: 'success',
//                 data: responseData,
//                 message: responseData.message
//             };

//         } catch (error) {
//             console.error("Payment creation error:", error);
//             let errorMessage = "Gagal memproses pembayaran";

//             if (error.response) {
//                 errorMessage = error.response.data.message || errorMessage;
//                 console.error("Error response:", error.response.data);
//             } else if (error.request) {
//                 console.error("No response received:", error.request);
//             }

//             toast.error(errorMessage);
//             throw error;
//         } finally {
//             set({ isLoading: false });
//         }
//     },

//     // Update payment status
//     // updatePaymentStatus: async(orderId, formData) => {
//     //     const token = localStorage.getItem("token");
//     //     if (!token) {
//     //         toast.error("Anda harus login terlebih dahulu");
//     //         throw new Error("User not authenticated");
//     //     }

//     //     try {
//     //         set({ isLoading: true });

//     //         const response = await axiosInstance.put(
//     //             `/payments/${orderId}/status`,
//     //             formData, // Menggunakan formData yang berisi payment_status dan file
//     //             {
//     //                 headers: {
//     //                     Authorization: `Bearer ${token}`,
//     //                     "Content-Type": "multipart/form-data", // Penting untuk upload file
//     //                 },
//     //                 withCredentials: false,
//     //             }
//     //         );

//     //         console.log("Payment status updated:", response.data);

//     //         // Update local state - refresh data order
//     //         await get().fetchOrder(); // Refresh data order

//     //         toast.success("Status pembayaran berhasil diperbarui");
//     //         return response.data;
//     //     } catch (error) {
//     //         console.error("Update payment status error:", error);
//     //         let errorMessage = "Gagal memperbarui status pembayaran";

//     //         if (error.response) {
//     //             errorMessage = error.response.data.message || errorMessage;
//     //             console.error("Error response:", error.response.data);
//     //         }

//     //         toast.error(errorMessage);
//     //         throw error;
//     //     } finally {
//     //         set({ isLoading: false });
//     //     }
//     // },
//     updatePaymentStatus: async(orderId, formData) => {
//         console.log("updatePaymentStatus called with orderId:", orderId);
//         const token = localStorage.getItem("token");
//         if (!token) {
//             toast.error("Anda harus login terlebih dahulu");
//             throw new Error("User not authenticated");
//         }

//         try {
//             set({ isLoading: true });

//             // Pastikan orderId tidak undefined
//             if (!orderId) {
//                 toast.error("Order ID tidak valid");
//                 throw new Error("Order ID is required");
//             }

//             // Log untuk debugging
//             console.log("Updating payment for order_id:", orderId);
//             console.log("FormData content:", {
//                 payment_status: formData.get('payment_status'),
//                 has_file: formData.has('proof_of_payment')
//             });

//             const response = await axiosInstance.put(
//                 `/payments/${orderId}/status`, // orderId dari parameter
//                 formData, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "multipart/form-data",
//                     },
//                     withCredentials: false,
//                 }
//             );

//             console.log("Payment status updated successfully:", response.data);



//             toast.success("Status pembayaran berhasil diperbarui");
//             return response.data;
//         } catch (error) {
//             console.error("Update payment status error:", error);
//             let errorMessage = "Gagal memperbarui status pembayaran";

//             if (error.response) {
//                 console.error("Error response data:", error.response.data);
//                 console.error("Error response status:", error.response.status);

//                 if (error.response.data && error.response.data.message) {
//                     errorMessage = error.response.data.message;
//                 } else if (error.response.status === 404) {
//                     errorMessage = "Payment tidak ditemukan untuk order ini";
//                 } else if (error.response.status === 400) {
//                     errorMessage = error.response.data.message || "Data tidak valid";
//                 }
//             } else if (error.request) {
//                 console.error("Error request:", error.request);
//                 errorMessage = "Tidak ada respons dari server";
//             } else {
//                 console.error("Error message:", error.message);
//             }

//             toast.error(errorMessage);
//             throw error;
//         } finally {
//             set({ isLoading: false });
//         }
//     },

//     // Handle Midtrans callback (untuk handle redirect dari Midtrans)
//     handleMidtransCallback: async(orderId) => {
//         const token = localStorage.getItem("token");
//         if (!token) {
//             console.error("Token not found");
//             return;
//         }

//         try {
//             set({ isLoading: true });

//             // Anda bisa menambahkan endpoint khusus untuk mengecek status payment
//             // atau menggunakan fetchPayments untuk mendapatkan data terbaru
//             await get().fetchPayments();

//             toast.success("Status pembayaran diperbarui");
//         } catch (error) {
//             console.error("Midtrans callback error:", error);
//             toast.error("Gagal memuat status pembayaran terbaru");
//         } finally {
//             set({ isLoading: false });
//         }
//     },

//     // Get payment by ID
//     fetchPaymentById: async(paymentId) => {
//         const token = localStorage.getItem("token");
//         if (!token) {
//             console.error("Token not found. Unable to fetch payment.");
//             return;
//         }

//         try {
//             set({ isLoading: true });

//             // Jika endpoint untuk get by ID tersedia
//             const response = await axiosInstance.get(`/payments/${paymentId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 withCredentials: false,
//             });

//             set({ paymentById: response.data.data });
//             return response.data.data;
//         } catch (error) {
//             console.error("Fetch payment by ID error:", error);
//             toast.error("Gagal memuat detail pembayaran");
//             throw error;
//         } finally {
//             set({ isLoading: false });
//         }
//     },

//     // Get payment by order ID
//     fetchPaymentByOrderId: async(orderId) => {
//         const token = localStorage.getItem("token");
//         if (!token) {
//             console.error("Token not found. Unable to fetch payment.");
//             return;
//         }

//         try {
//             set({ isLoading: true });

//             // Filter dari payments yang sudah di-load
//             const { payments } = get();
//             const payment = payments.find(p => p.order_id === parseInt(orderId));

//             if (payment) {
//                 set({ paymentById: payment });
//                 return payment;
//             }

//             // Jika tidak ditemukan, fetch dari API
//             await get().fetchPayments();
//             const updatedPayments = get().payments;
//             const updatedPayment = updatedPayments.find(p => p.order_id === parseInt(orderId));

//             set({ paymentById: updatedPayment || null });
//             return updatedPayment;
//         } catch (error) {
//             console.error("Fetch payment by order ID error:", error);
//             toast.error("Gagal memuat data pembayaran");
//             throw error;
//         } finally {
//             set({ isLoading: false });
//         }
//     },

//     // Clear payment data
//     clearPaymentData: () => {
//         set({
//             paymentById: null,
//             payments: []
//         });
//     },

//     // Set loading state
//     setLoading: (loading) => set({ isLoading: loading }),

//     // Update payments state
//     setPayments: (payments) => set({ payments }),
// }));

// export default usePaymentStore;

// stores/usePaymentStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

const usePaymentStore = create((set, get) => ({
    authUser: JSON.parse(localStorage.getItem("authUser")) || null,
    isLoading: false,
    payments: [],
    paymentById: null,

    // Fetch all payments
    fetchPayments: async() => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token not found. Unable to fetch payments.");
                return [];
            }

            set({ isLoading: true });

            const response = await axiosInstance.get("/payments", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: false,
            });

            console.log("Payments response:", response.data.data);

            set({ payments: response.data.data || [] });
            return response.data.data;
        } catch (error) {
            console.error("Fetch payments error:", error);
            toast.error("Gagal memuat data pembayaran");
            return [];
        } finally {
            set({ isLoading: false });
        }
    },

    // Create payment
    createPayment: async(orderId, paymentData) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Anda harus login terlebih dahulu");
            throw new Error("User not authenticated");
        }

        try {
            set({ isLoading: true });
            console.log("Creating payment for order:", orderId);
            console.log("Payment data:", paymentData);

            if (!orderId) {
                toast.error("Order ID tidak valid");
                throw new Error("Invalid order ID");
            }

            const response = await axiosInstance.post(
                `/payments/${orderId}/payment-by-order`,
                paymentData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: false,
                }
            );

            const responseData = response.data;
            console.log("Payment created successfully:", responseData);

            if (paymentData.payment_method === 'transfer' && responseData.payment_url) {
                window.location.href = responseData.payment_url;
            }

            toast.success(
                paymentData.payment_method === 'COD' ?
                "Pembayaran COD berhasil diproses" :
                "Silakan lanjutkan pembayaran"
            );

            return {
                status: 'success',
                data: responseData,
                message: responseData.message
            };

        } catch (error) {
            console.error("Payment creation error:", error);
            let errorMessage = "Gagal memproses pembayaran";

            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
                console.error("Error response:", error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            }

            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Verify payment
    verifyPayment: async(data) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Anda harus login terlebih dahulu");
            throw new Error("User not authenticated");
        }

        try {
            set({ isLoading: true });

            const response = await axiosInstance.put(
                "/payments/payment_verify", {
                    order_id: data.order_id,
                    status: data.status,
                    note: data.note || null
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: false,
                }
            );

            console.log("Payment verified successfully:", response.data);

            // Refresh payments data
            await get().fetchPayments();

            return response.data;
        } catch (error) {
            console.error("Verify payment error:", error);
            let errorMessage = "Gagal memverifikasi pembayaran";

            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
                console.error("Error response:", error.response.data);
            }

            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Update payment status
    updatePaymentStatus: async(orderId, formData) => {
        console.log("updatePaymentStatus called with orderId:", orderId);
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Anda harus login terlebih dahulu");
            throw new Error("User not authenticated");
        }

        try {
            set({ isLoading: true });

            if (!orderId) {
                toast.error("Order ID tidak valid");
                throw new Error("Order ID is required");
            }

            console.log("Updating payment for order_id:", orderId);
            console.log("FormData content:", {
                payment_status: formData.get('payment_status'),
                has_file: formData.has('proof_of_payment')
            });

            const response = await axiosInstance.put(
                `/payments/${orderId}/status`,
                formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: false,
                }
            );

            console.log("Payment status updated successfully:", response.data);

            // Refresh payments data
            await get().fetchPayments();

            toast.success("Status pembayaran berhasil diperbarui");
            return response.data;
        } catch (error) {
            console.error("Update payment status error:", error);
            let errorMessage = "Gagal memperbarui status pembayaran";

            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);

                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.status === 404) {
                    errorMessage = "Payment tidak ditemukan untuk order ini";
                } else if (error.response.status === 400) {
                    errorMessage = error.response.data.message || "Data tidak valid";
                }
            } else if (error.request) {
                console.error("Error request:", error.request);
                errorMessage = "Tidak ada respons dari server";
            } else {
                console.error("Error message:", error.message);
            }

            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Handle Midtrans callback
    handleMidtransCallback: async(orderId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return;
        }

        try {
            set({ isLoading: true });
            await get().fetchPayments();
            toast.success("Status pembayaran diperbarui");
        } catch (error) {
            console.error("Midtrans callback error:", error);
            toast.error("Gagal memuat status pembayaran terbaru");
        } finally {
            set({ isLoading: false });
        }
    },

    // Get payment by ID
    fetchPaymentById: async(paymentId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found. Unable to fetch payment.");
            return;
        }

        try {
            set({ isLoading: true });

            // Jika endpoint untuk get by ID tersedia
            const response = await axiosInstance.get(`/payments/${paymentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: false,
            });

            set({ paymentById: response.data.data });
            return response.data.data;
        } catch (error) {
            console.error("Fetch payment by ID error:", error);

            // Fallback: cari dari data payments yang sudah di-load
            const { payments } = get();
            const payment = payments.find(p => p.id === parseInt(paymentId));
            if (payment) {
                set({ paymentById: payment });
                return payment;
            }

            toast.error("Gagal memuat detail pembayaran");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Get payment by order ID
    fetchPaymentByOrderId: async(orderId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found. Unable to fetch payment.");
            return null;
        }

        try {
            set({ isLoading: true });

            // Coba cari dari payments yang sudah di-load
            const { payments } = get();
            let payment = payments.find(p => p.order_id === parseInt(orderId));

            if (payment) {
                set({ paymentById: payment });
                return payment;
            }

            // Jika tidak ditemukan, fetch dari API payments
            await get().fetchPayments();
            const updatedPayments = get().payments;
            payment = updatedPayments.find(p => p.order_id === parseInt(orderId));

            set({ paymentById: payment || null });
            return payment;
        } catch (error) {
            console.error("Fetch payment by order ID error:", error);

            // Fallback: cari dengan endpoint khusus jika ada
            try {
                const response = await axiosInstance.get(`/payments/order/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: false,
                });

                if (response.data.data) {
                    set({ paymentById: response.data.data });
                    return response.data.data;
                }
            } catch (e) {
                console.error("Alternative fetch failed:", e);
            }

            toast.error("Gagal memuat data pembayaran");
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    // Clear payment data
    clearPaymentData: () => {
        set({
            paymentById: null,
            payments: []
        });
    },

    // Set loading state
    setLoading: (loading) => set({ isLoading: loading }),

    // Update payments state
    setPayments: (payments) => set({ payments }),
}));

export default usePaymentStore;