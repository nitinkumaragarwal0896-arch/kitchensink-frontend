import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import { validateField, validatePassword } from '../utils/validation';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Calendar, Shield, Edit, Check, X, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Change Password state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.get();
      setProfile(response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        email: response.data.email || '',
        phoneNumber: response.data.phoneNumber || '',
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const errorMessage = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix the validation errors');
      return;
    }

    setSubmitting(true);

    try {
      await profileAPI.update(formData);
      toast.success('Profile updated successfully!');
      setEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.error || errorData?.message || 'Failed to update profile';
      
      // Handle field-specific errors
      if (message.toLowerCase().includes('email')) {
        setFormErrors({ email: message });
      } else if (message.toLowerCase().includes('phone')) {
        setFormErrors({ phoneNumber: message });
      }
      
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phoneNumber: profile.phoneNumber || '',
    });
    setFormErrors({});
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    setPasswordErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      const passwordValidation = validatePassword(passwordForm.newPassword);
      if (!passwordValidation.valid) {
        errors.newPassword = passwordValidation.error;
      }
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      toast.error('Please fix the validation errors');
      return;
    }
    
    setChangingPassword(true);
    
    try {
      const response = await profileAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      
      toast.success('Password changed successfully! Redirecting to login...');
      
      // Clear form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
      
      // Clear auth data and redirect with full page reload to avoid blank screen
      setTimeout(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Use window.location instead of navigate to force full page reload
        window.location.href = '/login';
      }, 1500);
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.error || errorData?.message || 'Failed to change password';
      
      // Handle specific field errors
      if (message.toLowerCase().includes('current password')) {
        setPasswordErrors({ currentPassword: message });
      } else if (message.toLowerCase().includes('new password')) {
        setPasswordErrors({ newPassword: message });
      }
      
      toast.error(message);
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user || loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-surface-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-surface-800">My Profile</h1>
        <p className="text-surface-500 mt-2">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="card p-8">
        {/* Avatar & Username */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-surface-200">
          <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center">
            <span className="text-brand-700 font-bold text-3xl">
              {profile.firstName?.charAt(0).toUpperCase() || profile.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-surface-800">
              {profile.firstName && profile.lastName
                ? `${profile.firstName} ${profile.lastName}`
                : profile.username}
            </h2>
            <p className="text-surface-500">@{profile.username}</p>
            <div className="flex items-center gap-2 mt-2">
              {profile.enabled ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Shield className="w-3 h-3" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <Shield className="w-3 h-3" />
                  Disabled
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                <User className="w-4 h-4 inline mr-1" />
                First Name
              </label>
              {editing ? (
                <>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={formErrors.firstName ? 'input-error' : 'input'}
                    placeholder="John"
                  />
                  {formErrors.firstName && (
                    <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.firstName}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-surface-800 font-medium py-2">
                  {profile.firstName || <span className="text-surface-400">Not set</span>}
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <User className="w-4 h-4 inline mr-1" />
                Last Name
              </label>
              {editing ? (
                <>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={formErrors.lastName ? 'input-error' : 'input'}
                    placeholder="Doe"
                  />
                  {formErrors.lastName && (
                    <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.lastName}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-surface-800 font-medium py-2">
                  {profile.lastName || <span className="text-surface-400">Not set</span>}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address
            </label>
            {editing ? (
              <>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={formErrors.email ? 'input-error' : 'input'}
                  placeholder="john.doe@example.com"
                />
                {formErrors.email && (
                  <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.email}
                  </p>
                )}
              </>
            ) : (
              <p className="text-surface-800 font-medium py-2">{profile.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="label">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            {editing ? (
              <>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={formErrors.phoneNumber ? 'input-error' : 'input'}
                  placeholder="9876543210"
                  maxLength="10"
                />
                {formErrors.phoneNumber && (
                  <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.phoneNumber}
                  </p>
                )}
                {!formErrors.phoneNumber && (
                  <p className="text-xs text-surface-500 mt-1">
                    ℹ️ 10 digits starting with 6, 7, 8, or 9 (without +91)
                  </p>
                )}
              </>
            ) : (
              <p className="text-surface-800 font-medium py-2">
                {profile.phoneNumber || <span className="text-surface-400">Not set</span>}
              </p>
            )}
          </div>

          {/* Account Info */}
          <div className="pt-6 border-t border-surface-200">
            <h3 className="font-semibold text-surface-800 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-surface-600">
                <Calendar className="w-4 h-4 text-surface-400" />
                <span>
                  <strong>Member since:</strong>{' '}
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-surface-600">
                <Calendar className="w-4 h-4 text-surface-400" />
                <span>
                  <strong>Last login:</strong>{' '}
                  {profile.lastLoginDate
                    ? new Date(profile.lastLoginDate).toLocaleDateString()
                    : 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* Roles & Permissions */}
          {profile.roles && profile.roles.length > 0 && (
            <div className="pt-6 border-t border-surface-200">
              <h3 className="font-semibold text-surface-800 mb-4">Roles & Permissions</h3>
              
              {/* Roles */}
              <div className="mb-4">
                <p className="text-sm text-surface-600 mb-2"><strong>Your Roles:</strong></p>
                <div className="flex flex-wrap gap-2">
                  {profile.roles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800"
                    >
                      <Shield className="w-3 h-3" />
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              {profile.permissions && profile.permissions.length > 0 && (
                <div>
                  <p className="text-sm text-surface-600 mb-2"><strong>Your Permissions:</strong></p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {profile.permissions.map((permission, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs text-surface-700 bg-surface-50 px-3 py-2 rounded-md"
                      >
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="font-mono">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="btn-secondary flex-1"
                  disabled={submitting}
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="btn-primary"
              >
                <Edit className="w-5 h-5" />
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="card p-8 mt-6">
        <button
          type="button"
          onClick={() => setShowPasswordSection(!showPasswordSection)}
          className="w-full flex items-center justify-between mb-6 group"
        >
          <div>
            <h2 className="font-display text-xl font-semibold text-surface-800 flex items-center gap-2 text-left group-hover:text-brand-600 transition-colors">
              <Lock className="w-5 h-5" />
              Change Password
            </h2>
            <p className="text-surface-500 text-sm mt-1 text-left">
              {showPasswordSection ? 'Click to collapse' : 'Click to expand and update your password'}
            </p>
          </div>
          <div className={`transform transition-transform ${showPasswordSection ? 'rotate-180' : ''}`}>
            <svg className="w-6 h-6 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {showPasswordSection && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="label">Current Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className={passwordErrors.currentPassword ? 'input-error pl-10 pr-12' : 'input pl-10 pr-12'}
                placeholder="Enter your current password"
                disabled={changingPassword}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {passwordErrors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="label">New Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className={passwordErrors.newPassword ? 'input-error pl-10 pr-12' : 'input pl-10 pr-12'}
                placeholder="Enter your new password"
                disabled={changingPassword}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {passwordErrors.newPassword}
              </p>
            )}
            <p className="text-xs text-surface-500 mt-1">
              Min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
            </p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="label">Confirm New Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                className={passwordErrors.confirmPassword ? 'input-error pl-10 pr-12' : 'input pl-10 pr-12'}
                placeholder="Confirm your new password"
                disabled={changingPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {passwordErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="btn-primary"
              disabled={changingPassword}
            >
              {changingPassword ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Changing Password...
                </span>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

