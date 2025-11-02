import { getGovernanceActor } from '../hooks/actors';
import type { ProposalInfo } from '../idl/governance/service';

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

export async function fetchProposalsByTopic(topicId: string): Promise<ProposalInfo[]> {
  try {
    const topicNumber = topicMapping[topicId];
    if (topicNumber === undefined) {
      console.warn(`Unknown topic: ${topicId}`);
      return [];
    }

    const actor = await getGovernanceActor();

    const response = await actor.list_proposals({
      include_reward_status: [],
      omit_large_fields: [true],
      before_proposal: [],
      limit: 50,
      exclude_topic: [],
      include_all_manage_neuron_proposals: [],
      include_status: [1],
    });

    const proposals = response.proposal_info.filter(
      (proposal) => proposal.topic === topicNumber
    );

    return proposals;
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return [];
  }
}

export async function fetchAllOpenProposals(): Promise<ProposalInfo[]> {
  try {
    const actor = await getGovernanceActor();

    const response = await actor.list_proposals({
      include_reward_status: [],
      omit_large_fields: [true],
      before_proposal: [],
      limit: 100,
      exclude_topic: [],
      include_all_manage_neuron_proposals: [],
      include_status: [1],
    });

    return response.proposal_info;
  } catch (error) {
    console.error('Error fetching all proposals:', error);
    return [];
  }
}
