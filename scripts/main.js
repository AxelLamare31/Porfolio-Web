// Background particles + neon cursor
(() => {
  const canvas = document.getElementById('bg-canvas');
  const cursor = document.getElementById('neon-cursor');
  if (!canvas || !cursor) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;

  const opts = {count: 40, size: 1.2, speed: 0.2, hue: 200};
  const particles = [];

  function rand(min, max){return Math.random() * (max - min) + min}

  function init(){
    particles.length = 0;
    for(let i=0;i<opts.count;i++) particles.push({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: rand(-opts.speed,opts.speed),
      vy: rand(-opts.speed,opts.speed),
      r: rand(20,80),
      a: rand(0.02,0.6)
    });
  }

  function resize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    init();
  }

  addEventListener('resize', resize);

  let mouse = {x:-9999,y:-9999};

  addEventListener('mousemove', (e)=>{
    mouse.x = e.clientX; mouse.y = e.clientY;
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });
  addEventListener('mouseleave', ()=>{mouse.x=-9999;mouse.y=-9999});

  function draw(){
    ctx.clearRect(0,0,w,h);
    // subtle gradient background overlay
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'rgba(7,16,41,0.25)');
    g.addColorStop(1,'rgba(8,12,30,0.35)');
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

    for(const p of particles){
      // move
      p.x += p.vx; p.y += p.vy;
      if(p.x<-100) p.x = w+100; if(p.x> w+100) p.x = -100;
      if(p.y<-100) p.y = h+100; if(p.y> h+100) p.y = -100;

      // distance to mouse
      const dx = p.x - mouse.x; const dy = p.y - mouse.y; const d = Math.sqrt(dx*dx+dy*dy);
      let alpha = p.a;
      if(d < 220) alpha = Math.min(1, p.a + (220-d)/220 * 0.8);

      const grd = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
      grd.addColorStop(0, `rgba(255,47,161,${alpha})`);
      grd.addColorStop(0.4, `rgba(255,47,161,${alpha*0.18})`);
      grd.addColorStop(1, 'rgba(7,12,30,0)');

      ctx.beginPath(); ctx.fillStyle = grd; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  // project hover: add glow to cursor
  document.querySelectorAll('.project').forEach(el=>{
    el.addEventListener('mouseenter', ()=>{cursor.style.transform = 'translate(-50%,-50%) scale(1.25)'; cursor.style.opacity = '0.95'});
    el.addEventListener('mouseleave', ()=>{cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.opacity = '0.6'});
  });

  init(); draw();
})();

// Ensure videos autoplay on user gesture-friendly way
(() => {
  const vids = document.querySelectorAll('video[autoplay]');
  function tryPlay(v){
    v.play().catch(()=>{
      v.muted = true; v.play().catch(()=>{});
    });
  }
  vids.forEach(v=>tryPlay(v));
})();

// Showreel mute toggle (keeps autoplay muted by default but allows user to unmute)
(function(){
  const video = document.getElementById('showreelVideo');
  const btn = document.getElementById('muteToggle');
  if(!video || !btn) return;

  function update(){
    const muted = Boolean(video.muted);
    btn.setAttribute('aria-pressed', String(!muted));
    btn.textContent = muted ? 'Activer le son' : 'Couper le son';
  }

  update();

  btn.addEventListener('click', ()=>{
    video.muted = !video.muted;
    if(!video.muted) video.play().catch(()=>{});
    update();
  });

  // clicking the video is an intuitive gesture to unmute; prevent default click pause
  video.addEventListener('click', (e)=>{
    e.preventDefault(); e.stopPropagation();
    if(video.muted){ video.muted = false; video.play().catch(()=>{}); update(); }
  });

  btn.addEventListener('keydown', (e)=>{
    if(e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); btn.click(); }
  });
})();
