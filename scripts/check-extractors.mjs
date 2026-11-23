import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = process.cwd();
const temp = mkdtempSync(join(tmpdir(), 'site-extractor-'));
const pdfHref = 'original.href = `data:application/pdf;base64,${essay.pdf}`;';

try {
  const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/L1sAAAAASUVORK5CYII=';
  const fixture = '<!doctype html>\n<html><head>\n  <style>body { color: #111; }</style></head>\n<body><img src="' + image + '">\n  <script>' + pdfHref + '</script></body></html>';
  writeFileSync(join(temp, 'index.html'), fixture);
  execFileSync(process.execPath, [resolve(root, 'scripts/extract-inline-assets.mjs')], { cwd: temp });
  const html = readFileSync(join(temp, 'index.html'), 'utf8');
  const js = readFileSync(join(temp, 'assets/js/site.js'), 'utf8');
  assert.match(html, /assets\/generated\/[a-f0-9]{20}\.png/);
  assert.ok(js.includes(pdfHref), 'Dynamic PDF URL must survive extraction');
  execFileSync(process.execPath, ['--check', join(temp, 'assets/js/site.js')]);

  const pdf = Buffer.from('%PDF-1.4\n');
  const encoded = pdf.toString('base64');
  writeFileSync(join(temp, 'assets/js/site.js'), "const writing = { pdf: '" + encoded + "', filename: 'Essay.pdf' };\n" + pdfHref);
  execFileSync(process.execPath, [resolve(root, 'scripts/extract-writing-pdfs.mjs')], { cwd: temp });
  const converted = readFileSync(join(temp, 'assets/js/site.js'), 'utf8');
  const pdfFiles = readdirSync(join(temp, 'assets/generated')).filter(name => name.endsWith('.pdf'));
  assert.equal(pdfFiles.length, 1);
  assert.ok(converted.includes('original.href = essay.pdf;'));
  assert.ok(converted.includes('assets/generated/' + pdfFiles[0]));
  assert.deepEqual(readFileSync(join(temp, 'assets/generated', pdfFiles[0])), pdf);
  console.log('Extractor checks passed: image asset, dynamic URL, PDF extraction.');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
