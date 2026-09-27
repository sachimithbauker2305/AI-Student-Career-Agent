import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';

export default function PasswordResetSuccess() {
  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Password Reset Complete</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Your password has been successfully reset. You can now log into your account with your new credentials.
        </p>

        <div className="mt-8">
          <Link to="/login">
            <Button className="w-full py-3">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
