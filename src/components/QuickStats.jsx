import React, { useState, useEffect } from 'react';
import { memberAPI, jobAPI } from '../services/api';
import { Users, Briefcase } from 'lucide-react';

const QuickStats = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeJobs: 0,
  });

  useEffect(() => {
    fetchStats();

    // Refresh stats every 5 seconds
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch member count
      const membersResponse = await memberAPI.getAll({ page: 0, size: 1 });
      const totalMembers = membersResponse.data.totalElements || 0;

      // Fetch active jobs count
      const jobsResponse = await jobAPI.getActive();
      const activeJobs = jobsResponse.data.length || 0;

      setStats({ totalMembers, activeJobs });
    } catch (error) {
      console.error('Failed to fetch quick stats:', error);
    }
  };

  return (
    <div className="px-4 py-3 bg-gradient-to-r from-brand-50 to-sky-50 border-y border-surface-200">
      <div className="grid grid-cols-2 gap-3">
        {/* Members Count */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <div className="text-xs text-surface-500 font-medium">Members</div>
            <div className="text-lg font-bold text-surface-800">{stats.totalMembers}</div>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <div className="text-xs text-surface-500 font-medium">Active Jobs</div>
            <div className="text-lg font-bold text-surface-800">{stats.activeJobs}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;

