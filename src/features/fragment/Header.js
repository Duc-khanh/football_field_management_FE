import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCurrentUser } from "../../services/authService";
import { FaSearch, FaUser, FaShoppingCart, FaFutbol, FaUsers } from "react-icons/fa";
import "./Header.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchCurrentUser();
        setUser(data);
      } catch (e) {
        console.error("Không lấy được thông tin user", e);
      }
    }
    loadUser();
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <img src="/images/logo.png" alt="Logo" className="logo-img" />
            <div className="logo-text">
              <h1>SPORT WORLD</h1>
              <p>HEART OF THE GAME</p>
            </div>
          </Link>
        </div>

        {/* Ô tìm kiếm */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm sân thể thao"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>

        {/* Menu icon */}
        <nav className="nav-icons">
          <Link to="/booking" className="nav-item">
            <FaFutbol />
            <span>Đặt sân Online</span>
          </Link>
          <Link to="/profile" className="nav-item">
            <FaUser />
            <span>Tài khoản</span>
          </Link>
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
