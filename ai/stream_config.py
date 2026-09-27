import re
"""
Stream-specific configuration used across questions, profile analysis and recommendations.
The UI stays unchanged; only the content adapts to the student's selected stream.
"""

STREAM_CONFIG = {
    "computer science": {
        "label": "Computer Science",
        "aliases": ["computer science", "cs", "computer", "it", "information technology", "software", "bca"],
        "interests": ["Technology", "Data & Analytics", "AI/ML", "Cybersecurity"],
        "skills": ["Programming", "Problem solving", "Analytical thinking", "Database Management", "Adaptability", "Communication"],
        "subjects": ["Programming", "Data Structures", "Algorithms", "Database Management", "Web Development"],
        "pathways": ["Software Development", "Data Analytics", "AI / Machine Learning", "Cybersecurity"],
        "questions": [
            {"id":"q1", "question":"Which Computer Science area interests you the most?", "options":["Building software, websites and applications", "Working with data, SQL and analytics", "Artificial intelligence and machine learning", "Cybersecurity, networks and ethical hacking"], "dimension":"core_affinity"},
            {"id":"q2", "question":"What kind of Computer Science work would you enjoy most?", "options":["Writing and debugging code to solve problems", "Finding patterns and insights from datasets", "Training intelligent models and experimenting with AI", "Protecting systems and investigating security issues"], "dimension":"work_style"},
            {"id":"q3", "question":"Which career outcome matters most to you?", "options":["Building products used by people", "Using data to support decisions", "Working on emerging AI technologies", "Keeping digital systems secure"], "dimension":"career_values"},
            {"id":"q4","question":"Which kind of problems would you most enjoy solving?","options":["Building useful apps or websites","Finding patterns in data","Teaching computers to learn","Finding and fixing security weaknesses"],"dimension":"problem_solving"},
            {"id":"q5","question":"How would you prefer to build your experience?","options":["Projects and coding challenges","Dashboards, datasets and analysis","AI experiments and model projects","Security labs and network exercises"],"dimension":"learning_style"},
            {"id":"q6","question":"Where would you like your skills to take you?","options":["Software and product teams","Analytics and business decisions","AI research and intelligent systems","Cybersecurity and infrastructure"],"dimension":"career_direction"},
        ]
    },
    "commerce": {
        "label": "Commerce",
        "aliases": ["commerce", "b.com", "bcom", "accounting", "accounts", "business studies"],
        "interests": ["Finance", "Business", "Accounting", "Economics"],
        "skills": ["Accounting", "Financial Analysis", "Excel", "Communication", "Business Analysis", "Problem solving"],
        "subjects": ["Accountancy", "Business Studies", "Economics", "Financial Management", "Taxation"],
        "pathways": ["Chartered Accountancy", "Financial Analyst", "Banking & Investment", "Business Management"],
        "questions": [
            {"id":"q1", "question":"Which Commerce area interests you the most?", "options":["Accounting, auditing and taxation", "Finance, investments and markets", "Banking and financial services", "Business management and entrepreneurship"], "dimension":"core_affinity"},
            {"id":"q2", "question":"Which type of work would you enjoy most?", "options":["Preparing accounts and checking financial records", "Analysing investments, budgets and financial performance", "Helping customers and businesses with banking services", "Planning business strategies and managing teams"], "dimension":"work_style"},
            {"id":"q3", "question":"What is most important to you in a Commerce career?", "options":["Professional qualification and expertise", "Strong financial decision-making skills", "A stable career in banking or financial services", "Building or growing a business"], "dimension":"career_values"},
            {"id":"q4","question":"Which task sounds most satisfying to you?","options":["Checking accounts and financial records","Comparing investments and financial performance","Understanding customers' banking needs","Planning how a business can grow"],"dimension":"problem_solving"},
            {"id":"q5","question":"What would you like to become especially good at?","options":["Accounting and taxation","Financial modelling and analysis","Banking and relationship management","Strategy and entrepreneurship"],"dimension":"learning_style"},
            {"id":"q6","question":"Which work setting would suit you best?","options":["A professional accounting or audit environment","Markets, finance or investment teams","A bank or financial-services organisation","A business where I can take ownership and make decisions"],"dimension":"career_direction"},
        ]
    },
    "science": {
        "label": "Science",
        "aliases": ["science", "b.sc", "bsc", "pcm", "pcb", "pcmb", "physics", "chemistry", "biology"],
        "interests": ["Science", "Research", "Healthcare", "Data & Analytics"],
        "skills": ["Scientific reasoning", "Problem solving", "Research", "Analytical thinking", "Mathematics", "Communication"],
        "subjects": ["Physics", "Chemistry", "Biology", "Mathematics", "Research Methods"],
        "pathways": ["Scientific Research", "Data Science", "Biotechnology", "Environmental Science"],
        "questions": [
            {"id":"q1", "question":"Which Science area interests you the most?", "options":["Physics, mathematics and physical systems", "Chemistry, materials and laboratory work", "Biology, genetics and life sciences", "Scientific computing, data and research"], "dimension":"core_affinity"},
            {"id":"q2", "question":"Which kind of Science work sounds most interesting?", "options":["Solving quantitative problems and modelling systems", "Running experiments and analysing chemical results", "Studying living organisms and biological processes", "Working with research data and scientific tools"], "dimension":"work_style"},
            {"id":"q3", "question":"What do you want from a Science career?", "options":["Discovery and research", "Laboratory and applied science work", "Improving health and life sciences", "Using science and data to solve real-world problems"], "dimension":"career_values"},
            {"id":"q4","question":"Which kind of project would you most like to work on?","options":["A physics or mathematical model","A chemistry or materials experiment","A biology or life-science study","A scientific data or computing project"],"dimension":"problem_solving"},
            {"id":"q5","question":"How do you prefer to learn science?","options":["Solving problems and modelling concepts","Running experiments and observing results","Studying organisms and biological processes","Working with datasets and research tools"],"dimension":"learning_style"},
            {"id":"q6","question":"Which future direction sounds most interesting?","options":["Research and physical sciences","Laboratory and applied science","Biotechnology and life sciences","Scientific data and technology"],"dimension":"career_direction"},
        ]
    },
    "arts": {
        "label": "Arts / Humanities",
        "aliases": ["arts", "humanities", "ba", "liberal arts", "history", "political science", "sociology", "literature", "psychology"],
        "interests": ["Arts", "Social Impact", "Media", "Psychology"],
        "skills": ["Communication", "Critical thinking", "Research", "Writing", "Creativity", "Presentation"],
        "subjects": ["History", "Political Science", "Sociology", "Psychology", "Literature"],
        "pathways": ["Content & Journalism", "Public Relations", "Psychology & Counselling", "Social Research"],
        "questions": [
            {"id":"q1", "question":"Which Arts / Humanities area interests you the most?", "options":["Writing, literature and communication", "Psychology and human behaviour", "History, society and culture", "Politics, public policy and social issues"], "dimension":"core_affinity"},
            {"id":"q2", "question":"Which type of work would you enjoy most?", "options":["Writing stories, articles or creative content", "Understanding people and supporting their development", "Researching society, culture and history", "Analysing public issues and policy"], "dimension":"work_style"},
            {"id":"q3", "question":"What impact would you like your career to have?", "options":["Informing and engaging audiences", "Helping individuals and communities", "Preserving and explaining culture and society", "Contributing to public and social change"], "dimension":"career_values"},
            {"id":"q4","question":"Which project would you be happiest creating?","options":["An article, story or long-form piece","A project about people and behaviour","A cultural or historical research project","A report about a social or policy issue"],"dimension":"problem_solving"},
            {"id":"q5","question":"What kind of work would you like to practise more?","options":["Writing and storytelling","Listening, interviewing and understanding people","Researching sources and interpreting evidence","Public speaking, debate and policy analysis"],"dimension":"learning_style"},
            {"id":"q6","question":"Where do you see yourself contributing?","options":["Media, publishing or communications","Counselling, psychology or community work","Research, culture or education","Government, policy or social organisations"],"dimension":"career_direction"},
        ]
    },
    "design": {
        "label": "Design",
        "aliases": ["design", "b.des", "fashion design", "graphic design", "interior design", "visual communication"],
        "interests": ["Design", "Creative", "Technology", "Arts"],
        "skills": ["Creativity", "UI Design", "Visual Design", "Communication", "Problem solving", "User Research"],
        "subjects": ["Design Fundamentals", "Visual Communication", "User Experience", "Typography", "Design Research"],
        "pathways": ["UI/UX Design", "Graphic Design", "Product Design", "Fashion & Visual Design"],
        "questions": [
            {"id":"q1", "question":"Which Design area interests you the most?", "options":["UI/UX and digital product design", "Graphic and visual communication", "Fashion and styling", "Interior and spatial design"], "dimension":"core_affinity"},
            {"id":"q2", "question":"Which design activity do you enjoy most?", "options":["Wireframing, prototyping and user research", "Creating layouts, illustrations and visual identities", "Developing concepts, materials and collections", "Planning spaces, layouts and visual environments"], "dimension":"work_style"},
            {"id":"q3", "question":"What matters most in your Design career?", "options":["Solving user problems through digital products", "Creative expression and visual storytelling", "Creating original styles and experiences", "Designing useful and engaging physical spaces"], "dimension":"career_values"},
            {"id":"q4","question":"Which physical or visual project would you most enjoy making?","options":["A clothing collection or styling concept","A room, home or commercial space","A poster, identity or illustration set","A product, furniture or object concept"],"dimension":"problem_solving"},
            {"id":"q5","question":"Which part of the design process do you enjoy most?","options":["Choosing fabrics, silhouettes and materials","Planning spaces, layouts and materials","Developing colours, forms and visual concepts","Sketching, prototyping and refining physical products"],"dimension":"learning_style"},
            {"id":"q6","question":"What would you most like to create professionally?","options":["Fashion, accessories or textiles","Interiors and physical environments","Brand, print or visual communication","Products, furniture or crafted objects"],"dimension":"career_direction"},
        ]
    },
    "healthcare": {
        "label": "Healthcare / Medical",
        "aliases": ["healthcare", "medical", "medicine", "mbbs", "bds", "dental", "ayurveda", "ayurvedic", "bams", "homeopathy", "homoeopathic", "bhms", "nursing", "pharmacy", "biomedical", "allied health"],
        "interests": ["Healthcare", "Science", "Research", "Social Impact"],
        "skills": ["Biology", "Patient Care", "Research", "Communication", "Attention to Detail", "Problem solving"],
        "subjects": ["Human Biology", "Anatomy", "Physiology", "Pathology", "Healthcare Practice"],
        "pathways": ["Clinical Healthcare", "Pharmacy", "Healthcare Management", "Biomedical Research"],
        "questions": [
            {"id":"q1", "question":"Which Healthcare area interests you the most?", "options":["Patient care and clinical practice", "Medicines, pharmacy and drug safety", "Biomedical research and laboratory science", "Healthcare administration and management"], "dimension":"core_affinity"},
            {"id":"q2", "question":"Which kind of Healthcare work appeals to you?", "options":["Working directly with patients", "Studying medicines and treatment options", "Conducting experiments and analysing medical data", "Improving how healthcare services are organised"], "dimension":"work_style"},
            {"id":"q3", "question":"What is most important to you in a Healthcare career?", "options":["Directly improving patient outcomes", "Safe and effective medicines", "Discovering new medical knowledge", "Making healthcare systems more efficient"], "dimension":"career_values"},
            {"id":"q4","question":"Which kind of healthcare challenge would you like to work on?","options":["Diagnosing and treating patients","Medicines and safe treatment use","Discovering new health knowledge","Improving healthcare services and systems"],"dimension":"problem_solving"},
            {"id":"q5","question":"How would you prefer to spend most of your working day?","options":["With patients and clinical teams","With medicines, samples or pharmacy work","In a lab or research environment","Coordinating healthcare services"],"dimension":"learning_style"},
            {"id":"q6","question":"Which long-term direction interests you most?","options":["Clinical practice and patient care","Pharmacy and medicines","Biomedical or health research","Healthcare management and public health"],"dimension":"career_direction"},
        ]
    },
    "engineering": {
        "label": "Engineering",
        "aliases": ["engineering", "b.tech", "b.e", "mechanical", "civil", "electronics", "electrical", "ece", "eee", "automobile", "chemical engineering"],
        "interests": ["Engineering", "Technology", "Science", "Design"],
        "skills": ["Problem solving", "Mathematics", "Analytical thinking", "Technical Design", "Project Management", "Communication"],
        "subjects": ["Engineering Mathematics", "Engineering Mechanics", "Technical Design", "Systems", "Engineering Projects"],
        "pathways": ["Core Engineering", "Product Engineering", "Project Engineering", "Engineering Management"],
        "questions": [
            {"id":"q1", "question":"Which Engineering area interests you the most?", "options":["Mechanical and manufacturing systems", "Civil infrastructure and construction", "Electronics, electrical and embedded systems", "Engineering technology and software"], "dimension":"core_affinity"},
            {"id":"q2", "question":"Which type of engineering work would you enjoy?", "options":["Designing machines and production systems", "Planning structures, transport and infrastructure", "Building circuits, devices and control systems", "Developing technical products and automated systems"], "dimension":"work_style"},
            {"id":"q3", "question":"What matters most in an Engineering career?", "options":["Building efficient physical systems", "Creating infrastructure that serves communities", "Working with advanced electronics and devices", "Solving technical problems through innovation"], "dimension":"career_values"},
            {"id":"q4","question":"Which real-world system would you most like to improve?","options":["Machines and manufacturing","Buildings, roads and infrastructure","Circuits, electronics and devices","Automation, software or technical systems"],"dimension":"problem_solving"},
            {"id":"q5","question":"Which activity would you enjoy doing most?","options":["Designing and testing mechanical parts","Planning and inspecting physical projects","Building and testing electronic systems","Developing or automating technical solutions"],"dimension":"learning_style"},
            {"id":"q6","question":"Where would you like your engineering skills to lead?","options":["Manufacturing and mechanical industries","Construction and infrastructure","Electronics and embedded systems","Technology, automation and product engineering"],"dimension":"career_direction"},
        ]
    },
    "management": {
        "label": "Management / Business",
        "aliases": ["management", "bba", "mba", "business management", "business administration", "marketing", "hr"],
        "interests": ["Business", "Management", "Marketing", "Finance"],
        "skills": ["Communication", "Leadership", "Business Analysis", "Presentation", "Problem solving", "Negotiation"],
        "subjects": ["Marketing", "Human Resources", "Operations", "Business Strategy", "Organisational Behaviour"],
        "pathways": ["Marketing Management", "Human Resources", "Business Consulting", "Operations Management"],
        "questions": [
            {"id":"q1", "question":"Which Management area interests you the most?", "options":["Marketing and brand strategy", "Human resources and people management", "Business strategy and consulting", "Operations and project management"], "dimension":"core_affinity"},
            {"id":"q2", "question":"Which kind of work would you enjoy most?", "options":["Understanding customers and creating campaigns", "Hiring, developing and supporting employees", "Solving business problems for organisations", "Planning projects, processes and operations"], "dimension":"work_style"},
            {"id":"q3", "question":"What do you want from a Management career?", "options":["Influencing markets and customers", "Leading and developing people", "Making strategic business decisions", "Improving how organisations operate"], "dimension":"career_values"},
            {"id":"q4","question":"Which business problem would you most enjoy solving?","options":["How to attract and retain customers","How to hire and develop people","How to improve a business strategy","How to make operations run better"],"dimension":"problem_solving"},
            {"id":"q5","question":"Which skill would you most like to strengthen?","options":["Marketing and customer insight","Leadership and people management","Strategy and business analysis","Planning, operations and project delivery"],"dimension":"learning_style"},
            {"id":"q6","question":"Which type of responsibility appeals to you most?","options":["Growing a brand or customer base","Building strong teams and workplaces","Advising on important business decisions","Running projects and improving processes"],"dimension":"career_direction"},
        ]
    },
    "law": {
        "label": "Law",
        "aliases": ["law", "llb", "ba llb", "bba llb", "legal studies", "law and legal"],
        "interests": ["Law", "Social Impact", "Communication", "Business"],
        "skills": ["Legal Research", "Communication", "Critical thinking", "Writing", "Negotiation", "Problem solving"],
        "subjects": ["Constitutional Law", "Contract Law", "Criminal Law", "Legal Research", "Legal Writing"],
        "pathways": ["Corporate Law", "Litigation", "Legal Research", "Compliance & Policy"],
        "questions": [
            {"id":"q1", "question":"Which Law area interests you the most?", "options":["Corporate and commercial law", "Criminal and litigation practice", "Constitutional and public law", "Intellectual property and technology law"], "dimension":"core_affinity"},
            {"id":"q2", "question":"Which legal activity would you enjoy most?", "options":["Reviewing contracts and advising businesses", "Building arguments and representing clients", "Researching laws, rights and public policy", "Working on technology, brands and intellectual property"], "dimension":"work_style"},
            {"id":"q3", "question":"What matters most in your Law career?", "options":["Helping organisations make sound legal decisions", "Advocating for clients", "Working on public interest and policy", "Protecting ideas, inventions and digital assets"], "dimension":"career_values"},
            {"id":"q4","question":"Which type of case or issue would you most like to work on?","options":["Business contracts and company matters","Criminal cases and disputes","Rights, government and public policy","Brands, inventions and intellectual property"],"dimension":"problem_solving"},
            {"id":"q5","question":"Which legal skill would you most enjoy developing?","options":["Contract review and legal advice","Advocacy, arguments and courtroom work","Legal research and policy analysis","IP research and technology-related law"],"dimension":"learning_style"},
            {"id":"q6","question":"Where would you prefer to apply your legal knowledge?","options":["Companies and corporate legal teams","Courts and litigation practice","Government, policy or public-interest work","Technology, media or creative industries"],"dimension":"career_direction"},
        ]
    },
    "media": {
        "label": "Media / Communication",
        "aliases": ["media", "mass communication", "journalism", "advertising", "communications", "film", "content creation"],
        "interests": ["Media", "Communication", "Arts", "Marketing"],
        "skills": ["Writing", "Communication", "Creativity", "Video Production", "Presentation", "Research"],
        "subjects": ["Journalism", "Mass Communication", "Advertising", "Media Studies", "Digital Content"],
        "pathways": ["Journalism", "Digital Media", "Public Relations", "Advertising & Content"],
        "questions": [
            {"id":"q1", "question":"Which Media area interests you the most?", "options":["Journalism and reporting", "Digital content and social media", "Advertising and brand communication", "Film, video and production"], "dimension":"core_affinity"},
            {"id":"q2", "question":"Which type of Media work would you enjoy?", "options":["Researching stories and interviewing people", "Creating posts, videos and digital campaigns", "Developing creative advertising concepts", "Scripting, filming and editing productions"], "dimension":"work_style"},
            {"id":"q3", "question":"What matters most in a Media career?", "options":["Informing audiences accurately", "Building engaged digital communities", "Communicating brand messages creatively", "Telling stories through visual media"], "dimension":"career_values"},
            {"id":"q4","question":"Which project would you most like to create?","options":["An investigative or feature story","A social media or content series","An advertising campaign","A short film or video production"],"dimension":"problem_solving"},
            {"id":"q5","question":"Which part of media production do you enjoy most?","options":["Researching and interviewing","Writing, presenting and publishing","Concept development and campaign planning","Scripting, filming and editing"],"dimension":"learning_style"},
            {"id":"q6","question":"What kind of audience impact interests you most?","options":["Informing people about important stories","Building communities and conversations","Changing how people see a brand","Telling memorable visual stories"],"dimension":"career_direction"},
        ]
    },
    "government": {
        "label": "Government / Public Service",
        "aliases": ["government", "public service", "upsc", "civil services", "ssc", "banking", "railways", "state psc", "defence", "police", "administration"],
        "interests": ["Public Service", "Governance", "Administration", "Security"],
        "skills": ["Public speaking", "Analytical thinking", "Leadership", "Civic awareness", "Research", "Decision making"],
        "subjects": ["Political Science", "Economics", "Current Affairs", "Administration", "Public Policy"],
        "pathways": ["Civil Services", "Banking & Public Sector", "Police & Defence", "Public Administration"],
        "questions": [
            {"id":"q1", "question":"Which public service path interests you the most?", "options":["UPSC / Civil Services", "SSC / Banking / Railways", "State PSC / Public administration", "Defence / Police / Security services"], "dimension":"core_affinity"},
            {"id":"q2", "question":"Which government or public service work appeals to you?", "options":["Policy, governance and public administration", "Administrative and government jobs", "Security, law enforcement and public service", "Public welfare and service delivery"], "dimension":"work_style"},
            {"id":"q3", "question":"What matters most in your Government career?", "options":["Serving the public and nation", "Stable long-term career growth", "Administrative responsibility and leadership", "Security, order and public service"], "dimension":"career_values"},
            {"id":"q4","question":"Which public problem would you most like to work on?","options":["Policy and governance","Public administration and services","Safety, security and law enforcement","Community welfare and development"],"dimension":"problem_solving"},
            {"id":"q5","question":"Which preparation style suits you best?","options":["Reading policy, current affairs and analysis","Practising aptitude and administrative skills","Combining study with physical or service preparation","Studying social issues and public programmes"],"dimension":"learning_style"},
            {"id":"q6","question":"What kind of responsibility appeals to you most?","options":["Making policy and governance decisions","Managing public services and administration","Protecting people and maintaining security","Working directly on public welfare"],"dimension":"career_direction"},
        ]
    },
    "other": {
        "label": "Other / Exploring",
        "aliases": ["other", "undecided", "exploring", "not sure", "general"],
        "interests": ["Exploration", "Communication", "Problem Solving", "Learning"],
        "skills": ["Communication", "Problem solving", "Critical thinking", "Adaptability", "Research", "Time management"],
        "subjects": ["General Studies", "Research", "Communication", "Problem Solving"],
        "pathways": ["General Career Exploration", "Business & Operations", "Research & Analysis", "Public Service"],
        "questions": [
            {"id":"q1", "question":"Which type of work interests you most right now?", "options":["Solving practical problems and building things", "Working with people, communication and leadership", "Researching topics and analysing information", "Creative work and new ideas"], "dimension":"core_affinity"},
            {"id":"q2", "question":"Which kind of work environment would you enjoy?", "options":["Hands-on and practical", "Collaborative and people-focused", "Research and analysis-focused", "Creative and flexible"], "dimension":"work_style"},
            {"id":"q3", "question":"What matters most while choosing your career?", "options":["Learning and growth", "Stability and long-term opportunities", "Making an impact", "Creativity and independence"], "dimension":"career_values"},
            {"id":"q4","question":"Which project would you be most interested in trying?","options":["Building or improving something practical","Organising people or a project","Researching a topic and finding patterns","Creating something original"],"dimension":"problem_solving"},
            {"id":"q5","question":"Which skill would you most like to develop next?","options":["Technical or hands-on skills","Communication and leadership","Research and analysis","Creative and presentation skills"],"dimension":"learning_style"},
            {"id":"q6","question":"Which direction would you like to explore first?","options":["Technology and practical problem solving","Business, people and management","Research, education or public service","Creative, media or design work"],"dimension":"career_direction"},
        ]
    }
}

def normalize(value: str) -> str:
    return " ".join(str(value or "").strip().lower().replace("/", " ").split())

def detect_stream(value: str) -> str:
    text = normalize(value)
    if not text:
        return "other"

    # Match whole words/phrases rather than arbitrary substrings so values such as
    # "Arts & Humanities" do not accidentally match the "it" alias from Information Technology.
    token_text = re.sub(r"[^a-z0-9]+", " ", text).strip()
    tokens = token_text.split()
    for key, cfg in sorted(STREAM_CONFIG.items(), key=lambda item: len(item[0]), reverse=True):
        aliases = sorted(cfg["aliases"] + [key], key=len, reverse=True)
        for alias in aliases:
            alias_tokens = re.sub(r"[^a-z0-9]+", " ", str(alias).lower()).strip().split()
            if not alias_tokens:
                continue
            width = len(alias_tokens)
            if width == 1 and alias_tokens[0] in tokens:
                return key
            for i in range(len(tokens) - width + 1):
                if tokens[i:i + width] == alias_tokens:
                    return key
    return "other"

def get_stream_config(value: str):
    return STREAM_CONFIG[detect_stream(value)]
