import { useState, useEffect, useCallback } from 'react';
import CalendarView from '../components/agenda/CalendarView';
import EventModal from '../components/agenda/EventModal';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Agenda() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('calendar');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [message, setMessage] = useState('');

  const fetchEvents = useCallback(async () => {
    try {
      const res = await getEvents({ limit: 200 });
      setEvents(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDateClick = (dateStr) => {
    setSelectedEvent(null);
    setSelectedDate(dateStr);
    setModalOpen(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedEvent) {
        await updateEvent(selectedEvent._id, data);
        setMessage('Événement modifié');
      } else {
        await createEvent(data);
        setMessage('Événement créé');
      }
      setModalOpen(false);
      setSelectedEvent(null);
      fetchEvents();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet événement ?')) return;
    try {
      await deleteEvent(id);
      setMessage('Événement supprimé');
      fetchEvents();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  const CATEGORY_LABELS = {
    meeting: 'Réunion',
    task: 'Tâche',
    reminder: 'Rappel',
    personal: 'Personnel',
    other: 'Autre',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
          <div className="flex items-center space-x-3">
            <div className="bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  view === 'calendar' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                }`}
              >
                Calendrier
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  view === 'list' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                }`}
              >
                Liste
              </button>
            </div>
            <button
              onClick={() => { setSelectedEvent(null); setSelectedDate(null); setModalOpen(true); }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              + Nouvel événement
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{message}</div>
        )}

        {view === 'calendar' ? (
          <CalendarView
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        ) : (
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
            {events.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Aucun événement</div>
            ) : (
              events.map((event) => (
                <div key={event._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(event.startTime), 'dd MMM yyyy HH:mm', { locale: fr })}
                        {' - '}
                        {format(new Date(event.endTime), 'HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500">{CATEGORY_LABELS[event.category]}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLORS[event.status]}`}>
                      {event.status}
                    </span>
                    <button
                      onClick={() => handleEventClick(event)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <EventModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setSelectedEvent(null); }}
          onSave={handleSave}
          event={selectedEvent}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
}
