'use client';
import React, { useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa'; // Using FaRobot for AI assistant icon

const FloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', text: 'Hi there! How can I help you with your course today?' },
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChatHistory([...chatHistory, { type: 'user', text: message.trim() }]);
      setMessage('');
      // Mock AI response
      setTimeout(() => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { type: 'bot', text: `Thanks for your question: "${message.trim()}". Our AI is processing it and will get back to you shortly!` },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="bg-primary text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50"
        aria-label="Toggle AI Assistant Chat"
      >
        {isOpen ? <FaTimes size={24} /> : <FaRobot size={24} />}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 animate-slideUpAndFade">
          <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-lg">AI Learning Assistant</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200 focus:outline-none">
              <FaTimes size={18} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`mb-3 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                <span
                  className={`inline-block p-3 rounded-lg ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                  style={{ maxWidth: '80%' }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 flex">
            <input
              type="text"
              id="ai-assistant-input"
              name="message"
              autocomplete="off"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2 focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75"
              aria-label="Send Message"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FloatingAssistant; 