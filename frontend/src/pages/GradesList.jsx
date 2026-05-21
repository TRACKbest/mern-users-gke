import { useState, useEffect } from 'react';
import { getGrades, deleteGrade } from '../services/gradeService';

export default function GradesList() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ semester: '', academicYear: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.semester) params.semester = filter.semester;
      if (filter.academicYear) params.academicYear = filter.academicYear;
      
      const { data } = await getGrades(params);
      setGrades(data.data);
    } catch (err) {
      setError('Failed to load grades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this grade?')) return;
    
    try {
      await deleteGrade(id);
      setGrades(grades.filter(grade => grade._id !== id));
    } catch (err) {
      setError('Failed to delete grade');
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 16) return 'bg-green-100 text-green-800';
    if (grade >= 14) return 'bg-blue-100 text-blue-800';
    if (grade >= 12) return 'bg-yellow-100 text-yellow-800';
    if (grade >= 10) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mes Notes</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
        >
          {showAddForm ? 'Fermer' : '+ Ajouter une note'}
        </button>
      </div>

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

      {showAddForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter une note</h2>
          <AddGradeForm onGradeAdded={fetchGrades} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      {/* Grades List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : grades.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500">Aucune note trouvée</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coeff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semestre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grades.map((grade) => (
                <tr key={grade._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{grade.subject}</div>
                    {grade.teacher && <div className="text-sm text-gray-500">{grade.teacher}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getGradeColor(grade.grade)}`}>
                      {grade.grade}/20
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grade.coefficient}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {grade.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grade.semester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grade.academicYear}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(grade._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AddGradeForm({ onGradeAdded, onCancel }) {
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    coefficient: 1,
    semester: 'Semestre 1',
    academicYear: '2024-2025',
    category: 'devoir',
    teacher: '',
    comments: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { createGrade } = await import('../services/gradeService');
      await createGrade({
        ...formData,
        grade: parseFloat(formData.grade)
      });
      onGradeAdded();
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Failed to add grade');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Matière *</label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Note (0-20) *</label>
          <input
            type="number"
            required
            min="0"
            max="20"
            step="0.5"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Coefficient</label>
          <input
            type="number"
            min="1"
            value={formData.coefficient}
            onChange={(e) => setFormData({ ...formData, coefficient: parseInt(e.target.value) })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Catégorie</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="devoir">Devoir</option>
            <option value="examen">Examen</option>
            <option value="partiel">Partiel</option>
            <option value="tp">TP</option>
            <option value="projet">Projet</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Semestre *</label>
          <select
            required
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Semestre 1">Semestre 1</option>
            <option value="Semestre 2">Semestre 2</option>
            <option value="Semestre 3">Semestre 3</option>
            <option value="Semestre 4">Semestre 4</option>
            <option value="Semestre 5">Semestre 5</option>
            <option value="Semestre 6">Semestre 6</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Année académique *</label>
          <input
            type="text"
            required
            value={formData.academicYear}
            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Professeur</label>
          <input
            type="text"
            value={formData.teacher}
            onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Commentaires</label>
        <textarea
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          rows="2"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div className="flex space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
        >
          Ajouter
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}