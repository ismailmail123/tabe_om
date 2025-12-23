// // import React, { useState, useEffect, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, CreditCard } from "lucide-react";
// // import { Checkbox } from "../../components/ui/checkbox";
// // import useAuthStore from "../../stores/useAuthStore";
// // import useCartStore from "../../stores/useCartStore";
// // import useOrderStore from "../../stores/useOrderStore";
// // import toast, { Toaster } from "react-hot-toast";

// // const CartItem = ({
// //   item,
// //   onRemove,
// //   onIncrement,
// //   onDecrement,
// //   isSelected,
// //   onToggleSelect,
// //   navigate,
// //   onOutOfStockClick,
// // }) => {
// //   const touchStartX = useRef(0);
// //   const touchEndX = useRef(0);
// //   const [swipeOffset, setSwipeOffset] = useState(0);
// //   const [isSwiping, setIsSwiping] = useState(false);
// //   const [showDelete, setShowDelete] = useState(false);
// //   const itemRef = useRef(null);

// //   const isOutOfStock = item.variant?.stock <= 0;
// //   const isDeleted = item.variant?.is_delete;
// //   const isUnavailable = isOutOfStock || isDeleted;

// //   const handleIncrement = (e) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     e.nativeEvent.stopImmediatePropagation();
// //     console.log("Increment isolated");
// //     onIncrement();
// //   };

// //   const handleDecrement = (e) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     e.nativeEvent.stopImmediatePropagation();
// //     console.log("Decrement isolated");
// //     onDecrement();
// //   };

// //   const handleTouchStart = (e) => {
// //     touchStartX.current = e.touches[0].clientX;
// //     setIsSwiping(true);
// //   };

// //   const handleTouchMove = (e) => {
// //     if (!isSwiping) return;

// //     touchEndX.current = e.touches[0].clientX;
// //     const diff = touchStartX.current - touchEndX.current;

// //     if (diff > 0) {
// //       setSwipeOffset(Math.min(diff, 80));
// //     } else if (diff < 0 && showDelete) {
// //       setSwipeOffset(0);
// //       setShowDelete(false);
// //     }
// //   };

// //   const handleTouchEnd = () => {
// //     setIsSwiping(false);

// //     if (swipeOffset > 50 && !showDelete) {
// //       setShowDelete(true);
// //       setSwipeOffset(80);
// //     } else if (swipeOffset < 50 && !showDelete) {
// //       setSwipeOffset(0);
// //     }
// //   };

// //   const handleMouseLeave = () => {
// //     if (swipeOffset > 0 && !showDelete) {
// //       setSwipeOffset(0);
// //     }
// //   };

// //   const confirmDelete = () => {
// //     if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
// //       onRemove();
// //       setShowDelete(false);
// //       setSwipeOffset(0);
// //     } else {
// //       setShowDelete(false);
// //       setSwipeOffset(0);
// //     }
// //   };

// //   const handleToggleSelect = () => {
// //     if (isUnavailable) {
// //       onOutOfStockClick();
// //       return;
// //     }
// //     onToggleSelect();
// //   };

// //   return (
// //     <div
// //       ref={itemRef}
// //       className="relative mb-4 overflow-hidden"
// //       onTouchStart={handleTouchStart}
// //       onTouchMove={handleTouchMove}
// //       onTouchEnd={handleTouchEnd}
// //       onMouseLeave={handleMouseLeave}
// //     >
// //       <div
// //         className={`absolute right-0 top-0 h-full w-20 bg-red-500 flex items-center justify-center transition-transform duration-300 ${
// //           showDelete ? "translate-x-0" : "translate-x-full"
// //         }`}
// //       >
// //         <button onClick={confirmDelete} className="text-white font-bold">
// //           HAPUS
// //         </button>
// //       </div>

// //       <div
// //         className={`flex items-center gap-4 p-2 border-b bg-white transition-transform duration-300 ${
// //           isSwiping ? "cursor-grabbing" : "cursor-grab"
// //         } ${isUnavailable ? "opacity-60" : ""}`}
// //         style={{
// //           transform: showDelete
// //             ? "translateX(-80px)"
// //             : `translateX(-${swipeOffset}px)`,
// //         }}
// //       >
// //         <Checkbox
// //           checked={isSelected}
// //           onCheckedChange={handleToggleSelect}
// //           disabled={isUnavailable}
// //         />
// //         <button
// //           onClick={() =>
// //             !isUnavailable &&
// //             navigate(`/product-detail/${item.variant?.product?.id}/detail`)
// //           }
// //           className="flex-shrink-0"
// //           disabled={isUnavailable}
// //         >
// //           <img
// //             src={item.variant.img_url}
// //             className="w-16 h-16 object-cover rounded"
// //             alt={item.variant.name}
// //           />
// //         </button>
// //         <div className="flex-1">
// //           <h3 className="font-medium">{item.variant?.name}</h3>
// //           {isUnavailable && (
// //             <div className="text-red-500 text-sm font-medium mt-1">
// //               {isDeleted ? "Produk tidak tersedia" : "Stok Habis"}
// //             </div>
// //           )}
// //           <div className="flex items-center gap-4 mt-2">
// //             <p className="text-blue-700 font-bold">
// //               {new Intl.NumberFormat("id-ID", {
// //                 style: "currency",
// //                 currency: "IDR",
// //               }).format(item.variant.price)}
// //             </p>
// //             <div className="flex items-center gap-2">
// //               <button
// //                 onClick={handleDecrement}
// //                 className={`px-2 py-1 border rounded transition ${
// //                   isUnavailable
// //                     ? "bg-gray-100 cursor-not-allowed text-gray-400"
// //                     : "hover:bg-gray-100"
// //                 }`}
// //                 disabled={isUnavailable}
// //               >
// //                 -
// //               </button>
// //               <span
// //                 className={`min-w-[20px] text-center ${
// //                   isUnavailable ? "text-gray-400" : ""
// //                 }`}
// //               >
// //                 {item.quantity}
// //               </span>
// //               <button
// //                 onClick={handleIncrement}
// //                 className={`px-2 py-1 border rounded transition ${
// //                   isUnavailable
// //                     ? "bg-gray-100 cursor-not-allowed text-gray-400"
// //                     : "hover:bg-gray-100"
// //                 }`}
// //                 disabled={isUnavailable}
// //               >
// //                 +
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //         <button
// //           onClick={() => {
// //             if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
// //               onRemove();
// //             }
// //           }}
// //           className={`text-red-500 hover:text-red-700 hidden md:block transition ${
// //             isUnavailable
// //               ? "text-gray-400 hover:text-gray-400 cursor-not-allowed"
// //               : ""
// //           }`}
// //           disabled={isUnavailable}
// //         >
// //           Hapus
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // const Pembayaran = ({ cartItems, onBack, onSuccess }) => {
// //   const [form, setForm] = useState({
// //     nama: "",
// //     blok: "",
// //     nomorRegister: "",
// //     namaPengirim: "",
// //     catatan: "",
// //   });
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [paymentMethod, setPaymentMethod] = useState("virtual_account");
  
// //   const { createOrder } = useOrderStore();
// //   const { removeCartItem, clearSelectedCart } = useCartStore();

// //   const formatRupiah = (n) =>
// //     "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// //   // Pastikan cartItems selalu array dan hitung total dengan aman
// //   const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
// //   const subtotal = safeCartItems.reduce((sum, item) => {
// //     const price = item?.variant?.price || 0;
// //     const quantity = item?.quantity || 0;
// //     return sum + (price * quantity);
// //   }, 0);

// //   // Hitung biaya admin berdasarkan metode pembayaran
// //   const adminFee = paymentMethod === "virtual_account" ? 5000 : Math.round(subtotal * 0.01);
// //   const total = subtotal + adminFee;

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);

// //     try {
// //       // Prepare data for order creation
// //       const orderData = {
// //         items: safeCartItems.map(item => ({
// //           variant_id: item.variant?.id,
// //           quantity: item.quantity
// //         })),
// //         payment_method: paymentMethod,
// //         wbp_name: form.nama,
// //         wbp_room: form.blok,
// //         wbp_register_number: form.nomorRegister,
// //         wbp_sender: form.namaPengirim,
// //         note: form.catatan
// //       };

// //       // Create order using useOrderStore
// //       const result = await createOrder(orderData);

// //       console.log("Order creation result:", result);

// //       if (result.status === "success") {
// //         // Untuk pembayaran transfer - redirect ke Midtrans
// //         if ((paymentMethod === 'virtual_account' || paymentMethod === 'qris') && result.data.payment.payment_url) {
// //           // Redirect otomatis ke halaman pembayaran Midtrans
// //           window.location.href = result.data.payment.payment_url;
// //           return;
// //         }
        
// //         // Untuk pembayaran lainnya
// //         safeCartItems.forEach(item => {
// //           removeCartItem(item.id);
// //         });
// //         clearSelectedCart();

// //         // Set notification for new transaction
// //         localStorage.setItem("notifTransaksi", "true");

// //         // Add notification for admin
// //         const adminNotifs = JSON.parse(localStorage.getItem("adminNotifications")) || [];
// //         adminNotifs.push({
// //           id: result.data.data.order_id,
// //           message: `Transaksi baru dari ${form.nama} (${form.namaPengirim}) - Total ${formatRupiah(total)}`,
// //           time: new Date().toLocaleString("id-ID"),
// //           read: false,
// //           data: result.data.data,
// //         });
// //         localStorage.setItem("adminNotifications", JSON.stringify(adminNotifs));

// //         toast.success("✅ Pesanan berhasil dibuat!");
        
// //         if (onSuccess) {
// //           onSuccess();
// //         }
// //       } else {
// //         toast.error(result.message || "Gagal membuat pesanan");
// //       }
// //     } catch (error) {
// //       console.error("Order creation error:", error);
// //       toast.error("Terjadi kesalahan saat membuat pesanan");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6 font-['Poppins']">
// //       <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
// //         <div className="flex items-center gap-3 mb-8">
// //           <button
// //             onClick={onBack}
// //             className="bg-none border-none cursor-pointer p-0 mr-2"
// //             disabled={isSubmitting}
// //           >
// //             <ArrowLeft className="w-6 h-6" />
// //           </button>
// //           <CreditCard className="w-8 h-8 text-green-600" />
// //           <h2 className="text-2xl font-semibold text-gray-800">
// //             Formulir Pembayaran WBP
// //           </h2>
// //         </div>

// //         <form onSubmit={handleSubmit} className="space-y-6">
// //           {/* Pilihan Metode Pembayaran */}
// //           <div className="border-b pb-6">
// //             <h3 className="text-lg font-semibold text-gray-800 mb-4">
// //               Pilih Metode Pembayaran
// //             </h3>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               {/* Virtual Account */}
// //               <div
// //                 className={`border-2 rounded-lg p-4 cursor-pointer transition ${
// //                   paymentMethod === 'virtual_account' 
// //                     ? 'border-green-500 bg-green-50' 
// //                     : 'border-gray-300 hover:border-green-300'
// //                 }`}
// //                 onClick={() => setPaymentMethod('virtual_account')}
// //               >
// //                 <div className="flex items-center gap-3">
// //                   <div className={`w-4 h-4 rounded-full border-2 ${
// //                     paymentMethod === 'virtual_account' 
// //                       ? 'bg-green-500 border-green-500' 
// //                       : 'border-gray-400'
// //                   }`}></div>
// //                   <div>
// //                     <p className="font-semibold">Virtual Account</p>
// //                   </div>
// //                 </div>
// //               </div>
              
// //               {/* QRIS */}
// //               <div
// //                 className={`border-2 rounded-lg p-4 cursor-pointer transition ${
// //                   paymentMethod === 'qris' 
// //                     ? 'border-green-500 bg-green-50' 
// //                     : 'border-gray-300 hover:border-green-300'
// //                 }`}
// //                 onClick={() => setPaymentMethod('qris')}
// //               >
// //                 <div className="flex items-center gap-3">
// //                   <div className={`w-4 h-4 rounded-full border-2 ${
// //                     paymentMethod === 'qris' 
// //                       ? 'bg-green-500 border-green-500' 
// //                       : 'border-gray-400'
// //                   }`}></div>
// //                   <div>
// //                     <p className="font-semibold">QRIS</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Input Nama WBP */}
// //           <div>
// //             <label className="block text-gray-700 font-medium mb-2">
// //               Nama WBP
// //             </label>
// //             <input
// //               type="text"
// //               name="nama"
// //               value={form.nama}
// //               onChange={(e) => setForm({ ...form, nama: e.target.value })}
// //               required
// //               placeholder="Masukkan nama lengkap WBP"
// //               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //               disabled={isSubmitting}
// //             />
// //           </div>

// //           {/* Input Blok dan Register */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div>
// //               <label className="block text-gray-700 font-medium mb-2">
// //                 Blok / Kamar
// //               </label>
// //               <input
// //                 type="text"
// //                 name="blok"
// //                 value={form.blok}
// //                 onChange={(e) => setForm({ ...form, blok: e.target.value })}
// //                 required
// //                 placeholder="Contoh: Blok A-2"
// //                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //                 disabled={isSubmitting}
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-gray-700 font-medium mb-2">
// //                 Nomor Register
// //               </label>
// //               <input
// //                 type="text"
// //                 name="nomorRegister"
// //                 value={form.nomorRegister}
// //                 onChange={(e) =>
// //                   setForm({ ...form, nomorRegister: e.target.value })
// //                 }
// //                 required
// //                 placeholder="Masukkan nomor register WBP"
// //                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //                 disabled={isSubmitting}
// //               />
// //             </div>
// //           </div>

// //           {/* Nama Pengirim */}
// //           <div>
// //             <label className="block text-gray-700 font-medium mb-2">
// //               Nama Pengirim
// //             </label>
// //             <input
// //               type="text"
// //               name="namaPengirim"
// //               value={form.namaPengirim}
// //               onChange={(e) =>
// //                 setForm({ ...form, namaPengirim: e.target.value })
// //               }
// //               required
// //               placeholder="Masukkan nama pengirim pembayaran"
// //               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //               disabled={isSubmitting}
// //             />
// //           </div>

// //           {/* Catatan */}
// //           <div>
// //             <label className="block text-gray-700 font-medium mb-2">
// //               Catatan Tambahan
// //             </label>
// //             <textarea
// //               name="catatan"
// //               value={form.catatan}
// //               onChange={(e) => setForm({ ...form, catatan: e.target.value })}
// //               rows="3"
// //               placeholder="Tulis catatan tambahan (opsional)"
// //               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
// //               disabled={isSubmitting}
// //             ></textarea>
// //           </div>

// //           {/* Ringkasan Pembelian */}
// //           <div className="border-t pt-6">
// //             <h3 className="text-lg font-semibold text-gray-800 mb-4">
// //               Ringkasan Pembelian
// //             </h3>
// //             {safeCartItems.map((item) => (
// //               <div
// //                 key={item.id}
// //                 className="flex justify-between items-center text-gray-700 mb-2"
// //               >
// //                 <span>
// //                   {item.variant?.name}{" "}
// //                   <span className="text-sm text-gray-500">x{item.quantity}</span>
// //                 </span>
// //                 <span className="font-medium">
// //                   {formatRupiah((item.variant?.price || 0) * item.quantity)}
// //                 </span>
// //               </div>
// //             ))}
            
// //             <div className="border-t mt-4 pt-4 space-y-2">
// //               <div className="flex justify-between text-gray-700">
// //                 <span>Subtotal</span>
// //                 <span>{formatRupiah(subtotal)}</span>
// //               </div>
// //               <div className="flex justify-between text-gray-700">
// //                 <span>Biaya Admin ({paymentMethod === 'virtual_account' ? 'Rp 5.000' : '1%'})</span>
// //                 <span>{formatRupiah(adminFee)}</span>
// //               </div>
// //               <div className="flex justify-between mt-2 text-lg font-semibold">
// //                 <span>Total Pembayaran</span>
// //                 <span className="text-green-700">{formatRupiah(total)}</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Informasi Pembayaran */}
// //           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
// //             <p className="text-sm text-yellow-800">
// //               {paymentMethod === 'virtual_account' 
// //                 ? 'Setelah mengkonfirmasi, Anda akan diarahkan ke halaman pembayaran Virtual Account.'
// //                 : 'Setelah mengkonfirmasi, Anda akan diarahkan ke halaman pembayaran QRIS.'
// //               }
// //             </p>
// //           </div>

// //           {/* Tombol Submit */}
// //           <div className="pt-6 flex justify-end">
// //             <button
// //               type="submit"
// //               disabled={isSubmitting}
// //               className={`px-6 py-2.5 rounded-lg font-medium transition ${
// //                 isSubmitting 
// //                   ? "bg-gray-400 cursor-not-allowed text-white" 
// //                   : "bg-blue-600 hover:bg-blue-700 text-white"
// //               }`}
// //             >
// //               {isSubmitting 
// //                 ? "Memproses..." 
// //                 : paymentMethod === 'virtual_account' 
// //                   ? "Bayar dengan Virtual Account" 
// //                   : "Bayar dengan QRIS"
// //               }
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // const Keranjang = () => {
// //   const [expandedSellers, setExpandedSellers] = useState({});
// //   const [showCheckout, setShowCheckout] = useState(false);
// //   const navigate = useNavigate();
// //   const authUser = useAuthStore((state) => state.authUser);
  
// //   // Use Zustand stores
// //   const {
// //     cartItems,
// //     selectedCart,
// //     fetchCarts,
// //     removeCartItem,
// //     incrementCartItemQuantity,
// //     decrementCartItemQuantity,
// //     toggleCartSelection,
// //     toggleSellerSelection,
// //     clearSelectedCart,
// //   } = useCartStore();

// //   useEffect(() => {
// //     fetchCarts();
// //   }, [fetchCarts]);

// //   console.log("Cart Items:", cartItems);

// //   // Pastikan cartItems selalu array
// //   const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  
// //   // Group items by seller dengan safeCartItems
// //   const groupedItems = safeCartItems.reduce((acc, item) => {
// //     if (!item || !item.variant?.product) return acc;
    
// //     const sellerId = item.variant.product.user_id;
// //     if (!acc[sellerId]) {
// //       acc[sellerId] = {
// //         sellerName: item.variant.product.user?.nama || "Unknown Seller",
// //         items: [],
// //         subtotal: 0,
// //       };
// //     }
// //     acc[sellerId].items.push(item);
// //     acc[sellerId].subtotal += (item.variant?.price || 0) * (item.quantity || 0);
// //     return acc;
// //   }, {});

// //   console.log("Grouped Items:", groupedItems);

// //   useEffect(() => {
// //     if (
// //       safeCartItems.length > 0 &&
// //       Object.keys(expandedSellers).length === 0
// //     ) {
// //       const initialExpanded = {};
// //       Object.keys(groupedItems).forEach((sellerId) => {
// //         initialExpanded[sellerId] = true;
// //       });
// //       setExpandedSellers(initialExpanded);
// //     }
// //   }, [safeCartItems, groupedItems, expandedSellers]);

// //   const selectedSubtotal = Object.values(groupedItems || {}).reduce(
// //     (sum, seller) => {
// //       const sellerTotal = seller.items
// //         .filter(
// //           (item) =>
// //             selectedCart.some((cartItem) => cartItem.id === item.id) &&
// //             item.variant?.stock > 0 &&
// //             !item.variant?.is_delete
// //         )
// //         .reduce((s, item) => {
// //           const selectedItem = selectedCart.find(
// //             (cartItem) => cartItem.id === item.id
// //           );
// //           return (
// //             s + (item.variant?.price || 0) * (selectedItem?.quantity || item.quantity || 0)
// //           );
// //         }, 0);
// //       return sum + sellerTotal;
// //     },
// //     0
// //   );

// //   const handleToggleSeller = (sellerId) => {
// //     const seller = groupedItems[sellerId];

// //     const hasUnavailable = seller.items.some(
// //       (item) => item.variant?.stock <= 0 || item.variant?.is_delete
// //     );

// //     if (hasUnavailable) {
// //       toast.error(
// //         "Tidak bisa memilih seller karena ada produk yang tidak tersedia"
// //       );
// //       return;
// //     }

// //     toggleSellerSelection(sellerId);
// //   };

// //   const handleUnavailableClick = () => {
// //     toast.error("Produk ini tidak tersedia");
// //   };

// //   const handleCheckout = () => {
// //     if (selectedCart.length === 0) {
// //       toast.error("Pilih minimal satu produk untuk checkout");
// //       return;
// //     }
// //     setShowCheckout(true);
// //   };

// //   const handleCheckoutSuccess = () => {
// //     setShowCheckout(false);
// //     navigate("/user/history");
// //   };

// //   const totalAvailableItems = safeCartItems.filter(
// //     (item) => item.variant?.stock > 0 && !item.variant?.is_delete
// //   ).length;

// //   // Tampilkan komponen Pembayaran jika showCheckout true
// //   if (showCheckout) {
// //     return (
// //       <Pembayaran 
// //         cartItems={selectedCart} 
// //         onBack={() => setShowCheckout(false)}
// //         onSuccess={handleCheckoutSuccess}
// //       />
// //     );
// //   }

// //   if (safeCartItems.length === 0) {
// //     return (
// //       <>
// //         <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-700 font-['Poppins']">
// //           <img
// //             src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
// //             alt="Empty cart"
// //             className="w-44 mb-6 opacity-80"
// //           />
// //           <h2 className="text-2xl font-semibold mb-2">Keranjangmu masih kosong!</h2>
// //           <p className="text-gray-500 mb-5">Ayo belanja dan temukan produk terbaik!</p>
// //           <button
// //             onClick={() => navigate("/user/belanja")}
// //             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md transition transform hover:scale-[1.02]"
// //           >
// //             Belanja Sekarang
// //           </button>
// //         </div>
// //       </>
// //     );
// //   }

// //   return (
// //     <>
// //       <Toaster position="top-center" />
// //       <div className="container min-h-screen flex flex-col mx-auto p-4 pb-16 md:pb-0 md:mt-14">
// //         <div className="flex">
// //           <span>
// //             <button
// //               onClick={() => navigate(-1)}
// //               className="bg-none border-none cursor-pointer p-0"
// //             >
// //               <ArrowLeft className="fw-bold me-3 mt-1" />
// //             </button>
// //           </span>
// //           <span>
// //             <h1 className="text-2xl font-bold mb-6">
// //               Keranjang Saya{" "}
// //               <span className="text-blue-700"> ({totalAvailableItems})</span>
// //             </h1>
// //           </span>
// //         </div>

// //         {Object.entries(groupedItems || {}).map(([sellerId, seller]) => {
// //           const availableItems = seller.items.filter(
// //             (item) => item.variant?.stock > 0 && !item.variant?.is_delete
// //           );
          
// //           const allAvailableSelected = availableItems.length > 0 &&
// //             availableItems.every((item) =>
// //               selectedCart.some((selected) => selected.id === item.id)
// //             );

// //           const hasUnavailable = seller.items.some(
// //             (item) => item.variant?.stock <= 0 || item.variant?.is_delete
// //           );

// //           return (
// //             <div
// //               key={sellerId}
// //               className="bg-white rounded-lg shadow-md mb-6 p-4"
// //             >
// //               <div className="flex items-center justify-between mb-4">
// //                 <div className="flex items-center gap-2">
// //                   <Checkbox
// //                     checked={allAvailableSelected}
// //                     onCheckedChange={() => handleToggleSeller(sellerId)}
// //                     disabled={hasUnavailable || availableItems.length === 0}
// //                   />
// //                   <span className="font-semibold">{seller.sellerName}</span>
// //                   {hasUnavailable && (
// //                     <span className="text-red-500 text-sm ml-2">
// //                       (Ada produk yang tidak tersedia)
// //                     </span>
// //                   )}
// //                 </div>
// //                 <button
// //                   onClick={() =>
// //                     setExpandedSellers((prev) => ({
// //                       ...prev,
// //                       [sellerId]: !prev[sellerId],
// //                     }))
// //                   }
// //                   className="text-blue-700 hover:text-blue-900"
// //                 >
// //                   {expandedSellers[sellerId] ? "Sembunyikan" : "Lihat Detail"}
// //                 </button>
// //               </div>

// //               {expandedSellers[sellerId] &&
// //                 seller.items.map((item) => (
// //                   <CartItem
// //                     key={item.id}
// //                     item={item}
// //                     onRemove={() => removeCartItem(item.id)}
// //                     onIncrement={() => incrementCartItemQuantity(item.id)}
// //                     onDecrement={() => decrementCartItemQuantity(item.id)}
// //                     isSelected={selectedCart.some(
// //                       (cartItem) => cartItem.id === item.id
// //                     )}
// //                     onToggleSelect={() => toggleCartSelection(item)}
// //                     onOutOfStockClick={handleUnavailableClick}
// //                     navigate={navigate}
// //                   />
// //                 ))}
// //             </div>
// //           );
// //         })}

// //         <div className="bg-white rounded-lg shadow-md p-6 mt-6">
// //           <div className="flex justify-between items-center mb-4">
// //             <h2 className="text-xl font-bold">Total Belanja</h2>
// //             <div className="text-right">
// //               <p className="text-gray-600">
// //                 Total Item:{" "}
// //                 {
// //                   selectedCart.filter(
// //                     (item) =>
// //                       item.variant?.stock > 0 && !item.variant?.is_delete
// //                   ).length
// //                 }
// //               </p>
// //               <p className="text-2xl font-bold text-blue-700">
// //                 {new Intl.NumberFormat("id-ID", {
// //                   style: "currency",
// //                   currency: "IDR",
// //                 }).format(selectedSubtotal)}
// //               </p>
// //             </div>
// //           </div>

// //           {/* Tombol Checkout */}
// //           <button
// //             onClick={handleCheckout}
// //             disabled={selectedCart.length === 0}
// //             className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
// //               selectedCart.length === 0
// //                 ? "bg-gray-400 cursor-not-allowed"
// //                 : "bg-green-600 hover:bg-green-700"
// //             }`}
// //           >
// //             <div className="flex items-center justify-center gap-2">
// //               <CreditCard className="w-5 h-5" />
// //               <span>Checkout</span>
// //             </div>
// //           </button>
// //         </div>
// //       </div>

// //       <footer className="bg-gray-800 text-white py-4 text-xs mt-auto">
// //         <div className="container mx-auto px-4 text-center">
// //           <p>© 2025 All rights reserved.</p>
// //         </div>
// //       </footer>
// //     </>
// //   );
// // };

// // export default Keranjang;


// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, CreditCard, Truck, Banknote } from "lucide-react";
// import { Checkbox } from "../../components/ui/checkbox";
// import useAuthStore from "../../stores/useAuthStore";
// import useCartStore from "../../stores/useCartStore";
// import useOrderStore from "../../stores/useOrderStore";
// import toast, { Toaster } from "react-hot-toast";

// const CartItem = ({
//   item,
//   onRemove,
//   onIncrement,
//   onDecrement,
//   isSelected,
//   onToggleSelect,
//   navigate,
//   onOutOfStockClick,
// }) => {
//   const touchStartX = useRef(0);
//   const touchEndX = useRef(0);
//   const [swipeOffset, setSwipeOffset] = useState(0);
//   const [isSwiping, setIsSwiping] = useState(false);
//   const [showDelete, setShowDelete] = useState(false);
//   const itemRef = useRef(null);

//   const isOutOfStock = item.variant?.stock <= 0;
//   const isDeleted = item.variant?.is_delete;
//   const isUnavailable = isOutOfStock || isDeleted;

//   const handleIncrement = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     e.nativeEvent.stopImmediatePropagation();
//     onIncrement();
//   };

//   const handleDecrement = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     e.nativeEvent.stopImmediatePropagation();
//     onDecrement();
//   };

//   const handleTouchStart = (e) => {
//     touchStartX.current = e.touches[0].clientX;
//     setIsSwiping(true);
//   };

//   const handleTouchMove = (e) => {
//     if (!isSwiping) return;

//     touchEndX.current = e.touches[0].clientX;
//     const diff = touchStartX.current - touchEndX.current;

//     if (diff > 0) {
//       setSwipeOffset(Math.min(diff, 80));
//     } else if (diff < 0 && showDelete) {
//       setSwipeOffset(0);
//       setShowDelete(false);
//     }
//   };

//   const handleTouchEnd = () => {
//     setIsSwiping(false);

//     if (swipeOffset > 50 && !showDelete) {
//       setShowDelete(true);
//       setSwipeOffset(80);
//     } else if (swipeOffset < 50 && !showDelete) {
//       setSwipeOffset(0);
//     }
//   };

//   const handleMouseLeave = () => {
//     if (swipeOffset > 0 && !showDelete) {
//       setSwipeOffset(0);
//     }
//   };

//   const confirmDelete = () => {
//     if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
//       onRemove();
//       setShowDelete(false);
//       setSwipeOffset(0);
//     } else {
//       setShowDelete(false);
//       setSwipeOffset(0);
//     }
//   };

//   const handleToggleSelect = () => {
//     if (isUnavailable) {
//       onOutOfStockClick();
//       return;
//     }
//     onToggleSelect();
//   };

//   return (
//     <div
//       ref={itemRef}
//       className="relative mb-4 overflow-hidden"
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//       onMouseLeave={handleMouseLeave}
//     >
//       <div
//         className={`absolute right-0 top-0 h-full w-20 bg-red-500 flex items-center justify-center transition-transform duration-300 ${
//           showDelete ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <button onClick={confirmDelete} className="text-white font-bold">
//           HAPUS
//         </button>
//       </div>

//       <div
//         className={`flex items-center gap-4 p-2 border-b bg-white transition-transform duration-300 ${
//           isSwiping ? "cursor-grabbing" : "cursor-grab"
//         } ${isUnavailable ? "opacity-60" : ""}`}
//         style={{
//           transform: showDelete
//             ? "translateX(-80px)"
//             : `translateX(-${swipeOffset}px)`,
//         }}
//       >
//         <Checkbox
//           checked={isSelected}
//           onCheckedChange={handleToggleSelect}
//           disabled={isUnavailable}
//         />
//         <button
//           onClick={() =>
//             !isUnavailable &&
//             navigate(`/product-detail/${item.variant?.product?.id}/detail`)
//           }
//           className="flex-shrink-0"
//           disabled={isUnavailable}
//         >
//           <img
//             src={item.variant?.img_url || "https://via.placeholder.com/64"}
//             className="w-16 h-16 object-cover rounded"
//             alt={item.variant?.name || "Product"}
//           />
//         </button>
//         <div className="flex-1">
//           <h3 className="font-medium">{item.variant?.name || "Product"}</h3>
//           {isUnavailable && (
//             <div className="text-red-500 text-sm font-medium mt-1">
//               {isDeleted ? "Produk tidak tersedia" : "Stok Habis"}
//             </div>
//           )}
//           <div className="flex items-center gap-4 mt-2">
//             <p className="text-blue-700 font-bold">
//               {new Intl.NumberFormat("id-ID", {
//                 style: "currency",
//                 currency: "IDR",
//               }).format(item.variant?.price || 0)}
//             </p>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={handleDecrement}
//                 className={`px-2 py-1 border rounded transition ${
//                   isUnavailable
//                     ? "bg-gray-100 cursor-not-allowed text-gray-400"
//                     : "hover:bg-gray-100"
//                 }`}
//                 disabled={isUnavailable}
//               >
//                 -
//               </button>
//               <span
//                 className={`min-w-[20px] text-center ${
//                   isUnavailable ? "text-gray-400" : ""
//                 }`}
//               >
//                 {item.quantity}
//               </span>
//               <button
//                 onClick={handleIncrement}
//                 className={`px-2 py-1 border rounded transition ${
//                   isUnavailable
//                     ? "bg-gray-100 cursor-not-allowed text-gray-400"
//                     : "hover:bg-gray-100"
//                 }`}
//                 disabled={isUnavailable}
//               >
//                 +
//               </button>
//             </div>
//           </div>
//         </div>
//         <button
//           onClick={() => {
//             if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
//               onRemove();
//             }
//           }}
//           className={`text-red-500 hover:text-red-700 hidden md:block transition ${
//             isUnavailable
//               ? "text-gray-400 hover:text-gray-400 cursor-not-allowed"
//               : ""
//           }`}
//           disabled={isUnavailable}
//         >
//           Hapus
//         </button>
//       </div>
//     </div>
//   );
// };

// const PaymentMethodOption = ({ method, icon: Icon, title, description, selected, onClick }) => (
//   <div 
//     className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
//       selected 
//         ? 'border-green-500 bg-green-50' 
//         : 'border-gray-200 hover:border-gray-300'
//     }`}
//     onClick={onClick}
//   >
//     <div className="flex items-center gap-3">
//       <div className={`p-2 rounded-lg ${
//         selected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
//       }`}>
//         <Icon size={20} />
//       </div>
//       <div className="flex-1">
//         <h3 className="font-semibold text-gray-800">{title}</h3>
//         <p className="text-sm text-gray-600">{description}</p>
//       </div>
//       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//         selected ? 'border-green-500 bg-green-500' : 'border-gray-300'
//       }`}>
//         {selected && (
//           <div className="w-2 h-2 rounded-full bg-white"></div>
//         )}
//       </div>
//     </div>
//   </div>
// );

// const Pembayaran = ({ cartItems, onBack, onSuccess }) => {
//   const [form, setForm] = useState({
//     wbp_name: "",
//     wbp_room: "",
//     wbp_register_number: "",
//     wbp_sender: "",
//     note: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("");
  
//   const { createOrder } = useOrderStore();
//   const { removeCartItem, clearSelectedCart } = useCartStore();
//   const navigate = useNavigate();

//   const formatRupiah = (n) =>
//     "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

//   // Pastikan cartItems selalu array dan hitung total dengan aman
//   const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
//   const subtotal = safeCartItems.reduce((sum, item) => {
//     const price = item?.variant?.price || 0;
//     const quantity = item?.quantity || 0;
//     return sum + (price * quantity);
//   }, 0);

//   // TANPA BIAYA ADMIN
//   const total = subtotal;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Prepare data for order creation
//       const orderData = {
//         items: safeCartItems.map(item => ({
//           variant_id: item.variant?.id,
//           quantity: item.quantity
//         })),
//         payment_method: paymentMethod,
//         wbp_name: form.wbp_name,
//         wbp_room: form.wbp_room,
//         wbp_register_number: form.wbp_register_number,
//         wbp_sender: form.wbp_sender,
//         note: form.note
//       };

//       // Create order using useOrderStore
//       const result = await createOrder(orderData);

//       console.log("Order creation result:", result);

//       if (result.status === "success") {
//         // Hapus item dari cart
//         // safeCartItems.forEach(item => {
//         //   removeCartItem(item.id);
//         // });
//         // clearSelectedCart();

//         // Set notification for new transaction
//         localStorage.setItem("notifTransaksi", "true");

//         toast.success("✅ Pesanan berhasil dibuat!");
        
//         // Navigasi berdasarkan metode pembayaran
//         if (paymentMethod === 'COD') {
//           toast.success("Pesanan COD akan diproses. Silakan tunggu konfirmasi admin.");
//           navigate("/user/orders");
//         } else {
//           toast.success(
//             "Pesanan berhasil dibuat! Silakan lakukan transfer dan konfirmasi ke admin.\n\n" +
//             "Bank: BCA\n" +
//             "No. Rekening: 1234567890\n" +
//             "Atas Nama: Nama Toko",
//             { duration: 5000 }
//           );
//           navigate("/user/orders");
//         }
        
//         if (onSuccess) {
//           onSuccess();
//         }
//       } else {
//         toast.error(result.message || "Gagal membuat pesanan");
//       }
//     } catch (error) {
//       console.error("Order creation error:", error);
//       toast.error(error.message || "Terjadi kesalahan saat membuat pesanan");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-['Poppins']">
//       <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
//         <div className="flex items-center gap-3 mb-8">
//           <button
//             onClick={onBack}
//             className="bg-none border-none cursor-pointer p-0 mr-2"
//             disabled={isSubmitting}
//           >
//             <ArrowLeft className="w-6 h-6" />
//           </button>
//           <CreditCard className="w-8 h-8 text-green-600" />
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Formulir Pembayaran
//           </h2>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Pilihan Metode Pembayaran */}
//           <div className="border-b pb-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               Pilih Metode Pembayaran
//             </h3>
//             <div className="space-y-3">
//               {/* <PaymentMethodOption
//                 method="COD"
//                 icon={Truck}
//                 title="Cash on Delivery (COD)"
//                 description="Bayar saat barang diterima"
//                 selected={paymentMethod === 'COD'}
//                 onClick={() => setPaymentMethod('COD')}
//               /> */}
//               <PaymentMethodOption
//                 method="transfer"
//                 icon={Banknote}
//                 title="Transfer Manual"
//                 description="Transfer ke rekening bank, konfirmasi ke admin"
//                 selected={paymentMethod === 'transfer'}
//                 onClick={() => setPaymentMethod('transfer')}
//               />
//             </div>
            
//             {paymentMethod === 'transfer' && (
//               <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                 <h4 className="font-medium text-blue-800 mb-2">Instruksi Transfer:</h4>
//                 <p className="text-sm text-blue-700 whitespace-pre-line">
//                   Silakan lakukan transfer ke rekening berikut:
//                   {"\n"}Bank: BCA
//                   {"\n"}No. Rekening: 1234567890
//                   {"\n"}Atas Nama: Nama Toko
//                   {"\n\n"}Setelah transfer, harap konfirmasi ke admin melalui WhatsApp atau menu konfirmasi pembayaran.
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Input Data WBP */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-2">
//               Nama WBP <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="wbp_name"
//               value={form.wbp_name}
//               onChange={(e) => setForm({ ...form, wbp_name: e.target.value })}
//               required
//               placeholder="Masukkan nama lengkap WBP"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
//               disabled={isSubmitting}
//             />
//           </div>

//           {/* Input Blok dan Register */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Blok / Kamar <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="wbp_room"
//                 value={form.wbp_room}
//                 onChange={(e) => setForm({ ...form, wbp_room: e.target.value })}
//                 required
//                 placeholder="Contoh: Blok A-2"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
//                 disabled={isSubmitting}
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Nomor Register
//               </label>
//               <input
//                 type="text"
//                 name="wbp_register_number"
//                 value={form.wbp_register_number}
//                 onChange={(e) =>
//                   setForm({ ...form, wbp_register_number: e.target.value })
//                 }
//                 placeholder="Masukkan nomor register WBP"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
//                 disabled={isSubmitting}
//               />
//             </div>
//           </div>

//           {/* Nama Pengirim */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-2">
//               Nama Pengirim <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="wbp_sender"
//               value={form.wbp_sender}
//               onChange={(e) =>
//                 setForm({ ...form, wbp_sender: e.target.value })
//               }
//               required
//               placeholder="Masukkan nama pengirim pembayaran"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
//               disabled={isSubmitting}
//             />
//           </div>

//           {/* Catatan */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-2">
//               Catatan Tambahan
//             </label>
//             <textarea
//               name="note"
//               value={form.note}
//               onChange={(e) => setForm({ ...form, note: e.target.value })}
//               rows="3"
//               placeholder="Tulis catatan tambahan (opsional)"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
//               disabled={isSubmitting}
//             ></textarea>
//           </div>

//           {/* Ringkasan Pembelian */}
//           <div className="border-t pt-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               Ringkasan Pembelian
//             </h3>
//             {safeCartItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex justify-between items-center text-gray-700 mb-2"
//               >
//                 <span>
//                   {item.variant?.name || "Produk"}{" "}
//                   <span className="text-sm text-gray-500">x{item.quantity}</span>
//                 </span>
//                 <span className="font-medium">
//                   {formatRupiah((item.variant?.price || 0) * item.quantity)}
//                 </span>
//               </div>
//             ))}
            
//             <div className="border-t mt-4 pt-4 space-y-2">
//               <div className="flex justify-between text-gray-700">
//                 <span>Subtotal</span>
//                 <span>{formatRupiah(subtotal)}</span>
//               </div>
//               <div className="flex justify-between text-green-600">
//                 <span>Biaya Admin</span>
//                 <span>Gratis</span>
//               </div>
//               <div className="flex justify-between mt-2 text-lg font-semibold border-t border-gray-200 pt-3">
//                 <span>Total Pembayaran</span>
//                 <span className="text-green-700">{formatRupiah(total)}</span>
//               </div>
//             </div>
//           </div>

//           {/* Informasi Pembayaran */}
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <p className="text-sm text-yellow-800">
//               {paymentMethod === 'COD' 
//                 ? 'Pesanan COD akan diproses setelah Anda mengkonfirmasi. Silakan tunggu konfirmasi admin.'
//                 : 'Pesanan akan diproses setelah pembayaran dikonfirmasi oleh admin. Silakan lakukan transfer sesuai instruksi di atas.'
//               }
//             </p>
//           </div>

//           {/* Tombol Submit */}
//           <div className="pt-6 flex justify-end">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`px-6 py-2.5 rounded-lg font-medium transition ${
//                 isSubmitting 
//                   ? "bg-gray-400 cursor-not-allowed text-white" 
//                   : "bg-green-600 hover:bg-green-700 text-white"
//               }`}
//             >
//               {isSubmitting 
//                 ? "Memproses..." 
//                 : paymentMethod === 'COD' 
//                   ? "Konfirmasi Pesanan COD" 
//                   : "Konfirmasi Pesanan Transfer"
//               }
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const Keranjang = () => {
//   const [expandedSellers, setExpandedSellers] = useState({});
//   const [showCheckout, setShowCheckout] = useState(false);
//   const navigate = useNavigate();
//   const authUser = useAuthStore((state) => state.authUser);
  
//   // Use Zustand stores
//   const {
//     cartItems,
//     selectedCart,
//     fetchCarts,
//     removeCartItem,
//     incrementCartItemQuantity,
//     decrementCartItemQuantity,
//     toggleCartSelection,
//     toggleSellerSelection,
//     clearSelectedCart,
//   } = useCartStore();

//   useEffect(() => {
//     fetchCarts();
//   }, [fetchCarts]);

//   console.log("Cart Items:", cartItems);

//   // Pastikan cartItems selalu array
//   const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  
//   // Group items by seller dengan safeCartItems
//   const groupedItems = safeCartItems.reduce((acc, item) => {
//     if (!item || !item.variant?.product) return acc;
    
//     const sellerId = item.variant.product.user_id;
//     if (!acc[sellerId]) {
//       acc[sellerId] = {
//         sellerName: item.variant.product.user?.nama || "Unknown Seller",
//         items: [],
//         subtotal: 0,
//       };
//     }
//     acc[sellerId].items.push(item);
//     acc[sellerId].subtotal += (item.variant?.price || 0) * (item.quantity || 0);
//     return acc;
//   }, {});

//   console.log("Grouped Items:", groupedItems);

//   useEffect(() => {
//     if (
//       safeCartItems.length > 0 &&
//       Object.keys(expandedSellers).length === 0
//     ) {
//       const initialExpanded = {};
//       Object.keys(groupedItems).forEach((sellerId) => {
//         initialExpanded[sellerId] = true;
//       });
//       setExpandedSellers(initialExpanded);
//     }
//   }, [safeCartItems, groupedItems, expandedSellers]);

//   const selectedSubtotal = Object.values(groupedItems || {}).reduce(
//     (sum, seller) => {
//       const sellerTotal = seller.items
//         .filter(
//           (item) =>
//             selectedCart.some((cartItem) => cartItem.id === item.id) &&
//             item.variant?.stock > 0 &&
//             !item.variant?.is_delete
//         )
//         .reduce((s, item) => {
//           const selectedItem = selectedCart.find(
//             (cartItem) => cartItem.id === item.id
//           );
//           return (
//             s + (item.variant?.price || 0) * (selectedItem?.quantity || item.quantity || 0)
//           );
//         }, 0);
//       return sum + sellerTotal;
//     },
//     0
//   );

//   const handleToggleSeller = (sellerId) => {
//     const seller = groupedItems[sellerId];

//     const hasUnavailable = seller.items.some(
//       (item) => item.variant?.stock <= 0 || item.variant?.is_delete
//     );

//     if (hasUnavailable) {
//       toast.error(
//         "Tidak bisa memilih seller karena ada produk yang tidak tersedia"
//       );
//       return;
//     }

//     toggleSellerSelection(sellerId);
//   };

//   const handleUnavailableClick = () => {
//     toast.error("Produk ini tidak tersedia");
//   };

//   const handleCheckout = () => {
//     if (selectedCart.length === 0) {
//       toast.error("Pilih minimal satu produk untuk checkout");
//       return;
//     }
    
//     // Cek jika ada produk yang tidak tersedia
//     const hasUnavailable = selectedCart.some(
//       (item) => item.variant?.stock <= 0 || item.variant?.is_delete
//     );
    
//     if (hasUnavailable) {
//       toast.error("Tidak bisa checkout karena ada produk yang tidak tersedia");
//       return;
//     }
    
//     setShowCheckout(true);
//   };

//   const handleCheckoutSuccess = () => {
//     setShowCheckout(false);
//     navigate("/user/orders");
//   };

//   const totalAvailableItems = safeCartItems.filter(
//     (item) => item.variant?.stock > 0 && !item.variant?.is_delete
//   ).length;

//   // Tampilkan komponen Pembayaran jika showCheckout true
//   if (showCheckout) {
//     return (
//       <Pembayaran 
//         cartItems={selectedCart} 
//         onBack={() => setShowCheckout(false)}
//         onSuccess={handleCheckoutSuccess}
//       />
//     );
//   }

//   if (safeCartItems.length === 0) {
//     return (
//       <>
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-700 font-['Poppins']">
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
//             alt="Empty cart"
//             className="w-44 mb-6 opacity-80"
//           />
//           <h2 className="text-2xl font-semibold mb-2">Keranjangmu masih kosong!</h2>
//           <p className="text-gray-500 mb-5">Ayo belanja dan temukan produk terbaik!</p>
//           <button
//             onClick={() => navigate("/user/belanja")}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md transition transform hover:scale-[1.02]"
//           >
//             Belanja Sekarang
//           </button>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Toaster position="top-center" />
//       <div className="container min-h-screen flex flex-col mx-auto p-4 pb-16 md:pb-0 md:mt-14">
//         <div className="flex">
//           <span>
//             <button
//               onClick={() => navigate(-1)}
//               className="bg-none border-none cursor-pointer p-0"
//             >
//               <ArrowLeft className="fw-bold me-3 mt-1" />
//             </button>
//           </span>
//           <span>
//             <h1 className="text-2xl font-bold mb-6">
//               Keranjang Saya{" "}
//               <span className="text-blue-700"> ({totalAvailableItems})</span>
//             </h1>
//           </span>
//         </div>

//         {Object.entries(groupedItems || {}).map(([sellerId, seller]) => {
//           const availableItems = seller.items.filter(
//             (item) => item.variant?.stock > 0 && !item.variant?.is_delete
//           );
          
//           const allAvailableSelected = availableItems.length > 0 &&
//             availableItems.every((item) =>
//               selectedCart.some((selected) => selected.id === item.id)
//             );

//           const hasUnavailable = seller.items.some(
//             (item) => item.variant?.stock <= 0 || item.variant?.is_delete
//           );

//           return (
//             <div
//               key={sellerId}
//               className="bg-white rounded-lg shadow-md mb-6 p-4"
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-2">
//                   <Checkbox
//                     checked={allAvailableSelected}
//                     onCheckedChange={() => handleToggleSeller(sellerId)}
//                     disabled={hasUnavailable || availableItems.length === 0}
//                   />
//                   <span className="font-semibold">{seller.sellerName}</span>
//                   {hasUnavailable && (
//                     <span className="text-red-500 text-sm ml-2">
//                       (Ada produk yang tidak tersedia)
//                     </span>
//                   )}
//                 </div>
//                 <button
//                   onClick={() =>
//                     setExpandedSellers((prev) => ({
//                       ...prev,
//                       [sellerId]: !prev[sellerId],
//                     }))
//                   }
//                   className="text-blue-700 hover:text-blue-900"
//                 >
//                   {expandedSellers[sellerId] ? "Sembunyikan" : "Lihat Detail"}
//                 </button>
//               </div>

//               {expandedSellers[sellerId] &&
//                 seller.items.map((item) => (
//                   <CartItem
//                     key={item.id}
//                     item={item}
//                     onRemove={() => removeCartItem(item.id)}
//                     onIncrement={() => incrementCartItemQuantity(item.id)}
//                     onDecrement={() => decrementCartItemQuantity(item.id)}
//                     isSelected={selectedCart.some(
//                       (cartItem) => cartItem.id === item.id
//                     )}
//                     onToggleSelect={() => toggleCartSelection(item)}
//                     onOutOfStockClick={handleUnavailableClick}
//                     navigate={navigate}
//                   />
//                 ))}
//             </div>
//           );
//         })}

//         <div className="bg-white rounded-lg shadow-md p-6 mt-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold">Total Belanja</h2>
//             <div className="text-right">
//               <p className="text-gray-600">
//                 Total Item:{" "}
//                 {
//                   selectedCart.filter(
//                     (item) =>
//                       item.variant?.stock > 0 && !item.variant?.is_delete
//                   ).length
//                 }
//               </p>
//               <p className="text-2xl font-bold text-blue-700">
//                 {new Intl.NumberFormat("id-ID", {
//                   style: "currency",
//                   currency: "IDR",
//                 }).format(selectedSubtotal)}
//               </p>
//             </div>
//           </div>

//           {/* Informasi Tanpa Biaya Admin */}
//           <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
//             <p className="text-sm text-green-800">
//               <span className="font-semibold">Gratis biaya admin!</span> Total yang dibayarkan sama dengan subtotal.
//             </p>
//           </div>

//           {/* Tombol Checkout */}
//           <button
//             onClick={handleCheckout}
//             disabled={selectedCart.length === 0}
//             className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
//               selectedCart.length === 0
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-green-600 hover:bg-green-700"
//             }`}
//           >
//             <div className="flex items-center justify-center gap-2">
//               <CreditCard className="w-5 h-5" />
//               <span>Checkout ({selectedCart.length} produk)</span>
//             </div>
//           </button>
//         </div>
//       </div>

//       <footer className="bg-gray-800 text-white py-4 text-xs mt-auto">
//         <div className="container mx-auto px-4 text-center">
//           <p>© 2025 All rights reserved.</p>
//         </div>
//       </footer>
//     </>
//   );
// };

// export default Keranjang;


import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, CreditCard, Truck, Banknote, AlertCircle } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import useAuthStore from "../../stores/useAuthStore";
import useCartStore from "../../stores/useCartStore";
import useOrderStore from "../../stores/useOrderStore";
import toast, { Toaster } from "react-hot-toast";

const CartItem = ({
  item,
  onRemove,
  onIncrement,
  onDecrement,
  isSelected,
  onToggleSelect,
  navigate,
  onOutOfStockClick,
}) => {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const itemRef = useRef(null);

  const isOutOfStock = item.variant?.stock <= 0;
  const isDeleted = item.variant?.is_delete;
  const isUnavailable = isOutOfStock || isDeleted;

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onIncrement();
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onDecrement();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;

    touchEndX.current = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;

    if (diff > 0) {
      setSwipeOffset(Math.min(diff, 80));
    } else if (diff < 0 && showDelete) {
      setSwipeOffset(0);
      setShowDelete(false);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);

    if (swipeOffset > 50 && !showDelete) {
      setShowDelete(true);
      setSwipeOffset(80);
    } else if (swipeOffset < 50 && !showDelete) {
      setSwipeOffset(0);
    }
  };

  const handleMouseLeave = () => {
    if (swipeOffset > 0 && !showDelete) {
      setSwipeOffset(0);
    }
  };

  const confirmDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      onRemove();
      setShowDelete(false);
      setSwipeOffset(0);
    } else {
      setShowDelete(false);
      setSwipeOffset(0);
    }
  };

  const handleToggleSelect = () => {
    if (isUnavailable) {
      onOutOfStockClick();
      return;
    }
    onToggleSelect();
  };

  return (
    <div
      ref={itemRef}
      className="relative mb-4 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`absolute right-0 top-0 h-full w-20 bg-red-500 flex items-center justify-center transition-transform duration-300 ${
          showDelete ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button onClick={confirmDelete} className="text-white font-bold">
          HAPUS
        </button>
      </div>

      <div
        className={`flex items-center gap-4 p-2 border-b bg-white transition-transform duration-300 ${
          isSwiping ? "cursor-grabbing" : "cursor-grab"
        } ${isUnavailable ? "opacity-60" : ""}`}
        style={{
          transform: showDelete
            ? "translateX(-80px)"
            : `translateX(-${swipeOffset}px)`,
        }}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleToggleSelect}
          disabled={isUnavailable}
        />
        <button
          onClick={() =>
            !isUnavailable &&
            navigate(`/product-detail/${item.variant?.product?.id}/detail`)
          }
          className="flex-shrink-0"
          disabled={isUnavailable}
        >
          <img
            src={item.variant?.img_url || "https://via.placeholder.com/64"}
            className="w-16 h-16 object-cover rounded"
            alt={item.variant?.name || "Product"}
          />
        </button>
        <div className="flex-1">
          <h3 className="font-medium">{item.variant?.name || "Product"}</h3>
          {isUnavailable && (
            <div className="text-red-500 text-sm font-medium mt-1">
              {isDeleted ? "Produk tidak tersedia" : "Stok Habis"}
            </div>
          )}
          <div className="flex items-center gap-4 mt-2">
            <p className="text-blue-700 font-bold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(item.variant?.price || 0)}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                className={`px-2 py-1 border rounded transition ${
                  isUnavailable
                    ? "bg-gray-100 cursor-not-allowed text-gray-400"
                    : "hover:bg-gray-100"
                }`}
                disabled={isUnavailable}
              >
                -
              </button>
              <span
                className={`min-w-[20px] text-center ${
                  isUnavailable ? "text-gray-400" : ""
                }`}
              >
                {item.quantity}
              </span>
              <button
                onClick={handleIncrement}
                className={`px-2 py-1 border rounded transition ${
                  isUnavailable
                    ? "bg-gray-100 cursor-not-allowed text-gray-400"
                    : "hover:bg-gray-100"
                }`}
                disabled={isUnavailable}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
              onRemove();
            }
          }}
          className={`text-red-500 hover:text-red-700 hidden md:block transition ${
            isUnavailable
              ? "text-gray-400 hover:text-gray-400 cursor-not-allowed"
              : ""
          }`}
          disabled={isUnavailable}
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

const PaymentMethodOption = ({ method, icon: Icon, title, description, selected, onClick }) => (
  <div 
    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
      selected 
        ? 'border-green-500 bg-green-50' 
        : 'border-gray-200 hover:border-gray-300'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${
        selected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
      }`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        selected ? 'border-green-500 bg-green-500' : 'border-gray-300'
      }`}>
        {selected && (
          <div className="w-2 h-2 rounded-full bg-white"></div>
        )}
      </div>
    </div>
  </div>
);

const Pembayaran = ({ cartItems, onBack, onSuccess }) => {
  const [form, setForm] = useState({
    wbp_name: "",
    wbp_room: "",
    wbp_register_number: "",
    wbp_sender: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [error, setError] = useState(null);
  
  const { createOrder } = useOrderStore();
  const { removeCartItem, clearSelectedCart } = useCartStore();
  const navigate = useNavigate();

  const formatRupiah = (n) =>
    "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Pastikan cartItems selalu array dan hitung total dengan aman
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const subtotal = safeCartItems.reduce((sum, item) => {
    const price = item?.variant?.price || 0;
    const quantity = item?.quantity || 0;
    return sum + (price * quantity);
  }, 0);

  // TANPA BIAYA ADMIN
  const total = subtotal;

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setError(null);

  //   // Validasi form
  //   if (!form.wbp_name.trim()) {
  //     setError("Nama WBP wajib diisi");
  //     setIsSubmitting(false);
  //     toast.error("Nama WBP wajib diisi");
  //     return;
  //   }

  //   if (!form.wbp_room.trim()) {
  //     setError("Blok/Kamar wajib diisi");
  //     setIsSubmitting(false);
  //     toast.error("Blok/Kamar wajib diisi");
  //     return;
  //   }

  //   if (!form.wbp_sender.trim()) {
  //     setError("Nama Pengirim wajib diisi");
  //     setIsSubmitting(false);
  //     toast.error("Nama Pengirim wajib diisi");
  //     return;
  //   }

  //   if (!paymentMethod) {
  //     setError("Pilih metode pembayaran");
  //     setIsSubmitting(false);
  //     toast.error("Pilih metode pembayaran");
  //     return;
  //   }

  //   try {
  //     // Prepare data for order creation
  //     const orderData = {
  //       items: safeCartItems.map(item => ({
  //         variant_id: item.variant?.id,
  //         quantity: item.quantity
  //       })),
  //       payment_method: paymentMethod,
  //       wbp_name: form.wbp_name.trim(),
  //       wbp_room: form.wbp_room.trim(),
  //       wbp_register_number: form.wbp_register_number.trim(),
  //       wbp_sender: form.wbp_sender.trim(),
  //       note: form.note.trim()
  //     };

  //     console.log("Creating order with data:", orderData);

  //     // Create order using useOrderStore
  //     const result = await createOrder(orderData);

  //     console.log("Order creation result:", result);

  //     if (result.status === "success") {
  //       // Hapus item dari cart
  //       // safeCartItems.forEach(item => {
  //       //   removeCartItem(item.id);
  //       // });
  //       // clearSelectedCart();

  //       // Set notification for new transaction
  //       localStorage.setItem("notifTransaksi", "true");

  //       toast.success("✅ Pesanan berhasil dibuat!");
  //       console.log("Navigating to payment page for order ID:", result.data.order_id);
  //       navigate(`/payment/${result.data.order_id}`);
        
  //       // Navigasi berdasarkan metode pembayaran
  //       if (paymentMethod === 'COD') {
  //         toast.success("Pesanan COD akan diproses. Silakan tunggu konfirmasi admin.");
  //         navigate("/user/orders");
  //       } else {
  //         toast.success(
  //           "Pesanan berhasil dibuat! Silakan lakukan transfer dan konfirmasi ke admin.",
  //           { duration: 5000 }
  //         );
  //         // navigate("/user/orders");
  //         navigate(`/payment/${result.data.order_id}`);
  //       }
        
  //       if (onSuccess) {
  //         onSuccess();
  //       }
  //     } else {
  //       // Tampilkan error dari server
  //       const errorMessage = result.message || "Gagal membuat pesanan";
  //       setError(errorMessage);
  //       toast.error(errorMessage);
  //     }
  //   } catch (error) {
  //     console.error("Order creation error:", error);
      
  //     // Extract error message from various possible formats
  //     let errorMessage = "Terjadi kesalahan saat membuat pesanan";
      
  //     if (error.response) {
  //       // Server responded with error status
  //       if (error.response.data) {
  //         if (typeof error.response.data === 'string') {
  //           errorMessage = error.response.data;
  //         } else if (error.response.data.message) {
  //           errorMessage = error.response.data.message;
  //         } else if (error.response.data.error) {
  //           errorMessage = error.response.data.error;
  //         }
  //       }
  //       errorMessage += ` (Status: ${error.response.status})`;
  //     } else if (error.request) {
  //       // Request was made but no response received
  //       errorMessage = "Tidak ada respons dari server. Periksa koneksi internet Anda.";
  //     } else {
  //       // Something else happened
  //       errorMessage = error.message || errorMessage;
  //     }
      
  //     setError(errorMessage);
  //     toast.error(errorMessage);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  // Validasi form
  if (!form.wbp_name.trim()) {
    setError("Nama WBP wajib diisi");
    setIsSubmitting(false);
    toast.error("Nama WBP wajib diisi");
    return;
  }

  if (!form.wbp_room.trim()) {
    setError("Blok/Kamar wajib diisi");
    setIsSubmitting(false);
    toast.error("Blok/Kamar wajib diisi");
    return;
  }

  if (!form.wbp_sender.trim()) {
    setError("Nama Pengirim wajib diisi");
    setIsSubmitting(false);
    toast.error("Nama Pengirim wajib diisi");
    return;
  }

  if (!paymentMethod) {
    setError("Pilih metode pembayaran");
    setIsSubmitting(false);
    toast.error("Pilih metode pembayaran");
    return;
  }

  try {
    // Prepare data for order creation
    const orderData = {
      items: safeCartItems.map(item => ({
        variant_id: item.variant?.id,
        quantity: item.quantity
      })),
      payment_method: paymentMethod,
      wbp_name: form.wbp_name.trim(),
      wbp_room: form.wbp_room.trim(),
      wbp_register_number: form.wbp_register_number.trim(),
      wbp_sender: form.wbp_sender.trim(),
      note: form.note.trim()
    };

    console.log("Creating order with data:", orderData);

    // Create order using useOrderStore
    const result = await createOrder(orderData);

    console.log("Order creation result:", result);

    if (result.status === "success") {
      // Hapus item dari cart yang berhasil di-order
      // safeCartItems.forEach(item => {
      //   removeCartItem(item.id);
      // });
      // clearSelectedCart();

      // Set notification for new transaction
      localStorage.setItem("notifTransaksi", "true");

      toast.success("✅ Pesanan berhasil dibuat!");
      
      // HANYA SATU navigate() YANG DIPANGGIL
      console.log("Order ID created:", result.data.order_id);
      
      if (onSuccess) {
        onSuccess();
      }
      navigate(`/user/payment/${result.data.order_id}`);
      
      // Tunggu sebentar agar toast terlihat, lalu redirect
      // setTimeout(() => {
      //   navigate(`/payment/${result.data.order_id}`);
      // }, 1500);
      
    } else {
      // Tampilkan error dari server
      const errorMessage = result.message || "Gagal membuat pesanan";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  } catch (error) {
    console.error("Order creation error:", error);
    
    // Extract error message from various possible formats
    let errorMessage = "Terjadi kesalahan saat membuat pesanan";
    
    if (error.response) {
      // Server responded with error status
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      errorMessage += ` (Status: ${error.response.status})`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "Tidak ada respons dari server. Periksa koneksi internet Anda.";
    } else {
      // Something else happened
      errorMessage = error.message || errorMessage;
    }
    
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-['Poppins']">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="bg-none border-none cursor-pointer p-0 mr-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <CreditCard className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Formulir Pembayaran
          </h2>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800 mb-1">Terjadi Kesalahan</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pilihan Metode Pembayaran */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Pilih Metode Pembayaran <span className="text-red-500">*</span>
            </h3>
            <div className="space-y-3">
              {/* <PaymentMethodOption
                method="COD"
                icon={Truck}
                title="Cash on Delivery (COD)"
                description="Bayar saat barang diterima"
                selected={paymentMethod === 'COD'}
                onClick={() => setPaymentMethod('COD')}
              /> */}
              <PaymentMethodOption
                method="transfer"
                icon={Banknote}
                title="Transfer Manual"
                description="Transfer ke rekening bank, konfirmasi ke admin"
                selected={paymentMethod === 'transfer'}
                onClick={() => setPaymentMethod('transfer')}
              />
            </div>
            
            {paymentMethod === 'transfer' && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Instruksi Transfer:</h4>
                <p className="text-sm text-blue-700 whitespace-pre-line">
                  Silakan lakukan transfer ke rekening berikut:
                  {"\n"}Bank: BCA
                  {"\n"}No. Rekening: 1234567890
                  {"\n"}Atas Nama: Nama Toko
                  {"\n\n"}Setelah transfer, harap konfirmasi ke admin melalui WhatsApp atau menu konfirmasi pembayaran.
                </p>
              </div>
            )}
          </div>

          {/* Input Data WBP */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nama WBP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="wbp_name"
              value={form.wbp_name}
              onChange={(e) => {
                setForm({ ...form, wbp_name: e.target.value });
                setError(null); // Clear error when user types
              }}
              required
              placeholder="Masukkan nama lengkap WBP"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none ${
                error && !form.wbp_name.trim() ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            />
          </div>

          {/* Input Blok dan Register */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Blok / Kamar <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="wbp_room"
                value={form.wbp_room}
                onChange={(e) => {
                  setForm({ ...form, wbp_room: e.target.value });
                  setError(null);
                }}
                required
                placeholder="Contoh: Blok A-2"
                className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none ${
                  error && !form.wbp_room.trim() ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nomor Register
              </label>
              <input
                type="text"
                name="wbp_register_number"
                value={form.wbp_register_number}
                onChange={(e) => {
                  setForm({ ...form, wbp_register_number: e.target.value });
                  setError(null);
                }}
                placeholder="Masukkan nomor register WBP"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Nama Pengirim */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nama Pengirim <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="wbp_sender"
              value={form.wbp_sender}
              onChange={(e) => {
                setForm({ ...form, wbp_sender: e.target.value });
                setError(null);
              }}
              required
              placeholder="Masukkan nama pengirim pembayaran"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none ${
                error && !form.wbp_sender.trim() ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            />
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Catatan Tambahan
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={(e) => {
                setForm({ ...form, note: e.target.value });
                setError(null);
              }}
              rows="3"
              placeholder="Tulis catatan tambahan (opsional)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              disabled={isSubmitting}
            ></textarea>
          </div>

          {/* Ringkasan Pembelian */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Ringkasan Pembelian
            </h3>
            {safeCartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-gray-700 mb-2"
              >
                <span>
                  {item.variant?.name || "Produk"}{" "}
                  <span className="text-sm text-gray-500">x{item.quantity}</span>
                </span>
                <span className="font-medium">
                  {formatRupiah((item.variant?.price || 0) * item.quantity)}
                </span>
              </div>
            ))}
            
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Biaya Admin</span>
                <span>Gratis</span>
              </div>
              <div className="flex justify-between mt-2 text-lg font-semibold border-t border-gray-200 pt-3">
                <span>Total Pembayaran</span>
                <span className="text-green-700">{formatRupiah(total)}</span>
              </div>
            </div>
          </div>

          {/* Informasi Pembayaran */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              {paymentMethod === 'COD' 
                ? 'Pesanan COD akan diproses setelah Anda mengkonfirmasi. Silakan tunggu konfirmasi admin.'
                : 'Pesanan akan diproses setelah pembayaran dikonfirmasi oleh admin. Silakan lakukan transfer sesuai instruksi di atas.'
              }
            </p>
          </div>

          {/* Tombol Submit */}
          <div className="pt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-lg font-medium transition ${
                isSubmitting 
                  ? "bg-gray-400 cursor-not-allowed text-white" 
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </div>
              ) : paymentMethod === 'COD' 
                ? "Konfirmasi Pesanan COD" 
                : "Konfirmasi Pesanan Transfer"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Keranjang = () => {
  const [expandedSellers, setExpandedSellers] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartError, setCartError] = useState(null);
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);
  
  // Use Zustand stores
  const {
    cartItems,
    selectedCart,
    fetchCarts,
    removeCartItem,
    incrementCartItemQuantity,
    decrementCartItemQuantity,
    toggleCartSelection,
    toggleSellerSelection,
    clearSelectedCart,
  } = useCartStore();

  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        setCartError(null);
        await fetchCarts();
      } catch (error) {
        console.error("Error loading cart:", error);
        setCartError("Gagal memuat keranjang. Silakan coba lagi.");
        toast.error("Gagal memuat keranjang. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [fetchCarts]);

  // Pastikan cartItems selalu array
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  
  // Group items by seller dengan safeCartItems
  const groupedItems = safeCartItems.reduce((acc, item) => {
    if (!item || !item.variant?.product) return acc;
    
    const sellerId = item.variant.product.user_id;
    if (!acc[sellerId]) {
      acc[sellerId] = {
        sellerName: item.variant.product.user?.nama || "Unknown Seller",
        items: [],
        subtotal: 0,
      };
    }
    acc[sellerId].items.push(item);
    acc[sellerId].subtotal += (item.variant?.price || 0) * (item.quantity || 0);
    return acc;
  }, {});

  useEffect(() => {
    if (
      safeCartItems.length > 0 &&
      Object.keys(expandedSellers).length === 0
    ) {
      const initialExpanded = {};
      Object.keys(groupedItems).forEach((sellerId) => {
        initialExpanded[sellerId] = true;
      });
      setExpandedSellers(initialExpanded);
    }
  }, [safeCartItems, groupedItems, expandedSellers]);

  const selectedSubtotal = Object.values(groupedItems || {}).reduce(
    (sum, seller) => {
      const sellerTotal = seller.items
        .filter(
          (item) =>
            selectedCart.some((cartItem) => cartItem.id === item.id) &&
            item.variant?.stock > 0 &&
            !item.variant?.is_delete
        )
        .reduce((s, item) => {
          const selectedItem = selectedCart.find(
            (cartItem) => cartItem.id === item.id
          );
          return (
            s + (item.variant?.price || 0) * (selectedItem?.quantity || item.quantity || 0)
          );
        }, 0);
      return sum + sellerTotal;
    },
    0
  );

  const handleToggleSeller = (sellerId) => {
    const seller = groupedItems[sellerId];

    const hasUnavailable = seller.items.some(
      (item) => item.variant?.stock <= 0 || item.variant?.is_delete
    );

    if (hasUnavailable) {
      toast.error(
        "Tidak bisa memilih seller karena ada produk yang tidak tersedia"
      );
      return;
    }

    toggleSellerSelection(sellerId);
  };

  const handleUnavailableClick = () => {
    toast.error("Produk ini tidak tersedia");
  };

  const handleCheckout = () => {
    if (selectedCart.length === 0) {
      toast.error("Pilih minimal satu produk untuk checkout");
      return;
    }
    
    // Cek jika ada produk yang tidak tersedia
    const hasUnavailable = selectedCart.some(
      (item) => item.variant?.stock <= 0 || item.variant?.is_delete
    );
    
    if (hasUnavailable) {
      toast.error("Tidak bisa checkout karena ada produk yang tidak tersedia");
      return;
    }
    
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    navigate("/user/orders");
  };

  const totalAvailableItems = safeCartItems.filter(
    (item) => item.variant?.stock > 0 && !item.variant?.is_delete
  ).length;

  // Tampilkan komponen Pembayaran jika showCheckout true
  if (showCheckout) {
    return (
      <Pembayaran 
        cartItems={selectedCart} 
        onBack={() => setShowCheckout(false)}
        onSuccess={handleCheckoutSuccess}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Memuat keranjang...</p>
      </div>
    );
  }

  // Error state
  if (cartError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Gagal Memuat Keranjang</h2>
        <p className="text-gray-600 text-center mb-6">{cartError}</p>
        <button
          // onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (safeCartItems.length === 0) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-700 font-['Poppins']">
          <img
            src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
            alt="Empty cart"
            className="w-44 mb-6 opacity-80"
          />
          <h2 className="text-2xl font-semibold mb-2">Keranjangmu masih kosong!</h2>
          <p className="text-gray-500 mb-5">Ayo belanja dan temukan produk terbaik!</p>
          <button
            onClick={() => navigate("/user/belanja")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md transition transform hover:scale-[1.02]"
          >
            Belanja Sekarang
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="container min-h-screen flex flex-col mx-auto p-4 pb-16 md:pb-0 md:mt-14">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-none border-none cursor-pointer p-0 mr-3"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">
            Keranjang Saya{" "}
            <span className="text-blue-700">({totalAvailableItems})</span>
          </h1>
        </div>

        {Object.entries(groupedItems || {}).map(([sellerId, seller]) => {
          const availableItems = seller.items.filter(
            (item) => item.variant?.stock > 0 && !item.variant?.is_delete
          );
          
          const allAvailableSelected = availableItems.length > 0 &&
            availableItems.every((item) =>
              selectedCart.some((selected) => selected.id === item.id)
            );

          const hasUnavailable = seller.items.some(
            (item) => item.variant?.stock <= 0 || item.variant?.is_delete
          );

          return (
            <div
              key={sellerId}
              className="bg-white rounded-lg shadow-md mb-6 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allAvailableSelected}
                    onCheckedChange={() => handleToggleSeller(sellerId)}
                    disabled={hasUnavailable || availableItems.length === 0}
                  />
                  <span className="font-semibold">{seller.sellerName}</span>
                  {hasUnavailable && (
                    <span className="text-red-500 text-sm ml-2">
                      (Ada produk yang tidak tersedia)
                    </span>
                  )}
                </div>
                <button
                  onClick={() =>
                    setExpandedSellers((prev) => ({
                      ...prev,
                      [sellerId]: !prev[sellerId],
                    }))
                  }
                  className="text-blue-700 hover:text-blue-900 text-sm"
                >
                  {expandedSellers[sellerId] ? "Sembunyikan" : "Lihat Detail"}
                </button>
              </div>

              {expandedSellers[sellerId] &&
                seller.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={() => removeCartItem(item.id)}
                    onIncrement={() => incrementCartItemQuantity(item.id)}
                    onDecrement={() => decrementCartItemQuantity(item.id)}
                    isSelected={selectedCart.some(
                      (cartItem) => cartItem.id === item.id
                    )}
                    onToggleSelect={() => toggleCartSelection(item)}
                    onOutOfStockClick={handleUnavailableClick}
                    navigate={navigate}
                  />
                ))}
            </div>
          );
        })}

        <div className="bg-white rounded-lg shadow-md p-6 mt-6 sticky bottom-0 z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Total Belanja</h2>
            <div className="text-right">
              <p className="text-gray-600">
                Total Item:{" "}
                {
                  selectedCart.filter(
                    (item) =>
                      item.variant?.stock > 0 && !item.variant?.is_delete
                  ).length
                }
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(selectedSubtotal)}
              </p>
            </div>
          </div>

          {/* Informasi Tanpa Biaya Admin */}
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Gratis biaya admin!</span> Total yang dibayarkan sama dengan subtotal.
            </p>
          </div>

          {/* Tombol Checkout */}
          <button
            onClick={handleCheckout}
            disabled={selectedCart.length === 0}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
              selectedCart.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span>Checkout ({selectedCart.length} produk)</span>
            </div>
          </button>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-4 text-xs mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Keranjang;