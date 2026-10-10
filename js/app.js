/**
 * MOHAMMED ABRAR VK - PORTFOLIO CONTROLLER
 * Futuristic, production-quality portfolio logic with interactive data visualization,
 * journey animation, currently learning topics, education timeline, and protected private admin panel.
 */

document.addEventListener('DOMContentLoaded', () => {
  // App State
  let currentSkillFilter = 'all';
  let skillSearchQuery = '';
  let currentDatasetKey = 'nss_activity';
  let currentTimeframe = 'month';
  let currentChartType = 'bar'; // 'bar' | 'line'

  // Admin Editing State
  let editingSkillId = null;
  let editingProjectId = null;
  let editingEducationId = null;
  let editingLearningId = null;

  // Initialize all modules
  initNavigation();
  initAdminAuth();
  initHeroProfile();
  initDataJourneyCanvas();
  renderSkills();
  renderProjects();
  initAnalyticsShowcase();
  renderEducation();
  renderLearning();
  initContactSection();
  initAdminModal();
  initToasts();
});

/* ==========================================================================
   1. NAVIGATION & AUTH STATUS
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      const expanded = navToggle.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section indicator
  const sections = document.querySelectorAll('section[id]');
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
  }, { threshold: 0.25 });

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   2. PRIVATE ADMIN AUTHENTICATION (LOGIN / LOGOUT)
   Protects editing controls from normal visitors
   ========================================================================== */
function initAdminAuth() {
  const isAuth = PortfolioStore.isAdminAuthenticated();
  updateAuthUI(isAuth);

  const btnLoginNav = document.getElementById('btn-nav-admin-login');
  const btnLoginFooter = document.getElementById('btn-footer-admin-login');
  const loginModal = document.getElementById('admin-login-modal');
  const btnCloseLogin = document.getElementById('btn-close-login');
  const loginForm = document.getElementById('admin-login-form');
  const btnLogout = document.getElementById('btn-admin-logout');

  function openLoginModal() {
    if (PortfolioStore.isAdminAuthenticated()) {
      openAdminModal('profile');
      return;
    }
    if (loginModal) {
      loginModal.classList.add('open');
      const passInput = document.getElementById('admin-passkey-input');
      if (passInput) {
        passInput.value = '';
        passInput.focus();
      }
    }
  }

  function closeLoginModal() {
    if (loginModal) loginModal.classList.remove('open');
  }

  if (btnLoginNav) btnLoginNav.addEventListener('click', openLoginModal);
  if (btnLoginFooter) btnLoginFooter.addEventListener('click', openLoginModal);
  if (btnCloseLogin) btnCloseLogin.addEventListener('click', closeLoginModal);

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = document.getElementById('admin-passkey-input').value.trim();
      const correct = PortfolioStore.getAdminPasskey();

      if (entered === correct) {
        PortfolioStore.setAdminAuthenticated(true);
        updateAuthUI(true);
        closeLoginModal();
        showToast('Admin access verified. Welcome Mohammed Abrar VK!', 'success');
        openAdminModal('profile');
      } else {
        showToast('Invalid admin passkey. Please check your credentials.', 'error');
        const passInput = document.getElementById('admin-passkey-input');
        if (passInput) {
          passInput.style.borderColor = 'var(--rose-accent)';
          passInput.focus();
        }
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      PortfolioStore.setAdminAuthenticated(false);
      updateAuthUI(false);
      const adminModal = document.getElementById('admin-modal');
      if (adminModal) adminModal.classList.remove('open');
      showToast('Logged out of admin mode.', 'info');
    });
  }

  // Keyboard shortcut Ctrl+Shift+L to trigger admin login
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      if (PortfolioStore.isAdminAuthenticated()) {
        openAdminModal('profile');
      } else {
        openLoginModal();
      }
    }
  });
}

function updateAuthUI(isAuthenticated) {
  if (isAuthenticated) {
    document.body.classList.add('admin-authenticated');
  } else {
    document.body.classList.remove('admin-authenticated');
  }
}

/* ==========================================================================
   3. HERO PROFILE & IMAGE MANAGEMENT
   ========================================================================== */
function initHeroProfile() {
  const profile = PortfolioStore.getProfile();
  const avatarUrl = PortfolioStore.getAvatar();

  const heroNameEl = document.getElementById('hero-name');
  const heroTitleEl = document.getElementById('hero-title');
  const heroSummaryEl = document.getElementById('hero-summary');
  const avatarImgEl = document.getElementById('profile-avatar-img');
  const avatarPlaceholderBox = document.getElementById('avatar-placeholder-box');

  if (heroNameEl) heroNameEl.textContent = profile.name;
  if (heroTitleEl) {
    heroTitleEl.innerHTML = `Aspiring Data Analyst <span class="divider-slash">|</span> Web Developer`;
  }
  if (heroSummaryEl) heroSummaryEl.textContent = profile.summary;

  // Avatar Image display
  if (avatarUrl) {
    if (avatarImgEl) {
      avatarImgEl.src = avatarUrl;
      avatarImgEl.style.display = 'block';
    }
    if (avatarPlaceholderBox) avatarPlaceholderBox.style.display = 'none';
  } else {
    if (avatarImgEl) avatarImgEl.style.display = 'none';
    if (avatarPlaceholderBox) avatarPlaceholderBox.style.display = 'flex';
  }

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
        if (avatarImgEl) {
          avatarImgEl.src = base64Url;
          avatarImgEl.style.display = 'block';
        }
        if (avatarPlaceholderBox) avatarPlaceholderBox.style.display = 'none';
        showToast('Profile image updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      PortfolioStore.resetAvatar();
      if (avatarImgEl) {
        avatarImgEl.src = 'assets/abrar_profile.jpg';
        avatarImgEl.style.display = 'block';
      }
      if (avatarPlaceholderBox) avatarPlaceholderBox.style.display = 'none';
      showToast('Profile photo restored to default.', 'success');
    });
  }
}

/* ==========================================================================
   4. DATA JOURNEY ANIMATED VISUALIZATION (CANVAS)
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

  function getStagePositions() {
    return [
      { x: width * 0.16, y: height * 0.5, name: 'DATA', color: '#00f2fe' },
      { x: width * 0.50, y: height * 0.5, name: 'ANALYSIS', color: '#818cf8' },
      { x: width * 0.84, y: height * 0.5, name: 'INSIGHT', color: '#10b981' }
    ];
  }

  class JourneyParticle {
    constructor() {
      this.reset();
      this.progress = Math.random();
    }

    reset() {
      this.progress = 0;
      this.speed = 0.003 + Math.random() * 0.004;
      this.yOffset = (Math.random() - 0.5) * 36;
      this.size = 1.8 + Math.random() * 2.2;
      this.stage = Math.random() < 0.5 ? 0 : 1;
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

      const t = this.progress;
      const cpX = (p0.x + p1.x) / 2;
      const cpY = (p0.y + p1.y) / 2 + (this.stage === 0 ? -20 : 20);

      const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * cpX + t * t * p1.x;
      const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * cpY + t * t * p1.y + Math.sin(this.pulse) * 4 + this.yOffset * (1 - Math.abs(0.5 - t) * 2);

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

  let pulseTimer = 0;
  function render() {
    ctx.clearRect(0, 0, width, height);
    const stages = getStagePositions();
    pulseTimer += 0.03;

    // Draw conduits
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

    particles.forEach(p => {
      p.update();
      p.draw(stages);
    });

    stages.forEach((node, idx) => {
      const pulseSize = Math.sin(pulseTimer + idx * 1.5) * 3;

      ctx.beginPath();
      ctx.arc(node.x, node.y, 24 + pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = `${node.color}15`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y + 42);
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  render();

  const journeyCards = document.querySelectorAll('.journey-card');
  journeyCards.forEach((card, idx) => {
    card.addEventListener('mouseenter', () => {
      journeyCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
}

/* ==========================================================================
   5. SKILLS & TECHNOLOGIES
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

  const filterFn = (skill) => {
    return !skillSearchQuery || 
      skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) || 
      skill.description.toLowerCase().includes(skillSearchQuery.toLowerCase());
  };

  const analyticsSkills = allSkills.filter(s => s.category === 'data-analytics' && filterFn(s));
  const webSkills = allSkills.filter(s => s.category === 'web-development' && filterFn(s));

  if (countAnalytics) countAnalytics.textContent = `${analyticsSkills.length} Technologies`;
  if (countWeb) countWeb.textContent = `${webSkills.length} Technologies`;

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
        <div class="card-admin-actions">
          <button class="card-act-btn" onclick="openEditSkillModal('${skill.id}')">Edit</button>
          <button class="card-act-btn del" onclick="handleDeleteSkill('${skill.id}')">Delete</button>
          <button class="card-act-btn" onclick="handleMoveSkill('${skill.id}', -1)" title="Move Up">↑</button>
          <button class="card-act-btn" onclick="handleMoveSkill('${skill.id}', 1)" title="Move Down">↓</button>
        </div>
      </div>
    `;
  }

  analyticsGrid.innerHTML = analyticsSkills.map(createSkillCardHTML).join('') || `<p class="text-muted" style="grid-column: 1/-1; padding: 20px 0;">No matching analytics skills found.</p>`;
  webGrid.innerHTML = webSkills.map(createSkillCardHTML).join('') || `<p class="text-muted" style="grid-column: 1/-1; padding: 20px 0;">No matching web skills found.</p>`;

  filterTabs.forEach(tab => {
    tab.onclick = () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentSkillFilter = tab.getAttribute('data-filter');
      renderSkills();
    };
  });

  if (searchInput && !searchInput.dataset.initialized) {
    searchInput.dataset.initialized = 'true';
    searchInput.addEventListener('input', (e) => {
      skillSearchQuery = e.target.value.trim();
      renderSkills();
    });
  }
}

/* ==========================================================================
   6. FEATURED PROJECTS
   ========================================================================== */
function renderProjects() {
  const projects = PortfolioStore.getProjects();
  const container = document.getElementById('projects-container');
  if (!container) return;

  container.innerHTML = projects.map(proj => {
    const isCompleted = proj.status === 'Completed';
    const statusClass = isCompleted ? 'status-completed' : 'status-coming-soon';
    const statusBadge = proj.statusBadge || proj.status;

    const tagsHTML = (proj.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('');

    const featuresHTML = (proj.features || []).map(f => `
      <li class="feature-item">
        <svg class="feature-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${f}</span>
      </li>
    `).join('');

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
            <div class="card-admin-actions" style="margin-top: 0; padding-top: 0; border-top: none;">
              <button class="card-act-btn" onclick="openEditProjectModal('${proj.id}')">Edit</button>
              <button class="card-act-btn del" onclick="handleDeleteProject('${proj.id}')">Delete</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

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
   7. DATA ANALYTICS SHOWCASE (EXPANDED DASHBOARD)
   Bar Chart + Line Chart + Donut Chart + KPI Cards + Small Data Table
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
      renderMainAnalyticsChart();
    });
  });

  updateAnalyticsDashboard();
  window.addEventListener('resize', () => {
    renderMainAnalyticsChart();
    renderDonutChart();
  });
}

function updateAnalyticsDashboard() {
  const dataset = ANALYTICS_DATASETS[currentDatasetKey];
  if (!dataset) return;

  const tfData = dataset.timeframes[currentTimeframe];
  if (!tfData) return;

  // KPI Metrics
  const kpiTotal = document.getElementById('kpi-total-val');
  const kpiAvg = document.getElementById('kpi-avg-val');
  const kpiClean = document.getElementById('kpi-clean-val');
  const kpiTrend = document.getElementById('kpi-trend-val');

  if (kpiTotal) kpiTotal.textContent = tfData.kpis.totalVolume;
  if (kpiAvg) kpiAvg.textContent = tfData.kpis.avgMetric;
  if (kpiClean) kpiClean.textContent = tfData.kpis.hygieneRate;
  if (kpiTrend) kpiTrend.textContent = tfData.kpis.trendRate;

  // Analytical Takeaways
  const insightsList = document.getElementById('analytics-insights-list');
  if (insightsList && tfData.insights) {
    insightsList.innerHTML = tfData.insights.map((ins, i) => `
      <li class="insight-item">
        <strong>Insight 0${i + 1}</strong>
        ${ins}
      </li>
    `).join('');
  }

  // Small Data Table
  const tableBody = document.getElementById('analytics-table-body');
  if (tableBody && tfData.sampleTable) {
    tableBody.innerHTML = tfData.sampleTable.map(row => `
      <tr>
        <td class="mono" style="color: var(--cyan-light); font-weight: 700;">${row.id}</td>
        <td style="font-weight: 600;">${row.event}</td>
        <td><span style="color: var(--text-secondary);">${row.category}</span></td>
        <td class="mono" style="color: #ffffff; font-weight: 600;">${row.metric}</td>
        <td><span class="table-badge">${row.status}</span></td>
      </tr>
    `).join('');
  }

  // Render Visuals
  renderMainAnalyticsChart();
  renderDonutChart();
}

// 1. Main Bar / Line Chart Renderer
function renderMainAnalyticsChart() {
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
  const values = currentChartType === 'bar' ? tfData.barData : tfData.lineData;
  const maxVal = Math.max(...values) * 1.25;

  const padding = { top: 25, right: 25, bottom: 40, left: 45 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  // Gridlines
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

  ctx.textAlign = 'center';
  const step = chartW / labels.length;

  if (currentChartType === 'bar') {
    const barWidth = Math.min(step * 0.55, 48);

    values.forEach((val, i) => {
      const x = padding.left + step * i + (step - barWidth) / 2;
      const barH = (val / maxVal) * chartH;
      const y = padding.top + chartH - barH;

      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, '#00f2fe');
      grad.addColorStop(1, '#6366f1');

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

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillText(val, x + barWidth / 2, y - 8);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(labels[i], x + barWidth / 2, h - padding.bottom + 22);
    });
  } else {
    // Trend Line
    const points = values.map((val, i) => {
      const x = padding.left + step * i + step / 2;
      const y = padding.top + chartH - (val / maxVal) * chartH;
      return { x, y, val, label: labels[i] };
    });

    const areaGrad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    areaGrad.addColorStop(0, 'rgba(0, 242, 254, 0.3)');
    areaGrad.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartH);
    ctx.lineTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const cpX = (points[i].x + points[i + 1].x) / 2;
      ctx.bezierCurveTo(cpX, points[i].y, cpX, points[i + 1].y, points[i + 1].x, points[i + 1].y);
    }

    ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const cpX = (points[i].x + points[i + 1].x) / 2;
      ctx.bezierCurveTo(cpX, points[i].y, cpX, points[i + 1].y, points[i + 1].x, points[i + 1].y);
    }
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

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

// 2. Donut Chart Renderer
function renderDonutChart() {
  const canvas = document.getElementById('analytics-donut-canvas');
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
  const donutData = tfData.donutData || [];

  const total = donutData.reduce((acc, curr) => acc + curr.value, 0);
  const centerX = w / 2;
  const centerY = h / 2 - 10;
  const outerRadius = Math.min(centerX, centerY) - 16;
  const innerRadius = outerRadius * 0.65;

  let currentAngle = -Math.PI / 2;

  donutData.forEach(slice => {
    const sliceAngle = (slice.value / total) * (Math.PI * 2);

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
    ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
    ctx.closePath();

    ctx.fillStyle = slice.color;
    ctx.shadowColor = slice.color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    currentAngle += sliceAngle;
  });

  // Center Text in Donut
  ctx.font = '800 18px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('100%', centerX, centerY + 2);

  ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('DISTRIBUTION', centerX, centerY + 18);

  // Donut Legends below
  const legendsList = document.getElementById('donut-legends-list');
  if (legendsList) {
    legendsList.innerHTML = donutData.map(slice => {
      const pct = Math.round((slice.value / total) * 100);
      return `
        <div class="donut-legend-item">
          <div>
            <span class="legend-color-dot" style="background-color: ${slice.color};"></span>
            <span>${slice.label}</span>
          </div>
          <span class="mono" style="color: #ffffff; font-weight: 700;">${pct}%</span>
        </div>
      `;
    }).join('');
  }
}

/* ==========================================================================
   8. EDUCATION SECTION (TIMELINE)
   ========================================================================== */
function renderEducation() {
  const educationList = PortfolioStore.getEducation();
  const container = document.getElementById('education-timeline-container');
  if (!container) return;

  container.innerHTML = educationList.map(item => `
    <div class="edu-timeline-card" id="${item.id}">
      <div class="edu-degree-header">
        <h3 class="edu-degree-title">${item.degree}</h3>
        <span class="edu-year-badge">${item.status || `Graduation: ${item.graduationYear}`}</span>
      </div>

      <div class="edu-college-name">${item.college}</div>
      <div class="edu-university-affil">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
        <span>Affiliated with ${item.university}</span>
      </div>

      <p class="edu-overview-text">${item.description}</p>

      <div class="edu-coursework-title">Curricular Scope & Practical Competencies</div>
      <div class="edu-subjects-grid">
        ${(item.subjects || []).map(s => `
          <div class="edu-subject-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${s}</span>
          </div>
        `).join('')}
      </div>

      <div class="card-admin-actions" style="margin-top: 24px;">
        <button class="card-act-btn" onclick="openEditEducationModal('${item.id}')">Edit Education</button>
        <button class="card-act-btn del" onclick="handleDeleteEducation('${item.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   9. CURRENTLY LEARNING SECTION
   Learning topics represented as active interests (Not certifications)
   ========================================================================== */
function renderLearning() {
  const topics = PortfolioStore.getLearning();
  const grid = document.getElementById('learning-topics-grid');
  if (!grid) return;

  grid.innerHTML = topics.map(item => {
    const iconSVG = SKILL_ICONS[item.icon] || SKILL_ICONS.search;
    return `
      <div class="learning-card" data-id="${item.id}">
        <div class="learning-card-top">
          <div class="learning-icon-box">
            ${iconSVG}
          </div>
          <span class="learning-status-pill">${item.status}</span>
        </div>
        <h4 class="learning-topic-title">${item.topic}</h4>
        <div class="learning-cat-label">${item.category}</div>
        <p class="learning-desc">${item.description}</p>
        <div class="card-admin-actions">
          <button class="card-act-btn" onclick="openEditLearningModal('${item.id}')">Edit</button>
          <button class="card-act-btn del" onclick="handleDeleteLearning('${item.id}')">Delete</button>
          <button class="card-act-btn" onclick="handleMoveLearning('${item.id}', -1)">↑</button>
          <button class="card-act-btn" onclick="handleMoveLearning('${item.id}', 1)">↓</button>
        </div>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   10. CONTACT SECTION ("Let's Connect")
   ========================================================================== */
function initContactSection() {
  const contact = PortfolioStore.getContact();

  const emailVal = document.getElementById('contact-email-val');
  const phoneVal = document.getElementById('contact-phone-val');
  const locationVal = document.getElementById('contact-location-val');
  const linkedinCard = document.getElementById('contact-linkedin-card');
  const githubCard = document.getElementById('contact-github-card');
  const btnCopyEmail = document.getElementById('btn-copy-email');
  const contactForm = document.getElementById('contact-form');

  if (emailVal) emailVal.textContent = contact.email;
  if (locationVal) locationVal.textContent = contact.location;

  // Phone config
  if (phoneVal) {
    if (contact.phone && contact.phone.trim() !== '') {
      phoneVal.textContent = contact.phone;
      const phoneLink = document.getElementById('contact-phone-link');
      if (phoneLink) phoneLink.href = `tel:${contact.phone}`;
    } else {
      phoneVal.textContent = 'Available upon request';
      const phoneLink = document.getElementById('contact-phone-link');
      if (phoneLink) phoneLink.removeAttribute('href');
    }
  }

  // LinkedIn link
  if (linkedinCard) {
    if (contact.linkedinUrl && contact.linkedinUrl.trim() !== '') {
      linkedinCard.href = contact.linkedinUrl;
      linkedinCard.style.display = 'flex';
    } else {
      linkedinCard.style.display = 'none';
    }
  }

  // GitHub link
  if (githubCard) {
    if (contact.githubUrl && contact.githubUrl.trim() !== '') {
      githubCard.href = contact.githubUrl;
      githubCard.style.display = 'flex';
    } else {
      githubCard.style.display = 'none';
    }
  }

  // Copy email
  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      navigator.clipboard.writeText(contact.email).then(() => {
        showToast('Email address copied to clipboard!', 'success');
      }).catch(() => {
        showToast(`Email: ${contact.email}`, 'info');
      });
    });
  }

  // Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }

      // If a backend or email service endpoint is configured in Settings, send POST
      if (contact.formEndpoint && contact.formEndpoint.trim() !== '') {
        try {
          showToast('Sending message via configured service endpoint...', 'info');
          const res = await fetch(contact.formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message, date: new Date().toISOString() })
          });
          if (res.ok) {
            showToast('Message sent successfully! Thank you for reaching out.', 'success');
            contactForm.reset();
            return;
          } else {
            throw new Error('Service responded with error');
          }
        } catch (err) {
          showToast('Failed to deliver via configured endpoint. Falling back to direct email.', 'error');
        }
      }

      // Transparent fallback: Mailto link
      const mailtoUrl = `mailto:${contact.email}?subject=${encodeURIComponent(`Portfolio Message from ${name}`)}&body=${encodeURIComponent(`Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`)}`;
      showToast(`Launching email client to send directly to Mohammed Abrar VK...`, 'success');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 900);
      contactForm.reset();
    });
  }
}

/* ==========================================================================
   11. PRIVATE ADMIN PANEL (MODAL & CRUD)
   Tabs: Profile, Skills, Projects, Analytics, Education, Learning, Contact, Settings
   ========================================================================== */
function initAdminModal() {
  const modal = document.getElementById('admin-modal');
  const btnFab = document.getElementById('fab-admin-trigger');
  const btnCloseModal = document.getElementById('btn-modal-close');
  const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
  const adminPanes = document.querySelectorAll('.admin-modal-container .tab-pane');

  window.openAdminModal = function(tabName = 'profile') {
    if (!PortfolioStore.isAdminAuthenticated()) {
      const loginModal = document.getElementById('admin-login-modal');
      if (loginModal) loginModal.classList.add('open');
      return;
    }
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    switchAdminTab(tabName);
    loadAdminProfileForm();
    loadAdminSkillsTable();
    loadAdminProjectsTable();
    loadAdminEducationTable();
    loadAdminLearningTable();
    loadAdminContactForm();
  };

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (btnFab) btnFab.addEventListener('click', () => openAdminModal('profile'));
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

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

  // Profile Form
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
        aboutNarrative: document.getElementById('profile-input-narrative').value.trim()
      };
      PortfolioStore.saveProfile(updated);
      showToast('Profile information updated!', 'success');
      initHeroProfile();
      const aboutLead = document.getElementById('about-lead-text');
      if (aboutLead) aboutLead.textContent = updated.aboutNarrative;
    });
  }

  // Skills Form
  const skillForm = document.getElementById('admin-skill-form');
  if (skillForm) {
    skillForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('skill-input-name').value.trim();
      const category = document.getElementById('skill-input-category').value;
      const description = document.getElementById('skill-input-desc').value.trim();
      const icon = document.getElementById('skill-input-icon').value;

      let skills = PortfolioStore.getSkills();

      if (editingSkillId) {
        skills = skills.map(s => s.id === editingSkillId ? { ...s, name, category, description, icon } : s);
        editingSkillId = null;
        document.getElementById('skill-form-submit-btn').textContent = 'Add Skill';
        showToast(`Skill "${name}" updated!`, 'success');
      } else {
        skills.push({ id: `skill-${Date.now()}`, name, category, description, icon });
        showToast(`Skill "${name}" added!`, 'success');
      }

      PortfolioStore.saveSkills(skills);
      skillForm.reset();
      loadAdminSkillsTable();
      renderSkills();
    });
  }

  // Project Form
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

      let projects = PortfolioStore.getProjects();
      const technologies = techStr.split(',').map(t => t.trim()).filter(Boolean);

      if (editingProjectId) {
        projects = projects.map(p => p.id === editingProjectId ? {
          ...p, title, category, status, statusBadge: status, technologies, description: desc, githubUrl, liveUrl, image
        } : p);
        editingProjectId = null;
        document.getElementById('proj-form-submit-btn').textContent = 'Add Project';
        showToast(`Project "${title}" updated!`, 'success');
      } else {
        projects.push({
          id: `proj-${Date.now()}`,
          title, category, status, statusBadge: status, technologies, description: desc,
          features: ['Modern responsive UI', 'Structured workflows'],
          roleModules: null,
          githubUrl, liveUrl, image
        });
        showToast(`Project "${title}" added!`, 'success');
      }

      PortfolioStore.saveProjects(projects);
      projectForm.reset();
      loadAdminProjectsTable();
      renderProjects();
    });
  }

  // Education Form
  const eduForm = document.getElementById('admin-edu-form');
  if (eduForm) {
    eduForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const degree = document.getElementById('edu-input-degree').value.trim();
      const college = document.getElementById('edu-input-college').value.trim();
      const university = document.getElementById('edu-input-university').value.trim();
      const graduationYear = document.getElementById('edu-input-year').value.trim();
      const description = document.getElementById('edu-input-desc').value.trim();

      let eduList = PortfolioStore.getEducation();

      if (editingEducationId) {
        eduList = eduList.map(item => item.id === editingEducationId ? {
          ...item, degree, college, university, graduationYear, status: `Graduated: ${graduationYear}`, description
        } : item);
        editingEducationId = null;
        document.getElementById('edu-form-submit-btn').textContent = 'Add Education Entry';
        showToast(`Education entry updated!`, 'success');
      } else {
        eduList.push({
          id: `edu-${Date.now()}`,
          degree, college, university, graduationYear,
          status: `Graduated: ${graduationYear}`,
          description,
          subjects: ['Core Computing Curricula', 'Applied Technical Study']
        });
        showToast(`Education entry added!`, 'success');
      }

      PortfolioStore.saveEducation(eduList);
      eduForm.reset();
      loadAdminEducationTable();
      renderEducation();
    });
  }

  // Learning Topics Form
  const learnForm = document.getElementById('admin-learn-form');
  if (learnForm) {
    learnForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const topic = document.getElementById('learn-input-topic').value.trim();
      const category = document.getElementById('learn-input-cat').value.trim();
      const status = document.getElementById('learn-input-status').value.trim();
      const description = document.getElementById('learn-input-desc').value.trim();
      const icon = document.getElementById('learn-input-icon').value;

      let list = PortfolioStore.getLearning();

      if (editingLearningId) {
        list = list.map(item => item.id === editingLearningId ? {
          ...item, topic, category, status, description, icon
        } : item);
        editingLearningId = null;
        document.getElementById('learn-form-submit-btn').textContent = 'Add Learning Topic';
        showToast(`Topic "${topic}" updated!`, 'success');
      } else {
        list.push({
          id: `learn-${Date.now()}`,
          topic, category, status, description, icon
        });
        showToast(`Topic "${topic}" added!`, 'success');
      }

      PortfolioStore.saveLearning(list);
      learnForm.reset();
      loadAdminLearningTable();
      renderLearning();
    });
  }

  // Contact Settings Form
  const contactFormAdmin = document.getElementById('admin-contact-form');
  if (contactFormAdmin) {
    contactFormAdmin.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        email: document.getElementById('contact-input-email').value.trim(),
        phone: document.getElementById('contact-input-phone').value.trim(),
        location: document.getElementById('contact-input-location').value.trim(),
        linkedinUrl: document.getElementById('contact-input-linkedin').value.trim(),
        githubUrl: document.getElementById('contact-input-github').value.trim(),
        formEndpoint: document.getElementById('contact-input-endpoint').value.trim()
      };

      PortfolioStore.saveContact(updated);
      showToast('Contact details saved!', 'success');
      initContactSection();
    });
  }

  // Passkey Settings Form
  const passkeyForm = document.getElementById('admin-passkey-form');
  if (passkeyForm) {
    passkeyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newKey = document.getElementById('settings-new-passkey').value.trim();
      if (!newKey) return;
      PortfolioStore.setAdminPasskey(newKey);
      showToast('Admin passkey updated successfully!', 'success');
      passkeyForm.reset();
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
          showToast('Data imported successfully! Reloading...', 'success');
          setTimeout(() => window.location.reload(), 900);
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
        showToast('Restored to default. Reloading...', 'info');
        setTimeout(() => window.location.reload(), 800);
      }
    });
  }
}

// Admin Table Loaders
function loadAdminProfileForm() {
  const profile = PortfolioStore.getProfile();
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };
  setVal('profile-input-name', profile.name);
  setVal('profile-input-title', profile.title);
  setVal('profile-input-summary', profile.summary);
  setVal('profile-input-narrative', profile.aboutNarrative);
}

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

function loadAdminEducationTable() {
  const eduList = PortfolioStore.getEducation();
  const listEl = document.getElementById('admin-education-list');
  if (!listEl) return;

  listEl.innerHTML = eduList.map((item) => `
    <div class="admin-item-row">
      <div class="admin-item-info">
        <span class="admin-item-name">${item.degree}</span>
        <span class="admin-item-badge">${item.college} (${item.graduationYear})</span>
      </div>
      <div class="admin-row-actions">
        <button class="admin-btn-action" onclick="openEditEducationModal('${item.id}')">Edit</button>
        <button class="admin-btn-action del" onclick="handleDeleteEducation('${item.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function loadAdminLearningTable() {
  const topics = PortfolioStore.getLearning();
  const listEl = document.getElementById('admin-learning-list');
  if (!listEl) return;

  listEl.innerHTML = topics.map((t, idx) => `
    <div class="admin-item-row">
      <div class="admin-item-info">
        <span class="admin-item-name">${t.topic}</span>
        <span class="admin-item-badge">${t.status}</span>
      </div>
      <div class="admin-row-actions">
        <button class="admin-btn-action" onclick="openEditLearningModal('${t.id}')">Edit</button>
        <button class="admin-btn-action del" onclick="handleDeleteLearning('${t.id}')">Delete</button>
        <button class="admin-btn-action" onclick="handleMoveLearning('${t.id}', -1)" ${idx === 0 ? 'disabled' : ''}>↑</button>
        <button class="admin-btn-action" onclick="handleMoveLearning('${t.id}', 1)" ${idx === topics.length - 1 ? 'disabled' : ''}>↓</button>
      </div>
    </div>
  `).join('');
}

function loadAdminContactForm() {
  const contact = PortfolioStore.getContact();
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };
  setVal('contact-input-email', contact.email);
  setVal('contact-input-phone', contact.phone);
  setVal('contact-input-location', contact.location);
  setVal('contact-input-linkedin', contact.linkedinUrl);
  setVal('contact-input-github', contact.githubUrl);
  setVal('contact-input-endpoint', contact.formEndpoint);
}

// Global CRUD Functions
window.handleDeleteSkill = function(id) {
  if (!confirm('Are you sure you want to delete this skill?')) return;
  let skills = PortfolioStore.getSkills().filter(s => s.id !== id);
  PortfolioStore.saveSkills(skills);
  loadAdminSkillsTable();
  renderSkills();
  showToast('Skill deleted.', 'info');
};

window.handleMoveSkill = function(id, dir) {
  let skills = PortfolioStore.getSkills();
  const idx = skills.findIndex(s => s.id === id);
  if (idx < 0) return;
  const target = idx + dir;
  if (target < 0 || target >= skills.length) return;
  const temp = skills[idx];
  skills[idx] = skills[target];
  skills[target] = temp;
  PortfolioStore.saveSkills(skills);
  loadAdminSkillsTable();
  renderSkills();
};

window.openEditSkillModal = function(id) {
  const skill = PortfolioStore.getSkills().find(s => s.id === id);
  if (!skill) return;
  editingSkillId = id;
  document.getElementById('skill-input-name').value = skill.name;
  document.getElementById('skill-input-category').value = skill.category;
  document.getElementById('skill-input-desc').value = skill.description;
  document.getElementById('skill-input-icon').value = skill.icon;
  document.getElementById('skill-form-submit-btn').textContent = 'Update Skill';
  openAdminModal('skills');
};

window.handleDeleteProject = function(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  let projects = PortfolioStore.getProjects().filter(p => p.id !== id);
  PortfolioStore.saveProjects(projects);
  loadAdminProjectsTable();
  renderProjects();
  showToast('Project deleted.', 'info');
};

window.handleMoveProject = function(id, dir) {
  let projects = PortfolioStore.getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx < 0) return;
  const target = idx + dir;
  if (target < 0 || target >= projects.length) return;
  const temp = projects[idx];
  projects[idx] = projects[target];
  projects[target] = temp;
  PortfolioStore.saveProjects(projects);
  loadAdminProjectsTable();
  renderProjects();
};

window.openEditProjectModal = function(id) {
  const proj = PortfolioStore.getProjects().find(p => p.id === id);
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
  openAdminModal('projects');
};

window.handleDeleteEducation = function(id) {
  if (!confirm('Are you sure you want to delete this education entry?')) return;
  let list = PortfolioStore.getEducation().filter(e => e.id !== id);
  PortfolioStore.saveEducation(list);
  loadAdminEducationTable();
  renderEducation();
  showToast('Education entry deleted.', 'info');
};

window.openEditEducationModal = function(id) {
  const item = PortfolioStore.getEducation().find(e => e.id === id);
  if (!item) return;
  editingEducationId = id;
  document.getElementById('edu-input-degree').value = item.degree;
  document.getElementById('edu-input-college').value = item.college;
  document.getElementById('edu-input-university').value = item.university;
  document.getElementById('edu-input-year').value = item.graduationYear;
  document.getElementById('edu-input-desc').value = item.description;
  document.getElementById('edu-form-submit-btn').textContent = 'Update Education Entry';
  openAdminModal('education');
};

window.handleDeleteLearning = function(id) {
  if (!confirm('Are you sure you want to delete this learning topic?')) return;
  let list = PortfolioStore.getLearning().filter(l => l.id !== id);
  PortfolioStore.saveLearning(list);
  loadAdminLearningTable();
  renderLearning();
  showToast('Learning topic deleted.', 'info');
};

window.handleMoveLearning = function(id, dir) {
  let list = PortfolioStore.getLearning();
  const idx = list.findIndex(l => l.id === id);
  if (idx < 0) return;
  const target = idx + dir;
  if (target < 0 || target >= list.length) return;
  const temp = list[idx];
  list[idx] = list[target];
  list[target] = temp;
  PortfolioStore.saveLearning(list);
  loadAdminLearningTable();
  renderLearning();
};

window.openEditLearningModal = function(id) {
  const item = PortfolioStore.getLearning().find(l => l.id === id);
  if (!item) return;
  editingLearningId = id;
  document.getElementById('learn-input-topic').value = item.topic;
  document.getElementById('learn-input-cat').value = item.category;
  document.getElementById('learn-input-status').value = item.status;
  document.getElementById('learn-input-desc').value = item.description;
  document.getElementById('learn-input-icon').value = item.icon || 'search';
  document.getElementById('learn-form-submit-btn').textContent = 'Update Learning Topic';
  openAdminModal('learning');
};

/* ==========================================================================
   12. TOAST NOTIFICATIONS
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
