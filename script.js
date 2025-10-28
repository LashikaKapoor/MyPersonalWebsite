/* ============================
   Advanced interactions script
   ============================
   - keeps your toggleDarkMode() signature
   - hero particles + parallax + cursor trail
   - typing animation
   - reveal-on-scroll + page transitions
   - circular meters and prog bars animated
   - tilt hover on project cards
   - project modal
   - keyboard shortcut (Ctrl/Cmd + D) to toggle theme
*/

// -------------------- Theme (keeps your original)
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const themeBtn = document.getElementById('themeBtn');
  const isDark = document.body.classList.contains('dark-mode');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
  try { localStorage.setItem('lk-theme', isDark ? 'dark' : 'light'); } catch(e){}
}
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

// resume button placeholder
document.getElementById('resumeBtn').addEventListener('click', ()=> {
  // replace href with your resume link
  window.open('https://example.com/Lashika_Resume.pdf', '_blank');
});

// set year
document.getElementById('year').textContent = new Date().getFullYear();

// -------------------- Page transition mask
const pageMask = document.getElementById('pageMask');
window.addEventListener('load', ()=> {
  setTimeout(()=> pageMask.style.transform = 'translateY(-110%)', 350);
});
// re-show mask when nav anchor clicked for micro-page-transition
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    // smooth scroll handled later
    pageMask.style.transform = 'translateY(0%)';
    setTimeout(()=> pageMask.style.transform = 'translateY(-110%)', 450);
  });
});

// -------------------- Typing animation (roles)
const roles = ["Founder & CEO", "AI Innovator", "Robotics Engineer", "ML Explorer", "Competitive Programmer"];
const typingEl = document.getElementById('typing');
let roleIdx = 0, charIdx = 0, forward = true;
function tick(){
  const current = roles[roleIdx];
  if(forward){
    charIdx++;
    if(charIdx > current.length){ forward = false; setTimeout(tick, 800); return; }
  } else {
    charIdx--;
    if(charIdx < 0){ forward = true; roleIdx = (roleIdx+1) % roles.length; setTimeout(tick, 200); return; }
  }
  typingEl.textContent = current.slice(0, charIdx);
  setTimeout(tick, forward ? 60 : 30);
}
tick();

// -------------------- Reveal on scroll (IntersectionObserver)
const reveals = document.querySelectorAll('.glass, .section-title, .project, .profile-card, .card, .timeline-list li');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.style.opacity = 1; e.target.style.transform = 'none'; io.unobserve(e.target); }
  });
},{threshold: 0.12});
reveals.forEach(n => {
  n.style.opacity = 0; n.style.transform = 'translateY(18px)';
  io.observe(n);
});

// -------------------- Progress bars and circular meters
const fills = document.querySelectorAll('.prog-fill');
const circles = document.querySelectorAll('.meter');
const fillObs = new IntersectionObserver(entries=>{
  entries.forEach(ent=>{
    if(ent.isIntersecting){
      if(ent.target.classList.contains('prog-fill')){
        const val = ent.target.dataset.fill || 60;
        ent.target.style.width = val + '%';
      } else if(ent.target.classList.contains('meter')){
        // animate circular meter
        const v = parseFloat(ent.target.dataset.value) || 0.6;
        drawCircularMeter(ent.target, v);
      }
      fillObs.unobserve(ent.target);
    }
  });
},{threshold: 0.3});
fills.forEach(f => fillObs.observe(f));
circles.forEach(c => fillObs.observe(c));

// helper to draw circular meter inside element (creates SVG)
function drawCircularMeter(node, value){
  // create a simple SVG ring with stroke-dasharray animation
  const size = 86; const stroke = 4; const radius = (size - stroke) / 2; const circumference = 2 * Math.PI * radius;
  const svgns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgns, 'svg');
  svg.setAttribute('width', size); svg.setAttribute('height', size); svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  const bg = document.createElementNS(svgns, 'circle');
  bg.setAttribute('cx', size/2); bg.setAttribute('cy', size/2); bg.setAttribute('r', radius);
  bg.setAttribute('stroke', 'rgba(255,255,255,0.06)'); bg.setAttribute('stroke-width', stroke.toString()); bg.setAttribute('fill', 'none');
  const fg = document.createElementNS(svgns, 'circle');
  fg.setAttribute('cx', size/2); fg.setAttribute('cy', size/2); fg.setAttribute('r', radius);
  fg.setAttribute('stroke', 'url(#g)'); fg.setAttribute('stroke-width', stroke.toString()); fg.setAttribute('fill', 'none');
  fg.setAttribute('stroke-linecap', 'round'); fg.setAttribute('transform', `rotate(-90 ${size/2} ${size/2})`);
  fg.style.strokeDasharray = `${circumference} ${circumference}`;
  fg.style.strokeDashoffset = circumference;
  // gradient defs
  const defs = document.createElementNS(svgns, 'defs');
  const lin = document.createElementNS(svgns, 'linearGradient');
  lin.setAttribute('id', 'g'); lin.setAttribute('x1','0%'); lin.setAttribute('y1','0%'); lin.setAttribute('x2','100%'); lin.setAttribute('y2','0%');
  const s1 = document.createElementNS(svgns, 'stop'); s1.setAttribute('offset','0%'); s1.setAttribute('stop-color','#66f0d4');
  const s2 = document.createElementNS(svgns, 'stop'); s2.setAttribute('offset','100%'); s2.setAttribute('stop-color','#7dd3fc');
  lin.appendChild(s1); lin.appendChild(s2); defs.appendChild(lin);
  svg.appendChild(defs); svg.appendChild(bg); svg.appendChild(fg);
  node.innerHTML = ''; node.appendChild(svg);
  // animate
  const toOffset = circumference * (1 - value);
  let start = null;
  function animate(ts){
    if(!start) start = ts;
    const t = Math.min(1, (ts - start) / 900);
    const cur = circumference - (circumference - toOffset) * easeOutCubic(t);
    fg.style.strokeDashoffset = cur;
    if(t < 1) requestAnimationFrame(animate);
    else {
      // add inner label
      const lbl = document.createElement('div'); lbl.style.position='absolute'; lbl.style.fontSize='13px'; lbl.style.fontWeight='700';
      lbl.style.color='var(--txt)'; lbl.style.top='40%'; lbl.style.transform='translateY(-50%)'; lbl.innerText = Math.round(value*100)+'%';
      node.appendChild(lbl);
    }
  }
  requestAnimationFrame(animate);
}
function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

// -------------------- Particle field + parallax (heroCanvas)
(function heroEngine(){
  const canvas = document.getElementById('heroCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = innerWidth, h = innerHeight * 0.9;
  function resize(){ canvas.width = w = innerWidth; canvas.height = h = innerHeight * 0.9; }
  addEventListener('resize', resize); resize();

  function rand(a,b){return Math.random()*(b-a)+a;}
  class P{ constructor(){ this.reset(); }
    reset(){ this.x = rand(0,w); this.y = rand(0,h); this.r = rand(0.6,3); this.vx = rand(-0.25,0.25); this.vy = rand(-0.15,0.15); this.a = rand(0.06,0.25);
    }
    step(){ this.x += this.vx; this.y += this.vy; if(this.x<-20||this.x>w+20||this.y<-20||this.y>h+20) this.reset(); }
    draw(){ ctx.beginPath(); ctx.fillStyle = `rgba(125,200,255,${this.a})`; ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill(); }
  }
  let particles = [];
  function init(n=Math.round((w*h)/90000)){ particles = []; for(let i=0;i<n;i++) particles.push(new P()); }
  init();

  function loop(){
    ctx.clearRect(0,0,w,h);
    // gradient backdrop
    const g = ctx.createLinearGradient(0,0,w,h); g.addColorStop(0,'rgba(6,18,36,0.35)'); g.addColorStop(1,'rgba(2,8,14,0.55)');
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
    particles.forEach(p=>{ p.step(); p.draw(); });
    // subtle lines
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a=particles[i], b=particles[j];
        const dx=a.x-b.x, dy=a.y-b.y; const d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){
          ctx.beginPath(); ctx.strokeStyle = `rgba(125,200,255,${0.01 + (0.06*(1-d/110))})`; ctx.lineWidth = 0.6; ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

// -------------------- Cursor glow trail
(function cursorTrail(){
  const trail = []; const max = 16;
  const canvas = document.createElement('canvas'); canvas.style.position='fixed'; canvas.style.left=0; canvas.style.top=0; canvas.style.pointerEvents='none'; canvas.style.zIndex=120; document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; } addEventListener('resize', resize); resize();
  addEventListener('mousemove', (e)=>{ trail.unshift({x:e.clientX,y:e.clientY,a:1}); if(trail.length>max) trail.pop(); });
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<trail.length;i++){
      const p = trail[i]; const s = (1 - i/trail.length) * 18;
      ctx.beginPath(); ctx.fillStyle = `rgba(125,200,255,${0.14 - (i/trail.length)*0.12})`; ctx.arc(p.x,p.y,s,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// -------------------- Tilt effect for project cards (pointer-based)
(function tiltCards(){
  const cards = document.querySelectorAll('.tilt');
  cards.forEach(card=>{
    card.addEventListener('pointermove', (ev)=>{
      const r = card.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width;
      const py = (ev.clientY - r.top) / r.height;
      const rotY = (px - 0.5) * 16; const rotX = (0.5 - py) * 10;
      const scale = 1.03;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
      card.style.transition = 'transform 120ms linear';
    });
    card.addEventListener('pointerleave', ()=> { card.style.transform = ''; card.style.transition = 'transform .6s cubic-bezier(.2,.9,.2,1)'; });
  });
})();

// -------------------- Project modal (reads data-project JSON)
(function projectModal(){
  const modal = document.getElementById('projectModal');
  const content = document.getElementById('modalContent');
  const close = document.getElementById('modalClose');
  document.querySelectorAll('.project .view').forEach(btn => {
    btn.addEventListener('click', (e)=>{
      const card = e.target.closest('.project');
      const info = JSON.parse(card.getAttribute('data-project'));
      content.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 320px;gap:1rem;">
          <div>
            <h2>${escapeHtml(info.title)}</h2>
            <p style="color:var(--muted)">${escapeHtml(info.desc)}</p>
            <p><strong>Tags:</strong> ${info.tags.map(t=>`<span style="margin-right:.5rem;background:rgba(255,255,255,0.02);padding:.3rem .5rem;border-radius:8px;">${escapeHtml(t)}</span>`).join('')}</p>
            <h4>Notes</h4><p style="color:var(--muted)">Add experiment details, dataset links, or code snippets here. Replace placeholders with your repo links.</p>
          </div>
          <div style="border-radius:10px;overflow:hidden">
            <img src="${info.img}" style="width:100%;height:100%;object-fit:cover" alt="${escapeHtml(info.title)}">
          </div>
        </div>
      `;
      modal.classList.add('show'); modal.setAttribute('aria-hidden','false');
    });
  });
  close.addEventListener('click', ()=>{ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); });
  modal.addEventListener('click', (e)=>{ if(e.target === modal) { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); } });

  function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
})();

// -------------------- Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href = a.getAttribute('href');
    if(href.length > 1){
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// -------------------- Keyboard shortcut for theme: Ctrl/Cmd + D
window.addEventListener('keydown', (e)=>{
  if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd'){
    e.preventDefault(); toggleDarkMode();
  }
});
