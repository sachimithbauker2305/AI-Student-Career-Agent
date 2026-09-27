import React, { useEffect, useMemo, useState } from 'react';
import { BookmarkCheck, X, ArrowRightLeft, BriefcaseBusiness } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { savedCareerService } from '../services/savedCareerService';

export default function SavedCareers() {
  const [savedCareers, setSavedCareers] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSavedCareers = async () => {
    setLoading(true);
    const items = await savedCareerService.getSavedCareers();
    setSavedCareers(items);
    setCompareIds((current) => current.filter((id) => items.some((item) => item.career_id === id)));
    setLoading(false);
  };

  useEffect(() => {
    loadSavedCareers();
  }, []);

  const comparison = useMemo(() => {
    return savedCareers.filter((career) => compareIds.includes(career.career_id));
  }, [compareIds, savedCareers]);

  const toggleCompare = (careerId) => {
    setCompareIds((current) => {
      if (current.includes(careerId)) return current.filter((id) => id !== careerId);
      if (current.length >= 3) return [...current.slice(1), careerId];
      return [...current, careerId];
    });
  };

  const removeCareer = async (careerId) => {
    await savedCareerService.deleteSavedCareer(careerId);
    setSavedCareers((current) => current.filter((item) => item.career_id !== careerId));
    setCompareIds((current) => current.filter((id) => id !== careerId));
  };

  return (
    <div className="app-surface min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-8 max-w-6xl w-full mx-auto space-y-6">
          <Header
            title="Saved Careers"
            subtitle="Keep the options you like and compare them side by side before you commit."
          />

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-sm font-bold text-slate-800">Career Shortlist</h2>
              <span className="text-[11px] font-semibold text-slate-500">{savedCareers.length} saved</span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">Loading saved careers...</div>
            ) : savedCareers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center mt-4">
                <BookmarkCheck className="w-8 h-8 mx-auto text-slate-300" />
                <p className="mt-3 text-sm font-bold text-slate-700">No careers saved yet.</p>
                <p className="text-xs text-slate-500 mt-1">Save a few options from the recommendation details to compare them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
                {savedCareers.map((career) => (
                  <div key={career.career_id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{career.title}</div>
                        <div className="text-[11px] text-slate-500 mt-1">{career.domain || 'Career Path'}</div>
                      </div>
                      <button
                        onClick={() => removeCareer(career.career_id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        aria-label={`Remove ${career.title}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                        {career.match_score || 0}% match
                      </span>
                      <button
                        onClick={() => toggleCompare(career.career_id)}
                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-semibold border transition-colors ${
                          compareIds.includes(career.career_id)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                        }`}
                      >
                        {compareIds.includes(career.career_id) ? 'Selected' : 'Compare'}
                      </button>
                    </div>

                    <p className="mt-3 text-[11px] text-slate-600 leading-relaxed">{career.description || 'No description provided.'}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(career.tags || []).slice(0, 3).map((tag, index) => (
                        <span key={`${career.career_id}-${tag}-${index}`} className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {comparison.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                <h2 className="text-sm font-bold text-slate-800">Compare Selected Careers</h2>
                <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold">
                  <ArrowRightLeft className="w-3.5 h-3.5" /> Up to 3 careers
                </span>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {comparison.map((career) => (
                  <div key={career.career_id} className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                    <div className="flex items-center gap-2">
                      <BriefcaseBusiness className="w-4 h-4 text-blue-600" />
                      <div className="text-sm font-bold text-slate-900">{career.title}</div>
                    </div>
                    <div className="mt-4 space-y-2 text-[11px] text-slate-600">
                      <div className="flex justify-between gap-2"><span>Match</span><strong className="text-slate-900">{career.match_score || 0}%</strong></div>
                      <div className="flex justify-between gap-2"><span>Salary</span><strong className="text-slate-900">{career.avg_salary_lpa || 'Not available'}</strong></div>
                      <div className="flex justify-between gap-2"><span>Education</span><strong className="text-slate-900">{career.required_education || 'Flexible'}</strong></div>
                    </div>
                    <div className="mt-4 text-[11px] text-slate-700">
                      <div className="font-bold text-slate-800 mb-1">Why it fits</div>
                      <p>{career.why_fit || 'This option matches your profile well.'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
