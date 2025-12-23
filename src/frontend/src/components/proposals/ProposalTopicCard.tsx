import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProposalTopic } from '../../types';
import { Check, Star } from 'lucide-react';
import { useAuth } from '../../hooks/auth-context';

interface ProposalTopicCardProps {
  topic: ProposalTopic;
  initialFollowing?: boolean;
}

export default function ProposalTopicCard({ topic, initialFollowing = false }: ProposalTopicCardProps) {
  const { backendActor, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

  const handleFollow = async () => {
    if (!isAuthenticated || !backendActor) {
      return;
    }

    setLoading(true);
    try {
      if (isFollowing) {
        await backendActor.unfollow_topic(topic.id);
        setIsFollowing(false);
      } else {
        await backendActor.follow_topic(topic.id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors">
      <Link to={`/proposals/${topic.id}`}>
        <div className="flex items-start justify-between mb-3 cursor-pointer">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                {topic.name}
              </h3>
              {isFollowing && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
            </div>
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
          disabled={loading || !isAuthenticated}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isFollowing
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          {isFollowing && <Check className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
          </span>
        </button>
      </div>
    </div>
  );
}
