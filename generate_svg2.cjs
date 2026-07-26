const fs = require('fs');
const isMolar = true;
let rootPath = "M 20 80 C 15 30, 25 10, 35 10 C 45 10, 45 50, 50 60 C 55 50, 55 10, 65 10 C 75 10, 85 30, 80 80 Z";
let crownPath = "M 15 80 C 15 100, 20 130, 35 135 C 50 140, 50 140, 65 135 C 80 130, 85 100, 85 80 C 85 70, 15 70, 15 80 Z";

const html = `
<html><body>
<svg viewBox="0 0 100 150" width="100" height="150">
  <path d="${rootPath}" fill="#f3e8d2" stroke="#a39882" stroke-width="2"/>
  <path d="${crownPath}" fill="#fdfbf7" stroke="#a39882" stroke-width="2"/>
</svg>
</body></html>
`;
fs.writeFileSync('test2.html', html);
