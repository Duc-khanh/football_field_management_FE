import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VenueList.css";

function VenueList() {
  const [venues, setVenues] = useState([]);
  const [topVenues, setTopVenues] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    axios
      .get("http://localhost:8080/api/home/top5")
      .then((res) => {
        if (Array.isArray(res.data)) setTopVenues(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const loadVenues = () => {
    setLoading(true);
    const params = new URLSearchParams({
      page,
      size: 10,
      keyword,
      district: district !== "all" ? district : "",
      rating: rating !== "all" ? rating : "",
      price: price !== "all" ? price : "",
    });
    axios
      .get(`http://localhost:8080/api/home?${params}`)
      .then((res) => {
        const content = Array.isArray(res.data) ? res.data : res.data?.content || [];
        setVenues(content);
        setTotalPages(res.data?.totalPages || 1);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
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

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fa fa-star ${i <= rating ? "filled" : ""}`}
        ></i>
      );
    }
    return stars;
  };

  return (
    <div className="venue-container">
      {/* Thanh tìm kiếm */}
      <div className="search-wrapper">

  {/* Ô nhập từ khóa */}
  <div className="search-box">
    <i className="fa fa-search search-icon"></i>
    <input
      type="text"
      placeholder="Tìm sân thể thao..."
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
    />
  </div>

  <button className="btn-search" onClick={handleSearch} disabled={loading}>
    Tìm sân
  </button>


</div>


      {/* ============ TOP VENUE ============ */}
      <h2 className="section-title">Sân nổi bật</h2>
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="top-venue-wrapper">
          {topVenues.map((v) => (
            <div key={v.venueId} className="venue-card top-card">
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
                <p><i className="fa fa-map-marker"></i> Khu vực: {v.district?.districtName || "Chưa xác định"}</p>
                <p><i className="fa fa-futbol-o"></i> Số sân: {v.totalCourts} sân</p>
                <p><i className="fa fa-money"></i> Giá: {v.price ? `${v.price} VNĐ/giờ` : "Liên hệ"}</p>
                <div className="rating">{renderStars(v.rating || 0)}</div>
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
      )}

      {/* ============ VENUE LIST ============ */}
      <h2 className="section-title">Danh sách sân bóng</h2>
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
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
                <p><i className="fa fa-map-marker"></i> Khu vực: {v.district?.districtName || v.address || "N/A"}</p>
                <p><i className="fa fa-futbol-o"></i> Số sân: {v.totalCourts} sân</p>
                <p><i className="fa fa-money"></i> Giá: {v.price ? `${v.price} VNĐ/giờ` : "Liên hệ"}</p>
                <div className="rating">{renderStars(v.rating || 0)}</div>
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
      )}

      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 0 || loading}>
          ← Trang trước
        </button>
        <span>Trang {page + 1}/{totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages || loading}>
          Trang sau →
        </button>
      </div>
    </div>
  );
}

export default VenueList;