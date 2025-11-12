import React from "react";
import { Routes, Route } from "react-router-dom"; 
import Header from "./features/fragment/Header";
import Footer from "./features/fragment/Footer";
import HeroBanner from "./features/fragment/HeroBanner";
import VenueList from "./features/home/VenueList";
import VenueDetail from "./features/home/VenueDetail";
import BookCourt from "./features/BookCourt";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<VenueList />} />
        <Route path="/venue/:venueId" element={<VenueDetail />} />
        <Route path="/book/:courtId" element={<BookCourt />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
