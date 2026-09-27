import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import Input from '../components/Input';
import Button from '../components/Button';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { profileService } from '../services/profileService';

const DEFAULT_SKILLS = [
  'Communication',
  'Problem solving',
  'Analytical thinking',
  'Scientific reasoning',
  'Research',
  'Mathematics',
  'Programming',
  'Data analysis',
  'Critical thinking',
  'Creativity',
  'Leadership',
  'Teamwork',
  'Time management',
  'Writing',
  'Presentation',
  'Adaptability',
  'Decision making',
  'Project management',
  'Patient care',
  'Empathy',
  'Observation',
  'Logical reasoning',
  'Documentation',
  'Planning',
  'Experimentation'
];

const LOCATION_OPTIONS = [
  'All India',
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
];

export default function DetailedProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    skills: [],
    preferred_subjects: [],
    budget_range: '',
    preferred_locations: [],
  });
  const [loading, setLoading] = useState(false);

  const [skillOptions, setSkillOptions] = useState(DEFAULT_SKILLS);

  useEffect(() => {
    async function loadProfile() {
      try {
        const p = await profileService.getProfile();
        setFormData({
          skills: p?.skills || [],
          preferred_subjects: p?.preferred_subjects || [],
          budget_range: p?.budget_range || '',
          preferred_locations: p?.preferred_locations || [],
        });
      } catch (e) {
        // Keep the empty form if the profile cannot be loaded.
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    async function loadStreamConfig() {
      try {
        const config = await profileService.getStreamConfig();
        const streamSkills = config?.skills || [];
        const combinedSkills = Array.from(new Set([...streamSkills, 'Other']));
        setSkillOptions(combinedSkills);
      } catch (e) {
        setSkillOptions(['Communication', 'Problem solving', 'Adaptability', 'Research', 'Critical thinking', 'Other']);
      }
    }
    loadStreamConfig();
  }, []);

  useEffect(() => {
    const section = searchParams.get('section');
    if (!section) return;
    const timer = setTimeout(() => document.getElementById(`profile-${section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleSkillToggle = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const handleLocationToggle = (location) => {
    if (location === 'All India') {
      setFormData({ ...formData, preferred_locations: ['All India'] });
      return;
    }

    const selectedLocations = formData.preferred_locations.filter((item) => item !== 'All India');
    const nextLocations = selectedLocations.includes(location)
      ? selectedLocations.filter((item) => item !== location)
      : [...selectedLocations, location];

    setFormData({ ...formData, preferred_locations: nextLocations });
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      await profileService.saveStep2(formData);
      navigate('/personalized-questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-surface min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-8 max-w-5xl w-full mx-auto">
          <Header />

          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-xs space-y-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Detailed Skills & Preferences</h2>
                <span className="text-xs font-bold text-slate-500">Step 2 of 3</span>
              </div>
              <ProgressBar progress={66} />
            </div>

            {/* Skills selection */}
            <div id="profile-skills" className="space-y-3 scroll-mt-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Your Core Skills & Competencies</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select skills you currently possess or are comfortable with</p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {skillOptions.map((skill) => {
                  const isSelected = formData.skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget and Locations */}
            <div id="profile-preferences" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 scroll-mt-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Expected Higher Education Budget Range
                </label>
                <select
                  value={formData.budget_range}
                  onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select budget range</option>
                  <option value="Low (Under ₹ 3 Lakhs)">Low (Under ₹ 3 Lakhs)</option>
                  <option value="Medium (₹ 4 - 10 Lakhs)">Medium (₹ 4 - 10 Lakhs)</option>
                  <option value="High (₹ 10 - 25 Lakhs)">High (₹ 10 - 25 Lakhs)</option>
                  <option value="International / Open">International / Open</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Preferred Study / Career Location
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Select one or more states, or choose All India if you are open to any location.
                </p>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                  {LOCATION_OPTIONS.map((location) => {
                    const selected = formData.preferred_locations.includes(location);
                    return (
                      <button
                        key={location}
                        type="button"
                        onClick={() => handleLocationToggle(location)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${selected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                      >
                        {location}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <Button variant="secondary" onClick={() => navigate('/student-profile')} size="md">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button onClick={handleNext} disabled={loading} size="md">
                Conversational Discovery <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
