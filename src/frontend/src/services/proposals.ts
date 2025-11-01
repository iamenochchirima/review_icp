import { Proposal } from '../types';

const API_BASE = 'https://sns-api.internetcomputer.org/api/v1';

export async function fetchProposalsByTopic(topicId: string): Promise<Proposal[]> {
  try {
    const response = await fetch(`${API_BASE}/proposals?topic=${topicId}&status=open`);

    if (!response.ok) {
      throw new Error('Failed to fetch proposals');
    }

    const data = await response.json();
    return data.proposals || [];
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return getMockProposals(topicId);
  }
}

function getMockProposals(topicId: string): Proposal[] {
  const mockProposals: Record<string, Proposal[]> = {
    'subnet-management': [
      {
        id: '139205',
        proposalId: 139205,
        title: 'Change Subnet Membership',
        summary: 'Replace a node in subnet xlkub',
        topic: 'Subnet Management',
        status: 'Open',
        proposer: 'dfinity-foundation',
        votingDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        yesVotes: 58,
        noVotes: 0,
        totalVotes: 58,
        createdAt: new Date().toISOString(),
        proposalUrl: 'https://dashboard.internetcomputer.org/proposal/139205'
      },
      {
        id: '139204',
        proposalId: 139204,
        title: 'Change Subnet Membership',
        summary: 'Replace a node in subnet vcpt7',
        topic: 'Subnet Management',
        status: 'Open',
        proposer: 'dfinity-foundation',
        votingDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        yesVotes: 58,
        noVotes: 0,
        totalVotes: 58,
        createdAt: new Date().toISOString(),
        proposalUrl: 'https://dashboard.internetcomputer.org/proposal/139204'
      }
    ],
    'protocol-canister': [
      {
        id: '139212',
        proposalId: 139212,
        title: 'Install Code',
        summary: 'Upgrade the Node-rewards Canister to Commit 1bc0a59',
        topic: 'Protocol Canister Management',
        status: 'Open',
        proposer: 'dfinity-foundation',
        votingDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        yesVotes: 77,
        noVotes: 0,
        totalVotes: 77,
        createdAt: new Date().toISOString(),
        proposalUrl: 'https://dashboard.internetcomputer.org/proposal/139212'
      }
    ],
    'ic-os-election': [
      {
        id: '139193',
        proposalId: 139193,
        title: 'Revise Elected HostOS Versions',
        summary: 'Elect new IC/HostOS revision (commit 1991b79)',
        topic: 'IC OS Version Election',
        status: 'Open',
        proposer: 'dfinity-foundation',
        votingDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        yesVotes: 45,
        noVotes: 2,
        totalVotes: 47,
        createdAt: new Date().toISOString(),
        proposalUrl: 'https://dashboard.internetcomputer.org/proposal/139193'
      }
    ],
    'api-boundary-node': [
      {
        id: '139180',
        proposalId: 139180,
        title: 'Add API Boundary Node',
        summary: 'Add new API boundary node in us-east region',
        topic: 'API Boundary Node Management',
        status: 'Open',
        proposer: 'boundary-node-team',
        votingDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        yesVotes: 120,
        noVotes: 5,
        totalVotes: 125,
        createdAt: new Date().toISOString(),
        proposalUrl: 'https://dashboard.internetcomputer.org/proposal/139180'
      }
    ]
  };

  return mockProposals[topicId] || [];
}
