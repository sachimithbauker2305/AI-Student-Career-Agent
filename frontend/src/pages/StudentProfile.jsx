import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import Input from '../components/Input';
import Button from '../components/Button';
import { ArrowRight, Check } from 'lucide-react';
import { profileService } from '../services/profileService';

export default function StudentProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    education_level: '',
    stream_major: '',
    cgpa_percentage: 0,
    year_of_study: '',
    interests: [],
  });
  const [loading, setLoading] = useState(false);

  const interestsByStream = {
    'Computer Science': ['Technology', 'AI/ML', 'Data & Analytics', 'Cybersecurity', 'Software Development', 'Problem Solving', 'Innovation', 'Other'],
    'Information Technology': ['Technology', 'Cybersecurity', 'Data & Analytics', 'Software Development', 'Problem Solving', 'Innovation', 'Other'],
    'Commerce': ['Finance', 'Accounting', 'Economics', 'Business', 'Banking', 'Strategy', 'Problem Solving', 'Other'],
    'Business Administration': ['Business', 'Marketing', 'Finance', 'Leadership', 'Strategy', 'Entrepreneurship', 'Communication', 'Other'],
    'Finance': ['Finance', 'Accounting', 'Economics', 'Banking', 'Investment', 'Business', 'Analytics', 'Other'],
    'Biology': ['Science', 'Research', 'Biology', 'Healthcare', 'Environment', 'Innovation', 'Other'],
    'Life Sciences': ['Science', 'Research', 'Biology', 'Biotechnology', 'Healthcare', 'Environment', 'Other'],
    'Chemistry': ['Science', 'Research', 'Chemistry', 'Laboratory', 'Pharmaceuticals', 'Materials', 'Other'],
    'Physics': ['Science', 'Research', 'Physics', 'Mathematics', 'Technology', 'Engineering', 'Other'],
    'Mathematics': ['Mathematics', 'Data & Analytics', 'Science', 'Research', 'Finance', 'Problem Solving', 'Other'],
    'Healthcare': ['Healthcare', 'Medicine', 'Biology', 'Research', 'Public Health', 'Patient Care', 'Other'],
    'Medical': ['Healthcare', 'Medicine', 'Biology', 'Research', 'Patient Care', 'Clinical Practice', 'Other'],
    'MBBS / Medicine': ['Medicine', 'Healthcare', 'Clinical Practice', 'Research', 'Patient Care', 'Other'],
    'BDS / Dental': ['Dental', 'Healthcare', 'Patient Care', 'Biology', 'Clinical Practice', 'Other'],
    'BAMS / Ayurveda': ['Ayurveda', 'Healthcare', 'Biology', 'Patient Care', 'Research', 'Other'],
    'BHMS / Homeopathy': ['Homeopathy', 'Healthcare', 'Biology', 'Patient Care', 'Research', 'Other'],
    'Pharmacy': ['Pharmacy', 'Healthcare', 'Biology', 'Chemistry', 'Research', 'Drug Safety', 'Other'],
    'Design': ['Design', 'Fashion', 'Interior & Spatial Design', 'Textiles', 'Product & Furniture Design', 'Graphic & Visual Design', 'UI/UX', 'Creativity', 'Arts', 'Other'],
    'Law': ['Law', 'Legal Research', 'Communication', 'Public Service', 'Business', 'Social Impact', 'Other'],
    'Arts & Humanities': ['Arts', 'Writing', 'Psychology', 'History', 'Social Impact', 'Communication', 'Other'],
    'Psychology': ['Psychology', 'Research', 'Communication', 'Healthcare', 'Social Impact', 'Writing', 'Other'],
    'Media & Communication': ['Media', 'Writing', 'Communication', 'Marketing', 'Content Creation', 'Creativity', 'Other'],
    'UPSC / Civil Services': ['Public Service', 'Governance', 'Administration', 'Public Policy', 'Leadership', 'Other'],
    'SSC / Banking / Railways': ['Public Service', 'Banking', 'Finance', 'Administration', 'Analytics', 'Other'],
    'Public Service / Administration': ['Public Service', 'Governance', 'Administration', 'Public Policy', 'Social Impact', 'Other'],
    'Defence / Police': ['Defence', 'Police', 'Security', 'Leadership', 'Public Service', 'Fitness', 'Other'],
    'Other': ['Exploration', 'Communication', 'Problem Solving', 'Research', 'Creativity', 'Learning', 'Other']
  };

  const availableInterests = interestsByStream[formData.stream_major] || ['Communication', 'Problem Solving', 'Research', 'Creativity', 'Learning', 'Other'];

  const streamOptions = [
    'Computer Science',
    'Information Technology',
    'Commerce',
    'Business Administration',
    'Finance',
    'Biology',
    'Life Sciences',
    'Chemistry',
    'Physics',
    'Mathematics',
    'Healthcare',
    'Medical',
    'MBBS / Medicine',
    'BDS / Dental',
    'BAMS / Ayurveda',
    'BHMS / Homeopathy',
    'Pharmacy',
    'Design',
    'Law',
    'Arts & Humanities',
    'Psychology',
    'Media & Communication',
    'UPSC / Civil Services',
    'SSC / Banking / Railways',
    'Public Service / Administration',
    'Defence / Police',
    'Other'
  ];

  const normalizeEducationLevel = (educationLevel) => {
    if (!educationLevel) return '';

    const normalizedMap = {
      'School / Secondary (Class 9-12)': 'School / Secondary',
      'School / Secondary': 'School / Secondary',
      'Currently pursuing': 'Undergraduate',
      'Undergraduate': 'Undergraduate',
      'Postgraduate': 'Postgraduate',
      'Diploma / Vocational': 'Diploma / Vocational',
      'Certificate / Skill Course': 'Certificate / Skill Course',
      'Dropped out / not studying currently': 'Dropped out / not studying currently'
    };

    return normalizedMap[educationLevel] || educationLevel;
  };

  const getYearOptions = (educationLevel) => {
    const yearOptionsMap = {
      'School / Secondary': ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'Completed Class 12'],
      'Dropped out / not studying currently': [
        'School / Secondary',
        'Undergraduate',
        'Postgraduate',
        'Diploma / Vocational',
        'Certificate / Skill Course'
      ],
      Undergraduate: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'],
      Postgraduate: ['1st Year', '2nd Year', 'Completed'],
      'Diploma / Vocational': ['1st Year', '2nd Year', '3rd Year', 'Completed'],
      'Certificate / Skill Course': ['1st Semester', '2nd Semester', 'Completed']
    };

    return yearOptionsMap[educationLevel] || yearOptionsMap.Undergraduate;
  };

  useEffect(() => {
    async function load() {
      const p = await profileService.getProfile();
      if (p) {
        const educationLevel = normalizeEducationLevel(p.education_level || '');
        const validYearOptions = getYearOptions(educationLevel);
        const currentYear = p.year_of_study && validYearOptions.includes(p.year_of_study) ? p.year_of_study : '';

        setFormData({
          education_level: educationLevel,
          stream_major: p.stream_major || '',
          cgpa_percentage: p.cgpa_percentage || 0,
          year_of_study: currentYear,
          interests: p.interests && p.interests.length > 0 ? p.interests : []
        });
      }
    }
    load();
  }, []);

  useEffect(() => {
    const section = searchParams.get('section');
    if (!section) return;
    const timer = setTimeout(() => document.getElementById(`profile-${section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const yearOptions = getYearOptions(formData.education_level);

  const handleEducationLevelChange = (newEducationLevel) => {
    const normalizedLevel = normalizeEducationLevel(newEducationLevel);
    const nextYearOptions = getYearOptions(normalizedLevel);
    const nextYear = nextYearOptions.includes(formData.year_of_study) ? formData.year_of_study : nextYearOptions[0];

    setFormData({
      ...formData,
      education_level: normalizedLevel,
      year_of_study: nextYear
    });
  };

  const handleInterestToggle = (interest) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter((i) => i !== interest)
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      localStorage.setItem('studentProfile', JSON.stringify(formData));
      await profileService.saveStep1(formData);
      navigate('/detailed-profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-surface min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="student-profile-content p-8 w-full">
          <Header />

          {/* Card Container matching Screen 3 */}
          <div className="student-profile-card bg-white rounded-2xl border border-slate-100 p-8 shadow-xs space-y-8">
            {/* Step Heading & Progress */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Student Profile</h2>
                <span className="text-xs font-bold text-slate-500">Step 1 of 3</span>
              </div>
              <ProgressBar progress={33} />
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Academic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Current education level
                  </label>
                  <select
                    value={formData.education_level}
                    onChange={(e) => handleEducationLevelChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select education level</option>
                    <option value="School / Secondary">School / Secondary</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Diploma / Vocational">Diploma / Vocational</option>
                    <option value="Certificate / Skill Course">Certificate / Skill Course</option>
                    <option value="Dropped out / not studying currently">Dropped out / not studying currently</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Stream / Major
                  </label>
                  <select
                    value={formData.stream_major}
                    onChange={(e) => {
                      const nextStream = e.target.value;
                      const nextInterests = (interestsByStream[nextStream] || []).filter((interest) => formData.interests.includes(interest));
                      setFormData({ ...formData, stream_major: nextStream, interests: nextInterests });
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select stream / major</option>
                    {streamOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Current CGPA / Percentage"
                  type="number"
                  step="0.1"
                  suffix={formData.cgpa_percentage > 10 ? '%' : '/ 10'}
                  placeholder="8.5"
                  value={formData.cgpa_percentage}
                  onChange={(e) => setFormData({ ...formData, cgpa_percentage: parseFloat(e.target.value) || 0 })}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                    {formData.education_level === 'Dropped out / not studying currently' ? 'Last completed education' : 'Year of Study'}
                  </label>
                  <select
                    value={formData.year_of_study}
                    onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select year or current stage</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Interests & Preferences */}
            <div id="profile-interests" className="space-y-3 scroll-mt-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Interests & Preferences</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select your interests (multiple)</p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {availableInterests.map((interest) => {
                  const isSelected = formData.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <Button onClick={handleNext} disabled={loading} size="md">
                Next <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
