import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";  

const fetchBookings = async (venueId) => {
    try {
      console.log("Fetching bookings for venueId:", venueId); // Debugging here too 
  
      
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/bookings?venueId=${venueId}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": "cc5b6445-15c9-404b-b055-4efeafeedd57" //Using this to test since I get a 401 error without :(
        }
      });
  
      if (!response.ok) {
        console.error(`Error fetching bookings: ${response.status} ${response.statusText}`);
        return [];
      }
  
      const data = await response.json();
      return data.data || []; 
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
  };
  

const processBookings = (bookings) => {
  const bookedDates = [];

  if (Array.isArray(bookings)) {
    bookings.forEach(booking => {
      const startDate = new Date(booking.dateFrom);
      const endDate = new Date(booking.dateTo);

      
      const formattedStartDate = startDate.toISOString().split('T')[0];  // Ignore time only date 
      const formattedEndDate = endDate.toISOString().split('T')[0];  

      for (let date = new Date(formattedStartDate); date <= new Date(formattedEndDate); date.setDate(date.getDate() + 1)) {
        bookedDates.push(date.toISOString().split('T')[0]); 
      }
    });
  }

  return bookedDates;
};

// CalendarBookings component
const CalendarBookings = () => {
  const { id } = useParams();  
  const [bookedDates, setBookedDates] = useState([]);  
  const [venue, setVenue] = useState(null);  

  useEffect(() => {
    const fetchAndSetBookings = async () => {
      const bookings = await fetchBookings(id);
      const booked = processBookings(bookings);  
      setBookedDates(booked);  
    };

    const fetchVenue = async () => {
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`);
      const data = await response.json();
      setVenue(data.data); 
    };

    fetchAndSetBookings(); 
    fetchVenue();  
  }, [id]);  

  if (!venue) return <p>Loading...</p>;  

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Venue details */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">{venue.name}</h3>
              <p><strong>Location:</strong> {venue.location.city}, {venue.location.country}</p>
              <p><strong>Price:</strong> {venue.price} kr per night</p>
              <p><strong>Max Guests:</strong> {venue.maxGuests}</p>
              <h5>Amenities</h5>
              <ul className="list-unstyled">
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
        </div>

        {/* Calendar with booking dates */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Available Dates</h4>
              {/* Render react-calendar */}
              <Calendar
                tileClassName={({ date }) => bookedDates.includes(date.toISOString().split('T')[0]) ? 'bg-danger text-white' : ''}
                tileDisabled={({ date }) => bookedDates.includes(date.toISOString().split('T')[0])}
                minDate={new Date()}  // Only dates after yesteday up to date
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarBookings;

