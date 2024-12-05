import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    avatarUrl: "",
    avatarAlt: "",
    venueManager: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    setError(null);
  
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      bio: formData.bio || undefined,
      avatar: formData.avatarUrl
        ? { url: formData.avatarUrl, alt: formData.avatarAlt }
        : undefined,
      venueManager: formData.venueManager,
    };
  
    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Registration failed. Check your inputs.");
      }
  
      const data = await response.json(); 
      console.log("User Profile:", data.data); // debugging 
  
      navigate("/login"); // Redirect to login page after successful registration
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mt-5">
      <h1 className="text-center">Register</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="bio" className="form-label">
            Bio (optional)
          </label>
          <textarea
            id="bio"
            name="bio"
            className="form-control"
            value={formData.bio}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="avatarUrl" className="form-label">
            Avatar URL (optional)
          </label>
          <input
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            className="form-control"
            value={formData.avatarUrl}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="avatarAlt" className="form-label">
            Avatar Alt Text (optional)
          </label>
          <input
            type="text"
            id="avatarAlt"
            name="avatarAlt"
            className="form-control"
            value={formData.avatarAlt}
            onChange={handleChange}
          />
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            id="venueManager"
            name="venueManager"
            className="form-check-input"
            checked={formData.venueManager}
            onChange={handleChange}
          />
          <label htmlFor="venueManager" className="form-check-label">
            Are you a venue manager?
          </label>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;