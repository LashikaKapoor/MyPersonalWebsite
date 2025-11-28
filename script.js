/* script.js - interactivity, starfield, animated counters, diagram */

/* --------------------------
   Starfield (canvas)
   --------------------------*/
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let w, h, stars;

function resize() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
}
resize();
addEventListener('resize', resize);

function createStars(count=220){
  stars = [];
  for(let i=0;i<count;i++){
    stars.push({
      x: Math.random()*w,
      y: Math.random()*h,
      z: Math.random()*1.2 + 0.2,
      r: Math.random()*1.6 + 0.2,
      vx: (Math.random()-0.5) * 0.05,
      vy: (Math.random()-0.5) * 0.05
    });
  }
}
createStars(240);

function draw(){
  ctx.clearRect(0,0,w,h);
  // slight gradient overlay to simulate depth
  for(let s of stars){
    s.x += s.vx * s.z * 0.8;
    s.y += s.vy * s.z * 0.8;
    if(s.x < -50) s.x = w + 30;
    if(s.x > w+50) s.x = -30;
    if(s.y < -50) s.y = h + 30;
    if(s.y > h+50) s.y = -30;

    const alpha = (0.2 + 0.8 * (1/s.z));
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.arc(s.x, s.y, s.r * (1.2/s.z), 0, Math.PI*2);
    ctx.fill();
  }

  // occasional shooting star
  if(Math.random() < 0.01){
    shootingStar();
  }
  requestAnimationFrame(draw);
}
draw();

function shootingStar(){
  const sx = Math.random()*w*0.7 + w*0.1;
  const sy = Math.random()*h*0.6 + h*0.05;
  const len = 200 + Math.random()*300;
  const angle = -Math.PI/4 + (Math.random()-0.5)*0.3;
  let t=0;
  function anim(){
    t+=20;
    ctx.beginPath();
    const x = sx + Math.cos(angle)*(t);
    const y = sy + Math.sin(angle)*(t);
    const grad = ctx.createLinearGradient(x,y,x+len,y+len);
    grad.addColorStop(0,'rgba(255,255,255,0.8)');
    grad.addColorStop(1,'rgba(255,255,255,0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.moveTo(x,y);
    ctx.lineTo(x+Math.cos(angle)*len, y+Math.sin(angle)*len);
    ctx.stroke();
    if(t < len) requestAnimationFrame(anim);
  }
  anim();
}

/* --------------------------
   Counters
   --------------------------*/
const counters = document.querySelectorAll('.count');
counters.forEach(el => {
  const target = +el.dataset.target;
  let current = 0;
  const step = Math.max(1, Math.floor(target / 140));
  function uptick(){
    current += step;
    if(current >= target) {
      el.textContent = target;
    } else {
      el.textContent = current;
      requestAnimationFrame(uptick);
    }
  }
  // Delay start until visible
  const obs = new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){ uptick(); obs.disconnect();}
  }, {threshold:0.3});
  obs.observe(el);
});

/* --------------------------
   Rocket animation
   --------------------------*/
const ship = document.getElementById('ship');
const flame = document.getElementById('flame');

let seed = 0;
function rocketLoop(){
  seed += 0.02;
  const bob = Math.sin(seed)*6;
  ship.setAttribute('transform', `translate(100,${100 + bob}) rotate(${Math.sin(seed)*3})`);
  const fScale = 1 + Math.abs(Math.sin(seed*4))*0.6;
  flame.setAttribute('transform', `scale(1,${fScale}) translate(0, ${-6})`);
  requestAnimationFrame(rocketLoop);
}
rocketLoop();

/* --------------------------
   Interactive Diagram (SVG nodes)
   --------------------------*/
const diagramRoot = document.getElementById('diagram');

const nodes = [
  { id:'CS', label:'Computer Science', x: 280, y: 60, r:36, color:'#7f5af0' },
  { id:'QC', label:'Quantum Computing', x: 80, y: 180, r:28, color:'#8be9fd' },
  { id:'AI', label:'AI & ML', x: 420, y: 220, r:30, color:'#ffb86b' },
  { id:'NOIVA', label:'Noiva Project', x: 280, y: 320, r:34, color:'#ff7a18' },
  { id:'MFC', label:'Microbial Fuel Cell', x: 80, y: 340, r:30, color:'#9be7a5' },
  { id:'CODE', label:'CodeUnity', x: 520, y: 90, r:26, color:'#c8b7ff' },
  { id:'MIT', label:'MIT BWSI', x: 520, y: 320, r:26, color:'#b0e0ff' }
];

const links = [
  ['CS','QC'], ['CS','AI'], ['CS','CODE'], ['AI','NOIVA'], ['QC','MIT'], ['NOIVA','MFC'], ['CODE','MFC'], ['MIT','NOIVA']
];

function createDiagram(){
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS,'svg');
  svg.setAttribute('viewBox','0 0 600 420');
  svg.setAttribute('width','100%');
  svg.setAttribute('height','100%');
  svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  svg.style.maxWidth = '100%';

  // defs for glow
  const defs = document.createElementNS(NS,'defs');
  const filter = document.createElementNS(NS,'filter');
  filter.setAttribute('id','glow');
  filter.innerHTML = `<feGaussianBlur stdDeviation="6" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>`;
  defs.appendChild(filter);
  svg.appendChild(defs);

  // links
  links.forEach(([a,b])=>{
    const na = nodes.find(n=>n.id===a);
    const nb = nodes.find(n=>n.id===b);
    const line = document.createElementNS(NS,'line');
    line.setAttribute('x1',na.x);
    line.setAttribute('y1',na.y);
    line.setAttribute('x2',nb.x);
    line.setAttribute('y2',nb.y);
    line.setAttribute('stroke','rgba(255,255,255,0.06)');
    line.setAttribute('stroke-width','2');
    svg.appendChild(line);
  });

  // nodes
  nodes.forEach(n=>{
    const g = document.createElementNS(NS,'g');
    g.setAttribute('class','node');
    g.setAttribute('transform',`translate(${n.x},${n.y})`);
    g.style.cursor='pointer';

    const circle = document.createElementNS(NS,'circle');
    circle.setAttribute('r',n.r);
    circle.setAttribute('fill',n.color);
    circle.setAttribute('opacity','0.14');
    circle.setAttribute('stroke',n.color);
    circle.setAttribute('stroke-width','1.2');

    const label = document.createElementNS(NS,'text');
    label.setAttribute('y', n.r + 18);
    label.setAttribute('text-anchor','middle');
    label.setAttribute('font-size','12');
    label.setAttribute('fill','#dff4ff');
    label.textContent = n.label;

    g.appendChild(circle);
    g.appendChild(label);

    // hover behavior
    g.addEventListener('mouseenter', () => {
      circle.setAttribute('opacity','0.32');
      circle.setAttribute('filter','url(#glow)');
      label.setAttribute('fill','#ffffff');
      showTooltip(n);
    });
    g.addEventListener('mouseleave', () => {
      circle.setAttribute('opacity','0.14');
      circle.removeAttribute('filter');
      label.setAttribute('fill','#dff4ff');
      hideTooltip();
    });

    // click to show details
    g.addEventListener('click', () => {
      alert(`${n.label}\n\nClicking nodes shows quick details — this diagram connects skills to projects. (This alert is a placeholder interactive action.)`);
    });

    svg.appendChild(g);
  });

  diagramRoot.appendChild(svg);

  // tooltip
  const tip = document.createElement('div');
  tip.id='diagram-tip';
  tip.style.position='absolute';
  tip.style.padding='10px 12px';
  tip.style.borderRadius='8px';
  tip.style.background='rgba(0,0,0,0.6)';
  tip.style.color='#e8f8ff';
  tip.style.pointerEvents='none';
  tip.style.fontSize='13px';
  tip.style.display='none';
  diagramRoot.appendChild(tip);

  function showTooltip(n){
    tip.style.display='block';
    tip.textContent = tooltipText(n.id);
  }
  function hideTooltip(){ tip.style.display='none' }

  function tooltipText(id){
    switch(id){
      case 'CS': return 'Core programming, algorithms, and competitive programming (USACO, ACSL).';
      case 'QC': return 'Quantum computing coursework and exploration — goal: minor at Stanford.';
      case 'AI': return 'AI/ML skills used in projects like Noiva and inventory prediction.';
      case 'NOIVA': return 'Noiva — white cane improvement: GPS + vibration patterns + AI object detection (current focus: object detection).';
      case 'MFC': return 'Microbial Fuel Cell: sustainable energy from wastewater residue; web dashboard & AI predictions planned.';
      case 'CODE': return 'CodeUnity — nonprofit to close the gender gap in CS with workshops and mentorship.';
      case 'MIT': return 'BWSI group leader — inventory algorithm for nonprofits; taught ML best practices.';
      default: return '';
    }
  }

  // mouse move to position tooltip
  diagramRoot.addEventListener('mousemove', (ev)=>{
    const rect = diagramRoot.getBoundingClientRect();
    const tipEl = document.getElementById('diagram-tip');
    if(tipEl && tipEl.style.display !== 'none'){
      tipEl.style.left = (ev.clientX - rect.left + 14) + 'px';
      tipEl.style.top = (ev.clientY - rect.top + 10) + 'px';
    }
  });
}

createDiagram();

/* --------------------------
   Small UI interactions
   --------------------------*/
document.getElementById('view-activities').addEventListener('click', ()=>{
  document.getElementById('activities').scrollIntoView({behavior:'smooth'});
});

/* --------------------------
   Accessibility: reduce motion if requested
   --------------------------*/
const media = window.matchMedia('(prefers-reduced-motion: reduce)');
if(media.matches){
  // stop animations that rely on heavy motion
  cancelAnimationFrame(draw);
  // remove subtle transforms
  document.querySelectorAll('.activity, .project').forEach(el => el.style.transition = 'none');
}
