import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/authService';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authService.forgotPassword(email);
      sessionStorage.setItem('reset_expires_at', String(Date.now() + (result.expires_in_seconds || 600) * 1000));
      sessionStorage.setItem('reset_email', email);
      navigate('/otp-verification');
    } catch (err) {
      setMsg(err.response?.data?.detail || 'We could not send the OTP. Check the email and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
          <KeyRound className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Forgot Password?</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          No worries! Enter your registered email address and we'll send you an OTP to reset your password.
        </p>

        {msg && <p className="mt-4 text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl">{msg}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" className="w-full py-3" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send Verification OTP'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
