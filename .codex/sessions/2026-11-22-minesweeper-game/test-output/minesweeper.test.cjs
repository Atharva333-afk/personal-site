const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const target = process.argv[2] || 'index.html';
const html = fs.readFileSync(target, 'utf8');
const startMarker = '    const createMinesweeper = () => {';
const endMarker = '    const create2048 = () => {';
const start = html.indexOf(startMarker);
const end = html.indexOf(endMarker, start);

assert.notEqual(start, -1, 'Minesweeper factory should exist in index.html');
assert.notEqual(end, -1, '2048 marker should follow Minesweeper factory');

const factorySource = html
  .slice(start, end)
  .replace('const createMinesweeper', 'globalThis.createMinesweeper');

globalThis.drawGameOverlay = () => {};
vm.runInThisContext(factorySource, { filename: 'embedded-minesweeper.js' });

const mines = game => game.board.flat().filter(tile => tile.mine);
const opened = game => game.board.flat().filter(tile => tile.open);

{
  const game = createMinesweeper();
  assert.equal(game.board.length, 9);
  assert.equal(game.board.every(row => row.length === 9), true);
  assert.equal(game.first, true);
  assert.equal(game.score, 0);
  assert.equal(game.mineCount, 10);

  game.open(4, 4);
  assert.equal(game.first, false);
  assert.equal(game.started, true);
  assert.equal(mines(game).length, 10);
  assert.equal(game.board[4][4].mine, false, 'first square must be safe');
  for (let y = 3; y <= 5; y += 1) {
    for (let x = 3; x <= 5; x += 1) {
      assert.equal(game.board[y][x].mine, false, 'first-click neighborhood must be safe');
    }
  }
  assert.ok(game.score >= 1);
  assert.equal(opened(game).length, game.score);

  game.update(1600);
  assert.equal(game.elapsed, 1600);
  game.paused = true;
  game.update(1000);
  assert.equal(game.elapsed, 1600, 'paused timer should not advance');
  game.paused = false;

  const numbered = game.board.flatMap((row, y) => row.map((tile, x) => ({ tile, x, y })))
    .find(cell => cell.tile.open && cell.tile.near > 0);
  assert.ok(numbered, 'safe opening should expose a numbered boundary tile');
  game.open(numbered.x, numbered.y);
  assert.match(game.message, /needs .*flag/);

  const actualMineNeighbors = [];
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (!dx && !dy) continue;
      const x = numbered.x + dx;
      const y = numbered.y + dy;
      if (x >= 0 && x < 9 && y >= 0 && y < 9 && game.board[y][x].mine) actualMineNeighbors.push({ x, y });
    }
  }
  actualMineNeighbors.forEach(({ x, y }) => game.mark(x, y));
  const beforeChord = game.score;
  game.open(numbered.x, numbered.y);
  assert.equal(game.over && !game.won, false, 'correctly flagged chord must not lose');
  assert.ok(game.score >= beforeChord, 'chording should preserve or increase opened safe tiles');
}

{
  const game = createMinesweeper();
  for (let i = 0; i < 10; i += 1) game.mark(i % 9, Math.floor(i / 9));
  assert.equal(game.flags, 10);
  game.mark(2, 2);
  assert.equal(game.flags, 10, 'flag count must not exceed mine count');
  assert.equal(game.message, 'All 10 flags are already placed');
}

{
  const game = createMinesweeper();
  game.open(4, 4);
  const mine = game.board.flatMap((row, y) => row.map((tile, x) => ({ tile, x, y }))).find(cell => cell.tile.mine);
  game.open(mine.x, mine.y);
  assert.equal(game.over, true);
  assert.equal(game.won, false);
  assert.deepEqual(game.exploded, { x: mine.x, y: mine.y });
  game.tap(240, 57, false);
  assert.equal(game.first, true, 'face button should reset the game');
  assert.equal(game.over, false);
}

{
  const game = createMinesweeper();
  game.open(4, 4);
  for (let y = 0; y < 9 && !game.over; y += 1) {
    for (let x = 0; x < 9 && !game.over; x += 1) {
      if (!game.board[y][x].mine) game.open(x, y);
    }
  }
  assert.equal(game.won, true);
  assert.equal(game.score, 71);
  assert.equal(game.flags, 10);
  assert.equal(mines(game).every(tile => tile.flag), true);
}

{
  const game = createMinesweeper();
  game.action('left');
  game.action('up');
  assert.deepEqual(game.cursor, { x: 3, y: 3 });

  const noop = () => {};
  const context = new Proxy({
    fillRect: noop, strokeRect: noop, fillText: noop, beginPath: noop,
    arc: noop, fill: noop, stroke: noop, moveTo: noop, lineTo: noop,
  }, { set: () => true });
  assert.doesNotThrow(() => game.draw(context));
}

console.log(`${target}: Minesweeper logic tests passed (first-click safety, flags, chord, timer, loss, win, reset, keyboard, draw).`);
