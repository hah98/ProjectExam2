import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profiles from "./pages/Profiles";
import Venues from "./pages/Venues";
import CreateVenue from "./pages/Create";
import Footer from "./components/Footer";
import Venueid from "./pages/Venueid";
import Logout from "./pages/Logout";
import CalendarBookings from "./components/CalanderBookings";

function App() {
  const [venues, setVenues] = useState({ data: [] });

  useEffect(() => {
    // Fetching venues from API
    const fetchVenues = async () => {
      const response = await fetch("https://v2.api.noroff.dev/holidaze/venues");
      const data = await response.json();
      setVenues(data);
    };

    fetchVenues();
  }, []);

  return (
    <Router>
      <Header venues={venues} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Create" element={<CreateVenue />} />
          <Route path="/Venues" element={<Venues />} />
          <Route path="/venues/:id" element={<Venueid />} />
          <Route path="/profiles/:name" element={<Profiles />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/bookings/:id" element={<CalendarBookings />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;


