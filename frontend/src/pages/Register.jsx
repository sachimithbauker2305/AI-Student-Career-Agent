import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import NextStepMark from '../components/NextStepMark';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.register(formData);
      navigate('/student-profile');
    } catch (err) {
      if (!err.response) {
        setError('The server is unavailable. Start the backend with: python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload');
      } else if (err.response.status === 400 && err.response.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('We could not create your account. Check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="auth-card max-w-4xl w-full rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Side: Illustration & Branding (Screen 2) */}
        <div className="auth-visual md:col-span-5 p-8 sm:p-10 flex flex-col justify-between text-center relative">
          <div className="relative z-10 flex flex-col items-center">
            {/* Visual Icon Stack */}
            <div className="auth-icon w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center mb-8 bg-white">
              <img src="/nextstep-logo.png" alt="NextStep logo" className="w-full h-full object-cover" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
              A clearer<br />
              <span className="text-[#f8c76a]">next step</span>
            </h2>

            <p className="text-xs sm:text-sm text-white/70 mt-3 leading-relaxed max-w-xs">
              Bring your goals and interests together, then see which paths are worth exploring.
            </p>
          </div>

          <div className="pt-6 border-t border-white/15 text-[11px] text-white/45">
            Your profile stays private. You can edit it anytime.
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="auth-form md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          {/* Logo & Header */}
          <div className="flex items-center justify-between gap-2 mb-6">
            <Link to="/" className="text-xs font-semibold text-[#c9654b] hover:text-[#a94d39]">Back to home</Link>
            <div className="auth-logo w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white">
              <img src="/nextstep-logo.png" alt="NextStep logo" className="w-full h-full object-cover" />
            </div>
            <span className="auth-brand-lockup text-[#183f35]"><strong className="auth-brand-name">NextStep</strong><span className="auth-brand-tagline">From Uncertainty to Clarity</span></span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-[#183f35] tracking-tight">Start your plan</h1>
            <p className="text-xs sm:text-sm text-[#63706a] mt-1">
              Create an account to keep your profile and next steps in one place.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="First Name"
                placeholder="Enter your first name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="pt-2">
              <Button type="submit" size="md" className="w-full py-3" disabled={loading}>
                {loading ? 'Creating your account...' : 'Create account'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-[#63706a]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#d85d40] hover:text-[#b94831] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
