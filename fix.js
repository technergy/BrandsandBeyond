const fs = require('fs');
let content = fs.readFileSync('./components/sections.tsx', 'utf8');

// restore hyphens
content = content.replace(/&#9654;/g, '-');

// fix broken arrows
content = content.replace(/Register .*/g, 'Register &#9654;</a>');
content = content.replace(/>\s*-\s*<\/motion.div>/g, '>&#9654;</motion.div>');

fs.writeFileSync('./components/sections.tsx', content);
