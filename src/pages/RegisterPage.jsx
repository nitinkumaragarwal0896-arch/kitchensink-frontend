import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { validateField, validateEmail, validatePassword, validateName, validatePhone } from '../utils/validation';
import { Eye, EyeOff, UserPlus, AlertCircle, Mail, Phone, User, Users } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Real-time validation as user types
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const validate = () => {
    const newErrors = {};
    
    // Validate username
    if (!formData.username || formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Validate first name
    const firstNameResult = validateName(formData.firstName);
    if (!firstNameResult.valid) {
      newErrors.firstName = firstNameResult.error;
    }
    
    // Validate last name
    const lastNameResult = validateName(formData.lastName);
    if (!lastNameResult.valid) {
      newErrors.lastName = lastNameResult.error;
    }
    
    // Validate email
    const emailResult = validateEmail(formData.email);
    if (!emailResult.valid) {
      newErrors.email = emailResult.error;
    }
    
    // Validate phone
    const phoneResult = validatePhone(formData.phoneNumber);
    if (!phoneResult.valid) {
      newErrors.phoneNumber = phoneResult.error;
    }
    
    // Validate password
    const passwordResult = validatePassword(formData.password);
    if (!passwordResult.valid) {
      newErrors.password = passwordResult.error;
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      const firstError = Object.values(errors).find(err => err);
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }
    
    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      });
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (error) {
      // Extract the specific error message from backend
      const errorData = error.response?.data;
      const message = errorData?.error || errorData?.message || 'Registration failed';
      
      // Handle field-specific errors
      if (errorData?.fieldErrors) {
        setErrors(errorData.fieldErrors);
      } else {
        // If it's a generic error about username or email, highlight the field
        if (message.toLowerCase().includes('username')) {
          setErrors({ username: message });
        } else if (message.toLowerCase().includes('email')) {
          setErrors({ email: message });
        }
      }
      
      // Show the specific error message to user
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-4 mb-6">
            {/* Logo Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            {/* Logo Text */}
            <div>
              <h1 className="font-display text-5xl font-bold text-white leading-none">
                MemberHub
              </h1>
              <p className="text-xl font-semibold text-brand-400 leading-none mt-1">PRO</p>
            </div>
          </div>
          <p className="text-surface-400 text-lg max-w-md leading-relaxed">
            Create your account to access the member registration system and manage your organization's contacts.
          </p>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            {/* Logo Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            {/* Logo Text */}
            <div>
              <h1 className="font-display text-3xl font-bold text-surface-800 leading-none">
                MemberHub
              </h1>
              <p className="text-sm font-semibold text-brand-600 leading-none mt-0.5">PRO</p>
            </div>
          </div>

          <div className="card p-8">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-semibold text-surface-800">
                Create account
              </h2>
              <p className="text-surface-500 mt-2">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <User className="w-4 h-4 inline mr-1" />
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'input-error' : 'input'}
                    placeholder="John"
                    required
                  />
                  {errors.firstName && (
                    <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="label">
                    <User className="w-4 h-4 inline mr-1" />
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'input-error' : 'input'}
                    placeholder="Doe"
                    required
                  />
                  {errors.lastName && (
                    <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              {!errors.firstName && !errors.lastName && (
                <p className="text-xs text-surface-500 -mt-2">
                  ℹ️ Letters, spaces, hyphens, and apostrophes only (2-50 characters)
                </p>
              )}

              {/* Username */}
              <div>
                <label className="label">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'input-error' : 'input'}
                  placeholder="johndoe"
                  required
                />
                {errors.username && (
                  <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username}
                  </p>
                )}
                {!errors.username && (
                  <p className="text-xs text-surface-500 mt-1">
                    ℹ️ Minimum 3 characters, unique username
                  </p>
                )}
              </div>

              {/* Email */}
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
                  className={errors.email ? 'input-error' : 'input'}
                  placeholder="john.doe@example.com"
                  required
                />
                {errors.email && (
                  <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
                {!errors.email && (
                  <p className="text-xs text-surface-500 mt-1">
                    ℹ️ Valid email address (e.g., john@example.com)
                  </p>
                )}
              </div>

              {/* Phone Number */}
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
                  className={errors.phoneNumber ? 'input-error' : 'input'}
                  placeholder="9876543210"
                  maxLength="10"
                  required
                />
                {errors.phoneNumber && (
                  <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phoneNumber}
                  </p>
                )}
                {!errors.phoneNumber && (
                  <p className="text-xs text-surface-500 mt-1">
                    ℹ️ 10 digits starting with 6, 7, 8, or 9 (without +91)
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${errors.password ? 'input-error' : 'input'} pr-12`}
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
                {!errors.password && (
                  <p className="text-xs text-surface-500 mt-1">
                    ℹ️ Min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character (!@#$%^&*)
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="label">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    className={`${errors.confirmPassword ? 'input-error' : 'input'} pr-12`}
                    placeholder="Repeat your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Create account
                  </span>
                )}
              </button>
            </form>

            <p className="text-center text-surface-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

