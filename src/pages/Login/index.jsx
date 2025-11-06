import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      const role = JSON.parse(localStorage.getItem("user"))?.role;
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/user/belanja");
      }
    } else {
      setError("Username atau password salah!");
    }
  };

  return (
    <>
      <div className={`container ${isSignup ? "change" : ""}`}>
        <div className="forms-container">
          {/* Form Daftar */}
          <div className="form-control signup-form">
            <form>
              <h2>Daftar Akun</h2>
              <input type="text" placeholder="Nama Pengguna" required />
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Kata Sandi" required />
              <input
                type="password"
                placeholder="Konfirmasi Kata Sandi"
                required
              />
              <button type="button">Daftar</button>
            </form>
          </div>

          {/* Form Masuk */}
          <div className="form-control signin-form">
            <form onSubmit={handleSubmit}>
              <h2>Masuk</h2>
              <input
                type="text"
                placeholder="Nama Pengguna"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && (
                <p style={{ color: "red", fontSize: "12px" }}>{error}</p>
              )}
              <button type="submit">Masuk</button>
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
        .form-control h2 { font-size: 2rem; color: #1e3a8a; }
        .form-control form {
          display: flex; flex-direction: column; margin: 0px 30px;
        }
        .form-control form input {
          margin: 10px 0px; border: none; padding: 15px;
          background-color: #f3f4f6; border-radius: 5px;
        }
        .form-control form button {
          border: none; padding: 15px; margin-top: 10px;
          background-color: #2563eb; border-radius: 5px;
          color: #fff; cursor: pointer; font-weight: 600;
        }
        .form-control form button:hover {
          background-color: #1d4ed8;
        }
        .form-control span { margin: 10px 0px; }
        .socials i {
          margin: 0 5px; color: #fff; border-radius: 50%;
        }
        .fa-facebook-f { padding: 5px 8px; background-color: #3b5998; }
        .fa-google-plus-g { padding: 5px 4px; background-color: #db4a39; }
        .fa-linkedin-in { padding: 5px 6px; background-color: #0e76a8; }

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
          border: none; padding: 15px 30px;
          background-color: #1e40af; border-radius: 50px;
          color: #fff; margin: 10px 0px; cursor: pointer;
        }
        .intro-control button:hover { background-color: #1e3a8a; }

        .signin-intro { opacity: 1; z-index: 2; }
        .signup-intro { opacity: 0; z-index: 1; }

        .change .signup-form { opacity: 1; z-index: 2; transform: translateX(-100%); }
        .change .signup-form button { background-color: #2563eb !important; }
        .change .signin-form { opacity: 0; z-index: 1; transform: translateX(-100%); }
        .change .intro-control {
          transform: translateX(-100%);
          background: linear-gradient(170deg, #2563eb, #1e3a8a);
        }
        .change .signin-intro { opacity: 0; z-index: 1; }
        .change .signup-intro { opacity: 1; z-index: 2; }
      `}</style>
    </>
  );
}
