import { useEffect, useMemo, useState } from 'react';
import ProposalTopicCard from '../components/proposals/ProposalTopicCard';
import { proposalTopics } from '../config/proposal-topics';
import { Search, Loader2 } from 'lucide-react';
import { fetchAllOpenProposals } from '../services/proposals';
import type { ProposalTopic } from '../types';
import { useAuth } from '../hooks/auth-context';

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

type ViewFilter = 'all' | 'following' | 'active';

export default function Proposals() {
  const { backendActor, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [topicsWithCounts, setTopicsWithCounts] = useState<ProposalTopic[]>(proposalTopics);
  const [followedTopics, setFollowedTopics] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const proposals = await fetchAllOpenProposals();
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

        if (isAuthenticated && backendActor) {
          const followed = await backendActor.get_followed_topics();
          setFollowedTopics(new Set(followed));
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [backendActor, isAuthenticated]);

  const filteredTopics = useMemo(() => {
    let filtered = topicsWithCounts;

    if (viewFilter === 'following') {
      filtered = filtered.filter(topic => followedTopics.has(topic.id));
    } else if (viewFilter === 'active') {
      filtered = filtered.filter(topic => topic.openProposalsCount > 0);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (topic) =>
          topic.name.toLowerCase().includes(query) ||
          topic.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, topicsWithCounts, viewFilter, followedTopics]);

  const totalOpenProposals = useMemo(
    () => topicsWithCounts.reduce((sum, topic) => sum + topic.openProposalsCount, 0),
    [topicsWithCounts]
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Proposal Topics</h1>
              <p className="text-gray-400 mt-1">
                Follow topics to track proposals
              </p>
            </div>
            <div className="bg-gray-900 px-6 py-3 rounded-lg border border-gray-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{totalOpenProposals}</div>
                <div className="text-sm text-gray-400">Open Proposals</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-lg">
              <button
                onClick={() => setViewFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  viewFilter === 'all' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => setViewFilter('following')}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                    viewFilter === 'following' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Following
                </button>
              )}
              <button
                onClick={() => setViewFilter('active')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  viewFilter === 'active' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Active Only
              </button>
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
                <ProposalTopicCard
                  key={topic.id}
                  topic={topic}
                  initialFollowing={followedTopics.has(topic.id)}
                />
              ))}
            </div>

            {filteredTopics.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No topics found matching your filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
