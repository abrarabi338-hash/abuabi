/**
 * MOHAMMED ABRAR VK - DATA & STATE STORE
 * Manages default profile information, skills, projects, and localStorage persistence.
 */

const STORAGE_KEYS = {
  PROFILE: 'abrar_portfolio_profile',
  SKILLS: 'abrar_portfolio_skills',
  PROJECTS: 'abrar_portfolio_projects',
  AVATAR: 'abrar_portfolio_avatar'
};

const DEFAULT_PROFILE = {
  name: 'MOHAMMED ABRAR VK',
  title: 'Aspiring Data Analyst | Web Developer',
  tagline: 'Available for Data Analytics & Web Development Opportunities • 2026 Batch',
  summary: 'I transform data into meaningful insights and build practical web applications.',
  education: 'Bachelor of Computer Applications (BCA)',
  college: 'MES College',
  university: 'Calicut University',
  graduationYear: '2026',
  location: 'Koyilandy, Kozhikode, Kerala, India',
  currentFocus: 'Data Analytics',
  email: 'mohammedabrarvk@gmail.com',
  githubUrl: '', // Editable in admin, disabled if empty
  linkedinUrl: 'https://www.linkedin.com/in/mohammed-abrar-vk',
  aboutNarrative: 'I am MOHAMMED ABRAR VK, a BCA graduate from MES College, affiliated with Calicut University, who graduated in 2026. I have a background in web development and am currently focusing on developing my skills in Data Analytics. I enjoy working with data, exploring patterns, finding meaningful insights, and building practical web applications. My goal is to grow into a professional Data Analyst while continuing to strengthen my technical and problem-solving skills.'
};

const DEFAULT_SKILLS = [
  // --- Data Analytics Skills ---
  {
    id: 'skill-python',
    name: 'Python',
    category: 'data-analytics',
    description: 'Core programming for data processing, automation, statistical computation, and exploratory analysis.',
    icon: 'code'
  },
  {
    id: 'skill-sql',
    name: 'SQL',
    category: 'data-analytics',
    description: 'Relational database querying, joins, aggregation, subqueries, and structured data extraction.',
    icon: 'database'
  },
  {
    id: 'skill-excel',
    name: 'Microsoft Excel',
    category: 'data-analytics',
    description: 'Formulas, pivot tables, data organization, lookup functions, and baseline descriptive summaries.',
    icon: 'table'
  },
  {
    id: 'skill-powerbi',
    name: 'Power BI',
    category: 'data-analytics',
    description: 'Business intelligence dashboards, interactive reports, visual data modeling, and KPI tracking.',
    icon: 'chart'
  },
  {
    id: 'skill-pandas',
    name: 'Pandas',
    category: 'data-analytics',
    description: 'DataFrames manipulation, handling missing values, transformation, indexing, and tabular data workflows.',
    icon: 'layers'
  },
  {
    id: 'skill-numpy',
    name: 'NumPy',
    category: 'data-analytics',
    description: 'Multi-dimensional arrays, vectorized operations, numerical routines, and matrix mathematics.',
    icon: 'cpu'
  },
  {
    id: 'skill-cleaning',
    name: 'Data Cleaning',
    category: 'data-analytics',
    description: 'Filtering anomalies, deduplication, standardizing schema formats, and preparing audit-ready datasets.',
    icon: 'filter'
  },
  {
    id: 'skill-eda',
    name: 'Exploratory Data Analysis (EDA)',
    category: 'data-analytics',
    description: 'Uncovering distributions, correlation analysis, pattern detection, and generating empirical questions.',
    icon: 'search'
  },
  {
    id: 'skill-dataviz',
    name: 'Data Visualization',
    category: 'data-analytics',
    description: 'Designing intuitive charts, heatmaps, and graphical narratives to communicate actionable findings.',
    icon: 'pie-chart'
  },

  // --- Web Development Skills ---
  {
    id: 'skill-html',
    name: 'HTML',
    category: 'web-development',
    description: 'Semantic markup, accessibility compliance, document structuring, and modern web standards.',
    icon: 'layout'
  },
  {
    id: 'skill-css',
    name: 'CSS',
    category: 'web-development',
    description: 'Responsive styling, Flexbox, CSS Grid, custom properties, animations, and clean design systems.',
    icon: 'palette'
  },
  {
    id: 'skill-js',
    name: 'JavaScript',
    category: 'web-development',
    description: 'ES6+ modern syntax, asynchronous logic, DOM manipulation, event loops, and client-side scripting.',
    icon: 'terminal'
  },
  {
    id: 'skill-react',
    name: 'React.js',
    category: 'web-development',
    description: 'Component architecture, state and props management, hooks, and responsive user interfaces.',
    icon: 'atom'
  },
  {
    id: 'skill-node',
    name: 'Node.js',
    category: 'web-development',
    description: 'Server-side JavaScript runtime, event-driven architecture, and backend service execution.',
    icon: 'server'
  },
  {
    id: 'skill-express',
    name: 'Express.js',
    category: 'web-development',
    description: 'Building RESTful APIs, middleware pipeline design, request handling, and routing architecture.',
    icon: 'send'
  },
  {
    id: 'skill-mongodb',
    name: 'MongoDB',
    category: 'web-development',
    description: 'Document-oriented NoSQL database design, schema definition with Mongoose, and data aggregation.',
    icon: 'hard-drive'
  },
  {
    id: 'skill-mern',
    name: 'MERN Stack',
    category: 'web-development',
    description: 'Full-stack application integration uniting MongoDB, Express, React, and Node into unified solutions.',
    icon: 'box'
  },
  {
    id: 'skill-git',
    name: 'Git & GitHub',
    category: 'web-development',
    description: 'Distributed version control, branching workflows, repository collaboration, and code management.',
    icon: 'git-branch'
  }
];

const DEFAULT_PROJECTS = [
  {
    id: 'proj-nss',
    title: 'NSS Coordination Portal',
    category: 'Web Development',
    status: 'Completed',
    statusBadge: 'Completed',
    image: 'assets/nss_preview.jpg',
    technologies: ['MERN Stack', 'MongoDB', 'Express.js', 'React.js', 'Node.js', 'REST API'],
    description: 'The NSS Coordination Portal is a web application developed to simplify and modernize the management of National Service Scheme activities in colleges. It helps organize events, manage student participation, monitor attendance and performance, allocate credit points, and improve communication between students, coordinators, and administrators.',
    features: [
      'Student registration and profile management.',
      'NSS event creation and management.',
      'Attendance tracking and verification.',
      'Student performance monitoring.',
      'Grade and credit point allocation.',
      'Volunteer selection and participation tracking.',
      'Complaints, feedback, and communication.',
      'Administrative and coordinator management.'
    ],
    roleModules: {
      admin: 'Coordinator management, grievance resolution, review replies, and administrative audits.',
      coordinator: 'Student enrollment, event coordination, attendance verification, performance logging, and credit point assignment.',
      user: 'Event schedule browsing, attendance history verification, credit point ledger, and submitting feedback/complaints.'
    },
    githubUrl: '', // Left blank to render clearly disabled button per prompt requirements
    liveUrl: ''    // Left blank to render clearly disabled button per prompt requirements
  },
  {
    id: 'proj-analytics-upcoming',
    title: 'Data Analytics Project',
    category: 'Data Analytics',
    status: 'Coming Soon',
    statusBadge: 'Coming Soon',
    image: 'assets/analytics_preview.jpg',
    technologies: ['Python', 'Pandas', 'SQL', 'Power BI', 'EDA', 'Data Viz'],
    description: 'A comprehensive upcoming exploratory data analysis project focusing on real-world datasets. Currently undergoing problem-definition, data cleaning pipelines in Python, structured SQL querying, and interactive Power BI report generation.',
    features: [
      'Data extraction & hygiene checks with Pandas.',
      'Outlier detection and missing value imputation.',
      'Exploratory data analysis & pattern identification.',
      'Executive KPI dashboard visual layout in Power BI.',
      'Actionable decision insights and analytical report.'
    ],
    roleModules: null,
    githubUrl: '',
    liveUrl: ''
  },
  {
    id: 'proj-future-upcoming',
    title: 'More Projects',
    category: 'Future Projects',
    status: 'Coming Soon',
    statusBadge: 'Coming Soon',
    image: 'assets/future_preview.jpg',
    technologies: ['Data Analytics', 'Web Apps', 'SQL Automation', 'Data Pipeline'],
    description: 'Future development initiatives bridging data analysis workflows with custom responsive web interfaces. New analytics studies and interactive applications will be added here upon completion.',
    features: [
      'End-to-end data pipelines.',
      'Dynamic dashboard integrations.',
      'Full-stack utility tools.',
      'Applied analytical modeling.'
    ],
    roleModules: null,
    githubUrl: '',
    liveUrl: ''
  }
];

// Sample Datasets for the Data Analytics Showcase
const ANALYTICS_DATASETS = {
  nss_activity: {
    title: 'College NSS Volunteer Attendance & Participation',
    unit: 'Volunteers',
    timeframes: {
      month: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [120, 185, 240, 295],
        kpis: { total: '840 Hrs', avg: '210 Vol/Wk', cleanRate: '99.4%', trend: '+24.5%' },
        insights: [
          'Participation peaked in Week 4 during community clean-up drive with 295 verified volunteers.',
          'Attendance validation through portal reduced verification delays from 4 days to immediate log.'
        ]
      },
      quarter: {
        labels: ['Jan', 'Feb', 'Mar'],
        data: [420, 580, 710],
        kpis: { total: '1,710 Vol', avg: '570 / Mo', cleanRate: '99.1%', trend: '+32.8%' },
        insights: [
          'Quarterly activity trend demonstrates a 32.8% expansion in active volunteer engagement.',
          'Event coordination via centralized portal boosted multi-department attendance.'
        ]
      },
      year: {
        labels: ['Orientation', 'Blood Drive', 'Tree Planting', 'Special Camp', 'Health Camp', 'Annual Review'],
        data: [350, 480, 520, 610, 490, 580],
        kpis: { total: '3,030 Part.', avg: '505 / Event', cleanRate: '99.6%', trend: '+18.2%' },
        insights: [
          'Special Camp achieved highest aggregate student participation (610 attendees).',
          'Automated credit point tracking eliminated duplicate entry complaints entirely.'
        ]
      }
    }
  },
  credit_distribution: {
    title: 'Student NSS Credit Points & Completion Distribution',
    unit: 'Credits',
    timeframes: {
      month: {
        labels: ['0-20 Pts', '21-40 Pts', '41-60 Pts', '61-80 Pts', '81-100 Pts'],
        data: [25, 45, 95, 140, 80],
        kpis: { total: '385 Stud.', avg: '58.4 Pts', cleanRate: '100%', trend: '+15.0%' },
        insights: [
          'Over 57% of volunteers have attained over 60 credit points toward graduation requirements.',
          'Performance monitoring enabled coordinators to identify students needing additional events.'
        ]
      },
      quarter: {
        labels: ['First Year', 'Second Year', 'Final Year'],
        data: [180, 240, 290],
        kpis: { total: '710 Stud.', avg: '72.1 Pts', cleanRate: '99.8%', trend: '+21.3%' },
        insights: [
          'Final year students maintain highest event participation rates to satisfy degree credits.',
          'Second year volunteers logged the highest average volunteer hours per semester.'
        ]
      },
      year: {
        labels: ['Arts', 'Science', 'Commerce', 'Computer Apps (BCA)'],
        data: [210, 260, 310, 340],
        kpis: { total: '1,120 Stud.', avg: '68.0 Pts', cleanRate: '99.5%', trend: '+14.7%' },
        insights: [
          'Computer Applications (BCA) volunteers registered top engagement in digital logistics.',
          'Credit allocation audit shows zero discrepancies across all four academic streams.'
        ]
      }
    }
  },
  pipeline_health: {
    title: 'Data Analytics Workflow Processing Metrics',
    unit: 'Records (k)',
    timeframes: {
      month: {
        labels: ['Ingestion', 'Schema Valid.', 'Null Handling', 'Outlier Filter', 'Aggregation'],
        data: [150, 148, 145, 142, 142],
        kpis: { total: '142k Clean', avg: '94.6% Ret.', cleanRate: '99.9%', trend: '+8.4%' },
        insights: [
          'Cleaning pipeline preserved 94.6% of original records after deduplication and range audits.',
          'SQL aggregation queries execute in under 42ms on local benchmarking runs.'
        ]
      },
      quarter: {
        labels: ['Dataset A', 'Dataset B', 'Dataset C', 'Dataset D'],
        data: [85, 120, 195, 230],
        kpis: { total: '630k Rows', avg: '157k / Set', cleanRate: '99.7%', trend: '+28.0%' },
        insights: [
          'Dataset C & D represent high-density structured tables evaluated with Pandas and NumPy.',
          'Exploratory data analysis identified strong feature correlation between activity & credit scores.'
        ]
      },
      year: {
        labels: ['Q1 Prep', 'Q2 Cleaning', 'Q3 EDA Modeling', 'Q4 Visualization'],
        data: [320, 480, 590, 680],
        kpis: { total: '2.07M Ops', avg: '517k / Qtr', cleanRate: '99.8%', trend: '+35.5%' },
        insights: [
          'Comprehensive data workflow establishes reliable foundation for enterprise analytics.',
          'Visualization models tailored for executive reporting and operational clarity.'
        ]
      }
    }
  }
};

// Data Store Helper Functions
const PortfolioStore = {
  getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getSkills() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SKILLS);
      return data ? JSON.parse(data) : DEFAULT_SKILLS;
    } catch (e) {
      return DEFAULT_SKILLS;
    }
  },

  saveSkills(skills) {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  },

  getProjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : DEFAULT_PROJECTS;
    } catch (e) {
      return DEFAULT_PROJECTS;
    }
  },

  saveProjects(projects) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  getAvatar() {
    return localStorage.getItem(STORAGE_KEYS.AVATAR) || 'assets/abrar_profile.jpg';
  },

  saveAvatar(avatarDataUrl) {
    localStorage.setItem(STORAGE_KEYS.AVATAR, avatarDataUrl);
  },

  resetAvatar() {
    localStorage.removeItem(STORAGE_KEYS.AVATAR);
  },

  resetAllToDefault() {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.AVATAR);
  },

  exportJSON() {
    const backup = {
      profile: this.getProfile(),
      skills: this.getSkills(),
      projects: this.getProjects(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  },

  importJSON(jsonString) {
    const data = JSON.parse(jsonString);
    if (data.profile) this.saveProfile(data.profile);
    if (data.skills) this.saveSkills(data.skills);
    if (data.projects) this.saveProjects(data.projects);
  }
};
