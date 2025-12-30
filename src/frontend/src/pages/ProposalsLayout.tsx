import { Outlet, Link, useLocation } from 'react-router-dom';

export default function ProposalsLayout() {
  const location = useLocation();

  const isTopicsActive = location.pathname === '/proposals';
  const isProposalsActive = location.pathname === '/proposals/all';

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="bg-gray-900 border-b border-gray-800 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex gap-1">
            <Link
              to="/proposals"
              className={`px-6 py-4 font-medium transition-colors border-b-2 ${
                isTopicsActive
                  ? 'text-white border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-700'
              }`}
            >
              Topics
            </Link>
            <Link
              to="/proposals/all"
              className={`px-6 py-4 font-medium transition-colors border-b-2 ${
                isProposalsActive
                  ? 'text-white border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-700'
              }`}
            >
              Proposals
            </Link>
          </nav>
        </div>
      </div>
      <div className="flex-1 bg-gray-950">
        <Outlet />
      </div>
    </div>
  );
}
