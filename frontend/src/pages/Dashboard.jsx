import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import {
  Briefcase,
  TrendingUp,
  UserCheck,
  Compass,
  Flag,
  ArrowRight,
  Code,
  BarChart3,
  Cpu,
  BookmarkCheck,
  ExternalLink
} from 'lucide-react';
import { calculateActionPlanProgress, dashboardService } from '../services/dashboardService';
import { savedCareerService } from '../services/savedCareerService';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [savedCareers, setSavedCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compactDashboard, setCompactDashboard] = useState(() => localStorage.getItem('career_compact_dashboard') === 'true');

  useEffect(() => {
    const compact = localStorage.getItem('career_compact_dashboard') === 'true';
    setCompactDashboard(compact);
    document.body.classList.toggle('compact-dashboard', compact);
    return () => document.body.classList.remove('compact-dashboard');
  }, []);

  useEffect(() => {
    document.body.classList.toggle('compact-dashboard', compactDashboard);
    localStorage.setItem('career_compact_dashboard', String(compactDashboard));
  }, [compactDashboard]);

  useEffect(() => {
    async function load() {
      const [data, actionPlan, saved] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getActionPlan(),
        savedCareerService.getSavedCareers()
      ]);
      setSummary({
        ...data,
        action_plan_progress: calculateActionPlanProgress(actionPlan?.steps)
      });
      setSavedCareers(saved || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !summary) {
    return (
      <div className="app-surface dashboard-page min-h-screen flex">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center text-slate-400">Loading dashboard...</div>
      </div>
    );
  }

  const getMatchIcon = (title = '') => {
    if (title.includes('Software')) return <Code className="w-4 h-4 text-[#32755c]" />;
    if (title.includes('Data')) return <BarChart3 className="w-4 h-4 text-[#c9654b]" />;
    return <Cpu className="w-4 h-4 text-[#b1842d]" />;
  };

  return (
    <div className="app-surface dashboard-page min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className={`w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 ${compactDashboard ? 'space-y-4' : 'space-y-5'}`}>
          <Header
            title={`Welcome back, ${(summary.student_name || 'there').trim().split(/\s+/)[0]}.`}
            subtitle="Here’s a quick look at your progress, saved choices and the next things you can work on."
          />

          {/* 3 Metric Stat Cards (Screen 7) */}
          <div className={`grid grid-cols-1 md:grid-cols-3 ${compactDashboard ? 'gap-4' : 'gap-6'}`}>
            {/* Metric 1: Profile Completion */}
            <div className={`bg-white border border-slate-100 rounded-2xl ${compactDashboard ? 'p-4' : 'p-6'} shadow-xs flex items-center justify-between`}>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Profile Completion</span>
                <span className={`font-extrabold text-slate-900 mt-1 block ${compactDashboard ? 'text-2xl' : 'text-3xl'}`}>{summary.profile_completion}%</span>
              </div>
              <div className="w-12 h-12 relative flex items-center justify-center">
                <ProgressBar
                  progress={summary.profile_completion}
                  variant="circular"
                  size={52}
                  strokeWidth={6}
                />
              </div>
            </div>

            {/* Metric 2: Recommended Careers */}
            <div className={`bg-white border border-slate-100 rounded-2xl ${compactDashboard ? 'p-4' : 'p-6'} shadow-xs flex items-center justify-between`}>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Recommended Careers</span>
                <span className={`font-extrabold text-slate-900 mt-1 block ${compactDashboard ? 'text-2xl' : 'text-3xl'}`}>{summary.recommended_careers_count}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>

            {/* Metric 3: Action Plan Progress */}
            <div className={`bg-white border border-slate-100 rounded-2xl ${compactDashboard ? 'p-4' : 'p-6'} shadow-xs flex flex-col justify-between`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 block">Action Plan Progress</span>
                <span className="text-xs font-bold text-blue-600">{summary.action_plan_progress}%</span>
              </div>
              <div className="mt-4">
                <ProgressBar progress={summary.action_plan_progress} />
              </div>
            </div>
          </div>

          {summary.profile_completion < 100 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-amber-900">Your profile is not complete yet.</p>
                <p className="text-xs text-amber-800 mt-1">
                  Complete the remaining details to improve your personalized career, college and eligibility results.
                </p>
              </div>
              <Link
                to="/student-profile"
                className="shrink-0 inline-flex items-center px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors"
              >
                Complete Profile <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          )}

          {/* Lower Section: Top Career Matches + Recent Activity */}
          <div className={`grid grid-cols-1 lg:grid-cols-12 ${compactDashboard ? 'gap-4' : 'gap-6'}`}>
            {/* Top Career Matches (8 cols) */}
            <div className={`lg:col-span-8 bg-white border border-slate-100 rounded-3xl ${compactDashboard ? 'p-4' : 'p-6'} shadow-xs space-y-4`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                <h3 className="text-sm font-bold text-slate-900">Your Top Career Matches</h3>
                <Link to="/career-recommendations" className="text-xs font-semibold text-blue-600 hover:underline">
                  View all &gt;
                </Link>
              </div>

              {summary.top_matches?.length ? <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {summary.top_matches.map((m) => (
                  <div key={m.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xs transition-shadow">
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-3">
                        {getMatchIcon(m.title)}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{m.title}</h4>
                      <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
                        {m.match_score}% match
                      </span>
                    </div>

                    <Link to={`/career-details/${m.id}`} className="mt-4 text-[11px] font-semibold text-blue-600 hover:underline inline-flex items-center">
                      Learn more &gt;
                    </Link>
                  </div>
                ))}
              </div> : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="text-sm font-bold text-slate-700">Your career options will appear here as you explore.</p>
                  <p className="text-xs text-slate-500 mt-2">Add a little more to your profile and we’ll suggest where to look first.</p>
                </div>
              )}
            </div>

            {/* Recent Activity + Saved Careers (4 cols) */}
            <div className={`lg:col-span-4 bg-white border border-slate-100 rounded-3xl ${compactDashboard ? 'p-4' : 'p-6'} shadow-xs space-y-5`}>
              <div>
                <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-50">Recent Activity</h3>
                {summary.recent_activity?.length ? <div className="space-y-4 pt-1">
                  {summary.recent_activity.map((act) => (
                    <div key={act.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-slate-800 block">{act.title}</span>
                        <span className="text-[11px] text-slate-400">{act.timestamp_text || act.timestamp || act.time_ago}</span>
                      </div>
                    </div>
                  ))}
                </div> : (
                  <p className="text-xs text-slate-500 pt-2">No recent activity yet.</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                  <h3 className="text-sm font-bold text-slate-900">Saved Careers</h3>
                  {savedCareers.length > 0 && (
                    <Link to="/saved-careers" className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline">
                      Compare <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                {savedCareers.length ? (
                  <div className="space-y-3 pt-2">
                    {savedCareers.slice(0, 3).map((career) => (
                      <div key={career.career_id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-start gap-2">
                          <BookmarkCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 leading-snug">{career.title}</div>
                            <div className="text-[10px] text-slate-500 mt-1">{career.domain || 'Career Path'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 pt-2">No saved careers yet. Save a few options to compare them here.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
