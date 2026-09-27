import apiClient from './apiClient';

export const profileService = {
  async getStreamConfig() {
    try {
      const res = await apiClient.get('/api/profile/stream-config');
      return res.data;
    } catch (err) {
      return null;
    }
  },

  async getProfile() {
    try {
      const res = await apiClient.get('/api/profile');
      return res.data;
    } catch (err) {
      return {
        education_level: '',
        stream_major: '',
        cgpa_percentage: 0,
        year_of_study: '',
        interests: [],
        skills: [],
        preferred_subjects: [],
        preferred_locations: [],
        profile_completion_percent: 0
      };
    }
  },

  async saveStep1(step1Data) {
    try {
      localStorage.setItem('studentProfile', JSON.stringify(step1Data));
      const res = await apiClient.post('/api/profile/step1', step1Data);
      return res.data;
    } catch (err) {
      localStorage.setItem('studentProfile', JSON.stringify(step1Data));
      return { status: 'success' };
    }
  },

  async saveStep2(step2Data) {
    try {
      const res = await apiClient.post('/api/profile/step2', step2Data);
      return res.data;
    } catch (err) {
      return { status: 'success' };
    }
  },

  async getAiAnalysis() {
    try {
      const res = await apiClient.get('/api/ai-analysis');
      return res.data;
    } catch (err) {
      return {
        profile_match_score: 0,
        score_explanation: 'Complete your profile to calculate a personalized match score.',
        key_insights: [],
        strengths: [],
        areas_to_improve: [],
        suggested_pathways: []
      };
    }
  },

  async getAdaptiveQuestions() {
    try {
      const res = await apiClient.get('/api/ai-analysis/questions');
      return res.data.questions;
    } catch (err) {
      const profile = JSON.parse(localStorage.getItem('studentProfile') || '{}');
      const major = String(profile.stream_major || '').toLowerCase();

      const normalize = (value = '') => String(value).toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
      const safeMajor = normalize(major);

      const getQuestionSet = (type) => {
        const sets = {
          computerScience: [
            { id: 'q1', question: 'Which Computer Science area interests you most?', options: ['Building software, websites and applications', 'Working with data, SQL and analytics', 'Artificial intelligence and machine learning', 'Cybersecurity, networks and ethical hacking'] },
            { id: 'q2', question: 'What kind of Computer Science work would you enjoy most?', options: ['Writing and debugging code to solve problems', 'Finding patterns and insights from datasets', 'Training intelligent models and experimenting with AI', 'Protecting systems and investigating security issues'] },
            { id: 'q3', question: 'Which career outcome matters most to you?', options: ['Building products used by people', 'Using data to support decisions', 'Working on emerging AI technologies', 'Keeping digital systems secure'] }
          ],
          commerce: [
            { id: 'q1', question: 'Which Commerce area interests you most?', options: ['Accounting, auditing and taxation', 'Investment and financial analysis', 'Banking and financial services', 'Business management and entrepreneurship'] },
            { id: 'q2', question: 'Which type of Commerce work would you enjoy?', options: ['Preparing accounts and checking records', 'Analysing investments and budgets', 'Helping customers and businesses with banking services', 'Planning business strategies and managing teams'] },
            { id: 'q3', question: 'What do you want from your Commerce career?', options: ['Professional expertise', 'Strong financial decision-making', 'A stable career in banking or finance', 'Business leadership'] }
          ],
          biology: [
            { id: 'q1', question: 'Which Biology / Life Science area interests you most?', options: ['Medical and clinical pathways', 'Biotechnology and genetics', 'Research and laboratory work', 'Environmental and life sciences'] },
            { id: 'q2', question: 'Which kind of biological work appeals to you?', options: ['Studying patients and treatment pathways', 'Working in labs on biotech or genetics projects', 'Researching living systems and experiments', 'Understanding ecosystems and environmental systems'] },
            { id: 'q3', question: 'What matters most in your biological career?', options: ['Improving human health', 'Research and innovation', 'Hands-on lab work', 'Understanding life systems and sustainability'] }
          ],
          chemistry: [
            { id: 'q1', question: 'Which Chemistry area interests you most?', options: ['Industrial chemistry and materials', 'Pharmaceutical chemistry', 'Analytical and laboratory chemistry', 'Research and product development'] },
            { id: 'q2', question: 'Which chemistry activity would you enjoy?', options: ['Working with materials and processes', 'Developing medicines and products', 'Running experiments and tests', 'Studying chemical reactions and systems'] },
            { id: 'q3', question: 'What matters most in your chemistry career?', options: ['Product innovation', 'Health and safety', 'Research and discovery', 'Analytical problem solving'] }
          ],
          physicsMaths: [
            { id: 'q1', question: 'Which Physics / Maths path interests you most?', options: ['Applied mathematics and modelling', 'Engineering and technical systems', 'Research and scientific analysis', 'Quantitative problem solving'] },
            { id: 'q2', question: 'Which type of work sounds most interesting?', options: ['Solving technical and analytical problems', 'Designing systems and models', 'Researching scientific theories', 'Working with data and quantitative methods'] },
            { id: 'q3', question: 'What matters most in your career?', options: ['Technical innovation', 'Research excellence', 'Analytical depth', 'Solving real-world problems'] }
          ],
          healthcare: [
            { id: 'q1', question: 'Which Healthcare path interests you most?', options: ['Patient care and clinical practice', 'Pharmacy and medicine-related work', 'Biomedical research and lab science', 'Healthcare administration and management'] },
            { id: 'q2', question: 'Which type of healthcare work appeals to you?', options: ['Working directly with patients', 'Studying medicines and treatments', 'Conducting experiments and analysing medical data', 'Improving healthcare systems and services'] },
            { id: 'q3', question: 'What matters most in a Healthcare career?', options: ['Improving patient outcomes', 'Safe and effective treatment', 'Medical discovery and research', 'Efficient healthcare systems'] }
          ],
          arts: [
            { id: 'q1', question: 'Which Arts / Humanities area interests you most?', options: ['Writing and literature', 'Psychology and human behaviour', 'History, society and culture', 'Communication and media'] },
            { id: 'q2', question: 'Which type of work would you enjoy?', options: ['Writing creative or informative content', 'Understanding people', 'Researching society and culture', 'Creating stories and media'] },
            { id: 'q3', question: 'What impact would you like your career to have?', options: ['Informing audiences', 'Helping individuals and communities', 'Explaining culture and society', 'Communicating ideas creatively'] }
          ],
          design: [
            { id: 'q1', question: 'Which Design area interests you most?', options: ['UI/UX and digital product design', 'Graphic and visual communication', 'Fashion and styling', 'Interior and spatial design'] },
            { id: 'q2', question: 'Which design activity do you enjoy most?', options: ['Wireframing, prototyping and user research', 'Creating layouts and visual identities', 'Developing concepts, materials and collections', 'Planning spaces and visual environments'] },
            { id: 'q3', question: 'What matters most in your Design career?', options: ['Solving user problems through digital products', 'Creative expression and visual storytelling', 'Creating original styles and experiences', 'Designing useful physical spaces'] }
          ],
          law: [
            { id: 'q1', question: 'Which Law area interests you most?', options: ['Corporate and commercial law', 'Criminal and litigation practice', 'Constitutional and public law', 'Technology and intellectual property law'] },
            { id: 'q2', question: 'Which legal activity would you enjoy most?', options: ['Reviewing contracts and advising businesses', 'Building arguments and representing clients', 'Researching public laws and policy', 'Working on technology, brands and digital rights'] },
            { id: 'q3', question: 'What matters most in your Law career?', options: ['Helping organisations make sound legal decisions', 'Advocating for clients', 'Working on public interest and policy', 'Protecting ideas, inventions and digital assets'] }
          ],
          government: [
            { id: 'q1', question: 'Which public service path interests you most?', options: ['UPSC / Civil Services', 'SSC / Banking / Railways', 'State PSC / Public administration', 'Defence / Police / Security services'] },
            { id: 'q2', question: 'Which government or public service work appeals to you?', options: ['Policy, governance and public administration', 'Administrative and government jobs', 'Security, law enforcement and public service', 'Public welfare and service delivery'] },
            { id: 'q3', question: 'What matters most in your Government career?', options: ['Serving the public and nation', 'Stable long-term career growth', 'Administrative responsibility and leadership', 'Security, order and public service'] }
          ],
          other: [
            { id: 'q1', question: 'What type of work interests you most right now?', options: ['Practical work', 'Analysis and problem solving', 'Creative work', 'People and communication'] },
            { id: 'q2', question: 'Which type of work would you enjoy most in your stream?', options: ['Building or creating', 'Analysing information', 'Research and learning', 'Working with people'] },
            { id: 'q3', question: 'What matters most in your career?', options: ['Growth', 'Stability', 'Creativity', 'Making an impact'] }
          ]
        };

        const extraQuestions = {
          computerScience: [
            { id: 'q4', question: 'Which kind of problem would you most enjoy solving?', options: ['Building useful apps or websites', 'Finding patterns in data', 'Training intelligent systems', 'Finding and fixing security weaknesses'] },
            { id: 'q5', question: 'How would you prefer to build experience?', options: ['Coding projects and challenges', 'Datasets, dashboards and analysis', 'AI experiments and model projects', 'Security labs and network exercises'] },
            { id: 'q6', question: 'Where would you like your skills to take you?', options: ['Software and product teams', 'Analytics and business decisions', 'AI and intelligent systems', 'Cybersecurity and infrastructure'] }
          ],
          commerce: [
            { id: 'q4', question: 'Which task sounds most satisfying?', options: ['Checking accounts and records', 'Comparing investments and performance', 'Understanding banking needs', 'Planning business growth'] },
            { id: 'q5', question: 'What would you like to become especially good at?', options: ['Accounting and taxation', 'Financial analysis', 'Banking and relationship management', 'Strategy and entrepreneurship'] },
            { id: 'q6', question: 'Which work setting suits you best?', options: ['Accounting or audit', 'Finance or investment teams', 'Banking and financial services', 'Business and entrepreneurship'] }
          ],
          biology: [
            { id: 'q4', question: 'Which project would you most like to work on?', options: ['A patient or health study', 'A biotech or genetics project', 'A laboratory research project', 'An environmental study'] },
            { id: 'q5', question: 'How do you prefer to learn?', options: ['Case studies and clinical examples', 'Experiments and lab work', 'Research papers and investigation', 'Fieldwork and observation'] },
            { id: 'q6', question: 'Which direction interests you most?', options: ['Healthcare', 'Biotechnology', 'Research', 'Environment and sustainability'] }
          ],
          chemistry: [
            { id: 'q4', question: 'Which chemistry project interests you most?', options: ['Materials and industrial processes', 'Pharmaceutical products', 'Laboratory testing and analysis', 'Research and product development'] },
            { id: 'q5', question: 'Which skill would you like to strengthen?', options: ['Process understanding', 'Drug and formulation knowledge', 'Analytical testing', 'Experimental research'] },
            { id: 'q6', question: 'Where would you prefer to work?', options: ['Industry and manufacturing', 'Pharmaceuticals', 'Laboratories', 'Research and development'] }
          ],
          physicsMaths: [
            { id: 'q4', question: 'Which problem would you enjoy tackling?', options: ['A mathematical model', 'A technical system', 'A scientific research problem', 'A data-driven problem'] },
            { id: 'q5', question: 'How do you prefer to work?', options: ['Deriving and solving models', 'Designing systems', 'Testing theories', 'Analysing quantitative data'] },
            { id: 'q6', question: 'Which direction interests you most?', options: ['Applied mathematics', 'Engineering and technology', 'Scientific research', 'Data and analytics'] }
          ],
          healthcare: [
            { id: 'q4', question: 'Which healthcare challenge would you like to work on?', options: ['Diagnosing and treating patients', 'Medicines and safe treatment', 'Medical research', 'Healthcare services'] },
            { id: 'q5', question: 'How would you prefer to spend your day?', options: ['With patients', 'With medicines or samples', 'In a lab or research setting', 'Coordinating healthcare services'] },
            { id: 'q6', question: 'Which long-term direction interests you?', options: ['Clinical care', 'Pharmacy and medicines', 'Biomedical research', 'Healthcare management'] }
          ],
          arts: [
            { id: 'q4', question: 'Which project would you be happiest creating?', options: ['An article or story', 'A people and behaviour project', 'A cultural research project', 'A social or policy report'] },
            { id: 'q5', question: 'What would you like to practise more?', options: ['Writing and storytelling', 'Listening and interviewing', 'Research and evidence analysis', 'Debate and policy analysis'] },
            { id: 'q6', question: 'Where would you like to contribute?', options: ['Media and communications', 'Psychology or community work', 'Research or education', 'Government or social organisations'] }
          ],
          design: [
            { id: 'q4', question: 'Which physical or visual project would you most enjoy?', options: ['A clothing collection', 'A room or interior', 'A visual identity or illustration set', 'A product or furniture concept'] },
            { id: 'q5', question: 'Which part of design do you enjoy most?', options: ['Fabrics, silhouettes and materials', 'Spaces, layouts and materials', 'Colours, forms and visual concepts', 'Sketching, prototyping and making'] },
            { id: 'q6', question: 'What would you most like to create professionally?', options: ['Fashion, accessories or textiles', 'Interiors and physical spaces', 'Graphic and visual communication', 'Products, furniture or crafted objects'] }
          ],
          law: [
            { id: 'q4', question: 'Which legal issue interests you most?', options: ['Business contracts', 'Criminal cases', 'Rights and public policy', 'Intellectual property'] },
            { id: 'q5', question: 'Which skill would you enjoy developing?', options: ['Contract review', 'Advocacy and arguments', 'Legal research', 'IP and technology law'] },
            { id: 'q6', question: 'Where would you prefer to apply legal knowledge?', options: ['Corporate legal teams', 'Courts and litigation', 'Government or public interest', 'Technology and creative industries'] }
          ],
          government: [
            { id: 'q4', question: 'Which public problem would you most like to work on?', options: ['Policy and governance', 'Public administration', 'Safety and security', 'Community welfare'] },
            { id: 'q5', question: 'Which preparation style suits you?', options: ['Policy and current affairs', 'Aptitude and administration', 'Service and physical preparation', 'Social issues and public programmes'] },
            { id: 'q6', question: 'What responsibility appeals to you most?', options: ['Policy decisions', 'Public services', 'Security and protection', 'Public welfare'] }
          ],
          other: [
            { id: 'q4', question: 'Which project would you most like to try?', options: ['A practical project', 'A people or business project', 'A research project', 'A creative project'] },
            { id: 'q5', question: 'Which skill would you most like to develop?', options: ['Technical or hands-on skills', 'Communication and leadership', 'Research and analysis', 'Creative and presentation skills'] },
            { id: 'q6', question: 'Which direction would you like to explore first?', options: ['Technology and practical work', 'Business and management', 'Research, education or public service', 'Creative, media or design work'] }
          ]
        };

        Object.keys(extraQuestions).forEach((key) => {
          sets[key] = [...sets[key], ...extraQuestions[key]];
        });

        if (type === 'computerScience') return sets.computerScience;
        if (type === 'commerce') return sets.commerce;
        if (type === 'biology') return sets.biology;
        if (type === 'chemistry') return sets.chemistry;
        if (type === 'physicsMaths') return sets.physicsMaths;
        if (type === 'healthcare') return sets.healthcare;
        if (type === 'arts') return sets.arts;
        if (type === 'design') return sets.design;
        if (type === 'law') return sets.law;
        if (type === 'government') return sets.government;
        return sets.other;
      };

      if (safeMajor.includes('computer') || safeMajor.includes('cs') || safeMajor.includes('software') || safeMajor.includes('it') || safeMajor.includes('technology') || safeMajor.includes('bca')) return getQuestionSet('computerScience');
      if (safeMajor.includes('commerce') || safeMajor.includes('b com') || safeMajor.includes('bcom') || safeMajor.includes('account') || safeMajor.includes('finance') || safeMajor.includes('business studies') || safeMajor.includes('economics')) return getQuestionSet('commerce');
      if (safeMajor.includes('health') || safeMajor.includes('healthcare') || safeMajor.includes('medical') || safeMajor.includes('medicine') || safeMajor.includes('mbbs') || safeMajor.includes('bds') || safeMajor.includes('dental') || safeMajor.includes('ayurveda') || safeMajor.includes('ayurvedic') || safeMajor.includes('bams') || safeMajor.includes('bhms') || safeMajor.includes('homeopathy') || safeMajor.includes('homoeopathic') || safeMajor.includes('nursing') || safeMajor.includes('pharmacy') || safeMajor.includes('allied')) return getQuestionSet('healthcare');
      if (safeMajor.includes('biology') || safeMajor.includes('biotech') || safeMajor.includes('life science')) return getQuestionSet('biology');
      if (safeMajor.includes('chemistry') || safeMajor.includes('chemical')) return getQuestionSet('chemistry');
      if (safeMajor.includes('physics') || safeMajor.includes('maths') || safeMajor.includes('mathematics') || safeMajor.includes('pcm') || safeMajor.includes('pcmb')) return getQuestionSet('physicsMaths');
      if (safeMajor.includes('arts') || safeMajor.includes('humanities') || safeMajor.includes('ba') || safeMajor.includes('psychology') || safeMajor.includes('history') || safeMajor.includes('sociology') || safeMajor.includes('literature') || safeMajor.includes('political')) return getQuestionSet('arts');
      if (safeMajor.includes('design') || safeMajor.includes('fashion') || safeMajor.includes('graphic') || safeMajor.includes('interior') || safeMajor.includes('ux') || safeMajor.includes('ui')) return getQuestionSet('design');
      if (safeMajor.includes('law') || safeMajor.includes('llb') || safeMajor.includes('legal')) return getQuestionSet('law');
      if (safeMajor.includes('upsc') || safeMajor.includes('civil services') || safeMajor.includes('ssc') || safeMajor.includes('banking') || safeMajor.includes('railway') || safeMajor.includes('government') || safeMajor.includes('public service') || safeMajor.includes('psc') || safeMajor.includes('defence') || safeMajor.includes('police')) return getQuestionSet('government');
      return getQuestionSet('default');
    }
  },

  async submitAnswers(answers) {
    try {
      const res = await apiClient.post('/api/ai-analysis/submit-questions', answers);
      return res.data;
    } catch (err) {
      return { status: 'success', adapted_confidence: 95 };
    }
  }
};
