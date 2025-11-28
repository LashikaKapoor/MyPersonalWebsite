/* -------------------------
   Theme toggle (preserves previous behavior)
   ------------------------- */
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme-mode');

function applyTheme(mode) {
  if (mode === 'light') {
    document.documentElement.style.setProperty('--bg', '#f7f8fb');
    document.documentElement.style.setProperty('--panel', '#ffffff');
    document.documentElement.style.setProperty('--text', '#0f172a');
    document.documentElement.style.setProperty('--muted', '#58606f');
    themeBtn.setAttribute('aria-pressed', 'false');
    localStorage.setItem('theme-mode', 'light');
  } else {
    document.documentElement.style.setProperty('--bg', '#071021');
    document.documentElement.style.setProperty('--panel', '#0f1624');
    document.documentElement.style.setProperty('--text', '#eef3ff');
    document.documentElement.style.setProperty('--muted', '#9aa3c0');
    themeBtn.setAttribute('aria-pressed', 'true');
    localStorage.setItem('theme-mode', 'dark');
  }
}

/* initialize theme */
if (savedTheme) applyTheme(savedTheme);
else applyTheme('dark');

themeBtn.addEventListener('click', () => {
  const current = localStorage.getItem('theme-mode') === 'light' ? 'dark' : 'light';
  applyTheme(current);
});

/* -------------------------
   Year
   ------------------------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* -------------------------
   Typewriter (keeps original feel, updated phrases)
   ------------------------- */
const phrases = [
  'Innovator building accessible hardware + AI.',
  'Founder & CEO of CodeUnity — outreach in multiple states.',
  'Researching affordable Microbial Fuel Cells (MFC).',
  'Participant — MIT Beaver Works Summer Institute (BWSI).',
  '5+ years in Model United Nations & public speaking.'
];

let idx = 0, ptr = 0, rev = false;
const tw = document.getElementById('typewriter');

function tick(){
  const text = phrases[idx];
  if(!rev){
    ptr++;
    if(ptr === text.length + 10) rev = true;
  } else {
    ptr--;
    if(ptr <= 0){ rev = false; idx = (idx+1) % phrases.length; }
  }
  tw.textContent = text.slice(0, Math.max(0, Math.min(ptr, text.length)));
  setTimeout(tick, rev ? 45 : 80);
}
tick();

/* -------------------------
   Projects data & render (keeps your projects; edited to reflect achievements)
   ------------------------- */
const projects = [
  {
    title: 'Affordable MFC Research (Science Fair)',
    desc: 'Designing and testing low-cost Microbial Fuel Cells. Partnering with organizations and a teammate to develop reproducible cells and build a sensor system to monitor voltage, pH, and temperature.',
    tags: ['mfc','hw','outreach'],
    link: '#',
    call: 'Read Notebook',
    thumb: '🌿'
  },
  {
    title: 'Myoelectric Prosthetic Prototype',
    desc: 'Prototype for a low-cost myoelectric hand: EMG sensors, Arduino/PWM control, and movement mapping for grasp patterns.',
    tags: ['hw','ai'],
    link: '#',
    call: 'View Repo',
    thumb: '🦾'
  },
  {
    title: 'CodeUnity — Curriculum & Outreach',
    desc: 'Nonprofit: curriculum, workshops, and online lessons teaching coding and financial literacy. Launched in two states within the first week and continues to expand.',
    tags: ['outreach','web'],
    link: '#',
    call: 'Visit CodeUnity',
    thumb: '🤝'
  },
  {
    title: 'Skin Lesion Classifier (Research)',
    desc: 'Image-based CNN prototype (VGG16) for classification experiments with emphasis on explainability and model visualization.',
    tags: ['ai','data'],
    link: '#',
    call: 'Open Model',
    thumb: '🧠'
  },
  {
    title: 'Sensor Logger PWA',
    desc: 'Progressive web app that logs accelerometer and gyroscope data to CSV for quick experiments and field testing.',
    tags: ['web','data'],
    link: '#',
    call: 'Open App',
    thumb: '📱'
  },
  {
    title: 'Micro-blog & Research Notes',
    desc: 'Personal technical journal for experiments, writeups, and reproducible steps — perfect for sharing with mentors and judges.',
    tags: ['web'],
    link: '#',
    call: 'Read Posts',
    thumb: '📝'
  }
];

const grid = document.getElementById('projectsGrid');

function render(list){
  grid.innerHTML = '';
  list.forEach(p => {
    const el = document.createElement('article');
    el.className = 'proj';
    el.innerHTML = `
      <div class="thumb" aria-hidden="true">${p.thumb}</div>
      <div class="proj-body">
        <h3 style="margin:0 0 8px">${p.title}</h3>
        <p style="margin:0 0 10px; color:var(--muted)">${p.desc}</p>
        <div class="tags">${p.tags.map(t=>`<span class="tag">#${t}</span>`).join('')}</div>
        <div style="margin-top:12px"><a class="btn" href="${p.link}" target="_blank" rel="noopener">${p.call} →</a></div>
      </div>`;
    grid.appendChild(el);
  });
}
render(projects);

/* -------------------------
   Filter chips
   ------------------------- */
const chips = Array.from(document.querySelectorAll('.chip'));
chips.forEach(ch => ch.addEventListener('click', () => {
  chips.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-selected', 'false'); });
  ch.classList.add('active'); ch.setAttribute('aria-selected', 'true');
  const f = ch.dataset.filter;
  if(f === 'all') return render(projects);
  re


