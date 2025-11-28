// VenueInfo.jsx
import React from "react";

const VenueInfo = ({ venue }) => {
  if (!venue) return null;

  const mainImage = venue.mainImagePath || "broken-image.png";

  return (
    <div className="card mb-8">
      <div className="row g-0">
        <div className="col-md-6 text-center">
          <img
            src={`http://localhost:8080/uploads/avatars/${mainImage}`}
            className="img-fluid rounded-start"
            alt="Main"
          />
        </div>
        <div className="col-md-6">
          <div className="card-body">
            <h2 className="card-title">{venue.venueName}</h2>
            <p className="card-text"><strong>Địa điểm:</strong> {venue.address}</p>
            <p className="card-text"><strong>Giờ mở cửa:</strong> 6h - 21h</p>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueInfo;
