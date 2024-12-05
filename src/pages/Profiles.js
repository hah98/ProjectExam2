import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 

const Profile = () => {
  const { name } = useParams(); 
  console.log("Route name:", name);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: { url: '' },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar.url);

  useEffect(() => {
    console.log("Fetching profile...");
    const authToken = localStorage.getItem("authToken");
    console.log("authToken:", authToken);
    console.log("Route name:", name);

    if (!authToken || !name) {
      console.error("No name or token found.");
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${name}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "X-Noroff-API-Key": "cc5b6445-15c9-404b-b055-4efeafeedd57" //Using this to test since I get a 401 error without :(
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfile(data.data);
          setAvatarUrl(data.data.avatar.url); 
        } else {
          console.error("Failed to fetch profile. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [name]);

  if (!name) {
    return <p>Error: No user name provided in the URL.</p>;
  }

  const handleAvatarChange = (event) => {
    setAvatarUrl(event.target.value); 
  };

  const handleAvatarUpdate = async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem("authToken");

    const updatedProfile = {
      ...profile,
      avatar: {
        url: avatarUrl,
        alt: 'User Avatar',
      },
    };

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${name}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${authToken}`,
            "X-Noroff-API-Key": "cc5b6445-15c9-404b-b055-4efeafeedd57",
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: updatedProfile }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Profile updated:', data);
        setProfile(data.data); 
      } else {
        console.error('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Profile Page</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {/* Avatar Section */}
          <div className="col-md-4 text-center">
            <img
              src={profile.avatar.url }
              alt={profile.avatar.alt || "User Avatar"}
              className="rounded-circle mb-3"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <form onSubmit={handleAvatarUpdate}>
              <div className="mb-3">
                <label htmlFor="avatar-url" className="form-label">Avatar URL</label>
                <input
                  type="url"
                  className="form-control"
                  id="avatar-url"
                  value={avatarUrl}
                  onChange={handleAvatarChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">Update Avatar</button>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;


