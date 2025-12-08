import React, { useState, useEffect } from "react";
import axios from "axios";

const toApiDateString = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWeekRange = (date = new Date()) => {
  const start = new Date(date);
  const dayOfWeek = start.getDay();
  // Điều chỉnh để tuần bắt đầu từ Thứ 2
  const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  
  return { startDate: toApiDateString(start), endDate: toApiDateString(end), start, end };
};

const DayCard = ({ day, isSelected, onSelect }) => (
  <div
    className={`card mb-2 ${isSelected ? "border-primary" : ""}`}
    style={{ cursor: "pointer", fontSize: "0.85rem" }}
    onClick={() => onSelect(day.date)}
  >
    <div className="card-body p-2 text-center">
      <h6 className="card-title mb-1">{day.dayOfWeek}</h6>
      <small className="text-muted">
        {day.date.split("-").reverse().join("/")}
      </small>
    </div>
  </div>
);

const SlotCard = ({ slot, date, onSelect, isSelected }) => {
  const now = new Date();
  let slotDateTime = null;

  if (slot.date && slot.start_time) {
    slotDateTime = new Date(`${slot.date}T${slot.start_time}`);
  }

  const isPast = slotDateTime ? slotDateTime < now : false;

  let displayStatus = "";
  let canSelect = false;

  if (slot.status === "booked") {
    displayStatus = "Đã đặt";
    canSelect = false;
  } else if (isPast) {
    displayStatus = "Quá hạn";
    canSelect = false;
  } else {
    displayStatus = `${slot.price}K`;
    canSelect = true;
  }

  const handleClick = () => {
    if (canSelect) onSelect({ ...slot, date });
  };

  const formatTime = (t) => (t && t.length >= 5 ? t.slice(0, 5) : t);

  const displayTime =
    slot.time ||
    (slot.start_time && slot.end_time
      ? `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`
      : "N/A");

  return (
    <div
      className={`card mb-2 ${isSelected ? "border-success" : ""}`}
      style={{
        cursor: canSelect ? "pointer" : "not-allowed",
        fontSize: "0.85rem",

        /* ⭐ Màu cố định khi được chọn */
        backgroundColor: isSelected
          ? "#d1f7d6" // màu khi đã chọn
          : canSelect
          ? "#ffffff"
          : "#f3f3f3",

        transition: "0.2s",
      }}
      onClick={handleClick}

      /* ⭐ Không dùng hover khi slot đã được chọn */
      onMouseEnter={(e) => {
        if (!canSelect || isSelected) return; 
        e.currentTarget.style.backgroundColor = "#eefdf1";
      }}
      onMouseLeave={(e) => {
        if (isSelected) return; // Giữ nguyên màu đã chọn
        e.currentTarget.style.backgroundColor = canSelect ? "#ffffff" : "#f3f3f3";
      }}
    >
      <div className="card-body p-2 text-center">
        <h6 className="card-title mb-1 fw-bold">{displayTime}</h6>
        <small className="text-muted">{displayStatus}</small>
      </div>
    </div>
  );
};




const TimeslotGrid = ({ courts, onSlotSelect, selectedSlotId }) => {
  const [selectedCourtId, setSelectedCourtId] = useState("");
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [timeslots, setTimeslots] = useState([]); // Sử dụng tên biến cũ để khớp với giao diện
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all"); // 'all', 'morning', 'afternoon'
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (courts.length && !selectedCourtId) setSelectedCourtId(courts[0].courId);
  }, [courts, selectedCourtId]);

  // Logic gọi API (Giữ nguyên logic xử lý dữ liệu phẳng nhưng trả về cấu trúc cho giao diện cũ)
  useEffect(() => {
    if (!selectedCourtId) return;
    setLoading(true);

    const { startDate, endDate, start } = getWeekRange(currentWeek);

    // 1. Tạo khung sườn 7 ngày
    const tempWeek = [];
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dateStr = toApiDateString(d);
      tempWeek.push({
        date: dateStr,
        dayOfWeek: days[d.getDay()], // Tên thứ kiểu cũ (T2, T3...)
        slots: []
      });
    }

    // 2. Gọi API
    axios
      .get(
        `http://localhost:8080/api/booking/timeslots?courId=${selectedCourtId}&startDate=${startDate}&endDate=${endDate}`
      )
      .then((res) => {
        // --- DEBUG: Kiểm tra dữ liệu API trả về ---
        console.log("API Response:", res.data);
        
        // Xử lý trường hợp res.data được bọc trong một object khác (ví dụ: { data: [...] })
        let fetchedSlots = [];
        if (Array.isArray(res.data)) {
            fetchedSlots = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
            fetchedSlots = res.data.data;
        } else if (res.data && Array.isArray(res.data.content)) { // Nếu dùng Pageable
            fetchedSlots = res.data.content;
        }

        // 3. Map dữ liệu vào khung sườn
        const mergedData = tempWeek.map((dayObj) => {
          // Lọc slot theo ngày. Lưu ý: slot.date từ API phải trùng format YYYY-MM-DD
          const slotsForDay = fetchedSlots.filter(
            (slot) => {
                if (!slot.date) return false; // Nếu slot không có trường date thì bỏ qua
                return slot.date === dayObj.date;
            }
          );
          
          slotsForDay.sort((a, b) => {
              const timeA = a.start_time || "00:00";
              const timeB = b.start_time || "00:00";
              return timeA.localeCompare(timeB);
          });

          return { ...dayObj, slots: slotsForDay };
        });

        setTimeslots(mergedData);
        
        if (!selectedDay || !mergedData.find(d => d.date === selectedDay)) {
            setSelectedDay(mergedData[0].date);
        }
      })
      .catch((err) => {
        console.error("Lỗi tải lịch:", err);
        setTimeslots(tempWeek);
        if (!selectedDay) setSelectedDay(tempWeek[0].date);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCourtId, currentWeek]);

  const handleWeekChange = (dir) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (dir === "next" ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const filterSlots = (slots) => {
    if (!slots) return [];
    
    return slots.filter((slot) => {
      // Xử lý lấy giờ từ start_time (định dạng HH:mm:ss)
      const timeStr = slot.start_time || slot.time || "00:00";
      const startHour = parseInt(timeStr.split(":")[0], 10);

      if (timeFilter === "all") return true;
      if (timeFilter === "morning") return startHour >= 5 && startHour < 12;
      if (timeFilter === "afternoon") return startHour >= 12;
      return true;
    });
  };

  const selectedDayData = timeslots.find((day) => day.date === selectedDay);
  const filteredSlots = selectedDayData ? filterSlots(selectedDayData.slots) : [];

  return (
    <div className="card">
      <div className="card-body p-3">
    
        {/* Header: Chọn tuần + khung giờ (Giao diện cũ) */}
        <div className="mb-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">

          {/* Chọn tuần */}
          <div className="d-flex align-items-center gap-1 mb-2 mb-md-0">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => handleWeekChange("prev")}
              style={{
                padding: "0.2rem 0.4rem",
                fontSize: "0.75rem",
                width: "auto",
                lineHeight: "1",
              }}
            >
              &lt;
            </button>

            <div
              className="text-center px-2 py-1 small bg-light rounded"
              style={{
                minWidth: "120px",
                fontSize: "0.85rem",
              }}
            >
              {getWeekRange(currentWeek).startDate.split("-").reverse().join("/")} -{" "}
              {getWeekRange(currentWeek).endDate.split("-").reverse().join("/")}
            </div>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => handleWeekChange("next")}
              style={{
                padding: "0.2rem 0.4rem",
                fontSize: "0.75rem",
                width: "auto",
                lineHeight: "1",
              }}
            >
              &gt;
            </button>
          </div>

          {/* Chọn khung giờ */}
          <div className="d-flex gap-1">
            {[
                { key: "morning", label: "Sáng" }, 
                { key: "afternoon", label: "Chiều" }
            ].map((slot) => (
              <button
                key={slot.key}
                className={`btn btn-sm ${timeFilter === slot.key ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setTimeFilter(timeFilter === slot.key ? "all" : slot.key)}
                style={{
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.5rem",
                  boxShadow: "none",
                //   Màu sắc tùy chỉnh nếu cần thiết để khớp chính xác thiết kế cũ
                }}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chia thành 2 phần: Bên trái chọn ngày, bên phải timeslots */}
        <div className="row">
          <div className="col-md-3 col-sm-12 mb-3">
            <h6 className="mb-2">Chọn ngày</h6>
            {timeslots.length === 0 && <p>Không có dữ liệu ngày</p>}
            {timeslots.map((day) => (
              <DayCard
                key={day.date}
                day={day}
                isSelected={selectedDay === day.date}
                onSelect={setSelectedDay}
              />
            ))}
          </div>

          <div className="col-md-9 col-sm-12">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">
                  Khung giờ 
                  {/* Hiển thị thêm ngày bên cạnh tiêu đề khung giờ để rõ ràng hơn */}
                  {selectedDay && <span className="text-muted ms-2 fw-normal" style={{ fontSize: "0.85em" }}>
                    ({selectedDay.split("-").reverse().join("/")})
                  </span>}
                </h6>
                {loading && <small className="text-primary">Đang tải...</small>}
            </div>
            
            {!selectedDay ? (
              <p>Vui lòng chọn ngày</p>
            ) : filteredSlots.length === 0 ? (
              <p className="text-muted">Không có slot khả dụng</p>
            ) : (
              <div className="row">
                {filteredSlots.map((slot) => (
                  <div key={slot.time_slot_id || slot.id} className="col-lg-3 col-md-4 col-sm-6 mb-2">
                    <SlotCard
                      slot={slot}
                      date={selectedDay}
                      onSelect={(selectedSlot) => {
                        // Tìm tên sân từ courts dựa trên courId
                        const selectedCourt = courts.find(court => court.courId === selectedSlot.courId || court.id === selectedSlot.courId);
                        const courtName = selectedCourt ? selectedCourt.name || selectedCourt.courName : "Sân không xác định";
                        onSlotSelect({ ...selectedSlot, courtName }); // Thêm courtName vào selectedSlot
                      }}
                      isSelected={selectedSlotId === (slot.time_slot_id || slot.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeslotGrid;
