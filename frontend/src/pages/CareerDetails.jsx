import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import {
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
  Bookmark,
  TrendingUp,
  DollarSign,
  Briefcase,
  Building,
  Code,
  ExternalLink
} from 'lucide-react';
import { recommendationService } from '../services/recommendationService';
import { savedCareerService } from '../services/savedCareerService';

export default function CareerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [allColleges, setAllColleges] = useState([]);
  const [allCollegesNote, setAllCollegesNote] = useState(null);
  const [allCollegesLoading, setAllCollegesLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await recommendationService.getCareerDetails(parseInt(id) || 1);
      setCareer(data);
    }
    load();
  }, [id]);

  useEffect(() => {
    async function loadAllColleges() {
      if (activeTab !== 'All Colleges' || !id) return;
      setAllCollegesLoading(true);
      const data = await recommendationService.getCareerColleges(parseInt(id) || 1);
      setAllColleges(data?.colleges || []);
      setAllCollegesNote(data?.location_note || null);
      setAllCollegesLoading(false);
    }
    loadAllColleges();
  }, [activeTab, id]);

  if (!career) {
    return (
      <div className="app-surface min-h-screen flex">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center text-slate-400">Loading career details...</div>
      </div>
    );
  }

  const handleCreateActionPlan = () => {
    navigate(`/action-plan?career=${encodeURIComponent(career.title)}`);
  };

  const handleSaveToActionPlan = async () => {
    if (saving || saved) return;
    setSaving(true);
    setSaveError('');
    try {
      const result = await savedCareerService.saveCareer(career);
      if (!result) {
        setSaveError('Could not save this career. Please try again.');
        return;
      }
      setSaved(true);
      navigate('/saved-careers');
    } finally {
      setSaving(false);
    }
  };

  const learnMoreUrl = `https://www.google.com/search?q=${encodeURIComponent(`${career.title} career information`)}`;

  return (
    <div className="app-surface h-screen flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto">
        <div className="p-8 max-w-5xl w-full mx-auto space-y-6">
          {/* Back button link matching Screen 9 */}
          <div>
            <Link
              to="/career-recommendations"
              className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Recommendations
            </Link>
          </div>

          {/* Hero Career Card (Screen 9) */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{career.title}</h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Match Score {career.match_score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{career.description}</p>
                  <a
                    href={learnMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline mt-2"
                  >
                    Know more about this career <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Tag Chips */}
                  <div className="flex items-center gap-2 mt-3">
                    {career.tags?.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Screen 9) */}
            <div className="flex items-center gap-8 border-b border-slate-100 pt-2 text-xs font-semibold">
              {['Overview', 'Skills Required', 'Career Path', 'Top Colleges', 'All Colleges'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 transition-colors relative ${activeTab === tab
                    ? 'text-blue-600 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'Overview' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
                {/* Left Side: Why this is a good fit for you */}
                <div className="md:col-span-7 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Why this is a good fit for you?</h3>
                  <div className="space-y-3">
                    {career.why_fit_points?.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-600 font-medium">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Key Metadata Box */}
                <div className="career-metadata md:col-span-5 bg-slate-50/80 border border-slate-100 rounded-2xl p-6 space-y-4 text-left">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Salary</span>
                    <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">{career.avg_salary_lpa || 'Not available'}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Job Outlook</span>
                    <span className="text-sm font-extrabold text-emerald-600 mt-0.5 block">{career.job_outlook || 'Growing'}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Required Education</span>
                    <span className="text-xs font-semibold text-slate-700 mt-0.5 block">{career.required_education || 'Relevant qualification'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Skills Required' && (
              <div className="pt-2 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Essential Technical & Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {career.key_skills?.map((sk, idx) => (
                    <span key={idx} className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-800">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Career Path' && (
              <div className="pt-2 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Growth Progression Roadmap</h3>
                <div className="space-y-3">
                  {career.career_path?.map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{step.role}</span>
                        <span className="text-[11px] text-slate-500">{step.level}</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600">{step.salary}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Top Colleges' && (
              <div className="pt-2 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Top Colleges & Leading Institutions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {career.top_colleges?.map((college, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-slate-800">{college}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'All Colleges' && (
              <div className="pt-2 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">All Matching Colleges & Universities</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Showing the full college catalogue matching your selected stream, preferred locations and budget.
                  </p>
                </div>
                {allCollegesNote && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                    {allCollegesNote}
                  </div>
                )}
                {allCollegesLoading ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
                    Loading all matching colleges...
                  </div>
                ) : allColleges.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
                    {allColleges.map((college, idx) => (
                      <div key={`${college.name}-${college.city}-${idx}`} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-start gap-3">
                          <Building className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900">{college.name}</div>
                            <div className="text-[11px] text-slate-500 mt-1">{college.city}, {college.state}</div>
                            {college.programs?.length > 0 && (
                              <div className="text-[11px] text-slate-600 mt-1">
                                {college.programs.join(', ')}
                              </div>
                            )}
                            <div className="text-[10px] text-slate-400 mt-1.5">
                              {college.budget} budget band
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
                    No matching colleges are currently available for the selected stream, location and budget.
                  </div>
                )}
              </div>
            )}

            {/* Bottom Action (Screen 9) */}
            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 flex-wrap">
              {saveError && (
                <p className="w-full text-right text-xs text-red-500">{saveError}</p>
              )}
              <Button onClick={handleCreateActionPlan} size="md" className="px-8">
                Build Action Plan
              </Button>
              <Button onClick={handleSaveToActionPlan} size="md" className="px-8" disabled={saving || saved}>
                {saving ? 'Saving...' : saved ? 'Saved to Shortlist!' : 'Save to Shortlist'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
