/* === main.js | Ahmar Muzaffar Portfolio === */
(function () {
  'use strict';

  /* === CONFIG === */
  const CONFIG = {
    typewriterSpeed: 80,
    typewriterDeleteSpeed: 40,
    typewriterPause: 1800,
    particleCount: 80,
    particleCountMobile: 30,
    particleMaxSpeed: 0.4,
    particleLineDistance: 120,
    tiltIntensityHero: 20,
    tiltIntensityCard: 12,
    scrollThreshold: 50,
    cursorTrailLerp: 0.15,
    debounceDelay: 250,
    roles: [
      'Full-Stack Developer',
      'Data Scientist',
      'MIS Engineer',
      'Problem Solver',
      'AI Integrator'
    ]
  };

  /* === UTILITIES === */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function isTouchDevice() {
    return window.matchMedia('(hover: none)').matches;
  }

  /* === DOM CACHE === */
  const cursorEl = document.getElementById('cursor');
  const trailEl = document.getElementById('cursorTrail');
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navOverlay = document.getElementById('navOverlay');
  const navOverlayLinks = navOverlay ? navOverlay.querySelectorAll('.nav__overlay-link') : [];
  const typewriterEl = document.getElementById('typewriter');
  const heroCard = document.getElementById('heroCard');
  const canvas = document.getElementById('particles-canvas');
  const emailCard = document.getElementById('emailCard');
  const emailValue = document.getElementById('emailValue');

  let ctx = null;
  if (canvas) {
    ctx = canvas.getContext('2d');
  }

  /* === STATE === */
  let mouseX = 0;
  let mouseY = 0;
  let trailX = 0;
  let trailY = 0;
  let particles = [];
  let animationFrameId = null;
  let isPageVisible = true;

  /* === EMAIL OBFUSCATION === */
  function initEmail() {
    if (!emailCard || !emailValue) return;
    const u = 'ahmarx403';
    const d = 'gmail.com';
    const address = u + '@' + d;
    emailValue.textContent = address;
    emailCard.href = 'mailto:' + address;
  }

  /* === PARTICLES === */
  function getParticleCount() {
    return window.innerWidth <= 768 ? CONFIG.particleCountMobile : CONFIG.particleCount;
  }

  function createParticle() {
    if (!canvas) return null;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * CONFIG.particleMaxSpeed,
      vy: (Math.random() - 0.5) * CONFIG.particleMaxSpeed,
      r: Math.random() * 2 + 1,
      o: Math.random() * 0.5 + 0.2
    };
  }

  function initParticles() {
    if (!canvas || !ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    const targetCount = getParticleCount();
    if (particles.length === 0) {
      for (let i = 0; i < targetCount; i++) {
        const p = createParticle();
        if (p) particles.push(p);
      }
    } else if (particles.length > targetCount) {
      particles.length = targetCount;
    }
  }

  function animateParticles() {
    if (!canvas || !ctx) return;
    if (!isPageVisible) {
      animationFrameId = requestAnimationFrame(animateParticles);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const len = particles.length;
    const lineDist = CONFIG.particleLineDistance;
    for (let i = 0; i < len; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,245,255,' + p.o + ')';
      ctx.fill();
      for (let j = i + 1; j < len; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = dx * dx + dy * dy;
        if (dist < lineDist * lineDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(0,245,255,' + (0.15 * (1 - Math.sqrt(dist) / lineDist)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    animationFrameId = requestAnimationFrame(animateParticles);
  }

  function pauseParticles() {
    isPageVisible = false;
  }

  function resumeParticles() {
    isPageVisible = true;
  }

  /* === CURSOR === */
  function initCursor() {
    if (!cursorEl || !trailEl) return;
    if (isTouchDevice()) {
      cursorEl.style.display = 'none';
      trailEl.style.display = 'none';
      document.body.style.cursor = 'auto';
      return;
    }
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorEl.style.transform = 'translate(' + (mouseX - 10) + 'px,' + (mouseY - 10) + 'px)';
    }, { passive: true });

    (function trailLoop() {
      trailX += (mouseX - trailX) * CONFIG.cursorTrailLerp;
      trailY += (mouseY - trailY) * CONFIG.cursorTrailLerp;
      trailEl.style.transform = 'translate(' + (trailX - 4) + 'px,' + (trailY - 4) + 'px)';
      requestAnimationFrame(trailLoop);
    }());
  }

  /* === NAVIGATION === */
  function handleNavScroll() {
    if (!navbar) return;
    navbar.classList.toggle('nav--scrolled', window.scrollY > CONFIG.scrollThreshold);
  }

  function closeOverlay() {
    if (!hamburger || !navOverlay) return;
    hamburger.classList.remove('nav__hamburger--active');
    navOverlay.classList.remove('nav__overlay--active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function initNav() {
    if (!navbar) return;
    window.addEventListener('scroll', debounce(handleNavScroll, 10), { passive: true });
    handleNavScroll();

    if (hamburger && navOverlay) {
      hamburger.addEventListener('click', function () {
        const isActive = navOverlay.classList.contains('nav__overlay--active');
        if (isActive) {
          closeOverlay();
        } else {
          hamburger.classList.add('nav__hamburger--active');
          navOverlay.classList.add('nav__overlay--active');
          hamburger.setAttribute('aria-expanded', 'true');
          document.body.style.overflow = 'hidden';
        }
      });

      navOverlayLinks.forEach(function (link) {
        link.addEventListener('click', closeOverlay);
      });

      navOverlay.addEventListener('click', function (e) {
        if (e.target === navOverlay) closeOverlay();
      });
    }

    // Active section highlighting
    if ('IntersectionObserver' in window) {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav__link');
      const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.toggle(
                'nav__link--active',
                link.getAttribute('href') === '#' + id
              );
            });
          }
        });
      }, { threshold: 0.3, rootMargin: '-60px 0px -40% 0px' });
      sections.forEach(function (s) { sectionObserver.observe(s); });
    }
  }

  /* === TYPEWRITER === */
  function initTypewriter() {
    if (!typewriterEl) return;
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    (function tick() {
      const word = CONFIG.roles[roleIdx];
      if (!deleting) {
        typewriterEl.textContent = word.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === word.length) {
          deleting = true;
          setTimeout(tick, CONFIG.typewriterPause);
          return;
        }
      } else {
        typewriterEl.textContent = word.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % CONFIG.roles.length;
        }
      }
      setTimeout(tick, deleting ? CONFIG.typewriterDeleteSpeed : CONFIG.typewriterSpeed);
    }());
  }

  /* === SCROLL ANIMATIONS === */
  function initScrollAnimations() {
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
      revealEls.forEach(function (el) { obs.observe(el); });
    } else {
      // Graceful fallback: show all
      revealEls.forEach(function (el) { el.classList.add('reveal--visible'); });
    }
  }

  /* === TILT EFFECT === */
  function applyTilt(el, intensity) {
    if (!el) return;
    el.addEventListener('mousemove', function (e) {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = 'rotateY(' + (x * intensity) + 'deg) rotateX(' + (-y * intensity) + 'deg)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = 'rotateY(0) rotateX(0)';
    });
  }

  function initTilt() {
    if (isTouchDevice()) return;
    if (heroCard) applyTilt(heroCard, CONFIG.tiltIntensityHero);
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      applyTilt(el, CONFIG.tiltIntensityCard);
    });
  }

  /* === SKILL CUBE === */
  // The cube is CSS-only animated. No additional JS needed.
  // Placeholder for future interactive cube control.

  /* === VISIBILITY CHANGE === */
  function initVisibilityChange() {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        pauseParticles();
      } else {
        resumeParticles();
      }
    });
  }

  /* === RESIZE HANDLER === */
  function initResize() {
    window.addEventListener('resize', debounce(function () {
      if (canvas && ctx) {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.offsetWidth;
          canvas.height = parent.offsetHeight;
        }
        // Adjust particle count for new viewport
        const target = getParticleCount();
        while (particles.length < target) {
          const p = createParticle();
          if (p) particles.push(p);
        }
        if (particles.length > target) {
          particles.length = target;
        }
      }
    }, CONFIG.debounceDelay), { passive: true });
  }

  /* === INIT === */
  function init() {
    initEmail();
    initParticles();
    animateParticles();
    initCursor();
    initNav();
    initTypewriter();
    initScrollAnimations();
    initTilt();
    initVisibilityChange();
    initResize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
