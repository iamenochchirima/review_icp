import { FileNode } from '../../types';
import FileTreeItem from './FileTreeItem';

interface FileExplorerProps {
  files: FileNode[];
  highlightedPaths: string[];
}

export default function FileExplorer({
  files,
  highlightedPaths,
}: FileExplorerProps) {
  return (
    <div className="h-full overflow-y-auto bg-gray-900 p-4 rounded-lg">
      <h2 className="text-lg font-semibold text-white mb-4">
        ICP Repository Files
      </h2>
      <div className="space-y-1">
        {files.map((file) => (
          <FileTreeItem
            key={file.path}
            node={file}
            highlightedPaths={highlightedPaths}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
}
