import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold text-green-600">
              Grade Management
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-green-600 text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/grades" className="text-gray-700 hover:text-green-600 text-sm font-medium">
              Grades
            </Link>
            <Link to="/agenda" className="text-gray-700 hover:text-green-600 text-sm font-medium">
              Agenda
            </Link>
            {user.role === 'admin' && (
              <>
                <Link to="/admin" className="text-gray-700 hover:text-green-600 text-sm font-medium">
                  Admin Panel
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.name}</span>
            <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-green-50 text-green-700'}`}>
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
