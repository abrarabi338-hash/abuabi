# MOHAMMED ABRAR VK — Personal Portfolio Website

Production-quality, modern personal portfolio website for **MOHAMMED ABRAR VK**, designed as an **Aspiring Data Analyst and Web Developer**.

Built for job applications, internships, interviews, LinkedIn, recruiters, and companies.

---

## 🌟 Highlights

- **Hero Section**: Mohammed Abrar VK's verified identity, authentic portrait image, graduation details (BCA 2026, MES College, Calicut University), and core interests.
- **Data Journey**: Interactive HTML5 Canvas visualization showing $\text{DATA} \longrightarrow \text{ANALYSIS} \longrightarrow \text{INSIGHT}$ with glowing particles.
- **About Me**: Verbatim professional narrative and visual bridge illustrating the connection between Data Analytics and MERN Stack Web Development.
- **Skills & Technologies**: 9 Data Analytics + 9 Web Development skills with real-time search and category filtering. No fabricated ratings.
- **Featured Projects**:
  - **Project 1: NSS Coordination Portal (MERN Stack)**: Interactive role tabs (Admin, Coordinator, User), 8 key features, safe link handling.
  - **Project 2: Data Analytics Project (Coming Soon)**: Professional placeholder card.
  - **Project 3: More Projects (Coming Soon)**: Future roadmap card.
- **Data Analytics Showcase**: Five-stage workflow banner, KPI cards, switchable Bar and Trend Line charts, Donut chart, and a sample Data Audit Table.
- **Education**: Detailed undergraduate timeline with core computing subject areas.
- **Currently Learning**: Active study cards for Data Analytics, Python for Data, SQL, Power BI, Advanced Excel, and Data Visualization.
- **Let's Connect (Contact)**: Direct email with copy button, phone number support, LinkedIn profile link, and direct contact form.
- **Private Admin Panel**: Secure passkey authentication (`abrar2026`) allowing full customization of Profile, Skills, Projects, Education, Currently Learning, Contact info, and JSON data backup/export without touching source code.

---

## 🚀 How to Run Locally

### Option 1: Standalone (Zero Install / Instant)
Simply double-click `index.html` in any modern web browser, or serve it via Python:
```bash
python -m http.server 8000
```
Then navigate to: `http://localhost:8000`

### Option 2: Node.js Express Server
```bash
npm install
npm start
```

---

## 🔐 Private Admin Access

- **Admin Login**: Click the discreet **Admin** button in the top navbar or footer, or press `Ctrl + Shift + L`.
- **Default Passkey**: `abrar2026` (can be updated anytime in the Settings tab).
- **Security**: Normal visitors cannot see editing controls or edit badges.

---

## 📁 Project Directory

```
portfolio/
├── index.html            # Main semantic HTML structure
├── css/
│   └── styles.css        # Responsive dark design system & glassmorphism
├── js/
│   ├── data.js           # Central data model, default state & persistence
│   └── app.js            # Canvas animations, chart engine, UI & admin logic
├── assets/
│   ├── abrar_profile.jpg # Authentic portrait photograph
│   ├── nss_preview.jpg   # NSS Coordination Portal dashboard mockup
│   ├── analytics_preview.jpg # Analytics platform preview
│   └── future_preview.jpg# Future projects banner
├── server.js             # Optional Express.js backend API
├── package.json          # Node.js project manifest
├── .env.example          # Environment variables template
└── README.md             # Project documentation
```
