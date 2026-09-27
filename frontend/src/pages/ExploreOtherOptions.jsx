import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import { Compass, GraduationCap, Award, BookOpen, ArrowRight } from 'lucide-react';
import { profileService } from '../services/profileService';

export default function ExploreOtherOptions() {
  const [alternatePaths, setAlternatePaths] = useState([]);

  useEffect(() => {
    async function load() {
      const cfg = await profileService.getStreamConfig();
      const paths = cfg?.pathways || [];
      setAlternatePaths(paths.slice(0, 3).map((title, idx) => ({
        title,
        type: idx === 0 ? 'Stream Pathway' : idx === 1 ? 'Related Pathway' : 'Alternative Pathway',
        duration: idx === 0 ? '6 - 12 Months' : idx === 1 ? '1 Year' : 'Flexible',
        pros: `Relevant to your ${cfg.stream} background and interests`,
        cons: 'Review the qualification and entry requirements before applying',
      })));
    }
    load();
  }, []);

  return (
    <div className="app-surface min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-8 max-w-5xl w-full mx-auto space-y-6">
          <Header
            title="Explore Other Options"
            subtitle="Evaluate adjacent degrees, vocational certifications, and alternative pathways."
          />

          <div className="grid grid-cols-1 gap-4">
            {alternatePaths.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700">
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-400">&bull; {item.duration}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div><strong className="text-emerald-700">Upside:</strong> {item.pros}</div>
                    <div><strong className="text-amber-700">Consideration:</strong> {item.cons}</div>
                  </div>
                </div>

                <Link to="/action-plan" className="shrink-0 w-full md:w-auto">
                  <Button variant="secondary" size="sm" className="w-full md:w-auto">
                    Consider in Plan <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
