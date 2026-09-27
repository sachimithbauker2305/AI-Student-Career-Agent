import React from 'react';
import { Link } from 'react-router-dom';
import { Code, BarChart3, Cpu, Cloud, Palette, Shield, Sparkles, Info, X, CheckCircle2 } from 'lucide-react';

export default function CareerCard({ career }) {
  const [showInsight, setShowInsight] = React.useState(false);
  const getIcon = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('software') || t.includes('developer')) return { icon: Code, bg: 'bg-blue-50 text-blue-600 border-blue-100' };
    if (t.includes('data') || t.includes('analyst')) return { icon: BarChart3, bg: 'bg-amber-50 text-amber-600 border-amber-100' };
    if (t.includes('ai') || t.includes('ml')) return { icon: Cpu, bg: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
    if (t.includes('cloud')) return { icon: Cloud, bg: 'bg-sky-50 text-sky-600 border-sky-100' };
    if (t.includes('design') || t.includes('ui')) return { icon: Palette, bg: 'bg-pink-50 text-pink-600 border-pink-100' };
    if (t.includes('security')) return { icon: Shield, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    return { icon: Sparkles, bg: 'bg-blue-50 text-blue-600 border-blue-100' };
  };

  const { icon: CareerIcon, bg: iconBg } = getIcon(career.title);

  return (
    <>
      <div className="career-recommendation-card group bg-white/95 border border-slate-100 rounded-2xl p-6 shadow-xs hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        {/* Category Icon */}
        <div className={`w-13 h-13 rounded-2xl border flex items-center justify-center shrink-0 p-3 ${iconBg}`}>
          <CareerIcon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base font-bold text-slate-900">{career.title}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              Match Score {career.match_score}%
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            {career.description}
          </p>
          <div className="mt-3 max-w-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Profile match</span>
              <span className="text-[10px] font-extrabold text-emerald-700">{career.match_score}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-700 group-hover:from-emerald-400 group-hover:to-amber-300"
                style={{ width: `${career.match_score}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-slate-500 pt-0.5">
            <span className="font-semibold text-slate-700">Why this is a good fit: </span>
            <span>{career.why_fit}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2">
        <button
          type="button"
          onClick={() => setShowInsight(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-emerald-100 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] w-full md:w-auto"
        >
          <Info className="w-4 h-4" />
          Quick Insight
        </button>
        <Link
          to={`/career-details/${career.id || 1}`}
          className="inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 group-hover:border-emerald-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] w-full md:w-auto"
        >
          View Details
        </Link>
      </div>
    </div>

      {showInsight && (
        <div
          className="career-insight-overlay fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${career.title} quick insight`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowInsight(false);
          }}
        >
          <div className="career-insight-modal relative w-full max-w-lg rounded-3xl border border-white/60 bg-white/95 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setShowInsight(false)}
              className="absolute right-4 top-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all hover:rotate-90"
              aria-label="Close quick insight"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 pr-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-emerald-700">Quick insight</p>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{career.title}</h3>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-100 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Profile match</span>
                <span className="text-2xl font-extrabold text-emerald-700">{career.match_score}%</span>
              </div>
              <div className="mt-3 h-2.5 rounded-full bg-white/80 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400" style={{ width: `${career.match_score}%` }} />
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mt-5">{career.description}</p>

            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                <p className="text-sm text-slate-700"><span className="font-bold">Why it fits:</span> {career.why_fit}</p>
              </div>
              {career.key_skills?.slice(0, 4).map((skill) => (
                <span key={skill} className="inline-flex mr-2 mb-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
