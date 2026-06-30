const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory()
        ? walkSync(dirFile, filelist)
        : filelist.concat(dirFile);
    } catch (err) {
      if (err.code === 'ENOENT' || err.code === 'EACCES') return;
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css'));

let replacedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const orig = content;

  // Grays -> c*
  content = content.replace(/(bg|text|border|ring|divide|from|to|via)-(gray|slate|zinc|neutral)-([1-9]00)/g, (match, prefix, color, shade) => {
    return `${prefix}-c${shade}`;
  });
  content = content.replace(/(bg|text|border|ring|divide|from|to|via)-(gray|slate|zinc|neutral)-50/g, '$1-c100'); // Map 50 to 100

  // Blues
  content = content.replace(/(bg|text|border|ring|divide|from|to|via)-(blue|indigo)-(500|600)/g, '$1-blue');
  content = content.replace(/(bg|text|border|ring|divide|from|to|via)-(blue|indigo)-(300|400|100|200|50)/g, '$1-blueL');
  content = content.replace(/(bg|text|border|ring|divide|from|to|via)-(blue|indigo)-(700|800|900|950)/g, '$1-blueH');

  // Greens
  content = content.replace(/(bg|text|border|ring|divide|from|to|via)-(green|emerald|teal)-[0-9]{2,3}/g, '$1-green');

  // Reds
  content = content.replace(/(bg|text|border|ring|divide|from|to|via)-(red|rose)-[0-9]{2,3}/g, '$1-red');

  // Golds
  content = content.replace(/(bg|text|border|ring|divide|from|to|via)-(yellow|amber)-(500|600|400)/g, '$1-gold');
  content = content.replace(/(bg|text|border|ring|divide|from|to|via)-(yellow|amber)-(700|800|900)/g, '$1-goldH');
  content = content.replace(/(bg|text|border|ring|divide|from|to|via)-(yellow|amber)-(100|200|300|50)/g, '$1-gold');

  // Replace Hex and RGBA arbitrary tailwind bracket colors with tokens where obvious
  content = content.replace(/\[#0D1B2A\]/g, 'c900');
  content = content.replace(/\[#1B4F9E\]/g, 'blue');
  content = content.replace(/\[#1D9E75\]/g, 'green');
  content = content.replace(/\[#147a59\]/g, 'green');
  content = content.replace(/\[#C9A227\]/g, 'gold');
  content = content.replace(/\[#CC2B2B\]/g, 'red');

  if (content !== orig) {
    fs.writeFileSync(file, content, 'utf8');
    replacedFiles++;
  }
});

console.log(`Replaced colors in ${replacedFiles} files.`);
