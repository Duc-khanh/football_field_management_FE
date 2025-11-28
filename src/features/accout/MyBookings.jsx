import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Bạn chưa đăng nhập',
        text: 'Vui lòng đăng nhập để xem lịch đặt sân',
        confirmButtonText: 'Đi đến trang đăng nhập'
      }).then(() => {
        window.location.href = "http://localhost:8080/auth/login";
      });
      return;
    }

    axios.get("http://localhost:8080/api/booking/my-bookings", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setBookings(res.data);
    })
    .catch(err => {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không tải được lịch đặt sân',
      });
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="container py-4">
      <h3 className="text-center text-primary mb-4">🏟️ Lịch sử sân đã đặt</h3>

      {loading && <p className="text-center">Đang tải dữ liệu...</p>}

      {!loading && bookings.length === 0 && (
        <div className="alert alert-info text-center">
          Bạn chưa đặt sân nào!
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th scope="col">STT</th> {/* Thêm cột STT */}
                <th scope="col">🏟 Tên sân</th>
                <th scope="col">📅 Ngày</th>
                <th scope="col">⏰ Thời gian</th>
                <th scope="col">💰 Giá</th>
                <th scope="col">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, index) => (  // Thêm index vào map
                <tr key={b.bookingId}>
                  <td>{index + 1}</td> {/* Hiển thị số thứ tự */}
                  <td className="fw-bold">{b.courtName}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td className="text-success fw-bold">
                    {b.price.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td>
                    <span className={
                      b.status === "PAID" ? "badge bg-success" : "badge bg-warning"
                    }>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
