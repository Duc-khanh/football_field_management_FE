import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaFutbol } from "react-icons/fa";
import Swal from "sweetalert2";
import "./Header.css";

export default function Header({ onSearch }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [fullName, setFullName] = useState(localStorage.getItem("fullName"));
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
    setFullName(localStorage.getItem("fullName"));
  }, []);

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

  const handleSearch = () => {
    if (!keyword.trim()) return;

    // ❌ BỎ DÒNG navigate("/booking") — không cần chuyển trang
    // navigate("/booking");

    // ✔️ Gửi từ khóa về cha để VenueList lọc
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

    // Nếu người dùng xóa hết → reset danh sách
    if (e.target.value === "") {
      if (onSearch) onSearch("");
    }
  }}
  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
/>

<Link
  to="/"
  className="logo-link"
  onClick={() => {
    setKeyword("");   // reset input
    if (onSearch) onSearch(""); // reset search
  }}
>
</Link>

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
