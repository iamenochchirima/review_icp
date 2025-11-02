import { useEffect, useMemo, useState } from 'react';
import ProposalTopicCard from '../components/proposals/ProposalTopicCard';
import { proposalTopics } from '../config/proposal-topics';
import { Search, Loader2 } from 'lucide-react';
import { fetchAllOpenProposals } from '../services/proposals';
import type { ProposalTopic } from '../types';

const topicMapping: Record<string, number> = {
  'neuron-management': 1,
  'exchange-rate': 2,
  'network-economics': 3,
  'governance': 4,
  'node-admin': 5,
  'participant-management': 6,
  'subnet-management': 7,
  'application-canister': 8,
  'kyc': 9,
  'node-provider-rewards': 10,
  'ic-os-deployment': 12,
  'ic-os-election': 13,
  'sns-neurons-fund': 14,
  'api-boundary-node': 15,
  'subnet-rental': 16,
  'protocol-canister': 17,
  'service-nervous-system': 18,
};

export default function Proposals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [topicsWithCounts, setTopicsWithCounts] = useState<ProposalTopic[]>(proposalTopics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOpenProposals()
      .then((proposals) => {
        const topicCounts = new Map<number, number>();

        proposals.forEach((proposal) => {
          const count = topicCounts.get(proposal.topic) || 0;
          topicCounts.set(proposal.topic, count + 1);
        });

        const updatedTopics = proposalTopics.map((topic) => {
          const topicNumber = topicMapping[topic.id];
          const count = topicCounts.get(topicNumber) || 0;
          return { ...topic, openProposalsCount: count };
        });

        setTopicsWithCounts(updatedTopics);
      })
      .catch((err) => console.error('Failed to fetch proposals:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredTopics = useMemo(() => {
    if (!searchQuery) return topicsWithCounts;

    const query = searchQuery.toLowerCase();
    return topicsWithCounts.filter(
      (topic) =>
        topic.name.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query)
    );
  }, [searchQuery, topicsWithCounts]);

  const totalOpenProposals = useMemo(
    () => topicsWithCounts.reduce((sum, topic) => sum + topic.openProposalsCount, 0),
    [topicsWithCounts]
  );

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Proposal Topics</h1>
              <p className="text-gray-400 mt-1">
                Follow topics and get notified about new proposals
              </p>
            </div>
            <div className="bg-gray-900 px-6 py-3 rounded-lg border border-gray-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{totalOpenProposals}</div>
                <div className="text-sm text-gray-400">Open Proposals</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-700"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTopics.map((topic) => (
                <ProposalTopicCard key={topic.id} topic={topic} />
              ))}
            </div>

            {filteredTopics.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No topics found matching your search</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
