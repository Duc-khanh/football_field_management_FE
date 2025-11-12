import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function VenueDetail() {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy thông tin sân lớn (venue)
    axios
      .get(`http://localhost:8080/api/home?page=0&size=1&keyword=&venueId=${venueId}`)
      .then((res) => {
        const content = Array.isArray(res.data) ? res.data : res.data?.content;
        if (content && content.length > 0) {
          setVenue(content[0]);
        }
      })
      .catch((err) => console.error("Lỗi lấy venue:", err));

    // Lấy danh sách sân nhỏ (courts)
    axios
      .get(`http://localhost:8080/api/cour/venue/${venueId}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        // Ép kiểu status về boolean chuẩn
        const normalizedCourts = data.map((c) => ({
          ...c,
          status: c.status === true || c.status === "true" || c.status === 1,
        }));
        setCourts(normalizedCourts);
      })
      .catch((err) => console.error("Lỗi lấy courts:", err));
  }, [venueId]);

  const handleBookCourt = (courtId) => {
    navigate(`/book/${courtId}`);
  };

  if (!venue) return <p>Đang tải thông tin...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "6px 12px",
          marginBottom: "20px",
          background: "#3498db",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ⬅ Quay lại
      </button>

      <h2>{venue.venueName}</h2>
<img
    src={
      venue.images && venue.images.length > 0
        ? `http://localhost:8080/uploads/avatars/${
            venue.images.find((img) => img.isPrimary)?.photoPath || // <--- SỬA Ở ĐÂY
            venue.images[0].photoPath
          }`
        : "/images/broken-image.png"
    }
    alt={venue.venueName}
    //... (style)
  />

      <p>
        <b>Địa chỉ:</b> {venue.address}
      </p>
      <p>
        <b>Trạng thái:</b> {venue.status ? "Hoạt động" : "Đang bảo trì"}
      </p>

      <h3 style={{ marginTop: "20px" }}>Danh sách sân nhỏ</h3>
      {courts.length === 0 ? (
        <p>Chưa có sân nhỏ nào.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {courts.map((c) => (
            <div
              key={c.courId}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={
                  c.image
                    ? `http://localhost:8080/uploads/avatars/${c.image}`
                    : "/images/broken-image.png"
                }
                alt={c.courName}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
              <h4 style={{ margin: "10px 0" }}>{c.courName}</h4>
              <p>💰 {c.pricePerHour} VNĐ/h</p>
              <p>⚡ {c.status ? "Hoạt động" : "Đang bảo trì"}</p>

              <button
                onClick={() => handleBookCourt(c.courId)}
                disabled={!c.status}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  background: c.status ? "#28a745" : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: c.status ? "pointer" : "not-allowed",
                  width: "100%",
                }}
              >
                Đặt sân
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VenueDetail;
