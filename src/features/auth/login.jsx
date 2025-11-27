import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert
} from 'react-bootstrap';
import { BiShow, BiHide } from 'react-icons/bi';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from "react-router-dom";   // ⭐ FIXED: import navigate
import '../../components/css/authenticate.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = ({ successMessage, errorMessage }) => {

  // ⭐ FIXED: Khai báo navigate
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [serverError, setServerError] = useState(false);

  // thông báo từ props
  useEffect(() => {
    if (successMessage) {
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: successMessage,
        timer: 3000,
        showConfirmButton: false,
      });
    } else if (errorMessage) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi...',
        text: errorMessage,
        timer: 3000,
        showConfirmButton: false,
      });
    }
  }, [successMessage, errorMessage]);


  // Submit Login
  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

   try {
  const res = await axios.post("http://localhost:8080/api/auth/login", {
    email: email,
    password: password,
  });
  
console.log("====== FRONTEND LOGIN DEBUG ======");
console.log("Response data:", res.data);
console.log("ROLE_FROM_BACKEND:", res.data.role);
    if (res.data.role !== "ROLE_USER") {
    Swal.fire({
      icon: "error",
      title: "Không có quyền!",
      text: "Chỉ tài khoản ROLE_USER mới được phép đăng nhập.",
    });
    return;
  }

  // Lưu token
localStorage.setItem("authToken", res.data.token);
localStorage.setItem("userEmail", res.data.email);
localStorage.setItem("userRole", res.data.role);
localStorage.setItem("fullName", res.data.name);
localStorage.setItem("account_id", res.data.id);
  Swal.fire({
    icon: "success",
    title: "Đăng nhập thành công!",
    timer: 2000,
    showConfirmButton: false,
  });

  // ✅ Redirect về trang chính cố định
  window.location.href = "http://localhost:3000/";
  
} catch (err) {
  console.log("Login error: ", err.response?.data);

  Swal.fire({
    icon: "error",
    title: "Đăng nhập thất bại",
    text: err.response?.data?.error || "Lỗi không xác định",
  });

  setServerError(true);
}


    setValidated(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page d-flex align-items-center min-vh-100">
      <Container>
        <Row className="justify-content-center gx-0 shadow-lg rounded-4 overflow-hidden auth-wrap">

          {/* Left Side */}
          <Col md={6} className="d-none d-md-flex align-items-center justify-content-center bg-side">
            <div className="text-white text-center px-4 position-relative z-1">
              <h1 className="mb-3 brand-title">Sanbong247</h1>
              <p className="lead mb-4">Chào mừng! Đăng nhập hoặc đăng ký ngay để tiếp tục.</p>
            </div>
          </Col>

          {/* Form */}
          <Col xs={12} md={6} className="bg-white p-4 p-md-5">
            <div className="d-flex justify-content-between mb-5">
              <h2 className="mb-0">Đăng nhập</h2>
            </div>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>

              {serverError && (
                <Alert variant="danger" className="small">
                  Sai tài khoản/mật khẩu hoặc tài khoản đã bị khóa.
                </Alert>
              )}

              {/* Email */}
              <Form.Group className="input-field mb-4" controlId="email">
                <Form.Control
                  type="text"
                  name="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Label>Email hoặc Số điện thoại</Form.Label>
                <Form.Control.Feedback type="invalid">
                  Vui lòng nhập email hoặc số điện thoại hợp lệ.
                </Form.Control.Feedback>
              </Form.Group>

              {/* Password */}
              <Form.Group className="input-field mb-4" controlId="password">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Form.Label>Mật khẩu</Form.Label>
                <span onClick={togglePasswordVisibility} className="passicon">
                  {showPassword ? <BiHide /> : <BiShow />}
                </span>
                <Form.Control.Feedback type="invalid">
                  Vui lòng nhập mật khẩu.
                </Form.Control.Feedback>
              </Form.Group>

              {/* Button */}
              <div className="d-grid mb-3">
                <Button type="submit" variant="primary" size="lg">
                  Đăng nhập
                </Button>
              </div>

              {/* Google Login */}
              <div className="d-flex gap-2 mb-4">
             <Button
  variant="light"
  className="border w-100 d-flex align-items-center justify-content-center"
  onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
>
  <img
    src="https://www.svgrepo.com/show/355037/google.svg"
    alt="Google"
    width="20"
    height="20"
    className="me-2"
  />
  <span>Đăng nhập bằng Google</span>
</Button>

              </div>

              {/* Register */}
              <div className="text-center">
                <span className="small text-muted">Chưa có tài khoản? </span>
                <a href="/register" className="small text-decoration-none">
                  Đăng ký ngay
                </a>
              </div>

            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
