import { useState, useMemo } from 'react';
import ArchitectureFlow from '../components/architecture/ArchitectureFlow';
import FileExplorer from '../components/file-explorer/FileExplorer';
import LayerInfoPanel from '../components/ui/LayerInfoPanel';
import { icpLayers } from '../config/icp-layers';
import { FileNode } from '../types';

const mockFiles: FileNode[] = [
  {
    path: 'rs',
    name: 'rs',
    type: 'directory',
    children: [
      {
        path: 'rs/consensus',
        name: 'consensus',
        type: 'directory',
        children: [
          { path: 'rs/consensus/mod.rs', name: 'mod.rs', type: 'file' },
          { path: 'rs/consensus/types.rs', name: 'types.rs', type: 'file' },
        ],
      },
      {
        path: 'rs/execution_environment',
        name: 'execution_environment',
        type: 'directory',
        children: [
          { path: 'rs/execution_environment/lib.rs', name: 'lib.rs', type: 'file' },
        ],
      },
      {
        path: 'rs/crypto',
        name: 'crypto',
        type: 'directory',
        children: [
          { path: 'rs/crypto/signatures.rs', name: 'signatures.rs', type: 'file' },
        ],
      },
    ],
  },
  {
    path: 'ic-os',
    name: 'ic-os',
    type: 'directory',
    children: [
      { path: 'ic-os/guestos', name: 'guestos', type: 'directory' },
    ],
  },
];

export default function Home() {
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const selectedLayer = useMemo(
    () => icpLayers.find((layer) => layer.id === selectedLayerId) || null,
    [selectedLayerId]
  );

  const highlightedPaths = useMemo(() => {
    return selectedLayer ? selectedLayer.paths : [];
  }, [selectedLayer]);

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 p-4">
        <ArchitectureFlow
          layers={icpLayers}
          selectedLayer={selectedLayerId}
          onLayerSelect={setSelectedLayerId}
        />
      </div>

      <div className="w-96 flex flex-col gap-4 p-4">
        <div className="h-1/3">
          <LayerInfoPanel layer={selectedLayer} />
        </div>
        <div className="flex-1">
          <FileExplorer files={mockFiles} highlightedPaths={highlightedPaths} />
        </div>
      </div>
    </div>
  );
}
