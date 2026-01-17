import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <h1 className="font-display text-5xl font-bold text-white mb-4">
            Kitchen<span className="text-brand-400">sink</span>
          </h1>
          <p className="text-surface-400 text-lg max-w-md leading-relaxed">
            A modern member registration system built with Spring Boot and MongoDB. 
            Secure, scalable, and production-ready.
          </p>
          
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-surface-300">
              <div className="w-2 h-2 bg-brand-500 rounded-full" />
              <span>JWT Authentication</span>
            </div>
            <div className="flex items-center gap-3 text-surface-300">
              <div className="w-2 h-2 bg-brand-500 rounded-full" />
              <span>Role-Based Access Control</span>
            </div>
            <div className="flex items-center gap-3 text-surface-300">
              <div className="w-2 h-2 bg-brand-500 rounded-full" />
              <span>RESTful API</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-surface-800">
              Kitchen<span className="text-brand-600">sink</span>
            </h1>
          </div>

          <div className="card p-8">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-semibold text-surface-800">
                Welcome back
              </h2>
              <p className="text-surface-500 mt-2">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                  placeholder="Enter your username"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-12"
                    placeholder="Enter your password"
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Sign in
                  </span>
                )}
              </button>
            </form>

            <p className="text-center text-surface-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium">
                Register
              </Link>
            </p>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-surface-100 rounded-lg">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                Demo Credentials
              </p>
              <div className="space-y-1 text-sm text-surface-600">
                <p><span className="font-mono bg-surface-200 px-1 rounded">user</span> / <span className="font-mono bg-surface-200 px-1 rounded">user12345</span> - Standard user</p>
                <p><span className="font-mono bg-surface-200 px-1 rounded">admin</span> / <span className="font-mono bg-surface-200 px-1 rounded">admin123</span> - Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
