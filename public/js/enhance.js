/**
 * Gouden Adelaar - visuele verbeteringen
 * Preloader, scrollvoortgang, actieve navigatie, tellers en een lightbox met bladeren.
 * Raakt de formulieren en API-aanroepen in main.js niet aan.
 */
(function() {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function qs(sel, parent) { return (parent || document).querySelector(sel); }
  function qsa(sel, parent) { return Array.prototype.slice.call((parent || document).querySelectorAll(sel)); }

  // ─── Preloader ───────────────────────────────────────
  var pre = document.getElementById('preloader');
  function verbergPreloader() {
    if (!pre) return;
    pre.classList.add('hide');
    var p = pre;
    pre = null;
    setTimeout(function() { if (p.parentNode) p.parentNode.removeChild(p); }, 700);
  }
  if (document.readyState === 'complete') verbergPreloader();
  else {
    window.addEventListener('load', verbergPreloader);
    setTimeout(verbergPreloader, 2500);
  }

  document.addEventListener('DOMContentLoaded', function() {

    // ─── Scrollvoortgang, zwevende knop, actieve navigatie ───
    var bar = qs('.scroll-progress');
    var floatCta = qs('.float-cta');
    var hero = document.getElementById('hero');
    var links = qsa('.nav-links a[href^="#"]');
    var secties = links.map(function(a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    var bezig = false;

    function opScroll() {
      bezig = false;
      var y = window.scrollY || window.pageYOffset;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
      if (floatCta && hero) floatCta.classList.toggle('is-hidden', y < hero.offsetHeight * 0.6);
      var midden = y + window.innerHeight * 0.35;
      var actief = -1;
      secties.forEach(function(s, i) { if (s && s.offsetTop <= midden) actief = i; });
      links.forEach(function(a, i) { a.classList.toggle('active', i === actief); });
    }
    window.addEventListener('scroll', function() {
      if (!bezig) { bezig = true; requestAnimationFrame(opScroll); }
    }, { passive: true });
    window.addEventListener('resize', opScroll);
    opScroll();

    // ─── Optellende cijfers ─────────────────────────────
    var tellers = qsa('[data-count]');
    if ('IntersectionObserver' in window && !reduce) {
      var tObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (!e.isIntersecting) return;
          tObs.unobserve(e.target);
          var el = e.target;
          var eind = parseInt(el.getAttribute('data-count'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var start = null;
          var duur = 1600;
          function stap(t) {
            if (!start) start = t;
            var p = Math.min((t - start) / duur, 1);
            el.textContent = Math.round(eind * (1 - Math.pow(1 - p, 3))) + suffix;
            if (p < 1) requestAnimationFrame(stap);
          }
          requestAnimationFrame(stap);
        });
      }, { threshold: 0.6 });
      tellers.forEach(function(el) {
        el.textContent = '0' + (el.getAttribute('data-suffix') || '');
        tObs.observe(el);
      });
    }

    // ─── Hamburger met toetsenbord ──────────────────────
    var ham = document.getElementById('hamburgerBtn');
    if (ham) {
      ham.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ham.click(); }
      });
    }

    // ─── Lightbox: bladeren, onderschrift, swipe ────────
    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lightbox-img');
    if (!lb || !lbImg) return;

    var groep = [];
    var index = 0;

    var onderschrift = document.createElement('div');
    onderschrift.className = 'lb-caption';
    var ondCat = document.createElement('small');
    var ondTitel = document.createElement('span');
    onderschrift.appendChild(ondCat);
    onderschrift.appendChild(ondTitel);
    lb.appendChild(onderschrift);

    function maakKnop(cls, label, teken) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lb-nav ' + cls;
      b.setAttribute('aria-label', label);
      b.innerHTML = teken;
      b.addEventListener('click', function(e) { e.stopPropagation(); });
      lb.appendChild(b);
      return b;
    }
    var vorige = maakKnop('lb-prev', 'Vorige foto', '&#8249;');
    var volgende = maakKnop('lb-next', 'Volgende foto', '&#8250;');

    function info(el) {
      var titel = qs('.gallery-label-title', el) || (el.parentNode && qs('.dienst-name', el.parentNode));
      var cat = qs('.gallery-label-cat', el);
      var img = qs('img', el);
      return {
        titel: titel ? titel.textContent : (img ? img.alt : ''),
        cat: cat ? cat.textContent : (el.classList.contains('dienst-media') ? 'Dienst' : '')
      };
    }

    function zetInfo() {
      var el = groep[index];
      if (!el) return;
      var i = info(el);
      ondCat.textContent = i.cat + (groep.length > 1 ? '  ·  ' + (index + 1) + ' / ' + groep.length : '');
      ondTitel.textContent = i.titel;
      lbImg.alt = i.titel;
      var meer = groep.length > 1;
      vorige.style.display = meer ? '' : 'none';
      volgende.style.display = meer ? '' : 'none';
    }

    function toon(n) {
      if (!groep.length) return;
      index = (n + groep.length) % groep.length;
      lbImg.classList.add('swap');
      setTimeout(function() {
        lbImg.src = groep[index].getAttribute('data-lightbox');
        zetInfo();
        lbImg.classList.remove('swap');
      }, 160);
    }

    qsa('[data-lightbox]').forEach(function(el) {
      el.addEventListener('click', function() {
        var sectie = el.closest('section') || document;
        groep = qsa('[data-lightbox]', sectie);
        index = Math.max(0, groep.indexOf(el));
        zetInfo();
      });
    });

    vorige.addEventListener('click', function() { toon(index - 1); });
    volgende.addEventListener('click', function() { toon(index + 1); });
    lbImg.addEventListener('click', function(e) { e.stopPropagation(); });

    document.addEventListener('keydown', function(e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'ArrowLeft') toon(index - 1);
      if (e.key === 'ArrowRight') toon(index + 1);
    });

    var startX = null;
    lb.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function(e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) {
        e.preventDefault();
        toon(dx < 0 ? index + 1 : index - 1);
      }
    });
  });
})();
