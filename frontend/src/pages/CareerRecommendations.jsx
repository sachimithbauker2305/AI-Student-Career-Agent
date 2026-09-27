import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CareerCard from '../components/CareerCard';
import { recommendationService } from '../services/recommendationService';

export default function CareerRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [loading, setLoading] = useState(true);

  const filterDomains = ['All'];

  useEffect(() => {
    async function loadRecs() {
      setLoading(true);
      const recs = await recommendationService.getRecommendations(selectedDomain);
      setRecommendations(recs);
      setLoading(false);
    }
    loadRecs();
  }, [selectedDomain]);

  return (
    <div className="app-surface recommendations-page h-screen flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto">
        <div className="p-8 max-w-5xl w-full mx-auto space-y-6">
          <Header
            title="Career Recommendations"
            subtitle="Explore digital and non-digital career paths ranked around your profile. Your stream is one factor, not a limit."
          />

          {/* Category Filter Tabs (Screen 5) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filterDomains.map((domain) => {
              const active = selectedDomain === domain;
              return (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${active
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                >
                  {domain}
                </button>
              );
            })}
          </div>

          {/* Career Cards List (Screen 5) */}
          <div className="space-y-4 pt-2">
            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                Loading recommendations...
              </div>
            ) : recommendations.length > 0 ? (
              recommendations.map((career) => (
                <CareerCard key={career.id} career={career} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                <p className="text-sm font-bold text-slate-700">Your career paths are not explored yet.</p>
                <p className="text-xs text-slate-500 mt-2">Complete your profile and discovery questions to see personalized recommendations here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
