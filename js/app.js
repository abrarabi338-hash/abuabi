/**
 * MOHAMMED ABRAR VK - MAIN PORTFOLIO CONTROLLER
 * Futuristic, production-quality portfolio logic with interactive data visualization,
 * journey animation, and comprehensive client-side administration.
 */

document.addEventListener('DOMContentLoaded', () => {
  // App State
  let currentSkillFilter = 'all';
  let skillSearchQuery = '';
  let currentDatasetKey = 'nss_activity';
  let currentTimeframe = 'month';
  let currentChartType = 'bar'; // 'bar' | 'line'
  let isAdminMode = false;
  let editingSkillId = null;
  let editingProjectId = null;

  // Initialize all modules
  initNavigation();
  initHeroProfile();
  initDataJourneyCanvas();
  renderSkills();
  renderProjects();
  initAnalyticsShowcase();
  initEducation();
  initContactForm();
  initAdminModal();
  initToasts();
});

/* ==========================================================================
   1. NAVIGATION & SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile hamburger toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      const expanded = navToggle.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section indicator using IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   2. HERO SECTION & PROFILE AVATAR MANAGEMENT
   ========================================================================== */
function initHeroProfile() {
  const profile = PortfolioStore.getProfile();
  const avatarUrl = PortfolioStore.getAvatar();

  // Populate hero text
  const heroNameEl = document.getElementById('hero-name');
  const heroTitleEl = document.getElementById('hero-title');
  const heroSummaryEl = document.getElementById('hero-summary');
  const avatarImgEl = document.getElementById('profile-avatar-img');

  if (heroNameEl) heroNameEl.textContent = profile.name;
  if (heroTitleEl) {
    heroTitleEl.innerHTML = `Aspiring Data Analyst <span class="divider-slash">|</span> Web Developer`;
  }
  if (heroSummaryEl) heroSummaryEl.textContent = profile.summary;
  if (avatarImgEl) avatarImgEl.src = avatarUrl;

  // Avatar file input handler (Upload own profile photo)
  const fileInput = document.getElementById('profile-image-input');
  const btnUpload = document.getElementById('btn-change-photo');
  const btnReset = document.getElementById('btn-reset-photo');

  if (btnUpload && fileInput) {
    btnUpload.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WebP).', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size should be less than 5MB.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target.result;
        PortfolioStore.saveAvatar(base64Url);
        if (avatarImgEl) avatarImgEl.src = base64Url;
        showToast('Profile image updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      PortfolioStore.resetAvatar();
      if (avatarImgEl) avatarImgEl.src = 'assets/abrar_profile.jpg';
      showToast('Profile photo restored to default.', 'success');
    });
  }
}

/* ==========================================================================
   3. DATA JOURNEY ANIMATED VISUALIZATION (CANVAS + NODES)
   DATA ➔ ANALYSIS ➔ INSIGHT
   ========================================================================== */
function initDataJourneyCanvas() {
  const canvas = document.getElementById('journey-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let particles = [];
  const particleCount = 45;

  // High-DPI Canvas sizing
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    initParticles();
  }

  // Stages coordinates across the canvas
  function getStagePositions() {
    return [
      { x: width * 0.16, y: height * 0.5, name: 'DATA', color: '#00f2fe' },
      { x: width * 0.50, y: height * 0.5, name: 'ANALYSIS', color: '#818cf8' },
      { x: width * 0.84, y: height * 0.5, name: 'INSIGHT', color: '#10b981' }
    ];
  }

  // Particle Class
  class JourneyParticle {
    constructor() {
      this.reset();
      this.progress = Math.random(); // Start somewhere along path
    }

    reset() {
      this.progress = 0;
      this.speed = 0.003 + Math.random() * 0.004;
      this.yOffset = (Math.random() - 0.5) * 36;
      this.size = 1.8 + Math.random() * 2.2;
      this.stage = Math.random() < 0.5 ? 0 : 1; // 0: DATA->ANALYSIS, 1: ANALYSIS->INSIGHT
      this.pulse = Math.random() * Math.PI;
    }

    update() {
      this.progress += this.speed;
      this.pulse += 0.05;
      if (this.progress >= 1) {
        if (this.stage === 0) {
          this.stage = 1;
          this.progress = 0;
        } else {
          this.reset();
        }
      }
    }

    draw(stages) {
      const p0 = stages[this.stage];
      const p1 = stages[this.stage + 1];

      // Interpolate along curved Bezier conduit
      const t = this.progress;
      const cpX = (p0.x + p1.x) / 2;
      const cpY = (p0.y + p1.y) / 2 + (this.stage === 0 ? -20 : 20);

      // Quadratic bezier point
      const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * cpX + t * t * p1.x;
      const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * cpY + t * t * p1.y + Math.sin(this.pulse) * 4 + this.yOffset * (1 - Math.abs(0.5 - t) * 2);

      // Particle color blending based on progress
      const color = this.stage === 0 ? 'rgba(0, 242, 254, ' : 'rgba(129, 140, 248, ';
      const alpha = Math.sin(t * Math.PI) * 0.85 + 0.15;

      ctx.beginPath();
      ctx.arc(x, y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${color}${alpha})`;
      ctx.shadowColor = this.stage === 0 ? '#00f2fe' : '#818cf8';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new JourneyParticle());
    }
  }

  // Animation Loop
  let pulseTimer = 0;
  function render() {
    ctx.clearRect(0, 0, width, height);
    const stages = getStagePositions();
    pulseTimer += 0.03;

    // Draw conduit pathways (fine lines with subtle gradient)
    for (let i = 0; i < 2; i++) {
      const p0 = stages[i];
      const p1 = stages[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      const cpY = (p0.y + p1.y) / 2 + (i === 0 ? -20 : 20);

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.quadraticCurveTo(cpX, cpY, p1.x, p1.y);
      ctx.strokeStyle = i === 0 ? 'rgba(0, 242, 254, 0.2)' : 'rgba(129, 140, 248, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Update and draw flowing particles
    particles.forEach(p => {
      p.update();
      p.draw(stages);
    });

    // Draw Stage Nodes
    stages.forEach((node, idx) => {
      const pulseSize = Math.sin(pulseTimer + idx * 1.5) * 3;

      // Outer glow circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 24 + pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = `${node.color}15`;
      ctx.fill();

      // Middle ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner core
      ctx.beginPath();
      ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Node Label
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y + 42);
    });

    // Check user reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  // Initialize
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  render();

  // Interactive Stage Cards Sync
  const journeyCards = document.querySelectorAll('.journey-card');
  journeyCards.forEach((card, idx) => {
    card.addEventListener('mouseenter', () => {
      journeyCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
}

/* ==========================================================================
   4. SKILLS & TECHNOLOGIES RENDERING & FILTERING
   ========================================================================== */
const SKILL_ICONS = {
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
  table: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  cpu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  'pie-chart': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>`,
  layout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,
  palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>`,
  terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
  atom: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)"></ellipse></svg>`,
  server: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
  'hard-drive': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line></svg>`,
  box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
  'git-branch': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>`
};

function renderSkills() {
  const allSkills = PortfolioStore.getSkills();
  const filterTabs = document.querySelectorAll('.filter-tab');
  const searchInput = document.getElementById('skills-search-input');
  const analyticsGrid = document.getElementById('grid-data-analytics');
  const webGrid = document.getElementById('grid-web-development');
  const countAnalytics = document.getElementById('count-data-analytics');
  const countWeb = document.getElementById('count-web-dev');
  const blockAnalytics = document.getElementById('block-data-analytics');
  const blockWeb = document.getElementById('block-web-dev');

  if (!analyticsGrid || !webGrid) return;

  // Filter skills based on search and active tab
  const filterFn = (skill) => {
    const matchesSearch = !skillSearchQuery || 
      skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) || 
      skill.description.toLowerCase().includes(skillSearchQuery.toLowerCase());
    return matchesSearch;
  };

  const analyticsSkills = allSkills.filter(s => s.category === 'data-analytics' && filterFn(s));
  const webSkills = allSkills.filter(s => s.category === 'web-development' && filterFn(s));

  if (countAnalytics) countAnalytics.textContent = `${analyticsSkills.length} Technologies`;
  if (countWeb) countWeb.textContent = `${webSkills.length} Technologies`;

  // Visibility based on filter tab
  if (currentSkillFilter === 'data-analytics') {
    if (blockAnalytics) blockAnalytics.style.display = 'block';
    if (blockWeb) blockWeb.style.display = 'none';
  } else if (currentSkillFilter === 'web-development') {
    if (blockAnalytics) blockAnalytics.style.display = 'none';
    if (blockWeb) blockWeb.style.display = 'block';
  } else {
    if (blockAnalytics) blockAnalytics.style.display = 'block';
    if (blockWeb) blockWeb.style.display = 'block';
  }

  // Render Card HTML
  function createSkillCardHTML(skill) {
    const iconSVG = SKILL_ICONS[skill.icon] || SKILL_ICONS.code;
    const catLabel = skill.category === 'data-analytics' ? 'Data Analytics' : 'Web Dev';

    return `
      <div class="skill-card" data-id="${skill.id}">
        <div class="skill-card-top">
          <div class="skill-icon-box" title="${skill.name}">
            ${iconSVG}
          </div>
          <span class="skill-cat-pill">${catLabel}</span>
        </div>
        <h4 class="skill-name">${skill.name}</h4>
        <p class="skill-desc">${skill.description}</p>
        <div class="skill-item-actions">
          <button class="skill-act-btn" onclick="openEditSkillModal('${skill.id}')">Edit</button>
          <button class="skill-act-btn btn-del" onclick="handleDeleteSkill('${skill.id}')">Delete</button>
          <button class="skill-act-btn" onclick="handleMoveSkill('${skill.id}', -1)" title="Move Up">↑</button>
          <button class="skill-act-btn" onclick="handleMoveSkill('${skill.id}', 1)" title="Move Down">↓</button>
        </div>
      </div>
    `;
  }

  analyticsGrid.innerHTML = analyticsSkills.map(createSkillCardHTML).join('') || `<p class="text-muted" style="grid-column: 1/-1; padding: 20px 0;">No matching analytics skills found.</p>`;
  webGrid.innerHTML = webSkills.map(createSkillCardHTML).join('') || `<p class="text-muted" style="grid-column: 1/-1; padding: 20px 0;">No matching web skills found.</p>`;

  // Filter tabs click handlers
  filterTabs.forEach(tab => {
    tab.onclick = () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentSkillFilter = tab.getAttribute('data-filter');
      renderSkills();
    };
  });

  // Search input handler
  if (searchInput && !searchInput.dataset.initialized) {
    searchInput.dataset.initialized = 'true';
    searchInput.addEventListener('input', (e) => {
      skillSearchQuery = e.target.value.trim();
      renderSkills();
    });
  }
}

/* ==========================================================================
   5. FEATURED PROJECTS RENDERING
   ========================================================================== */
function renderProjects() {
  const projects = PortfolioStore.getProjects();
  const container = document.getElementById('projects-container');
  if (!container) return;

  container.innerHTML = projects.map(proj => {
    const isCompleted = proj.status === 'Completed';
    const statusClass = isCompleted ? 'status-completed' : 'status-coming-soon';
    const statusBadge = proj.statusBadge || proj.status;

    // Tech tags
    const tagsHTML = (proj.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('');

    // Feature items
    const featuresHTML = (proj.features || []).map(f => `
      <li class="feature-item">
        <svg class="feature-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${f}</span>
      </li>
    `).join('');

    // Role modules (Admin, Coordinator, User) for Project 1 or custom projects
    let roleModulesHTML = '';
    if (proj.roleModules) {
      roleModulesHTML = `
        <div class="role-modules-container" id="role-modules-${proj.id}">
          <div class="role-modules-title">
            <span>Role-Based Access Modules</span>
            <span class="mono" style="font-size: 0.7rem; color: var(--cyan-light);">3 Distinct Portals</span>
          </div>
          <div class="role-tabs-bar">
            <button class="role-tab-btn active" onclick="switchRoleTab('${proj.id}', 'admin', this)">Admin</button>
            <button class="role-tab-btn" onclick="switchRoleTab('${proj.id}', 'coordinator', this)">Coordinator</button>
            <button class="role-tab-btn" onclick="switchRoleTab('${proj.id}', 'user', this)">User</button>
          </div>
          <div class="role-panel-content" id="role-content-${proj.id}">
            ${proj.roleModules.admin}
          </div>
        </div>
      `;
    }

    // Action buttons: If URLs empty, render disabled buttons per user prompt requirements!
    const githubBtn = proj.githubUrl && proj.githubUrl.trim() !== ''
      ? `<a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
           GitHub Repo
         </a>`
      : `<button class="btn btn-secondary btn-sm btn-disabled" disabled title="GitHub link will be added upon public release">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
           GitHub (Coming Soon)
         </button>`;

    const liveBtn = proj.liveUrl && proj.liveUrl.trim() !== ''
      ? `<a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
           Live Demo
         </a>`
      : `<button class="btn btn-primary btn-sm btn-disabled" disabled title="Live deployment link will be active soon">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
           Live Project (Coming Soon)
         </button>`;

    return `
      <article class="project-card ${!isCompleted ? 'project-card-placeholder' : ''}" id="${proj.id}">
        <div class="project-media-col">
          <img src="${proj.image}" alt="${proj.title} Preview" class="project-image" loading="lazy">
          <div class="project-status-overlay">
            <span class="status-badge ${statusClass}">${statusBadge}</span>
            <span class="category-pill-badge">${proj.category}</span>
          </div>
        </div>

        <div class="project-content-col">
          <div class="project-header-row">
            <h3 class="project-title">${proj.title}</h3>
          </div>

          <div class="project-tech-tags">
            ${tagsHTML}
          </div>

          <p class="project-desc">${proj.description}</p>

          <ul class="project-features-list">
            ${featuresHTML}
          </ul>

          ${roleModulesHTML}

          <div class="project-actions">
            ${githubBtn}
            ${liveBtn}
            <button class="btn btn-outline-cyan btn-sm" onclick="openEditProjectModal('${proj.id}')" style="display: ${isAdminMode ? 'inline-flex' : 'none'};">
              Edit Project
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Global switch for Role-based Module Tabs
window.switchRoleTab = function(projId, roleKey, btnEl) {
  const projects = PortfolioStore.getProjects();
  const proj = projects.find(p => p.id === projId);
  if (!proj || !proj.roleModules) return;

  const container = document.getElementById(`role-modules-${projId}`);
  if (container) {
    const tabs = container.querySelectorAll('.role-tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    btnEl.classList.add('active');
  }

  const contentEl = document.getElementById(`role-content-${projId}`);
  if (contentEl) {
    contentEl.textContent = proj.roleModules[roleKey] || '';
  }
};

/* ==========================================================================
   6. DATA ANALYTICS SHOWCASE (INTERACTIVE ENGINE & CANVASES)
   ========================================================================== */
function initAnalyticsShowcase() {
  const datasetSelect = document.getElementById('analytics-dataset-select');
  const timeframeBtns = document.querySelectorAll('.time-btn');
  const chartToggleBtns = document.querySelectorAll('.chart-toggle-btn');

  if (datasetSelect) {
    datasetSelect.addEventListener('change', (e) => {
      currentDatasetKey = e.target.value;
      updateAnalyticsDashboard();
    });
  }

  timeframeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeframeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTimeframe = btn.getAttribute('data-timeframe');
      updateAnalyticsDashboard();
    });
  });

  chartToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chartToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentChartType = btn.getAttribute('data-type');
      renderAnalyticsChart();
    });
  });

  updateAnalyticsDashboard();
  window.addEventListener('resize', () => renderAnalyticsChart());
}

function updateAnalyticsDashboard() {
  const dataset = ANALYTICS_DATASETS[currentDatasetKey];
  if (!dataset) return;

  const tfData = dataset.timeframes[currentTimeframe];
  if (!tfData) return;

  // Update KPI card metrics
  const kpiTotal = document.getElementById('kpi-total-val');
  const kpiAvg = document.getElementById('kpi-avg-val');
  const kpiClean = document.getElementById('kpi-clean-val');
  const kpiTrend = document.getElementById('kpi-trend-val');

  if (kpiTotal) kpiTotal.textContent = tfData.kpis.total;
  if (kpiAvg) kpiAvg.textContent = tfData.kpis.avg;
  if (kpiClean) kpiClean.textContent = tfData.kpis.cleanRate;
  if (kpiTrend) kpiTrend.textContent = tfData.kpis.trend;

  // Update Insights list
  const insightsList = document.getElementById('analytics-insights-list');
  if (insightsList && tfData.insights) {
    insightsList.innerHTML = tfData.insights.map((ins, i) => `
      <li class="insight-item">
        <strong>Insight 0${i + 1}</strong>
        ${ins}
      </li>
    `).join('');
  }

  // Render Chart Canvas
  renderAnalyticsChart();
}

// Standalone, high-fidelity responsive Canvas Chart Renderer
function renderAnalyticsChart() {
  const canvas = document.getElementById('analytics-chart-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const w = rect.width;
  const h = rect.height;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const dataset = ANALYTICS_DATASETS[currentDatasetKey];
  const tfData = dataset.timeframes[currentTimeframe];
  const labels = tfData.labels;
  const values = tfData.data;
  const maxVal = Math.max(...values) * 1.25;

  const padding = { top: 30, right: 30, bottom: 45, left: 50 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  // Draw Horizontal Gridlines
  const gridLines = 4;
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'right';

  for (let i = 0; i <= gridLines; i++) {
    const yVal = Math.round((maxVal / gridLines) * i);
    const y = padding.top + chartH - (chartH / gridLines) * i;

    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillText(`${yVal}`, padding.left - 10, y + 4);
  }

  // Draw X Axis Labels
  ctx.textAlign = 'center';
  const step = chartW / labels.length;

  if (currentChartType === 'bar') {
    // Render Bars
    const barWidth = Math.min(step * 0.55, 48);

    values.forEach((val, i) => {
      const x = padding.left + step * i + (step - barWidth) / 2;
      const barH = (val / maxVal) * chartH;
      const y = padding.top + chartH - barH;

      // Gradient bar fill
      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, '#00f2fe');
      grad.addColorStop(1, '#6366f1');

      // Rounded Top Bar
      ctx.beginPath();
      const radius = 6;
      ctx.moveTo(x, y + barH);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
      ctx.lineTo(x + barWidth, y + barH);
      ctx.closePath();

      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(0, 242, 254, 0.25)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Bar Value on top
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillText(val, x + barWidth / 2, y - 8);

      // Label below
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(labels[i], x + barWidth / 2, h - padding.bottom + 22);
    });
  } else {
    // Render Smooth Trend Line
    const points = values.map((val, i) => {
      const x = padding.left + step * i + step / 2;
      const y = padding.top + chartH - (val / maxVal) * chartH;
      return { x, y, val, label: labels[i] };
    });

    // Area Fill Gradient below line
    const areaGrad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    areaGrad.addColorStop(0, 'rgba(0, 242, 254, 0.3)');
    areaGrad.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartH);
    ctx.lineTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const pCurrent = points[i];
      const pNext = points[i + 1];
      const cpX = (pCurrent.x + pNext.x) / 2;
      ctx.bezierCurveTo(cpX, pCurrent.y, cpX, pNext.y, pNext.x, pNext.y);
    }

    ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Line Path
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const pCurrent = points[i];
      const pNext = points[i + 1];
      const cpX = (pCurrent.x + pNext.x) / 2;
      ctx.bezierCurveTo(cpX, pCurrent.y, cpX, pNext.y, pNext.x, pNext.y);
    }
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Dots and Data values
    points.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2.5;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillText(pt.val, pt.x, pt.y - 12);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(pt.label, pt.x, h - padding.bottom + 22);
    });
  }
}

/* ==========================================================================
   7. EDUCATION & CONTACT SECTION
   ========================================================================== */
function initEducation() {
  const profile = PortfolioStore.getProfile();
  const eduDegree = document.getElementById('edu-degree');
  const eduCollege = document.getElementById('edu-college');
  const eduUniversity = document.getElementById('edu-university');
  const eduYear = document.getElementById('edu-year');
  const eduLocation = document.getElementById('edu-location');

  if (eduDegree) eduDegree.textContent = profile.education;
  if (eduCollege) eduCollege.textContent = profile.college;
  if (eduUniversity) eduUniversity.textContent = `Affiliated with ${profile.university}`;
  if (eduYear) eduYear.textContent = `Graduation Year: ${profile.graduationYear}`;
  if (eduLocation) eduLocation.textContent = profile.location;
}

function initContactForm() {
  const profile = PortfolioStore.getProfile();
  const contactEmailVal = document.getElementById('contact-email-val');
  const contactLocationVal = document.getElementById('contact-location-val');
  const contactLinkedinLink = document.getElementById('contact-linkedin-link');
  const contactForm = document.getElementById('contact-form');
  const btnCopyEmail = document.getElementById('btn-copy-email');

  if (contactEmailVal) contactEmailVal.textContent = profile.email;
  if (contactLocationVal) contactLocationVal.textContent = profile.location;
  if (contactLinkedinLink && profile.linkedinUrl) contactLinkedinLink.href = profile.linkedinUrl;

  // Copy email to clipboard
  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      navigator.clipboard.writeText(profile.email).then(() => {
        showToast('Email address copied to clipboard!', 'success');
      }).catch(() => {
        showToast(`Email: ${profile.email}`, 'info');
      });
    });
  }

  // Handle contact form submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      // Friendly simulated delivery confirmation + mailto fallback option
      const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      
      showToast(`Thank you, ${name}! Opening mail client to send your message directly to Mohammed Abrar VK...`, 'success');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 1000);
      contactForm.reset();
    });
  }
}

/* ==========================================================================
   8. ADMIN MANAGEMENT MODAL & CRUD
   Allows editing Skills, Projects, and Profile settings with localStorage sync
   ========================================================================== */
function initAdminModal() {
  const modal = document.getElementById('admin-modal');
  const btnOpenModal = document.getElementById('btn-admin-modal');
  const btnFab = document.getElementById('fab-admin-trigger');
  const btnCloseModal = document.getElementById('btn-modal-close');
  const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
  const adminPanes = document.querySelectorAll('.admin-modal-container .tab-pane');

  function openModal(tabName = 'skills') {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    switchAdminTab(tabName);
    loadAdminSkillsTable();
    loadAdminProjectsTable();
    loadAdminProfileForm();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (btnOpenModal) btnOpenModal.addEventListener('click', () => openModal('skills'));
  if (btnFab) btnFab.addEventListener('click', () => openModal('skills'));
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);

  // Close when clicking modal backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Keyboard shortcut Ctrl+Shift+E
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      modal.classList.contains('open') ? closeModal() : openModal();
    } else if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Admin Tab Switching
  function switchAdminTab(targetTab) {
    adminTabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    adminPanes.forEach(pane => {
      if (pane.id === `tab-${targetTab}`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  }

  adminTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      switchAdminTab(target);
    });
  });

  // Skill Admin Form Submission
  const skillForm = document.getElementById('admin-skill-form');
  if (skillForm) {
    skillForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('skill-input-name').value.trim();
      const category = document.getElementById('skill-input-category').value;
      const description = document.getElementById('skill-input-desc').value.trim();
      const icon = document.getElementById('skill-input-icon').value;

      if (!name || !description) {
        showToast('Please enter skill name and description.', 'error');
        return;
      }

      let skills = PortfolioStore.getSkills();

      if (editingSkillId) {
        // Edit existing
        skills = skills.map(s => s.id === editingSkillId ? { ...s, name, category, description, icon } : s);
        editingSkillId = null;
        document.getElementById('skill-form-submit-btn').textContent = 'Add Skill';
        showToast(`Skill "${name}" updated!`, 'success');
      } else {
        // Add new
        const newSkill = {
          id: `skill-${Date.now()}`,
          name,
          category,
          description,
          icon
        };
        skills.push(newSkill);
        showToast(`Skill "${name}" added!`, 'success');
      }

      PortfolioStore.saveSkills(skills);
      skillForm.reset();
      loadAdminSkillsTable();
      renderSkills();
    });
  }

  // Project Admin Form Submission
  const projectForm = document.getElementById('admin-project-form');
  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('proj-input-title').value.trim();
      const category = document.getElementById('proj-input-category').value.trim();
      const status = document.getElementById('proj-input-status').value;
      const techStr = document.getElementById('proj-input-tech').value.trim();
      const desc = document.getElementById('proj-input-desc').value.trim();
      const githubUrl = document.getElementById('proj-input-github').value.trim();
      const liveUrl = document.getElementById('proj-input-live').value.trim();
      const image = document.getElementById('proj-input-image').value.trim() || 'assets/nss_preview.jpg';

      if (!title || !desc) {
        showToast('Please fill in project title and description.', 'error');
        return;
      }

      let projects = PortfolioStore.getProjects();
      const technologies = techStr.split(',').map(t => t.trim()).filter(Boolean);

      if (editingProjectId) {
        projects = projects.map(p => {
          if (p.id === editingProjectId) {
            return {
              ...p,
              title,
              category,
              status,
              statusBadge: status,
              technologies,
              description: desc,
              githubUrl,
              liveUrl,
              image
            };
          }
          return p;
        });
        editingProjectId = null;
        document.getElementById('proj-form-submit-btn').textContent = 'Add Project';
        showToast(`Project "${title}" updated!`, 'success');
      } else {
        const newProj = {
          id: `proj-${Date.now()}`,
          title,
          category,
          status,
          statusBadge: status,
          technologies,
          description: desc,
          features: ['Modern responsive UI', 'Structured workflows'],
          roleModules: null,
          githubUrl,
          liveUrl,
          image
        };
        projects.push(newProj);
        showToast(`Project "${title}" added!`, 'success');
      }

      PortfolioStore.saveProjects(projects);
      projectForm.reset();
      loadAdminProjectsTable();
      renderProjects();
    });
  }

  // Profile Form Submission
  const profileForm = document.getElementById('admin-profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const current = PortfolioStore.getProfile();
      const updated = {
        ...current,
        name: document.getElementById('profile-input-name').value.trim(),
        title: document.getElementById('profile-input-title').value.trim(),
        summary: document.getElementById('profile-input-summary').value.trim(),
        college: document.getElementById('profile-input-college').value.trim(),
        university: document.getElementById('profile-input-university').value.trim(),
        graduationYear: document.getElementById('profile-input-year').value.trim(),
        location: document.getElementById('profile-input-location').value.trim(),
        email: document.getElementById('profile-input-email').value.trim(),
        linkedinUrl: document.getElementById('profile-input-linkedin').value.trim(),
        githubUrl: document.getElementById('profile-input-github').value.trim()
      };

      PortfolioStore.saveProfile(updated);
      showToast('Profile information saved!', 'success');
      initHeroProfile();
      initEducation();
      initContactForm();
    });
  }

  // Backup & Reset handlers
  const btnExport = document.getElementById('btn-export-backup');
  const btnImport = document.getElementById('btn-import-backup');
  const inputImportFile = document.getElementById('input-import-file');
  const btnResetDefaults = document.getElementById('btn-reset-defaults');

  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const jsonStr = PortfolioStore.exportJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mohammed_abrar_vk_portfolio_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Portfolio data exported successfully!', 'success');
    });
  }

  if (btnImport && inputImportFile) {
    btnImport.addEventListener('click', () => inputImportFile.click());
    inputImportFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          PortfolioStore.importJSON(event.target.result);
          showToast('Data imported successfully! Refreshing portfolio...', 'success');
          setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
          showToast('Invalid JSON backup file.', 'error');
        }
      };
      reader.readAsText(file);
    });
  }

  if (btnResetDefaults) {
    btnResetDefaults.addEventListener('click', () => {
      if (confirm('Are you sure you want to restore all portfolio data to factory default?')) {
        PortfolioStore.resetAllToDefault();
        showToast('Reset to defaults complete. Reloading...', 'info');
        setTimeout(() => window.location.reload(), 800);
      }
    });
  }
}

// Admin Table Loaders
function loadAdminSkillsTable() {
  const skills = PortfolioStore.getSkills();
  const listEl = document.getElementById('admin-skills-list');
  if (!listEl) return;

  listEl.innerHTML = skills.map((s, idx) => `
    <div class="admin-item-row">
      <div class="admin-item-info">
        <span class="admin-item-name">${s.name}</span>
        <span class="admin-item-badge">${s.category === 'data-analytics' ? 'Data Analytics' : 'Web Dev'}</span>
      </div>
      <div class="admin-row-actions">
        <button class="admin-btn-action" onclick="openEditSkillModal('${s.id}')">Edit</button>
        <button class="admin-btn-action del" onclick="handleDeleteSkill('${s.id}')">Delete</button>
        <button class="admin-btn-action" onclick="handleMoveSkill('${s.id}', -1)" ${idx === 0 ? 'disabled' : ''}>↑</button>
        <button class="admin-btn-action" onclick="handleMoveSkill('${s.id}', 1)" ${idx === skills.length - 1 ? 'disabled' : ''}>↓</button>
      </div>
    </div>
  `).join('');
}

function loadAdminProjectsTable() {
  const projects = PortfolioStore.getProjects();
  const listEl = document.getElementById('admin-projects-list');
  if (!listEl) return;

  listEl.innerHTML = projects.map((p, idx) => `
    <div class="admin-item-row">
      <div class="admin-item-info">
        <span class="admin-item-name">${p.title}</span>
        <span class="admin-item-badge">${p.category}</span>
        <span class="admin-item-badge" style="color: ${p.status === 'Completed' ? 'var(--emerald-accent)' : 'var(--violet-primary)'}">${p.status}</span>
      </div>
      <div class="admin-row-actions">
        <button class="admin-btn-action" onclick="openEditProjectModal('${p.id}')">Edit</button>
        <button class="admin-btn-action del" onclick="handleDeleteProject('${p.id}')">Delete</button>
        <button class="admin-btn-action" onclick="handleMoveProject('${p.id}', -1)" ${idx === 0 ? 'disabled' : ''}>↑</button>
        <button class="admin-btn-action" onclick="handleMoveProject('${p.id}', 1)" ${idx === projects.length - 1 ? 'disabled' : ''}>↓</button>
      </div>
    </div>
  `).join('');
}

function loadAdminProfileForm() {
  const profile = PortfolioStore.getProfile();
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('profile-input-name', profile.name);
  setVal('profile-input-title', profile.title);
  setVal('profile-input-summary', profile.summary);
  setVal('profile-input-college', profile.college);
  setVal('profile-input-university', profile.university);
  setVal('profile-input-year', profile.graduationYear);
  setVal('profile-input-location', profile.location);
  setVal('profile-input-email', profile.email);
  setVal('profile-input-linkedin', profile.linkedinUrl);
  setVal('profile-input-github', profile.githubUrl);
}

// Global CRUD helpers
window.handleDeleteSkill = function(id) {
  if (!confirm('Are you sure you want to delete this skill?')) return;
  let skills = PortfolioStore.getSkills();
  skills = skills.filter(s => s.id !== id);
  PortfolioStore.saveSkills(skills);
  loadAdminSkillsTable();
  renderSkills();
  showToast('Skill deleted.', 'info');
};

window.handleMoveSkill = function(id, direction) {
  let skills = PortfolioStore.getSkills();
  const idx = skills.findIndex(s => s.id === id);
  if (idx < 0) return;
  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= skills.length) return;

  const temp = skills[idx];
  skills[idx] = skills[targetIdx];
  skills[targetIdx] = temp;

  PortfolioStore.saveSkills(skills);
  loadAdminSkillsTable();
  renderSkills();
};

window.openEditSkillModal = function(id) {
  const skills = PortfolioStore.getSkills();
  const skill = skills.find(s => s.id === id);
  if (!skill) return;

  editingSkillId = id;
  document.getElementById('skill-input-name').value = skill.name;
  document.getElementById('skill-input-category').value = skill.category;
  document.getElementById('skill-input-desc').value = skill.description;
  document.getElementById('skill-input-icon').value = skill.icon;
  document.getElementById('skill-form-submit-btn').textContent = 'Update Skill';

  // Open modal on skills tab
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.add('open');
  const skillTabBtn = document.querySelector('.admin-tab-btn[data-tab="skills"]');
  if (skillTabBtn) skillTabBtn.click();
  document.getElementById('skill-input-name').focus();
};

window.handleDeleteProject = function(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  let projects = PortfolioStore.getProjects();
  projects = projects.filter(p => p.id !== id);
  PortfolioStore.saveProjects(projects);
  loadAdminProjectsTable();
  renderProjects();
  showToast('Project deleted.', 'info');
};

window.handleMoveProject = function(id, direction) {
  let projects = PortfolioStore.getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx < 0) return;
  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= projects.length) return;

  const temp = projects[idx];
  projects[idx] = projects[targetIdx];
  projects[targetIdx] = temp;

  PortfolioStore.saveProjects(projects);
  loadAdminProjectsTable();
  renderProjects();
};

window.openEditProjectModal = function(id) {
  const projects = PortfolioStore.getProjects();
  const proj = projects.find(p => p.id === id);
  if (!proj) return;

  editingProjectId = id;
  document.getElementById('proj-input-title').value = proj.title;
  document.getElementById('proj-input-category').value = proj.category;
  document.getElementById('proj-input-status').value = proj.status;
  document.getElementById('proj-input-tech').value = (proj.technologies || []).join(', ');
  document.getElementById('proj-input-desc').value = proj.description;
  document.getElementById('proj-input-github').value = proj.githubUrl || '';
  document.getElementById('proj-input-live').value = proj.liveUrl || '';
  document.getElementById('proj-input-image').value = proj.image || '';
  document.getElementById('proj-form-submit-btn').textContent = 'Update Project';

  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.add('open');
  const projTabBtn = document.querySelector('.admin-tab-btn[data-tab="projects"]');
  if (projTabBtn) projTabBtn.click();
  document.getElementById('proj-input-title').focus();
};

/* ==========================================================================
   9. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function initToasts() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconSVG = type === 'success'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `${iconSVG}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
