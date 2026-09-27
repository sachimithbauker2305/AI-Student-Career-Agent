import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NextStepMark from '../components/NextStepMark';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(credentials);
      navigate('/dashboard');
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (detail) {
        setError(detail.includes('Invalid email or password')
          ? 'This email/password combination is not valid. Please check your details or register a new account.'
          : detail);
      } else if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error') {
        setError('NextStep could not reach the backend. Make sure the FastAPI server is running on port 8000 and try again.');
      } else {
        setError('Something went wrong while signing in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="auth-card max-w-4xl w-full rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
        {/* Left Side */}
        <div className="auth-visual md:col-span-5 p-8 sm:p-10 flex flex-col justify-between text-center">
          <div className="flex flex-col items-center">
            <div className="auth-icon w-20 h-20 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center mb-6 bg-white">
              <img src="/nextstep-logo.png" alt="NextStep logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
              Good to see you again
            </h2>
            <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed max-w-xs">
              Your saved options and next steps are waiting whenever you are.
            </p>
          </div>

          <div className="text-[11px] text-white/45">
            Private by default. You stay in control of your choices.
          </div>
        </div>

        {/* Right Side */}
        <div className="auth-form md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-2 mb-6">
            <Link to="/" className="text-xs font-semibold text-[#c9654b] hover:text-[#a94d39]">Back to home</Link>
            <div className="auth-logo w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white">
              <img src="/nextstep-logo.png" alt="NextStep logo" className="w-full h-full object-cover" />
            </div>
            <span className="auth-brand-lockup text-[#183f35]"><strong className="auth-brand-name">NextStep</strong><span className="auth-brand-tagline">From Uncertainty to Clarity</span></span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-[#183f35] tracking-tight">Sign in to continue</h1>
            <p className="text-xs sm:text-sm text-[#63706a] mt-1">
              Pick up where you left off.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <div className="text-right mt-1.5">
                <Link to="/forgot-password" className="text-xs font-semibold text-[#d85d40] hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" size="md" className="w-full py-3" disabled={loading}>
                {loading ? 'Signing you in...' : 'Sign in'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-[#63706a]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#d85d40] hover:text-[#b94831] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
