import { gameFactories } from './games.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const keyActions = {arrowleft:'left',a:'left',arrowright:'right',d:'right',arrowup:'up',w:'up',arrowdown:'down',s:'down'};
const paddleGames = new Set(['pinpog','breakout','invaders']);
const tapGames = new Set(['mines','memory','connect4']);
const swipeGames = new Set(['snake','2048','maze']);
const noDrop = new Set(['snake','2048','maze']);

export function mountArcade(root, initial, metadata) {
  const controller = new AbortController();
  const signal = controller.signal;
  const canvas = $('#game-canvas', root);
  const context = canvas.getContext('2d');
  let game, name = initial, started = false, running = false, alive = true;
  let frame = 0, lastTime = 0, repeat = 0, swipe = null;
  const heldKeys = new Set();
  const best = Object.fromEntries(Object.keys(gameFactories).map(id => {
    try { return [id, Number(localStorage.getItem('to-know-arcade-' + id)) || 0]; }
    catch { return [id, 0]; }
  }));

  function extra() {
    if (name === 'tetris') return game.lines;
    if (name === 'snake') return game.snake.length;
    if (name === 'mines') return 10 - game.flags;
    if (name === '2048') return game.maxTile;
    if (['breakout','maze','invaders'].includes(name)) return game.lives;
    if (name === 'memory') return game.moves;
    if (name === 'connect4') return game.turn;
    if (name === 'flappy') return game.flaps;
    return game.score;
  }
  function sync() {
    $('[data-game-score]', root).textContent = String(game.score);
    if (game.score > best[name]) {
      best[name] = game.score;
      try { localStorage.setItem('to-know-arcade-' + name, String(best[name])); } catch {}
    }
    $('[data-game-best]', root).textContent = String(best[name]);
    $('[data-game-extra]', root).textContent = String(extra());
    $('[data-game-start]', root).textContent = game.over ? 'Play again' : !started ? 'Start' : running ? 'Pause' : 'Resume';
    const flagButton = $('[data-game-flag]', root);
    flagButton.hidden = name !== 'mines';
    if (name === 'mines') {
      flagButton.textContent = game.flagMode ? 'Flag: on' : 'Flag: off';
      flagButton.setAttribute('aria-pressed', String(game.flagMode));
    }
  }
  function draw() {
    game.paused = started && !running;
    game.draw(context);
    if (!started) {
      context.fillStyle = 'rgba(14,25,21,.82)';
      context.fillRect(0, canvas.height / 2 - 52, canvas.width, 104);
      context.fillStyle = '#f7f6f2';
      context.font = `bold ${canvas.width < 400 ? 18 : 22}px monospace`;
      context.textAlign = 'center';
      context.fillText('READY WHEN YOU ARE', canvas.width / 2, canvas.height / 2 - 4);
      context.font = '13px monospace';
      context.fillStyle = '#bccaa9';
      context.fillText('Press Start', canvas.width / 2, canvas.height / 2 + 25);
    }
    sync();
  }
  function tick(time) {
    if (!alive || !running) return;
    const delta = lastTime ? Math.min(45, time - lastTime) : 0;
    lastTime = time;
    game.update(delta);
    draw();
    if (game.over) { running = false; sync(); return; }
    frame = requestAnimationFrame(tick);
  }
  function pause() {
    running = false; lastTime = 0; game.moveDirection = 0;
    heldKeys.clear(); cancelAnimationFrame(frame); draw();
  }
  function start() {
    if (game.over) select(name);
    started = true; running = true; game.paused = false; lastTime = 0;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
    canvas.focus({preventScroll:true});
    sync();
  }
  function select(next) {
    clearInterval(repeat); cancelAnimationFrame(frame); heldKeys.clear();
    name = next; game = gameFactories[name](); started = false; running = false; lastTime = 0;
    canvas.width = metadata[name].size[0]; canvas.height = metadata[name].size[1];
    canvas.setAttribute('aria-label', `Playable ${metadata[name].name} board`);
    $('[data-game-title]', root).textContent = metadata[name].name;
    $('[data-game-score-label]', root).textContent = metadata[name].scoreLabel || 'SCORE';
    $('[data-game-extra-label]', root).firstChild.textContent = metadata[name].extra;
    $('[data-game-instruction]', root).textContent = metadata[name].instruction;
    $('[data-game-source]', root).href = metadata[name].source;
    $$('[data-game]', root).forEach(button => button.setAttribute('aria-pressed', String(button.dataset.game === name)));
    $$('[data-game-action]', root).forEach(button => {
      const action = button.dataset.gameAction;
      button.hidden = (noDrop.has(name) && action === 'drop') ||
        (['pinpog','breakout','connect4','invaders'].includes(name) && !['left','right',...(name === 'pinpog' ? [] : ['drop'])].includes(action)) ||
        (name === 'flappy' && action !== 'drop');
    });
    const drop = $('[data-game-action="drop"]', root);
    const label = {mines:'Open',memory:'Flip',connect4:'Place',breakout:'Launch',invaders:'Fire',flappy:'Flap'}[name] || 'Drop';
    drop.textContent = label;
    drop.setAttribute('aria-label', label + (name === 'tetris' ? ' piece' : ''));
    draw();
  }
  function action(direction) {
    if (!running || game.over) return;
    game.action(direction);
    draw();
  }
  function releaseControl() { clearInterval(repeat); repeat = 0; if (game) game.moveDirection = 0; }

  $$('[data-game]', root).forEach(button => button.addEventListener('click', () => select(button.dataset.game), {signal}));
  $('[data-game-start]', root).addEventListener('click', () => running ? pause() : start(), {signal});
  $('[data-game-restart]', root).addEventListener('click', () => { select(name); start(); }, {signal});
  $('[data-game-flag]', root).addEventListener('click', () => { if (name === 'mines') { game.flagMode = !game.flagMode; sync(); } }, {signal});
  document.addEventListener('keydown', event => {
    if (document.querySelector('dialog[open]') || event.target.matches?.('input,textarea,select')) return;
    const key = event.key.toLowerCase();
    if (key === 'p' && !event.repeat) { event.preventDefault(); running ? pause() : start(); return; }
    if (event.key === 'Enter' && event.target === canvas && !running) { event.preventDefault(); start(); return; }
    if (!running || event.target !== canvas) return;
    if (name === 'mines' && key === 'f') { event.preventDefault(); if (!event.repeat) action('flag'); return; }
    if (name === 'flappy' && ['arrowup','w'].includes(key)) { event.preventDefault(); if (!event.repeat) action('drop'); return; }
    if (event.code === 'Space') {
      event.preventDefault();
      if (['mines','breakout','memory','connect4','invaders','flappy','tetris'].includes(name)) action(name === 'mines' ? 'reveal' : 'drop');
      return;
    }
    const direction = keyActions[key];
    if (direction) {
      event.preventDefault();
      if (name !== 'snake' || !event.repeat) action(direction);
      if (paddleGames.has(name)) {
        heldKeys.add(key);
        game.moveDirection = Number(heldKeys.has('d') || heldKeys.has('arrowright')) - Number(heldKeys.has('a') || heldKeys.has('arrowleft'));
      }
    }
  }, {signal});
  document.addEventListener('keyup', event => {
    if (!paddleGames.has(name) || !game) return;
    heldKeys.delete(event.key.toLowerCase());
    game.moveDirection = Number(heldKeys.has('d') || heldKeys.has('arrowright')) - Number(heldKeys.has('a') || heldKeys.has('arrowleft'));
  }, {signal});
  $$('[data-game-action]', root).forEach(button => {
    button.addEventListener('pointerdown', event => {
      if (event.button !== 0 || !running) return;
      event.preventDefault(); button.setPointerCapture(event.pointerId);
      const direction = button.dataset.gameAction;
      action(direction);
      if (paddleGames.has(name) && direction !== 'drop') game.moveDirection = direction === 'left' ? -1 : 1;
      else if (name === 'tetris' && ['left','right','down'].includes(direction)) repeat = setInterval(() => action(direction), 135);
      else if (name === 'invaders' && direction === 'drop') repeat = setInterval(() => action('drop'), 220);
    }, {signal});
    ['pointerup','pointercancel','lostpointercapture'].forEach(type => button.addEventListener(type, releaseControl, {signal}));
    button.addEventListener('click', event => { if (event.detail === 0) action(button.dataset.gameAction); }, {signal});
  });
  const position = event => {
    const box = canvas.getBoundingClientRect();
    return [(event.clientX - box.left) * canvas.width / box.width, (event.clientY - box.top) * canvas.height / box.height];
  };
  function movePaddle(event) {
    if (!paddleGames.has(name) || !running || game.over || (event.type === 'pointermove' && event.buttons !== 1)) return;
    const [x] = position(event);
    if (name === 'invaders') game.shipX = Math.max(22, Math.min(618, x));
    else game.paddleX = Math.max(8, Math.min(640 - game.paddleWidth - 8, x - game.paddleWidth / 2));
  }
  canvas.addEventListener('pointerdown', event => {
    if (!running) return;
    canvas.focus({preventScroll:true});
    if (swipeGames.has(name)) swipe = {x:event.clientX,y:event.clientY};
    if (tapGames.has(name)) { event.preventDefault(); game.tap(...position(event), name === 'mines' && (event.button === 2 || game.flagMode)); draw(); }
    if (name === 'flappy') { event.preventDefault(); action('drop'); }
    if (paddleGames.has(name)) { canvas.setPointerCapture(event.pointerId); movePaddle(event); }
  }, {signal});
  canvas.addEventListener('pointermove', movePaddle, {signal});
  canvas.addEventListener('pointerup', event => {
    if (!swipeGames.has(name) || !swipe) return;
    const dx = event.clientX - swipe.x, dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 20) action(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  }, {signal});
  canvas.addEventListener('contextmenu', event => { if (name === 'mines') event.preventDefault(); }, {signal});
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) pause(); }, {signal});
  const observer = new MutationObserver(() => { if (document.querySelector('dialog[open]') && running) pause(); });
  $$('dialog').forEach(dialog => observer.observe(dialog, {attributes:true,attributeFilter:['open']}));
  select(initial);
  return () => { alive = false; cancelAnimationFrame(frame); clearInterval(repeat); observer.disconnect(); controller.abort(); };
}
