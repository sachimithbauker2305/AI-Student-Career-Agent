import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/authService';

export default function CreateNewPassword() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('reset_email') || 'name@gmail.com';
  const otp = sessionStorage.getItem('reset_otp') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(email, otp, newPassword);
      navigate('/password-reset-success');
    } catch (err) {
      setError(err.response?.data?.detail || 'Password reset failed. Please request a new OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
      <div className="reset-password-card w-full max-w-md mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
          <Lock className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create New Password</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Your new password should be different from your old password and at least 8 characters long.
        </p>

        {error && <p className="mt-4 text-xs text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full py-3" disabled={loading}>
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
