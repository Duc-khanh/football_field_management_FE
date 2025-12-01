import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5; // Number of items per page

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

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentRecords = bookings.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(bookings.length / recordsPerPage);

  const nextPage = () => {
    if (currentPage !== totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

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
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">🏟 Tên sân</th>
                  <th scope="col">📅 Ngày</th>
                  <th scope="col">⏰ Thời gian</th>
                  <th scope="col">💰 Giá</th>
                  <th scope="col">Trạng thái</th>
                </tr>
              </thead>

              <tbody>
                {currentRecords.map((b, index) => (
                  <tr key={b.bookingId}>
                    <td>{firstIndex + index + 1}</td>
                    <td className="fw-bold">{b.courtName}</td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td className="text-success fw-bold">
                      {b.price.toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td>
                      <span
                        className={
                          b.status === "PAID"
                            ? "badge bg-success"
                            : "badge bg-warning"
                        }
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-center align-items-center mt-3">
            <button
              className="btn btn-primary btn-sm px-1 py-1 me-1"
              disabled={currentPage === 1}
              onClick={prevPage}
              title="Trước"
            >
              Trước
            </button>

            <span className="fw-bold mx-1">
              {currentPage}/{totalPages}
            </span>

            <button
              className="btn btn-primary btn-sm px-1 py-1 ms-1"
              disabled={currentPage === totalPages}
              onClick={nextPage}
              title="Sau"
            >
              Sau
            </button>
          </div>
        </>
      )}
    </div>
  );
}