import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function VenueDetail() {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy sân lớn theo venueId
    axios
      .get(`http://localhost:8080/api/home?page=0&size=1&keyword=&venueId=${venueId}`)
      .then((res) => {
        const content = Array.isArray(res.data) ? res.data : res.data?.content;
        if (content && content.length > 0) {
          setVenue(content[0]);
          // Nếu VenueDTO có courts sẵn, dùng luôn
          if (Array.isArray(content[0].courts)) {
            setCourts(content[0].courts);
          }
        }
      })
      .catch((err) => console.error("Lỗi lấy venue:", err));

    // Lấy sân nhỏ riêng theo venueId
    axios
      .get(`http://localhost:8080/api/cour/venue/${venueId}`)
      .then((res) => {
        console.log("Courts API:", res.data);
        setCourts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Lỗi lấy courts:", err));
  }, [venueId]);

  const handleBookCourt = (courtId) => {
    // chuyển sang trang đặt sân, ví dụ /book/:courtId
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
        src={venue.mainImagePath ? `http://localhost:8080/uploads/avatars/${venue.mainImagePath}` : "/images/broken-image.png"}
        alt={venue.venueName}
        style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "8px" }}
      />
      <p><b>Địa chỉ:</b> {venue.address}</p>
      <p><b>Trạng thái:</b> {venue.status ? "Hoạt động" : "Đang bảo trì"}</p>

      <h3 style={{ marginTop: "20px" }}>Danh sách sân nhỏ</h3>
      {courts.length === 0 ? (
        <p>Chưa có sân nhỏ nào.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
          {courts.map((c) => (
            <div key={c.courId} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px" }}>
              <img
                src={c.image ? `http://localhost:8080/uploads/avatars/${c.image}` : "/images/broken-image.png"}
                alt={c.courName}
                style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px" }}
              />
              <h4 style={{ margin: "10px 0" }}>{c.courName}</h4>
              <p>💰 {c.pricePerHour} VNĐ/h</p>
              <p>⚡ {c.status ? "Hoạt động" : "Đang bảo trì"}</p>

              <button
                onClick={() => handleBookCourt(c.courId)}
                disabled={!c.status} // disable nếu sân đang bảo trì
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
