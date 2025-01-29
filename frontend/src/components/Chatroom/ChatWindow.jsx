import React, { useState, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const ChatWindow = ({ selectedPerson }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (selectedPerson) {
      setMessages([
        {
          id: 1,
          text: `Hi ${selectedPerson.username}! How can I help you?`,
          sender: "bot",
        },
      ]);
    }
  }, [selectedPerson]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  if (!selectedPerson) {
    return <p>Select a person to start chatting.</p>; // Show message if no person is selected
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Chat with {selectedPerson.username}</h3> {/* Ensure this is correctly referring to the selected person */}
      </div>
      <div className="chat-body">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            text={message.text}
            sender={message.sender}
          />
        ))}
      </div>
      <MessageInput
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatWindow;
