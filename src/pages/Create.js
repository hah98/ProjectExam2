import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function CreateVenue() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    maxGuests: "",
    media: "",
    altText: "",
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
    address: "",
    city: "",
    zip: "",
    country: "",
    continent: "",
    lat: "",
    lng: "",
  });

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  // Fetch username from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUsername(parsedUser.name); // Assuming the user object has a 'name' field
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Prepare the venue data object
    const venueData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      maxGuests: parseInt(formData.maxGuests),
      media: formData.media
        ? [
            {
              url: formData.media,
            },
          ]
        : [],
      meta: {
        wifi: formData.wifi,
        parking: formData.parking,
        breakfast: formData.breakfast,
        pets: formData.pets,
      },
      location: {
        address: formData.address || null,
        city: formData.city || null,
        zip: formData.zip || null,
        country: formData.country || null,
        continent: formData.continent || null,
        lat: parseFloat(formData.lat) || 0,
        lng: parseFloat(formData.lng) || 0,
      },
    };

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setMessage("Authentication token is missing. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": "cc5b6445-15c9-404b-b055-4efeafeedd57",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venueData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Venue Created Successfully:", result);
        setMessage("Venue created successfully!");

        // Redirect to the user's profile if username exists
        if (username) {
          navigate(`/profiles/${username}`);
        } else {
          console.error("Username not found in localStorage.");
          navigate("/"); // Redirect to home if no username found
        }

        // Reset form data
        setFormData({
          name: "",
          description: "",
          price: "",
          maxGuests: "",
          media: "",
          altText: "",
          wifi: false,
          parking: false,
          breakfast: false,
          pets: false,
          address: "",
          city: "",
          zip: "",
          country: "",
          continent: "",
          lat: "",
          lng: "",
        });
      } else {
        console.error("Response Error:", result);
        setMessage(`Failed to create venue: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Create Venue</h1>
      <form className="p-4 border rounded" onSubmit={handleSubmit}>
        {/* Venue Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Venue Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price (per night)</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        {/* Max Guests */}
        <div className="mb-3">
          <label htmlFor="maxGuests" className="form-label">Maximum Guests</label>
          <input
            type="number"
            className="form-control"
            id="maxGuests"
            name="maxGuests"
            value={formData.maxGuests}
            onChange={handleChange}
            required
          />
        </div>

        {/* Media */}
        <div className="mb-3">
          <label htmlFor="media" className="form-label">Image URL</label>
          <input
            type="url"
            className="form-control"
            id="media"
            name="media"
            value={formData.media}
            onChange={handleChange}
          />
        </div>

        {/* Meta (WiFi, Parking, etc.) */}
        {["wifi", "parking", "breakfast", "pets"].map((item) => (
          <div className="form-check" key={item}>
            <input
              type="checkbox"
              className="form-check-input"
              id={item}
              name={item}
              checked={formData[item]}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={item}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </label>
          </div>
        ))}

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
          {loading ? "Submitting..." : "Create Venue"}
        </button>
      </form>

      {/* Feedback Message */}
      {message && <p className="mt-3 alert alert-info">{message}</p>}
    </div>
  );
}

export default CreateVenue;