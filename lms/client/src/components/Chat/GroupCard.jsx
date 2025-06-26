import React from 'react';
import PropTypes from 'prop-types';

const GroupCard = ({ group, onClick, isSelected }) => {
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
      className={`flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center justify-between cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={() => onClick(group.id)}
      aria-label={`Join ${group.name} chat`}
    >
      <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2 text-center">{group.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{group.members} Members</p>
      {group.lastMessage && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center truncate w-full px-2">{group.lastMessage}</p>
      )}
      {group.lastMessageTimestamp && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatTimestamp(group.lastMessageTimestamp)}</p>
      )}
      <button
        className="mt-auto bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        onClick={(e) => { e.stopPropagation(); onClick(group.id); }}
        aria-label="Join Chat"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2m4-14v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Join Chat
      </button>
    </div>
  );
};

GroupCard.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    members: PropTypes.number.isRequired,
    lastMessage: PropTypes.string,
    lastMessageTimestamp: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default GroupCard; 