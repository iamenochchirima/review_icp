import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

export default function QuickActionCard({ title, description, icon: Icon, href, color }: QuickActionCardProps) {
  return (
    <Link
      to={href}
      className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-all hover:scale-105"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <h3 className="text-white font-semibold mb-1">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
}
