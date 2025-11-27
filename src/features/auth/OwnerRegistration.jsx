import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OwnerRegistration.css'; 

export default function OwnerRegistration() {
  const navigate = useNavigate();
  
  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  const [error, setError] = useState('');

  // Hàm xử lý nhập liệu
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Hàm submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset lỗi cũ
    
    // Validate cơ bản
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // Gọi API Backend
      await axios.post('http://localhost:8080/api/auth/register-owner', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address
      });

      // Thành công
      alert("Đăng ký thành công! Tài khoản của bạn đang chờ Admin phê duyệt.");
      // Thay cho navigate(...)
window.location.href = "http://localhost:8080/auth/login";


    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      
      // --- PHẦN SỬA LỖI Ở ĐÂY ---
      const resData = err.response?.data;
      
      if (resData && typeof resData === 'object') {
        // Nếu server trả về object (ví dụ: { error: "...", message: "..." })
        // Ưu tiên lấy message, nếu không có thì lấy error, cùng lắm thì stringify
        setError(resData.message || resData.error || JSON.stringify(resData));
      } else if (typeof resData === 'string') {
        // Nếu server trả về chuỗi lỗi trực tiếp
        setError(resData);
      } else {
        // Fallback nếu không có response data
        setError("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Đăng Ký Đối Tác Chủ Sân</h2>
        <p className="text-muted">Tham gia hệ thống quản lý sân bóng chuyên nghiệp</p>
        
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input 
              type="text" name="fullName" 
              className="form-control" required 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" name="email" 
              className="form-control" required 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input 
              type="text" name="phone" 
              className="form-control" required 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ sân/Văn phòng</label>
            <input 
              type="text" name="address" 
              className="form-control" required 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input 
              type="password" name="password" 
              className="form-control" required 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Nhập lại mật khẩu</label>
            <input 
              type="password" name="confirmPassword" 
              className="form-control" required 
              onChange={handleChange} 
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Đăng Ký Ngay
          </button>
        </form>
      </div>
    </div>
  );
}