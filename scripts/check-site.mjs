import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const html = readFileSync('index.html', 'utf8');
assert.match(html, /<html lang="en">/);
assert.match(html, /<link rel="stylesheet" href="assets\/css\/site\.css">/);
assert.match(html, /<script src="assets\/js\/site\.js" defer><\/script>/);

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Every element ID must be unique');

for (const id of ['jeans-page', 'sports-page', 'writing-page', 'portfolio-page', 'games-page', 'music-page', 'guestbook-page', 'paint-page']) {
  assert.ok(ids.includes(id), `Missing ${id}`);
}

const assetReferences = [...html.matchAll(/\b(?:src|href)="(assets\/[^"#?]+)"/g)].map(match => match[1]);
for (const asset of assetReferences) {
  assert.ok(existsSync(asset), `Missing local asset: ${asset}`);
}
for (const image of html.match(/<img\b[^>]*>/g) ?? []) {
  assert.match(image, /\balt="[^"]*"/, 'Every image needs an alt attribute');
}

execFileSync(process.execPath, ['--check', 'assets/js/site.js']);
console.log(`Site checks passed: ${ids.length} IDs, ${assetReferences.length} asset references, JavaScript syntax.`);
