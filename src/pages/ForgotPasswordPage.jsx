import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { validateEmail } from '../utils/validation';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Users } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.error);
      toast.error(emailValidation.error);
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      console.log('Password reset response:', response.data);
      setSubmitted(true);
      toast.success('Check your email for reset instructions');
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to send reset email';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 p-4">
        <div className="w-full max-w-md">
          <div className="card p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-surface-800 mb-2">
              Check Your Email
            </h2>
            <p className="text-surface-600 mb-6">
              If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
            </p>
            <div className="bg-surface-50 border border-surface-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-surface-700 mb-2">
                <strong>What to do next:</strong>
              </p>
              <ol className="text-sm text-surface-600 space-y-1 list-decimal list-inside">
                <li>Check your inbox (and spam folder)</li>
                <li>Click the reset link in the email</li>
                <li>Enter your new password</li>
                <li>Login with your new password</li>
              </ol>
            </div>
            <p className="text-xs text-surface-500 mb-6">
              The reset link will expire in 1 hour for security reasons.
            </p>
            <Link to="/login" className="btn-primary w-full">
              <ArrowLeft className="w-5 h-5" />
              Back to Login
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

        {/* Forgot Password Card */}
        <div className="card p-8 animate-slide-up">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-brand-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-surface-800">
              Forgot Password?
            </h2>
            <p className="text-surface-500 mt-2">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={error ? 'input-error' : 'input'}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              </div>
              {error && (
                <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
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
                  Sending...
                </span>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-surface-500">
          <p>
            Remember your password?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

