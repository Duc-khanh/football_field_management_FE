import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";

import VenueInfo from "../../components/booking/VenueInfo";
import BookingForm from "../../components/booking/BookingForm";
import TimeslotGrid from "../../components/booking/TimeslotGrid";

function VenueDetail() {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    setLoading(true);
    setSelectedSlot(null);
    axios
      .get(`http://localhost:8080/api/home/${venueId}`)
      .then((res) => {
        setVenue(res.data);
        setLoading(false);
      })
      .catch(() => {
        setVenue(null);
        setLoading(false);
      });
  }, [venueId]);

  if (loading) return <div className="text-center mt-5">Đang tải thông tin sân...</div>;
  if (!venue)
    return <div className="text-center mt-5">Không tìm thấy sân (ID: {venueId})</div>;

  return (
    <div className="container my-4">
      {/* Thông tin sân */}
      <VenueInfo venue={venue} />

      {/* 2 cột: BookingForm và TimeslotGrid */}
      <div className="row mt-4">
        {/* Form đặt sân bên trái */}
        <div className="col-md-4 mb-3">
          <BookingForm selectedSlot={selectedSlot} />
        </div>

        {/* Lịch slot bên phải */}
        <div className="col-md-8">
          {venue.courts && venue.courts.length > 0 ? (
            <TimeslotGrid
              courts={venue.courts}
              onSlotSelect={setSelectedSlot}
              selectedSlotId={selectedSlot?.id}
            />
          ) : (
            <p>Sân này hiện không có loại sân nào để đặt.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VenueDetail;
