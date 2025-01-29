import React, { useEffect, useState } from "react";
import axios from "axios";
import PeopleList from "./PeopleList";
import ChatWindow from "./ChatWindow";
const ChatBox = () => {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/dashboard/getusers",{ withCredentials: true }
        );
        setPeople(response.data);
        if (response.data.length > 0) {
          setSelectedPerson(response.data[0]);
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
    return <p>Loading...</p>;
  }
  return (
    <div className="chatbox">
      <PeopleList people={people} setSelectedPerson={setSelectedPerson} />
      {selectedPerson ? (
        <ChatWindow selectedPerson={selectedPerson} />
      ) : (
        <p className="text-center">Select a person to start chatting.</p>
      )}
    </div>
  );
};

export default ChatBox;
