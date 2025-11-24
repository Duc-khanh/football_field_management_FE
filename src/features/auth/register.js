import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/api/auth/register", {
        fullName,
        email,
        phone,
        password,
        confirmPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công!",
        text: res.data.message,
        confirmButtonColor: "#3085d6",
      }).then(() => {
        window.location.href = "/login";
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi đăng ký",
        text: err.response?.data?.error || "Đăng ký thất bại!",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center gx-0 shadow-lg rounded-4 overflow-hidden auth-wrap">

          {/* Left Side */}
          <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-primary text-white">
            <div className="text-center px-4">
              <h1 className="mb-3">Sanbong247</h1>
              <p className="lead mb-4">
                Tham gia ngay để đặt sân và quản lý tiện lợi.
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="col-12 col-md-6 bg-white p-4 p-md-5">
            <h2 className="mb-4">Đăng ký tài khoản</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleRegister} noValidate>

              {/* Họ tên */}
              <div className="mb-3 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  placeholder="Họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <label htmlFor="fullName">Họ và tên</label>
              </div>

              {/* Email */}
              <div className="mb-3 form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email">Email</label>
              </div>

              {/* Phone */}
              <div className="mb-3 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  placeholder="Số điện thoại"
                  pattern="^0\\d{9}$"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <label htmlFor="phone">Số điện thoại</label>
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <div className="form-floating">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    placeholder="Mật khẩu"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="password">Mật khẩu</label>
                </div>

                {/* Nút xem mật khẩu */}
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </span>
              </div>

              {/* Confirm Password */}
              <div className="mb-3 position-relative">
                <div className="form-floating">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                </div>

                {/* Nút xem mật khẩu */}
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  <i
                    className={`bi ${
                      showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                    }`}
                  ></i>
                </span>

                {password && confirmPassword && password !== confirmPassword && (
                  <div className="text-danger small mt-1">
                    Mật khẩu không khớp.
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="d-grid mb-3">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading || password !== confirmPassword}
                >
                  {loading ? "Đang xử lý..." : "Đăng ký"}
                </button>
              </div>

              <div className="text-center">
                <span className="small text-muted">Đã có tài khoản? </span>
                <a href="/login" className="small text-decoration-none">
                  Đăng nhập
                </a>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
