export interface ICPLayer {
  id: string;
  name: string;
  description: string;
  paths: string[];
  color: string;
  position: { x: number; y: number };
}

export interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  highlighted?: boolean;
}

export interface ProposalInfo {
  id: string;
  title: string;
  affectedLayers: string[];
  modifiedFiles: string[];
  summary: string;
}

export interface ProposalTopic {
  id: string;
  name: string;
  description: string;
  openProposalsCount: number;
}

export type ProposalDecisionStatus =
  | 'UNSPECIFIED'
  | 'OPEN'
  | 'REJECTED'
  | 'ADOPTED'
  | 'EXECUTED'
  | 'FAILED'
  | 'UNKNOWN';

export type ProposalRewardStatus =
  | 'UNSPECIFIED'
  | 'ACCEPT_VOTES'
  | 'READY_TO_SETTLE'
  | 'SETTLED'
  | 'INELIGIBLE';

export interface LatestTally {
  no: number;
  yes: number;
  total: number;
  timestamp_seconds: number;
}

export interface Proposal {
  root_canister_id: string;
  id: string;
  action: string;
  topic?: string;
  decided_timestamp_seconds: number;
  executed_timestamp_seconds: number;
  failed_timestamp_seconds: number;
  reward_event_end_timestamp_seconds?: number;
  initial_voting_period_seconds: number;
  is_eligible_for_rewards: boolean;
  latest_tally: LatestTally;
  proposal_action_type: string;
  proposal_title: string;
  proposal_url: string;
  proposal_creation_timestamp_seconds: number;
  proposer: string;
  summary: string;
  status: ProposalDecisionStatus;
  reward_status: ProposalRewardStatus;
  wait_for_quiet_state_current_deadline_timestamp_seconds: number;
}

export interface ListProposalsResponse {
  data: Proposal[];
  previous_cursor?: string;
  next_cursor?: string;
}

export interface CountProposalsResponse {
  count: number;
}
