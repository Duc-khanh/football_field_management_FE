import React from "react";
import "./Footer.css";
import paymentImg from "../../assets/payment.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>Chính sách</h3>
          <ul>
            <li>Chính sách bảo mật</li>
            <li>Hướng dẫn đổi trả</li>
            <li>Cam kết chất lượng</li>
            <li>Giao hàng & Nhận hàng</li>
            <li>Đặt hàng & Thanh toán</li>
          </ul>
        </div>

        {/* --- Hỗ trợ --- */}
        <div className="footer-column">
          <h3>Hỗ trợ</h3>
          <ul>
            <li>Hotline bán sỉ: <span className="hotline">0335 088 588</span></li>
            <li>Hotline hợp tác: <span className="hotline">0335 088 588</span></li>
            <li>Email: <span className="email">phamtran@thegioithethao.vn</span></li>
            <li>Giới thiệu công ty</li>
            <li>Liên hệ</li>
          </ul>
        </div>

        {/* --- Dịch vụ --- */}
        <div className="footer-column">
          <h3>Dịch vụ</h3>
          <ul>
            <li>Tư vấn đầu tư thể thao</li>
            <li>Thiết kế & thi công sân thể thao</li>
            <li>Phần mềm quản lý thể thao</li>
            <li>Phần mềm tổ chức giải đấu</li>
            <li>Marketing sân - Tìm & chăm sóc khách hàng</li>
          </ul>
        </div>

        {/* --- Giao dịch an toàn --- */}
        <div className="footer-column">
          <h3>Giao dịch an toàn</h3>
          <img src={paymentImg} alt="Phương thức thanh toán" className="payment-img" />
        </div>
      </div>

      {/* --- Dòng bản quyền --- */}
      <div className="footer-bottom">
        <p>
          Copyright © {new Date().getFullYear()} Football Field Management. Bản quyền thuộc về{" "}
          <span className="brand">Thế Giới Thể Thao</span>
        </p>
        <p>Công ty Cổ Phần Đầu Tư Và Xây Dựng Thế Giới Thể Thao</p>
        <p>Giấy chứng nhận đăng ký kinh doanh số: 0801445522</p>
      </div>
    </footer>
  );
}
