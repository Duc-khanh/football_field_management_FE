import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Routes, Route, Outlet } from "react-router-dom";

import Header from "./features/fragment/Header";
import Footer from "./features/fragment/Footer";
import HeroBanner from "./features/fragment/HeroBanner";
import VenueList from "./features/home/VenueList";
import VenueDetail from "./features/home/VenueDetail";
import BookCourt from "./features/BookCourt";

// Auth Components
import Login from "./features/auth/login";
import Register from "./features/auth/register";
import OwnerRegistration from "./features/auth/OwnerRegistration"; // Import component đăng ký Owner
import LoginSuccess from "./features/LoginSuccess";

import Profile from "./features/accout/profile"; // Đã sửa đường dẫn dư dấu //

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>

      {/* Auth Pages - Các trang không có Header/Footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-owner" element={<OwnerRegistration />} /> {/* Route mới cho Owner */}
      <Route path="/login-success" element={<LoginSuccess />} />

      {/* Layout pages - Các trang có Header/Footer */}
      <Route path="/" element={<Layout />}>
        <Route index element={
          <>
            <HeroBanner />
            <VenueList />
          </>
        } />

        <Route path="venue/:venueId" element={<VenueDetail />} />
        <Route path="book/:courtId" element={<BookCourt />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

    </Routes>
  );
}

export default App;