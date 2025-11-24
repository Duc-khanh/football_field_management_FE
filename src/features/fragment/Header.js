import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FaSearch, FaUser, FaShoppingCart, FaFutbol } from "react-icons/fa";
import Swal from "sweetalert2";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();

  // 👉 dùng state để component re-render khi đăng nhập
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [fullName, setFullName] = useState(localStorage.getItem("fullName"));

  // 👉 Khi load trang hoặc token thay đổi → cập nhật UI
  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
    setFullName(localStorage.getItem("fullName"));
  }, []);

  // 👉 Khi người dùng đăng nhập thành công (localStorage thay đổi)
  window.addEventListener("storage", () => {
    setToken(localStorage.getItem("authToken"));
    setFullName(localStorage.getItem("fullName"));
  });

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("fullName");

    navigate("/");
    window.location.reload();
  };

  const handleAccountClick = () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn chưa đăng nhập",
        text: "Bạn cần đăng nhập để sử dụng chức năng này.",
        confirmButtonText: "Đăng nhập ngay"
      }).then(() => {
        window.location.href = "http://localhost:3000/login"; 
      });
    } else {
      navigate("/profile");
    }
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* Logo */}
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <img
              src="https://img.lovepik.com/photo/40016/8755.jpg_wh860.jpg"
              alt="Logo"
              className="logo-img"
            />
            <div className="logo-text">
              <h1>SPORT WORLD</h1>
              <p>HEART OF THE GAME</p>
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm sân thể thao"
          />
          <FaSearch className="search-icon" />
        </div>

        {/* Navigation */}
        <nav className="nav-icons">

          <Link to="/booking" className="nav-item">
            <FaFutbol />
            <span>Đặt sân Online</span>
          </Link>

          {/* ICON TÀI KHOẢN */}
          <div className="nav-item" onClick={handleAccountClick} style={{ cursor: "pointer" }}>
            <FaUser />
            <span>{token ? fullName : "Tài khoản"}</span>
          </div>

          {/* Đăng xuất & Hồ sơ */}
          {token && (
            <>
          

              <div className="nav-item" onClick={handleLogout} style={{ cursor: "pointer" }}>
                <span>Đăng xuất</span>
              </div>
            </>
          )}

          {/* Cart */}
          <Link to="/cart" className="nav-item cart">
            <FaShoppingCart />
            <span>Giỏ hàng</span>
            <span className="cart-count">0</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
  