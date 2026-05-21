import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const { data } = await api.put('/users/me', { name, email });
      updateUser(data);
      setEditing(false);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">My Profile</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
            >
              Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Name:</span>
              <p className="text-gray-900">{user?.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Role:</span>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                {user?.role === 'student' ? 'Étudiant' : user?.role}
              </span>
            </div>
            {user?.studentId && (
              <div>
                <span className="text-sm font-medium text-gray-500">Numéro étudiant:</span>
                <p className="text-gray-900">{user.studentId}</p>
              </div>
            )}
            {user?.major && (
              <div>
                <span className="text-sm font-medium text-gray-500">Filière:</span>
                <p className="text-gray-900">{user.major}</p>
              </div>
            )}
            {user?.academicYear && (
              <div>
                <span className="text-sm font-medium text-gray-500">Année académique:</span>
                <p className="text-gray-900">{user.academicYear}</p>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-500">Member since:</span>
              <p className="text-gray-900">{new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
