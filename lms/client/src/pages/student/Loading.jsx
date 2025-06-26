import React from 'react';
import { useParams } from 'react-router-dom';

const Loading = () => {
  const { path } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500 mb-4"></div>
      <p className="text-gray-700 text-lg">Loading...</p>
      {path && <p className="text-gray-500 text-sm mt-2">Requested path: /{path}</p>}
    </div>
  );
};

export default Loading; 