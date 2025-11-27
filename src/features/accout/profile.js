import React, { useEffect, useState } from "react";
import "./profile.css";

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetch("http://localhost:8080/api/account/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    fetch("http://localhost:8080/api/account/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then(() => {
        setSuccessMessage("Cập nhật thành công!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch(() => {
        setSuccessMessage("Cập nhật thất bại!");
        setTimeout(() => setSuccessMessage(""), 3000);
      });
  };

  return (
    <div className="profile-wrapper">
      {/* ALERT NỔI */}
      {successMessage && (
        <div className="alert-top-right">
          {successMessage}
        </div>
      )}

      {/* SIDEBAR LEFT */}
      <div className="sidebar">
       <div className="avatar-box">
  <img
    src={
      profile.avatar
        ? profile.avatar.startsWith("http")
          ? profile.avatar
          : `http://localhost:8080/uploads/avatars/${profile.avatar}`
        : "https://via.placeholder.com/120"
    }
    className="avatar-img"
    alt="avatar"
  />

  <label className="edit-avatar-btn">
  <i className="fa fa-camera" style={{ marginRight: "5px" }}></i> Sửa
  <input
    type="file"
    accept="image/*"
    id="avatarInput"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setProfile({ ...profile, avatar: ev.target.result });
        };
        reader.readAsDataURL(file);
      }
    }}
  />
</label>
</div>
<p className="user-name">{profile.fullName}</p>
        <div className="sidebar-menu">
          <div className="menu-title">
            <i className="fa fa-user"></i> Quản lý tài khoản
          </div>
          <div className="menu-item active">Thông tin cá nhân</div>
          <div className="menu-item">Địa chỉ</div>
          <div className="menu-item">Đơn hàng của tôi</div>
          <div className="menu-item">Danh sách đặt sân</div>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="profile-content">
        <h2 className="title">Sửa thông tin</h2>

        <div className="form-group">
          <label>Họ và tên:</label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
          />
        </div>

        <button className="btn-update" onClick={handleUpdate}>
          Cập nhật
        </button>
      </div>
    </div>
  );
}
