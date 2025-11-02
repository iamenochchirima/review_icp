import type { ProposalInfo } from '../../idl/governance/service';
import { Clock, Users, ExternalLink } from 'lucide-react';

interface ProposalCardProps {
  proposal: ProposalInfo;
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return 'bg-blue-600';
      case 2:
        return 'bg-red-600';
      case 3:
        return 'bg-green-600';
      case 4:
        return 'bg-purple-600';
      case 5:
        return 'bg-red-700';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return 'Open';
      case 2:
        return 'Rejected';
      case 3:
        return 'Adopted';
      case 4:
        return 'Executed';
      case 5:
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const getTimeRemaining = (deadlineSeconds?: bigint) => {
    if (!deadlineSeconds) return 'No deadline';

    const now = Date.now() / 1000;
    const deadline = Number(deadlineSeconds);
    const diff = deadline - now;

    if (diff <= 0) return 'Voting ended';

    const days = Math.floor(diff / (60 * 60 * 24));
    const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));

    if (days > 0) {
      return `${days} days, ${hours} hours remaining`;
    }
    return `${hours} hours remaining`;
  };

  const tally = proposal.latest_tally?.[0];
  const yesVotes = tally ? Number(tally.yes) : 0;
  const noVotes = tally ? Number(tally.no) : 0;
  const totalVotes = tally ? Number(tally.total) : 0;

  const votePercentage =
    totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;

  const proposalId = proposal.id?.[0]?.id.toString() || 'Unknown';
  const proposalTitle = proposal.proposal?.[0]?.title?.[0] || 'Untitled Proposal';
  const proposalSummary = proposal.proposal?.[0]?.summary || 'No summary available';
  const proposalUrl = proposal.proposal?.[0]?.url || '';
  const proposerId = proposal.proposer?.[0]?.id.toString() || 'Unknown';

  const dashboardUrl = `https://dashboard.internetcomputer.org/proposal/${proposalId}`;

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-400 text-sm">ID: {proposalId}</span>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                proposal.status
              )}`}
            >
              {getStatusLabel(proposal.status)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {proposalTitle}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">{proposalSummary}</p>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{getTimeRemaining(proposal.deadline_timestamp_seconds?.[0])}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>{totalVotes} votes</span>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Yes: {yesVotes}</span>
            <span className="text-gray-400">No: {noVotes}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${votePercentage}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-400 mt-1">
            {votePercentage}% Yes
          </div>
        </div>

        <div className="pt-2 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Neuron: {proposerId}</span>
            <a
              href={proposalUrl || dashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
            >
              <span>View Details</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
