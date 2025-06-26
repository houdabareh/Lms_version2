import React from 'react'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-primary mb-4"></div>
      <p className="text-dark text-lg font-semibold">Loading Content...</p>
    </div>
  )
}

export default Loading