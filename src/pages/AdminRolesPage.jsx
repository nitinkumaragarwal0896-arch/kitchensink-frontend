import React, { useState, useEffect } from 'react';
import { roleAPI } from '../services/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Shield, 
  Edit, 
  Trash2,
  Lock,
  Check
} from 'lucide-react';

const AdminRolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        roleAPI.getAll(),
        roleAPI.getPermissions()
      ]);
      setRoles(rolesRes.data);
      setPermissions(permissionsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', permissions: [] });
    setEditingRole(null);
  };

  const openModal = (role = null) => {
    if (role) {
      // Prevent editing ADMIN role
      if (role.name === 'ADMIN') {
        toast.error('Cannot edit ADMIN role - it is protected to maintain system stability');
        return;
      }
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions || [],
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingRole) {
        await roleAPI.update(editingRole.id, formData);
        toast.success('Role updated successfully');
      } else {
        await roleAPI.create(formData);
        toast.success('Role created successfully');
      }
      closeModal();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (role) => {
    // Role deletion is disabled to prevent system instability
    toast.error('Role deletion is currently disabled to maintain data integrity');
    return;
    
    // Original deletion logic (kept for reference):
    // if (role.systemRole) {
    //   toast.error('Cannot delete system roles');
    //   return;
    // }
    //
    // if (!window.confirm(`Are you sure you want to delete the ${role.name} role?`)) {
    //   return;
    // }
    //
    // try {
    //   await roleAPI.delete(role.id);
    //   toast.success('Role deleted successfully');
    //   fetchData();
    // } catch (error) {
    //   toast.error(error.response?.data?.message || 'Failed to delete role');
    // }
  };

  const togglePermission = (permission) => {
    setFormData(prev => {
      const perms = prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions: perms };
    });
  };

  // Group permissions by category (extract from "resource:action" format)
  const groupedPermissions = permissions.reduce((acc, perm) => {
    // perm is a string like "member:read" or "system:admin"
    const [resource, action] = perm.split(':');
    const category = resource.toUpperCase();
    if (!acc[category]) acc[category] = [];
    acc[category].push(perm);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-800">Role Management</h1>
          <p className="text-surface-500">Create and manage roles with fine-grained permissions</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="w-5 h-5" />
          Create Role
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-surface-500">
            Loading roles...
          </div>
        ) : (
          roles.map((role) => (
            <div key={role.id} className="card p-6 hover:shadow-glow transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-100 rounded-lg">
                    <Shield className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-800 flex items-center gap-2">
                      {role.name}
                      {role.systemRole && (
                        <Lock className="w-3 h-3 text-surface-400" title="System role" />
                      )}
                    </h3>
                    <p className="text-sm text-surface-500">{role.description}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                  Permissions ({role.permissions?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions?.slice(0, 6).map((perm) => (
                    <span key={perm} className="badge bg-surface-100 text-surface-600 text-xs">
                      {perm}
                    </span>
                  ))}
                  {role.permissions?.length > 6 && (
                    <span className="badge bg-surface-100 text-surface-500 text-xs">
                      +{role.permissions.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-surface-100">
                {!role.systemRole && role.name !== 'ADMIN' && (
                  <button
                    onClick={() => openModal(role)}
                    className="btn-secondary flex-1 py-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
                {(role.systemRole || role.name === 'ADMIN') && (
                  <div className="flex-1 py-2 px-3 text-sm text-surface-500 bg-surface-50 rounded-lg flex items-center justify-center gap-2 border border-surface-200">
                    <Lock className="w-4 h-4" />
                    <span>System Role - Protected</span>
                  </div>
                )}
                
                {/* Delete button - disabled for all roles */}
                <button
                  onClick={() => handleDelete(role)}
                  disabled
                  className="btn-ghost py-2 px-3 opacity-40 cursor-not-allowed"
                  title="Role deletion is disabled to maintain data integrity"
                >
                  <Trash2 className="w-4 h-4 text-surface-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Role Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingRole ? 'Edit Role' : 'Create New Role'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Role Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="e.g., EDITOR"
              required
              disabled={editingRole?.systemRole}
            />
          </div>

          <div>
            <label className="label">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              placeholder="Brief description of this role"
            />
          </div>

          <div>
            <label className="label">Permissions</label>
            <div className="max-h-64 overflow-y-auto border border-surface-200 rounded-lg divide-y divide-surface-100">
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <div key={category} className="p-3">
                  <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                    {category}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {perms.map((perm) => (
                      <label
                        key={perm}
                        className="flex items-center gap-2 p-2 rounded hover:bg-surface-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm)}
                          onChange={() => togglePermission(perm)}
                          className="w-4 h-4 text-brand-600 rounded border-surface-300 focus:ring-brand-500"
                        />
                        <span className="text-sm text-surface-700">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={closeModal} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              <Check className="w-5 h-5" />
              {editingRole ? 'Update Role' : 'Create Role'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminRolesPage;

