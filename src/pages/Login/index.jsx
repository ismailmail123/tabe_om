// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { login } from "../../utils/auth";

// export default function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isSignup, setIsSignup] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const success = login(username, password);
//     if (success) {
//       const role = JSON.parse(localStorage.getItem("user"))?.role;
//       if (role === "admin") {
//         navigate("/dashboard");
//       } else {
//         navigate("/user/belanja");
//       }
//     } else {
//       setError("Username atau password salah!");
//     }
//   };

//   return (
//     <>
//       <div className={`container ${isSignup ? "change" : ""}`}>
//         <div className="forms-container">
//           {/* Form Daftar */}
//           <div className="form-control signup-form">
//             <form>
//               <h2>Daftar Akun</h2>
//               <input type="text" placeholder="Nama Pengguna" required />
//               <input type="email" placeholder="Email" required />
//               <input type="password" placeholder="Kata Sandi" required />
//               <input
//                 type="password"
//                 placeholder="Konfirmasi Kata Sandi"
//                 required
//               />
//               <button type="button">Daftar</button>
//             </form>
//           </div>

//           {/* Form Masuk */}
//           <div className="form-control signin-form">
//             <form onSubmit={handleSubmit}>
//               <h2>Masuk</h2>
//               <input
//                 type="text"
//                 placeholder="Nama Pengguna"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Kata Sandi"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               {error && (
//                 <p style={{ color: "red", fontSize: "12px" }}>{error}</p>
//               )}
//               <button type="submit">Masuk</button>
//             </form>
//           </div>
//         </div>

//         {/* Panel Samping */}
//         <div className="intros-container">
//           <div className="intro-control signin-intro">
//             <div className="intro-control__inner">
//               <h2>Selamat Datang Kembali!</h2>
//               <p>
//                 Kami senang kamu kembali! Silakan masuk untuk melanjutkan ke
//                 halaman utama.
//               </p>
//               <button id="signup-btn" onClick={() => setIsSignup(true)}>
//                 Belum punya akun? Daftar di sini
//               </button>
//             </div>
//           </div>

//           <div className="intro-control signup-intro">
//             <div className="intro-control__inner">
//               <h2>Ayo Bergabung!</h2>
//               <p>
//                 Daftar sekarang dan nikmati berbagai penawaran serta fitur
//                 menarik lainnya!
//               </p>
//               <button id="signin-btn" onClick={() => setIsSignup(false)}>
//                 Sudah punya akun? Masuk
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Gaya Langsung */}
//       <style>{`
//         @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");
//         @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css");

//         * { margin: 0; padding: 0; box-sizing: border-box; }
//         body {
//           font-family: "Poppins", sans-serif;
//           display: flex; justify-content: center; align-items: center;
//           height: 100vh; background-color: #e0e7ff; font-size: 14px;
//         }
//         .container {
//           background-color: #fff;
//           width: 760px; max-width: 100vw; height: 480px;
//           position: relative; overflow-x: hidden; border-radius: 12px;
//           box-shadow: 0 5px 15px rgba(0,0,0,0.15);
//         }
//         .forms-container { position: relative; width: 50%; text-align: center; }
//         .form-control {
//           position: absolute; width: 100%; display: flex;
//           justify-content: center; flex-direction: column;
//           height: 480px; transition: all 0.5s ease-in;
//         }
//         .form-control h2 { font-size: 2rem; color: #1e3a8a; }
//         .form-control form {
//           display: flex; flex-direction: column; margin: 0px 30px;
//         }
//         .form-control form input {
//           margin: 10px 0px; border: none; padding: 15px;
//           background-color: #f3f4f6; border-radius: 5px;
//         }
//         .form-control form button {
//           border: none; padding: 15px; margin-top: 10px;
//           background-color: #2563eb; border-radius: 5px;
//           color: #fff; cursor: pointer; font-weight: 600;
//         }
//         .form-control form button:hover {
//           background-color: #1d4ed8;
//         }
//         .form-control span { margin: 10px 0px; }
//         .socials i {
//           margin: 0 5px; color: #fff; border-radius: 50%;
//         }
//         .fa-facebook-f { padding: 5px 8px; background-color: #3b5998; }
//         .fa-google-plus-g { padding: 5px 4px; background-color: #db4a39; }
//         .fa-linkedin-in { padding: 5px 6px; background-color: #0e76a8; }

//         .signup-form { opacity: 0; z-index: 1; left: 200%; }
//         .signin-form { opacity: 1; z-index: 2; left: 0%; }

//         .intros-container { position: relative; left: 50%; width: 50%; text-align: center; }
//         .intro-control {
//           position: absolute; width: 100%; display: flex;
//           justify-content: center; flex-direction: column;
//           height: 480px; color: #fff;
//           background: linear-gradient(170deg, #3b82f6, #2563eb);
//           transition: all 0.5s ease-in;
//         }
//         .intro-control__inner { margin: 0 30px; }
//         .intro-control button {
//           border: none; padding: 15px 30px;
//           background-color: #1e40af; border-radius: 50px;
//           color: #fff; margin: 10px 0px; cursor: pointer;
//         }
//         .intro-control button:hover { background-color: #1e3a8a; }

//         .signin-intro { opacity: 1; z-index: 2; }
//         .signup-intro { opacity: 0; z-index: 1; }

//         .change .signup-form { opacity: 1; z-index: 2; transform: translateX(-100%); }
//         .change .signup-form button { background-color: #2563eb !important; }
//         .change .signin-form { opacity: 0; z-index: 1; transform: translateX(-100%); }
//         .change .intro-control {
//           transform: translateX(-100%);
//           background: linear-gradient(170deg, #2563eb, #1e3a8a);
//         }
//         .change .signin-intro { opacity: 0; z-index: 1; }
//         .change .signup-intro { opacity: 1; z-index: 2; }
//       `}</style>
//     </>
//   );
// }



// components/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { Eye, EyeOff, Loader2, Mail, User, Lock } from "lucide-react";
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, signup, isLoggingIn, isSigningUp } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const error = queryParams.get('error');
  const message = queryParams.get('message');

  if (token) {
    const userData = jwtDecode(token);
    localStorage.setItem("authUser", JSON.stringify({user: userData}));
    localStorage.setItem('token', token);
    
    // Redirect ke halaman sebelumnya atau home
    const preLoginPath = localStorage.getItem('preLoginPath') || '/';
    localStorage.removeItem('preLoginPath');
    window.location.href = preLoginPath;
  }

  if (error) {
    if (error === 'provider_mismatch' && message) {
      toast.error(decodeURIComponent(message));
    } else {
      toast.error('Google login failed');
    }
    
    // Bersihkan URL dari parameter error
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
}, [location]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      await login(loginData);
      const user = JSON.parse(localStorage.getItem("authUser"));
      
      
      toast.success("Login berhasil!");
      
      if (user?.user?.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/user/belanja");
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi
    if (signupData.password !== signupData.confirmPassword) {
      setError("Konfirmasi password tidak sesuai");
      toast.error("Konfirmasi password tidak sesuai");
      return;
    }

    if (signupData.password.length < 6) {
      setError("Password minimal 6 karakter");
      toast.error("Password minimal 6 karakter");
      return;
    }

    try {
      await signup(signupData);
      toast.success("Registrasi berhasil! Silakan login.");
      setIsSignup(false);
      // Reset form
      setSignupData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  // Handle Google Login
    const handleGoogleLogin = () => {
  // Simpan state sebelumnya untuk redirect setelah login
  setIsGoogleLoading(true);
  const previousPath = window.location.pathname;
  localStorage.setItem('preLoginPath', '/');
  
  const selectedRole = 'user';
  const state = JSON.stringify({ 
    role: selectedRole,
    redirect: previousPath 
  });
  const encodedState = encodeURIComponent(state);
  
  window.location.href = `https://batarirtnbantaeng.cloud/auth/google?state=${encodedState}&role=${selectedRole}`;
};

  return (
    <>
      <div className={`container ${isSignup ? "change" : ""}`}>
        <div className="forms-container">
          {/* Form Daftar */}
          <div className="form-control signup-form">
            <form onSubmit={handleSignup}>
              <h2>Daftar Akun</h2>
              
              <div className="input-container">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  placeholder="Nama Lengkap" 
                  value={signupData.name}
                  onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                  required 
                />
              </div>
              
              <div className="input-container">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                  required 
                />
              </div>
              
              <div className="input-container">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Kata Sandi" 
                  value={signupData.password}
                  onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                  required 
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="input-container">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Konfirmasi Kata Sandi" 
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                  required 
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <p style={{ color: "red", fontSize: "12px", margin: "10px 0" }}>{error}</p>
              )}

              <button type="submit" disabled={isSigningUp}>
                {isSigningUp ? (
                  <div className="button-loading">
                    <Loader2 size={16} className="spinner" />
                    Memproses...
                  </div>
                ) : (
                  "Daftar"
                )}
              </button>
            </form>
          </div>

          {/* Form Masuk */}
          <div className="form-control signin-form">
            <form onSubmit={handleLogin}>
              <h2>Masuk</h2>
              
              <div className="input-container">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="input-container">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Kata Sandi"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <p style={{ color: "red", fontSize: "12px", margin: "10px 0" }}>{error}</p>
              )}

              <button type="submit" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <div className="button-loading">
                    <Loader2 size={16} className="spinner" />
                    Memuat...
                  </div>
                ) : (
                  "Masuk"
                )}
              </button>

              {/* Google Login Button */}
              <div className="social-login">
                <div className="divider">
                  <span>Atau lanjut dengan</span>
                </div>
                <button 
                  type="button" 
                  className="google-btn"
                  onClick={handleGoogleLogin}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Panel Samping */}
        <div className="intros-container">
          <div className="intro-control signin-intro">
            <div className="intro-control__inner">
              <h2>Selamat Datang Kembali!</h2>
              <p>
                Kami senang kamu kembali! Silakan masuk untuk melanjutkan ke
                halaman utama.
              </p>
              <button id="signup-btn" onClick={() => setIsSignup(true)}>
                Belum punya akun? Daftar di sini
              </button>
            </div>
          </div>

          <div className="intro-control signup-intro">
            <div className="intro-control__inner">
              <h2>Ayo Bergabung!</h2>
              <p>
                Daftar sekarang dan nikmati berbagai penawaran serta fitur
                menarik lainnya!
              </p>
              <button id="signin-btn" onClick={() => setIsSignup(false)}>
                Sudah punya akun? Masuk
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gaya Langsung */}
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css");

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: "Poppins", sans-serif;
          display: flex; justify-content: center; align-items: center;
          height: 100vh; background-color: #e0e7ff; font-size: 14px;
        }
        .container {
          background-color: #fff;
          width: 760px; max-width: 100vw; height: 480px;
          position: relative; overflow-x: hidden; border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        }
        .forms-container { position: relative; width: 50%; text-align: center; }
        .form-control {
          position: absolute; width: 100%; display: flex;
          justify-content: center; flex-direction: column;
          height: 480px; transition: all 0.5s ease-in;
        }
        .form-control h2 { font-size: 2rem; color: #1e3a8a; margin-bottom: 20px; }
        .form-control form {
          display: flex; flex-direction: column; margin: 0px 30px;
        }
        
        .input-container {
          position: relative;
          margin: 10px 0px;
        }
        
        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }
        
        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
        }
        
        .form-control form input {
          margin: 0; 
          border: none; 
          padding: 15px 45px;
          background-color: #f3f4f6; 
          border-radius: 5px;
          width: 100%;
          font-family: "Poppins", sans-serif;
        }
        
        .form-control form input:focus {
          outline: 2px solid #2563eb;
          background-color: #fff;
        }
        
        .form-control form button[type="submit"] {
          border: none; 
          padding: 15px; 
          margin-top: 10px;
          background-color: #2563eb; 
          border-radius: 5px;
          color: #fff; 
          cursor: pointer; 
          font-weight: 600;
          font-family: "Poppins", sans-serif;
          transition: background-color 0.2s;
        }
        
        .form-control form button[type="submit"]:hover:not(:disabled) {
          background-color: #1d4ed8;
        }
        
        .form-control form button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .button-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .social-login {
          margin-top: 20px;
        }
        
        .divider {
          display: flex;
          align-items: center;
          margin: 15px 0;
          color: #6b7280;
          font-size: 12px;
        }
        
        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .divider span {
          padding: 0 10px;
        }
        
        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 5px;
          background: white;
          color: #374151;
          cursor: pointer;
          font-family: "Poppins", sans-serif;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .google-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .signup-form { opacity: 0; z-index: 1; left: 200%; }
        .signin-form { opacity: 1; z-index: 2; left: 0%; }

        .intros-container { position: relative; left: 50%; width: 50%; text-align: center; }
        .intro-control {
          position: absolute; width: 100%; display: flex;
          justify-content: center; flex-direction: column;
          height: 480px; color: #fff;
          background: linear-gradient(170deg, #3b82f6, #2563eb);
          transition: all 0.5s ease-in;
        }
        .intro-control__inner { margin: 0 30px; }
        .intro-control button {
          border: none; 
          padding: 15px 30px;
          background-color: #1e40af; 
          border-radius: 50px;
          color: #fff; 
          margin: 10px 0px; 
          cursor: pointer;
          font-family: "Poppins", sans-serif;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .intro-control button:hover { 
          background-color: #1e3a8a; 
        }

        .change .signup-form { 
          opacity: 1; 
          z-index: 2; 
          transform: translateX(-100%); 
        }
        .change .signin-form { 
          opacity: 0; 
          z-index: 1; 
          transform: translateX(-100%); 
        }
        .change .intro-control {
          transform: translateX(-100%);
          background: linear-gradient(170deg, #2563eb, #1e3a8a);
        }
        .change .signin-intro { opacity: 0; z-index: 1; }
        .change .signup-intro { opacity: 1; z-index: 2; }

        @media (max-width: 768px) {
          .container {
            width: 90vw;
            height: auto;
            min-height: 500px;
          }
          
          .forms-container {
            width: 100%;
            height: 400px;
          }
          
          .intros-container {
            display: none;
          }
        }
      `}</style>
    </>
  );
}