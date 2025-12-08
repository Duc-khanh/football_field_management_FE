import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Routes, Route, Outlet } from "react-router-dom";

import Header from "./features/fragment/Header";
import Footer from "./features/fragment/Footer";
import HeroBanner from "./features/fragment/HeroBanner";
import VenueList from "./features/home/VenueList";
import VenueDetail from "./features/home/VenueDetail";
import BookCourt from "./features/bookings/BookCourt";
import MyBookings from "./features/accout/MyBookings";
import FavoriteList from "./features/accout/FavoriteList";

// Auth
import Login from "./features/auth/login";
import Register from "./features/auth/register";
import OwnerRegistration from "./features/auth/OwnerRegistration";
import LoginSuccess from "./features/LoginSuccess";
import Profile from "./features/accout/profile";

// Payment
import Payment from "./components/booking/PaymentPage";

function Layout({ searchKeyword, setSearchKeyword }) {
  return (
    <>
      <Header onSearch={setSearchKeyword} />
      <Outlet context={{ searchKeyword }} />
      <Footer />
    </>
  );
}

function App() {
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <Routes>

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-owner" element={<OwnerRegistration />} />
      <Route path="/login-success" element={<LoginSuccess />} />

      {/* Pages with Header/Footer */}
      <Route
        path="/"
        element={<Layout searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword} />}
      >
        <Route
          index
          element={
            <>
              <HeroBanner />
              {/* 🔥 FIX QUAN TRỌNG - TRUYỀN searchKeyword */}
              <VenueList searchKeyword={searchKeyword} />
            </>
          }
        />

        <Route path="venue/:venueId" element={<VenueDetail />} />
        <Route path="book/:courtId" element={<BookCourt />} />
        <Route path="profile" element={<Profile />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="favorites" element={<FavoriteList />} />


        {/* Payment */}
        <Route path="payment" element={<Payment />} />
        <Route path="payment/:bookingId" element={<Payment />} />
      </Route>

    </Routes>
  );
}

export default App;
