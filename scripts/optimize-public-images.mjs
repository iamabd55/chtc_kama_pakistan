import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMAGES_DIR = path.join(ROOT, "public", "images");
const TARGET_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);

const MAX_WIDTH_BY_PATH = [
  { key: `${path.sep}hero${path.sep}`, width: 1600 },
  { key: `${path.sep}services${path.sep}`, width: 1200 },
  { key: `${path.sep}core-team${path.sep}`, width: 1000 },
];

function getMaxWidth(filePath) {
  const normalized = filePath.toLowerCase();
  for (const rule of MAX_WIDTH_BY_PATH) {
    if (normalized.includes(rule.key)) return rule.width;
  }
  return 1200;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function optimize(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!TARGET_EXTENSIONS.has(ext)) return null;

  const webpPath = filePath.replace(/\.(png|jpe?g)$/i, ".webp");
  const before = await fs.stat(filePath);

  const image = sharp(filePath).rotate();
  const metadata = await image.metadata();
  const maxWidth = getMaxWidth(filePath);

  if ((metadata.width ?? 0) > maxWidth) {
    image.resize({ width: maxWidth, withoutEnlargement: true });
  }

  await image
    .webp({ quality: 58, effort: 6, smartSubsample: true })
    .toFile(webpPath);

  const after = await fs.stat(webpPath);
  return {
    filePath,
    webpPath,
    beforeBytes: before.size,
    afterBytes: after.size,
  };
}

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function main() {
  const files = await walk(IMAGES_DIR);
  const optimized = [];

  for (const file of files) {
    const out = await optimize(file);
    if (out) optimized.push(out);
  }

  const totalBefore = optimized.reduce((sum, item) => sum + item.beforeBytes, 0);
  const totalAfter = optimized.reduce((sum, item) => sum + item.afterBytes, 0);
  const saved = totalBefore - totalAfter;
  const savedPct = totalBefore > 0 ? (saved / totalBefore) * 100 : 0;

  console.log(`Optimized ${optimized.length} source images to WebP.`);
  console.log(`Before: ${formatKB(totalBefore)}`);
  console.log(`After:  ${formatKB(totalAfter)}`);
  console.log(`Saved:  ${formatKB(saved)} (${savedPct.toFixed(1)}%)`);

  const top = [...optimized]
    .sort((a, b) => b.beforeBytes - b.afterBytes - (a.beforeBytes - a.afterBytes))
    .slice(0, 12);

  console.log("Top savings:");
  for (const item of top) {
    const relative = path.relative(ROOT, item.webpPath).replaceAll("\\", "/");
    const delta = item.beforeBytes - item.afterBytes;
    console.log(`- ${relative}: ${formatKB(item.beforeBytes)} -> ${formatKB(item.afterBytes)} (saved ${formatKB(delta)})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});