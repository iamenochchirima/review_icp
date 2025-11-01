import { Proposal } from '../../types';
import { Clock, Users, ExternalLink } from 'lucide-react';

interface ProposalCardProps {
  proposal: Proposal;
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-600';
      case 'Adopted':
        return 'bg-green-600';
      case 'Rejected':
        return 'bg-red-600';
      case 'Executed':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} days, ${hours} hours remaining`;
    }
    return `${hours} hours remaining`;
  };

  const votePercentage = proposal.totalVotes > 0
    ? Math.round((proposal.yesVotes / proposal.totalVotes) * 100)
    : 0;

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-400 text-sm">ID: {proposal.proposalId}</span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(proposal.status)}`}>
              {proposal.status}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{proposal.title}</h3>
          <p className="text-sm text-gray-400">{proposal.summary}</p>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{getTimeRemaining(proposal.votingDeadline)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>{proposal.totalVotes} votes</span>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Yes: {proposal.yesVotes}</span>
            <span className="text-gray-400">No: {proposal.noVotes}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${votePercentage}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-400 mt-1">{votePercentage}% Yes</div>
        </div>

        <div className="pt-2 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Proposer: {proposal.proposer}</span>
            {proposal.proposalUrl && (
              <a
                href={proposal.proposalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
              >
                <span>View Details</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
