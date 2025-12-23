import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth-context';
import { User, FileText, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import CreateUserModal from '../auth/CreateUserModal';

export default function Navbar() {
  const { isAuthenticated, login, backendActor, identity } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkingUser, setCheckingUser] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      if (isAuthenticated && backendActor && !checkingUser) {
        setCheckingUser(true);
        try {
          const userData = await backendActor.get_current_user();
          if (!userData || userData.length === 0 || !userData[0]) {
            setIsModalOpen(true);
          }
        } catch (error) {
          console.error('Error checking user:', error);
        } finally {
          setCheckingUser(false);
        }
      }
    };

    checkUser();
  }, [isAuthenticated, backendActor]);

  const handleCreateUser = async (data: { username?: string; logo_url?: string; neuron_id?: string }) => {
    if (!backendActor) {
      throw new Error('Backend actor not initialized');
    }

    const args = {
      username: (data.username ? [data.username] : []) as [] | [string],
      logo_url: (data.logo_url ? [data.logo_url] : []) as [] | [string],
      neuron_id: (data.neuron_id ? [BigInt(data.neuron_id)] : []) as [] | [bigint],
    };

    const result = await backendActor.create_user(args);
    if ('Err' in result) {
      throw new Error(result.Err);
    }
  };

  const principalId = identity?.getPrincipal().toString() || '';

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
          <>
            <button className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
          </>
        ) : (
          <button
            onClick={login}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Login
          </button>
        )}
      </div>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUser}
        principalId={principalId}
      />
    </header>
  );
}
