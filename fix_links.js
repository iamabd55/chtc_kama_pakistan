const fs = require('fs');
const path = require('path');

const excludeLinks = ['/', '/products', '/get-quote'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find all <Link ...> instances
  // We need to ensure we don't accidentally match <link> from next/head if any, but they are usually lowercase. 
  // Next.js Link is usually <Link
  let changed = false;
  
  // A regex to match <Link ... > tag
  const linkRegex = /<Link\s+([^>]+)>/g;
  
  content = content.replace(linkRegex, (match, props) => {
    // If it already has prefetch, or if it's high priority, skip (well, if it has prefetch={false} we can keep it).
    if (props.includes('prefetch=')) return match;
    
    // Check href
    const hrefMatch = props.match(/href=(["'])(.*?)\1/);
    const hrefExprMatch = props.match(/href=\{([^}]+)\}/);
    
    let isHighPriority = false;
    
    if (hrefMatch) {
      const href = hrefMatch[2];
      if (excludeLinks.includes(href)) {
        isHighPriority = true;
      }
    } else if (hrefExprMatch) {
      // Dynamic href, typically not homepage or get-quote, so likely not high priority
      // But if it's literally `href={"/"}` we handle it? Usually it's `href="/"`.
    } 

    if (!isHighPriority) {
      changed = true;
      return `<Link ${props} prefetch={false}>`;
    }
    
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Modified:', filePath);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

const rootDir = process.cwd();
processDirectory(rootDir);
console.log('Done.');
