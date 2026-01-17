import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { memberAPI } from '../services/api';
import { Users, UserPlus, Shield, Activity } from 'lucide-react';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    recentMembers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await memberAPI.getAll();
      const members = response.data;
      setStats({
        totalMembers: members.length,
        recentMembers: members.slice(0, 5),
      });
    } catch (error) {
      // Silently handle - user might not have member:read permission
      if (error.response?.status !== 403) {
        console.error('Failed to fetch stats:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, link }) => (
    <Link 
      to={link}
      className="card p-6 hover:shadow-glow transition-all duration-300 group"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color} transition-transform group-hover:scale-110`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-surface-500">{label}</p>
          <p className="text-2xl font-display font-bold text-surface-800">{value}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="relative overflow-hidden card p-8 bg-gradient-to-br from-surface-800 to-surface-900">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10">
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Welcome back, {user?.firstName || user?.username}!
          </h1>
          <p className="text-surface-400 max-w-lg">
            Manage your organization's members, view statistics, and keep everything organized from your dashboard.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          label="Total Members"
          value={loading ? '...' : stats.totalMembers}
          color="bg-brand-500"
          link="/members"
        />
        <StatCard
          icon={UserPlus}
          label="Add Member"
          value="New"
          color="bg-emerald-500"
          link="/members"
        />
        {isAdmin() && (
          <StatCard
            icon={Shield}
            label="User Management"
            value="Admin"
            color="bg-sky-500"
            link="/admin/users"
          />
        )}
      </div>

      {/* Recent Members */}
      <div className="card">
        <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-surface-800">
            Recent Members
          </h2>
          <Link to="/members" className="text-brand-600 hover:text-brand-700 text-sm font-medium">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-surface-100">
          {loading ? (
            <div className="p-8 text-center text-surface-500">Loading...</div>
          ) : stats.recentMembers.length > 0 ? (
            stats.recentMembers.map((member, index) => (
              <div 
                key={member.id} 
                className="px-6 py-4 flex items-center gap-4 hover:bg-surface-50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <span className="text-brand-700 font-semibold">
                    {member.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-surface-800 truncate">{member.name}</p>
                  <p className="text-sm text-surface-500 truncate">{member.email}</p>
                </div>
                <div className="hidden sm:block text-sm text-surface-400 font-mono">
                  {member.phoneNumber}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-surface-500">
              No members yet. Create your first member!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

