import { useState, useEffect, useRef } from 'react';
import { startTimer as apiStartTimer, stopTimer as apiStopTimer, getActiveTimer } from '../../services/timeService';

export default function Timer({ onTimerStop }) {
  const [activeTimer, setActiveTimer] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchActiveTimer();
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (activeTimer) {
      intervalRef.current = setInterval(() => {
        const start = new Date(activeTimer.startTime).getTime();
        setElapsed(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      setElapsed(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [activeTimer]);

  const fetchActiveTimer = async () => {
    try {
      const res = await getActiveTimer();
      setActiveTimer(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await apiStartTimer({ description });
      setActiveTimer(res.data.data);
      setDescription('');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors du démarrage');
    }
    setLoading(false);
  };

  const handleStop = async () => {
    if (!activeTimer) return;
    setLoading(true);
    try {
      await apiStopTimer(activeTimer._id);
      setActiveTimer(null);
      if (onTimerStop) onTimerStop();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'arrêt');
    }
    setLoading(false);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Chronomètre</h3>

      <div className="text-center mb-4">
        <div className={`text-4xl font-mono font-bold ${activeTimer ? 'text-green-600' : 'text-gray-400'}`}>
          {formatTime(elapsed)}
        </div>
        {activeTimer && activeTimer.description && (
          <p className="text-sm text-gray-500 mt-2">{activeTimer.description}</p>
        )}
      </div>

      {!activeTimer ? (
        <div className="space-y-3">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Sur quoi travaillez-vous ?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            Démarrer
          </button>
        </div>
      ) : (
        <button
          onClick={handleStop}
          disabled={loading}
          className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
        >
          Arrêter
        </button>
      )}
    </div>
  );
}
