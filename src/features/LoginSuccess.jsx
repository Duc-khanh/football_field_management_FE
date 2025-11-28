import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    // Không có token → chuyển về login
    if (!token) {
      navigate("/login");
      return;
    }

    // Lưu token vào localStorage
    localStorage.setItem("authToken", token);

    // Gọi API lấy thông tin người dùng
    fetch("http://localhost:8080/api/account/me", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {

        // Lưu thông tin user
        localStorage.setItem("userEmail", data.email || "");
        localStorage.setItem("fullName", data.fullName || "Người dùng");
        localStorage.setItem("userRole", data.role || "");
        localStorage.setItem("userAvatar", data.avatar || "");

        // Điều hướng về Home
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Lỗi khi lấy /me:", err);
        window.location.href = "/";
      });
  }, [navigate]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Đang xử lý đăng nhập...</h2>
    </div>
  );
}

export default LoginSuccess;
