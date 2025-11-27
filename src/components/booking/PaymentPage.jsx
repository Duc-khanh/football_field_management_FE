import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData } = location.state || {};

  const [method, setMethod] = useState("CASH");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false); // ✅ hiển thị toast

  if (!bookingData) {
    return <div className="container mt-5">⚠️ Không có dữ liệu thanh toán!</div>;
  }

 const handlePayment = async () => {
  setLoading(true);
  const token = localStorage.getItem("token");

  try {
    // Xác nhận thanh toán
    const result = await Swal.fire({
      title: "Xác nhận thanh toán",
      text: `Thanh toán ${bookingData.price?.toLocaleString()}₫ bằng ${method}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Thanh toán",
      cancelButtonText: "Huỷ",
    });

    if (!result.isConfirmed) {
      setLoading(false);
      return;
    }

    // Gọi API
    await axios.post(
      "http://localhost:8080/api/invoice/create",
      {
        bookingId: bookingData.timeSlotId,
        paymentMethodId: method,
        status: "PAID",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // ✅ TOAST THÀNH CÔNG GÓC PHẢI
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "🎉 Thanh toán thành công!",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        popup: "swal-toast-margin"
      }
    });

    // ✅ CHỜ 2 GIÂY RỒI CHUYỂN TRANG
    setTimeout(() => {
      navigate("/");
    }, 2000);

  } catch (err) {
    console.error(err);

    // ❌ TOAST LỖI
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "❌ Thanh toán thất bại!",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      customClass: {
        popup: "swal-toast-margin"
      }
    });

  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container mt-4">

      {/* ✅ TOAST THÔNG BÁO GÓC PHẢI */}
      {showToast && (
        <div style={toastStyle}>
          🎉 Thanh toán thành công!
        </div>
      )}

      <div className="card shadow-sm p-3 mx-auto" style={{ maxWidth: "600px" }}>
        <h3 className="mb-3 text-center text-primary">💳 Xác nhận Thanh toán</h3>

        <div className="mb-3"><strong>Người đặt:</strong> {bookingData.customerName}</div>
        <div className="mb-3"><strong>Ngày:</strong> {bookingData.bookingDate}</div>
        <div className="mb-3"><strong>Giờ:</strong> {bookingData.time}</div>

        <div className="mb-3">
          <strong>Giá:</strong>{" "}
          <span className="text-success fw-bold">
            {bookingData.price?.toLocaleString()}₫
          </span>
        </div>

        <hr />

        <h5>Chọn phương thức thanh toán</h5>

        <select
          className="form-select mb-3"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="CASH">💵 Tiền mặt</option>
          <option value="BANKING">🏦 Chuyển khoản</option>
          <option value="MOMO">📱 Ví MoMo</option>
        </select>

        {(method === "MOMO" || method === "BANKING") && (
          <div className="text-center mb-3">
            <h6 className="mt-3 text-primary fw-bold">
              {method === "MOMO" ? "Quét MoMo để thanh toán" : "Quét QR ngân hàng"}
            </h6>

            <img
              src={method === "MOMO" ? "/qr/qr_momo.jpg" : "/qr/qr.jpg"}
              alt="QR Payment"
              style={{ width: "240px", borderRadius: "12px" }}
            />

            <p className="mt-2 small text-muted">
              Nội dung: <strong>{bookingData.customerName}</strong>
            </p>
          </div>
        )}

        <button
          className="btn btn-success w-100 fw-bold"
          disabled={loading}
          onClick={handlePayment}
        >
          {loading ? "Đang xử lý..." : "XÁC NHẬN THANH TOÁN"}
        </button>
      </div>
    </div>
  );
}

/* ✅ CSS Toast */
const toastStyle = {
  position: "fixed",
  top: "20px",
  right: "20px",
  background: "#28a745",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: "8px",
  fontWeight: "bold",
  boxShadow: "0 5px 10px rgba(0,0,0,0.15)",
  zIndex: 9999,
  animation: "fadein 0.3s",
};
