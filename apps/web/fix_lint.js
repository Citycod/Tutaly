const fs = require('fs');
const path = require('path');

const lines = fs.readFileSync('lint_output_2.txt', 'utf8').split('\n');

const fileWarnings = {};
let currentFile = null;

for (let line of lines) {
    line = line.trim();
    if (line.startsWith('/home/uplix/Desktop/UPLIX/tutaly/apps/web/')) {
        currentFile = line.replace('/home/uplix/Desktop/UPLIX/tutaly/apps/web/', '');
        if (!fileWarnings[currentFile]) {
            fileWarnings[currentFile] = [];
        }
    } else if (currentFile && line.includes('Unused eslint-disable directive')) {
        const match = line.match(/^(\d+):/);
        if (match) {
            fileWarnings[currentFile].push(parseInt(match[1], 10));
        }
    }
}

for (const [filePath, warnings] of Object.entries(fileWarnings)) {
    if (!fs.existsSync(filePath)) continue;
    
    let fileLines = fs.readFileSync(filePath, 'utf8').split('\n');
    warnings.sort((a, b) => b - a); // Sort descending
    
    let modified = false;
    for (const lineNum of warnings) {
        const idx = lineNum - 1;
        if (idx >= 0 && idx < fileLines.length) {
            if (fileLines[idx].includes('eslint-disable')) {
                fileLines.splice(idx, 1);
                modified = true;
            }
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, fileLines.join('\n'), 'utf8');
        console.log(`Fixed ${filePath}`);
    }
}
