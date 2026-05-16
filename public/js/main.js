// ─── NAV SCROLL ──────────────────────────────────────────
(function() {
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }
})();

// ─── MOBILE MENU ────────────────────────────────────────
function openMobileMenu() {
  var m = document.getElementById('mobileMenu');
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeMobileMenu() {
  var m = document.getElementById('mobileMenu');
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}

// ─── HERO SLIDESHOW ─────────────────────────────────────
(function() {
  var current = 0;
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dot');

  if (slides.length === 0) return;

  function goSlide(n) {
    if (!slides[current] || !dots[current]) return;
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    if (slides[current]) slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  setInterval(function() { goSlide(current + 1); }, 5000);

  document.querySelectorAll('[data-slide]').forEach(function(dot) {
    dot.addEventListener('click', function() {
      var n = parseInt(this.getAttribute('data-slide'));
      slides.forEach(function(s) { s.classList.remove('active'); });
      document.querySelectorAll('.hero-dot').forEach(function(d) { d.classList.remove('active'); });
      if (slides[n]) slides[n].classList.add('active');
      this.classList.add('active');
    });
  });
})();

// ─── REVEAL ON SCROLL ───────────────────────────────────
(function() {
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(function(el) { observer.observe(el); });
})();

// ─── GALLERY FILTER ─────────────────────────────────────
function filterGallery(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.gallery-item').forEach(function(item) {
    item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
  });
}

// ─── LIGHTBOX ───────────────────────────────────────────
function openLightbox(src) {
  var img = document.getElementById('lightbox-img');
  var lb = document.getElementById('lightbox');
  if (img) img.src = src;
  if (lb) { lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeLightbox() {
  var lb = document.getElementById('lightbox');
  if (lb) { lb.classList.remove('open'); document.body.style.overflow = ''; }
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLightbox();
});

// ─── STAR RATING ────────────────────────────────────────
var selectedStars = 0;
function setStars(n) {
  selectedStars = n;
  document.querySelectorAll('.star-btn').forEach(function(btn, i) {
    btn.classList.toggle('active', i < n);
  });
}

// ─── FILE UPLOAD ────────────────────────────────────────
function handleFiles(e) {
  var names = Array.from(e.target.files).map(function(f) { return f.name; }).join(', ');
  var el = document.getElementById('fileNames');
  if (el) el.textContent = names ? '📎 ' + names : '';
}

// ─── TOON SUCCESS MELDING ───────────────────────────────
function toonSuccess(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.add('show');
  setTimeout(function() { el.classList.remove('show'); }, 5000);
}

// ─── FORM SUBMISSIONS ───────────────────────────────────
function submitReview(e) {
  e.preventDefault();
  toonSuccess('reviewSuccess');

  var form = document.getElementById('reviewForm');
  if (!form) return;

  var name = form.querySelector('input[placeholder="Naam of initialen"]');
  var stars = document.querySelectorAll('.star-btn.active').length;
  var dienst = form.querySelector('select');
  var message = form.querySelector('textarea');

  fetch('/api/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name ? name.value : '',
      stars: stars || 5,
      dienst: dienst ? dienst.value : '',
      message: message ? message.value : ''
    })
  }).catch(function() { });

  form.reset();
  setStars(0);
}

function submitOfferte(e) {
  e.preventDefault();
  toonSuccess('offerteSuccess');
  var form = document.getElementById('offerteForm');
  if (form) form.reset();
  var fn = document.getElementById('fileNames');
  if (fn) fn.textContent = '';
}

function submitContact(e) {
  e.preventDefault();
  toonSuccess('contactSuccess');
  var form = document.getElementById('contactForm');
  if (form) form.reset();
}

// ─── PARALLAX HERO ─────────────────────────────────────
window.addEventListener('scroll', function() {
  var y = window.scrollY;
  document.querySelectorAll('.hero-slide').forEach(function(slide) {
    slide.style.transform = 'translateY(' + (y * 0.3) + 'px)';
  });
});

// ─── INITIAL REVEAL ────────────────────────────────────
setTimeout(function() {
  document.querySelectorAll('#hero .reveal').forEach(function(el, i) {
    setTimeout(function() { el.classList.add('visible'); }, 200 + i * 150);
  });
}, 100);

// ─── CSP-SAFE EVENT LISTENERS ──────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  // HAMBURGER MENU
  var ham = document.getElementById('hamburgerBtn');
  var menu = document.getElementById('mobileMenu');
  var closeBtn = document.getElementById('mobileCloseBtn');

  if (ham && menu) {
    ham.addEventListener('click', function() {
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    menu.addEventListener('click', function(e) {
      if (e.target === this) {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // LIGHTBOX SLUITEN
  document.querySelectorAll('[data-close="lightbox"]').forEach(function(el) {
    el.addEventListener('click', function() {
      var lb = document.getElementById('lightbox');
      if (lb) { lb.classList.remove('open'); document.body.style.overflow = ''; }
    });
  });

  // LIGHTBOX OPENEN via data-lightbox
  document.querySelectorAll('[data-lightbox]').forEach(function(el) {
    el.addEventListener('click', function() {
      var src = this.getAttribute('data-lightbox');
      var img = document.getElementById('lightbox-img');
      var lb = document.getElementById('lightbox');
      if (img) img.src = src;
      if (lb) { lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
    });
  });

  // STARS via data-star
  document.querySelectorAll('[data-star]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var n = parseInt(this.getAttribute('data-star'));
      document.querySelectorAll('[data-star]').forEach(function(s, i) {
        s.classList.toggle('active', i < n);
      });
    });
  });

  // FILTER BUTTONS
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var cat = this.getAttribute('data-filter');
      filterGallery(cat, this);
    });
  });
});
