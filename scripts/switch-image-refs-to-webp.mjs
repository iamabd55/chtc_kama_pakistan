import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const CODE_DIRS = [path.join(ROOT, "app"), path.join(ROOT, "src")];
const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (CODE_EXTENSIONS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

let filesChanged = 0;
let refsReplaced = 0;

for (const dir of CODE_DIRS) {
  const files = walk(dir);
  for (const filePath of files) {
    const original = fs.readFileSync(filePath, "utf8");
    const next = original.replace(/(["'`])(\/images\/[^"'`]+?)\.(png|jpe?g)\1/gi, (match, quote, base) => {
      const relative = `${base}.webp`.replace(/^\//, "");
      const abs = path.join(PUBLIC_DIR, relative);
      if (!fs.existsSync(abs)) return match;
      refsReplaced += 1;
      return `${quote}${base}.webp${quote}`;
    });

    if (next !== original) {
      fs.writeFileSync(filePath, next, "utf8");
      filesChanged += 1;
    }
  }
}

console.log(`files-changed ${filesChanged}`);
console.log(`refs-replaced ${refsReplaced}`);