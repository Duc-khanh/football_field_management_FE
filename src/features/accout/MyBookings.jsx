import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn chưa đăng nhập",
        text: "Vui lòng đăng nhập để xem lịch đặt sân",
        confirmButtonText: "Đi đến trang đăng nhập",
      }).then(() => {
        window.location.href = "http://localhost:8080/auth/login";
      });
      return;
    }

    axios
      .get("http://localhost:8080/api/booking/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBookings(res.data);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không tải được lịch đặt sân",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Pagination
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

  // 👉 Hàm chọn màu badge theo trạng thái
  const statusBadge = (status) => {
    switch (status) {
      case "PAID":
        return "badge bg-success";
      case "PENDING":
        return "badge bg-warning text-dark";
      case "CANCELLED":
        return "badge bg-danger";
      case "REFUNDED":
        return "badge bg-info text-dark";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <div className="container py-4">
      <h3 className="text-center text-primary mb-4">🏟️ Lịch sử sân đã đặt</h3>

      {loading && <p className="text-center">Đang tải dữ liệu...</p>}

      {!loading && bookings.length === 0 && (
        <div className="alert alert-info text-center">Bạn chưa đặt sân nào!</div>
      )}

      {!loading && bookings.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>STT</th>
                  <th>🏟 Tên sân</th>
                  <th>📅 Ngày</th>
                  <th>⏰ Thời gian</th>
                  <th>💰 Giá</th>
                  <th>Trạng thái</th>
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
                      <span className={statusBadge(b.status)}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

         <div className="d-flex justify-content-center mt-3">
  <ul className="pagination">

    {/* Nút Trước */}
    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
      <button className="page-link" onClick={prevPage}>
        Trước
      </button>
    </li>

    {/* Số trang */}
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
      <li
        key={number}
        className={`page-item ${currentPage === number ? "active" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </button>
      </li>
    ))}

    {/* Nút Sau */}
    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
      <button className="page-link" onClick={nextPage}>
        Sau
      </button>
    </li>

  </ul>
</div>

        </>
      )}
    </div>
  );
}
