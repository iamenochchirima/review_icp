import { useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ICPLayer } from '../../types';
import LayerNode from './LayerNode';

interface ArchitectureFlowProps {
  layers: ICPLayer[];
  selectedLayer: string | null;
  onLayerSelect: (layerId: string) => void;
}

const nodeTypes = {
  layer: LayerNode,
};

export default function ArchitectureFlow({
  layers,
  selectedLayer,
  onLayerSelect,
}: ArchitectureFlowProps) {
  const initialNodes: Node[] = layers.map((layer) => ({
    id: layer.id,
    type: 'layer',
    position: layer.position,
    data: {
      label: layer.name,
      description: layer.description,
      color: layer.color,
      isSelected: selectedLayer === layer.id,
      onSelect: () => onLayerSelect(layer.id),
    },
  }));

  const initialEdges: Edge[] = [
    { id: 'e1', source: 'consensus', target: 'execution', animated: true },
    { id: 'e2', source: 'execution', target: 'messaging', animated: true },
    { id: 'e3', source: 'messaging', target: 'networking', animated: true },
    { id: 'e4', source: 'crypto', target: 'consensus' },
    { id: 'e5', source: 'state', target: 'execution' },
    { id: 'e6', source: 'registry', target: 'state' },
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onLayerSelect(node.id);
    },
    [onLayerSelect]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
