// CategoryList.js
import React, { useEffect, useState } from 'react';
import useCategoryStore from '../../../stores/useCategoryStore';
import { Link } from 'react-router-dom';

const CategoryList = () => {
    const { categories, isLoading, fetchCategories, deleteCategory } = useCategoryStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteCategory(id);
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setDeletingId(null);
        }
    };

    // Warna avatar otomatis berdasarkan nama kategori
    const getAvatarColor = (name) => {
        const colors = [
            { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
            { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
            { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
            { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
            { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
            { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Memuat kategori...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">
                            Manajemen
                        </p>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Kategori Produk
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {categories.length} kategori terdaftar
                        </p>
                    </div>
                    <Link
                        to="/dashboard/categories/add"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 shadow-sm hover:shadow-md"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Kategori
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="relative w-full sm:w-80">
                            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Cari nama atau deskripsi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 placeholder-gray-400 transition-all"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Menampilkan</span>
                            <span className="font-semibold text-gray-700 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-lg">
                                {filteredCategories.length}
                            </span>
                            <span className="text-gray-400">dari {categories.length} kategori</span>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {filteredCategories.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {searchTerm ? 'Tidak ada hasil' : 'Belum ada kategori'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {searchTerm
                                ? `Tidak ada kategori yang cocok dengan "${searchTerm}"`
                                : 'Mulai dengan menambahkan kategori pertama Anda'}
                        </p>
                        {!searchTerm && (
                            <Link
                                to="/dashboard/categories/add"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Kategori
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCategories.map((category) => {
                            const color = getAvatarColor(category.name);
                            const productCount = category.product?.length || 0;
                            return (
                                <div
                                    key={category.id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group"
                                >
                                    <div className="p-5">
                                        {/* Top Row */}
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            {/* Avatar Inisial */}
                                            <div className={`w-10 h-10 rounded-xl ${color.bg} ${color.border} border flex items-center justify-center flex-shrink-0`}>
                                                <span className={`text-sm font-bold ${color.text}`}>
                                                    {category.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            {/* Badge produk */}
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                productCount > 0
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {productCount} produk
                                            </span>
                                        </div>

                                        {/* Nama & Deskripsi */}
                                        <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                                            {category.description || 'Tidak ada deskripsi'}
                                        </p>

                                        {/* Slug */}
                                        <div className="flex items-center gap-1.5 mb-4">
                                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            <span className="text-xs text-gray-400 font-mono truncate">
                                                {category.slug}
                                            </span>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-100 -mx-5 mb-4"></div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/dashboard/categories/${category.id}`}
                                                className="flex-1 text-center py-2 px-3 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                                            >
                                                Detail
                                            </Link>
                                            <Link
                                                to={`/dashboard/categories/edit/${category.id}`}
                                                className="flex-1 text-center py-2 px-3 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 transition-colors duration-150"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => setDeleteConfirm(category.id)}
                                                className="flex-1 text-center py-2 px-3 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}
                >
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 text-center mb-1">
                            Hapus Kategori?
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            Kategori yang dihapus tidak dapat dikembalikan. Pastikan tidak ada produk yang terkait.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deletingId !== null}
                                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                disabled={deletingId !== null}
                                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {deletingId ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Menghapus...
                                    </>
                                ) : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryList;