import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const root = process.cwd();
const sourcePath = join(root, 'index.html');
const assetRoot = join(root, 'assets', 'generated');
const cssRoot = join(root, 'assets', 'css');
const jsRoot = join(root, 'assets', 'js');

const mimeExtensions = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'application/pdf': '.pdf',
};

await Promise.all([
  mkdir(assetRoot, { recursive: true }),
  mkdir(cssRoot, { recursive: true }),
  mkdir(jsRoot, { recursive: true }),
]);

let html = await readFile(sourcePath, 'utf8');
const dataUrlPattern = /data:([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+)(;base64)?,([^"')\s<>]+)/g;
const pending = [];

html = html.replace(dataUrlPattern, (whole, mime, base64Flag, payload) => {
  const extension = mimeExtensions[mime];
  if (!extension) return whole;
  const bytes = base64Flag
    ? Buffer.from(payload, 'base64')
    : Buffer.from(decodeURIComponent(payload));
  const digest = createHash('sha256').update(bytes).digest('hex').slice(0, 20);
  const filename = `${digest}${extension}`;
  pending.push(writeFile(join(assetRoot, filename), bytes));
  return `assets/generated/${filename}`;
});

const styleMatch = html.match(/\n\s*<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  await writeFile(join(cssRoot, 'site.css'), `${styleMatch[1].trim()}\n`);
  html = html.replace(styleMatch[0], '\n  <link rel="stylesheet" href="assets/css/site.css">');
}

const scriptMatches = [...html.matchAll(/\n\s*<script>([\s\S]*?)<\/script>/g)];
const appScript = scriptMatches.at(-1);
if (appScript) {
  await writeFile(join(jsRoot, 'site.js'), `${appScript[1].trim()}\n`);
  html = html.replace(appScript[0], '\n  <script src="assets/js/site.js" defer></script>');
}

await Promise.all(pending);
await writeFile(sourcePath, html);

console.log(`Extracted ${pending.length} inline assets${styleMatch ? ', the stylesheet' : ''}${appScript ? ', and the application script' : ''}.`);
