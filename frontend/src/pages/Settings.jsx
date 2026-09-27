import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import { Bell, LockKeyhole, Palette, ShieldCheck, X, Check } from 'lucide-react';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';

export default function Settings() {
    const [emailUpdates, setEmailUpdates] = useState(() => localStorage.getItem('career_email_updates') !== 'false');
    const [compactView, setCompactView] = useState(() => localStorage.getItem('career_compact_dashboard') === 'true');
    const [theme, setTheme] = useState(() => localStorage.getItem('career_theme') || 'light');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        email: authService.getCurrentUser().email || '',
        current_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        profileService.getProfile().then(setProfile);
    }, []);

    const profileSteps = [
        ['Academic background', Boolean(profile?.education_level && profile?.stream_major && profile?.year_of_study), '/student-profile'],
        ['Interests and preferences', Boolean(profile?.interests?.length), '/student-profile?section=interests'],
        ['Skills', Boolean(profile?.skills?.length), '/detailed-profile?section=skills'],
        ['Budget and locations', Boolean(profile?.budget_range && profile?.preferred_locations?.length), '/detailed-profile?section=preferences']
    ];
    const completedProfileSteps = profileSteps.filter(([, complete]) => complete).length;

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('career_theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('career_email_updates', String(emailUpdates));
    }, [emailUpdates]);

    useEffect(() => {
        document.body.classList.toggle('compact-dashboard', compactView);
        localStorage.setItem('career_compact_dashboard', String(compactView));
    }, [compactView]);

    const handlePasswordInput = (event) => {
        const { name, value } = event.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordUpdate = async (event) => {
        event.preventDefault();
        setPasswordStatus({ type: '', message: '' });

        if (!passwordForm.email || !passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
            setPasswordStatus({ type: 'error', message: 'Please complete all password fields.' });
            return;
        }

        if (passwordForm.new_password !== passwordForm.confirm_password) {
            setPasswordStatus({ type: 'error', message: 'New password and confirm password must match.' });
            return;
        }

        setPasswordLoading(true);
        const result = await authService.changePassword(
            passwordForm.email,
            passwordForm.current_password,
            passwordForm.new_password,
            passwordForm.confirm_password
        );
        setPasswordLoading(false);

        if (result.status === 'success') {
            setPasswordStatus({ type: 'success', message: result.message || 'Password updated successfully.' });
            setPasswordForm((prev) => ({ ...prev, current_password: '', new_password: '', confirm_password: '' }));
            setTimeout(() => setShowPasswordModal(false), 1000);
        } else {
            setPasswordStatus({ type: 'error', message: result.detail || 'Password could not be changed.' });
        }
    };

    return (
        <div className="app-surface settings-page min-h-screen flex">
            <Sidebar />
            <div className="flex-1 min-w-0">
                <div className="p-6 md:p-8 max-w-5xl mx-auto">
                    <Header title="Settings" subtitle="Keep your account and guidance experience tuned to you." />
                    <section className="bg-white rounded-2xl border border-[#ded5c5] p-6 shadow-sm mb-5">
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div><h2 className="font-bold text-[#183f35]">Profile setup</h2><p className="text-xs text-slate-500 mt-1">Complete each step to improve your recommendations.</p></div>
                            <span className="text-sm font-extrabold text-blue-600">Step {completedProfileSteps} of {profileSteps.length}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-4"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${(completedProfileSteps / profileSteps.length) * 100}%` }} /></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {profileSteps.map(([label, complete, path], index) => (
                                <Link key={label} to={path} className={`flex items-center gap-2 text-xs font-semibold rounded-xl px-2.5 py-2 transition-colors ${complete ? 'text-slate-600 hover:bg-slate-50' : 'text-slate-700 hover:bg-amber-50 hover:text-amber-900'}`}>
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${complete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{complete ? '✓' : index + 1}</span>
                                    <span>{label}</span>
                                    {!complete && <span className="ml-auto text-[10px] font-bold text-amber-600">Complete →</span>}
                                </Link>
                            ))}
                        </div>
                    </section>
                    <div className="grid gap-5 md:grid-cols-2">
                        <section className="bg-white rounded-2xl border border-[#ded5c5] p-6 shadow-sm">
                            <div className="flex items-start gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-[#e8f0e7] text-[#28705a] flex items-center justify-center"><Bell className="w-5 h-5" /></div>
                                <div><h2 className="font-bold text-[#183f35]">Notifications</h2><p className="text-xs text-slate-500 mt-1">Choose what deserves your attention.</p></div>
                            </div>
                            <label className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 cursor-pointer">
                                <span><span className="block text-sm font-semibold text-slate-700">Career updates</span><span className="block text-xs text-slate-500 mt-1">New recommendations and deadline reminders</span></span>
                                <input type="checkbox" checked={emailUpdates} onChange={(event) => setEmailUpdates(event.target.checked)} className="accent-[#e86f51] w-4 h-4" />
                            </label>
                            <label className="flex items-center justify-between gap-4 py-3 cursor-pointer">
                                <span><span className="block text-sm font-semibold text-slate-700">Compact dashboard</span><span className="block text-xs text-slate-500 mt-1">Fit more progress details on screen</span></span>
                                <input type="checkbox" checked={compactView} onChange={(event) => setCompactView(event.target.checked)} className="accent-[#e86f51] w-4 h-4" />
                            </label>
                        </section>

                        <section className="bg-white rounded-2xl border border-[#ded5c5] p-6 shadow-sm">
                            <div className="flex items-start gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-[#fff0dd] text-[#c46a31] flex items-center justify-center"><LockKeyhole className="w-5 h-5" /></div>
                                <div><h2 className="font-bold text-[#183f35]">Account & privacy</h2><p className="text-xs text-slate-500 mt-1">Your profile belongs to you.</p></div>
                            </div>
                            <div className="flex items-center gap-3 py-3 border-b border-slate-100"><ShieldCheck className="w-4 h-4 text-[#28705a]" /><span className="text-sm text-slate-600">Your recommendations are based on your profile.</span></div>
                            <Button variant="secondary" size="sm" className="mt-5" onClick={() => setShowPasswordModal(true)}>Change password</Button>
                        </section>

                        <section className="bg-white rounded-2xl border border-[#ded5c5] p-6 shadow-sm md:col-span-2">
                            <div className="flex items-start gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-[#f4e8bf] text-[#927016] flex items-center justify-center"><Palette className="w-5 h-5" /></div><div><h2 className="font-bold text-[#183f35]">Appearance</h2><p className="text-xs text-slate-500 mt-1">The workspace uses a calm, focused palette designed for planning.</p></div></div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="inline-flex rounded-xl border border-[#d8dfd7] bg-[#f4f6f2] p-1" role="group" aria-label="Theme">
                                    <button type="button" onClick={() => setTheme('light')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${theme === 'light' ? 'bg-white text-[#27483d] shadow-sm' : 'text-slate-500'}`}>Light</button>
                                    <button type="button" onClick={() => setTheme('dark')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${theme === 'dark' ? 'bg-[#27483d] text-white shadow-sm' : 'text-slate-500'}`}>Dark</button>
                                </div>
                                <span className="text-sm text-slate-600">Choose the workspace appearance.</span>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4">
                    <div className="settings-password-modal w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d85d40]">Security</p>
                                <h3 className="mt-2 text-2xl font-extrabold text-slate-900">Change password</h3>
                            </div>
                            <button type="button" onClick={() => setShowPasswordModal(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="mt-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">Email</label>
                                <input type="email" name="email" value={passwordForm.email} onChange={handlePasswordInput} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">Current password</label>
                                <input type="password" name="current_password" value={passwordForm.current_password} onChange={handlePasswordInput} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">New password</label>
                                <input type="password" name="new_password" value={passwordForm.new_password} onChange={handlePasswordInput} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5">Confirm new password</label>
                                <input type="password" name="confirm_password" value={passwordForm.confirm_password} onChange={handlePasswordInput} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            </div>

                            {passwordStatus.message && (
                                <div className={`rounded-xl border px-3 py-2 text-sm ${passwordStatus.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-600'}`}>
                                    <div className="flex items-center gap-2">
                                        {passwordStatus.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                        <span>{passwordStatus.message}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="secondary" size="md" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                                <Button type="submit" size="md" disabled={passwordLoading}>{passwordLoading ? 'Updating...' : 'Update password'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
