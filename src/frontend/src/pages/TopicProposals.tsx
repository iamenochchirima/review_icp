import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProposalCard from '../components/proposals/ProposalCard';
import { fetchProposalsByTopic } from '../services/proposals';
import { proposalTopics } from '../config/proposal-topics';
import type { ProposalInfo } from '../idl/governance/service';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function TopicProposals() {
  const { topicId } = useParams<{ topicId: string }>();
  const [proposals, setProposals] = useState<ProposalInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const topic = proposalTopics.find((t) => t.id === topicId);

  useEffect(() => {
    if (topicId) {
      setLoading(true);
      fetchProposalsByTopic(topicId)
        .then(setProposals)
        .finally(() => setLoading(false));
    }
  }, [topicId]);

  if (!topic) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Topic not found</p>
          <Link
            to="/proposals"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Back to Topics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            to="/proposals"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Topics
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{topic.name}</h1>
              <p className="text-gray-400 mt-1">{topic.description}</p>
            </div>
            <div className="bg-gray-900 px-6 py-3 rounded-lg border border-gray-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{proposals.length}</div>
                <div className="text-sm text-gray-400">Open Proposals</div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : proposals.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id?.[0]?.id.toString() || Math.random()}
                proposal={proposal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No open proposals for this topic</p>
          </div>
        )}
      </div>
    </div>
  );
}
