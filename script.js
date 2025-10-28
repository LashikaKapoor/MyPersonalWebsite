// Keep your original dark mode function but expanded:
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const themeBtn = document.getElementById('themeBtn');
  const isDark = document.body.classList.contains('dark-mode');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
  // persist preference
  try { localStorage.setItem('lk-theme', isDark ? 'dark' : 'light'); } catch(e){}
}

// Initialise theme from localStorage
(function initTheme(){
  try {
    const pref = localStorage.getItem('lk-theme');
    if(pref === 'dark') {
      document.body.classList.add('dark-mode');
      document.getElementById('themeBtn').textContent = '☀️';
    }
  } catch(e){}
})();

document.getElementById('themeBtn').addEventListener('click', toggleDarkMode);

// small helper to set year
document.getElementById('year').textContent = new Date().getFullYear();

// -----------------------------
// Reveal on scroll (using IntersectionObserver)
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
},{threshold: 0.12});
reveals.forEach(r => revealObs.observe(r));

// Animate skill bars when scrolled into view
const skillBars = document.querySelectorAll('.bar-fill');
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const el = entry.target;
      const value = el.getAttribute('data-fill') || '60';
      el.style.width = value + '%';
      skillObs.unobserve(el);
    }
  });
},{threshold: 0.35});
skillBars.forEach(b => skillObs.observe(b));

// Smooth internal link scrolling
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href = a.getAttribute('href');
    if(href.length > 1){
      e.preventDefault();
      document.querySelector(href).scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// -----------------------------
// Lightweight particle / parallax background for hero canvas
(function heroParticles(){
  const canvas = document.getElementById('heroCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize(){
    canvas.width = w = innerWidth;
    canvas.height = h = innerHeight * 0.9; // cover hero
  }
  window.addEventListener('resize', resize);
  resize();

  function rand(min, max){ return Math.random()*(max-min)+min; }

  class P {
    constructor(){
      this.reset();
    }
    reset(){
      this.x = rand(0, w);
      this.y = rand(0, h);
      this.vx = rand(-0.15, 0.15);
      this.vy = rand(-0.2, 0.2);
      this.r = rand(0.6, 2.4);
      this.alpha = rand(0.06, 0.24);
    }
    step(){
      this.x += this.vx;
      this.y += this.vy;
      if(this.x < -10 || this.x > w+10 || this.y < -10 || this.y > h+10) this.reset();
    }
    draw(){
      ctx.beginPath();
      ctx.fillStyle = `rgba(126, 211, 255, ${this.alpha})`;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // create particles
  function initParticles(n=90){
    particles = [];
    for(let i=0;i<n;i++) particles.push(new P());
  }
  initParticles(Math.round((w*h)/90000)); // scale density with size

  // animate
  let last = 0;
  function loop(ts){
    const dt = ts - last;
    last = ts;
    ctx.clearRect(0,0,w,h);

    // gradient overlay for subtle depth
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0, 'rgba(10,16,25,0.45)');
    g.addColorStop(1, 'rgba(2,8,14,0.65)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    particles.forEach(p=>{
      p.step();
      p.draw();
    });

    // subtle connections
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if(d < 90){
          ctx.beginPath();
          ctx.strokeStyle = `rgba(125,200,255,${0.015 + (0.08*(1 - d/90))})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

// -----------------------------
// Optional: small keyboard shortcut to toggle theme: "d"
window.addEventListener('keydown', (e)=>{
  if(e.key.toLowerCase() === 'd' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    toggleDarkMode();
  }
});
