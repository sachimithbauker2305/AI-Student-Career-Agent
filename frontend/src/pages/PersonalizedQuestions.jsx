import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { Sparkles, HelpCircle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { profileService } from '../services/profileService';

export default function PersonalizedQuestions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      const q = await profileService.getAdaptiveQuestions();
      setQuestions(q || []);
    }
    fetchQuestions();
  }, []);

  const handleSelect = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentIdx]?.id || currentIdx]: option
    });
  };

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setSubmitting(true);
      try {
        await profileService.submitAnswers(selectedAnswers);
        navigate('/profile-analysis');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const currentQ = questions[currentIdx];
  const isSelected = (opt) => selectedAnswers[currentQ?.id || currentIdx] === opt;

  return (
    <div className="app-surface min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-8 max-w-4xl w-full mx-auto">
          <Header />

          <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-sm space-y-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> Adaptive Conversational Discovery
                </div>
                <span className="text-xs font-bold text-slate-500">Step 3 of 3</span>
              </div>
              <ProgressBar progress={100} />
            </div>

            {currentQ ? (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                    Q{currentIdx + 1}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      {currentQ.question}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      The AI agent uses this response to refine career weights and explain trade-offs.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  {currentQ.options?.map((opt, i) => {
                    const selected = isSelected(opt);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelect(opt)}
                        className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between ${selected
                            ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-700'
                          }`}
                      >
                        <span className="flex-1 pr-3">{opt}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                          }`}>
                          {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">Loading discovery prompts...</div>
            )}

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => {
                  if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
                  else navigate('/detailed-profile');
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={!selectedAnswers[currentQ?.id || currentIdx] || submitting}
              >
                {currentIdx < questions.length - 1 ? 'Next Question' : (submitting ? 'Generating AI Analysis...' : 'Analyze Profile')}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
