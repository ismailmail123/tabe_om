// CategoryForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useCategoryStore from '../../../stores/useCategoryStore';

const CategoryForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

	console.log("id from params:", id);
    
    const {
        isLoading,
        selectedCategory,
        createCategory,
        updateCategory,
        fetchCategoryById,
        clearSelectedCategory
    } = useCategoryStore();

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit && id) {
            fetchCategoryById(id);
        }

        return () => {
            clearSelectedCategory();
        };
    }, [isEdit, id, fetchCategoryById, clearSelectedCategory]);

    useEffect(() => {
        if (isEdit && selectedCategory) {
            setFormData({
                name: selectedCategory.name || '',
                slug: selectedCategory.slug || '',
                description: selectedCategory.description || ''
            });
        }
    }, [isEdit, selectedCategory]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Auto-generate slug from name
        if (name === 'name') {
            const generatedSlug = value
                .toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            setFormData(prev => ({
                ...prev,
                slug: generatedSlug
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nama kategori wajib diisi';
        }

        if (!formData.slug.trim()) {
            newErrors.slug = 'Slug wajib diisi';
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Deskripsi wajib diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            if (isEdit) {
                await updateCategory(id, formData);
            } else {
                await createCategory(formData);
            }
            navigate('/dashboard/categories');
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                </h1>
                <p className="text-gray-600 mt-2">
                    {isEdit ? 'Perbarui informasi kategori' : 'Tambahkan kategori baru untuk produk Anda'}
                </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Kategori <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                errors.name ? 'border-red-300' : 'border-gray-200'
                            }`}
                            placeholder="Masukkan nama kategori"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Slug Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slug <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                errors.slug ? 'border-red-300' : 'border-gray-200'
                            }`}
                            placeholder="slug-kategori"
                        />
                        {errors.slug && (
                            <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            Slug akan digunakan dalam URL. Hanya huruf kecil, angka, dan tanda hubung.
                        </p>
                    </div>

                    {/* Description Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Deskripsi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                errors.description ? 'border-red-300' : 'border-gray-200'
                            }`}
                            placeholder="Masukkan deskripsi kategori..."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/categories')}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Menyimpan...
                                </div>
                            ) : (
                                isEdit ? 'Update Kategori' : 'Simpan Kategori'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;