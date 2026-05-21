import { useState, useEffect } from 'react';
import { getGradeStats } from '../services/gradeService';

export default function GradeStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ semester: '', academicYear: '' });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.semester) params.semester = filter.semester;
      if (filter.academicYear) params.academicYear = filter.academicYear;
      
      const { data } = await getGradeStats(params);
      setStats(data.data);
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filter]);

  const getAverageColor = (average) => {
    if (average >= 16) return 'text-green-600';
    if (average >= 14) return 'text-blue-600';
    if (average >= 12) return 'text-yellow-600';
    if (average >= 10) return 'text-orange-600';
    return 'text-red-600';
  };

  const getAverageBackground = (average) => {
    if (average >= 16) return 'bg-green-50 border-green-200';
    if (average >= 14) return 'bg-blue-50 border-blue-200';
    if (average >= 12) return 'bg-yellow-50 border-yellow-200';
    if (average >= 10) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Statistiques des Notes</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
            <select
              value={filter.semester}
              onChange={(e) => setFilter({ ...filter, semester: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tous les semestres</option>
              <option value="Semestre 1">Semestre 1</option>
              <option value="Semestre 2">Semestre 2</option>
              <option value="Semestre 3">Semestre 3</option>
              <option value="Semestre 4">Semestre 4</option>
              <option value="Semestre 5">Semestre 5</option>
              <option value="Semestre 6">Semestre 6</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Année académique</label>
            <input
              type="text"
              value={filter.academicYear}
              onChange={(e) => setFilter({ ...filter, academicYear: e.target.value })}
              placeholder="Ex: 2024-2025"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : stats && (
        <div className="space-y-6">
          {/* Overall Average Card */}
          <div className={`border-2 rounded-lg p-8 ${getAverageBackground(stats.average)}`}>
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-600 mb-2">Moyenne Générale</h2>
              <div className={`text-6xl font-bold ${getAverageColor(stats.average)}`}>
                {stats.average}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Basée sur {stats.totalGrades} notes • {stats.semester} • {stats.academicYear}
              </p>
            </div>
          </div>

          {/* Subject Averages */}
          {stats.subjects && stats.subjects.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Moyennes par matière</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.subjects.map((subject, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{subject.name}</h4>
                        <p className="text-sm text-gray-500">{subject.count} notes</p>
                      </div>
                      <div className={`text-2xl font-bold ${getAverageColor(subject.average)}`}>
                        {subject.average.toFixed(2)}
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${subject.average >= 10 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${(subject.average / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grade Distribution Chart */}
          {stats.totalGrades > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Répartition des mentions</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Excellent', range: '16-20', color: 'bg-green-500' },
                  { label: 'Très bien', range: '14-16', color: 'bg-blue-500' },
                  { label: 'Bien', range: '12-14', color: 'bg-yellow-500' },
                  { label: 'Assez bien', range: '10-12', color: 'bg-orange-500' },
                  { label: 'Insuffisant', range: '0-10', color: 'bg-red-500' },
                ].map((item, index) => (
                  <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className={`w-4 h-4 ${item.color} rounded-full mx-auto mb-2`}></div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.range}/20</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}