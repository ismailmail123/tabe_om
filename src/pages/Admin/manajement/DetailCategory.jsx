// CategoryDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useCategoryStore from '../../../stores/useCategoryStore';

const CategoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedCategory, isLoading, fetchCategoryById, deleteCategory } = useCategoryStore();
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    useEffect(() => {
        if (id) {
            fetchCategoryById(id);
        }
    }, [id, fetchCategoryById]);

    const handleDelete = async () => {
        try {
            await deleteCategory(id);
            navigate('/dashboard/categories');
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!selectedCategory) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Kategori Tidak Ditemukan</h2>
                    <Link
                        to="/categories"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Kembali ke Daftar Kategori
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{selectedCategory.name}</h1>
                    <p className="text-gray-600 mt-2">Detail informasi kategori</p>
                </div>
                <div className="flex space-x-3">
                    <Link
                        to={`/dashboard/categories/edit/${id}`}
                        className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200"
                    >
                        Edit Kategori
                    </Link>
                    <button
                        onClick={() => setDeleteConfirm(true)}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
                    >
                        Hapus Kategori
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Kategori</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                                <p className="text-gray-900 font-semibold">{selectedCategory.name}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                <p className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg font-mono text-sm">
                                    {selectedCategory.slug}
                                </p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <p className="text-gray-600 leading-relaxed">{selectedCategory.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Produk</span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                                    {selectedCategory.product?.length || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Status</span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                                    Aktif
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
                        <div className="space-y-2">
                            <Link
                                to="/dashboard/categories/add"
                                className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 block"
                            >
                                + Tambah Kategori Baru
                            </Link>
                            <Link
                                to="/dashboard/categories"
                                className="w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 block"
                            >
                                ← Kembali ke Daftar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            {selectedCategory.product && selectedCategory.product.length > 0 && (
                <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Produk dalam Kategori</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCategory.product.map((product) => (
                            <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Hapus Kategori?
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Anda akan menghapus kategori <strong>"{selectedCategory.name}"</strong>. 
                            Tindakan ini tidak dapat dibatalkan.
                        </p>
                        {selectedCategory.product?.length > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                <p className="text-yellow-800 text-sm">
                                    ⚠️ Kategori ini memiliki {selectedCategory.product.length} produk. 
                                    Penghapusan mungkin mempengaruhi produk terkait.
                                </p>
                            </div>
                        )}
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setDeleteConfirm(false)}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryDetail;