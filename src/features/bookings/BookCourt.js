import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function BookCourt() {
  const { courtId } = useParams();
  const navigate = useNavigate();

  // State
  const [court, setCourt] = useState(null);
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", content: "" });

  // 1. Lấy thông tin sân
  useEffect(() => {
    axios.get(`http://localhost:8080/api/cour/${courtId}`)
      .then((res) => setCourt(res.data))
      .catch((err) => console.error(err));
  }, [courtId]);

  // 2. Lấy lịch trống
  useEffect(() => {
    if (courtId && date) {
      setLoading(true);
      axios.get(`http://localhost:8080/api/bookings/availability?courtId=${courtId}&date=${date}`)
        .then((res) => {
          setSlots(res.data);
          setSelectedSlotId(null);
        })
        .catch((err) => console.error("Lỗi lấy lịch:", err))
        .finally(() => setLoading(false));
    }
  }, [courtId, date]);

  // 3. Xử lý đặt sân
  const handleBooking = () => {
    setMsg({ type: "", content: "" });

    const accountId = localStorage.getItem("accountId");
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (!accountId || !token) {
      setMsg({ type: "error", content: "Bạn cần đăng nhập để đặt sân!" });
      return;
    }

    if (!selectedSlotId) {
      setMsg({ type: "error", content: "Vui lòng chọn khung giờ!" });
      return;
    }

    const bookingPayload = {
      accountId: parseInt(accountId),
      courId: parseInt(courtId),
      timeSlotId: selectedSlotId,
      bookingDate: date,
      price: 200000
    };

    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };

    axios.post("http://localhost:8080/api/bookings", bookingPayload, config)
      .then(() => {
        setMsg({ type: "success", content: "Đặt sân thành công! Đang chuyển hướng..." });
        setTimeout(() => navigate("/history"), 2000);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) {
          setMsg({ type: "error", content: "Hết phiên đăng nhập. Vui lòng login lại." });
        } else {
          setMsg({ type: "error", content: err.response?.data?.message || "Lỗi đặt sân." });
        }
      })
      .finally(() => setLoading(false));
  };

  if (!court) return <div style={{ textAlign: "center", marginTop: 20 }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "30px auto", fontFamily: "Arial, sans-serif" }}>
      
      {/* Header Info */}
      <div style={{ paddingBottom: "15px", borderBottom: "1px solid #eee", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "#2c3e50" }}>Sân: {court.courName}</h2>
        <p style={{ margin: "5px 0 0 0", color: "#7f8c8d" }}>{court.address}</p>
      </div>

      {/* Thông báo */}
      {msg.content && (
        <div style={{
          padding: "12px", 
          marginBottom: "20px", 
          borderRadius: "6px",
          backgroundColor: msg.type === "error" ? "#fdecea" : "#e8f8f5",
          color: msg.type === "error" ? "#c0392b" : "#27ae60",
          border: `1px solid ${msg.type === "error" ? "#e74c3c" : "#2ecc71"}`
        }}>
          {msg.content}
        </div>
      )}

      {/* Chọn ngày */}
      <div style={{ marginBottom: "25px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Chọn ngày đá:</label>
        <input 
          type="date" 
          value={date} 
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #bdc3c7", width: "200px" }}
        />
      </div>

      {/* Grid Khung Giờ */}
      <h3 style={{ fontSize: "18px", marginBottom: "15px" }}>Chọn khung giờ trống:</h3>
      
      {loading ? (
        <p style={{color: "#7f8c8d"}}>Đang tải dữ liệu...</p>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", 
          gap: "12px" 
        }}>
          {slots.map((slot) => {
            const isBooked = slot.isBooked;
            const isSelected = selectedSlotId === slot.id;

            return (
              <button
                key={slot.id}
                disabled={isBooked}
                onClick={() => setSelectedSlotId(slot.id)}
                style={{
                  padding: "15px",
                  borderRadius: "8px",
                  border: isSelected ? "2px solid #3498db" : "1px solid #ecf0f1",
                  backgroundColor: isBooked ? "#ecf0f1" : (isSelected ? "#eaf2f8" : "#fff"),
                  color: isBooked ? "#bdc3c7" : (isSelected ? "#2980b9" : "#2c3e50"),
                  cursor: isBooked ? "not-allowed" : "pointer",
                  fontWeight: isSelected ? "bold" : "normal",
                  boxShadow: isBooked ? "none" : "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ fontSize: "15px", marginBottom: "4px" }}>{slot.time}</div>
                <div style={{ fontSize: "12px", color: isBooked ? "#bdc3c7" : "#27ae60" }}>
                  {isBooked ? "Đã đặt" : `${slot.price.toLocaleString()}đ`}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Nút Submit */}
      <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
        <button 
          onClick={handleBooking}
          disabled={loading || !selectedSlotId}
          style={{
            padding: "12px 30px",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: (loading || !selectedSlotId) ? "not-allowed" : "pointer",
            opacity: (loading || !selectedSlotId) ? 0.6 : 1,
            marginRight: "10px"
          }}
        >
          {loading ? "Đang xử lý..." : "Xác nhận đặt sân"} 
        </button>

        <button 
          onClick={() => navigate(-1)}
          style={{
            padding: "12px 20px",
            backgroundColor: "#fff",
            color: "#7f8c8d",
            border: "1px solid #bdc3c7",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}

export default BookCourt;
