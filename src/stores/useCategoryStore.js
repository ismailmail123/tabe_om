import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

const useCategoryStore = create((set, get) => ({
    authUser: JSON.parse(localStorage.getItem("authUser")) || null,
    isLoading: false,
    categories: [],

    // 🟢 Fetch semua kategori
    fetchCategories: async() => {
        set({ isLoading: true });
        try {
            const res = await axios.get("http://localhost:8001/api/categories", {
                headers: {
                    Authorization: `Bearer ${get().authUser.token}`,
                },
            });
            set({ categories: res.data.data });
        } catch (error) {
            toast.error(error.response.data.message || "Fetch categories failed");
        } finally {
            set({ isLoading: false });
        }
    },

    // 🟢 Tambah kategori baru
    createCategory: async(categoryData) => {
        set({ isLoading: true });
        try {
            const res = await axios.post("http://localhost:8001/api/categories", categoryData, {
                headers: {
                    Authorization: `Bearer ${get().authUser.token}`,
                },
            });
            toast.success("Kategori berhasil ditambahkan");
            await get().fetchCategories(); // Refresh list
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message || "Create category failed");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useCategoryStore;