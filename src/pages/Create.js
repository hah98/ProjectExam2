import React, { useState } from "react";
import { useParams } from "react-router-dom"; 

function CreateVenue() {
    const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    maxGuests: "",
    media: "",
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

    const venueData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      maxGuests: parseInt(formData.maxGuests),
      media: formData.media ? [{ url: formData.media }] : [],
      meta: {
        wifi: formData.wifi,
        parking: formData.parking,
        breakfast: formData.breakfast,
        pets: formData.pets,
      },
    };

    try {
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": "cc5b6445-15c9-404b-b055-4efeafeedd57", //Using this to test since I get a 401 error without :(
        },
        body: JSON.stringify(venueData),
      });

      if (response.ok) {
        setMessage("Venue created successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          maxGuests: "",
          media: "",
          wifi: false,
          parking: false,
          breakfast: false,
          pets: false,
        });
      } else {
        setMessage("Failed to create venue. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Create Venue</h1>
      <form className="p-4 border rounded" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Venue Name
          </label>
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
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
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
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price (per night)
          </label>
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
        <div className="mb-3">
          <label htmlFor="maxGuests" className="form-label">
            Maximum Guests
          </label>
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
        <div className="mb-3">
          <label htmlFor="media" className="form-label">
            Image URL
          </label>
          <input
            type="url"
            className="form-control"
            id="media"
            name="media"
            value={formData.media}
            onChange={handleChange}
          />
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="wifi"
            name="wifi"
            checked={formData.wifi}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="wifi">
            WiFi
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="parking"
            name="parking"
            checked={formData.parking}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="parking">
            Parking
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="breakfast"
            name="breakfast"
            checked={formData.breakfast}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="breakfast">
            Breakfast Included
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="pets"
            name="pets"
            checked={formData.pets}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="pets">
            Pets Allowed
          </label>
        </div>
        <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
          {loading ? "Submitting..." : "Create Venue"}
        </button>
      </form>
      {message && <p className="mt-3 alert alert-info">{message}</p>}
    </div>
  );
}

export default CreateVenue;
