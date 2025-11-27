import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../components/css/VenueList.css";

function VenueList() {
  const [venues, setVenues] = useState([]);
  const [topVenues, setTopVenues] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // filter state
  const [keyword, setKeyword] = useState("");
  const [district, setDistrict] = useState("all");
  const [rating, setRating] = useState("all");
  const [price, setPrice] = useState("all");

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
      .get(`http://localhost:8080/api/home?page=${page}&size=10&keyword=${keyword}`)
      .then((res) => {
        const content = Array.isArray(res.data) ? res.data : res.data?.content || [];
        setVenues(content);
        setTotalPages(res.data?.totalPages || 1);
      })
      .catch((err) => console.error(err));
  };

  const handleSearch = () => {
    setPage(0);
    loadVenues();
  };

  const resetFilter = () => {
    setKeyword("");
    setDistrict("all");
    setRating("all");
    setPrice("all");
    setPage(0);
    loadVenues();
  };

 return (
  <div className="venue-container">

    {/* ============ TOP VENUE ============ */}
    <h2 className="section-title">Sân nổi bật</h2>
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
            <p>Khu vực: {v.district?.districtName || "Chưa xác định"}</p>
            <p>Số sân: {v.totalCourts} sân</p>
            <p>Giá: {v.price ? `${v.price} VNĐ/giờ` : "Liên hệ"}</p>
            <button
              className="book-button"
              onClick={() => navigate(`/venue/${v.venueId}`)}
            >
              Đặt sân
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* ❌ Đã bỏ thanh tìm kiếm + bộ lọc */}

    {/* ============ VENUE LIST ============ */}
    <h2 className="section-title">Danh sách sân bóng</h2>

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
            <p>Khu vực: {v.address || "N/A"}</p>
            <p>Số sân: {v.totalCourts} sân</p>
            <p>Giá: {v.price ? `${v.price} VNĐ/giờ` : "Liên hệ"}</p>
            <button
              className="book-button"
              onClick={() => navigate(`/venue/${v.venueId}`)}
            >
              Đặt sân
            </button>
          </div>
        </div>
      ))}
    </div>

    <div className="pagination">
      <button onClick={() => setPage(page - 1)} disabled={page === 0}>
        ← Trang trước
      </button>
      <span>Trang {page + 1}/{totalPages}</span>
      <button onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>
        Trang sau →
      </button>
    </div>

  </div>
);

}

export default VenueList;