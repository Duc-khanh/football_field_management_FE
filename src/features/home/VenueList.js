import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VenueList.css";

function VenueList() {
  const [venues, setVenues] = useState([]);
  const [topVenues, setTopVenues] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadTopVenues();
  }, []);

  useEffect(() => {
    loadVenues();
  }, [page]);

  const loadTopVenues = () => {
    axios
      .get("http://localhost:8080/api/home/top5")
      .then((res) => Array.isArray(res.data) && setTopVenues(res.data))
      .catch((err) => console.error(err));
  };

  const loadVenues = () => {
    axios
      .get(`http://localhost:8080/api/home?page=${page}&size=10`)
      .then((res) => {
        const content = Array.isArray(res.data) ? res.data : res.data?.content || [];
        setVenues(content);
        setTotalPages(res.data?.totalPages || 1);
      })
      .catch((err) => console.error(err));
  };

  const handlePrev = () => page > 0 && setPage(page - 1);
  const handleNext = () => page + 1 < totalPages && setPage(page + 1);

  return (
    <div className="venue-container">
      {/* Top 5 sân nổi bật */}
      <h2 className="section-title">⚡ Sân nổi bật</h2>
      {topVenues.length > 0 ? (
        <div className="top-venue-wrapper">
          {topVenues.map((v) => (
            <div key={v.venueId} className="venue-card">
              <img
                src={
                  v.mainImagePath
                    ? `http://localhost:8080/uploads/avatars/${v.mainImagePath}`
                    : "/images/broken-image.png"
                }
                alt={v.venueName}
                className="venue-image"
                onClick={() => navigate(`/venue/${v.venueId}`)}
              />
              <div className="venue-info">
                <h4>{v.venueName}</h4>
                <p><strong>Khu vực:</strong> {v.district?.districtName || "Chưa xác định"}</p>
                <p className={`venue-status ${v.status ? "active" : "maintenance"}`}>
                  {v.status ? "Hoạt động" : "Đang bảo trì"}
                </p>
                <p><strong>Sức chứa:</strong> {v.capacity ?? "N/A"} người</p>
                <p><strong>Giá:</strong> {v.price ? `${v.price} VNĐ/giờ` : "Liên hệ"}</p>
                <button
                  className="book-button"
                  onClick={() => navigate(`/booking/${v.venueId}`)}
                >
                  Đặt sân
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-result">Không có sân nổi bật.</p>
      )}

      {/* Danh sách sân bình thường */}
      <h2 className="section-title">⚽ Danh sách sân bóng</h2>
      {venues.length > 0 ? (
        <>
          <div className="venue-grid">
            {venues.map((v) => (
              <div key={v.venueId} className="venue-card">
                <img
                  src={
                    v.mainImagePath
                      ? `http://localhost:8080/uploads/avatars/${v.mainImagePath}`
                      : "/images/broken-image.png"
                  }
                  alt={v.venueName}
                  className="venue-image"
                  onClick={() => navigate(`/venue/${v.venueId}`)}
                />
                <div className="venue-info">
                  <h4>{v.venueName}</h4>
                  <p><strong>Khu vực:</strong> {v.address || "N/A"}</p>
                  <p><strong>Sức chứa:</strong> {v.capacity ?? "N/A"} người</p>
                  <p><strong>Giá:</strong> {v.price ? `${v.price} VNĐ/giờ` : "Liên hệ"}</p>
                  <p className={`venue-status ${v.status ? "active" : "maintenance"}`}>
                    {v.status ? "Hoạt động" : "Đang bảo trì"}
                  </p>
                  <button
                    className="book-button"
                    onClick={() => navigate(`/booking/${v.venueId}`)}
                  >
                    Đặt sân
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={handlePrev} disabled={page === 0}>← Trang trước</button>
            <span>Trang {page + 1}/{totalPages}</span>
            <button onClick={handleNext} disabled={page + 1 >= totalPages}>Trang sau →</button>
          </div>
        </>
      ) : (
        <p className="no-result">Không có sân bóng nào.</p>
      )}
    </div>
  );
}

export default VenueList;
