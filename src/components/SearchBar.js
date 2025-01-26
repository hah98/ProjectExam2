import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchVenues = async (query) => {
    if (!query.trim()) {
      setFilteredVenues([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch venues");
      }
      const data = await response.json();
      setFilteredVenues(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchVenues(value);
  };

  const handleVenueClick = (venueId) => {
    navigate(`/venues/${venueId}`);
    setSearchTerm("");
    setFilteredVenues([]);
  };

  return (
    <div className="position-relative">
      <div className="input-group my-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search for venues..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      {/* Error Message Display */}
      {error && <div className="alert alert-danger">{error}</div>}
      {searchTerm && filteredVenues.length > 0 && (
        <ul
          className="list-group mt-2 position-absolute w-100 bg-white border rounded shadow"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {filteredVenues.map((venue) => (
            <li
              key={venue.id}
              className="list-group-item"
              onClick={() => handleVenueClick(venue.id)}
              style={{ cursor: "pointer" }}
            >
              {venue.name}
            </li>
          ))}
        </ul>
      )}
      {searchTerm && filteredVenues.length === 0 && !loading && (
        <div className="list-group mt-2">
          <div className="list-group-item">No venues found</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

