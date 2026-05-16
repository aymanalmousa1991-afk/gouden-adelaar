
// ─── NAV SCROLL ───────────────────────────────────────────
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>60);
});

// ─── MOBILE MENU ─────────────────────────────────────────
function openMobileMenu(){document.getElementById('mobileMenu').classList.add('open');document.body.style.overflow='hidden'}
function closeMobileMenu(){document.getElementById('mobileMenu').classList.remove('open');document.body.style.overflow=''}

// ─── HERO SLIDESHOW ──────────────────────────────────────
let current=0;
const slides=document.querySelectorAll('.hero-slide');
const dots=document.querySelectorAll('.hero-dot');
function goSlide(n){
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current=n;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}
setInterval(()=>goSlide((current+1)%slides.length),5000);

// ─── REVEAL ON SCROLL ────────────────────────────────────
const revealEls=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}});
},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
revealEls.forEach(el=>observer.observe(el));

// ─── GALLERY FILTER ──────────────────────────────────────
function filterGallery(cat,btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.gallery-item').forEach(item=>{
    const show=cat==='all'||item.dataset.cat===cat;
    item.style.display=show?'':'none';
  });
}

// ─── LIGHTBOX ────────────────────────────────────────────
function openLightbox(src){
  document.getElementById('lightbox-img').src=src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});

// ─── STAR RATING ─────────────────────────────────────────
let selectedStars=0;
function setStars(n){
  selectedStars=n;
  document.querySelectorAll('.star-btn').forEach((btn,i)=>{
    btn.classList.toggle('active',i<n);
  });
}

// ─── FILE UPLOAD ─────────────────────────────────────────
function handleFiles(e){
  const names=[...e.target.files].map(f=>f.name).join(', ');
  document.getElementById('fileNames').textContent=names?`📎 ${names}`:'';
}

// ─── FORM SUBMISSIONS ────────────────────────────────────
function submitReview(e){
  e.preventDefault();
  const msg=document.getElementById('reviewSuccess');
  msg.classList.add('show');
  document.getElementById('reviewForm').reset();
  setStars(0);
  setTimeout(()=>msg.classList.remove('show'),5000);
}
function submitOfferte(e){
  e.preventDefault();
  const msg=document.getElementById('offerteSuccess');
  msg.classList.add('show');
  document.getElementById('offerteForm').reset();
  document.getElementById('fileNames').textContent='';
}
function submitContact(e){
  e.preventDefault();
  const msg=document.getElementById('contactSuccess');
  msg.classList.add('show');
  document.getElementById('contactForm').reset();
  setTimeout(()=>msg.classList.remove('show'),5000);
}

// ─── PARALLAX HERO ──────────────────────────────────────
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  document.querySelectorAll('.hero-slide').forEach(slide=>{
    slide.style.transform=`translateY(${y*.3}px)`;
  });
});

// Trigger initial reveal for hero
setTimeout(()=>{
  document.querySelectorAll('#hero .reveal').forEach((el,i)=>{
    setTimeout(()=>el.classList.add('visible'),200+i*150);
  });
},100);
