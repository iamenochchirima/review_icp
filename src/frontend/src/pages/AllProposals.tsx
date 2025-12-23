import { useEffect, useState, useMemo } from 'react';
import { fetchAllProposals } from '../services/proposals';
import type { ProposalInfo } from '../idl/governance/service';
import { Search, Loader2 } from 'lucide-react';
import ProposalCard from '../components/proposals/ProposalCard';
import { proposalTopics } from '../config/proposal-topics';

type StatusFilter = 'all' | 'open' | 'adopted' | 'rejected' | 'executed';
type SortOption = 'newest' | 'ending-soon' | 'most-voted';

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

export default function AllProposals() {
  const [proposals, setProposals] = useState<ProposalInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  useEffect(() => {
    fetchAllProposals()
      .then(initialProposals => {
        setProposals(initialProposals);
        setHasMore(initialProposals.length === 50);
      })
      .catch((err: unknown) => console.error('Failed to fetch proposals:', err))
      .finally(() => setLoading(false));
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const lastProposal = proposals[proposals.length - 1];
      const lastProposalId = lastProposal?.id?.[0]?.id;

      if (lastProposalId) {
        const newProposals = await fetchAllProposals(lastProposalId);
        setProposals(prev => [...prev, ...newProposals]);
        setHasMore(newProposals.length === 50);
      }
    } catch (err) {
      console.error('Failed to load more proposals:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredAndSortedProposals = useMemo(() => {
    let filtered = proposals;

    if (statusFilter !== 'all') {
      const statusMap: Record<StatusFilter, number> = {
        open: 1,
        adopted: 3,
        rejected: 2,
        executed: 4,
        all: 0,
      };
      const status = statusMap[statusFilter];
      filtered = filtered.filter(p => p.status === status);
    }

    if (topicFilter !== 'all') {
      const topicNumber = topicMapping[topicFilter];
      filtered = filtered.filter(p => p.topic === topicNumber);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const title = p.proposal?.[0]?.title?.[0] || '';
        const summary = p.proposal?.[0]?.summary || '';
        return title.toLowerCase().includes(query) || summary.toLowerCase().includes(query);
      });
    }

    const sorted = [...filtered];

    if (sortOption === 'newest') {
      sorted.sort((a, b) => Number(b.proposal_timestamp_seconds) - Number(a.proposal_timestamp_seconds));
    } else if (sortOption === 'ending-soon') {
      sorted.sort((a, b) => {
        const aDeadline = a.deadline_timestamp_seconds?.[0] ? Number(a.deadline_timestamp_seconds[0]) : Infinity;
        const bDeadline = b.deadline_timestamp_seconds?.[0] ? Number(b.deadline_timestamp_seconds[0]) : Infinity;
        return aDeadline - bDeadline;
      });
    } else if (sortOption === 'most-voted') {
      sorted.sort((a, b) => {
        const aTotal = a.latest_tally?.[0] ? Number(a.latest_tally[0].total) : 0;
        const bTotal = b.latest_tally?.[0] ? Number(b.latest_tally[0].total) : 0;
        return bTotal - aTotal;
      });
    }

    return sorted;
  }, [proposals, statusFilter, topicFilter, searchQuery, sortOption]);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">All Proposals</h1>
              <p className="text-gray-400 mt-1">Browse all governance proposals</p>
            </div>
            <div className="bg-gray-900 px-6 py-3 rounded-lg border border-gray-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{filteredAndSortedProposals.length}</div>
                <div className="text-sm text-gray-400">Proposals</div>
              </div>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-700"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
              >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="adopted">Adopted</option>
                <option value="rejected">Rejected</option>
                <option value="executed">Executed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Topic</label>
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
              >
                <option value="all">All Topics</option>
                {proposalTopics.map(topic => (
                  <option key={topic.id} value={topic.id}>{topic.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Sort By</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
              >
                <option value="newest">Newest</option>
                <option value="ending-soon">Ending Soon</option>
                <option value="most-voted">Most Voted</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredAndSortedProposals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No proposals match your filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAndSortedProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id?.[0]?.id.toString() || Math.random()}
                  proposal={proposal}
                />
              ))}
            </div>

            {hasMore && !searchQuery && statusFilter === 'all' && topicFilter === 'all' && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
