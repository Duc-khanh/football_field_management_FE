import React, { useEffect, useState } from "react";
import axios from "axios";

function VenueList() {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadVenues();
  }, [page]);

  const loadVenues = () => {
    axios
      .get(`http://localhost:8080/api/home?page=${page}&size=10`)
      .then((res) => {
        const content = res.data?.content;
        setVenues(Array.isArray(content) ? content : []);
        setTotalPages(res.data?.totalPages ?? 0);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách sân bóng</h2>

      {venues.length === 0 ? (
        <p>Không có sân bóng nào.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {venues.map((v) => (
            <div
              key={v.venueId}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              {v.mainImagePath ? (
                <img
  src={
    v.mainImagePath
      ? `http://localhost:8080/uploads/avatars/${v.mainImagePath}`
      : "/images/broken-image.png"
  }
  alt={v.venueName}
  style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
/>

              ) : (
                <div
                  style={{
                    height: "160px",
                    background: "#eee",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "14px",
                  }}
                >
                  No image
                </div>
              )}
              <div style={{ padding: "10px" }}>
                <h4 style={{ marginBottom: "5px" }}>{v.venueName}</h4>
                <p style={{ fontSize: "14px", color: "#666" }}>{v.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          style={{ marginRight: "10px" }}
        >
          Prev
        </button>
        <span>
          Page {page + 1}/{totalPages}
        </span>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => setPage(page + 1)}
          style={{ marginLeft: "10px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default VenueList;
