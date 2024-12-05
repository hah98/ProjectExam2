import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom"; 
import CalendarBookings from '../components/CalanderBookings'; 

const Venueid = () => {
  const { id } = useParams(); 
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch venue");
        }
        const data = await response.json();
        setVenue(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    

    fetchVenue();
  }, [id]);

  const isLoggedIn = Boolean(localStorage.getItem("authToken"));
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!venue) return <div>Venue not found</div>;

  return (
    <div className="venue-container container mt-5">
      <div className="row">
        <div className="col-md-6">
          {venue.media && venue.media.length > 0 ? (
            <img
              src={venue.media[0].url}
              alt={venue.media[0].alt || "Venue image"}
              className="img-fluid rounded"
            />
          ) : (
            <p>No image available</p>
          )}
        </div>
        <div className="col-md-6">
          <h1>{venue.name}</h1>
          <p>{venue.description}</p>
          <p><strong>Price:</strong> {venue.price} kr</p>
          <p><strong>Maximum Guests:</strong> {venue.maxGuests}</p>
          <div><strong>Amenities:</strong></div>
          <ul>
            {venue.meta && (
              <>
                <li>WiFi: {venue.meta.wifi ? "Yes" : "No"}</li>
                <li>Parking: {venue.meta.parking ? "Yes" : "No"}</li>
                <li>Breakfast: {venue.meta.breakfast ? "Yes" : "No"}</li>
                <li>Pets: {venue.meta.pets ? "Yes" : "No"}</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Calendar Bookings */}
      <div className="row mt-4">
        <div className="col">
        <CalendarBookings venue={venue} venueId={id} />

        </div>
      </div>
    </div>
  );
  
};

export default Venueid;
