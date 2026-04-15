const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imageRegex = /<(?:Image|img)\s[^>]*>/g;
  let matches;
  while ((matches = imageRegex.exec(content)) !== null) {
      console.log(`[${path.basename(filePath)}] ${matches[0]}`);
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

processDirectory(process.cwd());
