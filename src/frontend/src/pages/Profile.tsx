import { useAuth } from '../hooks/auth-context';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

export default function Profile() {
  const { isAuthenticated, identity, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">You need to login to view this page</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const principalId = identity?.getPrincipal().toString() || 'Unknown';

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="bg-gray-900 rounded-lg p-8 max-w-2xl w-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Your Identity</h2>
            <p className="text-gray-400 text-sm">Internet Computer Principal</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 uppercase">Principal ID</label>
            <div className="mt-1 p-3 bg-gray-800 rounded font-mono text-sm break-all">
              {principalId}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 uppercase">Authentication Status</label>
            <div className="mt-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-500">Authenticated</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
