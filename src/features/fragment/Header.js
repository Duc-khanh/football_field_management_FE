import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FaSearch, FaUser, FaShoppingCart, FaFutbol } from "react-icons/fa";
import Swal from "sweetalert2";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [fullName, setFullName] = useState(localStorage.getItem("fullName"));

  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
    setFullName(localStorage.getItem("fullName"));
  }, []);

  window.addEventListener("storage", () => {
    setToken(localStorage.getItem("authToken"));
    setFullName(localStorage.getItem("fullName"));
  });

  // === Xử lý đăng xuất ===
  const handleLogout = () => {
    Swal.fire({
      title: "Bạn có chắc muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if (result.isConfirmed) {
        // Xóa dữ liệu đăng nhập
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("fullName");

        Swal.fire({
          icon: "success",
          title: "Đã đăng xuất!",
          showConfirmButton: false,
          timer: 1200
        });

        setTimeout(() => {
          // Chuyển hướng về trang Thymeleaf login
          window.location.href = "http://localhost:8080/auth/login";
        }, 1200);
      }
    });
  };

  // === Xử lý khi click vào tài khoản ===
  const handleAccountClick = () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn chưa đăng nhập",
        text: "Bạn cần đăng nhập để sử dụng chức năng này.",
        confirmButtonText: "Đăng nhập ngay"
      }).then(() => {
        window.location.href = "http://localhost:8080/auth/login"; 
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

          {/* Đăng xuất */}
          {token && (
            <div className="nav-item" onClick={handleLogout} style={{ cursor: "pointer" }}>
              <span>Đăng xuất</span>
            </div>
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
