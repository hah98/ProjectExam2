import React, { useEffect, useState } from "react";
import { fetchBookings, fetchVenues } from "../api"; // Example API utilities

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    // Fetch data when the component mounts
    fetchBookings().then(data => setBookings(data));
    fetchVenues().then(data => setVenues(data));
  }, []);

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>

      <section>
        <h2>Your Bookings</h2>
        <ul>
          {bookings.map(booking => (
            <li key={booking.id}>{booking.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Your Venues</h2>
        <ul>
          {venues.map(venue => (
            <li key={venue.id}>{venue.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
