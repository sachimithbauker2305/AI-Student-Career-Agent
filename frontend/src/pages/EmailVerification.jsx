import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';

export default function EmailVerification() {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleChange = (val, idx) => {
    if (val.length <= 1) {
      const updated = [...code];
      updated[idx] = val;
      setCode(updated);
      if (val && idx < 5) {
        document.getElementById(`code-input-${idx + 1}`)?.focus();
      }
    }
  };

  const handleVerify = () => {
    navigate('/student-profile');
  };

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Verify Your Email</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          We sent a 6-digit confirmation code to your email address. Enter the code below to verify your account.
        </p>

        <div className="flex justify-center gap-2 sm:gap-3 my-8">
          {code.map((digit, idx) => (
            <input
              key={idx}
              id={`code-input-${idx}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              className="w-11 h-13 text-center font-bold text-lg rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          ))}
        </div>

        <Button onClick={handleVerify} className="w-full py-3">
          Verify & Continue
        </Button>

        <p className="mt-6 text-xs text-slate-400">
          Didn't receive the email?{' '}
          <button className="text-blue-600 font-semibold hover:underline">Resend code</button>
        </p>
      </div>
    </div>
  );
}
