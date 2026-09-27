import React from 'react';
import { Link } from 'react-router-dom';
import { Code, BarChart3, Cpu, Cloud, Palette, Shield, Sparkles, ChevronRight } from 'lucide-react';

export default function CareerCard({ career }) {
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
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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

          <div className="text-xs text-slate-500 pt-0.5">
            <span className="font-semibold text-slate-700">Why this is a good fit: </span>
            <span>{career.why_fit}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="shrink-0 w-full md:w-auto">
        <Link
          to={`/career-details/${career.id || 1}`}
          className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-semibold rounded-xl transition-colors w-full md:w-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
