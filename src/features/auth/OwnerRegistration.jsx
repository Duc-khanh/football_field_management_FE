import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // <-- import SweetAlert2
import './OwnerRegistration.css'; 

export default function OwnerRegistration() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu xác nhận
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Mật khẩu xác nhận không khớp!'
      });
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/register-owner', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address
      });

      // Thông báo thành công dạng toast
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Đăng ký thành công! Tài khoản của bạn đang chờ Admin phê duyệt.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      }).then(() => {
        window.location.href = "http://localhost:8080/auth/login";
      });

    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      
      const resData = err.response?.data;
      const errorMsg = resData?.message || resData?.error || JSON.stringify(resData) || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.";

      // Hiển thị lỗi bằng SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Đăng ký thất bại',
        text: errorMsg
      });
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Đăng Ký Đối Tác Chủ Sân</h2>
        <p className="text-muted">Tham gia hệ thống quản lý sân bóng chuyên nghiệp</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input type="text" name="fullName" className="form-control" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" className="form-control" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input type="text" name="phone" className="form-control" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Địa chỉ sân/Văn phòng</label>
            <input type="text" name="address" className="form-control" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" name="password" className="form-control" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Nhập lại mật khẩu</label>
            <input type="password" name="confirmPassword" className="form-control" required onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Đăng Ký Ngay
          </button>
        </form>
      </div>
    </div>
  );
}
