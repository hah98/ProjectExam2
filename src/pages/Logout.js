import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the localStorage when the user logs out
    localStorage.removeItem("authToken");

    // Redirect to the home page
    navigate("/");

   
    window.location.reload();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
