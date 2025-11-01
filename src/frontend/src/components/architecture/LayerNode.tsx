import { Handle, Position } from '@xyflow/react';

interface LayerNodeProps {
  data: {
    label: string;
    description: string;
    color: string;
    isSelected: boolean;
    onSelect: () => void;
  };
}

export default function LayerNode({ data }: LayerNodeProps) {
  return (
    <div
      onClick={data.onSelect}
      className={`px-6 py-4 rounded-lg border-2 cursor-pointer transition-all ${
        data.isSelected
          ? 'border-white shadow-lg scale-105'
          : 'border-gray-600 hover:border-gray-400'
      }`}
      style={{ backgroundColor: data.color }}
    >
      <Handle type="target" position={Position.Top} />

      <div className="text-white">
        <div className="font-bold text-lg">{data.label}</div>
        <div className="text-sm opacity-90 mt-1 max-w-xs">
          {data.description}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
