import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import { Sparkles, ArrowRight, UserCheck, ShieldCheck, Compass, CheckCircle } from 'lucide-react';
import { profileService } from '../services/profileService';

export default function AIAnalysisResult() {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await profileService.getAiAnalysis();
      setAnalysis(res);
    }
    load();
  }, []);

  return (
    <div className="app-surface min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-8 max-w-5xl w-full mx-auto space-y-6">
          <Header
            title="Comprehensive AI Assessment"
            subtitle="Transparent decision-support and trade-off analysis"
          />

          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Explainable Decision Framework</h2>
                <p className="text-xs text-slate-500">Core approach: Understand &rarr; Ask &rarr; Analyze &rarr; Recommend &rarr; Explain &rarr; Act</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Fit Factors</h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  {(analysis?.key_insights || []).slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Potential Trade-offs</h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  {(analysis?.areas_to_improve || []).slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Human Counselor Escalation */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wide">Human Counselor Escalation</h4>
                  <p className="text-xs text-blue-900/80 mt-1 max-w-lg leading-relaxed">
                    Have complex personal circumstances, financial scholarship questions, or specific university dilemmas? Connect with certified academic advisors.
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white text-blue-600 border border-blue-200 text-xs font-bold rounded-xl shadow-xs hover:bg-blue-50 transition-colors whitespace-nowrap">
                Schedule Session
              </button>
            </div>

            <div className="flex justify-end pt-4">
              <Link to="/career-recommendations">
                <Button>
                  Explore Career Matches <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
