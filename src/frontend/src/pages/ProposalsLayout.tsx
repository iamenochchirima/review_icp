import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/auth-context';

export default function ProposalsLayout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const tabs = [
    { path: '/proposals/following', label: 'Following', authRequired: true },
    { path: '/proposals', label: 'All Topics', exact: true },
    { path: '/proposals/all', label: 'All Proposals' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="bg-gray-900 border-b border-gray-800 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex gap-1">
            {tabs.map((tab) => {
              if (tab.authRequired && !isAuthenticated) return null;

              const active = isActive(tab.path, tab.exact);

              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`px-6 py-4 font-medium transition-colors border-b-2 ${
                    active
                      ? 'text-white border-blue-500'
                      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-700'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="flex-1 bg-gray-950">
        <Outlet />
      </div>
    </div>
  );
}
