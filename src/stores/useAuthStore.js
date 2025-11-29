import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../lib/axios";

const useAuthStore = create(

    (set, get) => ({
        authUser: JSON.parse(localStorage.getItem("authUser")) || null, // Ambil data user dari local storage
        userId: null,
        users: [],
        userDetail: null,
        loading: false,

        // Fungsi untuk mengambil semua user
        fetchUsers: async() => {
            set({ loading: true });
            try {
                const token = localStorage.getItem("token");
                const res = await axiosInstance.get("/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                set({ users: res.data.data });
            } catch (error) {
                toast.error(error.response.data.message || "Failed to fetch users");
            } finally {
                set({ loading: false });
            }
        },

        // Fungsi untuk mengambil detail user
        fetchUserDetail: async(userId) => {
            set({ loading: true });
            try {
                const token = localStorage.getItem("token");
                const res = await axiosInstance.get(`/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                set({ userDetail: res.data.data });
            } catch (error) {
                toast.error(error.response.data.message || "Failed to fetch user detail");
            } finally {
                set({ loading: false });
            }
        },

        // Fungsi untuk menghapus user
        deleteUser: async(userId) => {
            try {
                const token = localStorage.getItem("token");
                await axiosInstance.delete("/users/delete", {
                    data: { userId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success("User deleted successfully");
                // Refresh list setelah hapus
                get().fetchUsers();
            } catch (error) {
                toast.error(error.response.data.message || "Failed to delete user");
            }
        },

        // Fungsi untuk verifikasi email user
        verifyUserEmail: async(email, kode_verifikasi) => {
            set({ loading: true });
            try {
                const res = await axiosInstance.post("/auth/verify-email", {
                    email,
                    kode_verifikasi
                });
                toast.success("Email verified successfully");
                return res.data;
            } catch (error) {
                toast.error(error.response.data.message || "Verification failed");
                throw error;
            } finally {
                set({ loading: false });
            }
        },

        // Fungsi untuk update user
        updateUser: async(userId, data) => {
            set({ loading: true });
            try {
                const token = localStorage.getItem("token");
                const res = await axiosInstance.put(`/users/${userId}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success("User updated successfully");
                get().fetchUsers(); // Refresh list
                return res.data;
            } catch (error) {
                toast.error(error.response.data.message || "Update failed");
                throw error;
            } finally {
                set({ loading: false });
            }
        },

        verifyUser: async(userId) => {
            set({ loading: true });
            try {
                const token = localStorage.getItem("token");
                const res = await axiosInstance.put(
                    `/users/${userId}`, { terverifikasi: true }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                toast.success("User verified successfully");
                get().fetchUsers(); // Refresh list
                return res.data;
            } catch (error) {
                toast.error(error.response.data.message || "Verification failed");
                throw error;
            } finally {
                set({ loading: false });
            }
        },

        // Clear user detail ketika keluar dari detail page
        clearUserDetail: () => {
            set({ userDetail: null });
        },


        // Fungsi untuk signup
        signup: async(data) => {
            set({ isSigningUp: true });
            try {
                const res = await axiosInstance.post("/auth/register", data);
                set({ authUser: res.data });
                localStorage.setItem("authUser", JSON.stringify(res.data)); // Simpan data user di local storage
                return res.data; // Kembalikan data response
            } catch (error) {
                toast.error(error.response.data.message || "Signup failed");
                throw error; // Lempar error jika signup gagal
            } finally {
                set({ isSigningUp: false });
            }
        },

        // Fungsi untuk verifikasi email
        verify: async(data) => {
            set({ isSigningUp: true });
            try {
                const res = await axiosInstance.post("/auth/verify-email", data);
                set({ authUser: res.data });
                localStorage.setItem("authUser", JSON.stringify(res.data)); // Simpan data user di local storage
            } catch (error) {
                toast.error(error.response.data.message || "Verification failed");
            } finally {
                set({ isSigningUp: false });
            }
        },


        // Fungsi untuk login - PERBAIKAN: gunakan axiosInstance yang sudah dikonfigurasi
        // login: async(data) => {
        //     set({ isLoggingIn: true });
        //     try {
        //         // PASTIKAN menggunakan axiosInstance, bukan axios biasa
        //         const res = await axiosInstance.post("/auth/login", data);

        //         console.log("Login Response:", res.data.data.user);

        //         // Debug: cek apakah ada cookie di response
        //         console.log("Response headers:", res.headers);
        //         console.log("Set-Cookie header:", res.headers['set-cookie']);

        //         if (res.data && res.data.data) {
        //             set({ authUser: res.data.data });
        //             localStorage.setItem("authUser", JSON.stringify(res.data.data));
        //             localStorage.setItem("token", res.data.data.token);

        //             // **CEK COOKIES DI BROWSER**
        //             setTimeout(() => {
        //                 console.log("Cookies setelah login:", document.cookie);
        //             }, 100);
        //         } else {
        //             throw new Error("Login gagal. Periksa email dan password Anda.");
        //         }
        //     } catch (error) {
        //         toast.error(error.response.data.message || "Login failed");
        //         throw error;
        //     } finally {
        //         set({ isLoggingIn: false });
        //     }
        // },

        // // Fungsi untuk logout
        // logout: async() => {
        //     try {
        //         await axiosInstance.post("/auth/logout"); // Panggil API logout
        //         set({ authUser: null }); // Reset state authUser ke null
        //         localStorage.removeItem("authUser"); // Hapus data user dari local storage
        //         localStorage.removeItem("token"); // Hapus data user dari local storage
        //         localStorage.removeItem("auth-storage"); // Hapus data user dari local storage
        //         toast.success("Logged out successfully");
        //         window.location.href = "/auth"; // Redirect ke halaman login
        //     } catch (error) {
        //         toast.error(error.response.data.message || "Logout failed");
        //     }
        // },

        login: async(data) => {
            set({ isLoggingIn: true });
            try {
                const res = await axiosInstance.post("/auth/login", data);

                console.log("Login Response:", res.data);

                if (res.data && res.data.data) {
                    const authData = {
                        user: res.data.data.user,
                        token: res.data.data.token,
                    };

                    set({ authUser: authData });
                    localStorage.setItem("authUser", JSON.stringify(authData.user));
                    localStorage.setItem("token", authData.token);

                    return res.data;
                } else {
                    throw new Error("Login gagal. Periksa email dan password Anda.");
                }
            } catch (error) {
                const errorMessage = error.response.data.message || "Login failed";
                toast.error(errorMessage);
                throw new Error(errorMessage);
            } finally {
                set({ isLoggingIn: false });
            }
        },

        // Fungsi untuk logout
        // logout: async() => {
        //     try {
        //         // Panggil endpoint logout di backend
        //         await axiosInstance.post('/auth/logout');
        //     } catch (error) {
        //         console.error('Logout error:', error);
        //     } finally {
        //         // Clear data di frontend
        //         localStorage.removeItem('token');
        //         localStorage.removeItem('authUser');
        //         set({ authUser: null });
        //     }
        // },
        // Jika ingin lebih spesifik menghapus cookies tertentu
        // logout: async() => {
        //     try {
        //         await axiosInstance.post('/auth/logout');
        //     } catch (error) {
        //         console.error('Logout error:', error);
        //     } finally {
        //         // Clear localStorage
        //         const localStorageKeys = [
        //             'token', 'authUser', 'userData', 'session',
        //             'refreshToken', 'userPreferences'
        //         ];
        //         localStorageKeys.forEach(key => localStorage.removeItem(key));

        //         // Clear sessionStorage
        //         sessionStorage.clear();

        //         // Clear specific cookies
        //         const cookiesToDelete = [
        //             'refreshToken',
        //             'accessToken',
        //             'token',
        //             'authUser',
        //             'sessionId',
        //             'userSession'
        //         ];

        //         // Hapus setiap cookie
        //         cookiesToDelete.forEach(cookieName => {
        //             document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        //             // Untuk domain tertentu jika needed
        //             document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.yourdomain.com;`;
        //         });

        //         // Clear state
        //         set({ authUser: null });

        //         // Redirect
        //         window.location.href = '/login';
        //     }
        // },
        logout: async() => {
            try {
                // Panggil endpoint logout di backend
                const response = await axiosInstance.post('/auth/logout');
                console.log('Logout response:', response.data);
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                // Clear frontend storage saja
                localStorage.clear();
                sessionStorage.clear();

                // Reset state
                set({ authUser: null });

                // Redirect ke login
                window.location.href = '/login';
            }
        },
        // Fungsi untuk update profil
        updateProfile: async(data) => {
            set({ isUpdatingProfile: true });
            try {
                const res = await axiosInstance.put("/auth/update-profile", data);
                set({ authUser: res.data });
                localStorage.setItem("authUser", JSON.stringify(res.data)); // Simpan data user di local storage
                toast.success("Profile updated successfully");
            } catch (error) {
                console.log("Error in update profile:", error);
                toast.error(error.response.data.message || "Update failed");
            } finally {
                set({ isUpdatingProfile: false });
            }
        },
    })

);

export default useAuthStore;