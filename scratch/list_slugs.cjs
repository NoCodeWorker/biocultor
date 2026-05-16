
const fs = require('fs');
const content = fs.readFileSync('lib/seo-content.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('slug:')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
