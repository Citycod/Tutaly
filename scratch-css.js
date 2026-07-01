const fs = require('fs');
const path = require('path');

const srcDir = './system design';
const destFile = './apps/web/src/styles/components.css';

const files = [
  'check-email.html',
  'connect.html'
];

let componentsCss = fs.readFileSync(destFile, 'utf8');

files.forEach(f => {
  const content = fs.readFileSync(path.join(srcDir, f), 'utf8');
  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch) {
    const css = styleMatch[1];
    
    // We want to extract specific blocks
    const blocksToExtract = [
      { name: 'SALARY SECTION', regex: /\/\* ─── SALARY SECTION[\s\S]*?\/\* ─── REVIEWS SECTION/ },
      { name: 'REVIEWS SECTION', regex: /\/\* ─── REVIEWS SECTION[\s\S]*?\/\* ─── EMPLOYER SECTION/ },
      { name: 'EMPLOYER SECTION', regex: /\/\* ─── EMPLOYER SECTION[\s\S]*?\/\* ─── MARKETPLACE/ },
      { name: 'MARKETPLACE', regex: /\/\* ─── MARKETPLACE[\s\S]*?\/\* ─── TESTIMONIALS/ },
      { name: 'TESTIMONIALS', regex: /\/\* ─── TESTIMONIALS[\s\S]*?\/\* ─── CTA BANNER/ },
      { name: 'AUTH SHELL', regex: /\/\* ─── AUTH SHELL[\s\S]*?\n<\/style>/ },
      { name: 'CONNECT FEED', regex: /\/\* ─── CONNECT FEED[\s\S]*?\n<\/style>/ }
    ];

    blocksToExtract.forEach(b => {
      // prevent duplicate insertion
      if (componentsCss.includes(`/* ─── ${b.name}`)) return;
      
      let blockMatch;
      if (b.name === 'AUTH SHELL' || b.name === 'CONNECT FEED') {
        blockMatch = content.match(new RegExp(`\\/\\* ─── ${b.name}[\\s\\S]*?<\/style>`));
        if (blockMatch) {
            let cssBlock = blockMatch[0].replace('</style>', '');
            componentsCss += '\n' + cssBlock;
        }
      } else {
        blockMatch = css.match(b.regex);
        if (blockMatch) {
            let cssBlock = blockMatch[0].replace(/\/\* ─── (REVIEWS SECTION|EMPLOYER SECTION|MARKETPLACE|TESTIMONIALS|CTA BANNER)[\s\S]*/, '');
            componentsCss += '\n' + cssBlock;
        }
      }
    });
  }
});

fs.writeFileSync(destFile, componentsCss);
console.log('Appended missing CSS blocks to components.css');
