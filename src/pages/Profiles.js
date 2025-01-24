import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const Profile = () => {
  const { name } = useParams();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: { url: "", alt: "" },
    venueManager: false,
  });
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [venueManagerStatus, setVenueManagerStatus] = useState(false);

  // Fetch Profile Data, Venues, and Bookings
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken || !name) {
      console.error("Missing authentication token or profile name.");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch Profile Data
        const profileResponse = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${name}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "X-Noroff-API-Key": "cc5b6445-15c9-404b-b055-4efeafeedd57",
            },
          }
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile({
            ...profileData.data,
            avatar: profileData.data.avatar || { url: "", alt: "" },
          });
          setAvatarUrl(profileData.data.avatar?.url || "");
          setVenueManagerStatus(profileData.data.venueManager);
        } else {
          console.error("Failed to fetch profile. Status:", profileResponse.status);
        }

        // Fetch Venues Data (for profile)
        const venuesResponse = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${name}/venues`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "X-Noroff-API-Key": "cc5b6445-15c9-404b-b055-4efeafeedd57",
            },
          }
        );

        if (venuesResponse.ok) {
          const venuesData = await venuesResponse.json();
          setVenues(venuesData.data);
        } else {
          console.error("Failed to fetch venues. Status:", venuesResponse.status);
        }

        // Fetch Bookings Data
        const bookingsResponse = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${name}/bookings?_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "X-Noroff-API-Key": "cc5b6445-15c9-404b-b055-4efeafeedd57",
            },
          }
        );

        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData.data);
        } else {
          console.error("Failed to fetch bookings. Status:", bookingsResponse.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [name]);

  const handleAvatarChange = (event) => {
    setAvatarUrl(event.target.value);
  };

  const handleAvatarUpdate = async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem("authToken");

    const updatedProfile = {
      avatar: {
        url: avatarUrl,
        alt: "User Avatar",
      },
    };

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${name}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "X-Noroff-API-Key": "cc5b6445-15c9-404b-b055-4efeafeedd57",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfile((prevProfile) => ({
          ...prevProfile,
          avatar: data.avatar,
        }));
        alert("Avatar updated successfully!");
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to update avatar."}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  const handleVenueManagerUpdate = async () => {
    const authToken = localStorage.getItem("authToken");
    const updatedStatus = !venueManagerStatus;

    const updatedProfile = {
      venueManager: updatedStatus,
    };

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${name}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "X-Noroff-API-Key": "cc5b6445-15c9-404b-b055-4efeafeedd57",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setVenueManagerStatus(data.venueManager ?? false);
        alert(
          `You are now ${
            data.venueManager ? "registered as a Venue Manager" : "not a Venue Manager"
          }.`
        );
        // Refresh after success
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to update status."}`);
      }
    } catch (error) {
      console.error("Error updating Venue Manager status:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  if (!name) {
    return <p>Error: No user name provided.</p>;
  }

  const handleDeleteVenue = async (venueId) => {
    const authToken = localStorage.getItem("authToken");
  
    const confirmDelete = window.confirm("Are you sure you want to delete this venue?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${venueId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "X-Noroff-API-Key": "cc5b6445-15c9-404b-b055-4efeafeedd57",
          },
        }
      );
  
      if (response.ok) {
        setVenues(venues.filter((venue) => venue.id !== venueId));
        alert("Venue deleted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete venue:", errorData);
        alert(`Error: ${errorData.message || "Failed to delete venue."}`);
      }
    } catch (error) {
      console.error("Error deleting venue:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };
  
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Profile Page</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="row">
            {/* Avatar Section */}
            <div className="col-md-4 text-center">
              <img
                src={profile.avatar?.url}
                alt={profile.avatar?.alt || "User Avatar"}
                className="rounded-circle mb-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <form onSubmit={handleAvatarUpdate}>
                <div className="mb-3">
                  <label htmlFor="avatar-url" className="form-label">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="avatar-url"
                    value={avatarUrl}
                    onChange={handleAvatarChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Avatar
                </button>
              </form>
            </div>

            {/* Profile Info Section */}
            <div className="col-md-8">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.name}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={profile.email}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Venue Manager</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="venueManagerToggle"
                    checked={!!venueManagerStatus} 
                    onChange={handleVenueManagerUpdate}
                  />
                  <label className="form-check-label" htmlFor="venueManagerToggle">
                    {venueManagerStatus
                      ? "Registered as a Venue Manager"
                      : "Not a Venue Manager"}
                  </label>
                </div>
              </div>

              {/* Venues List */}
              <div className="mt-4">
                <h4>Your Venues</h4>
                <div className="row">
                  {venues.map((venue) => (
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
                        <Link to={`/venues/${venue.id}`} className="btn btn-dark">
                          View Venue
                        </Link>
                        <Link to={`/update/${venue.id}`} className="btn btn-warning mt-2">
                          Update Venue
                        </Link>
                        <button
                          className="btn btn-danger mt-2"
                          onClick={() => handleDeleteVenue(venue.id)}
                        >
                          Delete Venue
                        </button>
                      </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

          {/* Upcoming Bookings Section */}
          <div className="mt-4">
            <h4>Upcoming Bookings</h4>
            <div className="row">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 border-0">
                      <div className="card-body">
                        <h5 className="card-title">{booking.venue.name}</h5>
                        <p className="card-text">
                          Guests: {booking.guests} <br />
                          Check-in: {new Date(booking.dateFrom).toLocaleDateString()} <br />
                          Check-out: {new Date(booking.dateTo).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No upcoming bookings found.</p>
              )}
            </div>
          </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
