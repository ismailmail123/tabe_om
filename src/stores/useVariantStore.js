// import { create } from "zustand";
// import toast from "react-hot-toast";
// import axios from "axios";

// const useVariantStore = create((set, get) => ({
//     authUser: JSON.parse(localStorage.getItem("authUser")) || null,
//     isLoading: false,
//     variants: [], // Pastikan default value adalah array kosong
//     variantDetail: null,

//     // 🟢 Fetch variant by product ID
//     fetchVariantsByProductId: async(productId) => {
//         set({ isLoading: true });
//         try {
//             const res = await axios.get(`http://localhost:8001/api/variants/${productId}`, {
//                 headers: {
//                     Authorization: `Bearer ${get().authUser.token}`,
//                 },
//             });
//             // Pastikan data yang disimpan adalah array
//             const variantsData = Array.isArray(res.data.data) ? res.data.data : [];
//             set({ variants: variantsData });
//         } catch (error) {
//             console.error("Error fetching variants:", error);
//             // Set variants ke array kosong jika error
//             set({ variants: [] });
//             toast.error(error.response.data.message || "Fetch variants failed");
//         } finally {
//             set({ isLoading: false });
//         }
//     },

//     // 🟢 Fetch variant by ID
//     fetchVariantById: async(id) => {
//         set({ isLoading: true });
//         try {
//             const res = await axios.get(`http://localhost:8001/api/variants/${id}`, {
//                 headers: {
//                     Authorization: `Bearer ${get().authUser.token}`,
//                 },
//             });
//             set({ variantDetail: res.data.data });
//         } catch (error) {
//             toast.error(error.response.data.message || "Fetch variant failed");
//         } finally {
//             set({ isLoading: false });
//         }
//     },

//     // 🟢 Tambah variant baru
//     createVariant: async(variantData) => {
//         set({ isLoading: true });
//         try {
//             const formData = new FormData();

//             formData.append('product_id', variantData.product_id);
//             formData.append('name', variantData.name);
//             formData.append('price', variantData.price);
//             formData.append('stock', variantData.stock);
//             formData.append('sku', variantData.sku || '');

//             if (variantData.image && variantData.image instanceof File) {
//                 formData.append('image', variantData.image);
//             }

//             const res = await axios.post("http://localhost:8001/api/variants", formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${get().authUser.token}`,
//                 },
//             });

//             toast.success("Variant berhasil ditambahkan");
//             // Refresh variants list
//             await get().fetchVariantsByProductId(variantData.product_id);
//             return res.data;
//         } catch (error) {
//             const errorMessage = error.response.data.message || "Create variant failed";
//             toast.error(errorMessage);
//             throw new Error(errorMessage);
//         } finally {
//             set({ isLoading: false });
//         }
//     },

//     // 🟢 Update variant
//     updateVariant: async(id, variantData) => {
//         set({ isLoading: true });
//         try {
//             const formData = new FormData();

//             formData.append('product_id', variantData.product_id);
//             formData.append('name', variantData.name);
//             formData.append('price', variantData.price);
//             formData.append('stock', variantData.stock);
//             formData.append('sku', variantData.sku || '');

//             if (variantData.image && variantData.image instanceof File) {
//                 formData.append('image', variantData.image);
//             } else if (variantData.img_url) {
//                 formData.append('img_url', variantData.img_url);
//             }

//             const res = await axios.put(`http://localhost:8001/api/variants/${id}`, formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${get().authUser.token}`,
//                 },
//             });

//             toast.success("Variant berhasil diupdate");
//             // Refresh variants list
//             await get().fetchVariantsByProductId(variantData.product_id);
//             return res.data;
//         } catch (error) {
//             const errorMessage = error.response.data.message || "Update variant failed";
//             toast.error(errorMessage);
//             throw new Error(errorMessage);
//         } finally {
//             set({ isLoading: false });
//         }
//     },

//     // 🟢 Hapus variant
//     deleteVariant: async(variantId, productId) => {
//         set({ isLoading: true });
//         try {
//             await axios.delete(`http://localhost:8001/api/variants/${variantId}`, {
//                 data: { variantId }, // Kirim variantId di body untuk DELETE
//                 headers: {
//                     Authorization: `Bearer ${get().authUser.token}`,
//                 },
//             });

//             toast.success("Variant berhasil dihapus");
//             await get().fetchVariantsByProductId(productId);
//         } catch (error) {
//             const errorMessage = error.response.data.message || "Delete variant failed";
//             toast.error(errorMessage);
//             throw new Error(errorMessage);
//         } finally {
//             set({ isLoading: false });
//         }
//     },

//     // Clear variants
//     clearVariants: () => set({ variants: [] }),

//     // Clear variant detail
//     clearVariantDetail: () => set({ variantDetail: null }),
// }));

// export default useVariantStore;

import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

const useVariantStore = create((set, get) => ({
    authUser: JSON.parse(localStorage.getItem("authUser")) || null,
    isLoading: false,
    variants: [],
    variantDetail: null,

    // 🟢 Fetch variant by product ID - PERBAIKAN: gunakan endpoint yang benar
    fetchVariantsByProductId: async(productId) => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Anda harus login terlebih dahulu");
                throw new Error("User not authenticated");
            }
            const res = await axios.get(`http://localhost:8001/api/variants/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Pastikan data yang disimpan adalah array
            const variantsData = Array.isArray(res.data.data) ? res.data.data : [];
            set({ variants: variantsData });
            return variantsData; // Return data untuk keperluan debugging
        } catch (error) {
            console.error("Error fetching variants:", error);
            // Set variants ke array kosong jika error
            set({ variants: [] });
            const errorMessage = error.response.data.message || "Fetch variants failed";
            toast.error(errorMessage);
            return []; // Return array kosong
        } finally {
            set({ isLoading: false });
        }
    },

    // 🟢 Fetch variant by ID
    fetchVariantById: async(id) => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Anda harus login terlebih dahulu");
                throw new Error("User not authenticated");
            }
            // PERBAIKAN: Gunakan endpoint yang sesuai untuk get single variant
            // Anda mungkin perlu membuat endpoint khusus atau menggunakan endpoint index dengan filter
            const res = await axios.get(`http://localhost:8001/api/variants`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Cari variant by ID dari response
            const variant = res.data.data.find(v => v.id === parseInt(id));
            set({ variantDetail: variant || null });

            if (!variant) {
                toast.error("Variant tidak ditemukan");
            }
        } catch (error) {
            console.error("Error fetching variant:", error);
            toast.error(error.response.data.message || "Fetch variant failed");
        } finally {
            set({ isLoading: false });
        }
    },

    // 🟢 Tambah variant baru - PERBAIKAN: handle form data dengan benar
    createVariant: async(variantData) => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Anda harus login terlebih dahulu");
                throw new Error("User not authenticated");
            }
            const formData = new FormData();

            // Append data dengan key yang sesuai dengan backend
            formData.append('product_id', variantData.product_id);
            formData.append('name', variantData.name);
            formData.append('price', variantData.price);
            formData.append('stock', variantData.stock);
            formData.append('sku', variantData.sku || '');

            // PERBAIKAN: Pastikan key 'image' sesuai dengan yang diharapkan backend
            if (variantData.image && variantData.image instanceof File) {
                formData.append('img_url', variantData.image);
            }

            console.log('Creating variant with data:', {
                product_id: variantData.product_id,
                name: variantData.name,
                price: variantData.price,
                stock: variantData.stock,
                hasImage: !!variantData.image
            });

            const res = await axios.post("http://localhost:8001/api/variants", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Variant berhasil ditambahkan");

            // PERBAIKAN: Refresh variants list
            await get().fetchVariantsByProductId(variantData.product_id);
            return res.data.data;

        } catch (error) {
            console.error("Error creating variant:", error);
            const errorMessage = error.response.data.message || "Create variant failed";
            toast.error(errorMessage);
            throw error; // Throw error untuk ditangkap di component
        } finally {
            set({ isLoading: false });
        }
    },

    // 🟢 Update variant - PERBAIKAN: handle form data dengan benar
    updateVariant: async(id, variantData) => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Anda harus login terlebih dahulu");
                throw new Error("User not authenticated");
            }
            const formData = new FormData();

            // PERBAIKAN: Sesuaikan dengan field yang diharapkan backend
            formData.append('product_id', variantData.product_id);
            formData.append('name', variantData.name);
            formData.append('price', variantData.price);
            formData.append('stock', variantData.stock);
            formData.append('sku', variantData.sku || '');
            formData.append('variantId', id); // Sesuai dengan backend yang menggunakan variantId

            // PERBAIKAN: Handle image update
            if (variantData.image && variantData.image instanceof File) {
                formData.append('img_url', variantData.image);
            } else if (variantData.img_url) {
                formData.append('img_url', variantData.image);
            }

            console.log('Updating variant with data:', {
                variantId: id,
                product_id: variantData.product_id,
                name: variantData.name,
                price: variantData.price,
                stock: variantData.stock,
                hasImage: !!variantData.image
            });

            const res = await axios.put(`http://localhost:8001/api/variants/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Variant berhasil diupdate");

            // PERBAIKAN: Refresh variants list
            await get().fetchVariantsByProductId(variantData.product_id);
            return res.data.data;
        } catch (error) {
            console.error("Error updating variant:", error);
            const errorMessage = error.response.data.message || "Update variant failed";
            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // 🟢 Hapus variant - PERBAIKAN: sesuaikan dengan backend
    deleteVariant: async(variantId, productId) => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Anda harus login terlebih dahulu");
                throw new Error("User not authenticated");
            }
            // PERBAIKAN: Sesuai dengan backend yang mengharapkan variantId di body
            await axios.delete(`http://localhost:8001/api/variants/delete`, {
                data: { variantId }, // Kirim variantId di body
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Variant berhasil dihapus");

            // PERBAIKAN: Refresh variants list
            await get().fetchVariantsByProductId(productId);
            get().clearVariantDetail();
            return;
        } catch (error) {
            console.error("Error deleting variant:", error);
            const errorMessage = error.response.data.message || "Delete variant failed";
            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Clear variants
    clearVariants: () => set({ variants: [] }),

    // Clear variant detail
    clearVariantDetail: () => set({ variantDetail: null }),
}));

export default useVariantStore;