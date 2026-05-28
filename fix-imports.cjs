const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');
c = c.replace(/import \{\s*([\s\S]*?)\s*\} from 'lucide-react';/, (match, p1) => {
  const imports = p1.split(',').map(s=>s.trim()).filter(Boolean);
  if(!imports.includes('Eye')) imports.push('Eye');
  if(!imports.includes('Lock')) imports.push('Lock');
  if(!imports.includes('AlertTriangle')) imports.push('AlertTriangle');
  return `import { ${imports.join(',\n  ')} } from 'lucide-react';`;
});
fs.writeFileSync('src/App.tsx', c);
