import { useState } from 'react';
import { X, UserPlus, Key, Info, Copy, Check } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { username?: string; logo_url?: string; neuron_id?: string }) => Promise<void>;
  principalId: string;
}

export default function CreateUserModal({ isOpen, onClose, onSubmit, principalId }: CreateUserModalProps) {
  const [username, setUsername] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [neuronId, setNeuronId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyPrincipal = async () => {
    await navigator.clipboard.writeText(principalId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const data: { username?: string; logo_url?: string; neuron_id?: string } = {};

      if (username.trim()) data.username = username.trim();
      if (logoUrl.trim()) data.logo_url = logoUrl.trim();
      if (neuronId.trim()) data.neuron_id = neuronId.trim();

      await onSubmit(data);
      setUsername('');
      setLogoUrl('');
      setNeuronId('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-lg w-full border border-gray-800">
        <div className="border-b border-gray-800 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 bg-opacity-20 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Welcome! Create Your Account</h2>
              <p className="text-gray-400 text-sm">Complete your profile (all fields are optional)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-900 bg-opacity-20 border border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm flex-1">
                <p className="text-blue-300 font-semibold mb-1">Your Principal ID</p>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-blue-200 text-opacity-80 font-mono text-xs break-all flex-1">
                    {principalId}
                  </p>
                  <button
                    onClick={handleCopyPrincipal}
                    className="p-1.5 hover:bg-blue-800 hover:bg-opacity-30 rounded transition-colors shrink-0"
                    title="Copy Principal ID"
                    type="button"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-blue-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Username <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Logo URL <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Neuron ID <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={neuronId}
                  onChange={(e) => setNeuronId(e.target.value)}
                  placeholder="Enter your neuron ID"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
                <div className="mt-2 flex items-start gap-2 text-xs text-gray-400">
                  <Key className="w-3 h-3 text-yellow-500 shrink-0 mt-0.5" />
                  <p>
                    If adding a neuron ID, make sure to add this principal as a hotkey to your neuron in the{' '}
                    <a
                      href="https://nns.ic0.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      NNS Dapp
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
