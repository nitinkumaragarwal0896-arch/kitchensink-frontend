import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { memberAPI } from '../services/api';
import { Users, UserPlus, Shield, Activity, TrendingUp, User, Mail, Phone } from 'lucide-react';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { validateField } from '../utils/validation';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    recentMembers: [],
  });
  const [loading, setLoading] = useState(true);
  
  // Add Member Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Fetch first page with size=5 to get recent members
      // Sort by createdAt descending to show newest members first
      const response = await memberAPI.getAll({ page: 0, size: 5, sort: 'createdAt,desc' });
      
      // API now returns paginated response: { content: [...], totalElements: N, ... }
      const { content, totalElements } = response.data;
      
      setStats({
        totalMembers: totalElements || 0,
        recentMembers: content || [],
      });
    } catch (error) {
      // Silently handle - user might not have member:read permission
      if (error.response?.status !== 403) {
        console.error('Failed to fetch stats:', error);
      }
      // Set empty stats on error
      setStats({
        totalMembers: 0,
        recentMembers: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    
    // Validate
    const errors = {};
    ['name', 'email', 'phoneNumber'].forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await memberAPI.create(formData);
      toast.success('Member added successfully!');
      setShowAddModal(false);
      setFormData({ name: '', email: '', phoneNumber: '' });
      setFormErrors({});
      fetchStats(); // Refresh stats
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to add member';
      toast.error(errorMsg);
      
      // Highlight field with error if backend specifies it
      if (errorMsg.toLowerCase().includes('email')) {
        setFormErrors({ email: errorMsg });
      } else if (errorMsg.toLowerCase().includes('phone')) {
        setFormErrors({ phoneNumber: errorMsg });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, link, subtitle }) => (
    <Link 
      to={link}
      className="card p-6 hover:shadow-glow transition-all duration-300 group"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color} transition-transform group-hover:scale-110`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-surface-500">{label}</p>
          <p className="text-2xl font-display font-bold text-surface-800">{value}</p>
          {subtitle && <p className="text-xs text-surface-400 mt-1">{subtitle}</p>}
        </div>
      </div>
    </Link>
  );

  const ActionCard = ({ icon: Icon, label, value, color, onClick, subtitle }) => (
    <button
      onClick={onClick}
      className="card p-6 hover:shadow-glow transition-all duration-300 group text-left w-full"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color} transition-transform group-hover:scale-110`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-surface-500">{label}</p>
          <p className="text-2xl font-display font-bold text-surface-800">{value}</p>
          {subtitle && <p className="text-xs text-surface-400 mt-1">{subtitle}</p>}
        </div>
      </div>
    </button>
  );

  // Show loading state while user or data is being fetched
  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-surface-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="relative overflow-hidden card p-8 bg-gradient-to-br from-surface-800 to-surface-900">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10">
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Welcome back, {user?.firstName || user?.username}!
            {isAdmin() && (
              <span className="ml-3 text-sm font-normal px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full border border-sky-400/30">
                Administrator
              </span>
            )}
          </h1>
          <p className="text-surface-400 max-w-lg">
            {isAdmin() 
              ? "Manage users, view statistics, and oversee all aspects of the member registry system."
              : "View and manage organization members from your personalized dashboard."
            }
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={Users}
          label="Total Members"
          value={loading ? '...' : stats.totalMembers}
          color="bg-brand-500"
          link="/members"
          subtitle="View all members"
        />
        <ActionCard
          icon={UserPlus}
          label="Quick Actions"
          value="Add Member"
          color="bg-emerald-500"
          onClick={() => setShowAddModal(true)}
          subtitle="Register new member"
        />
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

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFormData({ name: '', email: '', phoneNumber: '' });
          setFormErrors({});
        }}
        title="Add New Member"
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <p className="text-surface-500 text-sm mb-4">
            Register a new member to the organization.
          </p>

          {/* Name Field */}
          <div>
            <label className="label">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={formErrors.name ? 'input-error pl-10' : 'input pl-10'}
                placeholder="John Doe"
                disabled={submitting}
              />
            </div>
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
            <p className="text-surface-400 text-xs mt-1">Enter first and last name (2-50 characters)</p>
          </div>

          {/* Email Field */}
          <div>
            <label className="label">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={formErrors.email ? 'input-error pl-10' : 'input pl-10'}
                placeholder="john.doe@example.com"
                disabled={submitting}
              />
            </div>
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
            <p className="text-surface-400 text-xs mt-1">Valid email format (e.g., user@example.com)</p>
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="label">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={formErrors.phoneNumber ? 'input-error pl-10' : 'input pl-10'}
                placeholder="9876543210"
                disabled={submitting}
              />
            </div>
            {formErrors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>
            )}
            <p className="text-surface-400 text-xs mt-1">Indian mobile (10 digits, starts with 6-9)</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setFormData({ name: '', email: '', phoneNumber: '' });
                setFormErrors({});
              }}
              className="btn-secondary flex-1"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;

