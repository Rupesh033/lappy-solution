const fs = require('fs');
const path = require('path');

// 1. Full Horizontal Logo (SVG)
const fullLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 90" fill="none">
  <defs>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#0A2560" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#1A56DB" />
    </linearGradient>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FB641B" />
      <stop offset="100%" stop-color="#F97316" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Modern Tech Icon Emblem -->
  <g transform="translate(10, 10)">
    <!-- Base Rounded Square with Shadow -->
    <rect x="0" y="0" width="70" height="70" rx="18" fill="url(#blueGrad)" />
    <rect x="1" y="1" width="68" height="68" rx="17" stroke="#38BDF8" stroke-width="1.5" stroke-opacity="0.4" />

    <!-- Circuit Tech Accents -->
    <path d="M12 24 L22 24 L28 18" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" opacity="0.6" />
    <circle cx="12" cy="24" r="2.5" fill="#38BDF8" />
    
    <path d="M58 46 L48 46 L42 52" stroke="#FB641B" stroke-width="2" stroke-linecap="round" opacity="0.7" />
    <circle cx="58" cy="46" r="2.5" fill="#FB641B" />

    <!-- Stylized Modern L Monogram -->
    <path d="M25 22 V44 C25 47.3 27.7 50 31 50 H49 C50.5 50 51.5 51.5 51.5 53 C51.5 54.5 50.5 56 49 56 H29 C24.6 56 21 52.4 21 48 V22 C21 20.3 22.3 19 24 19 C25.7 19 27 20.3 27 22 Z" fill="#FFFFFF" />

    <!-- Cyan Speed Lightning Accent on L -->
    <path d="M33 22 L45 32 H35 L43 46 L29 34 H38 L33 22 Z" fill="url(#cyanGrad)" filter="url(#glow)" opacity="0.95" />
    <polygon points="34,24 43,32 35,32 41,43 30,34 37,34" fill="#FFFFFF" opacity="0.8" />
  </g>

  <!-- Brand Typography -->
  <g transform="translate(94, 20)">
    <!-- Main Title "LAPIEZ" -->
    <text x="0" y="38" font-family="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" font-weight="900" font-size="38" letter-spacing="-0.5" fill="#0F172A">
      LAP<tspan fill="#1A56DB">IEZ</tspan>
    </text>

    <!-- Verified Showroom Dot -->
    <circle cx="152" cy="22" r="5" fill="#10B981" />
    <circle cx="152" cy="22" r="2.5" fill="#FFFFFF" />

    <!-- Subtitle / Tagline -->
    <text x="2" y="55" font-family="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" font-weight="700" font-size="10.5" letter-spacing="2" fill="#64748B">
      TECHNOLOGY • SECURITY • SOLUTIONS
    </text>
  </g>
</svg>`;

// 2. Square Favicon & App Icon (SVG)
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <defs>
    <linearGradient id="favBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E40AF" />
      <stop offset="50%" stop-color="#1A56DB" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="favCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
    <linearGradient id="favOrange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB641B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <filter id="glowFav" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Container -->
  <rect width="128" height="128" rx="32" fill="url(#favBlue)" />
  <rect x="2" y="2" width="124" height="124" rx="30" stroke="#38BDF8" stroke-width="2.5" stroke-opacity="0.5" />

  <!-- Tech Grid Background Lines -->
  <path d="M20 40 H108 M20 88 H108 M40 20 V108 M88 20 V108" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.08" />

  <!-- Corner Tech Accent Dots -->
  <circle cx="28" cy="28" r="4" fill="#38BDF8" opacity="0.8" />
  <circle cx="100" cy="100" r="4" fill="#FB641B" opacity="0.9" />

  <!-- Bold Stylized L Structure -->
  <path d="M42 32 V82 C42 87.5 46.5 92 52 92 H86 C88.5 92 90.5 94 90.5 96.5 C90.5 99 88.5 101 86 101 H48 C39.2 101 32 93.8 32 85 V32 C32 29.5 34 27.5 36.5 27.5 C39 27.5 41 29.5 41 32 Z" fill="#FFFFFF" />

  <!-- Speed Lightning / Diamond Tech Center -->
  <path d="M54 34 L78 54 H60 L74 80 L48 58 H64 L54 34 Z" fill="url(#favCyan)" filter="url(#glowFav)" />
  <polygon points="56,38 74,53 61,53 71,74 52,58 63,58" fill="#FFFFFF" opacity="0.9" />

  <!-- Bottom Accent Tag -->
  <rect x="44" y="108" width="40" height="4" rx="2" fill="url(#favOrange)" />
</svg>`;

const publicDir = path.join(__dirname, '..', 'public');
const publicImagesDir = path.join(publicDir, 'images');
const appDir = path.join(__dirname, '..', 'app');

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// 1. Save Full Logo SVG
fs.writeFileSync(path.join(publicImagesDir, 'logo.svg'), fullLogoSvg, 'utf8');
console.log('✅ Created public/images/logo.svg');

// 2. Save Square Favicon SVG in public & app
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), iconSvg, 'utf8');
fs.writeFileSync(path.join(appDir, 'icon.svg'), iconSvg, 'utf8');
console.log('✅ Created public/favicon.svg & app/icon.svg');

// 3. Simple ICO Header & Entry Builder wrapping a 32x32 SVG/PNG representation
// Write modern ICO wrapper or replace favicon.ico
// Modern browsers accept SVG icons directly when specified in <link rel="icon">
console.log('--- Generating Brand Assets Complete ---');
