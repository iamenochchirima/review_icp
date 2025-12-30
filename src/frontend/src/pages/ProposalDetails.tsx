import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProposalDetails } from '../services/proposals';
import type { ProposalInfo } from '../idl/governance/service';
import { ArrowLeft, Clock, Users, ExternalLink, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2 } from 'lucide-react';
import { proposalTopics } from '../config/proposal-topics';

const topicMapping: Record<number, string> = {
  1: 'neuron-management',
  2: 'exchange-rate',
  3: 'network-economics',
  4: 'governance',
  5: 'node-admin',
  6: 'participant-management',
  7: 'subnet-management',
  8: 'application-canister',
  9: 'kyc',
  10: 'node-provider-rewards',
  12: 'ic-os-deployment',
  13: 'ic-os-election',
  14: 'sns-neurons-fund',
  15: 'api-boundary-node',
  16: 'subnet-rental',
  17: 'protocol-canister',
  18: 'service-nervous-system',
};

export default function ProposalDetails() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<ProposalInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (proposalId) {
      fetchProposalDetails(BigInt(proposalId))
        .then(setProposal)
        .finally(() => setLoading(false));
    }
  }, [proposalId]);

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-blue-600';
      case 2: return 'bg-red-600';
      case 3: return 'bg-green-600';
      case 4: return 'bg-emerald-600';
      case 5: return 'bg-red-700';
      default: return 'bg-gray-600';
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1: return 'Open';
      case 2: return 'Rejected';
      case 3: return 'Adopted';
      case 4: return 'Executed';
      case 5: return 'Failed';
      default: return 'Unknown';
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

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTopicName = (topicNumber: number) => {
    const topicId = topicMapping[topicNumber];
    const topic = proposalTopics.find(t => t.id === topicId);
    return topic?.name || 'Unknown Topic';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Proposal not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const tally = proposal.latest_tally?.[0];
  const yesVotes = tally ? Number(tally.yes) : 0;
  const noVotes = tally ? Number(tally.no) : 0;
  const totalVotes = tally ? Number(tally.total) : 0;
  const votePercentage = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;

  const proposalTitle = proposal.proposal?.[0]?.title?.[0] || 'Untitled Proposal';
  const proposalSummary = proposal.proposal?.[0]?.summary || '';
  const proposalUrl = proposal.proposal?.[0]?.url || '';
  const proposerId = proposal.proposer?.[0]?.id.toString() || 'Unknown';
  const dashboardUrl = `https://dashboard.internetcomputer.org/proposal/${proposalId}`;

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-gray-400 text-sm">ID: {proposalId}</span>
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(proposal.status)}`}>
                    {getStatusLabel(proposal.status)}
                  </span>
                  <span className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-300">
                    {getTopicName(proposal.topic)}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{proposalTitle}</h1>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <div>
                  <div className="text-xs text-gray-500">Created</div>
                  <div>{formatDate(proposal.proposal_timestamp_seconds)}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <div>
                  <div className="text-xs text-gray-500">Voting Deadline</div>
                  <div>{getTimeRemaining(proposal.deadline_timestamp_seconds?.[0])}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <div>
                  <div className="text-xs text-gray-500">Total Votes</div>
                  <div>{totalVotes} votes</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Yes: {yesVotes.toLocaleString()}</span>
                <span className="text-gray-400">No: {noVotes.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${votePercentage}%` }}
                />
              </div>
              <div className="text-center text-lg font-semibold text-white mt-2">
                {votePercentage}% Yes
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
                  Adopt
                </button>
                <button className="flex-1 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                  Reject
                </button>
              </div>
              <div className="mt-2 text-center">
                <a
                  href={`https://nns.ic0.app/proposal/?u=qoctq-giaaa-aaaaa-aaaea-cai&proposal=${proposalId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Vote on NNS Dapp
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Proposer Neuron: <span className="text-gray-300 font-mono">{proposerId}</span>
              </div>
              <div className="flex gap-2">
                {proposalUrl && (
                  <a
                    href={proposalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Forum Link
                  </a>
                )}
                <a
                  href={dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Dashboard
                </a>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Proposal Summary</h2>
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-white mt-6 mb-3" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-white mt-5 mb-2" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-4 text-gray-300" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                  li: ({ node, ...props }) => <li className="text-gray-300 leading-relaxed" {...props} />,
                  a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                  pre: ({ node, ...props }) => <pre className="bg-gray-800 p-4 rounded my-4 overflow-x-auto" {...props} />,
                  code: ({ node, inline, ...props }: any) =>
                    inline ? (
                      <code className="text-blue-300 font-mono text-sm" {...props} />
                    ) : (
                      <code className="text-sm text-gray-300 font-mono" {...props} />
                    ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-gray-700 pl-4 my-4 text-gray-400 italic" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="min-w-full divide-y divide-gray-700" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => <thead className="bg-gray-800" {...props} />,
                  tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-700" {...props} />,
                  tr: ({ node, ...props }) => <tr {...props} />,
                  th: ({ node, ...props }) => <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" {...props} />,
                  td: ({ node, ...props }) => <td className="px-4 py-3 text-sm text-gray-300 font-mono" {...props} />,
                }}
              >
                {proposalSummary}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
