import { useState } from 'react';
import { FileNode } from '../../types';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';

interface FileTreeItemProps {
  node: FileNode;
  highlightedPaths: string[];
  depth: number;
}

export default function FileTreeItem({
  node,
  highlightedPaths,
  depth,
}: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isHighlighted = highlightedPaths.some((pattern) =>
    matchPattern(node.path, pattern)
  );

  const hasHighlightedChildren = node.children?.some((child) =>
    highlightedPaths.some((pattern) => matchPattern(child.path, pattern))
  );

  const textColor = isHighlighted
    ? 'text-green-400 font-medium'
    : hasHighlightedChildren
    ? 'text-gray-300'
    : 'text-gray-500';

  const handleClick = () => {
    if (node.type === 'directory') {
      setIsExpanded(!isExpanded);
    } else {
      const githubUrl = `https://github.com/dfinity/ic/tree/master/${node.path}`;
      window.open(githubUrl, '_blank');
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded cursor-pointer ${textColor}`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'directory' && (
          <span className="w-4 h-4">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        {node.type === 'directory' ? (
          <Folder className="w-4 h-4" />
        ) : (
          <File className="w-4 h-4" />
        )}
        <span className="text-sm">{node.name}</span>
      </div>

      {isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              highlightedPaths={highlightedPaths}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function matchPattern(path: string, pattern: string): boolean {
  const regexPattern = pattern
    .replace(/\*/g, '.*')
    .replace(/\//g, '\\/')
    .replace(/\?/g, '.');
  return new RegExp(`^${regexPattern}$`).test(path);
}
