import React from "react";
import Header from "./features/fragment/Header";
import Footer from "./features/fragment/Footer";
import VenueList from "./features/VenueList";

function App() {
  return (
    <div className="App">
      <Header />
      <VenueList />
      <Footer />
    </div>
  );
}

export default App;
