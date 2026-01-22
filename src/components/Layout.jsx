import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import RecentActivity from './RecentActivity';
import JobsSidebar from './JobsSidebar';
import JobDetailsModal from './JobDetailsModal';
import { 
  Users, 
  UserCircle, 
  Shield, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  Settings,
  Monitor,
  User
} from 'lucide-react';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/members', label: t('nav.members'), icon: Users },
    { path: '/sessions', label: t('nav.sessions'), icon: Monitor },
  ];

  const adminItems = [
    { path: '/admin/users', label: t('nav.users'), icon: UserCircle },
    { path: '/admin/roles', label: t('nav.roles'), icon: Shield },
  ];

  const NavItem = ({ item, onClick }) => (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-brand-100 text-brand-700 font-medium'
            : 'text-surface-600 hover:bg-surface-100 hover:text-surface-800'
        }`
      }
    >
      <item.icon className="w-5 h-5" />
      <span>{item.label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-surface-200
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-surface-200">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 text-white" />
            </div>
            {/* Logo Text */}
            <div>
              <h1 className="font-display text-lg font-bold text-surface-800 leading-none">
                MemberHub
              </h1>
              <p className="text-xs font-medium text-brand-600 leading-none mt-0.5">PRO</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-surface-500 hover:text-surface-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} onClick={() => setSidebarOpen(false)} />
          ))}

          {isAdmin() && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Administration
                </p>
              </div>
              {adminItems.map((item) => (
                <NavItem key={item.path} item={item} onClick={() => setSidebarOpen(false)} />
              ))}
            </>
          )}
        </nav>

        {/* Recent Activity Feed */}
        <RecentActivity />

        {/* Jobs Sidebar - Shows background jobs */}
        <div className="mt-auto">
          <JobsSidebar onJobClick={handleJobClick} />
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-sm border-b border-surface-200">
          <div className="flex items-center justify-between h-full px-4 lg:px-8">
            {/* Mobile menu button */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-surface-600 hover:text-surface-800 hover:bg-surface-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Right side */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Language Selector */}
              <LanguageSelector />
              
              {/* User dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                    <span className="text-brand-700 font-semibold text-sm">
                      {user?.firstName?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-surface-700">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.username || 'User'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-surface-500" />
                </button>

                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-surface-200 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-surface-100">
                        <p className="text-sm font-medium text-surface-800">
                          {user?.firstName && user?.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user?.username}
                        </p>
                        <p className="text-xs text-surface-500 truncate">{user?.email}</p>
                        {user?.firstName && user?.lastName && (
                          <p className="text-xs text-surface-400 mt-0.5">@{user?.username}</p>
                        )}
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        {t('nav.profile')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal 
        job={selectedJob}
        isOpen={jobDetailsOpen}
        onClose={() => {
          setJobDetailsOpen(false);
          setSelectedJob(null);
        }}
      />
    </div>
  );
};

export default Layout;
