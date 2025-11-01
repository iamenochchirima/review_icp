import { ICPLayer } from '../types';

export const icpLayers: ICPLayer[] = [
  {
    id: 'consensus',
    name: 'Consensus Layer',
    description: 'Byzantine fault tolerant consensus protocol',
    paths: ['rs/consensus/*', 'ic-os/*/consensus/*'],
    color: '#3b82f6',
    position: { x: 250, y: 50 }
  },
  {
    id: 'execution',
    name: 'Execution Layer',
    description: 'WebAssembly canister execution environment',
    paths: ['rs/execution_environment/*', 'rs/canister_sandbox/*'],
    color: '#8b5cf6',
    position: { x: 250, y: 150 }
  },
  {
    id: 'messaging',
    name: 'Message Routing',
    description: 'Cross-subnet and inter-canister messaging',
    paths: ['rs/messaging/*', 'rs/xnet/*'],
    color: '#ec4899',
    position: { x: 250, y: 250 }
  },
  {
    id: 'networking',
    name: 'Networking Layer',
    description: 'P2P networking and transport protocols',
    paths: ['rs/p2p/*', 'rs/transport/*'],
    color: '#10b981',
    position: { x: 250, y: 350 }
  },
  {
    id: 'crypto',
    name: 'Cryptography',
    description: 'Chain-key cryptography and threshold signatures',
    paths: ['rs/crypto/*', 'rs/types/types/src/crypto/*'],
    color: '#f59e0b',
    position: { x: 550, y: 50 }
  },
  {
    id: 'state',
    name: 'State Management',
    description: 'Replicated state and certification',
    paths: ['rs/state_manager/*', 'rs/replicated_state/*'],
    color: '#06b6d4',
    position: { x: 550, y: 150 }
  },
  {
    id: 'registry',
    name: 'Registry',
    description: 'Network topology and configuration',
    paths: ['rs/registry/*', 'rs/nns/registry/*'],
    color: '#84cc16',
    position: { x: 550, y: 250 }
  },
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    description: 'Node and replica management',
    paths: ['ic-os/*/orchestrator/*', 'rs/orchestrator/*'],
    color: '#ef4444',
    position: { x: 550, y: 350 }
  }
];
