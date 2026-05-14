import { useState, useEffect } from 'react';
import { getTimeSummary } from '../../services/timeService';

export default function TimeSummary() {
  const [summary, setSummary] = useState(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [period]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await getTimeSummary(period);
      setSummary(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Chargement...
      </div>
    );
  }

  const maxMinutes = summary?.days?.length
    ? Math.max(...summary.days.map((d) => d.totalMinutes))
    : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Résumé</h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
        >
          <option value="week">7 jours</option>
          <option value="month">30 jours</option>
        </select>
      </div>

      {summary && (
        <>
          <div className="text-center mb-4">
            <span className="text-3xl font-bold text-indigo-600">{summary.totalHours}h</span>
            <p className="text-sm text-gray-500">Total travaillé</p>
          </div>

          <div className="space-y-2">
            {summary.days.map((day) => (
              <div key={day._id} className="flex items-center space-x-3">
                <span className="text-xs text-gray-500 w-20">{day._id.slice(5)}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-indigo-500 rounded-full h-4 transition-all"
                    style={{ width: maxMinutes > 0 ? `${(day.totalMinutes / maxMinutes) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-12 text-right">
                  {Math.round(day.totalMinutes / 60 * 10) / 10}h
                </span>
              </div>
            ))}
          </div>

          {(!summary.days || summary.days.length === 0) && (
            <p className="text-center text-gray-500 text-sm">Aucune donnée pour cette période</p>
          )}
        </>
      )}
    </div>
  );
}
