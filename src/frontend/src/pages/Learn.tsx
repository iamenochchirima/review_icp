import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { proposalTopics } from '../config/proposal-topics';

export default function Learn() {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Learn NNS Governance</h1>
          <p className="text-xl text-gray-400">
            Master the art of reviewing and voting on Internet Computer proposals
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
          <div className="flex items-start gap-4">
            <BookOpen className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">What is NNS Governance?</h2>
              <div className="space-y-3 text-gray-300">
                <p>
                  The Network Nervous System (NNS) is the decentralized autonomous organization that governs the Internet Computer.
                  It enables ICP token holders to participate in decisions about the network's evolution.
                </p>
                <p>
                  Proposals are the mechanism through which changes are proposed and voted on. Each proposal belongs to a specific
                  topic and requires community review and voting to be adopted.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Review Proposals</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">1. Read the Proposal Thoroughly</h3>
                <p className="text-gray-400">
                  Take time to understand what is being proposed. Read the summary, check linked forum discussions,
                  and review any technical specifications.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">2. Understand the Context</h3>
                <p className="text-gray-400">
                  Consider why this proposal is needed. What problem does it solve? How does it align with the
                  Internet Computer's goals?
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">3. Check for Red Flags</h3>
                <p className="text-gray-400">
                  Look for incomplete information, rushed timelines, lack of community discussion, or proposals
                  that seem to benefit specific parties unfairly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">4. Verify Technical Details</h3>
                <p className="text-gray-400">
                  For technical proposals, verify that code hashes match, check that deployments are to the correct
                  subnets, and ensure security considerations are addressed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">5. Engage with the Community</h3>
                <p className="text-gray-400">
                  Participate in forum discussions, ask questions, and share your analysis. Community collaboration
                  leads to better decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Learn by Topic</h2>
          <p className="text-gray-400 mb-6">
            Each topic has specific considerations and common proposal types. Click on a topic to learn more about reviewing proposals in that area.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proposalTopics.map((topic) => (
              <Link
                key={topic.id}
                to={`/learn/${topic.id}`}
                className="bg-gray-900 rounded-lg border border-gray-800 p-5 hover:border-gray-700 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{topic.icon}</span>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {topic.name}
                    </h3>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{topic.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Voting Best Practices</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Only vote if you've thoroughly reviewed the proposal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Set up following for topics you're knowledgeable about</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Don't blindly follow other voters - do your own research</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>When in doubt, vote "No" or abstain until you understand better</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Participate in forum discussions before voting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Consider long-term implications, not just short-term benefits</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
