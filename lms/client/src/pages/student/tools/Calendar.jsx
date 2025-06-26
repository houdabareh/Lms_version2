import React, { useState, useEffect, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Removed EventDropArg and EventResizeContainerEvent as they are types
import Modal from '../../../components/student/Modal.jsx'; // Corrected import path with .jsx extension
import axios from 'axios'; // Import axios
import { AuthContext } from '../../../context/AuthContext'; // Import AuthContext
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

// FullCalendar styles are now typically handled by the JS itself in v6+
// Remove explicit CSS imports to avoid 'exports is not defined' or 'Missing specifier' errors.
// import '@fullcalendar/react/dist/vite.css'; // This line caused the error

const Calendar = () => {
  const LOCAL_STORAGE_KEY = 'lms_calendar_events';
  const { user } = useContext(AuthContext); // Get user from AuthContext

  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // For editing existing event
  const [selectedDateInfo, setSelectedDateInfo] = useState(null); // For new event creation (date click)

  // Form state for the modal
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [color, setColor] = useState('#2196F3'); // Default blue
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // Don't fetch if no token

        const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/schedule`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data.map(ev => ({
          ...ev,
          start: ev.start ? new Date(ev.start) : null,
          end: ev.end ? new Date(ev.end) : null
        })));
      } catch (err) {
        console.error("Failed to fetch events:", err);
        toast.error("Failed to load events.");
      }
    };

    fetchEvents();
  }, [user]); // Re-fetch when user changes

  // Function to reset form fields
  const resetForm = () => {
    setTitle('');
    setStart('');
    setEnd('');
    setColor('#2196F3');
    setDescription('');
    setLink('');
    setSelectedEvent(null);
    setSelectedDateInfo(null);
  };

  // Open modal for adding/editing event
  const openModal = (event = null, dateInfo = null) => {
    if (event) {
      setSelectedEvent(event);
      setTitle(event.title);
      setStart(event.start ? new Date(event.start).toISOString().slice(0, 16) : '');
      setEnd(event.end ? new Date(event.end).toISOString().slice(0, 16) : '');
      setColor(event.color || '#2196F3');
      // Assuming description and link are in extendedProps for existing events
      setDescription(event.extendedProps?.description || '');
      setLink(event.extendedProps?.link || '');
    } else if (dateInfo) {
      setSelectedDateInfo(dateInfo);
      // Pre-fill date if clicked on calendar
      setStart(dateInfo.dateStr);
      setEnd(dateInfo.dateStr); // For all-day events, start and end are same
      if (dateInfo.allDay === false && dateInfo.startStr) { // If a timed slot is clicked
        setStart(new Date(dateInfo.startStr).toISOString().slice(0, 16));
        setEnd(new Date(dateInfo.endStr || dateInfo.startStr).toISOString().slice(0, 16));
      }
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleAddOrUpdateEvent = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication token not found.");
      return;
    }

    const newEvent = {
      title,
      start: start || selectedDateInfo?.dateStr,
      end: end || start || selectedDateInfo?.dateStr,
      color,
      description, // direct mapping from state
      link,        // direct mapping from state
    };

    try {
      const payload = selectedEvent
        ? { ...newEvent, id: selectedEvent.id } // Include ID for update
        : { ...newEvent }; // No ID for new event

      const res = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/schedule`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const saved = res.data; // Backend should return the saved event
      const formatted = { 
        ...saved, 
        start: saved.start ? new Date(saved.start) : null,
        end: saved.end ? new Date(saved.end) : null
      };

      if (selectedEvent) {
        setEvents(prev =>
          prev.map(ev => ev._id === formatted._id ? formatted : ev)
        );
        toast.success("Event updated successfully!");
      } else {
        setEvents(prev => [...prev, formatted]);
        toast.success("Event added successfully!");
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save event:", err.response ? err.response.data : err.message);
      toast.error("Failed to save event.");
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent && window.confirm('Are you sure you want to delete this event?')) {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/schedule/${selectedEvent._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(prev => prev.filter(ev => ev._id !== selectedEvent._id));
        toast.success("Event deleted successfully!");
        closeModal();
      } catch (err) {
        console.error("Failed to delete event:", err.response ? err.response.data : err.message);
        toast.error("Failed to delete event.");
      }
    }
  };

  const handleDateClick = (arg) => {
    openModal(null, arg);
  };

  const handleEventClick = (arg) => {
    openModal(arg.event);
  };

  const handleEventDrop = (info) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication token not found. Cannot move event.");
      info.revert();
      return;
    }

    if (!(info.event.start instanceof Date) || isNaN(info.event.start.getTime())) {
      toast.error("Invalid start date for event. Cannot move.");
      info.revert();
      return;
    }
    if (info.event.end && (!(info.event.end instanceof Date) || isNaN(info.event.end.getTime()))) {
      toast.error("Invalid end date for event. Cannot move.");
      info.revert();
      return;
    }

    const updatedEvent = {
      _id: info.event._id,
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end ? info.event.end.toISOString() : null,
      color: info.event.backgroundColor,
      description: info.event.extendedProps.description,
      link: info.event.extendedProps.link,
    };

    axios.post(`${import.meta.env.VITE_API_URL || ''}/api/schedule`, updatedEvent, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      toast.success("Event moved successfully!");
      // Update the event in state using the backend's saved data
      setEvents(prev => prev.map(ev => ev._id === res.data._id ? { 
        ...res.data, 
        start: res.data.start ? new Date(res.data.start) : null, 
        end: res.data.end ? new Date(res.data.end) : null 
      } : ev));
    })
    .catch(err => {
      console.error("Failed to move event:", err.response ? err.response.data : err.message);
      toast.error("Failed to move event.");
      info.revert(); // Revert the event on error
    });
  };

  const handleEventResize = (info) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication token not found. Cannot resize event.");
      info.revert();
      return;
    }

    if (!(info.event.start instanceof Date) || isNaN(info.event.start.getTime())) {
      toast.error("Invalid start date for event. Cannot resize.");
      info.revert();
      return;
    }
    if (info.event.end && (!(info.event.end instanceof Date) || isNaN(info.event.end.getTime()))) {
      toast.error("Invalid end date for event. Cannot resize.");
      info.revert();
      return;
    }

    const updatedEvent = {
      _id: info.event._id,
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end ? info.event.end.toISOString() : null,
      color: info.event.backgroundColor,
      description: info.event.extendedProps.description,
      link: info.event.extendedProps.link,
    };

    axios.post(`${import.meta.env.VITE_API_URL || ''}/api/schedule`, updatedEvent, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      toast.success("Event resized successfully!");
      setEvents(prev => prev.map(ev => ev._id === res.data._id ? { 
        ...res.data, 
        start: res.data.start ? new Date(res.data.start) : null, 
        end: res.data.end ? new Date(res.data.end) : null 
      } : ev));
    })
    .catch(err => {
      console.error("Failed to resize event:", err.response ? err.response.data : err.message);
      toast.error("Failed to resize event.");
      info.revert();
    });
  };

  // Filter out previous default events to only use localStorage events
  const calendarEvents = events; 

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <ToastContainer />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-dark">📅 My Learning Calendar</h1>
        
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => openModal()} // Open modal for new event without date pre-selection
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent transition duration-300 flex items-center"
          >
            <span className="text-xl mr-2">➕</span> Add Event
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick} // Add event click handler
            eventDrop={handleEventDrop} // Handle event drag-and-drop
            eventResize={handleEventResize} // Handle event resizing
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay'
            }}
            height="auto"
            editable={true} // Enable dragging/resizing events
            selectable={true} // Enable date range selection
            selectMirror={true}
            dayMaxEvents={true}
          />
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-2xl font-bold mb-4 text-dark">{selectedEvent ? 'Edit Event' : 'Add New Event'}</h2>
          <form onSubmit={handleAddOrUpdateEvent} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="start" className="block text-sm font-medium text-gray-700">Start Time (Optional)</label>
              <input
                type="datetime-local"
                id="start"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="end" className="block text-sm font-medium text-gray-700">End Time (Optional)</label>
              <input
                type="datetime-local"
                id="end"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
              <select
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              >
                <option value="#2196F3">Blue</option>
                <option value="#4CAF50">Green</option>
                <option value="#FF9800">Orange</option>
                <option value="#F44336">Red</option>
                <option value="#9C27B0">Purple</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              ></textarea>
            </div>

            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700">Link (e.g., meeting URL)</label>
              <input
                type="url"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              {selectedEvent && (
                <button
                  type="button"
                  onClick={handleDeleteEvent}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              )}
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-accent transition duration-300"
              >
                {selectedEvent ? 'Update Event' : 'Add Event'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Calendar;
