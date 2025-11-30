// import { jwtDecode } from 'jwt-decode';
// import { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';

// const AuthCallback = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const processAuthentication = async () => {
//       let token = null;
//       let refreshToken = null;
//       let userId = null;

//       console.log('🔄 Starting OAuth callback processing...');

//       // **CEK SEMUA SUMBER TOKEN**
      
//       // 1. Cek dari Hash Parameters (paling reliable)
//       if (window.location.hash) {
//         const hashParams = new URLSearchParams(window.location.hash.substring(1));
//         token = hashParams.get('token') || hashParams.get('token');
//         refreshToken = hashParams.get('refreshToken');
//         userId = hashParams.get('userId');
//         console.log('📋 Hash params found:', { token: !!token, refreshToken: !!refreshToken });
//       }

//       // 2. Cek dari Query Parameters
//       if ((!token || !refreshToken) && window.location.search) {
//         const urlParams = new URLSearchParams(window.location.search);
//         token = token || urlParams.get('token') || urlParams.get('token');
//         refreshToken = refreshToken || urlParams.get('refreshToken');
//         userId = userId || urlParams.get('userId');
//         console.log('📋 Query params found:', { token: !!token, refreshToken: !!refreshToken });
//       }

//       // 3. Cek dari React Router Location
//       if ((!token || !refreshToken) && location.search) {
//         const routerParams = new URLSearchParams(location.search);
//         token = token || routerParams.get('token') || routerParams.get('token');
//         refreshToken = refreshToken || routerParams.get('refreshToken');
//         userId = userId || routerParams.get('userId');
//         console.log('📋 Router params found:', { token: !!token, refreshToken: !!refreshToken });
//       }

//       // **PROSES TOKEN YANG DITERIMA**
//       if (token) {
//         try {
//           console.log('🔐 Processing tokens...');
          
//           // Decode tokens
//           const decodedtoken = decodeURIComponent(token);
//           const decodedRefreshToken = refreshToken ? decodeURIComponent(refreshToken) : null;

//           // **SIMPAN ACCESS TOKEN KE localStorage**
//           localStorage.setItem('token', decodedtoken);
          
//           // **SIMPAN REFRESH TOKEN KE COOKIE (jika ada)**
//           if (decodedRefreshToken) {
//             await setRefreshTokenCookie(decodedRefreshToken);
//           } else {
//             console.log('⚠️ No refresh token received, trying to get from API...');
//             // Jika tidak ada refresh token, coba ambil dari API
//             await handleMissingRefreshToken(decodedtoken);
//           }

//           // **VERIFIKASI TOKEN DENGAN BACKEND**
//           // const verificationSuccess = await verifyTokenWithBackend(decodedtoken);
          
//           // if (verificationSuccess) {
//             // Simpan user data ke localStorage
//             const userData = jwtDecode(decodedtoken);
//             localStorage.setItem('authUser', JSON.stringify({ user: userData }));
            
//             console.log('✅ Authentication successful!', userData);

//             // **BERSIHKAN URL**
//             cleanUrl();
            
//             // **REDIRECT KE DASHBOARD**
//             navigate('/', { replace: true });
            
//           // } else {
//           //   throw new Error('Token verification failed');
//           // }

//         } catch (error) {
//           console.error('❌ Error processing authentication:', error);
//           navigate('/login?error=token_processing');
//         }
//       } else {
//         console.error('❌ No access token found');
//         navigate('/login?error=no_token');
//       }
//     };

//     processAuthentication();
//   }, [navigate, location]);

//   // **FUNGSI SET REFRESH TOKEN COOKIE**
//   const setRefreshTokenCookie = async (refreshToken) => {
//     try {
//       console.log('🍪 Setting refresh token cookie...');
      
//       // Opsi 1: Set cookie langsung dari frontend
//       const cookieOptions = `path=/; max-age=${7 * 24 * 60 * 60}; ${process.env.NODE_ENV === 'production' ? 'secure; samesite=none' : 'samesite=lax'}`;
//       document.cookie = `refreshToken=${refreshToken}; ${cookieOptions}`;
      
//       console.log('✅ Refresh token cookie set successfully');
      
//       // Opsi 2: Atau gunakan API endpoint jika butuh httpOnly
//       await axios.post('/api/auth/set-oauth-cookie', { 
//         refreshToken 
//       }, {
//         withCredentials: true
//       });
      
//     } catch (error) {
//       console.error('❌ Error setting refresh token cookie:', error);
//       // Continue without cookie, will use localStorage fallback
//     }
//   };

//   // **HANDLE MISSING REFRESH TOKEN**
//   const handleMissingRefreshToken = async (token) => {
//     try {
//       console.log('🔄 Attempting to get refresh token from backend...');
      
//       const response = await axios.get('/api/auth/refresh-token', {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true
//       });
      
//       if (response.data.refreshToken) {
//         await setRefreshTokenCookie(response.data.refreshToken);
//       }
//     } catch (error) {
//       console.warn('⚠️ Could not retrieve refresh token:', error.message);
//     }
//   };

//   // **VERIFIKASI TOKEN DENGAN BACKEND**
//   const verifyTokenWithBackend = async (token) => {
//     try {
//       console.log('🔍 Verifying token with backend...');
      
//       const response = await axios.get('/api/auth/verify', {
//         headers: { 
//           Authorization: `Bearer ${token}` 
//         },
//         withCredentials: true
//       });
      
//       console.log('✅ Token verified successfully');
//       return true;
      
//     } catch (error) {
//       console.error('❌ Token verification failed:', error);
      
//       // Coba refresh token jika verification gagal
//       if (error.response?.status === 401) {
//         return await attemptTokenRefresh();
//       }
      
//       return false;
//     }
//   };

//   // **ATTEMPT TOKEN REFRESH**
//   const attemptTokenRefresh = async () => {
//     try {
//       console.log('🔄 Attempting token refresh...');
      
//       const response = await axios.post('/api/auth/refresh-token', {}, {
//         withCredentials: true
//       });
      
//       if (response.data.data?.token) {
//         const newtoken = response.data.data.token;
//         localStorage.setItem('token', newtoken);
        
//         const userData = jwtDecode(newtoken);
//         localStorage.setItem('authUser', JSON.stringify({ user: userData }));
        
//         console.log('✅ Token refreshed successfully');
//         return true;
//       }
//     } catch (refreshError) {
//       console.error('❌ Token refresh failed:', refreshError);
//     }
    
//     return false;
//   };

//   // **BERSIHKAN URL**
//   const cleanUrl = () => {
//     const cleanUrl = window.location.origin + window.location.pathname;
//     window.history.replaceState({}, '', cleanUrl);
//     console.log('🧹 URL cleaned');
//   };

//   return (
//     <div style={{ 
//       padding: '40px', 
//       textAlign: 'center',
//       fontFamily: 'Arial, sans-serif',
//       backgroundColor: '#f8f9fa',
//       minHeight: '100vh',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center'
//     }}>
//       <div style={{
//         background: 'white',
//         padding: '40px',
//         borderRadius: '12px',
//         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//         maxWidth: '400px',
//         width: '100%'
//       }}>
//         <h2 style={{ 
//           color: '#333', 
//           marginBottom: '16px',
//           fontSize: '24px',
//           fontWeight: '600'
//         }}>
//           Processing Authentication...
//         </h2>
        
//         <p style={{ 
//           color: '#666', 
//           marginBottom: '32px',
//           fontSize: '16px',
//           lineHeight: '1.5'
//         }}>
//           Please wait while we complete your login.
//         </p>
        
//         <div style={{
//           width: '60px',
//           height: '60px',
//           border: '4px solid #f3f3f3',
//           borderTop: '4px solid #007bff',
//           borderRadius: '50%',
//           animation: 'spin 1s linear infinite',
//           margin: '0 auto'
//         }}></div>
        
//         <div style={{ 
//           marginTop: '24px', 
//           padding: '12px',
//           backgroundColor: '#f8f9fa',
//           borderRadius: '6px',
//           fontSize: '14px',
//           color: '#666'
//         }}>
//           <div>🔐 Securing your session...</div>
//         </div>
//       </div>
      
//       <style>
//         {`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default AuthCallback;


import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);

  // Fungsi untuk menampilkan notifikasi error
  const showErrorNotification = (message, type = 'error') => {
    if (type === 'error') {
      toast.error(message, {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#fee2e2',
          color: '#dc2626',
          border: '1px solid #fecaca',
          fontSize: '14px',
          padding: '12px 16px',
        },
        icon: '❌',
      });
    } else {
      toast.success(message, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#dcfce7',
          color: '#16a34a',
          border: '1px solid #bbf7d0',
          fontSize: '14px',
          padding: '12px 16px',
        },
        icon: '✅',
      });
    }
  };

  // Fungsi untuk menampilkan loading toast
  const showLoadingToast = (message) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#dbeafe',
        color: '#1d4ed8',
        border: '1px solid #bfdbfe',
        fontSize: '14px',
        padding: '12px 16px',
      },
    });
  };

  useEffect(() => {
    const processAuthentication = async () => {
      setIsProcessing(true);
      const loadingToast = showLoadingToast('Memproses autentikasi...');
      
      let token = null;
      let refreshToken = null;
      let userId = null;

      console.log('🔄 Starting OAuth callback processing...');

      // **CEK ERROR DARI URL PARAMETERS**
      const urlParams = new URLSearchParams(window.location.search);
      const errorType = urlParams.get('error');
      const errorMessage = urlParams.get('message');

      if (errorType || errorMessage) {
        console.log('❌ Error detected in URL:', { errorType, errorMessage });
        
        const decodedMessage = errorMessage ? decodeURIComponent(errorMessage) : getErrorMessage(errorType);
        
        toast.dismiss(loadingToast);
        showErrorNotification(decodedMessage);
        
        // Redirect ke login setelah menampilkan error
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
        
        setIsProcessing(false);
        return;
      }

      // **PROSES TOKEN NORMAL**
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        token = hashParams.get('token') || hashParams.get('token');
        refreshToken = hashParams.get('refreshToken');
        userId = hashParams.get('userId');
        console.log('📋 Hash params found:', { token: !!token, refreshToken: !!refreshToken });
      }

      if ((!token || !refreshToken) && window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        token = token || urlParams.get('token') || urlParams.get('token');
        refreshToken = refreshToken || urlParams.get('refreshToken');
        userId = userId || urlParams.get('userId');
        console.log('📋 Query params found:', { token: !!token, refreshToken: !!refreshToken });
      }

      if ((!token || !refreshToken) && location.search) {
        const routerParams = new URLSearchParams(location.search);
        token = token || routerParams.get('token') || routerParams.get('token');
        refreshToken = refreshToken || routerParams.get('refreshToken');
        userId = userId || routerParams.get('userId');
        console.log('📋 Router params found:', { token: !!token, refreshToken: !!refreshToken });
      }

      if (token) {
        try {
          console.log('🔐 Processing tokens...');
          
          toast.dismiss(loadingToast);
          const processingToast = showLoadingToast('Memproses token...');
          
          const decodedtoken = decodeURIComponent(token);
          const decodedRefreshToken = refreshToken ? decodeURIComponent(refreshToken) : null;

          localStorage.setItem('token', decodedtoken);
          
          if (decodedRefreshToken) {
            await setRefreshTokenCookie(decodedRefreshToken);
          } else {
            console.log('⚠️ No refresh token received, trying to get from API...');
            // await handleMissingRefreshToken(decodedtoken);
          }

          const userData = jwtDecode(decodedtoken);
          localStorage.setItem('authUser', JSON.stringify({ user: userData }));
          
          console.log('✅ Authentication successful!', userData);

          toast.dismiss(processingToast);
          showErrorNotification('Login berhasil! Mengarahkan ke dashboard...', 'success');

          cleanUrl();
          
          // Tunggu sebentar agar user bisa baca notifikasi
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
          
        } catch (error) {
          console.error('❌ Error processing authentication:', error);
          toast.dismiss(loadingToast);
          showErrorNotification('Terjadi kesalahan saat memproses autentikasi');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
        }
      } else {
        console.error('❌ No access token found');
        toast.dismiss(loadingToast);
        showErrorNotification('Token tidak ditemukan, silakan login kembali');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
      
      setIsProcessing(false);
    };

    processAuthentication();
  }, [navigate, location]);

  // Fungsi untuk mendapatkan pesan error berdasarkan type
  // const getErrorMessage = (errorType) => {
  //   const errorMessages = {
  //     'provider_mismatch': 'Metode login yang anda gunakan tidak sesuai. Silakan gunakan email dan password.',
  //     'account_disabled': 'Maaf anda sudah dinonaktifkan oleh admin, silahkan hubungi Admin Rutan Bantaeng +6285342545607',
  //     'auth_failed': 'Autentikasi gagal, silakan coba lagi',
  //     'no_user': 'User tidak ditemukan',
  //     'token_error': 'Gagal membuat token',
  //     'no_token': 'Token tidak ditemukan',
  //     'token_processing': 'Gagal memproses token'
  //   };
    
  //   return errorMessages[errorType] || 'Terjadi kesalahan saat login';
  // };
  const getErrorMessage = (errorType) => {
    const errorMessages = {
        'provider_mismatch': 'Metode login yang anda gunakan tidak sesuai. Silakan gunakan email dan password.',
        'account_disabled': 'Maaf anda sudah dinonaktifkan oleh admin, silahkan hubungi Admin Rutan Bantaeng +6285342545607',
        'auth_failed': 'Autentikasi gagal, silakan coba lagi',
        'no_user': 'User tidak ditemukan',
        'token_error': 'Gagal membuat token',
        'no_token': 'Token tidak ditemukan',
        'token_processing': 'Gagal memproses token'
    };
    
    return errorMessages[errorType] || 'Terjadi kesalahan saat login';
};

  // **FUNGSI SET REFRESH TOKEN COOKIE**
  const setRefreshTokenCookie = async (refreshToken) => {
    try {
      console.log('🍪 Setting refresh token cookie...');
      
      const cookieOptions = `path=/; max-age=${7 * 24 * 60 * 60}; ${process.env.NODE_ENV === 'production' ? 'secure; samesite=none' : 'samesite=lax'}`;
      document.cookie = `refreshToken=${refreshToken}; ${cookieOptions}`;
      
      console.log('✅ Refresh token cookie set successfully');
      
      await axios.post('/api/auth/set-oauth-cookie', { 
        refreshToken 
      }, {
        withCredentials: true
      });
      
    } catch (error) {
      console.error('❌ Error setting refresh token cookie:', error);
      showErrorNotification('Gagal menyimpan session');
    }
  };

  // **HANDLE MISSING REFRESH TOKEN**
  // const handleMissingRefreshToken = async (token) => {
  //   try {
  //     console.log('🔄 Attempting to get refresh token from backend...');
      
  //     const response = await axios.get('/api/auth/refresh-token', {
  //       headers: { Authorization: `Bearer ${token}` },
  //       withCredentials: true
  //     });
      
  //     if (response.data.refreshToken) {
  //       await setRefreshTokenCookie(response.data.refreshToken);
  //     }
  //   } catch (error) {
  //     console.warn('⚠️ Could not retrieve refresh token:', error.message);
  //     showErrorNotification('Gagal mengambil refresh token');
  //   }
  // };

  // **BERSIHKAN URL**
  const cleanUrl = () => {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
    console.log('🧹 URL cleaned');
  };

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ 
          color: '#333', 
          marginBottom: '16px',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          {isProcessing ? 'Memproses Autentikasi...' : 'Autentikasi Selesai'}
        </h2>
        
        <p style={{ 
          color: '#666', 
          marginBottom: '32px',
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          {isProcessing 
            ? 'Silakan tunggu sebentar, kami sedang menyelesaikan login Anda...' 
            : 'Proses autentikasi telah selesai.'}
        </p>
        
        {isProcessing && (
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        )}
        
        {!isProcessing && (
          <button 
            onClick={() => navigate('/login', { replace: true })}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '20px'
            }}
          >
            Kembali ke Login
          </button>
        )}
        
        <div style={{ 
          marginTop: '24px', 
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#666'
        }}>
          <div>
            {isProcessing ? '🔐 Mengamankan session Anda...' : '✅ Proses selesai'}
          </div>
        </div>
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AuthCallback;