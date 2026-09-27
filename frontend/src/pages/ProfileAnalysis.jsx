import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { profileService } from '../services/profileService';

export default function ProfileAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await profileService.getAiAnalysis();
      setAnalysis(res);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !analysis) {
    return (
      <div className="app-surface min-h-screen flex">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-sm font-semibold text-slate-400">Loading your profile analysis...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-surface min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-8 max-w-6xl w-full mx-auto space-y-6">
          <Header
            title="Your Profile Analysis"
            rightElement={
              <Link to="/career-recommendations">
                <Button size="sm">
                  View Recommendations <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            }
          />

          {analysis.profile_match_score === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center">
              <h2 className="text-lg font-bold text-slate-800">Profile analysis is not available yet.</h2>
              <p className="text-sm text-slate-500 mt-2">Complete your profile to generate your score, insights, strengths, and improvement areas.</p>
            </div>
          ) : <>
            {/* Top Row: Score + Key Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Card: Circular Match Score (Screen 4) */}
              <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-8 shadow-xs flex flex-col items-center justify-center text-center">
                <ProgressBar
                  progress={analysis.profile_match_score || 78}
                  variant="circular"
                  size={140}
                  strokeWidth={12}
                  className="mb-4"
                />
                <h3 className="text-base font-bold text-slate-900">Profile Match Score</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  {analysis.score_explanation || 'Based on all your academics, interests, skills and preferences.'}
                </p>
              </div>

              {/* Right Card: Your Key Insights (Screen 4) */}
              <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-8 shadow-xs flex flex-col justify-center">
                <h3 className="text-base font-bold text-slate-900 mb-4">Your Key Insights</h3>
                <div className="space-y-3">
                  {analysis.key_insights?.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div></>}

          {/* Middle Row: Strengths (Green) & Areas to Improve (Coral) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths Card */}
            <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-3xl p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-emerald-950">Your Strengths</h3>
              </div>
              <ul className="space-y-3">
                {analysis.strengths?.map((strength, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to Improve Card */}
            <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-3xl p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h3 className="text-sm font-bold text-rose-950">Areas to Improve</h3>
              </div>
              <ul className="space-y-3">
                {analysis.areas_to_improve?.map((area, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-rose-900">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section: Suggested Pathways */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Suggested Pathways</h3>
            <div className="flex flex-wrap gap-3">
              {analysis.suggested_pathways?.map((pathway, idx) => (
                <Link
                  key={idx}
                  to={`/career-recommendations`}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-700 border border-slate-200 hover:border-blue-200 transition-colors"
                >
                  {pathway}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
