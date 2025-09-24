import React from "react";
import { Routes, Route } from "react-router-dom"; // KHÔNG import BrowserRouter
import Header from "./features/fragment/Header";
import Footer from "./features/fragment/Footer";
import VenueList from "./features/VenueList";
import VenueDetail from "./features/VenueDetail";
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
