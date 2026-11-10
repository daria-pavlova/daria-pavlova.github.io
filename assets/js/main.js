/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 14 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Feedback form submission (Formspree)
   */
  document.querySelectorAll('.feedback-form').forEach((form) => {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const loadingEl = form.querySelector('.loading');
      const errorEl = form.querySelector('.error-message');
      const sentEl = form.querySelector('.sent-message');

      loadingEl.classList.add('d-block');
      errorEl.classList.remove('d-block');
      sentEl.classList.remove('d-block');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          loadingEl.classList.remove('d-block');
          if (response.ok) {
            sentEl.classList.add('d-block');
            form.reset();
          } else {
            return response.json().then(data => {
              throw new Error((data.errors || []).map(e => e.message).join(', ') || 'Form submission failed.');
            });
          }
        })
        .catch(error => {
          loadingEl.classList.remove('d-block');
          errorEl.textContent = error.message;
          errorEl.classList.add('d-block');
        });
    });
  });

})();

/**
 * Animated avatar in the sidebar.
 * - At the top of the page the profile photo is shown.
 * - Once the visitor scrolls, it swaps to the illustrated avatar typing on a laptop.
 * - When the mouse moves, she glances up at the cursor for a moment, then looks
 *   back down at the laptop and keeps typing.
 */
(function () {
  "use strict";

  const wrap = document.querySelector('.header .profile-img');
  const svg = wrap && wrap.querySelector('.memoji');
  if (!svg) return;

  const SHOW_AFTER_PX = 60;     // scroll distance before the avatar replaces the photo
  const LOOK_IDLE_MS = 1400;    // look back down this long after the mouse stops
  const LOOK_MAX_MS = 4000;     // never stare at the cursor longer than this...
  const LOOK_REST_MS = 2200;    // ...without getting back to work for a bit
  const SCROLL_LOCK_MS = 450;   // eyes stay on the laptop while the page is scrolling

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const head = svg.querySelector('.memoji-head');
  const hairBack = svg.querySelector('.memoji-hair-back');
  const brows = svg.querySelector('.memoji-brows');
  const laptop = svg.querySelector('.memoji-laptop');
  const irises = svg.querySelectorAll('.memoji-iris');
  const lids = svg.querySelectorAll('.memoji-lid');
  const dots = svg.querySelectorAll('.memoji-dots circle');

  // Everything eases towards a target each frame.
  const cur = { x: 0, y: 1, lid: 0.22, brow: 0, typing: 1 };
  let pointer = null;
  let lastMove = -Infinity;
  let watching = false;
  let touching = false;
  let watchStart = 0;
  let lockUntil = 0;
  let nextBlink = 0;
  let blinkUntil = 0;
  let rafId = 0;
  let onScreen = true;

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      onScreen = entries[entries.length - 1].isIntersecting;
    }).observe(wrap);
  }

  const lerp = (a, b, k) => a + (b - a) * k;
  const tf = (el, value) => el.setAttribute('transform', value);

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    if (!onScreen) return; // sidebar is slid away on small screens until the menu is opened

    // A finger on the screen is followed for as long as it is down, even while scrolling.
    const wantsToWatch = pointer && (touching || (now - lastMove < LOOK_IDLE_MS && now > lockUntil));
    if (wantsToWatch && !watching) watchStart = now;
    watching = !!wantsToWatch;
    if (watching && !touching && now - watchStart > LOOK_MAX_MS) {
      watching = false;
      lockUntil = now + LOOK_REST_MS;
    }

    let tx, ty, tLid, tBrow;
    if (watching) {
      const r = wrap.getBoundingClientRect();
      const dx = pointer.x - (r.left + r.width / 2);
      const dy = pointer.y - (r.top + r.height * 0.56);
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, dist / 140);
      tx = (dx / dist) * reach;
      ty = (dy / dist) * reach;
      tLid = 0;
      tBrow = 1;
    } else {
      // Eyes on the laptop, scanning along the line being typed.
      tx = reduceMotion ? 0 : Math.sin(now / 420) * 0.35;
      ty = 1;
      tLid = 0.22;
      tBrow = 0;
    }

    if (now > nextBlink) {
      blinkUntil = now + 120;
      nextBlink = now + 2400 + Math.random() * 3200;
    }
    const blinking = now < blinkUntil;

    cur.x = lerp(cur.x, tx, 0.16);
    cur.y = lerp(cur.y, ty, 0.16);
    cur.lid = lerp(cur.lid, blinking ? 1 : tLid, blinking ? 0.6 : 0.25);
    cur.brow = lerp(cur.brow, tBrow, 0.15);
    cur.typing = lerp(cur.typing, watching || reduceMotion ? 0 : 1, 0.12);

    const bob = Math.sin(now / 95) * 0.7 * cur.typing;
    const hx = cur.x * 2.6;
    const hy = cur.y * 1.8 + bob;

    irises.forEach(el => tf(el, `translate(${(cur.x * 5).toFixed(2)} ${(cur.y * 4.6).toFixed(2)})`));
    lids.forEach(el => tf(el, `translate(0 ${(cur.lid * 26).toFixed(2)})`));
    tf(brows, `translate(0 ${(-cur.brow * 2.6).toFixed(2)})`);
    tf(head, `translate(${hx.toFixed(2)} ${hy.toFixed(2)}) rotate(${(cur.x * 3).toFixed(2)} 100 160)`);
    tf(hairBack, `translate(${(hx * 0.5).toFixed(2)} ${(hy * 0.5).toFixed(2)})`);
    tf(laptop, `translate(0 ${(Math.max(0, Math.sin(now / 55)) * 0.7 * cur.typing).toFixed(2)})`);
    dots.forEach((el, i) => {
      const hop = Math.max(0, Math.sin(now / 150 - i * 0.9)) * 6 * cur.typing;
      tf(el, `translate(0 ${(-hop).toFixed(2)})`);
    });
  }

  function setActive(active) {
    wrap.classList.toggle('is-memoji', active);
    if (active && !rafId) {
      nextBlink = performance.now() + 1500;
      rafId = requestAnimationFrame(frame);
    } else if (!active && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  // 'auto': photo at the top, avatar once scrolled. The hover options pin one or the other.
  let mode = 'auto';
  const options = wrap.querySelectorAll('.avatar-option');

  function update() {
    const showAvatar = mode === 'auto' ? window.scrollY > SHOW_AFTER_PX : mode === 'memoji';
    setActive(showAvatar);
  }

  function onScroll() {
    lockUntil = Math.max(lockUntil, performance.now() + SCROLL_LOCK_MS);
    update();
  }

  options.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      mode = btn.dataset.avatarMode;
      options.forEach(o => {
        o.classList.toggle('is-active', o === btn);
        o.setAttribute('aria-pressed', o === btn);
      });
      wrap.classList.remove('show-options');
      btn.blur();
      update();
    });
  });

  // Tapping the avatar opens the options on touch screens, where there is no hover.
  wrap.addEventListener('click', () => wrap.classList.toggle('show-options'));
  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) wrap.classList.remove('show-options');
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    pointer = { x: e.clientX, y: e.clientY };
    lastMove = performance.now();
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => { pointer = null; });

  // Touch: pointer events stop once the browser starts scrolling, so use touch events,
  // which keep firing while the finger drags.
  function onTouch(e) {
    const t = e.touches[0];
    if (!t) return;
    pointer = { x: t.clientX, y: t.clientY };
    lastMove = performance.now();
    touching = true;
  }
  function onTouchEnd(e) {
    if (e.touches.length) return;
    touching = false;
    lastMove = performance.now();
  }
  window.addEventListener('touchstart', onTouch, { passive: true });
  window.addEventListener('touchmove', onTouch, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });

  update();
})();

/**
 * Light / dark theme toggle. Dark is the default; the choice is remembered.
 */
(function () {
  "use strict";

  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const root = document.documentElement;
  const icon = btn.querySelector('i');
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function render() {
    const light = root.getAttribute('data-theme') === 'light';
    const label = light ? 'Switch to dark theme' : 'Switch to light theme';
    icon.className = light ? 'bi bi-moon-stars' : 'bi bi-sun';
    btn.setAttribute('aria-label', label);
    btn.title = label;
    if (themeColor) themeColor.content = light ? '#f5f7fb' : '#0a0e14';
  }

  btn.addEventListener('click', () => {
    const light = root.getAttribute('data-theme') === 'light';
    if (light) root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', 'light');
    try { localStorage.setItem('theme', light ? 'dark' : 'light'); } catch (e) {}
    render();
  });

  render();
})();
