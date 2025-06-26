import React from 'react';
import PropTypes from 'prop-types';

const UserCard = ({ user, onClick, isSelected }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays <= 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div
      className={`flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={() => onClick(user.id)}
      aria-label={`Chat with ${user.name}`}
    >
      <div className="relative">
        <img src={user.profileImg || 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=N/A'} alt={user.name} className="w-20 h-20 rounded-full mb-3 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=N/A'; }} />
        <span className={`absolute bottom-3 right-3 block w-4 h-4 rounded-full ring-2 ring-white dark:ring-gray-800 ${user.online ? 'bg-green-500' : 'bg-red-500'}`}
              title={user.online ? "Online" : "Offline"}></span>
      </div>
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{user.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{user.role}</p>
      <div className="flex flex-wrap justify-center gap-1 mt-2 mb-3">
        {user.sharedCourses.map(course => (
          <span key={course} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">{course}</span>
        ))}
      </div>
      {user.lastMessage && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center truncate w-full px-2">{user.lastMessage}</p>
      )}
      {user.lastMessageTimestamp && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatTimestamp(user.lastMessageTimestamp)}</p>
      )}
      <button
        className="mt-auto bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        onClick={(e) => { e.stopPropagation(); onClick(user.id); }}
        aria-label="Start Chat"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.916 9.916 0 01-2.94-3.04L3 21l1.394-3.553C3.044 14.887 2 13.52 2 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        Chat
      </button>
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    profileImg: PropTypes.string,
    role: PropTypes.string.isRequired,
    sharedCourses: PropTypes.arrayOf(PropTypes.string).isRequired,
    online: PropTypes.bool.isRequired,
    lastMessage: PropTypes.string,
    lastMessageTimestamp: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default UserCard; 