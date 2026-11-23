import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const scriptPath = join(root, 'assets', 'js', 'site.js');
const outputDirectory = join(root, 'assets', 'generated');
await mkdir(outputDirectory, { recursive: true });

let source = await readFile(scriptPath, 'utf8');
const pdfPattern = /pdf: '([A-Za-z0-9+/=]+)', filename: '([^']+)'/g;
let extracted = 0;
const writes = [];

source = source.replace(pdfPattern, (whole, encoded, downloadName) => {
  const bytes = Buffer.from(encoded, 'base64');
  const digest = createHash('sha256').update(bytes).digest('hex').slice(0, 20);
  const filename = `${digest}.pdf`;
  writes.push(writeFile(join(outputDirectory, filename), bytes));
  extracted += 1;
  return `pdf: 'assets/generated/${filename}', filename: '${downloadName}'`;
});

source = source.replace(
  'original.href = `data:application/pdf;base64,${essay.pdf}`;',
  'original.href = essay.pdf;'
);

await Promise.all(writes);
await writeFile(scriptPath, source);
console.log(`Extracted ${extracted} writing PDFs.`);
