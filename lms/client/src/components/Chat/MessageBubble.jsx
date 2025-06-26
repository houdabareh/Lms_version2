import React from 'react';
import PropTypes from 'prop-types';

const MessageBubble = ({ message, isCurrentUser, profileImg }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} items-end`}>
      {!isCurrentUser && (
        <img src={profileImg || 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=A'} alt={message.sender} className="w-8 h-8 rounded-full mr-3 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=A'; }} />
      )}
      <div className={`p-3 rounded-lg max-w-md relative ${isCurrentUser ? 'bg-primary text-white rounded-br-none shadow' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow'}`}>
        <p className="font-semibold text-xs mb-1">
          {message.sender}
          {message.read === false && !isCurrentUser && (
            <span className="ml-2 text-red-500 font-bold text-xxs">• New</span>
          )}
        </p>
        <p className="text-sm">{message.text}</p>
        <span className={`text-xs opacity-80 mt-1 block ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
      {isCurrentUser && (
        <img src={profileImg || 'https://via.placeholder.com/150/007BFF/FFFFFF?text=C'} alt="You" className="w-8 h-8 rounded-full ml-3 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150/007BFF/FFFFFF?text=C'; }} />
      )}
    </div>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sender: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    read: PropTypes.bool,
  }).isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
  profileImg: PropTypes.string,
};

export default MessageBubble; 