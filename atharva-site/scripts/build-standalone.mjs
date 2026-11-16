import { readFileSync, writeFileSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const text = name => readFileSync(new URL(name, dist), 'utf8');
const content = JSON.parse(text('content.json'));
function inline(value) {
  if (typeof value === 'string' && /^(assets|essays)\//.test(value)) {
    const file = readFileSync(new URL(value, dist));
    const type = value.endsWith('.png') ? 'image/png' : value.endsWith('.webp') ? 'image/webp' : value.endsWith('.svg') ? 'image/svg+xml' : value.endsWith('.jpg') ? 'image/jpeg' : value.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream';
    return `data:${type};base64,${file.toString('base64')}`;
  }
  if (Array.isArray(value)) return value.map(inline);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, inline(val)]));
  return value;
}
let html = text('index.html');
const css = text('styles.css');
const games = text('games.js').replace('export const gameFactories', 'const gameFactories');
const tools = text('tools.js').replace(/^export /gm, '');
const arcade = text('tools-arcade.js').replace(/^import .*\n/gm, '').replace(/^export /gm, '');
const app = text('app.js').replace(/^import .*\n/gm, '').replace("const response = await fetch('content.json');", "const response = { ok: true, json: async () => JSON.parse(document.getElementById('site-data').textContent) };");
const bundle = `const gameFactories = (()=>{\n${games}\nreturn gameFactories;\n})();\nconst {mountDrawing,mountCamera,mountGuestbook} = (()=>{\n${tools}\nreturn {mountDrawing,mountCamera,mountGuestbook};\n})();\nconst mountArcade = (()=>{\n${arcade}\nreturn mountArcade;\n})();\n${app}`.replace(/<\/script/gi, '<\\/script');
const json = JSON.stringify(inline(content)).replace(/</g, '\\u003c');
const favicon = `data:image/svg+xml,${encodeURIComponent(text('favicon.svg'))}`;
html = html.replace('<link rel="stylesheet" href="styles.css">', () => `<style>\n${css}\n</style>`)
  .replace('<script type="module" src="app.js"></script>', '')
  .replace('<link rel="icon" type="image/svg+xml" href="favicon.svg">', `<link rel="icon" type="image/svg+xml" href="${favicon}">`)
  .replace('</body>', () => `<script id="site-data" type="application/json">${json}</script>\n<script type="module">\n${bundle}\n</script>\n</body>`);
writeFileSync(new URL('../../atharva-living-resume-refined.html', import.meta.url), html);
console.log(`Standalone website ready: ${Buffer.byteLength(html).toLocaleString()} bytes.`);
