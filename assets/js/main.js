(function () {
  'use strict';

  /* ---- Theme toggle ---- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('td-theme'); } catch (e) {}
  if (stored) root.setAttribute('data-theme', stored);

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      var isDark = current ? current === 'dark' : prefersDark;
      var next = isDark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('td-theme', next); } catch (e) {}
    });
  });

  /* ---- Mobile nav drawer ---- */
  var navToggle = document.querySelector('[data-nav-toggle]');
  var drawer = document.querySelector('[data-mobile-drawer]');
  var drawerClose = document.querySelector('[data-drawer-close]');
  function openDrawer() { if (drawer) { drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); } }
  function closeDrawer() { if (drawer) { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); } }
  if (navToggle) navToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeDrawer); });
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el, i) {
      el.style.setProperty('--i', i % 6);
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll('[data-counter]');
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-counter'));
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased * 10) / 10;
      el.textContent = (Number.isInteger(target) ? Math.round(value) : value) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var ioCounter = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          ioCounter.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { ioCounter.observe(el); });
  }

  /* ---- Hero word rotator ---- */
  var rotator = document.querySelector('[data-rotator]');
  if (rotator) {
    var words = JSON.parse(rotator.getAttribute('data-rotator'));
    var idx = 0;
    var span = document.createElement('span');
    span.className = 'rotator-word';
    span.textContent = words[0];
    rotator.appendChild(span);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInterval(function () {
        idx = (idx + 1) % words.length;
        span.style.opacity = '0';
        span.style.transform = 'translateY(8px)';
        setTimeout(function () {
          span.textContent = words[idx];
          span.style.transition = 'none';
          span.style.transform = 'translateY(-8px)';
          requestAnimationFrame(function () {
            span.style.transition = 'opacity .4s ease, transform .4s ease';
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          });
        }, 400);
      }, 2600);
    }
  }

  /* ---- Privacy-friendly page analytics ---- */
  try {
    navigator.sendBeacon('/api/analytics', new Blob([JSON.stringify({ path: window.location.pathname, referrer: document.referrer })], { type: 'application/json' }));
  } catch (e) {}

  /* ---- Active nav link ---- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-drawer a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---- Contact form (fallback, no backend required) ---- */
  var contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = contactForm.querySelector('[data-form-status]');
      var btn = contactForm.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Envoi en cours...';
      btn.disabled = true;
      var data = new FormData(contactForm);
      var payload = {
        nom: data.get('nom'),
        email: data.get('email'),
        type_projet: data.get('type_projet'),
        budget_indicatif: data.get('budget'),
        description: data.get('message')
      };
      fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error('network');
        if (status) {
          status.textContent = 'Message envoyé ! Je vous réponds sous 24 à 48h ouvrées.';
          status.style.color = 'var(--color-success)';
        }
        contactForm.reset();
      }).catch(function () {
        if (status) {
          status.textContent = 'L\'envoi automatique est momentanément indisponible. Contactez-moi directement par email — voir la section contact.';
          status.style.color = 'var(--color-warning)';
        }
      }).finally(function () {
        btn.textContent = originalText;
        btn.disabled = false;
      });
    });
  }
})();
