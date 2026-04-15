const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let originalContent = fs.readFileSync(filePath, 'utf8');
  let content = originalContent;

  // Fix 1: Link tag corruptions
  if (content.includes('prefetch={false}>')) {
    // We only want to find `prefetch={false}>` placed inappropriately.
    // Specifically `() = prefetch={false}>` -> `() =>`
    content = content.replace(/\(\)\s*=\s*prefetch=\{false\}>/g, '() =>');
    
    // Specifically ` prefetch={false}>= ` -> ` >= `
    content = content.replace(/\s*prefetch=\{false\}>=/g, ' >=');
  }

  // Fix 2: Image tag corruptions
  let imageCRegex = /<Image([^>]+)\/>/g;
  content = content.replace(imageCRegex, (match, attrs) => {
    // If attrs contains something like ` / width={800}`, we need to strip ` / `.
    // But since it's hard to parse, let's just strip stray `/ ` if it precedes standard React props.
    let newAttrs = attrs;

    // Pattern: ` / width=` or ` / loading=` or ` / priority=`
    // Actually, Next.js tags don't usually have scattered slashes before attributes.
    // The previous script literally appended ` width={800} height={600}` right after the closing slash if the tag was `<img ... />`.
    // It became `<Image ... / width={800} height={600} loading="lazy" />`
    
    // We can replace any occurrence of ` / ` when it's followed by `width=`, `height=`, `loading=`, or `priority=`
    newAttrs = newAttrs.replace(/\/\s+(width=)/g, ' $1');
    newAttrs = newAttrs.replace(/\/\s+(height=)/g, ' $1');
    newAttrs = newAttrs.replace(/\/\s+(loading=)/g, ' $1');
    newAttrs = newAttrs.replace(/\/\s+(priority=)/g, ' $1');

    return `<Image${newAttrs}/>`;
  });

  if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed syntax in', filePath);
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
