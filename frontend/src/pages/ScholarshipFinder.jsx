import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, GraduationCap, MapPin, Search, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { profileService } from '../services/profileService';
import { scholarshipSources, normalise, getProfileLocations } from '../services/opportunityData';

export default function ScholarshipFinder() {
  const [profile, setProfile] = useState(null);
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('All');

  useEffect(() => {
    profileService.getProfile().then(setProfile);
  }, []);

  const locations = getProfileLocations(profile);
  const locationHint = locations.length ? locations.join(', ') : 'your preferred location';

  const items = useMemo(() => scholarshipSources.filter((item) => {
    const haystack = normalise([item.title, item.provider, item.description, ...item.tags].join(' '));
    const queryMatch = !query.trim() || haystack.includes(normalise(query));
    const scopeMatch = scope === 'All' || item.categories.some((category) => normalise(category).includes(normalise(scope)));
    return queryMatch && scopeMatch;
  }), [query, scope]);

  return (
    <div className="app-surface min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <Header title="Scholarship Finder" subtitle="Explore scholarship routes, eligibility information and official application links in one place." />

          <section className="mt-5 rounded-3xl border border-[#ded5c5] bg-white p-5 md:p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#28705a] text-xs font-bold uppercase tracking-[0.12em]">
                  <Sparkles className="w-4 h-4" /> Personalised discovery
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Browse available scholarship sources and use the filters below to narrow down what is useful for you.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {locations.length ? locations.map((location) => <span key={location} className="inline-flex items-center gap-1 rounded-full bg-[#eef5ee] px-3 py-1 text-xs font-semibold text-[#32755c]"><MapPin className="w-3.5 h-3.5" />{location}</span>) : <span className="text-xs text-slate-400">No preferred location saved yet</span>}
                </div>
              </div>
              <a href="https://scholarships.gov.in/All-Scholarships" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#27483d] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#183f35] transition-colors">
                Search official scholarships <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </section>

          <section className="mt-5 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search scholarship, category or provider" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#8fb59d] focus:ring-2 focus:ring-[#dcebe0]" />
            </div>
            <select value={scope} onChange={(e) => setScope(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#8fb59d]">
              <option>All</option>
              <option>Merit</option>
              <option>Welfare</option>
              <option>State</option>
              <option>Technical</option>
            </select>
          </section>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e8f0e7] text-[#28705a] flex items-center justify-center"><GraduationCap className="w-5 h-5" /></div>
                  <span className="text-[11px] font-bold text-slate-400">{item.scope}</span>
                </div>
                <h2 className="mt-4 text-base font-extrabold text-slate-900 leading-snug">{item.title}</h2>
                <p className="mt-1 text-xs font-semibold text-[#32755c]">{item.provider}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">{item.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-50 border border-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">{tag}</span>)}</div>
                <a href={item.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">Check eligibility / apply <ExternalLink className="w-3.5 h-3.5" /></a>
              </article>
            ))}
          </div>

          {!items.length && <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><p className="text-sm font-bold text-slate-700">No matching scholarship sources found.</p><p className="mt-1 text-xs text-slate-500">Try a broader search or use the official scholarship search above.</p></div>}

          <p className="mt-5 text-[11px] text-slate-400">Always verify current eligibility, deadlines and application requirements on the official scholarship portal before applying.</p>
        </div>
      </main>
    </div>
  );
}
