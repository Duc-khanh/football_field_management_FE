import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // Sửa: Destructure cả bookingData và selectedSlot
  const { bookingData, selectedSlot } = location.state || {};

  const [method, setMethod] = useState("CASH");
  const [loading, setLoading] = useState(false);
  const [courtName, setCourtName] = useState(selectedSlot?.courtName || "Đang tải...");

  // Nếu cần, gọi API lấy tên sân dựa trên courId (nếu selectedSlot không có courtName)
  useEffect(() => {
    if (!selectedSlot?.courtName && bookingData?.courId) {
      axios.get(`http://localhost:8080/api/courts/${bookingData.courId}`)
        .then(res => setCourtName(res.data.name || "Sân không xác định"))
        .catch(() => setCourtName("Sân không xác định"));
    }
  }, [bookingData, selectedSlot]);

  if (!bookingData || !selectedSlot) {
    return <div className="container mt-5">⚠️ Không có dữ liệu thanh toán!</div>;
  }

  // Hàm format ngày/giờ để hiển thị đẹp
  const formatDate = (dateStr) => dateStr ? dateStr.split("-").reverse().join("/") : "N/A";
  const formatTime = (slot) => {
    if (slot.time) return slot.time;
    if (slot.start_time && slot.end_time) {
      return `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`;
    }
    return "N/A";
  };

  const handlePayment = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn chưa đăng nhập",
        text: "Vui lòng đăng nhập để thanh toán",
        confirmButtonText: "Đăng nhập",
      }).then(() => navigate("/login"));
      setLoading(false);
      return;
    }

    try {
      // 1. Xác nhận thanh toán
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

      // --- BƯỚC QUAN TRỌNG: TẠO BOOKING TRƯỚC ---
      // Chuẩn bị data cho BookingDTO (khớp với Backend)
      const bookingPayload = {
        courId: bookingData.courId,       // ID sân
        timeSlotId: bookingData.timeSlotId, // ID khung giờ
        bookingDate: bookingData.bookingDate, // Ngày đặt (yyyy-MM-dd)
        price: bookingData.price,
        customerName: bookingData.customerName,
        phone: bookingData.phone,       // Nếu có
        email: bookingData.email,       // Nếu có
        note: "Thanh toán qua " + method,
        accountId: bookingData.accountId // Nếu trang trước đã có, không thì backend tự lấy qua token
      };

      // Gọi API tạo Booking
      const bookingResponse = await axios.post(
        "http://localhost:8080/api/booking", 
        bookingPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Lấy Booking ID thật vừa được tạo từ Database
      const realBookingId = bookingResponse.data.bookingId; 
      
      console.log("Booking created with ID:", realBookingId);

      // --- BƯỚC TIẾP THEO: TẠO HÓA ĐƠN (INVOICE) ---
      await axios.post(
        "http://localhost:8080/api/invoice/create",
        {
          bookingId: realBookingId, // ✅ Dùng ID thật, không dùng timeSlotId nữa
          paymentMethodId: method,
          status: "PAID",
          amount: bookingData.price 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Thông báo thành công
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "🎉 Đặt sân & Thanh toán thành công!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      setTimeout(() => navigate("/my-bookings"), 2000); // Chuyển về trang lịch sử đặt

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Có lỗi xảy ra!";

      if (err.response?.status === 401) {
        Swal.fire({
            icon: "error",
            title: "Phiên hết hạn",
            confirmButtonText: "Đăng nhập",
        }).then(() => navigate("/login"));
      } else {
        Swal.fire({
          icon: "error",
          title: "❌ Thất bại!",
          text: errorMessage, // Hiển thị lỗi từ backend (ví dụ: Sân đã bị người khác đặt)
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h3 className="text-center mb-4">Thanh toán đặt sân</h3>
        
        {/* Phần hiển thị thông tin đặt sân */}
        <div className="mb-4">
          <h5 className="text-primary">Thông tin đặt sân</h5>
          <div className="row">
            <div className="col-6"><strong>Tên sân:</strong></div>
            <div className="col-6">{courtName}</div>
          </div>
          <div className="row">
            <div className="col-6"><strong>Ngày:</strong></div>
            <div className="col-6">{formatDate(bookingData.bookingDate)}</div>
          </div>
          <div className="row">
            <div className="col-6"><strong>Giờ:</strong></div>
            <div className="col-6">{formatTime(selectedSlot)}</div>
          </div>
          <div className="row">
            <div className="col-6"><strong>Giá:</strong></div>
            <div className="col-6 text-success fw-bold">{bookingData.price?.toLocaleString()}₫</div>
          </div>
          <div className="row">
            <div className="col-6"><strong>Tên khách:</strong></div>
            <div className="col-6">{bookingData.customerName}</div>
          </div>
          <div className="row">
            <div className="col-6"><strong>Số điện thoại:</strong></div>
            <div className="col-6">{bookingData.phone || "N/A"}</div>
          </div>
          <div className="row">
            <div className="col-6"><strong>Email:</strong></div>
            <div className="col-6">{bookingData.email || "N/A"}</div>
          </div>
          <div className="row">
            <div className="col-6"><strong>Ghi chú:</strong></div>
            <div className="col-6">{bookingData.note || "Không có"}</div>
          </div>
        </div>

        {/* Phần chọn phương thức thanh toán */}
        <div className="mb-4">
          <h5>Chọn phương thức thanh toán</h5>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="method"
              id="cash"
              value="CASH"
              checked={method === "CASH"}
              onChange={(e) => setMethod(e.target.value)}
            />
            <label className="form-check-label" htmlFor="cash">
              Tiền mặt
            </label>
          </div>
          {/* Thêm các phương thức khác nếu cần, ví dụ: VNPay, Momo */}
        </div>

        {/* Button thanh toán */}
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
