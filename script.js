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

  // Role rotator
  const roles = ["Backend Developer", "Data Scientist", "ML Enthusiast", "Mobile Developer"];
  let roleIdx = 0;
  const roleText = document.getElementById('role-text');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    setInterval(() => {
      roleText.style.opacity = 0;
      roleText.style.transform = 'translateY(6px) scale(.92)';
      setTimeout(() => {
        roleIdx = (roleIdx + 1) % roles.length;
        roleText.textContent = roles[roleIdx];
        roleText.style.opacity = 1;
        roleText.style.transform = 'translateY(0) scale(1)';
      }, 300);
    }, 2400);
  }
  roleText.style.transition = 'opacity .3s ease, transform .35s cubic-bezier(.34,1.56,.64,1)';
  roleText.style.display = 'inline-block';

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // Project filter
  const filterBar = document.getElementById('filter-bar');
  const highlight = document.getElementById('filter-highlight');
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.project-card');

  function moveHighlight(pill) {
    highlight.style.width = pill.offsetWidth + 'px';
    highlight.style.transform = `translateX(${pill.offsetLeft - 5}px)`;
  }
  window.addEventListener('load', () => moveHighlight(document.querySelector('.filter-pill.active')));
  window.addEventListener('resize', () => moveHighlight(document.querySelector('.filter-pill.active')));

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      moveHighlight(pill);
      const filter = pill.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        if (match) {
          card.classList.remove('hide');
          card.style.opacity = 0;
          requestAnimationFrame(() => { card.style.opacity = 1; });
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // Sparkle cursor trail (fun little touch, desktop only, respects reduced motion)
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const sparkleColors = ['#7C5CFC', '#FF5FA2', '#22D3EE', '#FFC857'];
    let lastSpark = 0;
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastSpark < 60) return;
      lastSpark = now;
      const s = document.createElement('span');
      s.textContent = '✦';
      s.style.cssText = `
        position:fixed; left:${e.clientX}px; top:${e.clientY}px;
        color:${sparkleColors[Math.floor(Math.random() * sparkleColors.length)]};
        font-size:${8 + Math.random() * 8}px; pointer-events:none; z-index:9999;
        transform:translate(-50%,-50%); opacity:.9;
        transition:transform 700ms ease-out, opacity 700ms ease-out;
      `;
      document.body.appendChild(s);
      requestAnimationFrame(() => {
        s.style.transform = `translate(-50%,-50%) translateY(-18px) scale(.3) rotate(90deg)`;
        s.style.opacity = 0;
      });
      setTimeout(() => s.remove(), 720);
    });
  }

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