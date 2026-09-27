import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { authService } from '../services/authService';

export default function OTPVerification() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('reset_email') || 'name@gmail.com';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(() => Math.max(0, Math.ceil((Number(sessionStorage.getItem('reset_expires_at')) - Date.now()) / 1000)));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft(Math.max(0, Math.ceil((Number(sessionStorage.getItem('reset_expires_at')) - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleChange = (val, idx) => {
    if (val.length <= 1) {
      const updated = [...otp];
      updated[idx] = val;
      setOtp(updated);
      if (val && idx < 5) {
        document.getElementById(`otp-box-${idx + 1}`)?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    try {
      await authService.verifyOtp(email, code);
      sessionStorage.setItem('reset_otp', code);
      navigate('/create-new-password');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired OTP.');
    }
  };

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">OTP Verification</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Enter the 6-digit verification code sent to <br />
          <strong className="text-slate-800">{email}</strong>
        </p>

        <p className="text-[11px] text-blue-600 font-semibold bg-blue-50 py-1 px-3 rounded-lg inline-block mt-3">
          {secondsLeft > 0 ? `Code expires in ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}` : 'Code expired. Request a new OTP.'}
        </p>

        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

        <div className="flex justify-center gap-2 sm:gap-3 my-8">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-box-${idx}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              className="w-11 h-13 text-center font-bold text-lg rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          ))}
        </div>

        <Button onClick={handleVerify} className="w-full py-3">
          Verify OTP
        </Button>

        <div className="mt-6 text-center">
          <Link to="/forgot-password" className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Resend OTP
          </Link>
        </div>
      </div>
    </div>
  );
}
