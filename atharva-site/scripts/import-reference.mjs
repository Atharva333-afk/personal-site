import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import path from 'node:path';

// Import only the reference's content and media. Its application code stays in reference/.
const source = readFileSync(new URL('../../reference/living-resume-original.html', import.meta.url), 'utf8');
const output = new URL('../dist/', import.meta.url);
mkdirSync(new URL('assets/', output), { recursive: true });
mkdirSync(new URL('essays/', output), { recursive: true });
for (const file of readdirSync(new URL('assets/', output))) unlinkSync(new URL(`assets/${file}`, output));
const files = new Map();
function asset(uri) {
  if (!uri?.startsWith('data:')) return uri;
  if (files.has(uri)) return files.get(uri);
  const [, type, encoded] = uri.match(/^data:([^;]+);base64,(.*)$/s) || [];
  if (!encoded) return uri;
  const buffer = Buffer.from(encoded, 'base64');
  const ext = { 'image/png': 'png', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'image/jpeg': 'jpg' }[type] || 'bin';
  const name = `assets/${createHash('sha256').update(buffer).digest('hex').slice(0, 14)}.${ext}`;
  writeFileSync(new URL(name, output), buffer);
  files.set(uri, name);
  return name;
}
function literal(name, next) {
  const start = source.indexOf(`const ${name}`);
  if (start === -1) throw new Error(`Missing reference data: ${name}`);
  const equal = source.indexOf('=', start) + 1;
  const end = source.indexOf(next, equal);
  const expression = source.slice(equal, end).trim().replace(/;$/, '');
  // These reviewed declarations contain only arrays, objects, numbers, and strings.
  return vm.runInNewContext(`(${expression})`, Object.create(null), { timeout: 1000 });
}
const projects = literal('portfolioProjects', 'const portfolioRoute');
for (const [id, name, next] of [
  ['descreened','descreenedBanner','const decaBanner'],
  ['deca','decaBanner','const yisBanner'],
  ['yis','yisBanner','const ascentBanner'],
  ['ascent','ascentBanner','const portfolioProjects']
]) {
  projects.find(project => project.id === id).banner = asset(literal(name, next));
}
const tracks = literal('musicTracks', 'let musicSelected');
tracks.forEach((track, i) => { track.id = `track-${i + 1}`; track.cover = asset(track.cover); });
const writing = literal('writingDetails', 'const writingRoute');
const essays = Object.entries(writing).map(([id, essay]) => {
  writeFileSync(new URL(`essays/${id}.pdf`, output), Buffer.from(essay.pdf, 'base64'));
  const match = source.match(new RegExp(`<template[^>]+id="writing-${id}-content"[^>]*>([\\s\\S]*?)<\\/template>`));
  // The original template IDs are resolved below when they differ from this pattern.
  return { ...essay, id, pdf: `essays/${id}.pdf`, html: match?.[1] || '' };
});
const templates = [...source.matchAll(/<template\b([^>]*)>([\s\S]*?)<\/template>/g)];
for (const essay of essays) {
  const found = templates.find(([_, attrs]) => attrs.includes(essay.id));
  if (!found) throw new Error(`Missing essay body: ${essay.id}`);
  essay.html = found[2];
  essay.minutes = Math.ceil(essay.html.replace(/<[^>]*>/g, ' ').split(/\s+/).length / 220);
}
const images = [...source.matchAll(/<img\b[^>]*>/g)].map(([tag]) => ({
  tag, src: tag.match(/\bsrc="([^"]*)"/)?.[1], class: tag.match(/\bclass="([^"]*)"/)?.[1] || ''
}));
const byClass = (name) => asset(images.find(x => x.class.split(' ').includes(name))?.src);
const denimData = literal('jeansArchive', 'const jeanField');
const denimImages = images.filter(x => x.class === 'jean-lift');
const denim = Object.entries(denimData).map(([id, item], i) => ({
  id, name: item.name, number: item.number, group: 'denim', image: asset(denimImages[i].src),
  description: ({ 'vintage-blue': 'A classic blue wash, folded at the hem.', 'soft-stone': 'A soft, pale stone wash.', 'graphic-black': 'Black denim with graphic details.', 'plaid-star': 'Plaid details and a star motif.', 'deep-indigo': 'A dark indigo wash.', 'faded-light': 'Light blue denim with a worn-in fade.', 'washed-black': 'A washed black finish.', 'stacked-indigo': 'Indigo denim with a stacked silhouette.' })[id]
}));
const sportsData = literal('sportsArchive', 'const sportsBoards');
const sports = Object.entries(sportsData).map(([id, item]) => {
  const marker = source.indexOf(`data-sports-shirt="${id}"`);
  const uri = source.slice(marker).match(/<image\b[^>]*\bhref="([^"]+)"/)?.[1];
  return { id: `sports-${id}`, name: item.name, group: 'sports', number: item.number, image: asset(uri), description: item.copy, maker: item.maker, piece: item.piece };
});
const boardsData = literal('sportsBoards', 'let selectedSportsShirt');
const boards = Object.entries(boardsData).map(([id, board], i) => ({id:`board-${id}`,name:board.name,group:'boards',number:String(i+1).padStart(2,'0'),image:asset(board.image),description:board.copy || `A collection board for ${board.name.toLowerCase()}.`}));
const games = literal('gameInfo', 'const gameBest');
const data = { projects, tracks, essays, denim, sports, boards, games, question:'Does fate control us, or do we control our own destiny?', mascot: null };
data.mascot = asset(source.match(/id="mascot-button"[^>]*>\s*<img[^>]+src="([^"]+)"/)?.[1]);
writeFileSync(new URL('content.json', output), JSON.stringify(data));
// Reuse the original, self-contained game engines and credit their sources in the UI.
const gameStart = source.indexOf('const drawGameOverlay');
const gameEnd = source.indexOf('const gameFactories', gameStart);
writeFileSync(new URL('games.js', output), `${source.slice(gameStart, gameEnd)}\nexport const gameFactories = {tetris:createTetris,snake:createSnake,pinpog:createPinPog,mines:createMinesweeper,'2048':create2048,breakout:createBreakout,memory:createMemory,connect4:createConnectFour,maze:createMazeChase,invaders:createInvaders,flappy:createFlappy};\n`);
console.log(`Imported ${projects.length} projects, ${essays.length} essays, ${tracks.length} songs, ${denim.length + sports.length} collection pieces, ${boards.length} collection boards, 11 games, and ${files.size} media files.`);
