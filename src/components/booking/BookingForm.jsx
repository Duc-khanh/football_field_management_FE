import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BookingForm = ({ selectedSlot }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    date: "",
    time: "",
    note: "",
  });

  const [userName, setUserName] = useState("");

  // Kiểm tra login khi load form
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fullName = localStorage.getItem("fullName");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn cần đăng nhập",
        text: "Vui lòng đăng nhập trước khi đặt sân",
        confirmButtonText: "Đi đến trang đăng nhập",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    setUserName(fullName || "");
  }, [navigate]);

  // Điền ngày/giờ nếu có selectedSlot
  useEffect(() => {
    if (selectedSlot) {
      let displayTime = selectedSlot.time || "";
      if (!displayTime && selectedSlot.start_time && selectedSlot.end_time) {
        const start = selectedSlot.start_time.slice(0, 5);
        const end = selectedSlot.end_time.slice(0, 5);
        displayTime = `${start} - ${end}`;
      }

      let displayDate = selectedSlot.date;
      if (displayDate?.includes("-")) {
        const parts = displayDate.split("-");
        if (parts[0].length === 4) displayDate = parts.reverse().join("/");
      }

      setFormData((prev) => ({
        ...prev,
        date: displayDate,
        time: displayTime,
      }));
    }
  }, [selectedSlot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateDuration = (slot) => {
    if (slot.start_time && slot.end_time) {
      try {
        const start = parseInt(slot.start_time.split(":")[0]);
        const end = parseInt(slot.end_time.split(":")[0]);
        return end - start;
      } catch {
        return 1.5;
      }
    }
    return 1.5;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      Swal.fire({
        icon: "warning",
        title: "Chưa chọn khung giờ",
        text: "Vui lòng chọn khung giờ trước khi đặt sân",
      });
      return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Phiên đăng nhập hết hạn",
        confirmButtonText: "Đăng nhập lại",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    const slotId = selectedSlot.time_slot_id || selectedSlot.id;
    if (!slotId) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tìm thấy Slot ID",
      });
      return;
    }

    const bookingPayload = {
      courId: Number(selectedSlot.courId || selectedSlot.cour_id || 1),
      timeSlotId: slotId,
      bookingDate: selectedSlot.date,
      customerName: userName,
      email: formData.email,
      phone: formData.phone,
      note: formData.note,
      price: selectedSlot.price,
      duration: calculateDuration(selectedSlot),
    };

    navigate("/payment", {
      state: {
        bookingData: bookingPayload,
        selectedSlot: selectedSlot,
      },
    });
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h4 className="card-title mb-3 text-primary">Đặt sân theo yêu cầu</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small text-muted">Người đặt</label>
            <input
              type="text"
              className="form-control mb-2"
              value={userName}
              readOnly
            />
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email (không bắt buộc)"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small text-muted">Thời gian đã chọn</label>
            <div className="row g-2">
              <div className="col">
                <input
                  type="text"
                  name="date"
                  className="form-control bg-light"
                  value={formData.date}
                  readOnly
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  name="time"
                  className="form-control bg-light fw-bold text-primary"
                  value={formData.time}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="mb-3 p-2 bg-light rounded border">
            <strong>Giá sân: </strong>
            <span className="text-success fw-bold">
              {selectedSlot?.price?.toLocaleString()}.000
            </span>
          </div>

          <textarea
            name="note"
            className="form-control mb-3"
            placeholder="Ghi chú..."
            rows="2"
            value={formData.note}
            onChange={handleChange}
          ></textarea>

          <button
            type="submit"
            className="btn btn-warning w-100 py-2 fw-bold"
          >
            🔥 THANH TOÁN & ĐẶT SÂN
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
