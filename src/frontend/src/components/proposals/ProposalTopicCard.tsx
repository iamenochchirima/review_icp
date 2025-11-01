import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProposalTopic } from '../../types';
import { Bell, BellOff, Check } from 'lucide-react';

interface ProposalTopicCardProps {
  topic: ProposalTopic;
}

export default function ProposalTopicCard({ topic }: ProposalTopicCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      setNotificationsEnabled(false);
    }
  };

  const handleNotification = () => {
    if (!isFollowing) {
      setIsFollowing(true);
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors">
      <Link to={`/proposals/${topic.id}`}>
        <div className="flex items-start justify-between mb-3 cursor-pointer">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1 hover:text-blue-400 transition-colors">
              {topic.name}
            </h3>
            <p className="text-sm text-gray-400">{topic.description}</p>
          </div>

          {topic.openProposalsCount > 0 && (
            <div className="ml-3 px-3 py-1 bg-blue-600 rounded-full">
              <span className="text-sm font-semibold">{topic.openProposalsCount}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={handleFollow}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isFollowing
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          {isFollowing && <Check className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {isFollowing ? 'Following' : 'Follow'}
          </span>
        </button>

        <button
          onClick={handleNotification}
          className={`p-2 rounded-lg transition-colors ${
            notificationsEnabled
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
          title={notificationsEnabled ? 'Notifications enabled' : 'Enable notifications'}
        >
          {notificationsEnabled ? (
            <Bell className="w-4 h-4 fill-current" />
          ) : (
            <BellOff className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
