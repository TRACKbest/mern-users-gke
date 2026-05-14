import { useState, useEffect } from 'react';
import { getAllTimeEntries } from '../services/timeService';
import { getAllEvents } from '../services/eventService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '../services/api';

export default function AdminTimeOverview() {
  const [timeEntries, setTimeEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('time');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (tab === 'time') fetchTimeEntries();
    else fetchEvents();
  }, [selectedUser, tab]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users', { params: { limit: 100 } });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTimeEntries = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (selectedUser) params.userId = selectedUser;
      const res = await getAllTimeEntries(params);
      setTimeEntries(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (selectedUser) params.userId = selectedUser;
      const res = await getAllEvents(params);
      setEvents(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h}h ${m}min`;
    return `${m}min`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Vue d'ensemble - Temps</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center space-x-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Utilisateur</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tous les utilisateurs</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div className="bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setTab('time')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                tab === 'time' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
              }`}
            >
              Temps
            </button>
            <button
              onClick={() => setTab('events')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                tab === 'events' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
              }`}
            >
              Événements
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-8">Chargement...</div>
        ) : tab === 'time' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durée</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {timeEntries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {entry.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {entry.description || 'Sans description'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(entry.startTime), 'dd MMM yyyy HH:mm', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {entry.isRunning ? 'En cours' : formatDuration(entry.duration)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        entry.isRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.isRunning ? 'Actif' : 'Terminé'}
                      </span>
                    </td>
                  </tr>
                ))}
                {timeEntries.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Aucune entrée</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {event.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{event.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{event.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(event.startTime), 'dd MMM yyyy HH:mm', { locale: fr })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.status === 'completed' ? 'bg-green-100 text-green-800' :
                        event.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Aucun événement</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
