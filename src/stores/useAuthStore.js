import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

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
                const res = await axios.get("http://localhost:8001/api/users", {
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
                const res = await axios.get(`http://localhost:8001/api/users/${userId}`, {
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
                await axios.delete("http://localhost:8001/api/users/delete", {
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
                const res = await axios.post("http://localhost:8001/api/auth/verify-email", {
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
                const res = await axios.put(`http://localhost:8001/api/users/${userId}`, data, {
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

        // Clear user detail ketika keluar dari detail page
        clearUserDetail: () => {
            set({ userDetail: null });
        },


        // Fungsi untuk signup
        signup: async(data) => {
            set({ isSigningUp: true });
            try {
                const res = await axios.post("http://localhost:8001/api/auth/register", data);
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
                const res = await axios.post("http://localhost:8001/api/auth/verify-email", data);
                set({ authUser: res.data });
                localStorage.setItem("authUser", JSON.stringify(res.data)); // Simpan data user di local storage
            } catch (error) {
                toast.error(error.response.data.message || "Verification failed");
            } finally {
                set({ isSigningUp: false });
            }
        },

        // Fungsi untuk login
        login: async(data) => {
            set({ isLoggingIn: true });
            try {
                const res = await axios.post("http://localhost:8001/api/auth/login", data);

                console.log("Login Response:", res.data.data.user);
                if (res.data && res.data.data) {
                    set({ authUser: res.data.data });
                    localStorage.setItem("authUser", JSON.stringify(res.data.data)); // Simpan data user di local storage
                    localStorage.setItem("token", res.data.data.token);
                } else {
                    throw new Error("Login gagal. Periksa email dan password Anda.");
                }
            } catch (error) {
                toast.error(error.response.data.message || "Login failed");
                throw error;
            } finally {
                set({ isLoggingIn: false });
            }
        },

        // Fungsi untuk logout
        logout: async() => {
            try {
                await axios.post("http://localhost:8001/api/auth/logout"); // Panggil API logout
                set({ authUser: null }); // Reset state authUser ke null
                localStorage.removeItem("authUser"); // Hapus data user dari local storage
                localStorage.removeItem("token"); // Hapus data user dari local storage
                localStorage.removeItem("auth-storage"); // Hapus data user dari local storage
                toast.success("Logged out successfully");
                window.location.href = "/auth"; // Redirect ke halaman login
            } catch (error) {
                toast.error(error.response.data.message || "Logout failed");
            }
        },

        // Fungsi untuk update profil
        updateProfile: async(data) => {
            set({ isUpdatingProfile: true });
            try {
                const res = await axios.put("http://localhost:8001/api/auth/update-profile", data);
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