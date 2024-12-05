import React from "react";
import Venues from "./Venues"; // Import the Venues component

function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-center mb-4">Welcome to Holidaze!</h1>
      <p className="text-center mb-5">
        Discover our luxurious venues for a perfect getaway. Here are some of our featured stays:
      </p>
      
      {/* Display 3 venues as a preview */}
      <Venues showLimit={6} />

      {/* Add any additional sections */}
    </div>
  );
}

export default Home;


