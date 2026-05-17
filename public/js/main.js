document.addEventListener('DOMContentLoaded', function() {

  function qs(sel, parent) { return (parent || document).querySelector(sel); }
  function qsa(sel, parent) { return Array.from((parent || document).querySelectorAll(sel)); }

  function toonSuccess(id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.add('show');
      setTimeout(function() { el.classList.remove('show'); }, 5000);
    }
  }

  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

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

  qsa('[data-close="lightbox"]').forEach(function(el) {
    el.addEventListener('click', function() {
      var lb = document.getElementById('lightbox');
      if (lb) { lb.classList.remove('open'); document.body.style.overflow = ''; }
    });
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
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var lb = document.getElementById('lightbox');
      if (lb) { lb.classList.remove('open'); document.body.style.overflow = ''; }
    }
  });

  qsa('[data-star]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var n = parseInt(this.getAttribute('data-star'));
      qsa('[data-star]').forEach(function(s, i) {
        s.classList.toggle('active', i < n);
      });
    });
  });

  var fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      var names = Array.from(e.target.files).map(function(f) { return f.name; }).join(', ');
      var el = document.getElementById('fileNames');
      if (el) el.textContent = names ? '[bijlagen] ' + names : '';
    });
  }

  var reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = qs('input', reviewForm);
      var dienst = qs('select', reviewForm);
      var message = qs('textarea', reviewForm);
      var stars = qsa('.star-btn.active').length;
      fetch('https://gouden-adelaar.onrender.com/api/review', {
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

  var offerteForm = document.getElementById('offerteForm');
  if (offerteForm) {
    offerteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = qs('input[placeholder="Uw volledige naam"]', offerteForm);
      var phone = qs('input[type="tel"]', offerteForm);
      var email = qs('input[type="email"]', offerteForm);
      var dienst = qs('select', offerteForm);
      var description = qs('textarea', offerteForm);
      fetch('https://gouden-adelaar.onrender.com/api/offerte', {
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

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = qs('input[placeholder="Uw naam"]', contactForm);
      var phone = qs('input[type="tel"]', contactForm);
      var message = qs('textarea', contactForm);
      fetch('https://gouden-adelaar.onrender.com/api/contact', {
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

  window.addEventListener('scroll', function() {
    var y = window.scrollY;
    qsa('.hero-slide').forEach(function(slide) {
      slide.style.transform = 'translateY(' + (y * 0.3) + 'px)';
    });
  });

  setTimeout(function() {
    qsa('#hero .reveal').forEach(function(el, i) {
      setTimeout(function() { el.classList.add('visible'); }, 200 + i * 150);
    });
  }, 100);

  // REVIEWS LADEN
  var BASE = 'https://gouden-adelaar.onrender.com';

  fetch(BASE + '/api/reviews')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data.success || !data.reviews || data.reviews.length === 0) return;
      var lijst = document.querySelector('.reviews-list');
      if (!lijst) return;

      data.reviews.forEach(function(review) {
        var sterren = '';
        for (var s = 0; s < 5; s++) {
          sterren += s < review.stars ? '\u2605' : '\u2606';
        }
        var initialen = (review.name || '??').substring(0, 2).toUpperCase();
        var dienstNaam = review.dienst || '';

        var card = document.createElement('div');
        card.className = 'review-card reveal visible';
        card.style.marginBottom = '1.5rem';
        card.innerHTML =
          '<div class="review-quote">"</div>' +
          '<div class="review-stars"><span class="star">' + sterren.split('').join('</span><span class="star">') + '</span></div>' +
          '<p class="review-text">"' + review.message + '"</p>' +
          '<div class="review-author">' +
            '<div class="review-avatar">' + initialen + '</div>' +
            '<div>' +
              '<div class="review-name">' + review.name + '</div>' +
              '<div class="review-date">' + dienstNaam + ' \u00b7 ' + sterren + '</div>' +
            '</div>' +
          '</div>';
        lijst.appendChild(card);
      });
    })
    .catch(function(err) {
      console.warn('Reviews laden mislukt:', err);
    });

});
