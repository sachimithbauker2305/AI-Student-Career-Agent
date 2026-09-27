export const scholarshipSources = [
  {
    id: 'nsp',
    title: 'National Scholarship Portal (NSP)',
    provider: 'Government of India',
    scope: 'India',
    categories: ['All Streams', 'Merit', 'Welfare'],
    streams: ['all'],
    description: 'Search central and state scholarship schemes and check the eligibility criteria before applying.',
    tags: ['Government', 'Merit', 'Welfare', 'State Schemes'],
    url: 'https://scholarships.gov.in/All-Scholarships',
  },
  {
    id: 'myscheme',
    title: 'myScheme — Scholarship & Student Schemes',
    provider: 'Government of India',
    scope: 'India',
    categories: ['All Streams'],
    streams: ['all'],
    description: 'Discover government schemes using profile-based eligibility filters and open the official application page.',
    tags: ['Government', 'Personalised Search', 'Scholarships'],
    url: 'https://www.myscheme.gov.in/',
  },
  {
    id: 'aicte-swanath',
    title: 'AICTE Swanath Scholarship',
    provider: 'AICTE',
    scope: 'India',
    categories: ['Technical / Professional'],
    streams: ['engineering', 'computer science', 'science', 'management'],
    description: 'A technical-education scholarship route listed on the government myScheme platform. Check the current eligibility before applying.',
    tags: ['AICTE', 'Technical', 'Scholarship'],
    url: 'https://www.myscheme.gov.in/schemes/aicte-ssss',
  },
  {
    id: 'post-matric',
    title: 'Post-Matric Scholarship Search',
    provider: 'Government / State schemes',
    scope: 'India',
    categories: ['Post-Matric', 'Welfare'],
    streams: ['all'],
    description: 'Find post-matric scholarship schemes for your state and category through official government scheme directories.',
    tags: ['Post-Matric', 'State', 'Welfare'],
    url: 'https://www.myscheme.gov.in/',
  },
  {
    id: 'top-class-disability',
    title: 'Top Class Education Scholarships for Students with Disabilities',
    provider: 'Government of India',
    scope: 'India',
    categories: ['Welfare'],
    streams: ['all'],
    description: 'Search and verify disability-related higher-education scholarship schemes on NSP.',
    tags: ['Welfare', 'Disability', 'Higher Education'],
    url: 'https://scholarships.gov.in/All-Scholarships',
  },
  {
    id: 'state-scholarships',
    title: 'State Scholarship Discovery',
    provider: 'State Governments',
    scope: 'State-specific',
    categories: ['State Schemes'],
    streams: ['all'],
    description: 'Use your preferred state to locate state-sponsored student scholarship schemes and official application portals.',
    tags: ['State', 'Scholarship', 'Location based'],
    url: 'https://www.myscheme.gov.in/',
  },
];

export const internshipSources = [
  {
    id: 'aicte-internship',
    title: 'AICTE National Internship Portal',
    provider: 'AICTE / Ministry of Education',
    scope: 'India',
    streams: ['all'],
    modes: ['On-site', 'Hybrid', 'Remote'],
    description: 'Explore internships on the national AICTE internship portal and use your student profile to discover opportunities.',
    tags: ['Government', 'Students', 'Verified Portal'],
    url: 'https://internship.aicte-india.org/',
  },
  {
    id: 'ncs-internships',
    title: 'National Career Service — Internships',
    provider: 'Government of India',
    scope: 'India',
    streams: ['all'],
    modes: ['On-site', 'Hybrid', 'Remote'],
    description: 'Search internship opportunities by state, district, sector and field through the National Career Service.',
    tags: ['Government', 'Location based', 'Field based'],
    url: 'https://www.ncs.gov.in/Pmis-jobList',
  },
  {
    id: 'ncs',
    title: 'National Career Service',
    provider: 'Government of India',
    scope: 'India',
    streams: ['all'],
    modes: ['On-site', 'Hybrid', 'Remote'],
    description: 'Use the NCS ecosystem to find jobs, internships, skill courses and career services.',
    tags: ['Government', 'Jobs', 'Internships'],
    url: 'https://www.ncs.gov.in/',
  },
  {
    id: 'internshala',
    title: 'Internshala',
    provider: 'Internshala',
    scope: 'India',
    streams: ['all'],
    modes: ['On-site', 'Hybrid', 'Remote'],
    description: 'Search internships by skill, role, location and work-from-home options.',
    tags: ['Private', 'Students', 'Remote'],
    url: 'https://internshala.com/internships/',
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Internship Search',
    provider: 'LinkedIn',
    scope: 'India / Global',
    streams: ['all'],
    modes: ['On-site', 'Hybrid', 'Remote'],
    description: 'Search a broad internship marketplace using your career area and preferred location.',
    tags: ['Private', 'Global', 'Remote'],
    url: 'https://www.linkedin.com/jobs/internships/',
  },
  {
    id: 'indeed',
    title: 'Indeed Internship Search',
    provider: 'Indeed',
    scope: 'India',
    streams: ['all'],
    modes: ['On-site', 'Hybrid', 'Remote'],
    description: 'Search internship roles by keyword and location, then review the employer listing before applying.',
    tags: ['Private', 'Search', 'Location based'],
    url: 'https://in.indeed.com/q-internship-jobs.html',
  },
];

export const streamAliases = {
  'computer science': ['computer science', 'it', 'information technology', 'software', 'bca'],
  commerce: ['commerce', 'b.com', 'bba', 'accounting', 'finance', 'banking', 'business', 'management'],
  science: ['science', 'physics', 'chemistry', 'mathematics', 'biology'],
  arts: ['arts', 'humanities', 'psychology', 'sociology', 'journalism', 'political science'],
  design: ['design', 'fashion', 'ui ux', 'graphic', 'product design', 'interior'],
  healthcare: ['healthcare', 'medical', 'medicine', 'mbbs', 'bds', 'pharmacy', 'nursing', 'physiotherapy'],
  engineering: ['engineering', 'mechanical', 'civil', 'electronics', 'electrical', 'computer engineering'],
  law: ['law', 'legal', 'llb', 'llb', 'll.m'],
  media: ['media', 'mass communication', 'advertising', 'public relations', 'film'],
  government: ['government', 'civil services', 'defence', 'police', 'public service', 'upsc', 'psc', 'ssc'],
};

export function normalise(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9+#&.\-\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function matchesStream(item, stream = '') {
  const value = normalise(stream);
  if (!value) return true;
  const key = Object.keys(streamAliases).find((name) => value.includes(name) || streamAliases[name].some((alias) => value.includes(alias)));
  if (!key) return true;
  return item.streams.includes('all') || item.streams.includes(key);
}

export function getProfileLocations(profile) {
  const locations = Array.isArray(profile?.preferred_locations) ? profile.preferred_locations : [];
  return locations.filter(Boolean).map((location) => String(location).trim());
}
