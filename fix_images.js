const fs = require('fs');
const path = require('path');

const heroFilesPattern = [
  'HeroSection.tsx',
  'HeroSlideshow.tsx',
  'page.tsx' // we will be careful with page.tsx
];

function ensureImport(content) {
  if (!content.includes('next/image')) {
    if (content.includes('"use client";') || content.includes("'use client';")) {
      return content.replace(/^(["']use client["'];?)\s*/, "$1\nimport Image from 'next/image';\n");
    } else {
      return "import Image from 'next/image';\n" + content;
    }
  }
  return content;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const isHeroFile = path.basename(filePath).includes('Hero');
  const isPage = path.basename(filePath) === 'page.tsx';

  // 1. Replace <img> with <Image>
  // We will try to add generic width/height 500
  let imgRegex = /<img([^>]+)>/g;
  content = content.replace(imgRegex, (match, attrs) => {
    // If inside next/head or third party we'd skip, but usually the project is clean
    changed = true;
    let newAttrs = attrs;

    // Check if it's already an Image component (we matched <img strictly, lower case)
    // We add unoptimized to avoid build failures if the src is external without remotePatterns
    // Wait, the Next.js config has Supabase, but figma assets are local.
    // We will add width and height if not present
    if (!newAttrs.includes('width=') && !newAttrs.includes('fill')) {
      newAttrs += ' width={800} height={600}';
    }
    
    // remove className w-full h-full if we use fill? No we keep as is
    return `<Image${newAttrs} />`;
  });

  if (changed) {
    content = ensureImport(content);
  }

  // 2. Add loading="lazy" to all <Image> lacking priority
  // 3. Add loading="eager" and priority={true} to first image if it's a Hero
  
  let imageCount = 0;
  let imageCRegex = /<Image([\s\S]*?)\/?>/g;
  content = content.replace(imageCRegex, (match, attrs) => {
    imageCount++;
    let newAttrs = attrs;
    let modified = false;
    
    const hasPriority = newAttrs.includes('priority');
    const hasLoading = newAttrs.includes('loading=');

    // Is it a hero image? First image in a Hero file, or some known hero
    const isHeroImage = (isHeroFile && imageCount === 1) || newAttrs.includes('priority={i === 0}') || newAttrs.includes('priority={activeIndex === 0}');
    
    if (isHeroImage || (hasPriority && !newAttrs.includes('priority={false}'))) {
      // Must have priority={true} (or existing priority) and loading="eager"
      if (!hasPriority) {
        newAttrs += ' priority={true}';
        modified = true;
      }
      if (hasLoading) {
        newAttrs = newAttrs.replace(/loading=["'][^"']*["']/g, 'loading="eager"');
        modified = true;
      } else {
        newAttrs += ' loading="eager"';
        modified = true;
      }
    } else {
      // Must have loading="lazy" and no priority or priority={false}
      if (hasPriority) {
        newAttrs = newAttrs.replace(/\s*priority(?:=\{[^}]+\})?/g, '');
        newAttrs += ' priority={false}';
        modified = true;
      }
      if (hasLoading) {
        if (!newAttrs.includes('loading="lazy"')) {
           newAttrs = newAttrs.replace(/loading=["'][^"']*["']/g, 'loading="lazy"');
           modified = true;
        }
      } else {
        newAttrs += ' loading="lazy"';
        modified = true;
      }
    }
    
    if (modified) {
      changed = true;
      // Reconstruct match ensuring it ends with />
      const endChar = match.trim().endsWith('/>') ? '/>' : '>'; 
      return `<Image${newAttrs}${endChar === '/>' ? ' />' : ' />'}`; // enforce self close for react
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

processDirectory(process.cwd());
