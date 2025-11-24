import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

const useProductStore = create((set, get) => ({
    authUser: JSON.parse(localStorage.getItem("authUser")) || null,
    isLoading: false,
    products: [],
    productDetail: null,

    // 🟢 Fetch semua produk
    fetchProducts: async() => {
        set({ isLoading: true });
        try {
            const res = await axios.get("http://localhost:8001/api/products", {
                headers: {
                    Authorization: `Bearer ${get().authUser.token}`,
                },
            });
            set({ products: res.data.data });
            return res.data.data;
        } catch (error) {
            toast.error(error.response.data.message || "Fetch products failed");
        } finally {
            set({ isLoading: false });
        }
    },

    // 🟢 Fetch produk by ID
    fetchProductById: async(id) => {
        set({ isLoading: true });
        try {
            const res = await axios.get(`http://localhost:8001/api/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${get().authUser.token}`,
                },
            });
            set({ productDetail: res.data.data });
            return res.data.data;
        } catch (error) {
            toast.error(error.response.data.message || "Fetch product failed");
        } finally {
            set({ isLoading: false });
        }
    },

    // 🟢 Tambah produk baru
    createProduct: async(productData) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();

            // Append semua field ke FormData
            formData.append('category_id', productData.category_id);
            formData.append('name', productData.name);
            formData.append('description', productData.description);
            formData.append('price', productData.price);

            if (productData.image && productData.image instanceof File) {
                formData.append('img_url', productData.image);
            }

            const res = await axios.post("http://localhost:8001/api/products", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${get().authUser.token}`,
                },
            });

            toast.success("Produk berhasil ditambahkan");
            await get().fetchProducts(); // Refresh list
            return res.data;
        } catch (error) {
            const errorMessage = error.response.data.message || "Create product failed";
            toast.error(errorMessage);
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    // 🟢 Update produk
    updateProduct: async(id, productData) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();

            formData.append('category_id', productData.category_id);
            formData.append('name', productData.name);
            formData.append('description', productData.description);
            formData.append('price', productData.price);

            if (productData.image && productData.image instanceof File) {
                formData.append('img_url', productData.image);
            } else if (productData.image) {
                // Jika image adalah URL (saat edit tanpa ganti gambar)
                formData.append('img_url', productData.image);
            }

            const res = await axios.put(`http://localhost:8001/api/products/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${get().authUser.token}`,
                },
            });

            toast.success("Produk berhasil diupdate");
            await get().fetchProducts(); // Refresh list
            return res.data;
        } catch (error) {
            const errorMessage = error.response.data.message || "Update product failed";
            toast.error(errorMessage);
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    // 🟢 Hapus produk
    deleteProduct: async(id) => {
        set({ isLoading: true });
        try {
            await axios.delete(`http://localhost:8001/api/products/${id}/delete`, {
                headers: {
                    Authorization: `Bearer ${get().authUser.token}`,
                },
            });

            toast.success("Produk berhasil dihapus");
            await get().fetchProducts(); // Refresh list
            return get().fetchProducts();
        } catch (error) {
            const errorMessage = error.response.data.message || "Delete product failed";
            toast.error(errorMessage);
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    // 🟢 Update ketersediaan produk
    updateProductAvailability: async(productId, availability) => {
        set({ isLoading: true });
        try {
            const res = await axios.put(
                "http://localhost:8001/api/products/update", { productId, availability }, {
                    headers: {
                        Authorization: `Bearer ${get().authUser.token}`,
                    },
                }
            );

            toast.success("Ketersediaan produk berhasil diupdate");
            await get().fetchProducts(); // Refresh list
            return res.data;
        } catch (error) {
            const errorMessage = error.response.data.message || "Update availability failed";
            toast.error(errorMessage);
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    // Clear product detail
    clearProductDetail: () => set({ productDetail: null }),
}));

export default useProductStore;