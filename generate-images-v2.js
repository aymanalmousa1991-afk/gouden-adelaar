/**
 * Genereer duidelijke zichtbare placeholder afbeeldingen
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'img');

// Hero placeholders
const heroLabels = ['Kwaliteit & Vakmanschap', 'Complete Renovatie', 'Vloeren & Stucwerk'];
const heroColors = ['#1a1a3e', '#2a1a2e', '#1a2a3e'];

for (let i = 0; i < 3; i++) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${heroColors[i]}"/>
      <stop offset="100%" style="stop-color:#000"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#g)"/>
  <circle cx="960" cy="400" r="180" fill="rgba(201,168,76,0.08)"/>
  <text x="960" y="420" text-anchor="middle" font-family="Georgia,serif" font-size="72" fill="#C9A84C" font-weight="bold">🦅</text>
  <text x="960" y="510" text-anchor="middle" font-family="Georgia,serif" font-size="48" fill="#F5F0E8" font-weight="bold">Gouden Adelaar</text>
  <text x="960" y="560" text-anchor="middle" font-family="sans-serif" font-size="24" fill="rgba(245,240,232,0.5)">${heroLabels[i]}</text>
  <rect x="0" y="1076" width="1920" height="4" fill="#C9A84C" opacity="0.3"/>
</svg>`;
    fs.writeFileSync(path.join(dir, `hero-${i+1}.svg`), svg);
    console.log(`✅ hero-${i+1}.svg`);
}

// Project placeholders
const projects = [
    { label: 'Badkamer', cat: 'badkamer' },
    { label: 'Keuken', cat: 'keuken' },
    { label: 'Woonkamer', cat: 'woonkamer' },
    { label: 'PVC Vloer', cat: 'vloeren' },
    { label: 'Luxe Badkamer', cat: 'badkamer' },
    { label: 'Kozijnen', cat: 'extern' },
    { label: 'Stucwerk', cat: 'woonkamer' },
    { label: 'Parket', cat: 'vloeren' },
    { label: 'Renovatie', cat: 'extern' },
    { label: 'Design Keuken', cat: 'keuken' },
    { label: 'Inbouwkast', cat: 'woonkamer' },
    { label: 'Kindvloer', cat: 'vloeren' }
];
const projectColors = ['#2d1b69','#1a3a4a','#3d2b1f','#2a4a3a','#4a1a2a','#2a2a4a','#3a2a1a','#1a3a2a','#2a1a3a','#3a3a1a','#1a2a3a','#3a1a2a'];

for (let i = 0; i < 12; i++) {
    const p = projects[i];
    const c = projectColors[i];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
  <rect width="800" height="600" fill="${c}"/>
  <circle cx="400" cy="200" r="70" fill="rgba(201,168,76,0.1)"/>
  <text x="400" y="215" text-anchor="middle" font-family="sans-serif" font-size="48">🏗️</text>
  <text x="400" y="280" text-anchor="middle" font-family="Georgia,serif" font-size="32" fill="#C9A84C" font-weight="bold">${p.label}</text>
  <text x="400" y="320" text-anchor="middle" font-family="sans-serif" font-size="16" fill="rgba(245,240,232,0.4)" text-transform="uppercase">${p.cat}</text>
  <text x="400" y="360" text-anchor="middle" font-family="sans-serif" font-size="14" fill="rgba(245,240,232,0.2)">Gouden Adelaar</text>
  <rect x="0" y="597" width="800" height="3" fill="#C9A84C" opacity="0.2"/>
</svg>`;
    fs.writeFileSync(path.join(dir, `project-${i+1}.svg`), svg);
    console.log(`✅ project-${i+1}.svg`);
}

console.log('\n🎉 Alle 15 placeholders bijgewerkt!');
