import apiClient from './apiClient';

export const savedCareerService = {
  async getSavedCareers() {
    try {
      const res = await apiClient.get('/api/saved-careers', { timeout: 8000 });
      return res.data || [];
    } catch (err) {
      return [];
    }
  },

  async saveCareer(career) {
    const careerId = Number(career?.id ?? career?.career_id ?? 0);
    if (!Number.isFinite(careerId) || careerId <= 0) {
      return null;
    }

    const payload = {
      career_id: careerId,
      title: career.title || 'Career',
      domain: career.domain || '',
      match_score: Number(career.match_score || 0),
      description: career.description || '',
      why_fit: career.why_fit || '',
      avg_salary_lpa: career.avg_salary_lpa || '',
      required_education: career.required_education || '',
      key_skills: Array.isArray(career.key_skills) ? career.key_skills : [],
      tags: Array.isArray(career.tags) ? career.tags : []
    };

    try {
      const res = await apiClient.post('/api/saved-careers', payload, { timeout: 8000 });
      return res.data;
    } catch (err) {
      return null;
    }
  },

  async deleteSavedCareer(careerId) {
    try {
      const res = await apiClient.delete(`/api/saved-careers/${careerId}`, { timeout: 8000 });
      return res.data;
    } catch (err) {
      return { status: 'success', career_id: careerId };
    }
  },

  async compareSavedCareers(careerIds = []) {
    try {
      const ids = careerIds.filter(Boolean).map(String).join(',');
      if (!ids) return [];
      const res = await apiClient.get(`/api/saved-careers/compare?career_ids=${encodeURIComponent(ids)}`, { timeout: 8000 });
      return res.data || [];
    } catch (err) {
      return [];
    }
  }
};
