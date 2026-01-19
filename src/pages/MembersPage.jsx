import React, { useState, useEffect } from 'react';
import { memberAPI, jobAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { validateField, validateMember } from '../utils/validation';
import { formatDistanceToNow, format } from 'date-fns';
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
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  UserCheck,
  CheckSquare,
  Square,
  Upload
} from 'lucide-react';

const MembersPage = () => {
  const { hasPermission, isAdmin } = useAuth();
  const { t } = useTranslation();
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

  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(true);

  // Bulk delete state
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Excel upload state
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch members when page, size, or search changes
  useEffect(() => {
    // Debounce search: wait 500ms after user stops typing
    const debounceTimer = setTimeout(() => {
      fetchMembers();
    }, searchTerm ? 500 : 0); // Debounce only for search, immediate for pagination

    return () => clearTimeout(debounceTimer);
  }, [page, size, searchTerm]); // Re-fetch when page, size, or search changes

  // Listen for job completion (bulk delete, excel upload)
  useEffect(() => {
    const handleJobCompleted = (event) => {
      const { jobType } = event.detail || {};
      if (jobType === 'BULK_DELETE' || jobType === 'EXCEL_UPLOAD') {
        console.log(`[MembersPage] ${jobType} job completed, refreshing members...`);
        fetchMembers();
      }
    };

    window.addEventListener('jobCompleted', handleJobCompleted);
    return () => window.removeEventListener('jobCompleted', handleJobCompleted);
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = { 
        page, 
        size, 
        sort: 'name,asc'
      };
      
      // Add search parameter if search term exists
      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
      const response = await memberAPI.getAll(params);
      
      // The API now returns paginated response
      setMembers(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setIsFirst(response.data.first);
      setIsLast(response.data.last);
      setAccessDenied(false);
    } catch (error) {
      if (error.response?.status === 403) {
        setAccessDenied(true);
      } else {
        toast.error('Failed to fetch members');
      }
    } finally {
      setLoading(false);
      // Clear selections when fetching new page
      setSelectedMembers([]);
    }
  };

  // Checkbox handling
  const toggleSelectAll = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map(m => m.id));
    }
  };

  const toggleSelectMember = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  // Excel upload handler
  const handleExcelUpload = async () => {
    if (!excelFile) {
      toast.error(t('members.excel.noFile'));
      return;
    }

    setUploading(true);
    try {
      const response = await jobAPI.excelUploadMembers(excelFile);
      toast.success(t('members.excel.jobCreated'));
      setShowExcelModal(false);
      setExcelFile(null);

      // Notify JobsSidebar that a new job was created
      window.dispatchEvent(new CustomEvent('jobCreated'));
    } catch (error) {
      const errorMsg = error.response?.data?.error || t('members.excel.uploadFailed');
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast.error(t('members.excel.invalidFormat'));
        return;
      }
      setExcelFile(file);
    }
  };

  // Smart delete: 1 member = normal delete, 2+ members = bulk delete (async job)
  const handleBulkDelete = async () => {
    if (selectedMembers.length === 0) {
      toast.error(t('members.bulk.noSelection'));
      return;
    }

    // If only 1 member selected, use normal delete flow (immediate)
    if (selectedMembers.length === 1) {
      const memberId = selectedMembers[0];
      const member = members.find(m => m.id === memberId);
      
      if (!window.confirm(`Are you sure you want to delete ${member?.name || 'this member'}?`)) {
        return;
      }

      setIsDeleting(true);
      try {
        await memberAPI.delete(memberId);
        toast.success(t('toast.deleteSuccess'));
        setSelectedMembers([]);
        
        // Check if this was the last item on the current page
        if (members.length === 1 && page > 0) {
          setPage(page - 1);
        } else {
          fetchMembers();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || t('toast.operationFailed'));
      } finally {
        setIsDeleting(false);
      }
      return;
    }

    // For 2+ members, use bulk delete (async job)
    if (!window.confirm(t('members.bulk.confirmDelete', { count: selectedMembers.length }))) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await jobAPI.bulkDeleteMembers(selectedMembers);
      toast.success(t('members.bulk.jobCreated'));
      setSelectedMembers([]);
      
      // Notify JobsSidebar that a new job was created
      window.dispatchEvent(new CustomEvent('jobCreated'));
      
      // Don't refresh immediately - let the job sidebar show progress
      // User can manually refresh or wait for job to complete
    } catch (error) {
      const errorMsg = error.response?.data?.error || t('members.bulk.deleteFailed');
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Real-time validation: validate as user types
    const errorMessage = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: errorMessage }));
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

    // Step 1: Client-side validation (matching backend rules)
    const validation = validateMember(formData);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      
      // Show the first error as a toast
      const firstError = Object.values(validation.errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      
      setSubmitting(false);
      return;
    }

    // Clear any previous errors
    setFormErrors({});

    // Step 2: Submit to backend (for duplicate check and save)
    try {
      let response;
      if (editingMember) {
        response = await memberAPI.update(editingMember.id, formData);
        // Use localized message from backend
        toast.success(response.data?.message || t('success.memberUpdated'));
      } else {
        response = await memberAPI.create(formData);
        // Use localized message from backend
        toast.success(response.data?.message || t('success.memberCreated'));
      }
      closeModal();
      fetchMembers();
    } catch (error) {
      // Handle validation errors from backend (e.g., duplicate email)
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
          const errorMsg = data.error || data.message || 'Operation failed';
          
          // If it's a validation error, try to parse it to a field
          if (errorMsg.includes('Email') || errorMsg.toLowerCase().includes('email')) {
            setFormErrors({ email: errorMsg });
          } else if (errorMsg.includes('Phone') || errorMsg.toLowerCase().includes('phone')) {
            setFormErrors({ phoneNumber: errorMsg });
          } else if (errorMsg.includes('Name') || errorMsg.toLowerCase().includes('name')) {
            setFormErrors({ name: errorMsg });
          }
          
          toast.error(errorMsg);
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
      
      // Check if this was the last item on the current page
      if (members.length === 1 && page > 0) {
        // Navigate to previous page if we deleted the last item on a page > 0
        setPage(page - 1);
      } else {
        // Otherwise, just refresh the current page
        fetchMembers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete member');
    }
  };

  // Permissions check
  const canCreate = hasPermission('member:create') || true; // Default to true for USER role
  const canUpdate = hasPermission('member:update') || true;
  const canDelete = hasPermission('member:delete') || isAdmin();

  // Pagination handlers
  const handlePreviousPage = () => {
    if (!isFirst) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (!isLast) {
      setPage(page + 1);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setSize(newSize);
    setPage(0); // Reset to first page when changing size
  };

  // Calculate display range
  const startItem = totalElements === 0 ? 0 : (page * size) + 1;
  const endItem = Math.min((page + 1) * size, totalElements);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-800">{t('members.title')}</h1>
          <p className="text-surface-500">{t('members.subtitle')}</p>
          {selectedMembers.length > 0 && (
            <p className="text-sm text-brand-600 font-medium mt-1">
              {t('members.bulk.selected', { count: selectedMembers.length })}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {selectedMembers.length > 0 && canDelete && (
            <button 
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="btn-secondary text-red-600 hover:bg-red-50 border-red-300"
            >
              <Trash2 className="w-5 h-5" />
              {isDeleting ? t('members.bulk.deleting') : t('members.bulk.deleteSelected')}
            </button>
          )}
          {canCreate && (
            <>
              <button 
                onClick={() => setShowExcelModal(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                {t('members.excel.upload')}
              </button>
              <button onClick={() => openModal()} className="btn-primary">
                <Plus className="w-5 h-5" />
                {t('members.register')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0); // Reset to first page when searching
            }}
            placeholder={t('members.search')}
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
                {canDelete && (
                  <th className="px-4 py-4 text-left">
                    <button
                      onClick={toggleSelectAll}
                      className="p-1 hover:bg-surface-100 rounded transition-colors"
                      title={selectedMembers.length === members.length ? t('members.bulk.deselectAll') : t('members.bulk.selectAll')}
                    >
                      {selectedMembers.length === members.length && members.length > 0 ? (
                        <CheckSquare className="w-5 h-5 text-brand-600" />
                      ) : (
                        <Square className="w-5 h-5 text-surface-400" />
                      )}
                    </button>
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Added
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {loading ? (
                <tr>
                  <td colSpan={canDelete ? "6" : "5"} className="px-6 py-12 text-center text-surface-500">
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
                  <td colSpan={canDelete ? "6" : "5"} className="px-6 py-12">
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
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={canDelete ? "6" : "5"} className="px-6 py-12 text-center text-surface-500">
                    {searchTerm ? 'No members found matching your search.' : 'No members registered yet.'}
                  </td>
                </tr>
              ) : (
                members.map((member, index) => (
                  <tr 
                    key={member.id} 
                    className="hover:bg-surface-50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {canDelete && (
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleSelectMember(member.id)}
                          className="p-1 hover:bg-surface-100 rounded transition-colors"
                        >
                          {selectedMembers.includes(member.id) ? (
                            <CheckSquare className="w-5 h-5 text-brand-600" />
                          ) : (
                            <Square className="w-5 h-5 text-surface-400" />
                          )}
                        </button>
                      </td>
                    )}
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
                      <div className="flex flex-col gap-1">
                        {member.createdAt && (
                          <div className="flex items-center gap-2 text-sm text-surface-600">
                            <Clock className="w-3.5 h-3.5 text-surface-400" />
                            <span title={format(new Date(member.createdAt), 'PPpp')}>
                              {formatDistanceToNow(new Date(member.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        )}
                        {member.createdBy && (
                          <div className="flex items-center gap-2 text-xs text-surface-500">
                            <UserCheck className="w-3 h-3 text-surface-400" />
                            <span>{t('members.by', { user: member.createdBy })}</span>
                          </div>
                        )}
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

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-surface-50 border-t border-surface-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left: Items info */}
            <div className="flex items-center gap-4">
              <p className="text-sm text-surface-500">
                Showing {startItem}-{endItem} of {totalElements} members
              </p>
              
              {/* Page size selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-surface-500">Show:</span>
                <select
                  value={size}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="text-sm border border-surface-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* Right: Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={isFirst}
                  className={`p-2 rounded-lg border transition-colors ${
                    isFirst
                      ? 'border-surface-200 text-surface-300 cursor-not-allowed'
                      : 'border-surface-200 text-surface-600 hover:bg-surface-100 hover:border-surface-300'
                  }`}
                  title="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      index === 0 || // First page
                      index === totalPages - 1 || // Last page
                      Math.abs(index - page) <= 1; // Pages near current

                    if (!showPage) {
                      // Show ellipsis for skipped pages
                      if (index === page - 2 || index === page + 2) {
                        return (
                          <span key={index} className="px-2 text-surface-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => setPage(index)}
                        className={`min-w-[2.5rem] h-10 px-3 rounded-lg font-medium transition-colors ${
                          index === page
                            ? 'bg-brand-600 text-white'
                            : 'text-surface-600 hover:bg-surface-100'
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={isLast}
                  className={`p-2 rounded-lg border transition-colors ${
                    isLast
                      ? 'border-surface-200 text-surface-300 cursor-not-allowed'
                      : 'border-surface-200 text-surface-600 hover:bg-surface-100 hover:border-surface-300'
                  }`}
                  title="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
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
              placeholder="John Doe"
              required
            />
            {formErrors.name && (
              <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.name}
              </p>
            )}
            {!formErrors.name && (
              <p className="text-xs text-surface-500 mt-1">
                ℹ️ Letters, spaces, hyphens, and apostrophes only (2-50 characters)
              </p>
            )}
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
              placeholder="john.doe@example.com"
              required
            />
            {formErrors.email && (
              <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.email}
              </p>
            )}
            {!formErrors.email && (
              <p className="text-xs text-surface-500 mt-1">
                ℹ️ Enter a valid email address (e.g., john@example.com)
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
              placeholder="9876543210"
              maxLength="10"
              required
            />
            {formErrors.phoneNumber && (
              <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.phoneNumber}
              </p>
            )}
            {!formErrors.phoneNumber && (
              <p className="text-xs text-surface-500 mt-1">
                ℹ️ Indian mobile number: 10 digits starting with 6, 7, 8, or 9 (without +91)
              </p>
            )}
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

      {/* Excel Upload Modal */}
      <Modal
        isOpen={showExcelModal}
        onClose={() => {
          setShowExcelModal(false);
          setExcelFile(null);
        }}
        title={t('members.excel.uploadTitle')}
      >
        <div className="space-y-4">
          <p className="text-surface-500 text-sm">
            {t('members.excel.uploadDescription')}
          </p>

          {/* File Format Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              {t('members.excel.formatTitle')}
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>{t('members.excel.formatRow1')}</p>
              <p>{t('members.excel.formatRow2')}</p>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              <strong>{t('members.excel.example')}:</strong>
              <code className="block mt-1 bg-white px-2 py-1 rounded">
                Name | Email | Phone<br/>
                John Doe | john@example.com | 9876543210
              </code>
            </div>
          </div>

          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              {t('members.excel.selectFile')}
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-surface-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-brand-50 file:text-brand-700
                hover:file:bg-brand-100
                cursor-pointer"
              disabled={uploading}
            />
            {excelFile && (
              <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
                <Check className="w-4 h-4" />
                {excelFile.name}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowExcelModal(false);
                setExcelFile(null);
              }}
              className="btn-secondary"
              disabled={uploading}
            >
              {t('form.cancel')}
            </button>
            <button
              type="button"
              onClick={handleExcelUpload}
              className="btn-primary"
              disabled={!excelFile || uploading}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  {t('members.excel.uploading')}
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  {t('members.excel.upload')}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MembersPage;

