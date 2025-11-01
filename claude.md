# ICP Review - Development Instructions

## Project Overview
A visualization and review platform for the Internet Computer Protocol (ICP) codebase.
**Tagline**: "Easily understand and Review ICP"

## Setup Instructions

### Package Installation
When installing packages, always use pnpm from the root directory with the `-w` flag:
```bash
pnpm install -w <package-name>
```

### Technology Stack
- React + TypeScript
- Tailwind CSS (already configured)
- React Flow (@xyflow/react) - for architecture visualization
- Vite (build tool)

## Project Structure

```
src/frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── architecture/    # Architecture visualization components
│   │   ├── file-explorer/   # File tree/explorer components
│   │   └── ui/             # Common UI components
│   ├── pages/              # Page components
│   │   └── Home.tsx        # Main architecture visualization page
│   ├── config/             # Configuration files
│   │   └── icp-layers.ts   # ICP architecture layer mappings
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Root component
```

## Core Features

### 1. Architecture Visualization (Home Page)
- Interactive diagram showing ICP layers (Consensus, Execution, Networking, etc.)
- Click on a layer to highlight associated files
- Visual hierarchy of the ICP architecture

### 2. File Explorer
- Shows ICP codebase file tree
- Highlights files in green when layer is selected
- Grays out unrelated files
- Links directly to GitHub source files

### 3. Layer Mapping (Manual Setup)
The key manual configuration is mapping architectural layers to file paths:

```typescript
// config/icp-layers.ts
{
  "Consensus Layer": {
    "paths": ["rs/consensus/*", "ic-os/*/consensus/*"],
    "description": "Byzantine fault tolerant consensus protocol",
    "color": "#3b82f6"
  }
}
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server
cd src/frontend && pnpm dev

# Build
cd src/frontend && pnpm build
```

## Notes
- Always use pnpm with `-w` flag for workspace installations
- React Flow handles interactive node diagrams
- Tailwind for styling file lists and UI components
