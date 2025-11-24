import React, { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    avatar: ""
  });

  const token = localStorage.getItem("authToken");

useEffect(() => {
  if (!token) return; // tránh gọi khi chưa có token

  fetch("http://localhost:8080/api/account/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(data => setProfile(data))
    .catch(err => console.log("Lỗi:", err));
}, [token]);


  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    fetch("http://localhost:8080/api/account/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    })
      .then(res => res.json())
      .then(() => alert("Cập nhật thành công!"));
  };

  return (
    <div className="container mt-4">
      <h2>Thông tin cá nhân</h2>

      <div className="form-group mt-3">
        <label>Họ và tên</label>
        <input
          type="text"
          className="form-control"
          name="fullName"
          value={profile.fullName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group mt-3">
        <label>Số điện thoại</label>
        <input
          type="text"
          className="form-control"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-group mt-3">
        <label>Địa chỉ</label>
        <input
          type="text"
          className="form-control"
          name="address"
          value={profile.address}
          onChange={handleChange}
        />
      </div>

      <button className="btn btn-primary mt-4" onClick={handleSave}>
        Lưu thay đổi
      </button>
    </div>
  );
}
