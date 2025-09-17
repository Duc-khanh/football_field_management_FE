import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} Football Field Management. All rights reserved.
        </p>
        <ul className="footer-links">
          <li><a href="/about">Về chúng tôi</a></li>
          <li><a href="/contact">Liên hệ</a></li>
          <li><a href="/policy">Chính sách</a></li>
        </ul>
      </div>
    </footer>
  );
}
