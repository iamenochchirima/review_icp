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

export interface Proposal {
  id: string;
  proposalId: number;
  title: string;
  summary: string;
  topic: string;
  status: 'Open' | 'Adopted' | 'Rejected' | 'Executed' | 'Failed';
  proposer: string;
  votingDeadline: string;
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  createdAt: string;
  proposalUrl?: string;
}
