import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Calendar,
  Award,
  BookOpen
} from 'lucide-react';
import { recommendationService } from '../services/recommendationService';

export default function EligibilityCheck() {
  const [course, setCourse] = useState('');
  const [college, setCollege] = useState('');
  const [category, setCategory] = useState('General');
  const [options, setOptions] = useState({
    colleges: [],
    courses: [],
    categories: ['General', 'OBC-NCL', 'SC', 'ST', 'EWS']
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      const data = await recommendationService.getEligibilityOptions('');
      if (data) {
        setOptions(data);
        setCourse(prev => prev || data.courses?.[0] || '');
        setCollege(prev => prev || data.colleges?.[0] || '');
      }
    }
    loadOptions();
  }, []);

  useEffect(() => {
    async function loadCollegeOptions() {
      if (!course) return;
      const data = await recommendationService.getEligibilityOptions(course);
      if (data) {
        setOptions(data);
        setCollege(prev => data.colleges?.includes(prev) ? prev : (data.colleges?.[0] || ''));
      }
    }
    loadCollegeOptions();
  }, [course]);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await recommendationService.checkEligibility(course, college, category);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const collegeSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${course} colleges in India admissions`)}`;

  return (
    <div className="app-surface eligibility-page min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-8 max-w-6xl w-full mx-auto space-y-6">
          <Header
            title="Check Your Eligibility"
            subtitle="Verify admission requirements, deadlines and availability through official sources."
          />

          {!course ? <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center"><h2 className="text-lg font-bold text-slate-800">Eligibility checking is not available yet.</h2><p className="text-sm text-slate-500 mt-2">Complete your profile first so we can show courses and matching colleges.</p></div> : <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Form Section (Screen 8) */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-8 shadow-xs space-y-6">
              <form onSubmit={handleCheck} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Course / Program
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {options.courses?.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                    College / University
                  </label>
                  <p className="text-[11px] text-slate-500 mb-1.5">Matched to your selected stream, course, location and budget preferences.</p>
                  {options.location_note && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 mb-2 text-[11px] text-amber-900">
                      {options.location_note}
                    </div>
                  )}
                  {options.colleges?.length ? (
                    <select
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      {options.colleges.map((col) => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                      <p className="font-bold">No top colleges found in the current catalogue for {course}.</p>
                      <p className="mt-1">Search more institutions and verify the course on their official admission websites.</p>
                      <a
                        href={collegeSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 font-bold text-amber-800 underline"
                      >
                        Search colleges on Google <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {options.categories?.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full py-3" disabled={loading || !college}>
                    {loading ? 'Checking Eligibility...' : 'Check Eligibility'}
                  </Button>
                </div>
              </form>

              {/* Evaluation Result if checked */}
              {result && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Status</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {result.status} ({result.confidence} Confidence)
                    </span>
                  </div>

                  {(() => {
                    const entranceExam =
                      result.entrance_exam ??
                      result.entranceExam ??
                      result.exam ??
                      'See the institution’s official admission process';
                    const cutoff =
                      result.required_cutoff ??
                      result.requiredCutoff ??
                      result.cutoff ??
                      'Not available in the current project catalogue';
                    const deadline =
                      result.application_deadline ??
                      result.applicationDeadline ??
                      'Check the official admission calendar';
                    return (
                      <div className="bg-slate-50 rounded-2xl p-4 space-y-3 text-xs text-slate-700">
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-slate-500 shrink-0">Entrance Exam Required:</span>
                          <span className="font-bold text-slate-800 text-right">{entranceExam}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-slate-500 shrink-0">Estimated Cutoff:</span>
                          <span className="font-bold text-slate-800 text-right">{typeof cutoff === 'number' ? `${cutoff}%` : cutoff}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-slate-500 shrink-0">Application Deadline:</span>
                          <span className="font-bold text-slate-800 text-right">{deadline}</span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="pt-1">
                    <a
                      href={result.official_portal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Visit Official Admission Portal <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Important Note Alert Card (Screen 8) */}
            <div className="eligibility-note lg:col-span-5 bg-[#EFF6FF] border border-[#DBEAFE] rounded-3xl p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-blue-700">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-blue-950">Important Note</h3>
              </div>

              <p className="text-xs text-blue-900/80 leading-relaxed">
                Please verify all admission details, eligibility criteria, deadlines and current availability through official university or admission websites. Our AI provides guidance, but final information should always be checked from official sources.
              </p>

              <div className="pt-2 border-t border-blue-200/60 text-[11px] text-blue-800/70 space-y-1">
                <div>&bull; Seat allocations are subject to official counselling rounds.</div>
                <div>&bull; Category reservation certificates must comply with Central/State guidelines.</div>
              </div>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}
