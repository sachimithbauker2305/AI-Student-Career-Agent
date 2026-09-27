import React, { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, ExternalLink, MapPin, Search, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { profileService } from '../services/profileService';
import { internshipSources, normalise, getProfileLocations } from '../services/opportunityData';

export default function InternshipFinder() {
  const [profile, setProfile] = useState(null);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('All');
  const [location, setLocation] = useState('');

  useEffect(() => {
    profileService.getProfile().then(setProfile);
  }, []);

  const profileLocations = getProfileLocations(profile);
  const items = useMemo(() => internshipSources.filter((item) => {
    const haystack = normalise([item.title, item.provider, item.description, ...item.tags].join(' '));
    const queryMatch = !query.trim() || haystack.includes(normalise(query));
    const modeMatch = mode === 'All' || item.modes.includes(mode);
    const locationMatch = !location.trim() || normalise(item.scope).includes(normalise(location)) || item.id === 'aicte-internship' || item.id === 'ncs-internships';
    return queryMatch && modeMatch && locationMatch;
  }), [query, mode, location]);

  return (
    <div className="app-surface min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <Header title="Internship Finder" subtitle="Explore internship routes by role, location and preferred work mode." />

          <section className="mt-5 rounded-3xl border border-[#ded5c5] bg-white p-5 md:p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#28705a] text-xs font-bold uppercase tracking-[0.12em]"><Sparkles className="w-4 h-4" /> Career experience</div>
                <p className="mt-2 text-sm text-slate-600">Browse internship sources and use the search and filters to find opportunities that fit what you are looking for.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {profileLocations.length ? profileLocations.map((loc) => <span key={loc} className="inline-flex items-center gap-1 rounded-full bg-[#eef5ee] px-3 py-1 text-xs font-semibold text-[#32755c]"><MapPin className="w-3.5 h-3.5" />{loc}</span>) : <span className="text-xs text-slate-400">No preferred location saved yet</span>}
                </div>
              </div>
              <a href="https://internship.aicte-india.org/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#27483d] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#183f35] transition-colors">Open AICTE internship portal <ExternalLink className="w-4 h-4" /></a>
            </div>
          </section>

          <section className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search internship, field or provider" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#8fb59d] focus:ring-2 focus:ring-[#dcebe0]" />
            </div>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City / state" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#8fb59d]" />
            <select value={mode} onChange={(e) => setMode(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#8fb59d]"><option>All</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select>
          </section>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3"><div className="w-10 h-10 rounded-xl bg-[#fff0dd] text-[#c46a31] flex items-center justify-center"><BriefcaseBusiness className="w-5 h-5" /></div><span className="text-[11px] font-bold text-slate-400">{item.scope}</span></div>
                <h2 className="mt-4 text-base font-extrabold text-slate-900 leading-snug">{item.title}</h2>
                <p className="mt-1 text-xs font-semibold text-[#c46a31]">{item.provider}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">{item.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-50 border border-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">{tag}</span>)}</div>
                <a href={item.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">Explore internships <ExternalLink className="w-3.5 h-3.5" /></a>
              </article>
            ))}
          </div>

          {!items.length && <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><p className="text-sm font-bold text-slate-700">No matching internship sources found.</p><p className="mt-1 text-xs text-slate-500">Try a broader keyword, a different city or another work mode.</p></div>}

          <p className="mt-5 text-[11px] text-slate-400">Always verify the employer, stipend, eligibility, location and application deadline on the destination portal before applying.</p>
        </div>
      </main>
    </div>
  );
}
