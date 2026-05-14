import { useState, useEffect, useCallback } from 'react';
import Timer from '../components/agenda/Timer';
import TimeEntryList from '../components/agenda/TimeEntryList';
import ManualTimeForm from '../components/agenda/ManualTimeForm';
import TimeSummary from '../components/agenda/TimeSummary';
import { getTimeEntries, deleteTimeEntry } from '../services/timeService';

export default function TimeTracking() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await getTimeEntries({ limit: 30 });
      setEntries(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette entrée ?')) return;
    try {
      await deleteTimeEntry(id);
      handleRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Suivi du temps</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Timer + Manual form */}
          <div className="space-y-6">
            <Timer onTimerStop={handleRefresh} />
            <ManualTimeForm onEntryCreated={handleRefresh} />
          </div>

          {/* Center column: Time entries list */}
          <div className="lg:col-span-1">
            {loading ? (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                Chargement...
              </div>
            ) : (
              <TimeEntryList entries={entries} onDelete={handleDelete} />
            )}
          </div>

          {/* Right column: Summary */}
          <div>
            <TimeSummary key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}
