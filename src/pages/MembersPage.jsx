import React, { useState, useEffect } from 'react';
import { memberAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail,
  User,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

const MembersPage = () => {
  const { hasPermission, isAdmin } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await memberAPI.getAll();
      setMembers(response.data);
      setAccessDenied(false);
    } catch (error) {
      if (error.response?.status === 403) {
        setAccessDenied(true);
      } else {
        toast.error('Failed to fetch members');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phoneNumber: '' });
    setFormErrors({});
    setEditingMember(null);
  };

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        phoneNumber: member.phoneNumber,
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
    setSubmitting(true);
    setFormErrors({});

    try {
      if (editingMember) {
        await memberAPI.update(editingMember.id, formData);
        toast.success('Member updated successfully!');
      } else {
        await memberAPI.create(formData);
        toast.success('Member registered successfully!');
      }
      closeModal();
      fetchMembers();
    } catch (error) {
      // Handle validation errors from backend
      if (error.response?.data) {
        const data = error.response.data;
        
        // Check if it's a validation error response (object with field errors)
        if (typeof data === 'object' && !data.error && !data.message) {
          // It's field-level validation errors: { "name": "error message", "email": "error message" }
          setFormErrors(data);
          
          // Show the first error as a toast
          const firstError = Object.values(data)[0];
          if (firstError) {
            toast.error(firstError);
          }
        } else {
          // It's a general error with "error" or "message" field
          toast.error(data.error || data.message || 'Operation failed');
        }
      } else {
        toast.error('Operation failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      return;
    }

    try {
      await memberAPI.delete(member.id);
      toast.success('Member deleted successfully');
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete member');
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phoneNumber.includes(searchTerm)
  );

  const canCreate = hasPermission('member:create') || true; // Default to true for USER role
  const canUpdate = hasPermission('member:update') || true;
  const canDelete = hasPermission('member:delete') || isAdmin();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-800">Members</h1>
          <p className="text-surface-500">Manage your organization's member registry</p>
        </div>
        {canCreate && (
          <button onClick={() => openModal()} className="btn-primary">
            <Plus className="w-5 h-5" />
            Register Member
          </button>
        )}
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="input pl-12"
          />
        </div>
      </div>

      {/* Members List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50 border-b border-surface-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-surface-500">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading members...
                    </div>
                  </td>
                </tr>
              ) : accessDenied ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-surface-800 mb-1">
                          Access Denied
                        </h3>
                        <p className="text-surface-500 max-w-md">
                          You don't have permission to view members. Please contact your administrator to request the <span className="font-mono text-sm bg-surface-100 px-1 rounded">member:read</span> permission.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-surface-500">
                    {searchTerm ? 'No members found matching your search.' : 'No members registered yet.'}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, index) => (
                  <tr 
                    key={member.id} 
                    className="hover:bg-surface-50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-brand-700 font-semibold">
                            {member.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-surface-800">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-surface-600">
                        <Mail className="w-4 h-4 text-surface-400" />
                        {member.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-surface-600 font-mono text-sm">
                        <Phone className="w-4 h-4 text-surface-400" />
                        {member.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {canUpdate && (
                          <button
                            onClick={() => openModal(member)}
                            className="p-2 text-surface-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Edit member"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(member)}
                            className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-50 border-t border-surface-200">
          <p className="text-sm text-surface-500">
            {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      {/* Member Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingMember ? 'Edit Member' : 'Register New Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">
              <User className="w-4 h-4 inline mr-1" />
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={formErrors.name ? 'input-error' : 'input'}
              placeholder="Enter full name"
              required
            />
            {formErrors.name && (
              <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.name}
              </p>
            )}
            <p className="text-xs text-surface-400 mt-1">Must not contain numbers</p>
          </div>

          <div>
            <label className="label">
              <Mail className="w-4 h-4 inline mr-1" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? 'input-error' : 'input'}
              placeholder="member@example.com"
              required
            />
            {formErrors.email && (
              <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="label">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={formErrors.phoneNumber ? 'input-error' : 'input'}
              placeholder="1234567890"
              required
            />
            {formErrors.phoneNumber && (
              <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.phoneNumber}
              </p>
            )}
            <p className="text-xs text-surface-400 mt-1">10-12 digits, numbers only</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  {editingMember ? 'Update' : 'Register'}
                </span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MembersPage;

