import React, { useEffect, useState } from "react";
import Edit from "./ui/Edit";
import axios from "axios";

const Profile = () => {
  const [people, setPeople] = useState([]); // Store all users
  const [selectedPerson, setSelectedPerson] = useState(null); // Store selected user
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/dashboard/getusers",
          { withCredentials: true }
        );
        const users = response.data;

        // Update state
        setPeople(users);
        console.log("Fetched people:", users);
        if (users.length > 0) {
          setSelectedPerson(users[0]); // Set the first user as the default
        } else {
          console.warn("No users found.");
        }
      } catch (error) {
        console.error("Error fetching people:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!selectedPerson) {
    return <div>No user selected.</div>;
  }

  return (
    <center className="mt-32 ml-[20rem]">
      <div className="profile-card">
        <div className="avatar-container">
          <img
            src={selectedPerson.profilePic || "https://via.placeholder.com/150"}
            alt="Profile Avatar"
            className="avatar"
          />
        </div>
        <div className="profile-details">
          <div className="profile-item">
            <label className="profile-label">Email:</label>
            <span className="profile-value">{selectedPerson.email || "N/A"}</span>
          </div>
          <div className="profile-item">
            <label className="profile-label">Username:</label>
            <span className="profile-value">
              {selectedPerson.username || "N/A"}
            </span>
          </div>
          <div className="profile-item">
            <label className="profile-label">Date of Creation:</label>
            <span className="profile-value">
              {new Date(selectedPerson.createdAt).toLocaleDateString() || "N/A"}
            </span>
          </div>
        </div>
        <Edit />
      </div>
    </center>
  );
};

export default Profile;
