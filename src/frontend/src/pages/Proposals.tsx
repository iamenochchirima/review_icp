import { useMemo, useState } from 'react';
import ProposalTopicCard from '../components/proposals/ProposalTopicCard';
import { proposalTopics } from '../config/proposal-topics';
import { Search } from 'lucide-react';

export default function Proposals() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = useMemo(() => {
    if (!searchQuery) return proposalTopics;

    const query = searchQuery.toLowerCase();
    return proposalTopics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const totalOpenProposals = useMemo(
    () => proposalTopics.reduce((sum, topic) => sum + topic.openProposalsCount, 0),
    []
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
      </div>
    </div>
  );
}
