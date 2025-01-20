import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Update = () => {
  const { id } = useParams();  
  const navigate = useNavigate();  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    maxGuests: "",
    media: "",
  });

  const [venue, setVenue] = useState(null);  

  useEffect(() => {
    const fetchVenue = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("Authorization token is missing.");
        return;
      }

      try {
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`, {
          method: "GET",  
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setVenue(data.data);  
          setFormData({
            name: data.data.name,
            description: data.data.description,
            price: data.data.price,
            maxGuests: data.data.maxGuests,
            media: data.data.media[0]?.url || "",  
          });
        } else {
          console.error("Failed to fetch venue data:", data);
        }
      } catch (error) {
        console.error("Error fetching venue:", error);
      }
    };

    fetchVenue();
  }, [id]);  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Authorization token is missing.");
      alert("Please log in again.");
      return;
    }

    const updatedVenue = {
      ...formData,
      price: parseFloat(formData.price), 
      maxGuests: parseInt(formData.maxGuests),  
    };

    console.log("Updating venue with data:", updatedVenue);

    try {
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`, {
        method: "PUT",  
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": "cc5b6445-15c9-404b-b055-4efeafeedd57", 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVenue),  
      });

      const data = await response.json();

      if (response.ok) {
        alert("Venue updated successfully");
        navigate(`/profile`); 
      } else {
        console.error("Failed to update venue:", data);
        alert(`Failed to update venue: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating venue:", error);
      alert("An error occurred while updating the venue.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Update Venue</h1>
      {venue ? (
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
            />
          </div>

          {/* Submit Button */}
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">Update Venue</button>
          </div>
        </form>
      ) : (
        <p>Loading venue details...</p> 
      )}
    </div>
  );
};

export default Update;
