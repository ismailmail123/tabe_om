import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

const useCartStore = create(

    (set, get) => ({
        authUser: JSON.parse(localStorage.getItem("authUser")) || null, // Ambil data user dari local storage
        isLoading: false,
        cartItems: [],
        productItems: [],
        selectedCart: JSON.parse(localStorage.getItem('selectedCart')) || [],




        fetchCarts: async() => {
            try {
                const token = get().authUser.token
                if (!token) {
                    console.error("Token not found. Unable to fetch carts.");
                    return;
                }

                const response = await axios.get("http://localhost:8001/api/carts", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                set({ cartItems: response.data.data });
            } catch (error) {
                console.error("Fetch carts error:", error);
            }
        },

        toggleSellerSelection: (sellerId) => {
            set((state) => {
                const numericSellerId = Number(sellerId);
                const sellerItems = state.cartItems.filter(
                    item => item.variant.product.user_id === numericSellerId
                );

                const allSelected = sellerItems.every(sellerItem =>
                    state.selectedCart.some(selectedItem =>
                        selectedItem.id === sellerItem.id
                    )
                );

                const newSelectedCart = allSelected ?
                    state.selectedCart.filter(selectedItem =>
                        !sellerItems.some(sellerItem =>
                            sellerItem.id === selectedItem.id
                        )
                    ) : [
                        ...state.selectedCart,
                        ...sellerItems.filter(sellerItem =>
                            !state.selectedCart.some(selectedItem =>
                                selectedItem.id === sellerItem.id
                            )
                        )
                    ];

                localStorage.setItem('selectedCart', JSON.stringify(newSelectedCart));
                return { selectedCart: newSelectedCart };
            });
        },

        toggleCartSelection: (variant) => {
            set((state) => {
                const isSelected = state.selectedCart.some(item => item.id === variant.id);
                const newSelectedCart = isSelected ?
                    state.selectedCart.filter(item => item.id !== variant.id) : [...state.selectedCart, variant];

                localStorage.setItem('selectedCart', JSON.stringify(newSelectedCart));
                return { selectedCart: newSelectedCart };
            });
        },

        clearSelectedCart: () => {
            localStorage.removeItem('selectedCart');
            set({ selectedCart: [] });
        },

        addCartItem: async(item) => {
            if (!item || !item.id) {
                console.error("Invalid product item:", item);
                throw new Error("Item produk tidak valid"); // Lempar error
            }

            const token = get().authUser.token;
            if (!token) {
                console.error("Token not found. Unable to add item to cart.");
                throw new Error("Silakan login terlebih dahulu"); // Lempar error
            }

            const userData = JSON.parse(atob(token.split('.')[1]));
            if (!userData || userData.role !== 'user') {
                console.error("User is not a customer. Unable to add item to cart.");
                throw new Error("Hanya customer yang dapat menambah ke keranjang"); // Lempar error
            }

            try {
                const response = await axios.post(
                    "http://localhost:8001/api/carts", {
                        variant_id: item.id,
                        quantity: 1
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );

                const updatedCartItems = response.data.data;
                set({ cartItems: updatedCartItems });

                set((state) => ({
                    productItems: state.productItems.map((p) =>
                        p.id === item.id ? {...p, stock: p.stock - 1 } : p
                    ),
                }));

                return response.data; // Return success data
            } catch (error) {
                console.error("Add cart item error:", error);

                // Lempar error kembali agar bisa ditangkap di component
                if (error.response) {
                    const errorMessage = error.response.data.message || error.response.data.error || "Gagal menambahkan ke keranjang";
                    throw new Error(errorMessage);
                } else if (error.request) {
                    throw new Error("Tidak ada respons dari server");
                } else {
                    throw new Error("Terjadi kesalahan saat menambahkan ke keranjang");
                }
            }
        },

        decrementCartItemQuantity: async(itemId) => {
            const token = get().authUser.token
            if (!token) {
                console.error("Token not found. Unable to update item quantity.");
                return;
            }

            const cartItem = get().cartItems.find((item) => item.id === itemId);
            if (!cartItem) {
                console.error("Cart item not found.");
                return;
            }

            if (cartItem.quantity <= 1) {
                alert("Quantity must be greater than 0.")
                return;
            }

            const newQuantity = cartItem.quantity - 1;

            try {
                const response = await axios.put(
                    `http://localhost:8001/api/carts/${itemId}`, { quantity: newQuantity }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );

                const updatedCartItem = response.data.data;
                set((state) => ({
                    cartItems: state.cartItems.map((item) =>
                        item.id === itemId ? {...item, quantity: newQuantity } : item
                    ),
                    productItems: state.productItems.map((p) =>
                        p.id === updatedCartItem.variant_id ? {...p, stock: p.stock + 1 } : p
                    ),
                    selectedCart: state.selectedCart.map(item =>
                        item.id === itemId ? {...item, quantity: newQuantity } : item
                    )
                }));
            } catch (error) {
                alert("Cek kembali ketersediaan produk")
                console.error("Update cart item quantity error:", error);
            }
        },
        incrementCartItemQuantity: async(itemId) => {
            const token = get().authUser.token;
            if (!token) {
                console.error("Token not found. Unable to update item quantity.");
                return;
            }

            const cartItem = get().cartItems.find((item) => item.id === itemId);
            if (!cartItem) {
                console.error("Cart item not found.");
                return;
            }

            const newQuantity = cartItem.quantity + 1;

            try {
                const response = await axios.put(`http://localhost:8001/api/carts/${itemId}`, { quantity: newQuantity }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                const updatedCartItem = response.data.data;
                set((state) => ({
                    cartItems: state.cartItems.map((item) =>
                        item.id === itemId ? {...item, quantity: newQuantity } : item
                    ),
                    productItems: state.productItems.map((p) =>
                        p.id === updatedCartItem.variant_id ? {...p, stock: p.stock - 1 } : p
                    ),
                    selectedCart: state.selectedCart.map(item =>
                        item.id === itemId ? {...item, quantity: newQuantity } : item
                    )
                }));
            } catch (error) {
                alert("Cek kembali ketersediaan produk")
                console.error("Update cart item quantity error:", error);
            }
        },



    })

);

export default useCartStore;