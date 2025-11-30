import React, { useEffect, useState, useRef } from 'react';
import useUserStore from '../../../stores/useAuthStore';
import UserDetailModal from './DetailUser';

function UserManagement() {
    const { 
        users, 
        loading, 
        fetchUsers, 
        deleteUser, 
        verifyUser,
        fetchUserDetail,
        activeUser
    } = useUserStore();

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    
    // Ref untuk elemen detail user
    const detailRef = useRef(null);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(userId);
        }
    };

    const handleActivation = (userId) => {
        if (window.confirm('Are you sure you want to activation this user?')) {
            activeUser(userId);
        }
    };

    const handleVerifyUser = async (user) => {
        if (window.confirm(`Are you sure you want to verify ${user.nama}'s email?`)) {
            try {
                await verifyUser(user.id);
            } catch (error) {
                // Error sudah dihandle di store
            }
        }
    };

    const handleViewDetail = async (user) => {
        setSelectedUser(user);
        setDetailLoading(true);
        setShowDetailModal(true);
        
        try {
            const detail = await fetchUserDetail(user.id);
            setUserDetail(detail);
            
            // Scroll ke modal setelah data dimuat
            setTimeout(() => {
                if (detailRef.current) {
                    detailRef.current.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            }, 100);
        } catch (error) {
            // Error sudah dihandle di store
        } finally {
            setDetailLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID');
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setUserDetail(null);
        setSelectedUser(null);
    };

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">User Management</h1>

            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden hidden md:block">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Orders
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {user.photo && (
                                                    <img
                                                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover cursor-pointer"
                                                        src={user.photo}
                                                        alt={user.nama}
                                                        onClick={() => handleViewDetail(user)}
                                                    />
                                                )}
                                                {!user.photo && (
                                                    <div 
                                                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                                                        onClick={() => handleViewDetail(user)}
                                                    >
                                                        <span className="text-gray-600 text-xs sm:text-sm">
                                                            {user.nama?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="ml-3 sm:ml-4">
                                                    <div 
                                                        className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                                        onClick={() => handleViewDetail(user)}
                                                    >
                                                        {user.nama}
                                                    </div>
                                                    <div className="text-xs sm:text-sm text-gray-500">
                                                        {user.role}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                            <div className="text-xs sm:text-sm text-gray-500">{user.hp || '-'}</div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.terverifikasi 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {user.terverifikasi ? 'Verified' : 'Unverified'}
                                            </span>
                                            <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                                Joined: {formatDate(user.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.orders ? user.orders.length : 0} orders
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
                                                <button
                                                    onClick={() => handleViewDetail(user)}
                                                    className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2 sm:px-3 py-1 rounded text-xs"
                                                >
                                                    View Detail
                                                </button>
                                                {!user.terverifikasi && (
                                                    <button
                                                        onClick={() => handleVerifyUser(user)}
                                                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2 sm:px-3 py-1 rounded text-xs"
                                                    >
                                                        Verify Email
                                                    </button>
                                                )}
                                                {
                                                    user.is_delete ? (
                                                    <button
                                                    onClick={() => handleActivation(user.id)}
                                                    className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2 sm:px-3 py-1 rounded text-xs"
                                                >
                                                    Aktifkan
                                                </button>) :(
                                                    <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2 sm:px-3 py-1 rounded text-xs"
                                                >
                                                    Non Aktifkan
                                                </button>
                                                )
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {users.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No users found
                            </div>
                        )}
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                        {users.map((user) => (
                            <div key={user.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center">
                                        {user.photo && (
                                            <img
                                                className="h-10 w-10 rounded-full object-cover cursor-pointer"
                                                src={user.photo}
                                                alt={user.nama}
                                                onClick={() => handleViewDetail(user)}
                                            />
                                        )}
                                        {!user.photo && (
                                            <div 
                                                className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                                                onClick={() => handleViewDetail(user)}
                                            >
                                                <span className="text-gray-600 text-sm">
                                                    {user.nama?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="ml-3">
                                            <div 
                                                className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                                onClick={() => handleViewDetail(user)}
                                            >
                                                {user.nama}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {user.role}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.terverifikasi 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {user.terverifikasi ? 'Verified' : 'Unverified'}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                    <div>
                                        <div className="text-gray-500">Email</div>
                                        <div className="truncate">{user.email}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Phone</div>
                                        <div>{user.hp || '-'}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Joined</div>
                                        <div>{formatDate(user.createdAt)}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Orders</div>
                                        <div>{user.orders ? user.orders.length : 0}</div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => handleViewDetail(user)}
                                        className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded text-xs flex-1 text-center"
                                    >
                                        View Detail
                                    </button>
                                    {!user.terverifikasi && (
                                        <button
                                            onClick={() => handleVerifyUser(user)}
                                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded text-xs flex-1 text-center"
                                        >
                                            Verify Email
                                        </button>
                                    )}
                                    {
                                        user.is_delete ? (
                                        <button
                                        onClick={() => handleActivation(user.id)}
                                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-xs flex-1 text-center"
                                    >
                                        Aktifkan
                                    </button>) :(
                                        <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-xs flex-1 text-center"
                                    >
                                        Non Aktifkan
                                    </button>
                                    )
                                    }
                                </div>
                            </div>
                        ))}
                        
                        {users.length === 0 && (
                            <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md">
                                No users found
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* User Detail Modal dengan ref untuk scroll */}
            <div ref={detailRef}>
                {showDetailModal && (
                    <UserDetailModal 
                        user={selectedUser}
                        userDetail={userDetail}
                        loading={detailLoading}
                        onClose={closeDetailModal}
                    />
                )}
            </div>
        </div>
    );
}

export default UserManagement;