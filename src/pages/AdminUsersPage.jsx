import React, { useState, useEffect } from 'react';
import { userAPI, roleAPI, authAPI } from '../services/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { 
  Search, 
  UserCheck, 
  UserX, 
  Unlock,
  Shield,
  Mail,
  Calendar,
  MoreVertical,
  Edit,
  UserPlus
} from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [actionMenuUser, setActionMenuUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        userAPI.getAll(),
        roleAPI.getAll()
      ]);
      setUsers(usersRes.data.content || usersRes.data);
      setRoles(rolesRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (user) => {
    try {
      if (user.enabled) {
        await userAPI.disable(user.id);
        toast.success(`User ${user.username} disabled`);
      } else {
        await userAPI.enable(user.id);
        toast.success(`User ${user.username} enabled`);
      }
      fetchData();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Operation failed';
      toast.error(errorMsg);
    }
    setActionMenuUser(null);
  };

  const handleUnlock = async (user) => {
    try {
      await userAPI.unlock(user.id);
      toast.success(`User ${user.username} unlocked`);
      fetchData();
    } catch (error) {
      toast.error('Failed to unlock user');
    }
    setActionMenuUser(null);
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles || []);
    setShowRoleModal(true);
    setActionMenuUser(null);
  };

  const handleRoleChange = async () => {
    try {
      const currentRoles = new Set(selectedUser.roles);
      const newRoles = new Set(selectedRoles);
      
      const rolesToAdd = selectedRoles.filter(r => !currentRoles.has(r));
      const rolesToRemove = [...currentRoles].filter(r => !newRoles.has(r));

      if (rolesToAdd.length > 0) {
        await userAPI.assignRoles(selectedUser.id, rolesToAdd);
      }
      if (rolesToRemove.length > 0) {
        await userAPI.removeRoles(selectedUser.id, rolesToRemove);
      }

      toast.success('Roles updated successfully');
      setShowRoleModal(false);
      fetchData();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to update roles';
      toast.error(errorMsg);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      await authAPI.register(formData);
      toast.success('User created successfully');
      setShowCreateUserModal(false);
      setFormData({ username: '', email: '', password: '' });
      fetchData();
    } catch (error) {
      if (error.response?.data) {
        const data = error.response.data;
        
        if (typeof data === 'object' && !data.error && !data.message) {
          setFormErrors(data);
          const firstError = Object.values(data)[0];
          if (firstError) {
            toast.error(firstError);
          }
        } else {
          toast.error(data.error || data.message || 'Failed to create user');
        }
      } else {
        toast.error('Failed to create user');
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-800">User Management</h1>
          <p className="text-surface-500">Manage users, roles, and permissions</p>
        </div>
        <button
          onClick={() => setShowCreateUserModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Create User
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by username or email..."
            className="input pl-12"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-surface-50 border-b border-surface-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-surface-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-surface-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                          <span className="text-brand-700 font-semibold">
                            {user.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-surface-800">{user.username}</p>
                          <p className="text-sm text-surface-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role) => (
                          <span key={role} className="badge-info text-xs">
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {!user.enabled ? (
                        <span className="badge-error">Disabled</span>
                      ) : user.accountLocked ? (
                        <span className="badge-warning">Locked</span>
                      ) : (
                        <span className="badge-success">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-500">
                      {user.lastLoginDate ? (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(user.lastLoginDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-surface-400">Never</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() => setActionMenuUser(actionMenuUser === user.id ? null : user.id)}
                          className="p-2 text-surface-500 hover:bg-surface-100 rounded-lg"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {actionMenuUser === user.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-40"
                              onClick={() => setActionMenuUser(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-surface-200 py-1 z-50 animate-fade-in">
                              <button
                                onClick={() => openRoleModal(user)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50"
                              >
                                <Shield className="w-4 h-4" />
                                Manage Roles
                              </button>
                              <button
                                onClick={() => handleToggleEnabled(user)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50"
                              >
                                {user.enabled ? (
                                  <>
                                    <UserX className="w-4 h-4" />
                                    Disable User
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4" />
                                    Enable User
                                  </>
                                )}
                              </button>
                              {user.accountLocked && (
                                <button
                                  onClick={() => handleUnlock(user)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50"
                                >
                                  <Unlock className="w-4 h-4" />
                                  Unlock Account
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Assignment Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title={`Manage Roles - ${selectedUser?.username}`}
      >
        <div className="space-y-4">
          <p className="text-surface-500">
            Select the roles to assign to this user.
          </p>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {roles.map((role) => (
              <label
                key={role.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-surface-200 hover:bg-surface-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRoles([...selectedRoles, role.name]);
                    } else {
                      setSelectedRoles(selectedRoles.filter(r => r !== role.name));
                    }
                  }}
                  className="w-4 h-4 text-brand-600 rounded border-surface-300 focus:ring-brand-500"
                />
                <div>
                  <p className="font-medium text-surface-800">{role.name}</p>
                  <p className="text-sm text-surface-500">{role.description}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowRoleModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleRoleChange}
              className="btn-primary flex-1"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateUserModal}
        onClose={() => {
          setShowCreateUserModal(false);
          setFormData({ username: '', email: '', password: '' });
          setFormErrors({});
        }}
        title="Create New User"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={`input ${formErrors.username ? 'border-red-500' : ''}`}
              placeholder="Enter username"
              required
            />
            {formErrors.username && (
              <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`input ${formErrors.email ? 'border-red-500' : ''}`}
              placeholder="Enter email address"
              required
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`input ${formErrors.password ? 'border-red-500' : ''}`}
              placeholder="Enter password (min 8 characters)"
              required
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
            <p className="mt-1 text-xs text-surface-500">
              Password must be at least 8 characters long
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowCreateUserModal(false);
                setFormData({ username: '', email: '', password: '' });
                setFormErrors({});
              }}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              Create User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;

