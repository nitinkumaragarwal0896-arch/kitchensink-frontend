import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { validatePassword } from '../utils/validation';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Key, Users } from 'lucide-react';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      validateToken(tokenFromUrl);
    } else {
      setValidatingToken(false);
      toast.error('Invalid reset link');
    }
  }, [searchParams]);

  const validateToken = async (resetToken) => {
    try {
      await authAPI.validateResetToken(resetToken);
      setTokenValid(true);
    } catch (error) {
      setTokenValid(false);
      toast.error('Invalid or expired reset link');
    } finally {
      setValidatingToken(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setErrors({ password: passwordValidation.error });
      toast.error(passwordValidation.error);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(token, password);
      setSuccess(true);
      toast.success('Password reset successful!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
      
      if (message.includes('expired') || message.includes('invalid')) {
        setTokenValid(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-surface-500">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 p-4">
        <div className="w-full max-w-md">
          <div className="card p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-surface-800 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-surface-600 mb-6">
              This password reset link is invalid or has expired. Reset links are only valid for 1 hour.
            </p>
            <Link to="/forgot-password" className="btn-primary w-full mb-3">
              Request New Reset Link
            </Link>
            <Link to="/login" className="btn-secondary w-full">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 p-4">
        <div className="w-full max-w-md">
          <div className="card p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-surface-800 mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-surface-600 mb-6">
              Your password has been changed successfully. You can now login with your new password.
            </p>
            <div className="animate-pulse text-surface-500 text-sm mb-4">
              Redirecting to login page...
            </div>
            <Link to="/login" className="btn-primary w-full">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
          <Link to="/" className="flex items-center gap-3">
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
          </Link>
        </div>

        {/* Reset Password Card */}
        <div className="card p-8 animate-slide-up">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Key className="w-6 h-6 text-brand-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-surface-800">
              Reset Password
            </h2>
            <p className="text-surface-500 mt-2">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="label">New Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  className={errors.password ? 'input-error pl-10 pr-12' : 'input pl-10 pr-12'}
                  placeholder="Min. 8 characters"
                  required
                  autoFocus
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
              <p className="text-xs text-surface-500 mt-1">
                ℹ️ Min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: null }));
                  }}
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  className={errors.confirmPassword ? 'input-error pl-10 pr-12' : 'input pl-10 pr-12'}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
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
                  Resetting Password...
                </span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Reset Password
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

