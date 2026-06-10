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

  // Remove generic framer-motion imports
  content = content.replace(/import\s+{.*?}\s+from\s+["']framer-motion["'];?\n?/gs, '');
  content = content.replace(/import\s+.*?\s+from\s+["']framer-motion["'];?\n?/gs, '');

  // Strip <motion.div> -> <div
  content = content.replace(/<motion\.([a-zA-Z0-9]+)/g, '<$1');
  content = content.replace(/<\/motion\.([a-zA-Z0-9]+)>/g, '</$1>');
  
  // Special case: <motion(Link) -> <Link
  content = content.replace(/<motion\(Link\)/g, '<Link');
  content = content.replace(/<\/motion\(Link\)>/g, '</Link>');

  // Remove <AnimatePresence> wrappers completely, leaving children
  content = content.replace(/<AnimatePresence[^>]*>/g, '');
  content = content.replace(/<\/AnimatePresence>/g, '');

  // To prevent multi-line regex destruction, we will NOT strip props.
  // React will warn about them, but it won't crash and performance will be restored.
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

walkDir('/Users/jitensony/stellrwebsite/src', removeFramerMotion);
console.log('Framer Motion removal script completed safely.');
