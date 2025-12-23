import { useAuth } from '../hooks/auth-context';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Layers, Bell, Copy, Check, Key, Trash2, X as XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import QuickActionCard from '../components/dashboard/QuickActionCard';
import AddNeuronModal from '../components/dashboard/AddNeuronModal';
import { User as UserType } from '../../../declarations/backend/backend.did';

export default function Profile() {
  const { isAuthenticated, identity, logout, backendActor } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRemoveNeuronModalOpen, setIsRemoveNeuronModalOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  console.log({user})

  useEffect(() => {
    if (isAuthenticated && backendActor) {
      backendActor.get_current_user()
        .then((userData) => {
          setUser(userData[0] || null);
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, backendActor]);

  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  const handleCopyPrincipal = async () => {
    await navigator.clipboard.writeText(principalId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddNeuron = async (neuronId: string) => {
    if (!backendActor) {
      throw new Error('Backend actor not initialized');
    }

    try {
      const result = await backendActor.add_neuron_id_to_user(BigInt(neuronId));
      if ('Ok' in result) {
        const userData = await backendActor.get_current_user();
        setUser(userData[0] || null);
      } else if ('Err' in result) {
        throw new Error(result.Err);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleRemoveNeuron = async () => {
    if (!backendActor || !user) return;

    try {
      const args = {
        username: user.username || ([] as [] | [string]),
        logo_url: user.logo_url || ([] as [] | [string]),
        neuron_id: [] as [] | [bigint],
      };

      const result = await backendActor.update_user(args);
      if ('Ok' in result) {
        const userData = await backendActor.get_current_user();
        setUser(userData[0] || null);
        setIsRemoveNeuronModalOpen(false);
      } else if ('Err' in result) {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error('Error removing neuron:', error);
      throw error;
    }
  };

  const handleDeleteAccount = async () => {
    if (!backendActor) return;

    try {
      await backendActor.delete_user();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
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
    <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 mt-1">NNS Governance Overview</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">Your Identity</h2>

                <div className="mt-2 space-y-2">
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Principal ID</label>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-300 text-sm font-mono break-all">{principalId}</p>
                      <button
                        onClick={handleCopyPrincipal}
                        className="p-1.5 hover:bg-gray-800 rounded transition-colors shrink-0"
                        title="Copy Principal ID"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 uppercase">Username</label>
                    <p className="text-gray-300 text-sm">
                      {user?.username && user.username.length > 0 ? user.username[0] : (
                        <span className="text-gray-500 italic">Not set</span>
                      )}
                    </p>
                  </div>

                  {user?.neuron_id && user.neuron_id.length > 0 && user.neuron_id[0] !== undefined && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Neuron ID</label>
                      <div className="flex items-center gap-2">
                        <Key className="w-3.5 h-3.5 text-green-500" />
                        <p className="text-green-500 font-mono text-sm">{user.neuron_id[0].toString()}</p>
                        <button
                          onClick={() => setIsRemoveNeuronModalOpen(true)}
                          className="p-1 hover:bg-red-900 hover:bg-opacity rounded transition-colors"
                          title="Remove Neuron ID"
                        >
                          <XIcon className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {(!user?.neuron_id || user.neuron_id.length === 0) && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                  >
                    <Key className="w-4 h-4" />
                    Add Neuron
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionCard
              title="Explore Architecture"
              description="Visualize ICP codebase structure"
              icon={Layers}
              href="/"
              color="text-purple-500"
            />
            <QuickActionCard
              title="Track Proposals"
              description="Follow governance proposals and vote"
              icon={Bell}
              href="/proposals"
              color="text-green-500"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Danger Zone</h3>
              <p className="text-gray-500 text-xs mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-20 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Account
            </button>
          </div>
        </div>

        <AddNeuronModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddNeuron}
          principalId={principalId}
        />

        {/* Remove Neuron Confirmation Modal */}
        {isRemoveNeuronModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg max-w-md w-full border border-gray-800">
              <div className="border-b border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white">Remove Neuron ID</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-6">
                  Are you sure you want to remove your neuron ID? You won't be able to vote on proposals until you add it again.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsRemoveNeuronModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRemoveNeuron}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg max-w-md w-full border border-red-800">
              <div className="border-b border-red-800 p-6">
                <h2 className="text-xl font-bold text-red-400">Delete Account</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-4">
                  Are you sure you want to delete your account? This action is permanent and cannot be undone.
                </p>
                <p className="text-red-400 text-sm mb-6">
                  All your data, including your username, logo, and neuron ID will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Forever
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
