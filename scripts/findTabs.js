const fs = require('fs');
const lines = fs.readFileSync('app/admin/page.tsx', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes("activeTab ===")) {
    console.log(i + 1, l.trim());
  }
});
