import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function removeFramerMotion(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(/import\s+{.*?}\s+from\s+["']framer-motion["'];?\n?/gs, '');
  content = content.replace(/import\s+.*?\s+from\s+["']framer-motion["'];?\n?/gs, '');

  content = content.replace(/<motion\.([a-zA-Z0-9]+)/g, '<$1');
  content = content.replace(/<\/motion\.([a-zA-Z0-9]+)>/g, '</$1>');
  content = content.replace(/<motion\(Link\)/g, '<Link');
  content = content.replace(/<\/motion\(Link\)>/g, '</Link>');

  const propsToRemove = ['initial', 'animate', 'whileInView', 'viewport', 'transition', 'variants', 'exit', 'whileHover', 'whileTap'];
  for (const prop of propsToRemove) {
    const propRegex = new RegExp(`\\s+${prop}=\\{([^}]+)\\}`, 'g');
    content = content.replace(propRegex, '');
    const propRegex2 = new RegExp(`\\s+${prop}="[^"]*"`, 'g');
    content = content.replace(propRegex2, '');
    const propRegex3 = new RegExp(`\\s+${prop}=\\{\\{[\\s\\S]*?\\}\\}`, 'g');
    content = content.replace(propRegex3, '');
  }

  content = content.replace(/<AnimatePresence[^>]*>/g, '');
  content = content.replace(/<\/AnimatePresence>/g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

walkDir('/Users/jitensony/stellrwebsite/src', removeFramerMotion);
console.log('Framer Motion removal script completed.');
