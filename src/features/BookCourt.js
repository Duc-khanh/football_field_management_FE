import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function BookCourt() {
  const { courtId } = useParams();
  const navigate = useNavigate();

  const [court, setCourt] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [date, setDate] = useState("");
  const [slotId, setSlotId] = useState(""); // chọn khung giờ
  const [hours, setHours] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/cour/${courtId}`)
      .then((res) => setCourt(res.data))
      .catch((err) => console.error("Lỗi lấy thông tin sân:", err));

    axios
      .get("http://localhost:8080/api/timeslots")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTimeSlots(res.data);
        }
      })
      .catch((err) => console.error("Lỗi lấy time slots:", err));
  }, [courtId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!date || !slotId || !hours) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Lấy accountId từ localStorage (lưu khi login)
    const accountId = localStorage.getItem("accountId");
    if (!accountId) {
      setError("Bạn cần đăng nhập để đặt sân.");
      return;
    }

    const bookingData = {
      accountId: accountId,
      courtId: court.courId,
      slotsId: slotId,
      date,
      hours,
    };

    setLoading(true);
    axios
      .post("http://localhost:8080/api/bookings", bookingData)
      .then((res) => {
        setSuccess("Đặt sân thành công!");
        setTimeout(() => navigate(-1), 2000);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Đặt sân thất bại.");
      })
      .finally(() => setLoading(false));
  };

  if (!court) return <p>Đang tải thông tin sân...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Đặt sân: {court.courName}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <label>
          Ngày:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label>
          Chọn khung giờ:
          <select
            value={slotId}
            onChange={(e) => setSlotId(e.target.value)}
            required
          >
            <option value="">-- Chọn khung giờ --</option>
            {timeSlots.map((slot) => (
              <option key={slot.slotsId} value={slot.slotsId}>
                {slot.startTime} - {slot.endTime}
              </option>
            ))}
          </select>
        </label>

        <label>
          Số giờ:
          <input
            type="number"
            value={hours}
            min="1"
            max="12"
            onChange={(e) => setHours(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            background: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Đang đặt..." : "Đặt sân"}
        </button>
      </form>

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "10px",
          padding: "6px 12px",
          background: "#3498db",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ⬅ Quay lại
      </button>
    </div>
  );
}

export default BookCourt;
