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
    if (!token) return;

    fetch("http://localhost:8080/api/account/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.log("Lỗi fetch profile:", err));
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
      .then(res => {
        if (!res.ok) return res.json().then(err => { throw err; });
        return res.json();
      })
      .then(data => {
        setProfile(data);
        alert("Cập nhật thành công!");
      })
      .catch(err => {
        console.error("Cập nhật thất bại:", err);
        alert("Cập nhật thất bại. Vui lòng thử lại.");
      });
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header text-center">
              <h2>Thông tin cá nhân</h2>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <img
                  src={profile.avatar || "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg"}
                  alt="Avatar"
                  className="rounded-circle"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              </div>

              <div className="form-group">
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
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={profile.email}
                  readOnly
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

              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={handleSave}>
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
