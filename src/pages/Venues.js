import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Venues = ({ showLimit }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching venues data from the API
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch("https://v2.api.noroff.dev/holidaze/venues");
        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }
        const data = await response.json();
        setVenues(data.data); 
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!venues || venues.length === 0) return <div>No venues available.</div>;

  const displayedVenues = showLimit ? venues.slice(0, showLimit) : venues;

  // Check if the user is logged in
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Venues</h1>
      <div className="row g-4">
        {displayedVenues.map((venue) => (
          <div key={venue.id} className="col-md-6 col-lg-4">
            <div
              className="card h-100 border-0"
              style={{ backgroundColor: "rgb(232, 212, 110)" }}
            >
              <img
  src={venue.media[0]?.url || "https://via.placeholder.com/300x200"}
  alt={venue.media[0]?.alt || "Venue"}
  className="card-img-top img-fluid"
  style={{
    height: "200px",
    objectFit: "cover", 
  }}
/>

              <div className="card-body text-center">
                <h5 className="card-title">{venue.name}</h5>
                <p className="card-text">
                  Price: ${venue.price} <br />
                  Max Guests: {venue.maxGuests}
                </p>

                <div>
                  {isLoggedIn ? (
                    <Link to={`/venues/${venue.id}`} className="btn btn-dark">
                      View Venue
                    </Link>
                  ) : (
                    <Link to="/login" className="btn btn-dark">
                      Login to book
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showLimit && venues.length > showLimit && (
        <div className="text-center mt-4">
          <Link to="/venues" className="btn btn-dark">
            View More Venues
          </Link>
        </div>
      )}
    </div>
  );
};

Venues.defaultProps = {
  showLimit: null, 
};

export default Venues;