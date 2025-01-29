import React from 'react';

const MessageBubble = ({ text, sender }) => {
  const isUser = sender === 'user';

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'bot'}`}>
      <p>{text}</p>
    </div>
  );
};

export default MessageBubble;
