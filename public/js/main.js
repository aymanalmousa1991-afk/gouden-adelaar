document.addEventListener('DOMContentLoaded', function() {

  // ─── HELPERS ─────────────────────────────────────────
  function qs(sel, parent) { return (parent || document).querySelector(sel); }
  function qsa(sel, parent) { return Array.from((parent || document).querySelectorAll(sel)); }

  function toonSuccess(id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.add('show');
      setTimeout(function() { el.classList.remove('show'); }, 5000);
    }
  }

  // ─── NAV SCROLL ──────────────────────────────────────
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ─── MOBILE MENU ─────────────────────────────────────
  var ham = document.getElementById('hamburgerBtn');
  var menu = document.getElementById('mobileMenu');

  if (ham && menu) {
    ham.addEventListener('click', function() {
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    qsa('a', menu).forEach(function(link) {
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

  // ─── HERO SLIDESHOW ─────────────────────────────────
  var current = 0;
  var slides = qsa('.hero-slide');
  var dots = qsa('.hero-dot');

  if (slides.length > 0) {
    function goSlide(n) {
      if (!slides[current]) return;
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      if (slides[current]) slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }
    setInterval(function() { goSlide(current + 1); }, 5000);
    qsa('[data-slide]').forEach(function(dot) {
      dot.addEventListener('click', function() {
        var n = parseInt(this.getAttribute('data-slide'));
        slides.forEach(function(s) { s.classList.remove('active'); });
        qsa('.hero-dot').forEach(function(d) { d.classList.remove('active'); });
        if (slides[n]) slides[n].classList.add('active');
        this.classList.add('active');
      });
    });
  }

  // ─── REVEAL ON SCROLL ───────────────────────────────
  var revealEls = qsa('.reveal, .reveal-left, .reveal-right');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(function(el) { observer.observe(el); });

  // ─── GALLERY ─────────────────────────────────────────
  function filterGallery(cat, btn) {
    qsa('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    qsa('.gallery-item').forEach(function(item) {
      item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
    });
  }

  qsa('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterGallery(this.getAttribute('data-filter'), this);
    });
  });

  // ─── LIGHTBOX ───────────────────────────────────────
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

  qsa('[data-close="lightbox"]').forEach(function(el) {
    el.addEventListener('click', function() { closeLightbox(); });
  });

  qsa('[data-lightbox]').forEach(function(el) {
    el.addEventListener('click', function() {
      var src = this.getAttribute('data-lightbox');
      var img = document.getElementById('lightbox-img');
      var lb = document.getElementById('lightbox');
      if (img) img.src = src;
      if (lb) { lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
    });
  });

  // ─── STAR RATING ────────────────────────────────────
  qsa('[data-star]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var n = parseInt(this.getAttribute('data-star'));
      qsa('[data-star]').forEach(function(s, i) {
        s.classList.toggle('active', i < n);
      });
    });
  });

  // ─── FILE UPLOAD ────────────────────────────────────
  var fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      var names = Array.from(e.target.files).map(function(f) { return f.name; }).join(', ');
      var el = document.getElementById('fileNames');
      if (el) el.textContent = names ? '📎 ' + names : '';
    });
  }

  // ─── REVIEW FORM ────────────────────────────────────
  var reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var name = qs('input', reviewForm);
      var dienst = qs('select', reviewForm);
      var message = qs('textarea', reviewForm);
      var stars = qsa('.star-btn.active').length;

      fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name ? name.value : '',
          stars: stars || 5,
          dienst: dienst ? dienst.value : '',
          message: message ? message.value : ''
        })
      }).then(function(r) { return r.json(); }).then(function(data) {
        toonSuccess('reviewSuccess');
      }).catch(function() {
        toonSuccess('reviewSuccess');
      });

      reviewForm.reset();
      qsa('.star-btn').forEach(function(b) { b.classList.remove('active'); });
    });
  }

  // ─── OFFERTE FORM ───────────────────────────────────
  var offerteForm = document.getElementById('offerteForm');
  if (offerteForm) {
    offerteForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var name = qs('input[placeholder="Uw volledige naam"]', offerteForm);
      var phone = qs('input[type="tel"]', offerteForm);
      var email = qs('input[type="email"]', offerteForm);
      var dienst = qs('select', offerteForm);
      var description = qs('textarea', offerteForm);

      fetch('/api/offerte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name ? name.value : '',
          phone: phone ? phone.value : '',
          email: email ? email.value : '',
          dienst: dienst ? dienst.value : '',
          description: description ? description.value : ''
        })
      }).then(function(r) { return r.json(); }).then(function(data) {
        toonSuccess('offerteSuccess');
      }).catch(function() {
        toonSuccess('offerteSuccess');
      });

      offerteForm.reset();
      var fn = document.getElementById('fileNames');
      if (fn) fn.textContent = '';
    });
  }

  // ─── CONTACT FORM ───────────────────────────────────
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var name = qs('input[placeholder="Uw naam"]', contactForm);
      var phone = qs('input[type="tel"]', contactForm);
      var message = qs('textarea', contactForm);

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name ? name.value : '',
          phone: phone ? phone.value : '',
          message: message ? message.value : ''
        })
      }).then(function(r) { return r.json(); }).then(function(data) {
        toonSuccess('contactSuccess');
      }).catch(function() {
        toonSuccess('contactSuccess');
      });

      contactForm.reset();
    });
  }

  // ─── PARALLAX HERO ─────────────────────────────────
  window.addEventListener('scroll', function() {
    var y = window.scrollY;
    qsa('.hero-slide').forEach(function(slide) {
      slide.style.transform = 'translateY(' + (y * 0.3) + 'px)';
    });
  });

  // ─── INITIAL REVEAL ────────────────────────────────
  setTimeout(function() {
    qsa('#hero .reveal').forEach(function(el, i) {
      setTimeout(function() { el.classList.add('visible'); }, 200 + i * 150);
    });
  }, 100);

  // ─── REVIEWS LADEN ─────────────────────────────────
  fetch('/api/reviews')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data.success || !data.reviews || data.reviews.length === 0) return;
      var lijst = document.querySelector('.reviews-list');
      if (!lijst) return;

      data.reviews.forEach(function(review) {
        var sterren = '';
        for (var s = 0; s < 5; s++) {
          sterren += s < review.stars ? '★' : '☆';
        }
        var initialen = (review.name || '??').substring(0, 2).toUpperCase();
        var dienst = review.dienst || '';

        var card = document.createElement('div');
        card.className = 'review-card reveal';
        card.innerHTML = [
          '<div class="review-quote">"</div>',
          '<div class="review-stars"><span class="star">' + sterren.split('').join('</span><span class="star">') + '</span></div>',
          '<p class="review-text">"' + review.message + '"</p>',
          '<div class="review-author">',
            '<div class="review-avatar">' + initialen + '</div>',
            '<div>',
              '<div class="review-name">' + review.name + '</div>',
              '<div class="review-date">' + dienst + ' · ' + sterren + '</div>',
            '</div>',
          '</div>'
        ].join('');
        lijst.appendChild(card);
      });
    })
    .catch(function(err) {
      console.warn('Kon reviews niet laden:', err);
    });

});



