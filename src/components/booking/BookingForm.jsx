import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookingForm = ({ selectedSlot }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    date: "",
    time: "",
    note: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState("");

  // Kiểm tra login khi load form
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fullName = localStorage.getItem("fullName");

    if (!token) {
      alert("⚠️ Bạn cần đăng nhập trước khi đặt sân!");
      navigate("/login");
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
      alert("Vui lòng chọn khung giờ!");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("⚠️ Phiên đăng nhập hết hạn!");
      navigate("/login");
      return;
    }

    const slotId = selectedSlot.time_slot_id || selectedSlot.id;
    if (!slotId) {
      alert("Không tìm thấy Slot ID.");
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

          {/* Giá sân */}
          <div className="mb-3 p-2 bg-light rounded border">
            <strong>Giá sân: </strong>
            <span className="text-success fw-bold">
              {selectedSlot?.price?.toLocaleString()}₫
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
