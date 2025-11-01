import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth-context';
import { User, FileText } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, login } = useAuth();

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link to="/">
        <div>
          <h1 className="text-2xl font-bold">ICP Review</h1>
          <p className="text-gray-400 text-sm">Easily understand and Review ICP</p>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/proposals"
          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FileText className="w-4 h-4" />
          Proposals
        </Link>
        {isAuthenticated ? (
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
        ) : (
          <button
            onClick={login}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
