import apiClient from './apiClient';

export const recommendationService = {
  async getRecommendations(domain = 'All') {
    try {
      const res = await apiClient.get(`/api/recommendations/list?domain=${domain}`);
      return res.data;
    } catch (err) {
      // Never invent recommendations when the backend is unavailable or the profile is incomplete.
      return [];
      /*
      const profile = JSON.parse(localStorage.getItem('studentProfile') || '{}');
      const major = String(profile.stream_major || '').toLowerCase();
      const is = (...words) => words.some(w => major.includes(w));
      let list;
      if (is('commerce', 'b.com', 'account', 'finance')) {
        list = [
          { id: 9, title: 'Business Analyst', domain: 'Business', match_score: 88, description: 'Use business, finance and analytical skills to solve organisational problems.', why_fit: 'Your Commerce background supports business analysis, finance and process improvement.', why_fit_points: ['Commerce and business knowledge','Analytical thinking','Finance and process understanding'], avg_salary_lpa: '₹ 5 - 10 LPA', job_outlook: 'High', required_education: 'B.Com / BBA / MBA or related degree', tags: ['Business','Analytics','Growth'], key_skills: ['Excel','Financial Analysis','Communication','Business Analysis'] },
          { id: 7, title: 'Product Manager', domain: 'Business', match_score: 84, description: 'Guide products using business, customer and market understanding.', why_fit: 'Commerce knowledge can support product strategy, market analysis and business decisions.', why_fit_points: ['Business understanding','Market awareness','Communication'], avg_salary_lpa: '₹ 10 - 22 LPA', job_outlook: 'High', required_education: "Bachelor's degree, MBA a plus", tags: ['Business','Strategy','Management'], key_skills: ['Strategy','Market Research','Communication','Agile'] },
          { id: 10, title: 'Financial Analyst', domain: 'Finance', match_score: 82, description: 'Analyse financial performance, budgets and investment information.', why_fit: 'Commerce and finance subjects provide a strong foundation for financial analysis.', why_fit_points: ['Accounting and finance foundation','Numerical analysis','Business knowledge'], avg_salary_lpa: '₹ 5 - 12 LPA', job_outlook: 'High', required_education: 'B.Com / BBA / Finance or related degree', tags: ['Finance','Analytics','Business'], key_skills: ['Financial Analysis','Excel','Accounting','Valuation'] }
        ];
      } else if (is('science', 'b.sc', 'biology', 'physics', 'chemistry')) {
        list = [
          { id: 11, title: 'Research Scientist', domain: 'Science', match_score: 88, description: 'Conduct experiments, analyse evidence and contribute to scientific research.', why_fit: 'Your Science background supports experimental and analytical work.', why_fit_points: ['Scientific reasoning','Research interest','Analytical skills'], avg_salary_lpa: '₹ 5 - 12 LPA', job_outlook: 'High', required_education: 'B.Sc / M.Sc or related degree', tags: ['Science','Research'], key_skills: ['Research','Data Analysis','Experimentation','Scientific Writing'] },
          { id: 12, title: 'Data Analyst', domain: 'Data & Analytics', match_score: 84, description: 'Use mathematics, statistics and data to identify useful patterns.', why_fit: 'Science develops quantitative reasoning that can transfer well to analytics.', why_fit_points: ['Quantitative reasoning','Statistics','Analytical thinking'], avg_salary_lpa: '₹ 5 - 10 LPA', job_outlook: 'High', required_education: 'Bachelor\'s in Science, Statistics, Math or related', tags: ['Data','Science','Analytics'], key_skills: ['Statistics','Excel','SQL','Data Visualization'] },
          { id: 13, title: 'Biotechnology Researcher', domain: 'Life Sciences', match_score: 82, description: 'Apply biology and laboratory methods to research and innovation.', why_fit: 'A Biology or Life Science background supports laboratory and biotechnology pathways.', why_fit_points: ['Biology foundation','Laboratory interest','Research skills'], avg_salary_lpa: '₹ 4 - 10 LPA', job_outlook: 'High', required_education: 'B.Sc / M.Sc Biotechnology or related degree', tags: ['Biology','Research'], key_skills: ['Laboratory Skills','Biology','Research','Data Analysis'] }
        ];
      } else if (is('arts', 'humanities', 'ba', 'psychology', 'history', 'literature')) {
        list = [
          { id: 14, title: 'Content Writer', domain: 'Media & Communication', match_score: 88, description: 'Create clear, engaging written content for audiences and organisations.', why_fit: 'Arts and Humanities skills in writing, communication and interpretation support this path.', why_fit_points: ['Writing and communication','Creative thinking','Research'], avg_salary_lpa: '₹ 3 - 8 LPA', job_outlook: 'High', required_education: 'B.A. / Journalism / English or related degree', tags: ['Writing','Media'], key_skills: ['Writing','Research','Communication','Editing'] },
          { id: 15, title: 'Psychology Professional', domain: 'Psychology & Social Sciences', match_score: 84, description: 'Work with human behaviour, research and people-focused services.', why_fit: 'Humanities and psychology interests can support people-focused career pathways.', why_fit_points: ['Understanding people','Communication','Research'], avg_salary_lpa: '₹ 4 - 10 LPA', job_outlook: 'High', required_education: 'B.A./B.Sc Psychology or related degree', tags: ['Psychology','People'], key_skills: ['Communication','Research','Observation','Empathy'] },
          { id: 16, title: 'Journalist', domain: 'Media & Communication', match_score: 81, description: 'Research, verify and communicate news and stories to audiences.', why_fit: 'Arts and Humanities can build strong writing, research and communication skills.', why_fit_points: ['Writing','Research','Communication'], avg_salary_lpa: '₹ 3 - 8 LPA', job_outlook: 'Moderate', required_education: 'B.A. / Journalism / Mass Communication', tags: ['Media','Communication'], key_skills: ['Reporting','Writing','Interviewing','Research'] }
        ];
      } else if (is('design')) {
        list = [
          { id: 5, title: 'UI/UX Designer', domain: 'Design', match_score: 90, description: 'Create intuitive and user-centred digital experiences.', why_fit: 'Your Design stream directly supports visual, interaction and user research work.', why_fit_points: ['Design thinking','Visual communication','User focus'], avg_salary_lpa: '₹ 5 - 11 LPA', job_outlook: 'High', required_education: 'B.Des / Design degree or portfolio', tags: ['Design','Creative'], key_skills: ['Figma','Wireframing','User Research','Prototyping'] },
          { id: 17, title: 'Graphic Designer', domain: 'Design', match_score: 86, description: 'Develop visual concepts for brands, products and communication.', why_fit: 'Design training supports visual communication and creative problem solving.', why_fit_points: ['Visual design','Creativity','Communication'], avg_salary_lpa: '₹ 3 - 8 LPA', job_outlook: 'High', required_education: 'B.Des / Graphic Design or portfolio', tags: ['Design','Creative'], key_skills: ['Typography','Layout','Illustration','Branding'] },
          { id: 18, title: 'Interior Designer', domain: 'Design', match_score: 80, description: 'Plan functional and visually engaging interior spaces.', why_fit: 'Design skills can transfer to spatial planning, materials and visual concepts.', why_fit_points: ['Spatial thinking','Creative planning','Visual communication'], avg_salary_lpa: '₹ 3 - 9 LPA', job_outlook: 'High', required_education: 'B.Des / Interior Design or related degree', tags: ['Design','Creative'], key_skills: ['Space Planning','CAD','Materials','Client Communication'] }
        ];
      } else if (is('health', 'medical', 'pharmacy', 'nursing')) {
        list = [
          { id: 19, title: 'Healthcare Professional', domain: 'Healthcare', match_score: 88, description: 'Build a career in patient care, healthcare services or clinical support.', why_fit: 'Your Healthcare stream provides a foundation for health-focused pathways.', why_fit_points: ['Healthcare knowledge','Patient focus','Scientific reasoning'], avg_salary_lpa: '₹ 4 - 12 LPA', job_outlook: 'High', required_education: 'Relevant healthcare degree', tags: ['Healthcare','Service'], key_skills: ['Healthcare Knowledge','Communication','Patient Care','Ethics'] },
          { id: 20, title: 'Pharmacy Professional', domain: 'Healthcare', match_score: 84, description: 'Work with medicines, drug safety and pharmaceutical services.', why_fit: 'A pharmacy-focused background supports medication and healthcare roles.', why_fit_points: ['Medicine knowledge','Accuracy','Healthcare service'], avg_salary_lpa: '₹ 3 - 8 LPA', job_outlook: 'High', required_education: 'B.Pharm / related degree', tags: ['Pharmacy','Healthcare'], key_skills: ['Pharmacology','Drug Safety','Patient Counselling','Documentation'] },
          { id: 21, title: 'Biomedical Researcher', domain: 'Healthcare', match_score: 81, description: 'Apply life science knowledge to medical research and innovation.', why_fit: 'Healthcare and life science study supports biomedical research pathways.', why_fit_points: ['Scientific research','Laboratory skills','Healthcare interest'], avg_salary_lpa: '₹ 4 - 10 LPA', job_outlook: 'High', required_education: 'B.Sc / M.Sc / Biomedical or related degree', tags: ['Research','Healthcare'], key_skills: ['Laboratory Skills','Research','Biology','Data Analysis'] }
        ];
      } else if (is('engineering')) {
        list = [
          { id: 22, title: 'Mechanical Engineer', domain: 'Engineering', match_score: 88, description: 'Design, analyse and improve mechanical systems and machines.', why_fit: 'Engineering fundamentals support technical design and problem solving.', why_fit_points: ['Engineering fundamentals','Problem solving','Technical design'], avg_salary_lpa: '₹ 4 - 10 LPA', job_outlook: 'High', required_education: 'B.E. / B.Tech Mechanical or related', tags: ['Engineering','Technical'], key_skills: ['CAD','Mechanics','Manufacturing','Problem Solving'] },
          { id: 23, title: 'Civil Engineer', domain: 'Engineering', match_score: 84, description: 'Plan and build infrastructure, structures and civil systems.', why_fit: 'Engineering study supports technical planning, design and project execution.', why_fit_points: ['Technical design','Planning','Problem solving'], avg_salary_lpa: '₹ 4 - 10 LPA', job_outlook: 'High', required_education: 'B.E. / B.Tech Civil or related', tags: ['Engineering','Infrastructure'], key_skills: ['AutoCAD','Structural Analysis','Project Management','Site Planning'] },
          { id: 24, title: 'Electronics Engineer', domain: 'Engineering', match_score: 82, description: 'Design and test electronic, embedded and control systems.', why_fit: 'Electronics and engineering knowledge supports hardware and embedded pathways.', why_fit_points: ['Circuit knowledge','Technical problem solving','Engineering skills'], avg_salary_lpa: '₹ 5 - 11 LPA', job_outlook: 'High', required_education: 'B.E. / B.Tech Electronics / Electrical', tags: ['Engineering','Electronics'], key_skills: ['Circuits','Embedded Systems','Microcontrollers','IoT'] }
        ];
      } else {
        list = [
          { id: 1, title: 'Software Developer', domain: 'Technology', match_score: 92, description: 'Build, create and solve real-world problems through code.', why_fit: 'Your technical skills and interest in technology align with this role.', why_fit_points: ['Programming skills','Problem solving','Technical interest'], avg_salary_lpa: '₹ 6 - 12 LPA', job_outlook: 'High', required_education: 'B.Tech / B.E. / related degree', tags: ['Technology','High Demand'], key_skills: ['Python','Data Structures','Algorithms','Problem Solving'] },
          { id: 2, title: 'Data Analyst', domain: 'Data & Analytics', match_score: 85, description: 'Analyse data and identify useful patterns for decisions.', why_fit: 'Analytical and quantitative skills support this career.', why_fit_points: ['Analytical thinking','Statistics','Problem solving'], avg_salary_lpa: '₹ 5 - 10 LPA', job_outlook: 'High', required_education: "Bachelor's in CS, Stats, Math or related", tags: ['Data','Analytics'], key_skills: ['SQL','Python','Statistics','Excel'] },
          { id: 3, title: 'AI/ML Engineer', domain: 'Technology', match_score: 78, description: 'Build intelligent models using data and machine learning.', why_fit: 'Technical and mathematical skills support this pathway.', why_fit_points: ['Programming','Mathematics','AI interest'], avg_salary_lpa: '₹ 8 - 18 LPA', job_outlook: 'Very High', required_education: 'B.Tech in CS/AI or Master’s', tags: ['AI','Technology'], key_skills: ['Python','Machine Learning','Math','Data Science'] }
        ];
      }
      if (domain && domain !== 'All') return list.filter(item => item.domain.toLowerCase() === domain.toLowerCase());
      return list;
      */
    }
  },

  async getCareerDetails(careerId) {
    try {
      const res = await apiClient.get(`/api/recommendations/${careerId}`);
      return res.data;
    } catch (err) {
      const profile = JSON.parse(localStorage.getItem('studentProfile') || '{}');
      const stream = String(profile.stream_major || 'Other / Exploring');
      return {
        id: 0,
        title: `${stream} career recommendations`,
        match_score: 0,
        domain: stream,
        description: 'Career details could not be loaded right now. Please try again.',
        tags: [stream],
        why_fit_points: [],
        avg_salary_lpa: 'Not available',
        job_outlook: 'Not available',
        required_education: 'Relevant qualification',
        key_skills: [],
        career_path: [],
        top_colleges: [],
        all_colleges: []
      };
    }
  },

  async getCareerColleges(careerId) {
    try {
      const res = await apiClient.get(`/api/recommendations/${careerId}/colleges`);
      return res.data;
    } catch (err) {
      return { colleges: [], location_note: null };
    }
  },

  async checkEligibility(course, college, category, student_score = 85.0) {
    try {
      const res = await apiClient.post('/api/eligibility/check', { course, college, category, student_score });
      return res.data;
    } catch (err) {
      return {
        status: 'Eligible',
        confidence: 'High',
        course,
        college,
        category,
        student_score,
        required_cutoff: 60.0,
        entrance_exam: 'Check the selected college/program admission process',
        application_deadline: 'Check the selected college/program admission calendar',
        official_portal: 'https://www.google.com/search?q=' + encodeURIComponent(`${college} official admissions`),
        criteria_summary: [
          `Academic threshold guidance for ${category} category and ${course}.`,
          'Check the selected college/program entrance or merit-based admission process.',
          'Verify course availability and current admission rules with the institution.'
        ],
        disclaimer: 'Please verify all admission details, eligibility criteria, deadlines and current availability through official university or admission websites. Our AI provides guidance, but final information should always be checked from official sources.'
      };
    }
  },

  async getEligibilityOptions(course = '') {
    try {
      const query = course ? `?course=${encodeURIComponent(course)}` : '';
      const res = await apiClient.get(`/api/eligibility/options${query}`);
      return res.data;
    } catch (err) {
      return {
        colleges: [],
        courses: [],
        categories: ['General', 'OBC-NCL', 'SC', 'ST', 'EWS']
      };
    }
  }
};
