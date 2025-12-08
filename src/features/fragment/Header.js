import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaFutbol } from "react-icons/fa";
import Swal from "sweetalert2";
import "./Header.css";

export default function Header({ onSearch }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [fullName, setFullName] = useState(localStorage.getItem("fullName"));
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  // ----- EFFECT: LẤY TOKEN & FULLNAME -----
  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
    setFullName(localStorage.getItem("fullName"));
  }, []);

  // ----- EFFECT: SCROLL THU NHỎ HEADER -----
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".header");

      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ----- LOGOUT -----
  const handleLogout = () => {
    Swal.fire({
      title: "Bạn có chắc muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire({
          icon: "success",
          title: "Đã đăng xuất!",
          showConfirmButton: false,
          timer: 1000,
        });
        setTimeout(() => {
          window.location.href = "http://localhost:8080/auth/login";
        }, 1000);
      }
    });
  };

  // ----- CLICK ACCOUNT -----
  const handleAccountClick = () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn chưa đăng nhập",
        confirmButtonText: "Đăng nhập",
      }).then(() => {
        window.location.href = "http://localhost:8080/auth/login";
      });
    } else {
      setOpen(!open);
    }
  };

  // ----- SEARCH -----
  const handleSearch = () => {
    if (!keyword.trim()) return;
    if (onSearch) onSearch(keyword);
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* Logo */}
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <img
              src="https://img.lovepik.com/photo/40016/8755.jpg_wh860.jpg"
              className="logo-img"
              alt="logo"
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
            placeholder="Tìm sân thể thao..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (e.target.value === "" && onSearch) onSearch("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Navigation */}
        <nav className="nav-icons">
          <Link to="/" className="nav-item">
            <FaFutbol />
            <span>Đặt sân Online</span>
          </Link>

          {/* Account */}
          <div className="nav-item account" onClick={handleAccountClick}>
            <FaUser />
            <span>{token ? fullName : "Tài khoản"}</span>

            {token && open && (
              <div className="dropdown">
                <div className="dropdown-item" onClick={() => navigate("/profile")}>
                  Hồ sơ của tôi
                </div>
                <div className="dropdown-item" onClick={handleLogout}>
                  Đăng xuất
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
