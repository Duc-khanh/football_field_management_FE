import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./VenueDetail.css";

const toApiDateString = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWeekRange = (date) => {
  const start = new Date(date);
  const dayOfWeek = start.getDay();
  const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  start.setDate(diff);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    startDate: toApiDateString(start),
    endDate: toApiDateString(end),
  };
};

const getWeekDisplay = (date) => {
  const start = new Date(date);
  const dayOfWeek = start.getDay();
  const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  start.setDate(diff);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const formatDate = (d) =>
    `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;

  return `${formatDate(start)} - ${formatDate(end)}`;
};

const VenueInfo = ({ venue }) => {
  if (!venue) return null;
  const mainImage = venue.mainImagePath || "/images/broken-image.png";
  const subImages = venue.images?.slice(0, 4) || [];

  return (
    <div className="venue-info-container">
      <h2>{venue.venueName}</h2>
      <p>{venue.address}</p>

      <div className="image-grid-container">
        <div className="main-image">
          <img
            src={`http://localhost:8080/uploads/venues/${mainImage}`}
            alt="Main"
          />
        </div>
        <div className="sub-images">
          {subImages.map((img, index) => (
            <img
              key={img.imageId || index}
              src={`http://localhost:8080/uploads/venues/${img.imagePath}`}
              alt={`Sub ${index}`}
            />
          ))}
        </div>
      </div>

      <div className="venue-info-detail">
        <div>
          <h4>Thông tin sân</h4>
          <p>Giờ mở cửa: 6h - 23h</p>
          <p>
            Giá sân:{" "}
            {venue.courts && venue.courts.length > 0
              ? `${venue.courts[0].pricePerHour}K`
              : "N/A"}
          </p>
        </div>
        <div>
          <h4>Dịch vụ tiện ích</h4>
          <ul>
            <li>✅ Wifi</li>
            <li>✅ Bãi đỗ xe</li>
            <li>✅ Trà đá</li>
            <li>✅ Căng tin</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const BookingForm = ({ selectedSlot }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    note: "",
  });

  useEffect(() => {
    if (selectedSlot) {
      setFormData((prev) => ({
        ...prev,
        date: selectedSlot.date,
        time: selectedSlot.time,
      }));
    }
  }, [selectedSlot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert("Vui lòng chọn một khung giờ!");
      return;
    }

    console.log("Dữ liệu gửi đi:", { ...formData, slotId: selectedSlot.id });
    alert(
      `Đang gửi yêu cầu đặt sân:\n${formData.name} - ${formData.phone}\n${formData.date} lúc ${formData.time}`
    );
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h4>Đặt sân theo yêu cầu</h4>
      <input
        type="text"
        name="name"
        placeholder="Họ và tên"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="tel"
        name="phone"
        placeholder="Số điện thoại"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <div className="form-row">
        <input
          type="text"
          name="date"
          placeholder="Chọn ngày"
          value={formData.date}
          readOnly
        />
        <input
          type="text"
          name="time"
          placeholder="Chọn giờ"
          value={formData.time}
          readOnly
        />
      </div>
      <select>
        <option value="90">1,5 giờ</option>
      </select>
      <textarea
        name="note"
        placeholder="Ghi chú"
        value={formData.note}
        onChange={handleChange}
      ></textarea>
      <button type="submit">Đặt sân</button>
    </form>
  );
};

const SlotButton = ({ slot, date, onSelect, isSelected }) => {
  const handleClick = () => {
    if (slot.status === "available") {
      onSelect({ ...slot, date });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={slot.status !== "available"}
      className={`slot-button ${slot.status} ${
        isSelected ? "selected" : ""
      }`}
    >
      {slot.status === "expired" && <span>Quá hạn</span>}
      {slot.status === "booked" && <span>Đã đặt</span>}
      {slot.status === "available" && (
        <>
          <span>{slot.price}K</span>
          <br />
          <span>BOOK</span>
        </>
      )}
    </button>
  );
};

const TimeslotGrid = ({ courts, onSlotSelect, selectedSlotId }) => {
  const [selectedCourtId, setSelectedCourtId] = useState(courts[0]?.courId || "");
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedCourtId) return;
    setLoading(true);
    const { startDate, endDate } = getWeekRange(currentWeek);

    axios
      .get(
        `http://localhost:8080/api/timeslots?courId=${selectedCourtId}&startDate=${startDate}&endDate=${endDate}`
      )
      .then((res) => {
        setTimeslots(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setTimeslots([]);
        setLoading(false);
      });
  }, [selectedCourtId, currentWeek]);

  const handleWeekChange = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const timeHeaders = timeslots[0]?.slots.map((slot) => slot.time) || [];

  return (
    <div className="timeslot-container">
      <div className="timeslot-header">
        <select
          value={selectedCourtId}
          onChange={(e) => setSelectedCourtId(e.target.value)}
        >
          {courts.map((court) => (
            <option key={court.courId} value={court.courId}>
              {court.courName} ({court.fieldSize})
            </option>
          ))}
        </select>

        <div className="week-navigation">
          <button onClick={() => handleWeekChange("prev")}>&lt;</button>
          <span>{getWeekDisplay(currentWeek)}</span>
          <button onClick={() => handleWeekChange("next")}>&gt;</button>
        </div>

        <div className="time-filter">
          <button>Khung sáng</button>
          <button>Khung chiều</button>
        </div>
      </div>

      <div className="timeslot-grid-wrapper">
        {loading ? (
          <p>Đang tải lịch...</p>
        ) : timeslots.length === 0 ? (
          <p>Không có lịch khả dụng cho loại sân này trong tuần.</p>
        ) : (
          <table className="timeslot-table">
            <thead>
              <tr>
                <th></th>
                {timeHeaders.map((time) => (
                  <th key={time}>{time}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeslots.map((day) => (
                <tr key={day.date}>
                  <td>
                    <b>{day.dayOfWeek}</b>
                    <br />
                    <span>{day.date}</span>
                  </td>
                  {day.slots.map((slot) => (
                    <td key={slot.id}>
                      <SlotButton
                        slot={slot}
                        date={day.date}
                        isSelected={selectedSlotId === slot.id}
                        onSelect={onSlotSelect}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

function VenueDetail() {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    setLoading(true);
    setSelectedSlot(null);
    axios
      .get(`http://localhost:8080/api/venue/${venueId}`)
      .then((res) => {
        setVenue(res.data);
        setLoading(false);
      })
      .catch(() => {
        setVenue(null);
        setLoading(false);
      });
  }, [venueId]);

  if (loading) return <div className="loading">Đang tải thông tin sân...</div>;
  if (!venue)
    return <div className="loading">Không tìm thấy sân (ID: {venueId}).</div>;

  return (
    <div className="venue-detail-page">
      <section>
        <VenueInfo venue={venue} />
      </section>
      <section className="booking-section">
        <div className="left-column">
          <BookingForm selectedSlot={selectedSlot} />
        </div>
        <div className="right-column">
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
      </section>
    </div>
  );
}

export default VenueDetail;
