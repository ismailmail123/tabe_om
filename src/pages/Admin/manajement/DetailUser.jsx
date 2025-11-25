import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../stores/useAuthStore';

function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userDetail, loading, fetchUserDetail, clearUserDetail } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (id) {
            fetchUserDetail(id);
        }

        // Cleanup function
        return () => {
            clearUserDetail();
        };
    }, [id, fetchUserDetail, clearUserDetail]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'aktif':
                return 'bg-green-100 text-green-800';
            case 'pending':
            case 'process':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
            case 'tidak aktif':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!userDetail) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center text-gray-500 py-8">
                    User not found
                    <button 
                        onClick={() => navigate(-1)}
                        className="block mt-4 text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 lg:p-6">
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </button>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                            {userDetail.photo ? (
                                <img
                                    className="h-16 w-16 lg:h-20 lg:w-20 rounded-full object-cover border-4 border-white"
                                    src={userDetail.photo}
                                    alt={userDetail.nama}
                                />
                            ) : (
                                <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-blue-300 flex items-center justify-center border-4 border-white">
                                    <span className="text-white text-lg lg:text-xl font-bold">
                                        {userDetail.nama?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold">{userDetail.nama}</h1>
                                <p className="text-blue-100">{userDetail.email}</p>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="capitalize bg-blue-700 px-2 py-1 rounded text-xs">
                                        {userDetail.role}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(userDetail.status)}`}>
                                        {userDetail.status || 'Unknown'}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        userDetail.terverifikasi 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {userDetail.terverifikasi ? 'Verified' : 'Unverified'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="lg:ml-auto text-sm lg:text-base">
                            <p>Member since: {formatDate(userDetail.createdAt)}</p>
                            <p>Last updated: {formatDate(userDetail.updatedAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`py-4 px-4 lg:px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                                activeTab === 'profile'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`py-4 px-4 lg:px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                                activeTab === 'orders'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Orders ({userDetail.orders?.length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab('statistics')}
                            className={`py-4 px-4 lg:px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                                activeTab === 'statistics'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Statistics
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-4 lg:p-6">
                    {activeTab === 'profile' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                                        <p className="mt-1 text-sm text-gray-900">{userDetail.nama}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <p className="mt-1 text-sm text-gray-900">{userDetail.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                        <p className="mt-1 text-sm text-gray-900">{userDetail.hp || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Gender</label>
                                        <p className="mt-1 text-sm text-gray-900 capitalize">
                                            {userDetail.jenis_kelamin || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Address</label>
                                        <p className="mt-1 text-sm text-gray-900">{userDetail.alamat || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Place of Birth</label>
                                        <p className="mt-1 text-sm text-gray-900">{userDetail.tempat_lahir || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {formatDate(userDetail.tanggal_lahir)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Provider</label>
                                        <p className="mt-1 text-sm text-gray-900 capitalize">
                                            {userDetail.provider || 'Local'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
                            {userDetail.orders && userDetail.orders.length > 0 ? (
                                <div className="space-y-6">
                                    {userDetail.orders.map((order) => (
                                        <div key={order.id} className="border border-gray-200 rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow">
                                            {/* Order Header */}
                                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 space-y-2 lg:space-y-0">
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="font-semibold text-lg">Order #{order.order_code}</h4>
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                            {order.status?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        Date: {formatDate(order.order_date || order.createdAt)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Order ID: {order.id}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {formatCurrency(order.total_price)}
                                                    </p>
                                                    <p className="text-sm text-gray-500 capitalize">
                                                        Payment: {order.payment_method} • 
                                                        <span className={`ml-1 ${getPaymentStatusColor(order.payment_status)} px-2 py-1 rounded-full text-xs`}>
                                                            {order.payment_status}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            {order.orderitem && order.orderitem.length > 0 && (
                                                <div className="mb-4">
                                                    <h5 className="font-medium text-gray-900 mb-3">Items Ordered:</h5>
                                                    <div className="space-y-3">
                                                        {order.orderitem.map((item, index) => (
                                                            <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                                                {item.variant?.img_url && (
                                                                    <img
                                                                        src={item.variant.img_url}
                                                                        alt={item.variant.name}
                                                                        className="w-12 h-12 object-cover rounded"
                                                                    />
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-gray-900 truncate">
                                                                        {item.variant?.name || 'Unknown Product'}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        Variant of: {item.variant?.product?.name || 'Unknown Product'}
                                                                    </p>
                                                                    <div className="flex justify-between items-center mt-1">
                                                                        <span className="text-sm text-gray-600">
                                                                            {item.quantity} × {formatCurrency(item.price)}
                                                                        </span>
                                                                        <span className="font-medium text-gray-900">
                                                                            {formatCurrency(item.total)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* WBP Information */}
                                            {order.order_data && order.order_data.length > 0 && (
                                                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                                    <h5 className="font-medium text-blue-900 mb-2">WBP Information:</h5>
                                                    {order.order_data.map((data, index) => (
                                                        <div key={data.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                            <div><span className="font-medium">Name:</span> {data.wbp_name}</div>
                                                            <div><span className="font-medium">Room:</span> {data.wbp_room}</div>
                                                            <div><span className="font-medium">Register Number:</span> {data.wbp_register_number}</div>
                                                            <div><span className="font-medium">Sender:</span> {data.wbp_sender}</div>
                                                            {data.note && (
                                                                <div className="md:col-span-2">
                                                                    <span className="font-medium">Note:</span> {data.note}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Order History Timeline */}
                                            {order.order_historie && order.order_historie.length > 0 && (
                                                <div className="border-t pt-4">
                                                    <h5 className="font-medium text-gray-900 mb-3">Order Timeline:</h5>
                                                    <div className="space-y-2">
                                                        {order.order_historie
                                                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                                            .map((history, index) => (
                                                                <div key={history.id} className="flex items-start space-x-3">
                                                                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                                    <div className="flex-1">
                                                                        <div className="flex justify-between items-start">
                                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(history.status)}`}>
                                                                                {history.status?.toUpperCase()}
                                                                            </span>
                                                                            <span className="text-xs text-gray-500">
                                                                                {formatDate(history.createdAt)}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-sm text-gray-700 mt-1">{history.note}</p>
                                                                        <p className="text-xs text-gray-500">By User ID: {history.user_id}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Purchase Receipt */}
                                            {order.purchase_receipt_photo && (
                                                <div className="mt-4 pt-4 border-t">
                                                    <h5 className="font-medium text-gray-900 mb-2">Purchase Receipt:</h5>
                                                    <img
                                                        src={order.purchase_receipt_photo}
                                                        alt="Purchase Receipt"
                                                        className="w-32 h-32 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                                                        onClick={() => window.open(order.purchase_receipt_photo, '_blank')}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="mt-4 text-lg">No orders found for this user</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'statistics' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-blue-800">Total Orders</h4>
                                    <p className="text-2xl font-bold text-blue-600">{userDetail.orders?.length || 0}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-green-800">Completed Orders</h4>
                                    <p className="text-2xl font-bold text-green-600">
                                        {userDetail.orders?.filter(order => order.status === 'completed').length || 0}
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-purple-800">Total Spent</h4>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {formatCurrency(userDetail.orders?.reduce((total, order) => total + parseFloat(order.total_price || 0), 0))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDetail;