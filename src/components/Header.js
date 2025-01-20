import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

function Header({ venues }) {
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));
  const [username, setUsername] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUsername(parsedUser.name);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const toggleSearchBar = () => {
    setShowSearchBar((prev) => !prev);
  };

  return (
    <header
      className="text-white"
      style={{
        backgroundImage: `url("/assets/images/forside.jpeg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "40vh",
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

          {/* Links */}
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
                      to={username ? `/profiles/${username}` : "/"}
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
              {/* Search Icon */}
              <li className="nav-item">
                <button
                  className="btn btn-outline-secondary mx-2"
                  onClick={toggleSearchBar}
                >
                  <i className="bi bi-search"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container text-center my-auto py-5 position-relative">
        <div className="bg-dark bg-opacity-50 text-white d-inline-block px-3 py-2 rounded">
          <h1 className="display-4 fw-bold">WELCOME TO THE WORLD OF LUXURY STAYS</h1>
        </div>
      </div>

      {/* Conditionally Rendered Search Bar */}
      {showSearchBar && (
        <div
          className="position-absolute top-0 start-50 translate-middle-x"
          style={{
            zIndex: 20,
            marginTop: "100px",
            width: "80%",
          }}
        >
          <SearchBar venues={venues} />
        </div>
      )}
    </header>
  );
}

export default Header;

