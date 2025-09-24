import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./features/fragment/Header";
import Footer from "./features/fragment/Footer";
import VenueList from "./features/VenueList";
import VenueDetail from "./features/VenueDetail";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<VenueList />} />
        <Route path="/venue/:venueId" element={<VenueDetail />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
