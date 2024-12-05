import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar"; 

function Header({ venues }) {
  // Checeking if the user is logged in by authToken in LocalStorage
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));
  const [showSearchBar, setShowSearchBar] = useState(false);

  return (
    <header
      className="text-white"
      style={{
        backgroundImage: `url("/assets/images/forside.jpeg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        width: "100%",
      }}
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-light bg-transparent"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backdropFilter: "blur(3px)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <div className="container">
          {/* Logo */}
          <a className="navbar-brand" href="/">
            <div
              className="px-3 py-2"
              style={{ backgroundColor: "#E8D46E", color: "white", fontWeight: "bold" }}
            >
              Holidaze
            </div>
          </a>

          {/* Toggle button for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

            {/* Links - In Navbar Menu */} 
<div className="collapse navbar-collapse justify-content-end" id="navbarNav">
  <ul className="navbar-nav">
    <li className="nav-item">
      <Link className="nav-link fw-bold" to="/venues">
        Venues
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link fw-bold" to="/about">
        About Us
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link fw-bold" to="/Create">
        List a Venue
      </Link>
    </li>
    {isLoggedIn ? (
  <>
    <li className="nav-item">
      <Link
        className="nav-link fw-bold"
        to={`/profiles/${localStorage.getItem("username")}`} 
      >
        My Profile
      </Link>
    </li>
    <li className="nav-item">
      <Link className="btn btn-dark" to="/logout">
        Log Out
      </Link>
    </li>
  </>
) : (
  <>
    <li className="nav-item">
      <Link className="btn btn-dark" to="/login">
        Login
      </Link>
    </li>
    <li className="nav-item">
      <Link className="btn btn-dark" to="/register">
        Register
      </Link>
    </li>
  </>
)}

  </ul>

            {/* Search Icon */}
            <button
              className="btn btn-outline-secondary mx-3"
              onClick={() => setShowSearchBar((prev) => !prev)}
            >
              <i className="bi bi-search"></i> 
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container text-center my-auto py-5">
        <h1 className="display-4 fw-bold">WELCOME TO THE WORLD OF LUXURY STAYS</h1>
      </div>

      {showSearchBar && (
        <div
          className="position-absolute top-0 start-50 translate-middle-x"
          style={{ zIndex: 20, marginTop: "100px", width: "80%" }}
        >
          <SearchBar venues={venues} />
        </div>
      )}
    </header>
  );
}

export default Header;
