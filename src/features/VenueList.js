import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VenueList() {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadVenues();
  }, [page, keyword]);

  const loadVenues = () => {
    axios
      .get(`http://localhost:8080/api/home?page=${page}&size=6&keyword=${keyword}`)
      .then((res) => {
        console.log("API home data:", res.data);
        // Nếu API trả về Page object
        const content = Array.isArray(res.data) ? res.data : res.data?.content;
        setVenues(content || []);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>⚽ Danh sách sân bóng</h2>

      {/* Search */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔍 Nhập tên hoặc địa chỉ sân..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ padding: "8px", width: "300px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>

      {/* Venue grid */}
      {venues.length === 0 ? (
        <p style={{ textAlign: "center" }}>Không có sân bóng nào.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {venues.map((v) => (
            <div
              key={v.venueId}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
              }}
              onClick={() => navigate(`/venue/${v.venueId}`)}
            >
              <img
                src={v.mainImagePath ? `http://localhost:8080/uploads/avatars/${v.mainImagePath}` : "/images/broken-image.png"}
                alt={v.venueName}
                style={{ width: "100%", height: "160px", objectFit: "cover" }}
              />
              <div style={{ padding: "10px" }}>
                <h4>{v.venueName}</h4>
                <p>{v.address}</p>
                <p>{v.status ? "Hoạt động" : "Đang bảo trì"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VenueList;
