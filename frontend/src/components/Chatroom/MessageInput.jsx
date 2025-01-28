import React from 'react';

const MessageInput = ({ message, setMessage, onSendMessage }) => {
  return (
    <div className="message-input-container">
      <input
        type="text"
        className="message-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button className="send-button" onClick={onSendMessage}>Send</button>
    </div>
  );
};

export default MessageInput;
