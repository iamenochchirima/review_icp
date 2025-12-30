import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { proposalTopics } from '../config/proposal-topics';

const topicGuides: Record<string, {
  commonProposals: string[];
  whatToLookFor: string[];
  redFlags: string[];
  examples: { good: string; bad: string };
}> = {
  'governance': {
    commonProposals: [
      'Changes to voting reward parameters',
      'Modifications to proposal submission requirements',
      'Updates to neuron management rules',
      'Changes to following mechanisms'
    ],
    whatToLookFor: [
      'Impact on voting power distribution',
      'Effects on small vs large neuron holders',
      'Alignment with decentralization goals',
      'Clarity of the proposed changes'
    ],
    redFlags: [
      'Proposals that concentrate power',
      'Rushed voting timelines',
      'Lack of community discussion',
      'Unclear economic implications'
    ],
    examples: {
      good: 'Well-documented proposal with clear rationale, community discussion, and impact analysis',
      bad: 'Vague proposal with unclear benefits and no community input'
    }
  },
  'network-economics': {
    commonProposals: [
      'ICP/XDR exchange rate updates',
      'Changes to neuron rewards',
      'Transaction fee adjustments',
      'Token burning mechanisms'
    ],
    whatToLookFor: [
      'Economic model soundness',
      'Impact on token holders',
      'Long-term sustainability',
      'Fair distribution of benefits'
    ],
    redFlags: [
      'Extreme parameter changes',
      'Lack of economic analysis',
      'Proposals benefiting specific groups',
      'Insufficient testing or modeling'
    ],
    examples: {
      good: 'Proposal with detailed economic modeling and gradual parameter adjustments',
      bad: 'Sudden large changes without analysis or justification'
    }
  },
  'subnet-management': {
    commonProposals: [
      'Creating new subnets',
      'Adding nodes to subnets',
      'Removing faulty nodes',
      'Subnet configuration changes'
    ],
    whatToLookFor: [
      'Technical justification for changes',
      'Impact on network topology',
      'Node provider reputation',
      'Geographic distribution'
    ],
    redFlags: [
      'Insufficient node verification',
      'Centralization risks',
      'Unclear technical specifications',
      'Rushed deployments'
    ],
    examples: {
      good: 'Detailed technical specifications with verified node providers',
      bad: 'Vague subnet changes without proper node verification'
    }
  }
};

export default function LearnTopic() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const topic = proposalTopics.find(t => t.id === topicId);
  const guide = topicId ? topicGuides[topicId] : null;

  if (!topic) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Topic not found</p>
          <Link
            to="/learn"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white inline-block"
          >
            Back to Learn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/learn')}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learn
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{topic.icon}</span>
            <h1 className="text-4xl font-bold text-white">{topic.name}</h1>
          </div>
          <p className="text-xl text-gray-400">{topic.description}</p>
        </div>

        {guide ? (
          <>
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Common Proposal Types</h2>
              <ul className="space-y-2">
                {guide.commonProposals.map((proposal, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{proposal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <h2 className="text-2xl font-bold text-white">What to Look For</h2>
              </div>
              <ul className="space-y-2">
                {guide.whatToLookFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <h2 className="text-2xl font-bold text-white">Red Flags</h2>
              </div>
              <ul className="space-y-2">
                {guide.redFlags.map((flag, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-red-400 mt-1">⚠</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900 rounded-lg border border-green-900 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-white">Good Example</h3>
                </div>
                <p className="text-gray-300 text-sm">{guide.examples.good}</p>
              </div>

              <div className="bg-gray-900 rounded-lg border border-red-900 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-white">Bad Example</h3>
                </div>
                <p className="text-gray-300 text-sm">{guide.examples.bad}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <p className="text-gray-400 text-center">
              Detailed guide for this topic is coming soon. In the meantime, review the general guidelines on the main Learn page.
            </p>
          </div>
        )}

        <div className="bg-blue-900/20 rounded-lg border border-blue-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Ready to Review?</h3>
          <p className="text-gray-300 mb-4">
            Now that you understand {topic.name} proposals, you can start reviewing active proposals in this topic.
          </p>
          <Link
            to={`/proposals/${topic.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
          >
            View {topic.name} Proposals
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
