import { useState } from 'react';
import { X, Key, ExternalLink, CheckCircle, Copy, Check } from 'lucide-react';

interface AddNeuronModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (neuronId: string) => Promise<void>;
  principalId: string;
}

export default function AddNeuronModal({ isOpen, onClose, onSubmit, principalId }: AddNeuronModalProps) {
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

    if (!neuronId.trim()) {
      setError('Please enter a neuron ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(neuronId);
      setNeuronId('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add neuron');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Visit NNS Dapp',
      description: 'Go to the NNS Dapp and login with your Internet Identity',
      link: 'https://nns.ic0.app',
    },
    {
      number: 2,
      title: 'Select Your Neuron',
      description: 'Navigate to your neurons and select the neuron you want to add',
    },
    {
      number: 3,
      title: 'Add Hotkey',
      description: 'In the neuron settings, add this principal as a hotkey:',
      highlight: principalId,
    },
    {
      number: 4,
      title: 'Enter Neuron ID',
      description: 'Copy your neuron ID and paste it in the field below',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Hot Keyed Neuron</h2>
              <p className="text-gray-400 text-sm">Connect your NNS neuron to vote on proposals</p>
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
              <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-300 font-semibold mb-1">Why add a hotkey?</p>
                <p className="text-blue-200 text-opacity-80">
                  By adding this application's principal as a hotkey to your neuron, you'll be able to vote on
                  governance proposals directly from this app and manage your participation in the NNS ecosystem
                  seamlessly. Your neuron remains secure and you retain full control.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-white font-semibold">Setup Instructions</h3>
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.number}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium">{step.title}</h4>
                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                  {step.highlight && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 p-2 bg-gray-800 rounded font-mono text-xs text-gray-300 break-all">
                        {step.highlight}
                      </div>
                      <button
                        onClick={handleCopyPrincipal}
                        className="p-2 hover:bg-gray-800 rounded transition-colors shrink-0"
                        title="Copy Principal ID"
                        type="button"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white font-medium mb-2">
                Neuron ID
              </label>
              <input
                type="text"
                value={neuronId}
                onChange={(e) => setNeuronId(e.target.value)}
                placeholder="Enter your neuron ID"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                disabled={loading}
              />
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Neuron'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
