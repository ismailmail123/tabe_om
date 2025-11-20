import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

const useProductStore = create(

    (set, get) => ({
        authUser: JSON.parse(localStorage.getItem("authUser")) || null, // Ambil data user dari local storage
        userId: null,
        isLoading: false,
        products: [],
        productId: null,

        fetchProducts: async() => {
            set({ isLoading: true });
            try {
                const res = await axios.get("http://localhost:8001/api/products", {
                    headers: {
                        Authorization: `Bearer ${get().authUser.token}`,
                    },
                });
                console.log("Fetched Products:", res.data);
                set({ products: res.data.data });
            } catch (error) {
                toast.error(error.response.data.message || "Fetch products failed");
            } finally {
                set({ isLoading: false });
            }
        },
        fetchProductById: async(id) => {
            set({ isLoading: true });
            try {
                const res = await axios.get(`http://localhost:8001/api/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${get().authUser.token}`,
                    },
                });
                console.log("Fetched Product by id:", res.data);
                set({ productId: res.data.data });
            } catch (error) {
                toast.error(error.response.data.message || "Fetch products failed");
            } finally {
                set({ isLoading: false });
            }
        },

    })

);

export default useProductStore;