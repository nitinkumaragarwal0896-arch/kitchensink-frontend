import React, { useState, useEffect } from 'react';
import { sessionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Chrome, 
  Globe,
  Clock,
  MapPin,
  Trash2,
  LogOut,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const ActiveSessionsPage = () => {
  const { logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await sessionAPI.getAll(refreshToken);
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      toast.error('Failed to fetch active sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId, isCurrent) => {
    if (isCurrent) {
      const confirmed = window.confirm(
        '⚠️ Warning: You are about to revoke your CURRENT session.\n\n' +
        'This will log you out immediately. Are you sure?'
      );
      if (!confirmed) return;
    }

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await sessionAPI.revoke(sessionId, refreshToken);
      
      if (response.data.isCurrentSession) {
        toast.success('Current session revoked. Logging out...');
        setTimeout(() => logout(), 1500); // Give user time to see the message
      } else {
        toast.success('Session revoked successfully');
        fetchSessions();
      }
    } catch (error) {
      console.error('Failed to revoke session:', error);
      toast.error('Failed to revoke session');
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm('Are you sure you want to logout from all devices? This will end all your active sessions except the current one.')) {
      return;
    }

    try {
      await sessionAPI.logoutAll();
      toast.success('Logged out from all devices');
      fetchSessions();
    } catch (error) {
      console.error('Failed to logout from all devices:', error);
      toast.error('Failed to logout from all devices');
    }
  };

  const getDeviceIcon = (deviceInfo) => {
    const lower = deviceInfo.toLowerCase();
    if (lower.includes('iphone') || lower.includes('android')) return Smartphone;
    if (lower.includes('ipad') || lower.includes('tablet')) return Tablet;
    return Monitor;
  };

  const getBrowserIcon = (deviceInfo) => {
    if (deviceInfo.includes('Chrome')) return Chrome;
    return Globe;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-800">Active Sessions</h1>
          <p className="text-surface-500">Manage your active login sessions across devices</p>
        </div>
        {sessions.length > 1 && (
          <button
            onClick={handleLogoutAll}
            className="btn-danger flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout All Other Devices
          </button>
        )}
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="card p-12 text-center">
          <div className="flex items-center justify-center gap-2 text-surface-500">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading sessions...
          </div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="card p-12">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-surface-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-surface-800 mb-1">
                No Active Sessions
              </h3>
              <p className="text-surface-500">
                You don't have any active sessions at the moment.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session, index) => {
            const DeviceIcon = getDeviceIcon(session.deviceInfo);
            const BrowserIcon = getBrowserIcon(session.deviceInfo);
            const isCurrent = session.isCurrent;

            return (
              <div 
                key={session.id} 
                className={`card p-6 hover:shadow-lg transition-shadow animate-fade-in ${
                  isCurrent ? 'ring-2 ring-brand-500' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isCurrent ? 'bg-brand-600' : 'bg-brand-100'
                    }`}>
                      <DeviceIcon className={`w-6 h-6 ${isCurrent ? 'text-white' : 'text-brand-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-800 flex items-center gap-2">
                        <BrowserIcon className="w-4 h-4" />
                        {session.deviceInfo}
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Current
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-surface-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {session.ipAddress}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevokeSession(session.id, isCurrent)}
                    className={`p-2 rounded-lg transition-colors ${
                      isCurrent 
                        ? 'text-orange-600 hover:bg-orange-50' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title={isCurrent ? "Revoke current session (will logout)" : "Revoke this session"}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 text-sm text-surface-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-surface-400" />
                    <span>Last active: <strong>{formatTime(session.lastUsedAt)}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-surface-400" />
                    <span>Signed in: {formatTime(session.issuedAt)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-surface-100">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Active
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Session Management</p>
            <p className="text-blue-700 mb-2">
              You can have up to <strong>5 active sessions</strong> at a time. When you exceed this limit, the oldest session will be automatically logged out. 
              Use "Logout All Other Devices" if you suspect unauthorized access.
            </p>
            <p className="text-blue-700 text-xs mt-2 border-t border-blue-200 pt-2">
              <strong>Note:</strong> After revoking a session, the access token remains valid for up to 15 minutes, but the user cannot get a new access token. 
              If you revoke your current session, you will be logged out immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveSessionsPage;
