// Mobile menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });
  document.querySelectorAll('.nav-close-link').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // Project modal (dibuka dari polaroid)
  const projectModal = document.getElementById('project-modal');
  const projectModalMedia = document.getElementById('project-modal-media');
  const projectModalImg = document.getElementById('project-modal-img');
  const projectModalName = document.getElementById('project-modal-name');
  const projectModalDesc = document.getElementById('project-modal-desc');
  const projectModalStack = document.getElementById('project-modal-stack');
  const projectModalLink = document.getElementById('project-modal-link');

  function openProjectModal(card) {
    const name = card.querySelector('.project-name')?.textContent.trim() || '';
    const desc = card.querySelector('.project-desc')?.textContent.trim() || '';
    const tags = [...card.querySelectorAll('.stack-tag')].map(t => t.textContent.trim());
    const imgEl = card.querySelector('.project-thumb img');
    const link = card.querySelector('.project-github');

    if (imgEl && imgEl.src) {
      projectModalImg.src = imgEl.src;
      projectModalImg.alt = name;
      projectModalMedia.classList.remove('hide');
    } else {
      projectModalMedia.classList.add('hide');
    }
    projectModalName.textContent = name;
    projectModalDesc.textContent = desc;
    projectModalStack.innerHTML = tags.map(t => `<span class="stack-tag">${t}</span>`).join('');
    if (link) {
      projectModalLink.href = link.href;
      projectModalLink.innerHTML = link.innerHTML;
      projectModalLink.style.display = '';
    } else {
      projectModalLink.style.display = 'none';
    }
    projectModal.classList.add('open');
  }
  function closeProjectModal() { projectModal.classList.remove('open'); }
  document.getElementById('project-modal-close')?.addEventListener('click', closeProjectModal);
  projectModal?.addEventListener('click', (e) => {
    if (e.target.id === 'project-modal') closeProjectModal();
  });

  // Portfolio: tumpukan folder. Klik folder -> naik ke depan & tampil project (polaroid)
  (function () {
    const stage = document.getElementById('folders');
    if (!stage) return;
    const CAT = { website: 'software', mobile: 'software', ml: 'ml', design: 'design', docs: 'docs' };
    const TAG = { website: 'Website', mobile: 'Mobile App' };
    const LABEL = { docs: 'Documentation', design: 'System Design', ml: 'AI & ML', software: 'Software' };
    const ROT = [-2, 1.4, -1, 1.8];
    const ORDER = ['docs', 'design', 'ml', 'software'];          // belakang -> depan
    const folders = {};
    stage.querySelectorAll('.folder').forEach(f => { folders[f.dataset.cat] = f; });
    let open = null;

    // bikin polaroid dari kartu project yang sudah ada
    document.querySelectorAll('.project-card').forEach(card => {
      const raw = card.dataset.cat;
      const host = folders[CAT[raw]]?.querySelector('.polaroids');
      if (!host) return;
      const name = card.querySelector('.project-name')?.textContent.trim() || '';
      const img = card.querySelector('.project-thumb img');
      const art = card.querySelector('.thumb-art');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'polaroid';
      b.setAttribute('aria-label', name);
      b.style.setProperty('--i', host.children.length);
      b.style.setProperty('--rot', ROT[host.children.length % ROT.length] + 'deg');
      b.innerHTML = '<img class="pol-clip" src="image/clip.png" alt="" draggable="false"><span class="pol-photo"></span><span class="pol-cap"><span class="pol-name"></span><span class="pol-tag"></span></span>';
      const photo = b.querySelector('.pol-photo');
      if (img) {
        const im = new Image();
        im.src = (img.getAttribute('src') || '').trim();
        im.alt = ''; im.loading = 'lazy'; im.draggable = false;
        photo.appendChild(im);
      } else if (art) {
        photo.style.background = art.style.background;
      }
      b.querySelector('.pol-name').textContent = name;
      b.querySelector('.pol-tag').textContent = CAT[raw] === 'software' ? (TAG[raw] || '') : (card.querySelector('.project-index')?.textContent.trim() || '');
      b.addEventListener('click', () => openProjectModal(card));
      host.appendChild(b);
    });

// judul kecil di dalam tiap folder, mis. "Software · 8 projects"
    Object.entries(folders).forEach(([cat, f]) => {
      const host = f.querySelector('.polaroids');
      const n = host.children.length;
      const head = document.createElement('div');
      head.className = 'folder-head';
      head.textContent = LABEL[cat] + ' · ' + n + (n === 1 ? ' project' : ' projects');
      host.before(head);
    });

    function layout() {
      const order = open ? ORDER.filter(c => c !== open).concat(open) : ORDER;
      order.forEach((c, i) => {
        const f = folders[c];
        f.style.setProperty('--pos', i);
        f.classList.toggle('is-open', c === open);
        f.querySelector('.folder-tab').setAttribute('aria-expanded', c === open ? 'true' : 'false');
      });
      stage.classList.toggle('has-open', !!open);
      const content = open && folders[open].querySelector('.folder-content');
      stage.style.setProperty('--body-h', content ? content.scrollHeight + 'px' : '');
    }

    Object.entries(folders).forEach(([cat, f]) => {
      f.addEventListener('click', (e) => {
        if (e.target.closest('.polaroid')) return;
        if (open === cat) {
          if (e.target.closest('.folder-tab')) { open = null; layout(); }   // klik tab lagi = tutup
          return;
        }
        open = cat; layout();
      });
    });
    window.addEventListener('resize', () => { if (open) layout(); });
    window.addEventListener('load', () => { if (open) layout(); });
  })();

  // Lightbox (for hero/project image expand if real photos are added later)
  function openLightbox(src, caption) {
    if (!src) return; // no real screenshot yet
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox-caption').textContent = caption;
    document.getElementById('lightbox').classList.add('open');
  }
  function closeLightbox(e) {
    if (e.target.id === 'lightbox') document.getElementById('lightbox').classList.remove('open');
  }

 
// Tech stack: curved (cylinder) 3D carousel. Auto-scroll kanan -> kiri, drag + momentum
  (function () {
    const stage = document.getElementById('tech-stage');
    if (!stage) return;
    const cards = [...stage.querySelectorAll('.tech-card')];
    const N = cards.length;
    let pos = 0, vel = 0, dragging = false, lastX = 0, lastMove = 0;
    let W, P, L, R, speed, raf = null, prevT = 0, active = -1;

    const measure = () => {
      W = cards[0].offsetWidth; P = W * 1.12; L = N * P; R = W * 3.6;
      speed = reduceMotion ? 0 : W * 0.19;          // px per detik
      stage.style.perspective = (R * 1.7) + 'px';
    };
    const render = () => {
      let best = -1, bestD = 1e9;
      for (let i = 0; i < N; i++) {
        let t = (i * P + pos) % L;
        if (t < 0) t += L;
        if (t > L / 2) t -= L;
        const th = t / R, a = Math.abs(th), c = cards[i];
        if (a > 1.35) { c.style.visibility = 'hidden'; continue; }
        c.style.visibility = 'visible';
        c.style.opacity = 1 - Math.min(1, Math.max(0, (a - 0.95) / 0.4));
        c.style.transform = 'translate(-50%,-50%) translate3d(' + (R * Math.sin(th)) + 'px,0,' + (R * (1 - Math.cos(th))) + 'px) rotateY(' + (-th) + 'rad)';
        if (Math.abs(t) < bestD) { bestD = Math.abs(t); best = i; }
      }
      if (best !== active) {
        if (active >= 0) cards[active].classList.remove('is-active');
        if (best >= 0) cards[best].classList.add('is-active');
        active = best;
      }
    };
    const tick = (now) => {
      const dt = Math.min(0.05, (now - prevT) / 1000); prevT = now;
      if (!dragging) {
        vel *= Math.exp(-3 * dt);                   // ~95% hilang per detik
        pos += (vel - speed) * dt;
      }
      render();
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (raf === null) { prevT = performance.now(); raf = requestAnimationFrame(tick); } };
    const stop = () => { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } };

    stage.addEventListener('pointerdown', (e) => {
      dragging = true; vel = 0; lastX = e.clientX; lastMove = performance.now();
      stage.setPointerCapture(e.pointerId);
      stage.classList.add('grabbing');
    });
    stage.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const now = performance.now(), dx = e.clientX - lastX;
      pos += dx;                                    // ikut jari 1:1
      const inst = dx / Math.max(1, now - lastMove) * 1000;
      vel = Math.max(-3000, Math.min(3000, vel * 0.6 + inst * 0.4));
      lastX = e.clientX; lastMove = now;
    });
    const release = () => {
      if (!dragging) return;
      dragging = false;
      if (performance.now() - lastMove > 80) vel = 0;
      stage.classList.remove('grabbing');
    };
    stage.addEventListener('pointerup', release);
    stage.addEventListener('pointercancel', release);
    stage.addEventListener('dragstart', (e) => e.preventDefault());

    new IntersectionObserver((en) => en[0].isIntersecting ? start() : stop(), { threshold: 0 }).observe(stage);
    window.addEventListener('resize', () => { measure(); render(); });
    measure(); render();
  })();

  // Hero: the cursor scrubs through the animation, frame by frame.
  // The atlas holds 92 consecutive video frames, ordered from "looking left" through the neutral pose
  // (index 51) to "looking right". Neighbouring frames are almost identical, so blending them is seamless.
  (function () {
    const stage = document.getElementById('hero-char');
    const canvas = document.getElementById('hero-head-canvas');
    if (!stage || !canvas || reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    const ctx = canvas.getContext('2d');
    const FW = 377, FH = 308, COLS = 10;
    const REST = 51, SEAM = 52, LAST = 91, SEAM_W = 0.12;
    const atlas = new Image();
    let tx = 0, cx = 0, raf = null, ready = false;
    const fallback = stage.querySelector('.hero-char-head img');

    // x: -1 (far left) .. 0 (rest) .. 1 (far right)  ->  position along the frame sequence
    const toPos = (x) => {
      if (x <= 0) return REST + x * REST;
      if (x < SEAM_W) { const t = x / SEAM_W; return REST + t * t * (3 - 2 * t) * (SEAM - REST); }
      return SEAM + (x - SEAM_W) / (1 - SEAM_W) * (LAST - SEAM);
    };
    const draw = (i, alpha) => {
      ctx.globalAlpha = alpha;
      ctx.drawImage(atlas, (i % COLS) * FW, Math.floor(i / COLS) * FH, FW, FH, 0, 0, FW, FH);
    };
    const render = () => {
      const p = toPos(cx);
      const i = Math.min(LAST, Math.floor(p));
      const f = p - i;
      ctx.clearRect(0, 0, FW, FH);
      draw(i, 1);
      if (f > 0.02 && i < LAST) draw(i + 1, f);
      ctx.globalAlpha = 1;
    };
    const tick = () => {
      cx += (tx - cx) * 0.2;
      if (Math.abs(tx - cx) < 0.0008) cx = tx;
      render();
      raf = cx !== tx ? requestAnimationFrame(tick) : null;
    };
    const kick = () => { if (ready && raf === null) raf = requestAnimationFrame(tick); };
    atlas.onload = () => {
      ready = true; render();
      canvas.classList.add('ready');
      if (fallback) fallback.classList.remove('on');   // hide the static head so it never shows through
    };
    atlas.src = 'image/hero-head-atlas.webp';
    window.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      let x = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.35);
      x = Math.max(-1, Math.min(1, x));
      tx = Math.abs(x) < 0.04 ? 0 : x;              // small dead zone: stay neutral near the face
      kick();
    }, { passive: true });
    const rest = () => { tx = 0; kick(); };
    window.addEventListener('blur', rest);
    document.addEventListener('mouseleave', rest);
  })();

  // Hero: interest chat that types and auto-scrolls
  (function () {
    const box = document.getElementById('chat-scroll');
    if (!box) return;
    const script = [
      { me: true,  t: 'What do you build?' },
      { t: 'Web Applications' },
      { t: 'Full Stack Developer' },
      { me: true,  t: 'How do you work?' },
      { t: 'Clean & Scalable Code' },
      { t: 'System Design' },
      { me: true,  t: 'Any extra skills?' },
      { t: 'AI Integration' },
      { t: 'Technical Writing' }
    ];
    const add = (m) => {
      const d = document.createElement('div');
      d.className = 'bubble ' + (m.me ? 'me' : 'interest');
      d.textContent = m.t;
      box.appendChild(d);
      return d;
    };
    const down = () => box.scrollTo({ top: box.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });

    if (reduceMotion) { script.forEach(add); down(); return; }

    const wait = (ms) => new Promise(r => setTimeout(r, ms));
    async function play() {
      for (const m of script) {
        if (!m.me) {
          const dots = document.createElement('div');
          dots.className = 'bubble interest typing';
          dots.innerHTML = '<i></i><i></i><i></i>';
          box.appendChild(dots); down();
          await wait(750);
          dots.remove();
        } else {
          await wait(500);
        }
        add(m); down();
        await wait(m.me ? 700 : 600);
      }
      await wait(3200);
      box.classList.add('fade-out');
      await wait(550);
      box.innerHTML = '';
      box.classList.remove('fade-out');
      await wait(300);
      play();
    }
    play();
  })();