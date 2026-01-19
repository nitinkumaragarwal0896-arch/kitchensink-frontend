import React, { useState, useEffect } from 'react';
import { memberAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es, hi } from 'date-fns/locale';
import { 
  UserPlus, 
  UserMinus, 
  Edit, 
  Activity,
  User
} from 'lucide-react';

const RecentActivity = () => {
  const { t, i18n } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get date-fns locale based on current language
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'hi':
        return hi;
      case 'es':
        return es;
      default:
        return enUS;
    }
  };

  useEffect(() => {
    fetchActivities();

    // Refresh every 5 seconds
    const interval = setInterval(fetchActivities, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      // Fetch recent members and derive activities from audit fields
      const response = await memberAPI.getAll({ page: 0, size: 10, sort: 'updatedAt,desc' });
      const data = response.data;
      
      if (!data || !data.content) {
        setActivities([]);
        return;
      }

      const recentActivities = data.content.map(member => ({
        id: member.id,
        type: member.createdAt === member.updatedAt ? 'CREATE' : 'UPDATE',
        user: member.updatedBy || member.createdBy || 'system',
        target: member.name,
        targetEmail: member.email,
        timestamp: member.updatedAt || member.createdAt,
      }));

      setActivities(recentActivities.slice(0, 3)); // Show only 3
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      // Silently fail - user might not have permission
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'CREATE':
        return <UserPlus className="w-2.5 h-2.5" />;
      case 'UPDATE':
        return <Edit className="w-2.5 h-2.5" />;
      case 'DELETE':
        return <UserMinus className="w-2.5 h-2.5" />;
      default:
        return <Activity className="w-2.5 h-2.5" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'CREATE':
        return 'bg-green-100 text-green-600';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-600';
      case 'DELETE':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'CREATE':
        return t('activity.createdMember');
      case 'UPDATE':
        return t('activity.updatedMember');
      case 'DELETE':
        return t('activity.deletedMember');
      default:
        return t('activity.performedAction');
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 text-center">
        <div className="text-sm text-surface-400">{t('activity.loading')}</div>
      </div>
    );
  }

  if (activities.length === 0) {
    return null; // Don't show if no activities
  }

  return (
    <div className="border-t border-surface-200">
      <div className="px-3 py-2 bg-surface-50">
        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3 h-3" />
          {t('activity.title')}
        </h3>
      </div>
      
      <div className="max-h-48 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="px-3 py-2 border-b border-surface-100 hover:bg-surface-50 transition-colors"
          >
            <div className="flex items-start gap-2">
              {/* Activity Icon */}
              <div className={`mt-0.5 p-1 rounded ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>

              {/* Activity Details */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-surface-800">
                  <span className="font-medium text-brand-600">{activity.user}</span>
                  {' '}{getActivityText(activity)}
                </p>
                <p className="text-xs text-surface-500 truncate">
                  {activity.target}
                </p>
                <p className="text-xs text-surface-400 mt-0.5">
                  {formatDistanceToNow(new Date(activity.timestamp), { 
                    addSuffix: true,
                    locale: getDateLocale()
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;

