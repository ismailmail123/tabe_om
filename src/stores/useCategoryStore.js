// import { create } from "zustand";
// import toast from "react-hot-toast";
// import axios from "axios";

// const useCategoryStore = create((set, get) => ({
//     authUser: JSON.parse(localStorage.getItem("authUser")) || null,
//     isLoading: false,
//     categories: [],

//     // 🟢 Fetch semua kategori
//     fetchCategories: async() => {
//         set({ isLoading: true });
//         try {
//             const res = await axiosInstance.get("/categories", {
//                 headers: {
//                     Authorization: `Bearer ${get().authUser.token}`,
//                 },
//             });
//             set({ categories: res.data.data });
//         } catch (error) {
//             toast.error(error.response.data.message || "Fetch categories failed");
//         } finally {
//             set({ isLoading: false });
//         }
//     },

//     // 🟢 Tambah kategori baru
//     createCategory: async(categoryData) => {
//         set({ isLoading: true });
//         try {
//             const res = await axiosInstance.post("/categories", categoryData, {
//                 headers: {
//                     Authorization: `Bearer ${get().authUser.token}`,
//                 },
//             });
//             toast.success("Kategori berhasil ditambahkan");
//             await get().fetchCategories(); // Refresh list
//             return res.data;
//         } catch (error) {
//             toast.error(error.response.data.message || "Create category failed");
//             throw error;
//         } finally {
//             set({ isLoading: false });
//         }
//     },
// }));

// export default useCategoryStore;


// useCategoryStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../lib/axios";

const useCategoryStore = create((set, get) => ({
    authUser: JSON.parse(localStorage.getItem("authUser")) || null,
    isLoading: false,
    categories: [],
    selectedCategory: null,


    // 🟢 Fetch semua kategori
    fetchCategories: async() => {
        set({ isLoading: true });

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Anda harus login terlebih dahulu");
                throw new Error("User not authenticated");
            }
            const res = await axios.get("https://batarirtnbantaeng.cloud/api/categories", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ categories: res.data.data });
        } catch (error) {
            toast.error(error.response.data.message || "Fetch categories failed");
        } finally {
            set({ isLoading: false });
        }
    },

    // 🟢 Fetch kategori by ID
    fetchCategoryById: async(id) => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Anda harus login terlebih dahulu");
                throw new Error("User not authenticated");
            }
            const res = await axiosInstance.get(`/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ selectedCategory: res.data.data });
            return res.data.data;
        } catch (error) {
            toast.error(error.response.data.message || "Fetch category failed");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // 🟢 Tambah kategori baru
    createCategory: async(categoryData) => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Anda harus login terlebih dahulu");
                throw new Error("User not authenticated");
            }
            const res = await axiosInstance.post("/categories", categoryData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Kategori berhasil ditambahkan");
            await get().fetchCategories();
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message || "Create category failed");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // 🟢 Update kategori
    updateCategory: async(id, formData) => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Anda harus login terlebih dahulu");
                throw new Error("User not authenticated");
            }
            const res = await axiosInstance.put(`/categories/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Kategori berhasil diupdate");
            await get().fetchCategories();
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message || "Update category failed");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // 🟢 Hapus kategori
    deleteCategory: async(categoryId) => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Anda harus login terlebih dahulu");
                throw new Error("User not authenticated");
            }
            await axiosInstance.delete(`/categories/delete`, {
                data: { categoryId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Kategori berhasil dihapus");
            await get().fetchCategories();
        } catch (error) {
            toast.error(error.response.data.message || "Delete category failed");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Clear selected category
    clearSelectedCategory: () => set({ selectedCategory: null }),
}));

export default useCategoryStore;