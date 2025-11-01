import { ICPLayer } from '../../types';

interface LayerInfoPanelProps {
  layer: ICPLayer | null;
}

export default function LayerInfoPanel({ layer }: LayerInfoPanelProps) {
  if (!layer) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg h-full flex items-center justify-center">
        <p className="text-gray-400 text-center">
          Select a layer to view details
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg h-full">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: layer.color }}
        />
        <h2 className="text-xl font-bold text-white">{layer.name}</h2>
      </div>

      <p className="text-gray-300 mb-6">{layer.description}</p>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
            File Patterns
          </h3>
          <div className="space-y-1">
            {layer.paths.map((path, idx) => (
              <code
                key={idx}
                className="block text-sm bg-gray-800 text-green-400 px-3 py-2 rounded"
              >
                {path}
              </code>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
