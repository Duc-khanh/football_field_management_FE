import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Stack from "react-bootstrap/Stack";
import { fetchCurrentUser } from "../../services/authService";
import "./Header.css";
export default function Header() {
  const [user, setUser] = useState(null);

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
      <Stack
        direction="horizontal"
        gap={3}
        className="header-container px-3 py-2"
      >
        <h1 className="logo m-0">
          <Link to="/" className="logo-link">
            Sân bóng 247
          </Link>
        </h1>

        <nav className="ms-auto">
          <ul className="nav-links mb-0">
            <li>
              <Link to="/">Sân thể thao</Link>
            </li>
            <li>
              <Link to="/booking">Đặt sân</Link>
            </li>
            <li>
              <Link to="/cart">Giỏ hàng</Link>
            </li>
            <li>
              <Link to="/contact">Liên hệ</Link>
            </li>
          </ul>
        </nav>

        {/* Avatar user */}
        <div className="user-avatar">
          <img
  src={
    user?.avatarUrl
      ? `http://localhost:8080/uploads/avatars/${user.avatarUrl}`
      : "/images/avatar.png"
  }
  alt="Avatar"
  className="avatar-img"
/>
        </div>
      </Stack>
    </header>
  );
}
