import React, { useState, useEffect, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from '../student/Modal.jsx';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// FullCalendar styles (removed explicit imports as they are handled by JS injection in v6+)
// import '@fullcalendar/common/main.css';
// import '@fullcalendar/daygrid/main.css';
// import '@fullcalendar/react/main.css';

// Utility function to format date for datetime-local input
const formatDateTimeLocal = (date) => {
  if (!date) return '';
  const d = new Date(date);
  // Ensure it's a valid date before formatting
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
};

const EducatorCalendar = ({ isModalOpen, setIsModalOpen }) => {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);

  // Form state for the modal
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [color, setColor] = useState('#2196F3'); // Default blue
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [meetingPlatform, setMeetingPlatform] = useState('');
  const [isSaving, setIsSaving] = useState(false); // New state for loading indicator

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/schedule`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Fetched events from backend:", res.data); // Debug log
        setEvents(res.data.map(ev => ({
          ...ev,
          start: ev.start ? new Date(ev.start) : null,
          end: ev.end ? new Date(ev.end) : null
        })));
        console.log("Events state after fetch and format:", events); // Debug log
      } catch (err) {
        console.error("Failed to fetch events:", err);
        toast.error("Failed to load events.");
      }
    };

    if (user) {
        fetchEvents();
    }
  }, [user]);

  const resetForm = () => {
    setTitle('');
    setStart('');
    setEnd('');
    setColor('#2196F3');
    setDescription('');
    setLink('');
    setMeetingPlatform('');
    setSelectedEvent(null);
    setSelectedDateInfo(null);
    setIsModalOpen(false);
  };

  const openModal = (event = null, dateInfo = null) => {
    if (event) {
      setSelectedEvent(event);
      setTitle(event.title);
      setStart(formatDateTimeLocal(event.start));
      setEnd(formatDateTimeLocal(event.end));
      setColor(event.color || '#2196F3');
      setDescription(event.extendedProps?.description || '');
      setLink(event.extendedProps?.link || '');
      setMeetingPlatform(event.extendedProps?.meetingPlatform || '');
    } else if (dateInfo) {
      setSelectedDateInfo(dateInfo);
      setStart(formatDateTimeLocal(dateInfo.dateStr));
      setEnd(formatDateTimeLocal(dateInfo.dateStr));
      if (dateInfo.allDay === false && dateInfo.startStr) {
        setStart(formatDateTimeLocal(dateInfo.startStr));
        setEnd(formatDateTimeLocal(dateInfo.endStr || dateInfo.startStr));
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

    setIsSaving(true);

    const startDateTime = start ? new Date(start) : null;
    const endDateTime = end ? new Date(end) : null;

    if (!title || !startDateTime || !endDateTime) {
        toast.error("Please fill in all required fields (Title, Start Time, End Time).");
        return;
    }

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        toast.error('Invalid date format. Please use the date and time pickers.');
        return;
    }

    if (endDateTime < startDateTime) {
        toast.error('End time cannot be before start time.');
        return;
    }


    const payload = {
      title,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      color,
      description,
      link,
      meetingPlatform,
    };

    console.log("Payload being sent to backend:", payload); // Debug log

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/schedule`,
        selectedEvent ? { ...payload, id: selectedEvent._id } : payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const saved = res.data;
      console.log("Event saved response from backend:", saved); // Debug log
      const formatted = {
        ...saved,
        id: saved._id, // Add id for FullCalendar
        start: saved.start ? new Date(saved.start) : null,
        end: saved.end ? new Date(saved.end) : null
      };

      if (selectedEvent) {
        setEvents(prev =>
          prev.map(ev => (ev._id === formatted._id ? formatted : ev))
        );
        toast.success("Event updated successfully!");
      } else {
        setEvents(prev => [...prev, formatted]);
        toast.success("Event added successfully!");
      }
      console.log("Events state after update/add:", events); // Debug log
      closeModal();
    } catch (err) {
      console.error("Failed to save event:", err.response ? err.response.data : err.message);
      toast.error("Failed to save event.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent && window.confirm('Are you sure you want to delete this event?')) {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }
      // console.log("Attempting to delete event with selectedEvent:", selectedEvent); // Debug log

      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/schedule/${selectedEvent.id}`, {
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
    console.log("FullCalendar event clicked:", arg.event); // Debug log
    openModal(arg.event);
  };

  const handleEventDrop = (info) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication token not found. Cannot move event.");
      info.revert();
      return;
    }

    const updatedEvent = {
      _id: info.event.id,
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end ? info.event.end.toISOString() : null,
      color: info.event.backgroundColor,
      description: info.event.extendedProps.description,
      link: info.event.extendedProps.link,
      meetingPlatform: info.event.extendedProps.meetingPlatform,
    };

    axios.post(`${import.meta.env.VITE_API_URL || ''}/api/schedule`, updatedEvent, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      toast.success("Event moved successfully!");
      setEvents(prev => prev.map(ev => ev._id === res.data._id ? {
        ...res.data,
        id: res.data._id,
        start: res.data.start ? new Date(res.data.start) : null,
        end: res.data.end ? new Date(res.data.end) : null
      } : ev));
    })
    .catch(err => {
      console.error("Failed to move event:", err.response ? err.response.data : err.message);
      toast.error("Failed to move event.");
      info.revert();
    });
  };

  const handleEventResize = (info) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication token not found. Cannot resize event.");
      info.revert();
      return;
    }

    const updatedEvent = {
      _id: info.event.id,
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end ? info.event.end.toISOString() : null,
      color: info.event.backgroundColor,
      description: info.event.extendedProps.description,
      link: info.event.extendedProps.link,
      meetingPlatform: info.event.extendedProps.meetingPlatform,
    };

    axios.post(`${import.meta.env.VITE_API_URL || ''}/api/schedule`, updatedEvent, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      toast.success("Event resized successfully!");
      setEvents(prev => prev.map(ev => ev._id === res.data._id ? {
        ...res.data,
        id: res.data._id,
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

  return (
    <div className="w-full">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        // Custom event rendering for colors (optional, if you want dynamic colors in FullCalendar)
        eventContent={(arg) => {
          return (
            <div
              className="fc-event-main-content"
              style={{
                backgroundColor: arg.event.backgroundColor || arg.backgroundColor,
                color: arg.textColor || 'white',
                borderRadius: '4px',
                padding: '2px 4px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                height: '100%',
              }}
            >
              {arg.timeText && <strong>{arg.timeText}</strong>}
              <p>{arg.event.title}</p>
            </div>
          );
        }}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedEvent ? 'Edit Event' : 'Add New Event'}>
        <form onSubmit={handleAddOrUpdateEvent} className="space-y-4">
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label htmlFor="start" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Start Time</label>
              <input
                type="datetime-local"
                id="start"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label htmlFor="end" className="block text-sm font-medium text-gray-700 dark:text-gray-200">End Time</label>
              <input
                type="datetime-local"
                id="end"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                required
              />
            </div>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer py-2 font-medium text-gray-700 dark:text-gray-200">
                Optional Details
                <span className="transition-transform duration-200 group-open:rotate-180">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </summary>
              <div className="space-y-4 pt-2">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Meeting Link</label>
                  <input
                    type="url"
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    placeholder="e.g., https://meet.google.com/xyz"
                  />
                </div>
                <div>
                  <label htmlFor="meetingPlatform" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Meeting Platform</label>
                  <input
                    type="text"
                    id="meetingPlatform"
                    value={meetingPlatform}
                    onChange={(e) => setMeetingPlatform(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    placeholder="e.g., Google Meet, Zoom, Microsoft Teams"
                  />
                </div>
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Event Color</label>
                  <select
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                  >
                    <option value="#2196F3">Blue</option>
                    <option value="#4CAF50">Green</option>
                    <option value="#F44336">Red</option>
                    <option value="#9C27B0">Purple</option>
                    <option value="#FFEB3B">Yellow</option>
                  </select>
                </div>
              </div>
            </details>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            {selectedEvent && (
              <button
                type="button"
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={isSaving} // Disable button during saving
            >
              {isSaving ? (selectedEvent ? 'Updating...' : 'Adding...') : (selectedEvent ? 'Update Event' : 'Add Event')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EducatorCalendar; 