import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/auth-context';
import { proposalTopics } from '../config/proposal-topics';
import { fetchAllProposalsByTopic } from '../services/proposals';
import type { ProposalInfo } from '../idl/governance/service';
import { Loader2, Settings } from 'lucide-react';
import ProposalCard from '../components/proposals/ProposalCard';

type FilterType = 'all' | 'active' | 'ending-soon' | 'past';

export default function Following() {
  const { backendActor, isAuthenticated } = useAuth();
  const [followedTopics, setFollowedTopics] = useState<string[]>([]);
  const [proposalsByTopic, setProposalsByTopic] = useState<Map<string, ProposalInfo[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('active');

  useEffect(() => {
    if (!isAuthenticated || !backendActor) {
      setLoading(false);
      return;
    }

    const loadFollowedTopics = async () => {
      try {
        const topics = await backendActor.get_followed_topics();
        setFollowedTopics(topics);

        const proposalsMap = new Map<string, ProposalInfo[]>();
        for (const topicId of topics) {
          const proposals = await fetchAllProposalsByTopic(topicId);
          proposalsMap.set(topicId, proposals);
        }

        setProposalsByTopic(proposalsMap);
      } catch (error) {
        console.error('Error loading followed topics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFollowedTopics();
  }, [backendActor, isAuthenticated]);

  const filteredProposalsByTopic = useMemo(() => {
    const result = new Map<string, ProposalInfo[]>();
    const now = Date.now() / 1000;

    proposalsByTopic.forEach((proposals, topicId) => {
      let filtered = proposals;

      if (filter === 'active') {
        filtered = proposals.filter(p => p.status === 1);
      } else if (filter === 'ending-soon') {
        filtered = proposals.filter(p => {
          if (p.status !== 1) return false;
          const deadline = p.deadline_timestamp_seconds?.[0];
          if (!deadline) return false;
          const timeLeft = Number(deadline) - now;
          return timeLeft > 0 && timeLeft < 48 * 60 * 60;
        });
      } else if (filter === 'past') {
        filtered = proposals.filter(p => p.status !== 1);
      }

      if (filtered.length > 0) {
        result.set(topicId, filtered);
      }
    });

    return result;
  }, [proposalsByTopic, filter]);

  const totalProposals = useMemo(() => {
    let count = 0;
    filteredProposalsByTopic.forEach(proposals => count += proposals.length);
    return count;
  }, [filteredProposalsByTopic]);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
          <p className="text-gray-400 mb-6">Login to follow topics and track proposals</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (followedTopics.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">No Topics Followed</h2>
          <p className="text-gray-400 mb-6">Follow topics to see proposals here</p>
          <Link
            to="/proposals"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-block"
          >
            Browse Topics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Following</h1>
            <p className="text-gray-400 mt-1">
              Proposals from your {followedTopics.length} followed topics
            </p>
          </div>
          <Link
            to="/proposals"
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            Manage Topics
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-6 bg-gray-900 p-1 rounded-lg w-fit">
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'active' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('ending-soon')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'ending-soon' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Ending Soon
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'past' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Past
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
        </div>

        {totalProposals === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No proposals match your filter</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Array.from(filteredProposalsByTopic.entries()).map(([topicId, proposals]) => {
              const topic = proposalTopics.find(t => t.id === topicId);
              if (!topic) return null;

              return (
                <div key={topicId} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <Link to={`/proposals/${topicId}`} className="hover:text-blue-400 transition-colors">
                      <h2 className="text-xl font-bold text-white">{topic.name}</h2>
                    </Link>
                    <span className="text-sm text-gray-400">{proposals.length} proposals</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {proposals.map((proposal) => (
                      <ProposalCard
                        key={proposal.id?.[0]?.id.toString() || Math.random()}
                        proposal={proposal}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
