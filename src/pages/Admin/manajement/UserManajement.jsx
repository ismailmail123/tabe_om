// import React, { useEffect, useState } from 'react';
// import useUserStore from '../../../stores/useAuthStore';
// import UserDetailModal from './DetailUser'; // Komponen modal untuk detail user

// function UserManagement() {
//     const { 
//         users, 
//         loading, 
//         fetchUsers, 
//         deleteUser, 
//         verifyUserEmail, 
//         fetchUserDetail 
//     } = useUserStore();
    
//     const [verificationData, setVerificationData] = useState({ email: '', kode_verifikasi: '' });
//     const [showVerificationModal, setShowVerificationModal] = useState(false);
//     const [showDetailModal, setShowDetailModal] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [userDetail, setUserDetail] = useState(null);
//     const [detailLoading, setDetailLoading] = useState(false);

//     useEffect(() => {
//         fetchUsers();
//     }, [fetchUsers]);

//     const handleDelete = (userId) => {
//         if (window.confirm('Are you sure you want to delete this user?')) {
//             deleteUser(userId);
//         }
//     };

//     const handleVerifyEmail = (user) => {
//         setSelectedUser(user);
//         setVerificationData({ email: user.email, kode_verifikasi: '' });
//         setShowVerificationModal(true);
//     };

//     const handleViewDetail = async (user) => {
//         setSelectedUser(user);
//         setDetailLoading(true);
//         setShowDetailModal(true);
        
//         try {
//             const detail = await fetchUserDetail(user.id);
//             setUserDetail(detail);
//         } catch (error) {
//             // Error sudah dihandle di store
//         } finally {
//             setDetailLoading(false);
//         }
//     };

//     const submitVerification = async () => {
//         try {
//             await verifyUserEmail(verificationData.email, verificationData.kode_verifikasi);
//             setShowVerificationModal(false);
//             setVerificationData({ email: '', kode_verifikasi: '' });
//             fetchUsers(); // Refresh list
//         } catch (error) {
//             // Error sudah dihandle di store
//         }
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return '-';
//         return new Date(dateString).toLocaleDateString('id-ID');
//     };

//     const closeDetailModal = () => {
//         setShowDetailModal(false);
//         setUserDetail(null);
//         setSelectedUser(null);
//     };

//     console.log("Rendering UserManagement with users:", users);

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-2xl font-bold mb-6">User Management</h1>

//             {loading ? (
//                 <div className="flex justify-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//                 </div>
//             ) : (
//                 <div className="bg-white shadow-md rounded-lg overflow-hidden">
//                     <table className="min-w-full table-auto">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     User
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Contact
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Status
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Orders
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Actions
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {users.map((user) => (
//                                 <tr key={user.id} className="hover:bg-gray-50">
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="flex items-center">
//                                             {user.photo && (
//                                                 <img
//                                                     className="h-10 w-10 rounded-full object-cover cursor-pointer"
//                                                     src={user.photo}
//                                                     alt={user.nama}
//                                                     onClick={() => handleViewDetail(user)}
//                                                 />
//                                             )}
//                                             {!user.photo && (
//                                                 <div 
//                                                     className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
//                                                     onClick={() => handleViewDetail(user)}
//                                                 >
//                                                     <span className="text-gray-600 text-sm">
//                                                         {user.nama?.charAt(0).toUpperCase()}
//                                                     </span>
//                                                 </div>
//                                             )}
//                                             <div className="ml-4">
//                                                 <div 
//                                                     className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
//                                                     onClick={() => handleViewDetail(user)}
//                                                 >
//                                                     {user.nama}
//                                                 </div>
//                                                 <div className="text-sm text-gray-500">
//                                                     {user.role}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="text-sm text-gray-900">{user.email}</div>
//                                         <div className="text-sm text-gray-500">{user.hp || '-'}</div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                                             user.terverifikasi 
//                                                 ? 'bg-green-100 text-green-800' 
//                                                 : 'bg-yellow-100 text-yellow-800'
//                                         }`}>
//                                             {user.terverifikasi ? 'Verified' : 'Unverified'}
//                                         </span>
//                                         <div className="text-sm text-gray-500">
//                                             Joined: {formatDate(user.createdAt)}
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                         {user.orders ? user.orders.length : 0} orders
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                         <div className="flex space-x-2">
//                                             <button
//                                                 onClick={() => handleViewDetail(user)}
//                                                 className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded text-xs"
//                                             >
//                                                 View Detail
//                                             </button>
//                                             {!user.terverifikasi && (
//                                                 <button
//                                                     onClick={() => handleVerifyEmail(user)}
//                                                     className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded text-xs"
//                                                 >
//                                                     Verify Email
//                                                 </button>
//                                             )}
//                                             <button
//                                                 onClick={() => handleDelete(user.id)}
//                                                 className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-xs"
//                                             >
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     {users.length === 0 && (
//                         <div className="text-center py-8 text-gray-500">
//                             No users found
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* Verification Modal */}
//             {showVerificationModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                         <h3 className="text-lg font-semibold mb-4">
//                             Verify Email for {selectedUser?.nama}
//                         </h3>
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Verification Code
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={verificationData.kode_verifikasi}
//                                     onChange={(e) => setVerificationData({
//                                         ...verificationData,
//                                         kode_verifikasi: e.target.value
//                                     })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     placeholder="Enter verification code"
//                                 />
//                                 <p className="text-xs text-gray-500 mt-1">
//                                     Check user's email for verification code
//                                 </p>
//                             </div>
//                             <div className="flex justify-end space-x-3">
//                                 <button
//                                     onClick={() => setShowVerificationModal(false)}
//                                     className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={submitVerification}
//                                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                                 >
//                                     Verify Email
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* User Detail Modal */}
//             {showDetailModal && (
//                 <UserDetailModal 
//                     user={selectedUser}
//                     userDetail={userDetail}
//                     loading={detailLoading}
//                     onClose={closeDetailModal}
//                 />
//             )}
//         </div>
//     );
// }

// export default UserManagement;


import React, { useEffect, useState } from 'react';
import useUserStore from '../../../stores/useAuthStore';
import UserDetailModal from './DetailUser';

function UserManagement() {
    const { 
        users, 
        loading, 
        fetchUsers, 
        deleteUser, 
        verifyUser, // Ganti verifyUserEmail dengan verifyUser
        fetchUserDetail,
        activeUser
    } = useUserStore();

    
    // Hapus state untuk verification modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

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
                // Tidak perlu refresh manual karena sudah ada di store
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
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Orders
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
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
                                            <div className="ml-4">
                                                <div 
                                                    className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                                    onClick={() => handleViewDetail(user)}
                                                >
                                                    {user.nama}

                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user.role}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                        <div className="text-sm text-gray-500">{user.hp || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            user.terverifikasi 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {user.terverifikasi ? 'Verified' : 'Unverified'}
                                        </span>
                                        <div className="text-sm text-gray-500">
                                            Joined: {formatDate(user.createdAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.orders ? user.orders.length : 0} orders
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewDetail(user)}
                                                className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded text-xs"
                                            >
                                                View Detail
                                            </button>
                                            {!user.terverifikasi && (
                                                <button
                                                    onClick={() => handleVerifyUser(user)}
                                                    className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded text-xs"
                                                >
                                                    Verify Email
                                                </button>
                                            )}
                                            {
                                                user.is_delete ? (
                                                <button
                                                onClick={() => handleActivation(user.id)}
                                                className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-xs"
                                            >
                                                Aktifkan
                                            </button>) :(
                                                <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-xs"
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
            )}

            {/* User Detail Modal */}
            {showDetailModal && (
                <UserDetailModal 
                    user={selectedUser}
                    userDetail={userDetail}
                    loading={detailLoading}
                    onClose={closeDetailModal}
                />
            )}
        </div>
    );
}

export default UserManagement;