import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { Eye, EyeOff, Loader2, Mail, User, Lock, ArrowLeft, Image as ImageIcon, MapPin, Phone, Calendar, VenusAndMars } from "lucide-react";
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  // State untuk form register multi-step
  const [step, setStep] = useState(1);
  const [signupData, setSignupData] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    alamat: "",
    photo: null,
    hp: "",
    jenis_kelamin: "",
    tempat_lahir: "",
    tanggal_lahir: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, signup, isLoggingIn, isSigningUp } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const showErrorFromURL = () => {
    const errorType = searchParams.get('error');
    const errorMessage = searchParams.get('message');

    if (errorType || errorMessage) {
      console.log('🔍 Error detected in URL:', { errorType, errorMessage });
      
      const decodedMessage = errorMessage ? decodeURIComponent(errorMessage) : getErrorMessage(errorType);
      
      toast.error(decodedMessage, {
        duration: 6000,
        position: 'top-right',
        style: {
          background: '#fee2e2',
          color: '#dc2626',
          border: '1px solid #fecaca',
          fontSize: '14px',
          padding: '16px 20px',
          maxWidth: '500px',
          whiteSpace: 'pre-line'
        },
        icon: '❌',
      });

      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }
  };

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

  useEffect(() => {
    showErrorFromURL();
  }, [searchParams]);

  const toggleForm = () => {
    console.log('Toggle form dari:', isSignup, 'ke:', !isSignup);
    setIsSignup(!isSignup);
    setError("");
    setStep(1); // Reset ke step 1 ketika toggle form
  };

  // Validasi setiap langkah register
  const validateStep = () => {
    switch (step) {
      case 1:
        if (!signupData.nama.trim()) {
          toast.error("Nama lengkap wajib diisi");
          return false;
        }
        if (!signupData.email.trim()) {
          toast.error("Email wajib diisi");
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(signupData.email)) {
          toast.error("Format email tidak valid");
          return false;
        }
        if (!signupData.password) {
          toast.error("Password wajib diisi");
          return false;
        }
        if (signupData.password.length < 6) {
          toast.error("Password minimal 6 karakter");
          return false;
        }
        if (signupData.password !== signupData.confirmPassword) {
          toast.error("Password dan konfirmasi password tidak sama");
          return false;
        }
        break;
      case 2:
        if (!signupData.hp.trim()) {
          toast.error("Nomor telepon wajib diisi");
          return false;
        }
        if (!signupData.tempat_lahir.trim()) {
          toast.error("Tempat lahir wajib diisi");
          return false;
        }
        if (!signupData.tanggal_lahir) {
          toast.error("Tanggal lahir wajib diisi");
          return false;
        }
        break;
      case 3:
        if (!signupData.jenis_kelamin) {
          toast.error("Jenis kelamin wajib diisi");
          return false;
        }
        if (!signupData.alamat.trim()) {
          toast.error("Alamat wajib diisi");
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  // Navigasi ke langkah berikutnya register
  const handleNextStep = () => {
    const isValid = validateStep();
    if (isValid) setStep(step + 1);
  };

  // Navigasi ke langkah sebelumnya register
  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      await login(loginData);
      const user = JSON.parse(localStorage.getItem("authUser"));
      
      toast.success("Login berhasil!");
      
      if (user?.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/user/belanja");
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignupData({ ...signupData, photo: file });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const isValid = validateStep();
    if (!isValid) return;

    try {
      const formDataToSend = new FormData();
      Object.keys(signupData).forEach((key) => {
        if (signupData[key] !== null) {
          formDataToSend.append(key, signupData[key]);
        }
      });

      // Simpan email di localStorage sebelum signup
      localStorage.setItem("email", signupData.email);

      await signup(formDataToSend);
      toast.success("Registrasi berhasil! Silakan verifikasi email Anda.");
      setIsSignup(false);
      setStep(1);
      setSignupData({
        nama: "",
        email: "",
        password: "",
        confirmPassword: "",
        alamat: "",
        photo: null,
        hp: "",
        jenis_kelamin: "",
        tempat_lahir: "",
        tanggal_lahir: "",
      });
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    const previousPath = window.location.pathname;
    localStorage.setItem('preLoginPath', '/');
    
    const selectedRole = 'user';
    const state = JSON.stringify({ 
      role: selectedRole,
      redirect: previousPath 
    });
    const encodedState = encodeURIComponent(state);
    
    window.location.href = `https://batarirtnbantaeng.cloud/auth/v1/google?state=${encodedState}&role=${selectedRole}`;
  };

  return (
    <>
      <div className={`container ${isSignup ? "change" : ""}`}>
        {/* Mobile Toggle Button */}
        <div className="mobile-toggle">
          <button 
            className="toggle-btn"
            onClick={toggleForm}
          >
            <ArrowLeft size={16} />
            {isSignup ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
          </button>
        </div>

        <div className="forms-container">
          {/* Form Daftar - MULTI STEP */}
          <div className="form-control signup-form">
            <form onSubmit={handleSignup}>
              <h2>Daftar Akun</h2>
              <p className="step-indicator">Langkah {step} dari 3</p>
              
              {/* Langkah 1: Informasi Dasar */}
              {step === 1 && (
                <>
                  <div className="input-container">
                    <User className="input-icon" size={18} />
                    <input 
                      type="text" 
                      placeholder="Nama Lengkap" 
                      value={signupData.nama}
                      onChange={(e) => setSignupData({...signupData, nama: e.target.value})}
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
                  <div className="password-hint">
                    <p>Password minimal 6 karakter</p>
                  </div>
                </>
              )}

              {/* Langkah 2: Informasi Profil */}
              {step === 2 && (
                <>
                  <div className="input-container">
                    <ImageIcon className="input-icon" size={18} />
                    <input 
                      type="file"
                      className="file-input"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  <div className="input-container">
                    <Phone className="input-icon" size={18} />
                    <input 
                      type="text" 
                      placeholder="Nomor Telepon" 
                      value={signupData.hp}
                      onChange={(e) => setSignupData({...signupData, hp: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div className="input-container">
                    <MapPin className="input-icon" size={18} />
                    <input 
                      type="text" 
                      placeholder="Tempat Lahir" 
                      value={signupData.tempat_lahir}
                      onChange={(e) => setSignupData({...signupData, tempat_lahir: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div className="input-container">
                    <Calendar className="input-icon" size={18} />
                    <input 
                      type="date"
                      placeholder="Tanggal Lahir" 
                      value={signupData.tanggal_lahir}
                      onChange={(e) => setSignupData({...signupData, tanggal_lahir: e.target.value})}
                      required 
                    />
                  </div>
                </>
              )}

              {/* Langkah 3: Informasi Tambahan */}
              {step === 3 && (
                <>
                  <div className="input-container">
                    <VenusAndMars className="input-icon" size={18} />
                    <select
                      value={signupData.jenis_kelamin}
                      onChange={(e) => setSignupData({...signupData, jenis_kelamin: e.target.value})}
                      required
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="laki-laki">Laki-laki</option>
                      <option value="perempuan">Perempuan</option>
                    </select>
                  </div>
                  
                  <div className="input-container">
                    <MapPin className="input-icon" size={18} />
                    <input 
                      type="text" 
                      placeholder="Alamat Lengkap" 
                      value={signupData.alamat}
                      onChange={(e) => setSignupData({...signupData, alamat: e.target.value})}
                      required 
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="error-message">{error}</p>
              )}

              {/* Tombol Navigasi Register */}
              <div className="step-navigation">
                {step > 1 && (
                  <button 
                    type="button" 
                    className="prev-btn"
                    onClick={handlePrevStep}
                  >
                    Kembali
                  </button>
                )}
                {step < 3 ? (
                  <button 
                    type="button" 
                    className="next-btn"
                    onClick={handleNextStep}
                  >
                    Selanjutnya
                  </button>
                ) : (
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
                )}
              </div>

              {/* Mobile Toggle Link */}
              <div className="mobile-toggle-link">
                <button type="button" onClick={toggleForm}>
                  {isSignup ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
                </button>
              </div>
            </form>
          </div>

          {/* Form Masuk - TETAP SAMA */}
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
                <p className="error-message">{error}</p>
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

              {/* Mobile Toggle Link */}
              <div className="mobile-toggle-link">
                <button type="button" onClick={toggleForm}>
                  {isSignup ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
                </button>
              </div>

              <div className="social-login">
                <div className="divider">
                  <span>Atau lanjut dengan</span>
                </div>
                <button 
                  type="button" 
                  className="google-btn"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <Loader2 size={16} className="spinner" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {isGoogleLoading ? "Memuat..." : "Google"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Panel Samping - Untuk Desktop */}
        <div className="intros-container">
          <div className="intro-control signin-intro">
            <div className="intro-control__inner">
              <h2>Selamat Datang Kembali!</h2>
              <p>
                Kami senang kamu kembali! Silakan masuk untuk melanjutkan ke
                halaman utama.
              </p>
              <button onClick={toggleForm}>
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
              <button onClick={toggleForm}>
                Sudah punya akun? Masuk
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gaya Langsung - DIPERBAIKI untuk form multi-step */}
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        
        body {
          font-family: "Poppins", sans-serif;
          display: flex; 
          justify-content: center; 
          align-items: center;
          height: 100vh; 
          background-color: #e0e7ff; 
          font-size: 14px;
        }
        
        .container {
          background-color: #fff;
          width: 760px; 
          max-width: 100vw; 
          height: 480px;
          position: relative; 
          overflow: hidden; 
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        }
        
        /* Mobile Toggle Button */
        .mobile-toggle {
          display: none;
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 100;
        }
        
        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #2563eb;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .toggle-btn:hover {
          background: rgba(59, 130, 246, 0.2);
        }
        
        .mobile-toggle-link {
          display: none;
          margin-top: 15px;
          text-align: center;
        }
        
        .mobile-toggle-link button {
          background: none;
          border: none;
          color: #2563eb;
          font-size: 12px;
          cursor: pointer;
          text-decoration: underline;
        }
        
        /* FORMS CONTAINER */
        .forms-container { 
          position: absolute;
          left: 0;
          width: 50%; 
          height: 100%;
          text-align: center;
          overflow: hidden;
        }
        
        .form-control {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          transition: all 0.5s ease-in-out;
          top: 0;
        }
        
        /* Form Login - posisi normal */
        .signin-form { 
          opacity: 1; 
          z-index: 2; 
          left: 0;
          transform: translateX(0);
        }
        
        /* Form Register - sembunyikan di kanan */
        .signup-form { 
          opacity: 0; 
          z-index: 1; 
          left: 0;
          transform: translateX(100%);
        }
        
        /* SAAT BERGANSI KE FORM REGISTER */
        .change .signup-form { 
          opacity: 1; 
          z-index: 2; 
          transform: translateX(0);
        }
        
        .change .signin-form { 
          opacity: 0; 
          z-index: 1; 
          transform: translateX(-100%);
        }
        
        .form-control h2 { 
          font-size: 2rem; 
          color: #1e3a8a; 
          margin-bottom: 10px; 
        }
        
        .step-indicator {
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 15px;
        }
        
        .form-control form {
          display: flex; 
          flex-direction: column; 
          margin: 0px 30px;
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
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .form-control form input,
        .form-control form select {
          margin: 0; 
          border: none; 
          padding: 15px 45px;
          background-color: #f3f4f6; 
          border-radius: 5px;
          width: 100%;
          font-family: "Poppins", sans-serif;
          font-size: 14px;
        }
        
        .file-input {
          padding: 12px 45px !important;
        }
        
        .form-control form input:focus,
        .form-control form select:focus {
          outline: 2px solid #2563eb;
          background-color: #fff;
        }
        
        .password-hint {
          margin-top: -5px;
          margin-bottom: 10px;
        }
        
        .password-hint p {
          font-size: 11px;
          color: #6b7280;
          text-align: left;
          margin-left: 5px;
        }
        
        .step-navigation {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 10px;
        }
        
        .prev-btn {
          border: none; 
          padding: 15px 20px; 
          background-color: #f3f4f6; 
          border-radius: 5px;
          color: #374151; 
          cursor: pointer; 
          font-weight: 500;
          font-family: "Poppins", sans-serif;
          transition: background-color 0.2s;
          font-size: 14px;
          flex: 1;
        }
        
        .prev-btn:hover {
          background-color: #e5e7eb;
        }
        
        .next-btn {
          border: none; 
          padding: 15px 20px; 
          background-color: #2563eb; 
          border-radius: 5px;
          color: #fff; 
          cursor: pointer; 
          font-weight: 600;
          font-family: "Poppins", sans-serif;
          transition: background-color 0.2s;
          font-size: 14px;
          flex: 1;
        }
        
        .next-btn:hover {
          background-color: #1d4ed8;
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
          font-size: 14px;
          width: 100%;
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
        
        .error-message {
          color: red; 
          font-size: 12px; 
          margin: 10px 0;
          text-align: center;
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
          font-size: 14px;
        }
        
        .google-btn:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #d1d5db;
        }
        
        .google-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* PANEL SAMPING - Untuk Desktop */
        .intros-container { 
          position: absolute;
          right: 0;
          width: 50%; 
          height: 100%;
          text-align: center;
          overflow: hidden;
        }
        
        .intro-control {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          color: #fff;
          background: linear-gradient(170deg, #3b82f6, #2563eb);
          transition: all 0.5s ease-in-out;
          top: 0;
          padding: 0 40px;
        }
        
        /* Panel untuk form LOGIN - tampil normal */
        .signin-intro { 
          opacity: 1; 
          z-index: 2; 
          transform: translateX(0);
        }
        
        /* Panel untuk form DAFTAR - sembunyikan di kanan */
        .signup-intro { 
          opacity: 0; 
          z-index: 1; 
          transform: translateX(100%);
        }
        
        /* SAAT BERGANSI KE FORM REGISTER */
        .change .signin-intro { 
          opacity: 0; 
          z-index: 1; 
          transform: translateX(-100%);
        }
        
        .change .signup-intro { 
          opacity: 1; 
          z-index: 2; 
          transform: translateX(0);
        }
        
        .intro-control__inner { 
          max-width: 300px;
          margin: 0 auto;
        }
        
        .intro-control h2 {
          font-size: 1.8rem;
          margin-bottom: 15px;
          font-weight: 600;
        }
        
        .intro-control p {
          margin-bottom: 25px;
          line-height: 1.6;
          font-size: 14px;
          opacity: 0.9;
        }
        
        .intro-control button {
          border: none; 
          padding: 12px 30px;
          background-color: rgba(255,255,255,0.2); 
          border-radius: 50px;
          color: #fff; 
          cursor: pointer;
          font-family: "Poppins", sans-serif;
          font-weight: 500;
          transition: all 0.3s ease;
          font-size: 14px;
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
        }
        
        .intro-control button:hover { 
          background-color: rgba(255,255,255,0.3); 
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        /* RESPONSIVE - DIPERBAIKI */
        @media (max-width: 768px) {
          body {
            height: auto;
            min-height: 100vh;
            padding: 20px 0;
            align-items: flex-start;
          }
          
          .container {
            width: 95vw;
            height: auto;
            min-height: 500px;
            margin: 20px 0;
          }
          
          .forms-container {
            width: 100%;
            height: 100%;
            position: relative;
          }
          
          .form-control {
            position: relative;
            height: auto;
            min-height: 500px;
            padding: 60px 0 30px;
            transform: none !important;
            opacity: 1 !important;
            display: none;
          }
          
          .signin-form {
            display: flex;
          }
          
          .change .signin-form {
            display: none;
          }
          
          .change .signup-form {
            display: flex;
          }
          
          .intros-container {
            display: none;
          }
          
          .mobile-toggle {
            display: block;
          }
          
          .mobile-toggle-link {
            display: block;
          }
          
          .form-control form {
            margin: 0px 20px;
          }
          
          .form-control h2 {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .container {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
            margin: 0;
          }
          
          .forms-container {
            height: 100%;
          }
          
          .form-control {
            justify-content: flex-start;
            padding-top: 80px;
            min-height: 100vh;
          }
          
          .form-control form {
            margin: 0px 15px;
          }
          
          .mobile-toggle {
            top: 20px;
            left: 20px;
          }
          
          .toggle-btn {
            font-size: 11px;
            padding: 6px 10px;
          }
        }
      `}</style>
    </>
  );
}