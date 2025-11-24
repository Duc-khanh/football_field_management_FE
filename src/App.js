import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Routes, Route, Outlet } from "react-router-dom";

import Header from "./features/fragment/Header";
import Footer from "./features/fragment/Footer";
import HeroBanner from "./features/fragment/HeroBanner";
import VenueList from "./features/home/VenueList";
import VenueDetail from "./features/home/VenueDetail";
import BookCourt from "./features/BookCourt";

import Login from "./features/auth/login";
import Register from "./features/auth/register";
import LoginSuccess from "./features/LoginSuccess";
import Profile from "./features//accout/profile";

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

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login-success" element={<LoginSuccess />} />

      {/* Layout pages */}
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
