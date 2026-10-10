/**
 * MOHAMMED ABRAR VK - DATA & STATE STORE (CLEAN MATTE PROFESSIONAL THEME)
 * Manages default profile information, skills, projects, education, learning topics,
 * contact details, analytics datasets, and secure localStorage/sessionStorage persistence.
 */

const STORAGE_KEYS = {
  PROFILE: 'abrar_portfolio_profile',
  SKILLS: 'abrar_portfolio_skills',
  PROJECTS: 'abrar_portfolio_projects',
  EDUCATION: 'abrar_portfolio_education',
  LEARNING: 'abrar_portfolio_learning',
  CONTACT: 'abrar_portfolio_contact',
  AVATAR: 'abrar_portfolio_avatar',
  AUTH_PASSKEY: 'abrar_portfolio_admin_passkey'
};

const SESSION_KEYS = {
  IS_ADMIN: 'abrar_session_is_admin'
};

const DEFAULT_PROFILE = {
  name: 'MOHAMMED ABRAR VK',
  title: 'Aspiring Data Analyst | Web Developer',
  tagline: 'BCA Graduate (2026) • Data Analytics & Practical Web Development',
  summary: 'I transform raw data into meaningful insights through data analysis, visualization, and practical technology solutions.',
  currentFocus: 'Data Analytics',
  educationDegree: 'Bachelor of Computer Applications (BCA)',
  educationCollege: 'MES College',
  graduationYear: '2026',
  location: 'Koyilandy, Kozhikode, Kerala, India',
  aboutNarrative: 'I completed my Bachelor of Computer Applications in 2026 and am currently focusing on developing my skills in Data Analytics. My background includes web development and practical project work. I enjoy cleaning and analyzing data, discovering meaningful patterns, creating visual reports, and building useful applications.'
};

const DEFAULT_EDUCATION = [
  {
    id: 'edu-bca-2026',
    degree: 'Bachelor of Computer Applications (BCA)',
    college: 'MES College',
    university: 'Calicut University',
    graduationYear: '2026',
    status: 'Graduated: 2026',
    description: 'Undergraduate computing education focused on database management systems, structured querying (SQL), algorithms, statistical foundations, and practical web software development.',
    subjects: [
      'Database Management Systems (DBMS & SQL)',
      'Python Programming & Scripting',
      'Data Structures & Algorithmic Analysis',
      'Web Technologies & Application Systems',
      'Probability & Statistical Foundations',
      'Software Engineering Principles'
    ]
  }
];

const DEFAULT_LEARNING = [
  {
    id: 'learn-data-analytics',
    topic: 'Data Analytics',
    category: 'Core Focus',
    description: 'Structured analytical workflows, exploratory methodologies, metric interpretation, and evidence-based decision support.',
    status: 'Active Study',
    icon: 'search'
  },
  {
    id: 'learn-python',
    topic: 'Python',
    category: 'Programming',
    description: 'Data wrangling with Pandas, numerical array computation with NumPy, and clean script automation.',
    status: 'In Progress',
    icon: 'code'
  },
  {
    id: 'learn-sql',
    topic: 'SQL',
    category: 'Database Querying',
    description: 'Relational data aggregation, multi-table joins, subqueries, group summaries, and structured extraction.',
    status: 'In Progress',
    icon: 'database'
  },
  {
    id: 'learn-powerbi',
    topic: 'Power BI',
    category: 'Business Intelligence',
    description: 'Interactive dashboard reports, visual data modeling, relationship mapping, and business KPI tracking.',
    status: 'Active Practice',
    icon: 'chart'
  },
  {
    id: 'learn-excel',
    topic: 'Advanced Excel',
    category: 'Spreadsheet Analysis',
    description: 'Dynamic lookup functions, pivot tables, summary aggregations, and data validation techniques.',
    status: 'In Progress',
    icon: 'table'
  },
  {
    id: 'learn-dataviz',
    topic: 'Data Visualization',
    category: 'Visual Communication',
    description: 'Designing clear charts, heatmaps, and graphical distributions to communicate empirical findings without distortion.',
    status: 'Active Practice',
    icon: 'pie-chart'
  }
];

const DEFAULT_CONTACT = {
  email: 'mohammedabrarvk@gmail.com',
  phone: '', // Left empty by default; public view hides unconfigured phone links
  linkedinUrl: 'https://www.linkedin.com/in/mohammed-abrar-vk',
  githubUrl: '', // Left empty by default; public view hides unconfigured github links
  location: 'Koyilandy, Kozhikode, Kerala, India',
  formEndpoint: '' // Optional backend/API endpoint for email service
};

const DEFAULT_SKILLS = [
  // --- Data Analytics ---
  {
    id: 'skill-python',
    name: 'Python',
    category: 'data-analytics',
    description: 'Core language for data processing, scripting, statistical computation, and workflow automation.',
    icon: 'code'
  },
  {
    id: 'skill-sql',
    name: 'SQL',
    category: 'data-analytics',
    description: 'Relational database querying, joins, grouping, aggregation, and structured data extraction.',
    icon: 'database'
  },
  {
    id: 'skill-excel',
    name: 'Microsoft Excel',
    category: 'data-analytics',
    description: 'Formulas, pivot tables, data organization, lookup functions, and descriptive summaries.',
    icon: 'table'
  },
  {
    id: 'skill-powerbi',
    name: 'Power BI',
    category: 'data-analytics',
    description: 'Business intelligence dashboards, interactive visual reports, and operational KPI tracking.',
    icon: 'chart'
  },
  {
    id: 'skill-pandas',
    name: 'Pandas',
    category: 'data-analytics',
    description: 'DataFrame manipulation, handling missing values, filtering, transformation, and indexing.',
    icon: 'layers'
  },
  {
    id: 'skill-numpy',
    name: 'NumPy',
    category: 'data-analytics',
    description: 'Multi-dimensional arrays, vectorized operations, numerical computation, and matrix math.',
    icon: 'cpu'
  },
  {
    id: 'skill-matplotlib',
    name: 'Matplotlib',
    category: 'data-analytics',
    description: 'Python 2D plotting library for creating static, publication-quality figures and plots.',
    icon: 'chart'
  },
  {
    id: 'skill-seaborn',
    name: 'Seaborn',
    category: 'data-analytics',
    description: 'Statistical data visualization built on Matplotlib for informative statistical graphics.',
    icon: 'pie-chart'
  },
  {
    id: 'skill-cleaning',
    name: 'Data Cleaning',
    category: 'data-analytics',
    description: 'Standardizing formats, removing inconsistencies, imputing nulls, and preparing audit-ready datasets.',
    icon: 'filter'
  },
  {
    id: 'skill-eda',
    name: 'Exploratory Data Analysis (EDA)',
    category: 'data-analytics',
    description: 'Discovering patterns, anomaly detection, distribution checks, and generating empirical questions.',
    icon: 'search'
  },
  {
    id: 'skill-dataviz',
    name: 'Data Visualization',
    category: 'data-analytics',
    description: 'Selecting clear graphical forms to present metrics honestly, accurately, and intuitively.',
    icon: 'pie-chart'
  },

  // --- Web Development ---
  {
    id: 'skill-html',
    name: 'HTML',
    category: 'web-development',
    description: 'Semantic document structure, accessibility standards, and clean page markup.',
    icon: 'layout'
  },
  {
    id: 'skill-css',
    name: 'CSS',
    category: 'web-development',
    description: 'Responsive styling, Flexbox, CSS Grid, modular variables, and restrained visual design.',
    icon: 'palette'
  },
  {
    id: 'skill-js',
    name: 'JavaScript',
    category: 'web-development',
    description: 'Modern ES6+ syntax, asynchronous programming, DOM interactions, and client logic.',
    icon: 'terminal'
  },
  {
    id: 'skill-react',
    name: 'React',
    category: 'web-development',
    description: 'Component-driven user interfaces, state management, hooks, and clean reusable components.',
    icon: 'atom'
  },
  {
    id: 'skill-node',
    name: 'Node.js',
    category: 'web-development',
    description: 'Server-side runtime environment for executing scalable backend services and APIs.',
    icon: 'server'
  },
  {
    id: 'skill-express',
    name: 'Express.js',
    category: 'web-development',
    description: 'Lightweight web framework for building RESTful endpoints, routing, and middleware.',
    icon: 'send'
  },
  {
    id: 'skill-mongodb',
    name: 'MongoDB',
    category: 'web-development',
    description: 'Document database for structured NoSQL storage, collections, and query aggregation.',
    icon: 'hard-drive'
  },
  {
    id: 'skill-mern',
    name: 'MERN Stack',
    category: 'web-development',
    description: 'Integrated full-stack web solutions unifying MongoDB, Express.js, React, and Node.js.',
    icon: 'box'
  },
  {
    id: 'skill-git',
    name: 'Git and GitHub',
    category: 'web-development',
    description: 'Version control, repository organization, branch workflows, and code collaboration.',
    icon: 'git-branch'
  }
];

const DEFAULT_PROJECTS = [
  {
    id: 'proj-nss',
    title: 'NSS Coordination System',
    category: 'Web Development',
    status: 'Completed',
    statusBadge: 'Verified Project',
    image: 'assets/nss_preview.jpg',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'MERN Stack', 'REST API'],
    description: 'A web application designed to simplify NSS activity coordination, event management, attendance monitoring, performance tracking, and communication between administrators, coordinators, and students.',
    features: [
      'Role-based Admin, Coordinator, and User modules.',
      'Event creation, scheduling, and activity management.',
      'Attendance and volunteer participation tracking.',
      'Performance monitoring and credit-point management.',
      'Complaint, feedback, and coordinator communication features.'
    ],
    roleModules: {
      admin: 'Coordinator management, grievance resolution, official replies, and administrative oversight.',
      coordinator: 'Student enrollment, event scheduling, attendance verification, and credit point assignment.',
      user: 'Event schedule viewing, personal attendance verification, credit point ledger, and submitting feedback.'
    },
    githubUrl: '', // Disabled if unconfigured per prompt requirements
    liveUrl: ''    // Disabled if unconfigured per prompt requirements
  },
  {
    id: 'proj-sales-eda',
    title: 'Sales Data Exploratory Analysis',
    category: 'Data Analytics',
    status: 'In Development',
    statusBadge: 'Data Analytics',
    image: 'assets/sales_eda_preview.jpg',
    technologies: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'EDA', 'Data Viz'],
    description: 'An exploratory data analysis project focused on examining sales data, identifying patterns, understanding performance, and communicating findings through data visualizations.',
    features: [
      'Data cleaning, null imputation, and data type formatting in Pandas.',
      'Sales trend analysis across monthly and quarterly cycles.',
      'Category-level volume and revenue distribution with Seaborn.',
      'Customer acquisition channel performance comparisons.'
    ],
    roleModules: null,
    githubUrl: '',
    liveUrl: ''
  },
  {
    id: 'proj-sql-analysis',
    title: 'E-commerce / Sales SQL Analysis',
    category: 'Data Analytics',
    status: 'In Development',
    statusBadge: 'Data Analytics',
    image: 'assets/sql_analysis_preview.jpg',
    technologies: ['SQL', 'PostgreSQL', 'Aggregation', 'Window Functions', 'Data Analysis'],
    description: 'A SQL-based analysis project focused on querying sales data, aggregating performance metrics, comparing categories or regions, and extracting meaningful business insights.',
    features: [
      'Structured queries aggregating total revenue, order volume, and profit margins.',
      'Regional sales ranking and category performance breakdowns.',
      'Multi-table joins linking orders, customers, and regional classifications.',
      'Summary metrics formatted for analytical reporting and review.'
    ],
    roleModules: null,
    githubUrl: '',
    liveUrl: ''
  },
  {
    id: 'proj-coming-soon',
    title: 'Future Analytics Projects',
    category: 'Data Analytics',
    status: 'Coming Soon',
    statusBadge: 'Upcoming',
    image: 'assets/future_preview.jpg',
    technologies: ['Power BI', 'SQL', 'Python', 'Excel'],
    description: 'Upcoming analytical case studies focusing on public datasets, business performance dashboards, and automated data pipelines.',
    features: [
      'End-to-end data pipelines.',
      'Interactive Power BI report designs.',
      'Structured SQL business reporting.'
    ],
    roleModules: null,
    githubUrl: '',
    liveUrl: ''
  }
];

// Sample Datasets for the Clean Light Analytics Showcase
const ANALYTICS_DATASETS = {
  nss_activity: {
    title: 'NSS Activity & Volunteer Participation Metrics',
    description: 'Illustrative activity tracking dataset showing event attendance and volunteer hours over time.',
    timeframes: {
      month: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        barData: [120, 185, 240, 295],
        lineData: [95, 150, 210, 280],
        donutData: [
          { label: 'Community Service', value: 38, color: '#356AE6' },
          { label: 'Campus Drives', value: 32, color: '#4F8F91' },
          { label: 'Awareness Seminars', value: 18, color: '#8896AB' },
          { label: 'Support & Logistics', value: 12, color: '#D0D5DD' }
        ],
        kpis: {
          totalVolume: '840 Hrs',
          avgMetric: '210 Vol/Wk',
          hygieneRate: '99.4%',
          trendRate: '+24.5%'
        },
        sampleTable: [
          { id: 'REC-101', item: 'Campus Cleanliness Drive', category: 'Community Service', metric: '140 Vol', status: 'Logged' },
          { id: 'REC-102', item: 'Blood Donation Camp', category: 'Health & Wellness', metric: '85 Vol', status: 'Logged' },
          { id: 'REC-103', item: 'Digital Literacy Workshop', category: 'Education', metric: '60 Vol', status: 'Logged' },
          { id: 'REC-104', item: 'Tree Plantation Initiative', category: 'Environment', metric: '95 Vol', status: 'Logged' }
        ],
        insights: [
          'Participation peaked in Week 4 during community clean-up drive with 295 verified volunteers.',
          'Attendance validation through portal reduced verification delays from 4 days to immediate log.'
        ]
      },
      quarter: {
        labels: ['Jan', 'Feb', 'Mar'],
        barData: [420, 580, 710],
        lineData: [390, 540, 680],
        donutData: [
          { label: 'Community Service', value: 42, color: '#356AE6' },
          { label: 'Campus Drives', value: 28, color: '#4F8F91' },
          { label: 'Awareness Seminars', value: 20, color: '#8896AB' },
          { label: 'Support & Logistics', value: 10, color: '#D0D5DD' }
        ],
        kpis: {
          totalVolume: '1,710 Vol',
          avgMetric: '570 / Mo',
          hygieneRate: '99.1%',
          trendRate: '+32.8%'
        },
        sampleTable: [
          { id: 'REC-201', item: 'District Health Camp', category: 'Health & Wellness', metric: '240 Vol', status: 'Logged' },
          { id: 'REC-202', item: 'Youth Awareness Rally', category: 'Civic Outreach', metric: '310 Vol', status: 'Logged' },
          { id: 'REC-203', item: 'Flood Relief Support', category: 'Community Service', metric: '160 Vol', status: 'Logged' }
        ],
        insights: [
          'Quarterly activity trend demonstrates a 32.8% expansion in active volunteer engagement.',
          'Event coordination via centralized portal boosted multi-department attendance.'
        ]
      },
      year: {
        labels: ['Orientation', 'Blood Drive', 'Tree Planting', 'Special Camp', 'Health Camp', 'Annual Review'],
        barData: [350, 480, 520, 610, 490, 580],
        lineData: [320, 440, 500, 590, 470, 560],
        donutData: [
          { label: 'Community Service', value: 45, color: '#356AE6' },
          { label: 'Campus Drives', value: 25, color: '#4F8F91' },
          { label: 'Awareness Seminars', value: 18, color: '#8896AB' },
          { label: 'Support & Logistics', value: 12, color: '#D0D5DD' }
        ],
        kpis: {
          totalVolume: '3,030 Part.',
          avgMetric: '505 / Event',
          hygieneRate: '99.6%',
          trendRate: '+18.2%'
        },
        sampleTable: [
          { id: 'REC-301', item: 'Annual 7-Day Special Camp', category: 'Community Service', metric: '610 Vol', status: 'Verified' },
          { id: 'REC-302', item: 'State Level Road Safety', category: 'Civic Outreach', metric: '490 Vol', status: 'Verified' },
          { id: 'REC-303', item: 'NSS Orientation Assembly', category: 'Campus Program', metric: '350 Vol', status: 'Verified' }
        ],
        insights: [
          'Special Camp achieved highest aggregate student participation (610 attendees).',
          'Automated credit point tracking eliminated duplicate entry complaints entirely.'
        ]
      }
    }
  },
  sales_analysis: {
    title: 'Sales Performance & Regional Contribution (Illustrative)',
    description: 'Sample exploratory sales dataset evaluating category distributions and regional revenue trends.',
    timeframes: {
      month: {
        labels: ['Electronics', 'Apparel', 'Home Goods', 'Beauty', 'Others'],
        barData: [36, 26, 21, 14, 9],
        lineData: [30, 24, 19, 12, 8],
        donutData: [
          { label: 'North America', value: 42, color: '#356AE6' },
          { label: 'Europe', value: 28, color: '#4F8F91' },
          { label: 'Asia Pacific', value: 18, color: '#8896AB' },
          { label: 'Other Regions', value: 12, color: '#D0D5DD' }
        ],
        kpis: {
          totalVolume: '106k Units',
          avgMetric: '21.2k / Cat',
          hygieneRate: '99.8%',
          trendRate: '+14.2%'
        },
        sampleTable: [
          { id: 'CAT-01', item: 'Electronics & Audio', category: 'Hardware', metric: '36,000 Units', status: 'Validated' },
          { id: 'CAT-02', item: 'Apparel & Footwear', category: 'Fashion', metric: '26,000 Units', status: 'Validated' },
          { id: 'CAT-03', item: 'Home & Living', category: 'Interior', metric: '21,000 Units', status: 'Validated' },
          { id: 'CAT-04', item: 'Personal Care & Beauty', category: 'Cosmetics', metric: '14,000 Units', status: 'Validated' }
        ],
        insights: [
          'Electronics and Apparel account for over 58% of aggregate order volumes.',
          'Regional contribution highlights North America and Europe as primary volume drivers.'
        ]
      },
      quarter: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        barData: [210, 280, 340, 420],
        lineData: [195, 260, 320, 395],
        donutData: [
          { label: 'Direct Online', value: 48, color: '#356AE6' },
          { label: 'Retail Partners', value: 30, color: '#4F8F91' },
          { label: 'B2B Wholesale', value: 14, color: '#8896AB' },
          { label: 'Affiliates', value: 8, color: '#D0D5DD' }
        ],
        kpis: {
          totalVolume: '1.25M Units',
          avgMetric: '312k / Qtr',
          hygieneRate: '99.9%',
          trendRate: '+22.4%'
        },
        sampleTable: [
          { id: 'QTR-1', item: 'Quarter 1 Distribution', category: 'Quarterly', metric: '210k Units', status: 'Closed' },
          { id: 'QTR-2', item: 'Quarter 2 Distribution', category: 'Quarterly', metric: '280k Units', status: 'Closed' },
          { id: 'QTR-3', item: 'Quarter 3 Distribution', category: 'Quarterly', metric: '340k Units', status: 'Closed' },
          { id: 'QTR-4', item: 'Quarter 4 Distribution', category: 'Quarterly', metric: '420k Units', status: 'Closed' }
        ],
        insights: [
          'Consistent quarterly progression indicates healthy seasonal demand ramp-up into Q4.',
          'Direct online channels represent nearly half of overall customer acquisition.'
        ]
      },
      year: {
        labels: ['2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2'],
        barData: [180, 220, 260, 310, 350, 410],
        lineData: [170, 210, 250, 295, 335, 390],
        donutData: [
          { label: 'Organic Search', value: 40, color: '#356AE6' },
          { label: 'Paid Search', value: 32, color: '#4F8F91' },
          { label: 'Referral', value: 16, color: '#8896AB' },
          { label: 'Social Channels', value: 12, color: '#D0D5DD' }
        ],
        kpis: {
          totalVolume: '1.73M Units',
          avgMetric: '288k / Period',
          hygieneRate: '99.7%',
          trendRate: '+28.1%'
        },
        sampleTable: [
          { id: 'ANN-01', item: 'Historical Ingestion Log', category: 'Pipeline', metric: '1.73M Rows', status: 'Audited' },
          { id: 'ANN-02', item: 'Regional Sales Aggregation', category: 'SQL Query', metric: 'Sub-second', status: 'Audited' }
        ],
        insights: [
          'Long-term analytical trend illustrates predictable and scalable operational growth.',
          'Data cleaning routines removed 0.3% anomalies while preserving full statistical integrity.'
        ]
      }
    }
  }
};

// Data Store Helper Functions with LocalStorage Persistence
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

  getEducation() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EDUCATION);
      return data ? JSON.parse(data) : DEFAULT_EDUCATION;
    } catch (e) {
      return DEFAULT_EDUCATION;
    }
  },

  saveEducation(education) {
    localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(education));
  },

  getLearning() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEARNING);
      return data ? JSON.parse(data) : DEFAULT_LEARNING;
    } catch (e) {
      return DEFAULT_LEARNING;
    }
  },

  saveLearning(learning) {
    localStorage.setItem(STORAGE_KEYS.LEARNING, JSON.stringify(learning));
  },

  getContact() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTACT);
      return data ? { ...DEFAULT_CONTACT, ...JSON.parse(data) } : DEFAULT_CONTACT;
    } catch (e) {
      return DEFAULT_CONTACT;
    }
  },

  saveContact(contact) {
    localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(contact));
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

  getAdminPasskey() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_PASSKEY) || 'abrar2026';
  },

  setAdminPasskey(newPasskey) {
    localStorage.setItem(STORAGE_KEYS.AUTH_PASSKEY, newPasskey);
  },

  isAdminAuthenticated() {
    return sessionStorage.getItem(SESSION_KEYS.IS_ADMIN) === 'true';
  },

  setAdminAuthenticated(status) {
    if (status) {
      sessionStorage.setItem(SESSION_KEYS.IS_ADMIN, 'true');
    } else {
      sessionStorage.removeItem(SESSION_KEYS.IS_ADMIN);
    }
  },

  resetAllToDefault() {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.EDUCATION);
    localStorage.removeItem(STORAGE_KEYS.LEARNING);
    localStorage.removeItem(STORAGE_KEYS.CONTACT);
    localStorage.removeItem(STORAGE_KEYS.AVATAR);
    sessionStorage.removeItem(SESSION_KEYS.IS_ADMIN);
  },

  exportJSON() {
    const backup = {
      profile: this.getProfile(),
      skills: this.getSkills(),
      projects: this.getProjects(),
      education: this.getEducation(),
      learning: this.getLearning(),
      contact: this.getContact(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  },

  importJSON(jsonString) {
    const data = JSON.parse(jsonString);
    if (data.profile) this.saveProfile(data.profile);
    if (data.skills) this.saveSkills(data.skills);
    if (data.projects) this.saveProjects(data.projects);
    if (data.education) this.saveEducation(data.education);
    if (data.learning) this.saveLearning(data.learning);
    if (data.contact) this.saveContact(data.contact);
  }
};
