/**
 * Genereer placeholder afbeeldingen voor Gouden Adelaar
 * Gebruik: node generate-images.js
 */
const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, 'public', 'img');
const COLORS = {
  hero: ['#1a1a2e', '#16213e', '#0f3460'],
  project: [
    '#2d1b69', '#1a3a4a', '#3d2b1f', '#2a4a3a',
    '#4a1a2a', '#2a2a4a', '#3a2a1a', '#1a3a2a',
    '#2a1a3a', '#3a3a1a', '#1a2a3a', '#3a1a2a'
  ]
};

// Categorie labels voor projecten
const PROJECT_LABELS = [
  'Badkamer', 'Keuken', 'Woonkamer', 'PVC Vloer',
  'Luxe Badkamer', 'Kozijnen', 'Stucwerk', 'Parket',
  'Woningrenovatie', 'Design Keuken', 'Inbouwkast', 'Kindvloer'
];

const HERO_LABELS = ['Bouw & Renovatie', 'Kwaliteit', 'Vakmanschap'];

function generateSvg({ width, height, bgColor, label, subtitle, icon }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustColor(bgColor, -30)};stop-opacity:1" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(201,168,76,0.08)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <g transform="translate(${width/2}, ${height/2})">
    ${icon ? `<text text-anchor="middle" y="-30" font-size="48" fill="rgba(201,168,76,0.3)">${icon}</text>` : ''}
    <text text-anchor="middle" y="${icon ? 30 : -10}" font-family="Georgia,serif" font-size="24" font-weight="bold" fill="rgba(201,168,76,0.6)">${label}</text>
    ${subtitle ? `<text text-anchor="middle" y="${icon ? 55 : 25}" font-family="sans-serif" font-size="14" fill="rgba(245,240,232,0.4)">${subtitle}</text>` : ''}
  </g>
</svg>`;
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xFF) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xFF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xFF) + amount));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Maak de img map aan als die niet bestaat
if (!fs.existsSync(IMG_DIR)) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  console.log(`📁 Map aangemaakt: ${IMG_DIR}`);
}

// Genereer hero afbeeldingen
for (let i = 0; i < 3; i++) {
  const svg = generateSvg({
    width: 1920,
    height: 1080,
    bgColor: COLORS.hero[i],
    label: `🦅 ${HERO_LABELS[i]}`,
    subtitle: 'Gouden Adelaar'
  });
  const filePath = path.join(IMG_DIR, `hero-${i+1}.jpg`);
  // Sla op als .svg (server stuurt correcte content-type)
  const svgPath = filePath.replace('.jpg', '.svg');
  fs.writeFileSync(svgPath, svg);
  console.log(`✅ Genereerd: hero-${i+1}.svg`);
}

// Genereer project afbeeldingen
for (let i = 0; i < 12; i++) {
  const svg = generateSvg({
    width: 800,
    height: 600,
    bgColor: COLORS.project[i],
    label: PROJECT_LABELS[i],
    subtitle: 'Gouden Adelaar Project',
    icon: '🏗️'
  });
  const filePath = path.join(IMG_DIR, `project-${i+1}.jpg`);
  const svgPath = filePath.replace('.jpg', '.svg');
  fs.writeFileSync(svgPath, svg);
  console.log(`✅ Genereerd: project-${i+1}.svg`);
}

console.log(`\n🎉 Totaal ${15} placeholder afbeeldingen gegenereerd in ${IMG_DIR}`);
console.log('⚠️  Vervang deze door echte foto\'s voor productie!');
