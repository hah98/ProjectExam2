import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; 
import { Button, Modal } from "react-bootstrap"; 

const CalendarBookings = ({ venueId }) => {
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchBookings = async (venueId) => {
    try {
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/bookings?venueId=${venueId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": "cc5b6445-15c9-404b-b055-4efeafeedd57", 
        },
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
    return bookings.map((booking) => ({
      dateFrom: new Date(booking.dateFrom),
      dateTo: new Date(booking.dateTo),
    }));
  };

  useEffect(() => {
    const fetchAndSetBookings = async () => {
      const bookings = await fetchBookings(venueId);
      const processedBookings = processBookings(bookings);
      setBookedDates(processedBookings);
    };

    fetchAndSetBookings();
  }, [venueId]);

  const isBooked = (date) => {
    return bookedDates.some(
      (booking) => date >= new Date(booking.dateFrom).setHours(0, 0, 0, 0) &&
                  date <= new Date(booking.dateTo).setHours(0, 0, 0, 0)
    );
  };

  const handleDateSelect = (date) => {
    if (!isBooked(date)) {
      setSelectedDate(date);
    } else {
      alert("This date is already booked.");
    }
  };

  const handleBooking = async () => {
    if (!selectedDate) {
      alert("Please select a valid date to book.");
      return;
    }
  
    
    const dateFrom = selectedDate;
    const dateTo = new Date(dateFrom);
    dateTo.setDate(dateFrom.getDate() + 1); 
  
    const guests = 1; 
  
    const token = localStorage.getItem("authToken"); 
    if (!token) {
      alert("Authentication token is missing. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": "cc5b6445-15c9-404b-b055-4efeafeedd57",
        },
        body: JSON.stringify({
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
          guests: guests,
          venueId: venueId, 
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setSelectedDate(null); 
        setShowModal(true); 
  
        // Loggin the succesful booking in the console
        console.log(`Successfully booked: ${dateFrom.toISOString()} to ${dateTo.toISOString()}`);
      } else {
        console.error("Error in response:", result);
        alert(`Booking failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("An error occurred while making the booking.");
    }
  };
  

  // Rendering the calendar
  return (
    <div className="calendar-bookings">
      <h3>Available Dates for Booking</h3>
      <p> Skip forward to year 2035, sorry for the inconvenience</p>

      {/* Render the react-calendar */}
      <Calendar
        onChange={handleDateSelect}
        value={selectedDate}
        tileClassName={({ date }) =>
          isBooked(date) ? "booked" : "available"
        }
        // Disable dates in the past
        minDate={new Date()}
      />

      {/* Booking Button */}
      <div className="mt-3">
        <Button onClick={handleBooking} disabled={!selectedDate}>
          Book Now
        </Button>
      </div>

      {/* Modal for booking success */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Successful!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your booking has been successfully made.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Styling */}
      <style>
        {`
          .calendar-bookings {
            text-align: center;
          }

          .react-calendar__tile.booked {
            background-color: red !important;
            color: white !important;
          }

          .react-calendar__tile.available {
            background-color: green !important;
            color: white !important;
          }

          .react-calendar__tile:active {
            background-color: #0069d9 !important;
          }
        `}
      </style>
    </div>
  );
};

export default CalendarBookings;

