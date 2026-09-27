import apiClient from './apiClient';
import { authService } from './authService';

const ACTION_PLAN_STORAGE_KEY = 'career_action_plan_state';

export const calculateActionPlanProgress = (steps = []) => {
  const progress = steps.reduce((total, step) => {
    if (step.status === 'Completed') return total + 20;
    if (step.status === 'In Progress') return total + 10;
    return total;
  }, 0);

  return Math.min(progress, 100);
};

export const getStepResources = (step, career = '') => {
  const text = `${step?.title || ''} ${career}`.toLowerCase();
  const query = encodeURIComponent(`${step?.title || career} career learning resources India`);
  const resources = [
    { label: 'Search guides', url: `https://www.google.com/search?q=${query}` },
    { label: 'Find videos', url: `https://www.youtube.com/results?search_query=${query}` }
  ];

  if (text.includes('project') || text.includes('application')) {
    resources.push({ label: 'Find internships', url: 'https://internshala.com/internships/' });
  }
  if (text.includes('skill') || text.includes('course')) {
    resources.push({ label: 'Browse courses', url: 'https://www.coursera.org/courses?query=' + query });
  }
  if (text.includes('read') || text.includes('core')) {
    resources.push({ label: 'Read Wikipedia', url: `https://en.wikipedia.org/wiki/Special:Search?search=${query}` });
  }

  return resources;
};

const safeLocalStorage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      // ignore storage failures in restricted environments
    }
  }
};

const normalizePlan = (plan, fallbackCareer = '') => {
  if (!plan || !Array.isArray(plan.steps)) return null;

  const safeCareer = plan.target_career || fallbackCareer || 'your selected career';
  return {
    ...plan,
    target_career: safeCareer,
    steps: plan.steps.map((step) => ({
      ...step,
      status: step.status || 'Upcoming',
      resources: Array.isArray(step.resources) && step.resources.length
        ? step.resources
        : getStepResources(step, safeCareer)
    }))
  };
};

const readStoredActionPlan = (career = '') => {
  try {
    const raw = safeLocalStorage.get(ACTION_PLAN_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    if (!career) return parsed;

    const targetCareer = parsed.target_career || career;
    if (!parsed.target_career) return { ...parsed, target_career: targetCareer };
    if (parsed.target_career !== career) {
      return null;
    }
    return parsed;
  } catch (err) {
    return null;
  }
};

const saveStoredActionPlan = (plan) => {
  if (!plan) return;
  safeLocalStorage.set(ACTION_PLAN_STORAGE_KEY, JSON.stringify(plan));
};

const clearStoredActionPlan = () => {
  try {
    localStorage.removeItem(ACTION_PLAN_STORAGE_KEY);
  } catch (err) {
    // Ignore storage failures.
  }
};

export const dashboardService = {
  async getSummary() {
    try {
      const res = await apiClient.get('/api/dashboard/summary');
      return res.data;
    } catch (err) {
      return {
        student_name: authService.getCurrentUser()?.first_name || 'Name',
        profile_completion: 0,
        recommended_careers_count: 0,
        action_plan_progress: 0,
        top_matches: [],
        recent_activity: []
      };
    }
  },

  async getActionPlan(career = '') {
    const fallbackPlan = {
      target_career: career || 'your selected career',
      steps: [
        {
          step_number: 1,
          title: `Build Core Skills for ${career || 'your selected career'}`,
          status: 'In Progress',
          description: `Learn the core skills and subjects required for ${career || 'your selected career'}.`,
          timeline: '1-2 months'
        },
        {
          step_number: 2,
          title: 'Build 2 Relevant Projects',
          status: 'Upcoming',
          description: `Create projects that demonstrate skills relevant to ${career || 'your selected career'}.`,
          timeline: '2-3 months'
        },
        {
          step_number: 3,
          title: 'Strengthen Career-Specific Skills',
          status: 'Upcoming',
          description: `Practice the technical or professional skills used in ${career || 'your selected career'}.`,
          timeline: '1 month'
        },
        {
          step_number: 4,
          title: 'Explore Relevant Courses',
          status: 'Upcoming',
          description: 'Take certified courses on platforms like Coursera, Udemy, or edX.',
          timeline: '2-3 months'
        },
        {
          step_number: 5,
          title: 'Prepare Applications',
          status: 'Upcoming',
          description: 'Update your resume, build your LinkedIn profile and start applying.',
          timeline: 'Ongoing'
        }
      ]
    };

    try {
      const query = career ? `?career=${encodeURIComponent(career)}` : '';
      const res = await apiClient.get(`/api/action-plan${query}`);
      const plan = normalizePlan(res.data, career || 'your selected career');
      if (plan) {
        if (!plan.steps.length) {
          clearStoredActionPlan();
          return plan;
        }
        saveStoredActionPlan(plan);
        return plan;
      }
      clearStoredActionPlan();
      return { target_career: '', steps: [] };
    } catch (err) {
      const storedPlan = readStoredActionPlan(career || 'your selected career');
      if (storedPlan) {
        const normalized = normalizePlan(storedPlan, career || 'your selected career');
        if (normalized) return normalized;
      }
      clearStoredActionPlan();
      return { target_career: '', steps: [] };
    }
  },

  async updateStepStatus(stepNumber, newStatus, career = '') {
    const currentPlan = readStoredActionPlan(career || 'your selected career');
    const effectivePlan = normalizePlan(currentPlan || {
      target_career: career || 'your selected career',
      steps: []
    }, career || 'your selected career');

    if (effectivePlan) {
      const updatedSteps = effectivePlan.steps.map((step) =>
        step.step_number === stepNumber ? { ...step, status: newStatus } : step
      );
      const updatedPlan = { ...effectivePlan, steps: updatedSteps };
      saveStoredActionPlan(updatedPlan);
    }

    try {
      const query = career ? `?career=${encodeURIComponent(career)}` : '';
      const res = await apiClient.post(`/api/action-plan/update-status${query}`, {
        step_number: stepNumber,
        status: newStatus
      });
      return res.data;
    } catch (err) {
      return { status: 'success' };
    }
  }
};
