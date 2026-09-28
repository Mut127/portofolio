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
  const roles = ["Informatics Graduate","Technical Writer", "AI Enthusiast", "Fullstack Developer", "Data Scientist", "System Designer"];
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

  // "Read more" -> opens a modal instead of expanding inline in the grid
  // (so other cards in the same row don't stretch or change height)
  const projectModal = document.getElementById('project-modal');
  const projectModalMedia = document.getElementById('project-modal-media');
  const projectModalImg = document.getElementById('project-modal-img');
  const projectModalName = document.getElementById('project-modal-name');
  const projectModalDesc = document.getElementById('project-modal-desc');
  const projectModalStack = document.getElementById('project-modal-stack');

  function openProjectModal(card) {
    const name = card.querySelector('.project-name')?.textContent.trim() || '';
    const desc = card.querySelector('.project-desc')?.textContent.trim() || '';
    const tags = [...card.querySelectorAll('.stack-tag')].map(t => t.textContent.trim());
    const imgEl = card.querySelector('.project-thumb img');

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
    projectModal.classList.add('open');
  }
  function closeProjectModal() {
    projectModal.classList.remove('open');
  }
  document.querySelectorAll('.project-card').forEach(card => {
    const desc = card.querySelector('.project-desc');
    if (!desc) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'project-readmore';
    btn.textContent = 'Read more →';
    desc.insertAdjacentElement('afterend', btn);
    btn.addEventListener('click', () => openProjectModal(card));
  });
  document.getElementById('project-modal-close')?.addEventListener('click', closeProjectModal);
  projectModal?.addEventListener('click', (e) => {
    if (e.target.id === 'project-modal') closeProjectModal();
  });

  function moveHighlight(pill) {
    if (!pill) return;
    highlight.style.width = pill.offsetWidth + 'px';
    highlight.style.height = pill.offsetHeight + 'px';
    highlight.style.transform = `translate(${pill.offsetLeft - 5}px, ${pill.offsetTop - 5}px)`;
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

 
(function () {
  var DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
  var SIMPLE = 'https://cdn.simpleicons.org/';
  var SPEED = 40; // px per detik, makin besar makin cepat
  var NS = 'http://www.w3.org/2000/svg';

  var section = document.getElementById('skills');
  if (!section) return;

  function iconUrl(spec) {
    if (spec.indexOf('si:') === 0) return SIMPLE + spec.slice(3);
    return DEVICON + spec + '/' + spec + '-original.svg';
  }

  function canLoad(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(true); };
      img.onerror = function () { resolve(false); };
      img.src = url;
    });
  }

  // pasang logo di tiap badge, kalau gagal dimuat pakai titik ungu
  async function decorate(badge) {
    var spec = badge.getAttribute('data-icon');
    var el = null;

    if (spec && spec.indexOf('svg:') === 0) {
      el = document.createElementNS(NS, 'svg');
      el.setAttribute('class', 'ico');
      el.setAttribute('aria-hidden', 'true');
      var use = document.createElementNS(NS, 'use');
      use.setAttribute('href', '#i-' + spec.slice(4));
      el.appendChild(use);
    } else if (spec) {
      var url = iconUrl(spec);
      if (await canLoad(url)) {
        el = new Image();
        el.src = url;
        el.alt = '';
        el.className = 'ico';
        el.width = 20;
        el.height = 20;
      }
    }

    if (!el) {
      el = document.createElement('span');
      el.className = 'dot';
    }
    badge.prepend(el);
  }

  // ulang isi badge sampai cukup lebar, lalu gandakan supaya loop-nya mulus
  function buildMarquee(marquee) {
    var base = marquee._base;
    marquee.innerHTML = '<div class="marquee-group">' + base + '</div>';
    var group = marquee.firstElementChild;

    var guard = 0;
    while (group.offsetWidth < marquee.clientWidth && guard < 12) {
      group.insertAdjacentHTML('beforeend', base);
      guard++;
    }

    var copy = group.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    marquee.appendChild(copy);

    marquee.style.setProperty('--dur', (group.offsetWidth / SPEED) + 's');
  }

  async function init() {
    var badges = Array.prototype.slice.call(section.querySelectorAll('.skill-badge'));
    await Promise.all(badges.map(decorate));

    var marquees = Array.prototype.slice.call(section.querySelectorAll('.marquee'));
    marquees.forEach(function (m) {
      m._base = m.querySelector('.marquee-group').innerHTML;
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      marquees.forEach(function (m) { m.classList.add('is-static'); });
      return;
    }

    function buildAll() { marquees.forEach(buildMarquee); }
    buildAll();

    var timer;
    window.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(buildAll, 250);
    });
  }

  function start() {
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(init);
  }

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
