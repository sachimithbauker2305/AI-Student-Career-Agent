import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import { CheckCircle2, Clock, Calendar, Check, Sparkles, ExternalLink, BookOpen } from 'lucide-react';
import { dashboardService, getStepResources } from '../services/dashboardService';

export default function ActionPlan() {
  const [plan, setPlan] = useState(null);
  const [searchParams] = useSearchParams();
  const selectedCareer = searchParams.get('career') || '';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await dashboardService.getActionPlan(selectedCareer);
      setPlan(data);
      setLoading(false);
    }
    load();
  }, [selectedCareer]);

  const handleStatusToggle = async (stepNumber, currentStatus) => {
    let nextStatus = 'In Progress';
    if (currentStatus === 'In Progress') nextStatus = 'Completed';
    else if (currentStatus === 'Completed') nextStatus = 'Upcoming';
    else if (currentStatus === 'Upcoming') nextStatus = 'In Progress';

    const updatedSteps = plan.steps.map((s) =>
      s.step_number === stepNumber ? { ...s, status: nextStatus } : s
    );
    setPlan({ ...plan, steps: updatedSteps });

    await dashboardService.updateStepStatus(stepNumber, nextStatus, plan.target_career);
  };

  const getStatusBadge = (status) => {
    if (status === 'In Progress') {
      return (
        <span className="action-status action-status-progress px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
          In Progress
        </span>
      );
    }
    if (status === 'Completed') {
      return (
        <span className="action-status action-status-complete px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
          <Check className="w-3 h-3" /> Completed
        </span>
      );
    }
    return (
      <span className="action-status action-status-upcoming px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
        Upcoming
      </span>
    );
  };

  if (loading || !plan) {
    return (
      <div className="app-surface min-h-screen flex">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center text-slate-400">
          Loading your action plan...
        </div>
      </div>
    );
  }

  if (!plan.steps?.length) {
    return (
      <div className="app-surface min-h-screen flex">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center max-w-xl">
            <h2 className="text-lg font-bold text-slate-800">Your action plan is not created yet.</h2>
            <p className="text-sm text-slate-500 mt-2">Complete your profile and explore a career path to generate personalized steps.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-surface min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-8 max-w-5xl w-full mx-auto space-y-6">
          <Header
            title="Your Personalized Action Plan"
            subtitle={`Here's a step-by-step plan to help you achieve your goal: ${plan.target_career}`}
          />

          {plan.steps?.length > 0 && plan.steps.every((step) => step.status === 'Completed') && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-900">Well done — you completed your action plan.</p>
                <p className="text-xs text-emerald-800 mt-1">You have finished all the steps for {plan.target_career}. Take a moment to review what you built and decide what you want to tackle next.</p>
              </div>
            </div>
          )}

          {/* Vertical Stepper Timeline matching Screen 6 */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
            <div className="space-y-6 relative">
              {/* Connecting line */}
              <div className="absolute top-6 bottom-6 left-5 w-0.5 bg-slate-100 -z-0" />

              {plan.steps?.map((step) => (
                <div
                  key={step.step_number}
                  className="flex items-start gap-5 relative z-10 group"
                >
                  {/* Step Number Circle (Screen 6) */}
                  <div
                    onClick={() => handleStatusToggle(step.step_number, step.status)}
                    title="Click to toggle status"
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 cursor-pointer shadow-xs transition-transform group-hover:scale-105 ${step.status === 'In Progress'
                      ? 'bg-blue-600 text-white shadow-blue-500/25 ring-4 ring-blue-50'
                      : step.status === 'Completed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 text-white'
                      }`}
                  >
                    {step.status === 'Completed' ? <Check className="w-5 h-5" /> : step.step_number}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-5 shadow-xs transition-all">
                    <div className="flex items-center justify-between gap-4 flex-wrap mb-1.5">
                      <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                      <button
                        onClick={() => handleStatusToggle(step.step_number, step.status)}
                        className="cursor-pointer focus:outline-none"
                      >
                        {getStatusBadge(step.status)}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mt-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Timeline: {step.timeline}</span>
                    </div>

                    <details className="mt-3 border-t border-slate-100 pt-3">
                      <summary className="cursor-pointer list-none inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                        <BookOpen className="w-3.5 h-3.5" /> Read more and explore resources
                      </summary>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(step.resources || getStepResources(step, plan.target_career)).map((resource) => (
                          <a
                            key={resource.url}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600"
                          >
                            {resource.label} <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
