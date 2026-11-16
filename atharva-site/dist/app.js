import { mountDrawing, mountCamera, mountGuestbook } from './tools.js';
import { mountArcade } from './tools-arcade.js';

const main = document.querySelector('main');
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const icon = name => ({
  bookmark:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
  search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
  paint:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="m17 44 27-30 7 7-28 29-9 2zM14 52l-4 4M39 20l7 7M11 13h18M11 22h12"/></svg>',
  game:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M15 23h34l7 23c1 5-4 8-8 4l-9-8H25l-9 8c-4 4-9 1-8-4zM19 29v10M14 34h10M43 31h.1M48 36h.1M32 23v-9"/></svg>',
  camera:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 21h12l5-7h14l5 7h12v31H8z"/><circle cx="32" cy="36" r="10"/><path d="M45 27h5"/></svg>',
  note:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M13 9h38v36L39 57H13zM39 57V45h12M22 23h20M22 31h20M22 39h9"/></svg>'
}[name] || '');
let data;
let cleanup = () => {};
let currentRoute = '';
let workFilter = 'all';
let collectionFilter = 'denim';
let musicFilter = 'all';
let musicQuery = '';
let trackIndex = 0;
let toastTimer;
let saved = [];
try { const stored = JSON.parse(localStorage.getItem('atharva-saved-v1') || '[]'); if (Array.isArray(stored)) saved = stored.filter(x => typeof x === 'string').slice(0, 200); } catch {}

function toast(message) {
  const el = $('.toast');
  el.textContent = message; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 2800);
}
function saveButton(id, label = false) {
  return `<button class="save-button" data-save="${escape(id)}" aria-pressed="${saved.includes(id)}" aria-label="${saved.includes(id) ? 'Remove from' : 'Add to'} saved items">${icon('bookmark')}${label ? `<span>${saved.includes(id) ? 'Saved' : 'Save for later'}</span>` : ''}</button>`;
}
function syncSaves() {
  $$('[data-saved-count]').forEach(el => { el.textContent = saved.length; });
  $$('[data-save]').forEach(el => {
    const isSaved = saved.includes(el.dataset.save);
    el.setAttribute('aria-pressed', String(isSaved));
    el.setAttribute('aria-label', isSaved ? 'Remove from saved items' : 'Add to saved items');
    if ($('span', el)) $('span', el).textContent = isSaved ? 'Saved' : 'Save for later';
  });
}
function toggleSaved(id) {
  const wasSaved = saved.includes(id);
  const next = wasSaved ? saved.filter(x => x !== id) : [...saved, id];
  try { localStorage.setItem('atharva-saved-v1', JSON.stringify(next)); }
  catch { toast('Your browser could not save this item.'); return; }
  saved = next; syncSaves(); toast(wasSaved ? 'Removed from your saved items.' : 'Saved to your reading shelf.');
  if (currentRoute === 'saved') { renderSaved(); }
}

const visualWords = {descreened:'descreened.',yis:'Young Investors<br><em>Society.</em>',ascent:'Ascent<br><em>Capital.</em>',finedu:'fin<span style="color:#7d9889">edu</span><span class="cursor"></span>',deca:'DECA',tcs:'Connected<br><em>thinking.</em>',debate:'Make the<br><em>argument.</em>',bpa:'The investment<br><em>thesis.</em>',fccla:'Finance for<br><em>more people.</em>',track:'Raise<br><em>the bar.</em>'};
function projectVisual(project) {
  const i = data.projects.indexOf(project) + 1;
  return `<div class="project-visual ${project.id}${project.banner ? ' has-banner' : ''}" aria-hidden="true">${project.banner ? `<img class="project-banner" src="${project.banner}" alt="" loading="lazy">` : `<span class="visual-label">${escape(project.kind)}</span><span class="visual-word">${visualWords[project.id]}</span>`}<span class="visual-no">AN / ${String(i).padStart(2,'0')}</span></div>`;
}
function projectCard(project) {
  return `<a class="work-card" href="#work/${project.id}">${projectVisual(project)}<div class="work-card-info"><div class="work-card-meta"><span>${escape(project.kind)}</span><span>${String(data.projects.indexOf(project)+1).padStart(2,'0')} ↗</span></div><h3>${escape(project.name)}<span aria-hidden="true">↗</span></h3><p>${escape(project.summary)}</p></div></a>`;
}
const essayShort = {haas:'Consumerism, Fast Fashion, and the Facade of ESG',ieox:'Education Inequalities'};
const essayDescription = {haas:'The costs of cheap clothing, and what corporate sustainability promises leave out.',ieox:'How history, geography, and access to support shape who gets to learn.'};
function essayRow(essay, i) {
  return `<a class="essay-row" href="#writing/${essay.id}"><span class="essay-index">0${i+1}</span><div><span class="eyebrow">${i === 0 ? 'Economics & sustainability' : 'Education & equity'}</span><h3>${essayShort[essay.id]}</h3><p>${essayDescription[essay.id]}</p></div><span class="essay-meta"><strong>${essay.award.toLowerCase()}</strong>${essay.id === 'haas' ? 'Haas Economics' : 'IEOx Essay Challenge'}<br><span>2025 · ${essay.minutes} min read</span></span><span class="essay-arrow" aria-hidden="true">↗</span></a>`;
}
function pageHead(kicker, title, description, side = '') {
  return `<header class="page-head"><div><span class="eyebrow">${kicker}</span><h1>${title}</h1><p>${description}</p></div>${side ? `<span class="page-side-note">${side}</span>` : ''}</header>`;
}
function home() {
  const featured = ['descreened','deca','ascent'].map(id => data.projects.find(p => p.id === id));
  return `<div class="page-enter"><section class="hero"><div class="hero-copy"><span class="eyebrow"><span class="status-dot"></span>Atharva Naveen / The personal website</span><h1>To know is<br>to <em>not know.</em></h1><p>I’m Atharva. I work on finance, education, and digital wellbeing. This is where I keep what I build, write, and collect.</p><div class="hero-actions"><a class="button" href="#work">Explore my work <span aria-hidden="true">↗</span></a><a class="link-arrow" href="#about">A little about me <span aria-hidden="true">↗</span></a></div><div class="hero-note"><span class="status-dot"></span>A few open files. Always more questions.</div></div><div class="hero-art"><a class="artifact-window" href="#work/ascent" aria-label="Explore Ascent Capital research"><div class="artifact-bar"><span>good_company.bmp</span><span class="window-dots"><i></i><i></i><i></i></span></div><img src="${data.projects.find(p=>p.id==='ascent').banner}" alt="Atharva Naveen reviewing financial research notes" width="1056" height="868" fetchpriority="high"><div class="artifact-caption"><span>ASCENT CAPITAL / RESEARCH</span><span>01 / PERSONAL FILES ↗</span></div></a><span class="artifact-sticker" aria-hidden="true">Still<br>figuring<br>it out.</span><a href="#questions" class="artifact-note"><span class="eyebrow">A note to self / 001</span><p>Leave room for<br>a better question.</p><span class="eyebrow">Open the questions ↗</span></a><span class="artifact-asterisk" aria-hidden="true">✳</span></div></section><div class="intro-strip"><span>FINANCE · TECHNOLOGY · PEOPLE</span><span>WORK, WORDS & EVERYTHING ELSE</span><a href="#playground">There’s a little more to explore ↗</a></div><section class="section"><div class="section-heading"><span class="section-number">01</span><h2>Selected work</h2><a href="#work">All 10 projects ↗</a></div><div class="work-cards">${featured.map(projectCard).join('')}</div></section><section class="section"><div class="section-heading"><span class="section-number">02</span><h2>On paper</h2><a href="#writing">The writing archive ↗</a></div><div class="writing-list">${data.essays.map(essayRow).join('')}</div></section><section class="section"><div class="section-heading"><span class="section-number">03</span><h2>Off the clock</h2><a href="#playground">The playground ↗</a></div><div class="personal-grid"><a class="personal-card" href="#collections"><div><span class="eyebrow">Objects & their details</span><h3>Collected<br>along the way.</h3><p>Denim, team shirts,<br>and the things I keep.</p><span class="card-arrow" aria-hidden="true">↗</span></div><img src="${data.denim[2].image}" alt="Black denim from my collection" loading="lazy" width="240" height="250"></a><a class="personal-card mixtape-tease" href="#mixtape"><div><span class="eyebrow">Side A / Side B / Side C</span><h3>Always<br>on repeat.</h3><p>100 songs, old favorites,<br>and a FIFA kickoff feeling.</p><span class="card-arrow" aria-hidden="true">↗</span></div><div class="mini-record"><img src="${data.tracks[0].cover}" alt="Tumblr Girls album artwork" loading="lazy" width="180" height="180"></div></a></div><div class="home-bottom"><p>Have something in mind?</p><a class="link-arrow" href="mailto:aty.naveen@gmail.com">Let’s talk <span aria-hidden="true">↗</span></a></div></section></div>`;
}
function renderWork() {
  const options = [['all','Everything'],['impact','Impact'],['finance','Finance'],['build','Technology'],['leadership','Leadership'],['beyond','Beyond work']];
  const projects = data.projects.filter(p => workFilter === 'all' || p.tags.includes(workFilter));
  main.innerHTML = `<div class="page-wrap page-enter">${pageHead('01 / Work & experience','The open files.','Projects, teams, research, and competitions. A record of the work and my part in it.','10 FILES<br>FINANCE · TECHNOLOGY · PEOPLE')}<div class="filters" role="group" aria-label="Filter projects">${options.map(([id, text]) => `<button class="filter-button" data-work-filter="${id}" aria-pressed="${id === workFilter}">${text}</button>`).join('')}<span class="result-count" role="status">${projects.length} ${projects.length === 1 ? 'file' : 'files'}</span></div><div class="work-grid">${projects.map(projectCard).join('')}</div></div>`;
}
function renderProject(id) {
  const project = data.projects.find(p => p.id === id);
  if (!project) return notFound();
  const next = data.projects[(data.projects.indexOf(project)+1)%data.projects.length];
  main.innerHTML = `<article class="page-wrap page-enter"><div class="breadcrumb"><a href="#work">← All work</a><span>/</span><span>${escape(project.name)}</span></div><header class="project-detail-head"><div><span class="eyebrow">${escape(project.kind)}</span><h1>${escape(project.name)}</h1><p>${escape(project.role)}</p></div><div class="button-row">${saveButton('project:'+id, true)}</div></header><div class="project-detail-body">${projectVisual(project)}<div><p class="project-description">${escape(project.summary)}</p><span class="eyebrow">From the project file</span><ul class="evidence-list">${project.evidence.map(e => `<li>${escape(e)}</li>`).join('')}</ul>${project.sources?.length ? `<div class="project-sources"><span class="eyebrow">Source links</span>${project.sources.map(source => `<a href="${escape(source.url)}" ${source.url.startsWith('#') ? '' : 'target="_blank" rel="noopener noreferrer"'}>${escape(source.label)} ↗</a>`).join('')}</div>` : ''}<p class="eyebrow" style="margin-top:25px">${escape(project.period)}</p></div></div><nav class="project-pagination" aria-label="Other projects"><a class="link-arrow" href="#work">← Back to work</a><a class="link-arrow" href="#work/${next.id}">Next: ${escape(next.name)} <span aria-hidden="true">↗</span></a></nav></article>`;
}
function renderWriting() {
  main.innerHTML = `<div class="page-wrap page-enter">${pageHead('02 / Selected writing','Ideas on paper.','Two essays about the systems behind everyday life: what we wear, and who gets to learn.','2025<br>02 ESSAYS')}<div class="writing-list">${data.essays.map(essayRow).join('')}</div><div class="reading-note"><p>Each essay includes a reading view and its original PDF with references.</p><a class="link-arrow" href="#saved">Your reading shelf <span aria-hidden="true">↗</span></a></div></div>`;
}
function renderEssay(id) {
  const essay = data.essays.find(e => e.id === id);
  if (!essay) return notFound();
  main.innerHTML = `<div class="page-wrap page-enter"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="#writing">← All writing</a><span>/</span><span>2025</span></nav><article class="reader"><span class="eyebrow">${essay.id === 'haas' ? 'Economics & sustainability' : 'Education & equity'} / ${essay.award.toLowerCase()}</span><h1>${essayShort[id]}</h1><p class="reader-deck">${essayDescription[id]}</p><div class="reader-meta"><span>ATHARVA NAVEEN · 2025</span><span>${essay.minutes} MIN READ</span>${saveButton('essay:'+id)}</div><div class="reader-article">${essay.html}</div><footer class="reader-end"><span class="reader-credit">${escape(essay.contest)}<br>${essay.award.toLowerCase()} · 2025</span><a class="button secondary small" href="${essay.pdf}" download="Atharva-Naveen-${id === 'haas' ? 'Fast-Fashion-ESG' : 'Education-Inequalities'}.pdf">Original PDF & references ↓</a></footer></article></div>`;
}
function renderCollections() {
  const items = collectionFilter === 'sports' ? data.sports : collectionFilter === 'boards' ? data.boards : data.denim;
  main.innerHTML = `<div class="page-wrap page-enter">${pageHead('03 / Personal collections','Things I keep.','A small archive of denim and team shirts. Open a piece for a closer look.','15 PIECES · 5 BOARDS<br>DENIM & SPORTS')}<div class="filters" role="group" aria-label="Choose a collection"><button class="filter-button" data-collection-filter="denim" aria-pressed="${collectionFilter === 'denim'}">Denim <span>08</span></button><button class="filter-button" data-collection-filter="sports" aria-pressed="${collectionFilter === 'sports'}">Sports <span>07</span></button><button class="filter-button" data-collection-filter="boards" aria-pressed="${collectionFilter === 'boards'}">Boards <span>05</span></button><span class="result-count">${items.length} pieces</span></div><div class="collection-grid">${items.map(item => `<article class="collection-card"><button class="collection-image-button" data-collection-open="${item.id}" aria-label="View ${escape(item.name)}"><span class="collection-number">${item.number} / ${collectionFilter.toUpperCase()}</span><img src="${item.image}" alt="${escape(item.name)}" loading="lazy" width="240" height="280"></button>${saveButton('collection:'+item.id)}<div class="collection-info"><h3><button class="text-button" style="font:inherit;color:inherit;padding:0;text-align:left" data-collection-open="${item.id}">${escape(item.name)}</button></h3><span>${escape(item.maker || (item.group === 'boards' ? 'Sports collection board' : 'Denim collection'))}</span></div></article>`).join('')}</div><p class="collection-caption">The collection includes the pieces and the original boards from the living résumé.</p></div>`;
}
function openCollection(id) {
  const item = [...data.denim,...data.sports,...data.boards].find(x => x.id === id);
  if (!item) return;
  const dialog = $('#detail-dialog');
  $('.dialog-content', dialog).innerHTML = `<div class="dialog-top"><span class="eyebrow">The ${item.group} collection / ${item.number}</span><button class="icon-button" data-detail-close aria-label="Close collection details">×</button></div><div class="dialog-grid"><div class="dialog-image"><img src="${item.image}" alt="${escape(item.name)}" width="350" height="400"></div><div class="dialog-copy"><span class="eyebrow">Piece ${item.number}</span><h2>${escape(item.name)}</h2><p>${escape(item.description)}</p>${item.maker ? `<dl><div><dt>Team / maker</dt><dd>${escape(item.maker)}</dd></div><div><dt>Piece</dt><dd>${escape(item.piece)}</dd></div></dl>` : ''}${saveButton('collection:'+id,true)}<p class="local-note">Saved items stay in this browser.</p></div></div>`;
  if (!dialog.open) dialog.showModal();
}
function renderPlayground() {
  const cards = [
    ['mixtape','01 / Listening','The mixtape.','100 songs. Old favorites, late nights, and the sound of a FIFA kickoff.','Browse the records','<div class="record-art"></div>'],
    ['studio','02 / Making','An empty canvas.','Pick a color, make a mark, and take your drawing with you.','Open the studio',icon('paint')],
    ['arcade','03 / A short break','The little arcade.','Eleven games, from Tetris and Snake to Space Invaders and Flappy Bird.','Pick a game',icon('game')],
    ['camera','04 / Looking','The camera room.','Take a photo or bring your own. Try a few looks, then save your favorite.','Enter the darkroom',icon('camera')],
    ['questions','05 / Thinking','A few questions.','A question about fate and choice. Move the slider to show where you land.','Follow the thought','<span class="question-symbol">?</span>'],
    ['guestbook','06 / A small keepsake','Leave a note.','A little board for words and doodles. A keepsake in your browser.','Open the guestbook',`<img src="${data.mascot}" alt="The original pixel mascot" loading="lazy">`]
  ];
  main.innerHTML = `<div class="page-wrap page-enter">${pageHead('04 / Outside the project files','Room to play.','A few corners of the internet for listening, making, and taking a break.','NO RUSH.<br>STAY A WHILE.')}<div class="play-grid">${cards.map(([id,kicker,title,copy,action,art]) => `<a class="play-card" href="#${id}"><div class="play-art" aria-hidden="true">${art}</div><span class="eyebrow">${kicker}</span><h2>${title}</h2><p>${copy}</p><span class="link-arrow">${action}<span aria-hidden="true">↗</span></span></a>`).join('')}</div><p class="play-intro-note">Drawings, camera captures, game scores, and guestbook notes are kept in your browser. You can download what you make.</p></div>`;
}
function renderMusic() {
  main.innerHTML = `<div class="page-wrap page-enter"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="#playground">← Playground</a><span>/</span><span>Mixtape</span></nav>${pageHead('Side A / Side B / Side C','Always on repeat.','A hundred songs for late nights, old favorites, and that FIFA kickoff feeling.','100 SONGS<br>03 SIDES')}<div class="music-layout"><section class="music-deck" aria-label="Selected song" id="music-deck"></section><section class="music-library" aria-label="Song library"><div class="music-toolbar">${icon('search')}<label class="sr-only" for="music-search">Search songs or artists</label><input type="search" id="music-search" placeholder="Search songs or artists…" value="${escape(musicQuery)}" autocomplete="off"></div><div class="filters" role="group" aria-label="Choose a mixtape side">${[['all','All songs'],['Original 14','A / Originals'],['After hours','B / After hours'],['FIFA feeling','C / Kickoff']].map(([id,text]) => `<button class="filter-button" data-music-filter="${id}" aria-pressed="${musicFilter === id}">${text}</button>`).join('')}</div><div class="music-count" id="music-count" role="status"></div><div id="track-list"></div></section></div></div>`;
  renderDeck(); renderTracks();
}
function renderTracks() {
  const query = musicQuery.trim().toLowerCase();
  const tracks = data.tracks.filter(t => (musicFilter === 'all' || t.section === musicFilter) && `${t.title} ${t.artist}`.toLowerCase().includes(query));
  $('#music-count').textContent = `${tracks.length} ${tracks.length === 1 ? 'song' : 'songs'}${query ? ' found' : ' in the stack'}`;
  $('#track-list').innerHTML = tracks.length ? tracks.map(t => {
    const index = data.tracks.indexOf(t);
    return `<button class="track-row" data-track="${index}" aria-pressed="${index === trackIndex}" aria-label="Select ${escape(t.title)} by ${escape(t.artist)}"><span class="track-index">${String(index+1).padStart(2,'0')}</span><img src="${t.cover}" alt="" loading="lazy" width="38" height="38"><span><strong>${escape(t.title)}</strong><small>${escape(t.artist)}</small></span><span class="track-play" aria-hidden="true">${index === trackIndex ? '♪' : '↗'}</span></button>`;
  }).join('') : `<div class="empty-state"><h2>No songs found.</h2><p>Try another title or artist, or choose a different side.</p><button class="button secondary small" data-music-reset>Reset search</button></div>`;
}
function renderDeck() {
  const t = data.tracks[trackIndex];
  $('#music-deck').innerHTML = `<div class="album-stage"><img src="${t.cover}" alt="Album artwork for ${escape(t.title)}" width="280" height="280"></div><span class="track-number">ON THE DECK / ${String(trackIndex+1).padStart(3,'0')} OF 100</span><h2>${escape(t.title)}</h2><p>${escape(t.artist)}</p><div class="track-actions"><button class="button secondary small" data-track-prev aria-label="Previous song">←</button><button class="button secondary small" data-track-next aria-label="Next song">→</button><button class="button secondary small" data-track-shuffle>Shuffle</button>${saveButton('track:'+t.id)}</div><div class="player-shell"><button class="player-load" data-player-load>Load Spotify player <span aria-hidden="true">▷</span></button></div><p class="deck-note">Playback is handled by Spotify. <a href="https://open.spotify.com/track/${t.spotify}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">Open this song in Spotify ↗</a></p>`;
}
function selectTrack(index) {
  trackIndex = (index + data.tracks.length) % data.tracks.length;
  renderDeck();
  $$('.track-row').forEach(row => { const selected = Number(row.dataset.track) === trackIndex; row.setAttribute('aria-pressed', String(selected)); $('.track-play',row).textContent = selected ? '♪' : '↗'; });
}
function renderAbout() {
  main.innerHTML = `<div class="page-wrap page-enter"><div class="about-grid"><div><span class="eyebrow">05 / A little context</span><h1>Hi, I’m<br><em>Atharva.</em></h1><p class="about-lead">Finance, technology, and how people spend their time.</p><p>Those interests run through the things I work on—from digital wellbeing at Descreened to student investing and FinTech education.</p><p>I also write about economics and education, compete in speech and debate, and collect denim, team shirts, and probably too many songs.</p><p>This website brings those parts together. There’s work to read, a few things to look through, and a small playground to get lost in.</p><div class="button-row" style="margin-top:30px"><a class="button" href="#work">Explore the work ↗</a><a class="link-arrow" href="#writing">Read my writing <span>↗</span></a></div></div><div><figure class="about-portrait"><img src="${data.projects.find(p=>p.id==='ascent').banner}" alt="Atharva Naveen reviewing financial research notes" width="1056" height="868"><figcaption><span>ATHARVA / THE PROJECT FILES</span><span>AN / 01</span></figcaption></figure><dl class="about-facts"><div><dt>Work</dt><dd>Digital wellbeing, finance, education</dd></div><div><dt>Outside work</dt><dd>Debate, pole vault, music, collecting</dd></div><div><dt>Elsewhere</dt><dd><a href="https://www.linkedin.com/in/aty1/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a> &nbsp;·&nbsp; <a href="https://www.instagram.com/pro_aty/" target="_blank" rel="noopener noreferrer">Instagram ↗</a> &nbsp;·&nbsp; <a href="https://retro.app/@pro_aty" target="_blank" rel="noopener noreferrer">Retro ↗</a></dd></div></dl></div></div><section class="about-contact"><div><h2>Start a conversation.</h2><p>For a project, a question, or something worth sharing.</p></div><a class="button secondary" href="mailto:aty.naveen@gmail.com">aty.naveen@gmail.com <span>↗</span></a></section></div>`;
}
function savedRecord(id) {
  const [kind, key] = id.split(':');
  if (kind === 'project') { const p = data.projects.find(x => x.id === key); return p && {title:p.name,sub:p.summary,type:'Work',url:'#work/'+key}; }
  if (kind === 'essay') { const e = data.essays.find(x => x.id === key); return e && {title:essayShort[key],sub:`2025 · ${e.minutes} min read`,type:'Writing',url:'#writing/'+key}; }
  if (kind === 'track') { const t = data.tracks.find(x => x.id === key); return t && {title:t.title,sub:t.artist,type:'Music',url:'#mixtape/'+data.tracks.indexOf(t)}; }
  if (kind === 'collection') { const c = [...data.denim,...data.sports,...data.boards].find(x => x.id === key); return c && {title:c.name,sub:c.description,type:'Collection',url:'#collections/'+c.id}; }
}
function renderSaved() {
  const records = saved.map(id => ({id,...savedRecord(id)})).filter(x => x.title);
  main.innerHTML = `<div class="page-wrap page-enter">${pageHead('Your personal reading shelf','For later.','Save a project, essay, song, or collection piece as you explore. Your shelf stays in this browser.',`${records.length} SAVED<br>BROWSER ONLY`)}${records.length ? `<div class="saved-list">${records.map(r => `<article class="saved-row"><a href="${r.url}"><span class="eyebrow">${r.type}</span><h2>${escape(r.title)}</h2><small>${escape(r.sub)}</small></a>${saveButton(r.id)}</article>`).join('')}</div>` : '<div class="empty-state"><h2>A little space for your finds.</h2><p>Use the bookmark button on anything you’d like to come back to.</p><div class="button-row" style="justify-content:center"><a class="button" href="#work">Explore the work ↗</a><a class="button secondary" href="#writing">Browse the essays ↗</a></div></div>'}</div>`;
}
function toolHead(kicker,title,copy) {
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="#playground">← Playground</a><span>/</span><span>${kicker}</span></nav>${pageHead(kicker,title,copy)}`;
}
function renderStudio() {
  main.innerHTML = `<div class="page-wrap page-enter">${toolHead('The drawing studio','Make a little something.','An empty page, a few colors, and no particular brief. Download your drawing when you’re done.')}<section class="tool-panel" aria-label="Drawing studio"><div class="tool-bar"><div class="color-palette" role="group" aria-label="Ink color">${[['#252b26','Ink'],['#626c48','Olive'],['#b64f34','Terracotta'],['#caad60','Gold'],['#6e9594','Teal'],['#9a8cb5','Lavender'],['#ffffff','Eraser']].map(([color,name],i) => `<button class="color-swatch" data-draw-color="${color}" style="--swatch:${color}" aria-label="${name}" aria-pressed="${i===0}"></button>`).join('')}</div><div class="tool-controls"><label for="brush-size">Brush</label><select id="brush-size"><option value="3">Fine</option><option value="7" selected>Medium</option><option value="16">Bold</option></select><button class="button secondary small" data-draw-undo>Undo</button><button class="button secondary small" data-draw-clear>Clear</button></div></div><canvas class="drawing-canvas" id="drawing-canvas" width="1400" height="700" aria-label="Drawing canvas. Drag to draw; use the arrow keys to move and Space to make a mark." tabindex="0"></canvas><div class="tool-bottom"><span data-draw-status role="status">Pick a color and make a mark.</span><button class="button small" data-draw-download>Download drawing ↓</button></div></section><p class="play-intro-note">Prefer the original desktop tools? <a href="https://jspaint.app/" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">Open JS Paint ↗</a></p></div>`;
  cleanup = mountDrawing(main, toast);
}
function renderCamera() {
  main.innerHTML = `<div class="page-wrap page-enter">${toolHead('The camera room','Look a little closer.','Take a photo or import one. Pick a look and download the result.')}<div class="camera-layout"><section><div class="camera-view"><video id="camera-video" autoplay muted playsinline hidden></video><img id="camera-image" alt="Imported photo" hidden><div class="camera-empty"><span>${icon('camera')}</span><h2>Ready when you are.</h2><p>Start your camera or choose a photo to begin.</p></div><span class="camera-label">CAM 01 / YOUR LOCAL ROLL</span></div><div class="camera-controls"><button class="button secondary small" id="camera-start">Start camera</button><button class="shutter-button" id="camera-capture" aria-label="Capture photo" disabled></button><label class="button secondary small import-label" for="camera-file">Import photo ↗</label><input class="sr-only" id="camera-file" type="file" accept="image/*"><button class="text-button" id="camera-stop" hidden>Turn camera off</button></div><p class="camera-status" role="status" id="camera-status">Camera is off. Photos stay on this device.</p></section><aside class="camera-sidebar"><span class="eyebrow">Choose a look</span><div class="camera-filters" role="group" aria-label="Photo filter">${[['original','Original'],['flash','2004 flash'],['warm','35mm warm'],['blue','Blue hour'],['noir','Noir'],['faded','Faded print'],['vhs','VHS / 97'],['pixel','Pixel snap']].map(([id,name]) => `<button class="camera-filter" data-camera-filter="${id}" aria-pressed="${id === 'original'}">${name}</button>`).join('')}</div><p>Choose a filter before capturing. Your next frame will use the selected look.</p><div class="camera-shot" hidden><span class="eyebrow">Latest frame</span><img id="camera-shot" alt="Latest captured photo"><button class="button small" id="camera-download">Download photo ↓</button></div></aside></div><div class="camera-roll" aria-label="Session camera roll"></div><p class="play-intro-note">Captures stay in this page until you leave. Download any frames you want to keep.</p></div>`;
  cleanup = mountCamera(main, toast);
}
function renderArcade(game = 'tetris') {
  const order = ['tetris','snake','pinpog','mines','2048','breakout','memory','connect4','maze','invaders','flappy'];
  const symbols = ['▞','∿','●','✱','2ⁿ','▤','◇','●','◕','▴','↝'];
  main.innerHTML = `<div class="page-wrap page-enter">${toolHead('The little arcade','One more round.','Eleven browser games from the living résumé. Pick one, press Start, and take a break.')}<div class="arcade-layout"><aside><div class="game-menu" role="group" aria-label="Choose a game">${order.map((id,i) => `<button class="game-choice" data-game="${id}" aria-pressed="${game === id}"><span aria-hidden="true">${symbols[i]}</span><span><strong>${escape(data.games[id].name)}</strong><small>${escape(data.games[id].extra.toLowerCase())} / ${String(i+1).padStart(2,'0')}</small></span></button>`).join('')}</div><p class="game-hint">Keyboard and touch controls.<br>Your best scores stay in this browser.</p></aside><section class="game-station" aria-label="Arcade game"><div class="game-station-bar"><h2 data-game-title>${escape(data.games[game].name)}</h2><div class="button-row"><button class="button secondary small" data-game-flag hidden aria-pressed="false">Flag: off</button><button class="button secondary small" data-game-start>Start</button><button class="button secondary small" data-game-restart>Restart</button></div></div><div class="game-hud"><span><small data-game-score-label>SCORE</small><strong data-game-score>0</strong></span><span>PERSONAL BEST<strong data-game-best>0</strong></span><span data-game-extra-label>LINES<strong data-game-extra>0</strong></span></div><div class="game-screen"><canvas id="game-canvas" width="300" height="600" tabindex="0" aria-label="${escape(data.games[game].name)} game board"></canvas></div><div class="game-controls" role="group" aria-label="Game controls">${[['left','←','Move left'],['up','↑','Move up or rotate'],['down','↓','Move down'],['right','→','Move right'],['drop','Drop','Main action']].map(([id,symbol,name]) => `<button data-game-action="${id}" aria-label="${name}">${symbol}</button>`).join('')}</div><p class="game-instruction" data-game-instruction></p><a class="game-credit" data-game-source target="_blank" rel="noopener noreferrer">Original open-source project ↗</a></section></div></div>`;
  cleanup = mountArcade(main, game, data.games);
}
function renderQuestions() {
  const storageKey = 'atharva-big-question-fate-choice';
  let choice = 50;
  try { const stored = localStorage.getItem(storageKey); if (stored !== null) choice = Math.max(0,Math.min(100,Math.round(Number(stored)||0))); } catch {}
  main.innerHTML = `<div class="page-wrap page-enter">${toolHead('The big question','Fate or choice?','An old question with no simple answer. Move the slider to show where you stand.')}<section class="question-card" aria-label="A question to consider"><span class="question-mark" aria-hidden="true">?</span><blockquote id="question-text">${escape(data.question)}</blockquote></section><div class="question-progress"><label for="question-slider">Where do you land?</label><input type="range" id="question-slider" min="0" max="100" value="${choice}" aria-describedby="question-answer"><div class="question-labels"><span>Fate</span><strong id="question-answer" role="status"></strong><span>Choice</span></div></div><div class="question-actions"><span class="eyebrow">Your answer is saved in this browser.</span><button class="button secondary small" data-question-reset>Reset to the middle</button></div></div>`;
  const update = () => {
    $('#question-slider').value = String(choice);
    $('#question-slider').setAttribute('aria-valuetext', `${100-choice} percent fate, ${choice} percent choice`);
    $('#question-answer').textContent = `FATE ${100-choice}% / CHOICE ${choice}%`;
    try { localStorage.setItem(storageKey,String(choice)); } catch {}
  };
  $('#question-slider').addEventListener('input', e => { choice = Math.round(Number(e.target.value)); update(); });
  $('[data-question-reset]').addEventListener('click', () => { choice = 50; update(); $('#question-slider').focus(); });
  update();
}
function renderGuestbook() {
  main.innerHTML = `<div class="page-wrap page-enter">${toolHead('The guestbook','Leave a little trace.','A note, a thought, or a small drawing. A keepsake for this corner of the internet.')}<div class="guestbook-layout"><section class="guestbook-notes" aria-label="Your saved guestbook notes"></section><form class="guestbook-form"><h2>A note for the board.</h2><label for="guest-name">Your name (optional)</label><input id="guest-name" name="name" maxlength="35" placeholder="A visitor" autocomplete="nickname"><label for="guest-message">Your note <span style="text-transform:none">/ up to 240 characters</span></label><textarea id="guest-message" name="message" maxlength="240" placeholder="Something you’d like to leave here…" required></textarea><label for="guest-doodle">A doodle, if you like</label><canvas class="doodle-canvas" id="guest-doodle" width="500" height="250" tabindex="0" aria-label="Optional doodle canvas. Drag to draw; arrow keys to move and Space to mark."></canvas><button class="text-button" type="button" data-doodle-clear>Clear doodle</button><button class="button" type="submit">Pin to the board <span>↗</span></button><p class="guestbook-status" role="status">Notes are saved only in this browser. They aren’t sent to Atharva or shared with other visitors.</p></form></div></div>`;
  cleanup = mountGuestbook(main, data.mascot, toast);
}
function notFound() { main.innerHTML = `<div class="page-wrap page-enter"><div class="empty-state"><span class="eyebrow">File not found</span><h2 style="margin-top:20px">This page isn’t in the notebook.</h2><p>Try the search, or start again from the home page.</p><a href="#home" class="button">Back home ↗</a></div></div>`; }

const aliases = {portfolio:'work',music:'mixtape',games:'arcade',paint:'studio',jeans:'collections/denim',sports:'collections/sports'};
const routeTitles = {home:'Projects & living résumé.',work:'The open files',writing:'Ideas on paper',collections:'Things I keep',playground:'Room to play',about:'A little context',mixtape:'The mixtape',saved:'Your reading shelf',studio:'The drawing studio',camera:'The camera room',arcade:'The little arcade',questions:'Still thinking',guestbook:'The guestbook'};
function render() {
  cleanup(); cleanup = () => {};
  let raw; try { raw = decodeURIComponent(location.hash.slice(1) || 'home'); } catch { raw = 'not-found'; }
  let [route, id] = raw.split('/');
  if (aliases[route]) { const alias = aliases[route].split('/'); route = alias[0]; id = alias[1] || id; }
  currentRoute = route;
  $('#mobile-nav').hidden = true; $('.menu-toggle').setAttribute('aria-expanded','false'); $('.menu-toggle').setAttribute('aria-label','Open navigation');
  $$('.desktop-nav a').forEach(a => { const group = ['mixtape','studio','camera','arcade','questions','guestbook'].includes(route) ? 'playground' : route; if(a.dataset.nav === group) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  document.title = `${route === 'work' && id ? data.projects.find(p=>p.id===id)?.name || 'Work' : route === 'writing' && id ? essayShort[id] || 'Writing' : routeTitles[route] || 'Page not found'} — Atharva Naveen`;
  switch(route) {
    case 'home': main.innerHTML = home(); break;
    case 'work': id ? renderProject(id) : renderWork(); break;
    case 'writing': id ? renderEssay(id) : renderWriting(); break;
    case 'collections':
      if (['sports','denim','boards'].includes(id)) collectionFilter = id;
      else if(id) collectionFilter = data.sports.some(x=>x.id===id) ? 'sports' : data.boards.some(x=>x.id===id) ? 'boards' : 'denim';
      renderCollections(); if(id && !['denim','sports','boards'].includes(id)) openCollection(id); break;
    case 'playground': renderPlayground(); break;
    case 'about': renderAbout(); break;
    case 'mixtape': if(id && Number.isFinite(Number(id))) trackIndex = Math.max(0,Math.min(99,Number(id))); renderMusic(); break;
    case 'saved': renderSaved(); break;
    case 'studio': renderStudio(); break;
    case 'camera': renderCamera(); break;
    case 'arcade': renderArcade(Object.hasOwn(data.games,id) ? id : 'tetris'); break;
    case 'questions': renderQuestions(id); break;
    case 'guestbook': renderGuestbook(); break;
    default: notFound();
  }
  syncSaves();
  window.scrollTo({top:0,behavior:'instant'});
  main.focus({preventScroll:true});
}

// One search covers navigation and the site's actual content.
function searchRecords() {
  return [
    ...Object.entries(routeTitles).map(([id,title])=>({title,sub:({home:'Home',work:'All projects and experience',writing:'All essays',collections:'Denim and team shirts',playground:'Music, creative tools, and games',about:'About Atharva',saved:'Your saved items',mixtape:'The 100-song mixtape',studio:'Drawing studio',camera:'Photo tools',arcade:'Tetris, Snake, PinPog',questions:'The big questions',guestbook:'Notes and doodles'})[id],type:'Page',url:'#'+id})),
    ...data.projects.map(p=>({title:p.name,sub:p.summary,type:'Work',url:'#work/'+p.id})),
    ...data.essays.map(e=>({title:essayShort[e.id],sub:essayDescription[e.id],type:'Essay',url:'#writing/'+e.id})),
    ...data.tracks.map((t,i)=>({title:t.title,sub:t.artist,type:'Song',url:'#mixtape/'+i})),
    ...[...data.denim,...data.sports,...data.boards].map(c=>({title:c.name,sub:c.description,type:'Object',url:'#collections/'+c.id}))
  ];
}
function updateSearch() {
  const query = $('#site-search').value.trim().toLowerCase();
  const records = searchRecords();
  const results = query ? records.filter(r=>`${r.title} ${r.sub}`.toLowerCase().includes(query)).sort((a,b)=>Number(b.title.toLowerCase().startsWith(query))-Number(a.title.toLowerCase().startsWith(query))).slice(0,12) : records.filter(r=>r.type==='Page').slice(1,7);
  $('#search-results').innerHTML = results.length ? results.map((r,i)=>`<a class="search-result" href="${r.url}"><span class="search-kind">${String(i+1).padStart(2,'0')}</span><span><strong>${escape(r.title)}</strong><small>${r.type} · ${escape(r.sub)}</small></span><span aria-hidden="true">↗</span></a>`).join('') : '<p class="search-empty">No matches yet. Try a different name or topic.</p>';
}
function closeSearch() { $('#search-dialog').close(); }
function openSearch() { if (!data) return; $('#site-search').value = ''; updateSearch(); $('#search-dialog').showModal(); $('#site-search').focus(); }

document.addEventListener('click', e => {
  const target = e.target.closest('button,a');
  if(!target) return;
  if(target.classList.contains('skip-link')) { e.preventDefault(); main.focus(); main.scrollIntoView({block:'start'}); return; }
  if(target.hasAttribute('data-search-open')) openSearch();
  if(target.hasAttribute('data-search-close')) closeSearch();
  if(target.classList.contains('search-result')) closeSearch();
  if(target.classList.contains('menu-toggle')) {
    const nav = $('#mobile-nav'); nav.hidden = !nav.hidden; target.setAttribute('aria-expanded',String(!nav.hidden)); target.setAttribute('aria-label',nav.hidden ? 'Open navigation' : 'Close navigation');
  }
  if(target.dataset.save) toggleSaved(target.dataset.save);
  if(target.dataset.workFilter) { workFilter = target.dataset.workFilter; renderWork(); $(`[data-work-filter="${workFilter}"]`).focus({preventScroll:true}); }
  if(target.dataset.collectionFilter) { collectionFilter = target.dataset.collectionFilter; renderCollections(); $(`[data-collection-filter="${collectionFilter}"]`).focus({preventScroll:true}); }
  if(target.dataset.collectionOpen) openCollection(target.dataset.collectionOpen);
  if(target.hasAttribute('data-detail-close')) $('#detail-dialog').close();
  if(target.dataset.musicFilter) { musicFilter = target.dataset.musicFilter; $$('.music-library [data-music-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===target))); renderTracks(); }
  if(target.hasAttribute('data-music-reset')) { musicFilter='all'; musicQuery=''; $('#music-search').value=''; $$('.music-library [data-music-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.musicFilter==='all'))); renderTracks(); }
  if(target.hasAttribute('data-track')) selectTrack(Number(target.dataset.track));
  if(target.hasAttribute('data-track-prev')) selectTrack(trackIndex-1);
  if(target.hasAttribute('data-track-next')) selectTrack(trackIndex+1);
  if(target.hasAttribute('data-track-shuffle')) { let next = trackIndex; while(next===trackIndex) next=Math.floor(Math.random()*100); selectTrack(next); }
  if(target.hasAttribute('data-player-load')) {
    const track=data.tracks[trackIndex];
    $('.player-shell').innerHTML=`<iframe class="music-embed" src="https://open.spotify.com/embed/track/${track.spotify}?utm_source=generator&theme=0" title="Spotify player: ${escape(track.title)}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  }
});
document.addEventListener('input', e=> { if(e.target.id==='music-search'){musicQuery=e.target.value;renderTracks();} });
$('#site-search').addEventListener('input', updateSearch);
document.addEventListener('keydown', e=> {
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#search-dialog').open ? closeSearch() : openSearch();return;}
  if(e.key==='Escape' && !$('#mobile-nav').hidden){$('#mobile-nav').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Open navigation');$('.menu-toggle').focus();}
  if(!$('#search-dialog').open) return;
  const links=$$('.search-result'); const current=links.indexOf(document.activeElement);
  if(e.key==='ArrowDown'){e.preventDefault();links[Math.min(current+1,links.length-1)]?.focus();}
  if(e.key==='ArrowUp'){e.preventDefault();if(current<=0)$('#site-search').focus();else links[current-1]?.focus();}
  if(e.key==='Enter'&&document.activeElement===$('#site-search')&&links.length){e.preventDefault();links[0].click();}
});
for(const dialog of $$('dialog')) dialog.addEventListener('click',e=> { if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();} });
window.addEventListener('hashchange', () => { if($('#detail-dialog').open) $('#detail-dialog').close(); render(); });
window.addEventListener('pagehide',()=>cleanup());
document.getElementById('copyright-year').textContent = new Date().getFullYear();
try {
  const response = await fetch('content.json');
  if(!response.ok) throw new Error('Content could not load');
  data = await response.json();
  render();
} catch(error) {
  console.error(error);
  main.innerHTML = '<div class="page-wrap"><div class="empty-state"><h1>The notebook couldn’t open.</h1><p style="margin-top:20px">Please reload the page. If you’re opening the source files directly, use the standalone HTML version or the local preview.</p><a class="button" href="mailto:aty.naveen@gmail.com">Get in touch ↗</a></div></div>';
}
