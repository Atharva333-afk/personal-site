const DESIGN_WIDTH = 2048;
    const DESIGN_HEIGHT = 805;
    const hotspotLayer = document.getElementById('hotspot-layer');
    const hotspots = [...document.querySelectorAll('.hotspot')];
    const toolButtons = [...document.querySelectorAll('.hotspot[data-group="tool"]')];
    const menuButtons = [...document.querySelectorAll('.hotspot[data-group="menu"]')];
    const jeansPage = document.getElementById('jeans-page');
    const jeansButton = document.querySelector('.hotspot[data-jeans]');
    const jeansButtons = [...document.querySelectorAll('[data-jeans]')];
    let lastJeansTrigger = jeansButton;
    const jeansOverviewFrame = document.getElementById('jeans-overview-frame');
    const jeanItems = [...document.querySelectorAll('[data-jean-item]')];
    const jeanJumpButtons = [...document.querySelectorAll('[data-jean-jump]')];
    const jeansArchive = {
      'vintage-blue': { number: '01', name: 'Vintage Blue Fold' },
      'soft-stone': { number: '02', name: 'Soft Stone' },
      'graphic-black': { number: '03', name: 'Graphic Black' },
      'plaid-star': { number: '04', name: 'Plaid Star' },
      'deep-indigo': { number: '05', name: 'Deep Indigo' },
      'faded-light': { number: '06', name: 'Faded Light Wash' },
      'washed-black': { number: '07', name: 'Washed Black' },
      'stacked-indigo': { number: '08', name: 'Stacked Indigo' }
    };
    const jeanField = (name) => jeansPage.querySelector(`[data-jean-${name}]`);

    const resetJeansSelection = () => {
      jeanItems.forEach((item) => {
        item.classList.remove('is-selected');
        item.setAttribute('aria-pressed', 'false');
      });
      jeanJumpButtons.forEach((button) => {
        button.classList.remove('is-selected');
        button.setAttribute('aria-pressed', 'false');
      });
      jeansOverviewFrame?.classList.remove('has-selection');
      jeanField('count').textContent = '00 / 08';
      jeanField('kicker').textContent = 'MY JEANS ARCHIVE';
      jeanField('name').textContent = 'Choose a pair';
      jeanField('intro').textContent = 'Eight pairs in the denim archive. Choose one to see it up close.';
      jeansPage.querySelector('.jeans-detail-list').hidden = true;
      jeansPage.querySelector('[data-jeans-status]').textContent = 'Ready: select a pair';
    };

    const selectJean = (id) => {
      const pair = jeansArchive[id];
      if (!pair) return;
      jeanItems.forEach((item) => {
        const selected = item.dataset.jeanItem === id;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      jeanJumpButtons.forEach((button) => {
        const selected = button.dataset.jeanJump === id;
        button.classList.toggle('is-selected', selected);
        button.setAttribute('aria-pressed', String(selected));
        if (selected && window.matchMedia('(max-width: 820px)').matches) {
          button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
      jeansOverviewFrame?.classList.add('has-selection');
      jeanField('count').textContent = `${pair.number} / 08`;
      jeanField('kicker').textContent = `PAIR ${pair.number} / MY JEANS ARCHIVE`;
      jeanField('name').textContent = pair.name;
      jeanField('intro').textContent = `Pair ${pair.number} from the visual archive. Compare the wash and details with the other pairs.`;
      const recorded = ['company','style','bought','price','why'];
      recorded.forEach(key => {
        const field = jeanField(key);
        field.textContent = pair[key] || '';
        field.closest('.jeans-detail-row').hidden = !pair[key];
      });
      jeansPage.querySelector('.jeans-detail-list').hidden = !recorded.some(key => pair[key]);
      jeansPage.querySelector('[data-jeans-status]').textContent = `Selected: ${pair.name}`;
    };

    jeanItems.forEach((item) => item.addEventListener('click', () => selectJean(item.dataset.jeanItem)));
    jeanJumpButtons.forEach((button) => button.addEventListener('click', () => selectJean(button.dataset.jeanJump)));
    jeansPage.querySelector('[data-jeans-reset]')?.addEventListener('click', resetJeansSelection);

    const setJeansPageOpen = (isOpen, { focus = true } = {}) => {
      jeansPage.hidden = !isOpen;
      document.body.classList.toggle('is-jeans-open', isOpen);
      jeansButtons.forEach((button) => button.setAttribute('aria-expanded', String(isOpen)));
      if (focus) {
        if (isOpen) jeansPage.querySelector('[data-jeans-home]')?.focus();
        else lastJeansTrigger?.focus();
      }
    };

    const openJeansPage = (trigger = null) => {
      if (trigger instanceof HTMLElement) lastJeansTrigger = trigger;
      resetJeansSelection();
      setJeansPageOpen(true);
      // Keep the page usable when opened from file:// or other restricted previews.
      if (window.location.hash !== '#jeans') {
        try {
          history.pushState({ page: 'jeans' }, '', '#jeans');
        } catch (_) {
          window.location.hash = 'jeans';
        }
      }
    };

    const closeJeansPage = () => {
      setJeansPageOpen(false);
      if (window.location.hash === '#jeans') {
        try {
          history.pushState({}, '', `${window.location.pathname}${window.location.search}`);
        } catch (_) {
          window.location.hash = '';
        }
      }
    };

    jeansButtons.forEach((button) => button.addEventListener('click', () => openJeansPage(button)));

    document.querySelectorAll('[data-jeans-home]').forEach((button) => button.addEventListener('click', closeJeansPage));
    window.addEventListener('popstate', () => setJeansPageOpen(window.location.hash === '#jeans', { focus: false }));
    window.addEventListener('hashchange', () => setJeansPageOpen(window.location.hash === '#jeans', { focus: false }));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !jeansPage.hidden) closeJeansPage();
    });
    setJeansPageOpen(window.location.hash === '#jeans', { focus: false });



    const sportsPage = document.getElementById('sports-page');
    const sportsButtons = [...document.querySelectorAll('[data-sports]')];
    const sportsShirts = [...sportsPage.querySelectorAll('[data-sports-shirt]')];
    const usaShirt = sportsPage.querySelector('[data-sports-shirt="usa"]');
    const positionUsaShirt = () => {
      usaShirt.setAttribute('transform', window.matchMedia('(max-width:700px)').matches ? 'translate(1390 115)' : 'translate(1525 115)');
    };
    positionUsaShirt();
    window.addEventListener('resize', positionUsaShirt);
    const sportsBoardButtons = [...sportsPage.querySelectorAll('[data-sports-board]')];
    const sportsStatus = sportsPage.querySelector('[data-sports-status]');
    const sportsCollage = sportsPage.querySelector('[data-sports-collage]');
    const sportsLayers = sportsPage.querySelector('[data-sports-layers]');
    const sportsBoardPreview = sportsPage.querySelector('[data-board-preview]');
    const sportsNotes = sportsPage.querySelector('#sports-notes');
    const sportsNotesButton = sportsPage.querySelector('[data-open-sports-notes]');
    const sportsViewName = sportsPage.querySelector('[data-archive-view]');
    const sportsArchive = {
      rugby: { number:'01', kicker:'POLO · PIECE 01', name:'Puma Play Bold Polo', maker:'Puma', piece:'Cream short-sleeve polo · “Play Bold”', bought:'Not recorded', price:'Not recorded' },
      cowboys: { number:'02', kicker:'AMERICAN FOOTBALL · PIECE 02', name:'Dallas Cowboys Tee', maker:'Dallas Cowboys', piece:'Heather gray short-sleeve team tee', bought:'Not recorded', price:'Not recorded' },
      england: { number:'03', kicker:'INTERNATIONAL FOOTBALL · PIECE 03', name:'England National Team Jersey', maker:'Nike · England', piece:'White short-sleeve national-team jersey', bought:'Not recorded', price:'Not recorded' },
      barcelona: { number:'04', kicker:'CLUB FOOTBALL · PIECE 04', name:'FC Barcelona Shirt', maker:'FC Barcelona', piece:'Blue-and-red striped collared shirt', bought:'Not recorded', price:'Not recorded' },
      longhorns: { number:'05', kicker:'TEXAS SPORTS · PIECE 05', name:'Texas Longhorns Tee', maker:'Texas Longhorns', piece:'Black short-sleeve team tee', bought:'Not recorded', price:'Not recorded' },
      brunson: { number:'06', kicker:'BASKETBALL · PIECE 06', name:'Brunson No. 11 Jersey', maker:'Brunson · number 11', piece:'White basketball jersey', bought:'Not recorded', price:'Not recorded' },
      usa: { number:'07', kicker:'INTERNATIONAL FOOTBALL · PIECE 07', name:'USA National Team Jersey', maker:'Nike · USA', piece:'Navy star-pattern national-team jersey', bought:'Not recorded', price:'Not recorded' }
    };

    const sportsBoards = {"rugby":{"name":"Rugby","copy":"","image":"assets/generated/05886b01da23c3f804c1.webp"},"clubs":{"name":"Club shirts","copy":"","image":"assets/generated/de8581dbecf422aa3781.webp"},"texas":{"name":"Texas & Dallas","copy":"","image":"assets/generated/c6514bdc0c7e4f20c247.webp"},"national":{"name":"National teams","copy":"","image":"assets/generated/fb709c6fb48186494b64.webp"},"basketball":{"name":"Basketball","copy":"","image":"assets/generated/180f23e79fb161a21559.webp"}};
    let selectedSportsShirt = null;
    let selectedSportsBoard = null;
    let lastSportsTrigger = document.querySelector('.hotspot[data-sports]');
    let lastNotesTrigger = null;
    let sportsPointerType = 'mouse';
    const sportsTouch = () => sportsPointerType === 'touch' || window.matchMedia('(hover:none)').matches;
    const sportsHint = () => sportsTouch() ? 'Tap a shirt or collection to explore' : 'Hover to lift · double-click for notes';
    const orderSportsLayers = (raised = null) => {
      const pinned = sportsShirts.find(p => p.dataset.sportsShirt === selectedSportsShirt);
      const desired = sportsShirts.filter(p => p !== pinned && p !== raised);
      if (pinned && pinned !== raised) desired.push(pinned);
      if (raised) desired.push(raised);
      // Preserve keyboard focus while changing SVG paint order.
      if (!sportsLayers.moveBefore && sportsLayers.contains(document.activeElement)) return;
      desired.forEach((piece,index) => {
        const reference = sportsLayers.children[index] || null;
        if (reference === piece) return;
        if (sportsLayers.moveBefore) sportsLayers.moveBefore(piece,reference);
        else sportsLayers.insertBefore(piece,reference);
      });
    };
    const raiseSportsPiece = (piece, raised) => {
      piece.classList.toggle('is-raised', raised || piece.dataset.sportsShirt === selectedSportsShirt);
      if (raised) orderSportsLayers(piece);
      else orderSportsLayers();
    };
    const resetSportsSelection = () => {
      selectedSportsShirt = null; selectedSportsBoard = null;
      sportsShirts.forEach(piece => { piece.classList.remove('is-raised');piece.setAttribute('aria-pressed','false'); });
      sportsBoardButtons.forEach(button => { button.classList.remove('is-selected');button.setAttribute('aria-pressed','false'); });
      orderSportsLayers();
      sportsCollage.hidden = false;
      sportsCollage.style.display = '';
      sportsBoardPreview.hidden = true;
      sportsNotesButton.hidden = true;
      sportsViewName.textContent = 'Sports Archive / All pieces';
      sportsStatus.textContent = sportsHint();
    };
    const selectSportsShirt = (id) => {
      selectedSportsShirt = id;selectedSportsBoard = null;
      sportsShirts.forEach(piece => { const active = piece.dataset.sportsShirt === id;piece.classList.toggle('is-raised',active);piece.setAttribute('aria-pressed',String(active)); });
      orderSportsLayers();sportsNotesButton.hidden = false;
      sportsViewName.textContent = 'Sports Archive / ' + sportsArchive[id].name;
      sportsStatus.textContent = sportsArchive[id].name + ' · double-click or choose Open notes';
    };
    const selectSportsBoard = (id) => {
      resetSportsSelection();selectedSportsBoard = id;
      sportsCollage.style.display = 'none';
      sportsBoardPreview.hidden = false;
      sportsBoardPreview.querySelector('img').src = sportsBoards[id].image;
      sportsBoardPreview.querySelector('img').alt = sportsBoards[id].name + ' collection';
      sportsBoardButtons.forEach(button => { const active = button.dataset.sportsBoard === id;button.classList.toggle('is-selected',active);button.setAttribute('aria-pressed',String(active)); });
      sportsNotesButton.hidden = false;
      sportsViewName.textContent = 'Sports Archive / ' + sportsBoards[id].name;
      sportsStatus.textContent = sportsBoards[id].name + ' · double-click or choose Open notes';
    };
    const openSportsNotes = (trigger) => {
      const isBoard = Boolean(selectedSportsBoard);
      const item = isBoard ? sportsBoards[selectedSportsBoard] : sportsArchive[selectedSportsShirt];
      if (!item) return;
      lastNotesTrigger = trigger || document.activeElement;
      sportsNotes.querySelector('#sports-notes-name').textContent = item.name;
      sportsNotes.querySelector('[data-note-kicker]').textContent = isBoard ? 'SPORTS ARCHIVE / COLLECTION' : item.kicker;
      sportsNotes.querySelector('[data-note-copy]').textContent = isBoard ? `${item.name} collection board.` : item.piece;
      const noteImage = sportsNotes.querySelector('[data-note-image]');
      noteImage.src = isBoard ? item.image : sportsShirts.find(piece => piece.dataset.sportsShirt === selectedSportsShirt).querySelector('image').getAttribute('href');
      noteImage.alt = item.name;
      sportsNotes.querySelector('[data-note-meta]').hidden = isBoard;
      if (!isBoard) ['maker','piece','bought','price'].forEach(key => { const field=sportsNotes.querySelector('[data-note-'+key+']'); const value=['bought','price'].includes(key) && item[key]==='Not recorded' ? '' : item[key]; field.textContent=value; field.parentElement.hidden=!value; });
      sportsNotes.querySelector('[data-note-story]').textContent = '';
      sportsNotes.querySelector('[data-note-story]').closest('.sports-notes-story').hidden = true;
      if (!sportsNotes.open) sportsNotes.showModal();
    };
    const closeSportsNotes = () => { if (sportsNotes.open) sportsNotes.close(); };
    sportsNotes.querySelectorAll('[data-close-sports-notes]').forEach(button => button.addEventListener('click',closeSportsNotes));
    sportsNotes.addEventListener('close',() => { lastNotesTrigger?.focus({preventScroll:true}); });
    sportsNotes.addEventListener('click',event => {
      if(event.target !== sportsNotes) return;
      const r = sportsNotes.getBoundingClientRect();
      if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) closeSportsNotes();
    });
    sportsNotesButton.addEventListener('click',event=>openSportsNotes(event.currentTarget));
    sportsPage.addEventListener('pointerdown',event=>{sportsPointerType=event.pointerType;});
    sportsShirts.forEach(piece => {
      const id=piece.dataset.sportsShirt;
      piece.addEventListener('pointerenter',event=>{if(event.pointerType==='touch')return;raiseSportsPiece(piece,true);sportsStatus.textContent=sportsArchive[id].name+' · double-click for notes';});
      piece.addEventListener('pointerleave',()=>{raiseSportsPiece(piece,false);sportsStatus.textContent=selectedSportsShirt?sportsArchive[selectedSportsShirt].name+' · selected':sportsHint();});
      piece.addEventListener('focus',()=>raiseSportsPiece(piece,true));
      piece.addEventListener('blur',()=>raiseSportsPiece(piece,false));
      piece.addEventListener('click',()=>{selectSportsShirt(id);if(sportsTouch())openSportsNotes(piece);});
      piece.addEventListener('dblclick',event=>{event.preventDefault();selectSportsShirt(id);openSportsNotes(piece);});
      piece.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectSportsShirt(id);if(event.key==='Enter')openSportsNotes(piece);}});
    });
    sportsBoardButtons.forEach(button=>{
      const id=button.dataset.sportsBoard;
      button.addEventListener('click',event=>{selectSportsBoard(id);if(sportsTouch()||event.detail===0)openSportsNotes(button);});
      button.addEventListener('dblclick',()=>{selectSportsBoard(id);openSportsNotes(button);});
    });
    sportsBoardPreview.addEventListener('dblclick',()=>openSportsNotes(sportsBoardPreview));
    sportsBoardPreview.addEventListener('click',event=>{if(sportsTouch()||event.detail===0)openSportsNotes(sportsBoardPreview);});
    sportsPage.querySelector('[data-sports-reset]').addEventListener('click',resetSportsSelection);
    const setSportsPageOpen = (isOpen,{focus=true}={}) => {
      if(!isOpen)closeSportsNotes();
      sportsPage.hidden=!isOpen;
      document.body.classList.toggle('is-sports-open',isOpen);
      sportsButtons.forEach(button=>button.setAttribute('aria-expanded',String(isOpen)));
      if(focus){if(isOpen)sportsPage.querySelector('[data-sports-home]').focus();else lastSportsTrigger?.focus();}
    };
    const openSportsPage = (trigger=null) => {
      if(trigger instanceof HTMLElement)lastSportsTrigger=trigger;
      resetSportsSelection();setSportsPageOpen(true);sportsPage.scrollTop=0;
      sportsPage.querySelector('.sports-workspace').scrollTop=0;
      if(window.location.hash!=='#sports'){try{history.pushState({page:'sports'},'','#sports');}catch(_){window.location.hash='sports';}}
    };
    const closeSportsPage = () => {
      setSportsPageOpen(false);
      if(window.location.hash==='#sports'){try{history.pushState({},'',window.location.pathname+window.location.search);}catch(_){window.location.hash='';}}
    };
    sportsButtons.forEach(button=>button.addEventListener('click',()=>openSportsPage(button)));
    sportsPage.querySelectorAll('[data-sports-home]').forEach(button=>button.addEventListener('click',closeSportsPage));
    window.addEventListener('popstate',()=>setSportsPageOpen(window.location.hash==='#sports',{focus:false}));
    window.addEventListener('hashchange',()=>setSportsPageOpen(window.location.hash==='#sports',{focus:false}));
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!sportsPage.hidden&&!sportsNotes.open){closeSportsPage();}});
    resetSportsSelection();setSportsPageOpen(window.location.hash==='#sports',{focus:false});

    const sizeHotspots = () => {
      const scale = Math.max(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT);
      document.documentElement.style.setProperty('--image-scale', scale);
    };
    sizeHotspots();
    window.addEventListener('resize', sizeHotspots);

    const phrases = ['know', 'you know!', 'know you.', 'do you know!', 'you do know?', 'Who/What/When/How'];
    const typingPlans = [
      [{ type: 'knoe' }, { pause: 420 }, { delete: 1 }, { type: 'w' }],
      [{ type: 'yuo' }, { pause: 360 }, { delete: 3 }, { type: 'you know!' }],
      [{ type: 'know you,' }, { pause: 440 }, { delete: 1 }, { type: '.' }],
      [{ type: 'do ypu' }, { pause: 390 }, { delete: 3 }, { type: 'you know!' }],
      [{ type: 'you do know!' }, { pause: 470 }, { delete: 1 }, { type: '?' }],
      [{ type: 'Who/Whar' }, { pause: 520 }, { delete: 1 }, { type: 't/When/How' }]
    ];
    const typedLineGroups = [
      [...document.querySelectorAll('.typing-layer .typed-line')],
      [...document.querySelectorAll('.mobile-canvas .mobile-typed-line')]
    ].filter((group) => group.length === phrases.length);
    const eachTypedLine = (lineIndex, callback) => {
      typedLineGroups.forEach((group) => callback(group[lineIndex]));
    };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionItemSelector = [
      '.portfolio-hero', '.portfolio-explorer-head', '.portfolio-item:not([hidden])',
      '.portfolio-feature-top', '.portfolio-detail-photo:not([hidden])', '.portfolio-feature-bottom',
      '.writing-lead', '.writing-card', '.writing-reader-bar', '.writing-paper',
      '.jeans-overview', '.jeans-pair-button', '.archive-board',
      '.games-intro', '.game-cartridge', '.games-station', '.questions-prompt',
      '.music-intro', '.music-deck', '.music-library',
      '.guestbook-intro', '.guestbook-editor', '.guestbook-board'
    ].join(',');
    const playSurfaceMotion = surface => {
      if (reducedMotion || !surface) return;
      surface.classList.remove('ui-enter');
      const targets = [...surface.querySelectorAll(motionItemSelector)]
        .filter(element => !element.hidden && !element.closest('[hidden]'))
        .slice(0,10);
      surface.querySelectorAll('.ui-motion-item').forEach(element => {
        element.classList.remove('ui-motion-item');
        element.style.removeProperty('--motion-delay');
      });
      targets.forEach((element,index) => {
        element.classList.add('ui-motion-item');
        element.style.setProperty('--motion-delay',`${55 + Math.min(index,7) * 34}ms`);
      });
      requestAnimationFrame(() => {
        void surface.offsetWidth;
        surface.classList.add('ui-enter');
      });
    };

    if (reducedMotion) {
      typedLineGroups.forEach((group) => {
        group.forEach((line, index) => { line.textContent = phrases[index]; });
      });
    } else {
      const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
      const typeText = async (lineIndex, text) => {
        for (const character of text) {
          eachTypedLine(lineIndex, (line) => { line.textContent += character; });
          await wait(48 + Math.random() * 72);
        }
      };
      const deleteText = async (lineIndex, count) => {
        for (let index = 0; index < count; index += 1) {
          eachTypedLine(lineIndex, (line) => { line.textContent = line.textContent.slice(0, -1); });
          await wait(62 + Math.random() * 58);
        }
      };
      const runTyping = async () => {
        await wait(420);
        for (let lineIndex = 0; lineIndex < typingPlans.length; lineIndex += 1) {
          eachTypedLine(lineIndex, (line) => line.classList.add('is-typing'));
          for (const action of typingPlans[lineIndex]) {
            if (action.type) await typeText(lineIndex, action.type);
            if (action.delete) await deleteText(lineIndex, action.delete);
            if (action.pause) await wait(action.pause);
          }
          eachTypedLine(lineIndex, (line) => {
            line.textContent = phrases[lineIndex];
            line.classList.remove('is-typing');
          });
          await wait(220 + Math.random() * 240);
        }
      };
      runTyping();
    }

    const menuContents = {
      File: [['New', 'Ctrl+N'], ['Open...', 'Ctrl+O'], ['Save', 'Ctrl+S'], ['Save As...', 'Ctrl+Shift+S'], '-', ['Print...', 'Ctrl+P'], ['Exit', '']],
      Edit: [['Undo', 'Ctrl+Z'], ['Repeat', 'F4'], '-', ['Cut', 'Ctrl+X'], ['Copy', 'Ctrl+C'], ['Paste', 'Ctrl+V'], ['Clear Selection', 'Del'], ['Select All', 'Ctrl+A']],
      View: [['Tool Box', 'Ctrl+T'], ['Color Box', 'Ctrl+L'], ['Status Bar', ''], ['Text Toolbar', ''], '-', ['Zoom', '']],
      Image: [['Flip/Rotate...', 'Ctrl+R'], ['Stretch/Skew...', 'Ctrl+W'], ['Invert Colors', 'Ctrl+I'], ['Attributes...', 'Ctrl+E'], ['Clear Image', 'Ctrl+Shift+N'], ['Draw Opaque', ''], '-', ['Jeans Project...', ''], ['Sports Archive...', '']],
      Colors: [['Edit Colors...', ''], ['Get Colors...', ''], ['Save Colors...', '']],
      Help: [['Help Topics', 'F1'], ['Ask the Mascot...', ''], '-', ['Sound', ''], ['About Paint', '']],
      Extras: [['Themes', ''], ['Language', ''], ['Multi-User', ''], ['Manage Storage', '']]
    };

    const menuPopup = document.createElement('div');
    menuPopup.className = 'retro-menu';
    menuPopup.setAttribute('role', 'menu');
    menuPopup.hidden = true;
    hotspotLayer.append(menuPopup);
    let activeMenuButton = null;

    const closeMenu = ({ restoreFocus = false } = {}) => {
      if (!activeMenuButton) return;
      const previousButton = activeMenuButton;
      previousButton.classList.remove('is-menu-open', 'is-highlighted');
      previousButton.setAttribute('aria-expanded', 'false');
      activeMenuButton = null;
      menuPopup.hidden = true;
      menuPopup.replaceChildren();
      if (restoreFocus) previousButton.focus();
    };

    const openMenu = (button, focusFirstItem = false) => {
      if (activeMenuButton === button) {
        closeMenu();
        return;
      }
      closeMenu();
      activeMenuButton = button;
      button.classList.add('is-menu-open');
      button.setAttribute('aria-expanded', 'true');
      const menuName = button.getAttribute('aria-label');
      menuPopup.setAttribute('aria-label', `${menuName} menu`);
      menuPopup.style.left = `${button.offsetLeft}px`;
      menuPopup.style.top = `${button.offsetTop + button.offsetHeight}px`;

      for (const entry of menuContents[menuName] || []) {
        if (entry === '-') {
          const separator = document.createElement('div');
          separator.className = 'retro-menu-separator';
          separator.setAttribute('role', 'separator');
          menuPopup.append(separator);
          continue;
        }
        const [label, shortcut] = entry;
        const item = document.createElement('button');
        item.className = 'retro-menu-item';
        item.type = 'button';
        item.setAttribute('role', 'menuitem');
        item.innerHTML = `<span>${label}</span>${label === 'Sound' ? `<span class="retro-menu-shortcut" data-help-sound>${soundEnabled && AudioEngine ? 'On' : 'Off'}</span>` : shortcut ? `<span class="retro-menu-shortcut">${shortcut}</span>` : ''}`;
        if (label === 'Sound') { item.setAttribute('aria-label', `Sound ${soundEnabled ? 'on' : 'off'}. Click to toggle`); item.setAttribute('data-sound-toggle', ''); }
        item.addEventListener('pointerdown', () => item.classList.add('is-pressing'));
        item.addEventListener('pointerup', () => item.classList.remove('is-pressing'));
        item.addEventListener('pointercancel', () => item.classList.remove('is-pressing'));
        item.addEventListener('click', () => {
          if (label === 'Jeans Project...') {
            closeMenu();
            openJeansPage(button);
          } else if (label === 'Sports Archive...') {
            closeMenu();
            openSportsPage(button);
          } else if (label === 'Sound') {
            toggleSiteSound();
          } else if (label === 'Help Topics' || label === 'Ask the Mascot...') {
            closeMenu();
            openMascotGuide();
          } else {
            window.setTimeout(() => closeMenu(), 80);
          }
        });
        menuPopup.append(item);
      }

      menuPopup.hidden = false;
      if (focusFirstItem) menuPopup.querySelector('.retro-menu-item')?.focus();
    };

    menuPopup.addEventListener('keydown', (event) => {
      const items = [...menuPopup.querySelectorAll('.retro-menu-item')];
      const currentIndex = items.indexOf(document.activeElement);
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu({ restoreFocus: true });
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        items[(currentIndex + 1) % items.length]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length]?.focus();
      }
    });

    toolButtons.forEach((button, index) => {
      button.style.setProperty('--icon-offset', `${index * -42}px`);
      if (!button.hasAttribute('data-linkedin') && !button.hasAttribute('data-instagram') && !button.hasAttribute('data-retro') && !button.hasAttribute('data-email')) button.setAttribute('aria-pressed', 'false');
    });

    menuButtons.forEach((button) => {
      button.setAttribute('aria-haspopup', 'menu');
      button.setAttribute('aria-expanded', 'false');
      button.addEventListener('pointerenter', () => button.classList.add('is-highlighted'));
      button.addEventListener('pointerleave', () => {
        if (button !== activeMenuButton) button.classList.remove('is-highlighted');
      });
    });

    hotspots.forEach((button) => {
      const release = () => button.classList.remove('is-pressing');
      button.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        button.classList.add('is-pressing');
        button.setPointerCapture?.(event.pointerId);
      });
      button.addEventListener('pointerup', release);
      button.addEventListener('pointercancel', release);
      button.addEventListener('lostpointercapture', release);

      button.addEventListener('click', (event) => {
        if (button.hasAttribute('data-retro') || button.hasAttribute('data-email')) return;
        if (button.hasAttribute('data-linkedin')) {
          button.classList.remove('is-linkedin-click');
          void button.offsetWidth;
          button.classList.add('is-linkedin-click');
          window.setTimeout(() => button.classList.remove('is-linkedin-click'), 360);
        } else if (button.hasAttribute('data-instagram')) {
          button.classList.remove('is-instagram-click');
          void button.offsetWidth;
          button.classList.add('is-instagram-click');
          window.setTimeout(() => button.classList.remove('is-instagram-click'), 400);
        } else if (button.hasAttribute('data-jeans') || button.hasAttribute('data-sports') || button.hasAttribute('data-writing') || button.hasAttribute('data-portfolio') || button.hasAttribute('data-paint') || button.hasAttribute('data-games') || button.hasAttribute('data-questions') || button.hasAttribute('data-guestbook') || button.hasAttribute('data-music')) {
          return;
        } else if (button.dataset.group === 'tool') {
          toolButtons.forEach((tool) => {
            tool.classList.remove('is-selected');
            if (!tool.hasAttribute('data-linkedin') && !tool.hasAttribute('data-instagram') && !tool.hasAttribute('data-retro') && !tool.hasAttribute('data-email')) tool.setAttribute('aria-pressed', 'false');
          });
          button.classList.add('is-selected');
          button.setAttribute('aria-pressed', 'true');
        } else if (button.dataset.group === 'menu') {
          openMenu(button, event.detail === 0);
        } else {
          button.classList.remove('is-flashing');
          void button.offsetWidth;
          button.classList.add('is-flashing');
          window.setTimeout(() => button.classList.remove('is-flashing'), 140);
        }
      });
    });

    document.addEventListener('pointerdown', (event) => {
      if (!event.target.closest('.retro-menu, .hotspot[data-group="menu"]')) closeMenu();
    });

    const mobileMenuPopup = document.getElementById('mobile-menu-popup');
    const mobileMenuButtons = [...document.querySelectorAll('.mobile-menu-button')];
    const mobileToolButtons = [...document.querySelectorAll('.mobile-tool')];
    const mobileLineButtons = [...document.querySelectorAll('.mobile-line-button')];
    let activeMobileMenuButton = null;

    const closeMobileMenu = () => {
      if (!activeMobileMenuButton) return;
      activeMobileMenuButton.classList.remove('is-menu-open');
      activeMobileMenuButton.setAttribute('aria-expanded', 'false');
      activeMobileMenuButton = null;
      mobileMenuPopup.hidden = true;
      mobileMenuPopup.replaceChildren();
    };

    const openMobileMenu = (button) => {
      if (activeMobileMenuButton === button) {
        closeMobileMenu();
        return;
      }
      closeMobileMenu();
      activeMobileMenuButton = button;
      button.classList.add('is-menu-open');
      button.setAttribute('aria-expanded', 'true');
      const menuName = button.dataset.mobileMenu;
      mobileMenuPopup.setAttribute('aria-label', `${menuName} menu`);
      for (const entry of menuContents[menuName] || []) {
        if (entry === '-') {
          const separator = document.createElement('div');
          separator.className = 'retro-menu-separator';
          separator.setAttribute('role', 'separator');
          mobileMenuPopup.append(separator);
          continue;
        }
        const [label, shortcut] = entry;
        const item = document.createElement('button');
        item.className = 'retro-menu-item';
        item.type = 'button';
        item.setAttribute('role', 'menuitem');
        item.innerHTML = `<span>${label}</span>${label === 'Sound' ? `<span class="retro-menu-shortcut" data-help-sound>${soundEnabled && AudioEngine ? 'On' : 'Off'}</span>` : shortcut ? `<span class="retro-menu-shortcut">${shortcut}</span>` : ''}`;
        if (label === 'Sound') { item.setAttribute('aria-label', `Sound ${soundEnabled ? 'on' : 'off'}. Click to toggle`); item.setAttribute('data-sound-toggle', ''); }
        item.addEventListener('pointerdown', () => item.classList.add('is-pressing'));
        item.addEventListener('pointerup', () => item.classList.remove('is-pressing'));
        item.addEventListener('pointercancel', () => item.classList.remove('is-pressing'));
        item.addEventListener('click', () => {
          if (label === 'Jeans Project...') {
            closeMobileMenu();
            openJeansPage(button);
          } else if (label === 'Sports Archive...') {
            closeMobileMenu();
            openSportsPage(button);
          } else if (label === 'Sound') {
            toggleSiteSound();
          } else if (label === 'Help Topics' || label === 'Ask the Mascot...') {
            closeMobileMenu();
            openMascotGuide();
          } else {
            window.setTimeout(closeMobileMenu, 80);
          }
        });
        mobileMenuPopup.append(item);
      }
      mobileMenuPopup.hidden = false;
    };

    mobileMenuButtons.forEach((button) => {
      button.setAttribute('aria-haspopup', 'menu');
      button.setAttribute('aria-expanded', 'false');
      button.addEventListener('click', () => openMobileMenu(button));
    });

    mobileMenuPopup.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        const button = activeMobileMenuButton;
        closeMobileMenu();
        button?.focus();
      }
    });

    mobileToolButtons.forEach((button) => {
      if (!button.hasAttribute('data-linkedin') && !button.hasAttribute('data-instagram') && !button.hasAttribute('data-retro') && !button.hasAttribute('data-email')) button.setAttribute('aria-pressed', 'false');
      const release = () => button.classList.remove('is-pressing');
      button.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        button.classList.add('is-pressing');
        button.setPointerCapture?.(event.pointerId);
      });
      button.addEventListener('pointerup', release);
      button.addEventListener('pointercancel', release);
      button.addEventListener('lostpointercapture', release);
      button.addEventListener('click', () => {
        if (button.hasAttribute('data-retro') || button.hasAttribute('data-email')) return;
        if (button.hasAttribute('data-linkedin')) {
          button.classList.remove('is-linkedin-click');
          void button.offsetWidth;
          button.classList.add('is-linkedin-click');
          window.setTimeout(() => button.classList.remove('is-linkedin-click'), 360);
          return;
        }
        if (button.hasAttribute('data-instagram')) {
          button.classList.remove('is-instagram-click');
          void button.offsetWidth;
          button.classList.add('is-instagram-click');
          window.setTimeout(() => button.classList.remove('is-instagram-click'), 400);
          return;
        }
        if (button.hasAttribute('data-sports') || button.hasAttribute('data-writing') || button.hasAttribute('data-jeans') || button.hasAttribute('data-portfolio') || button.hasAttribute('data-paint') || button.hasAttribute('data-games') || button.hasAttribute('data-questions') || button.hasAttribute('data-guestbook') || button.hasAttribute('data-music')) return;
        mobileToolButtons.forEach((tool) => {
          tool.classList.remove('is-selected');
          if (!tool.hasAttribute('data-linkedin') && !tool.hasAttribute('data-instagram') && !tool.hasAttribute('data-retro') && !tool.hasAttribute('data-email')) tool.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('is-selected');
        button.setAttribute('aria-pressed', 'true');
      });
    });

    mobileLineButtons.forEach((button) => {
      button.addEventListener('click', () => {
        button.classList.remove('is-flashing');
        void button.offsetWidth;
        button.classList.add('is-flashing');
        window.setTimeout(() => button.classList.remove('is-flashing'), 150);
      });
    });

    document.querySelectorAll('.mobile-window-button').forEach((button) => {
      button.addEventListener('click', () => {
        button.classList.add('is-pressing');
        window.setTimeout(() => button.classList.remove('is-pressing'), 140);
      });
    });

    document.addEventListener('pointerdown', (event) => {
      if (!event.target.closest('.mobile-menu-popup, .mobile-menu-button')) closeMobileMenu();
    });

    const writingPage = document.getElementById('writing-page');
    const writingViewport = document.getElementById('writing-viewport');
    const writingIntro = document.getElementById('writing-intro');
    const writingReader = document.getElementById('writing-reader');
    const writingText = document.getElementById('writing-essay-text');
    const writingTriggers = [...document.querySelectorAll('[data-writing]')];
    let lastWritingTrigger = writingTriggers[0];
    const writingDetails = {
      haas: {
        title: 'Consumerism, Fast Fashion, and the facade of ESG: A Global Crisis of Equity and Ecology',
        contest: 'Haas Economics Essay Contest', award: '3RD PLACE',
        summary: 'An essay on the gap between the promises of fast fashion and its environmental and social costs.',
        overline: 'Essay 01 / Economics & sustainability',
        pdf: 'assets/generated/53b1cf842258dbc8a207.pdf', filename: 'Atharva-Naveen-Haas-Essay.pdf'
      },
      ieox: {
        title: 'Education Inequalities',
        contest: 'IEOx Essay Challenge', award: 'TOP 10',
        summary: 'An essay about how unequal resources and access shape the opportunities students actually receive.',
        overline: 'Essay 02 / Education & equity',
        pdf: 'assets/generated/221b4c1966f4be59848a.pdf', filename: 'Atharva-Naveen-IEOx-Essay.pdf'
      }
    };
    const writingRoute = (suffix = '') => {
      const hash = '#writing' + suffix;
      if (window.location.hash !== hash) {
        try { history.pushState({ page: 'writing' }, '', hash); }
        catch (_) { window.location.hash = hash.slice(1); }
      }
    };
    const showWritingIndex = () => {
      writingIntro.hidden = false;
      writingReader.hidden = true;
      writingViewport.scrollTop = 0;
      writingPage.querySelector('[data-writing-status]').textContent = 'Ready · choose an essay';
      playSurfaceMotion(writingIntro);
    };
    const showWritingEssay = (id, { navigate = true, focus = true } = {}) => {
      const essay = writingDetails[id];
      if (!essay) return;
      writingPage.querySelector('[data-writing-award]').textContent = essay.award;
      writingPage.querySelector('[data-writing-contest]').textContent = essay.contest;
      writingPage.querySelector('[data-writing-summary]').textContent = essay.summary;
      writingPage.querySelector('[data-writing-overline]').textContent = essay.overline;
      writingPage.querySelector('#writing-paper-title').textContent = essay.title;
      writingText.replaceChildren(document.getElementById(`writing-text-${id}`).content.cloneNode(true));
      const original = writingPage.querySelector('#writing-original');
      original.href = essay.pdf;
      original.download = essay.filename;
      writingIntro.hidden = true;
      writingReader.hidden = false;
      writingViewport.scrollTop = 0;
      writingPage.querySelector('[data-writing-status]').textContent = essay.contest + ' · ' + essay.award;
      playSurfaceMotion(writingReader);
      if (navigate) writingRoute('/' + id);
      if (focus) writingPage.querySelector('[data-writing-back]').focus({ preventScroll: true });
    };
    const setWritingOpen = (open, { focus = true } = {}) => {
      writingPage.hidden = !open;
      document.body.classList.toggle('is-writing-open', open);
      writingTriggers.forEach(button => button.setAttribute('aria-expanded', String(open)));
      if (focus) (open ? writingPage.querySelector('[data-writing-home]') : lastWritingTrigger)?.focus({ preventScroll: true });
    };
    const openWriting = trigger => {
      lastWritingTrigger = trigger;
      showWritingIndex();
      setWritingOpen(true);
      writingRoute();
    };
    const closeWriting = () => {
      setWritingOpen(false);
      if (window.location.hash.startsWith('#writing')) {
        try { history.pushState({}, '', window.location.pathname + window.location.search); }
        catch (_) { window.location.hash = ''; }
      }
    };
    writingTriggers.forEach(button => button.addEventListener('click', () => openWriting(button)));
    writingPage.querySelectorAll('[data-writing-select]').forEach(button => button.addEventListener('click', () => showWritingEssay(button.dataset.writingSelect)));
    writingPage.querySelector('[data-writing-back]').addEventListener('click', () => { showWritingIndex(); writingRoute(); writingPage.querySelector('[data-writing-select]')?.focus({ preventScroll: true }); });
    writingPage.querySelector('[data-writing-home]').addEventListener('click', closeWriting);
    const restoreWritingRoute = () => {
      const match = /^#writing(?:\/(haas|ieox))?$/.exec(window.location.hash);
      setWritingOpen(Boolean(match), { focus: false });
      if (match?.[1]) showWritingEssay(match[1], { navigate: false, focus: false });
      else showWritingIndex();
    };
    window.addEventListener('popstate', restoreWritingRoute);
    window.addEventListener('hashchange', restoreWritingRoute);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !writingPage.hidden) closeWriting();
    });
    restoreWritingRoute();

    const portfolioPage = document.getElementById('portfolio-page');
    const portfolioViewport = document.getElementById('portfolio-viewport');
    const portfolioIndex = document.getElementById('portfolio-index');
    const portfolioDetail = document.getElementById('portfolio-detail');
    const portfolioList = document.getElementById('portfolio-list');
    const portfolioTriggers = [...document.querySelectorAll('[data-portfolio]')];
    let lastPortfolioTrigger = portfolioTriggers[0];
    let activePortfolioFilter = 'all';
    let activePortfolioProject = null;
    let portfolioIndexScroll = 0;
    const descreenedBanner = 'assets/generated/687d4dd99c95e0cfb56b.jpg';
    const decaBanner = 'assets/generated/9165e75d8ca5e2d34c50.jpg';
    const yisBanner = 'assets/generated/a1b0255267322e67b82e.jpg';
    const ascentBanner = 'assets/generated/cfbfa5387898a49a758a.jpg';
    const portfolioProjects = [
      {
        id:'descreened', name:'Descreened', role:'Co-founder · digital wellbeing initiative', period:'Ongoing', tags:['impact','leadership'], kind:'Public impact',
        summary:'Co-founded Descreened with Ahmed Farooqui. The student-led team organizes workshops and offline activities around healthier screen habits.',
        evidence:['10,893 student surveys completed','410,000+ people reached','9,000+ hours spent off screens','15,000+ interactions','380+ volunteers'],
        sources:[{label:'Descreened · leadership',url:'https://www.descreened.net/leadership/'},{label:'Descreened · impact',url:'https://www.descreened.net/'}]
      },
      {
        id:'yis', name:'Young Investors Society', role:'Vice President · Junior Advisory Board', period:'2024–present', tags:['finance','leadership'], kind:'Finance & writing',
        summary:'Finance writing and student leadership through Young Investors Society.',
        evidence:['7 monthly finance articles','4th of 17,500 in finance ranking','3rd place · Haas economics essay','Top 10 · IEOx essay'],
        sources:[{label:'Read the essays',url:'#writing'}]
      },
      {
        id:'ascent', name:'Ascent Capital × IIM', role:'Private equity research intern', period:'Summer internship', tags:['finance'], kind:'Finance research',
        summary:'Summer research work covering private equity models and economic analysis.',
        evidence:['Built LBO models','Wrote economics research forums','Designed a simulated hedge structure','Research across an eight-week internship'],
        sources:[]
      },
      {
        id:'finedu', name:'FINEDU', role:'Program development lead · Mark Cuban AI Foundation', period:'Ongoing', tags:['impact','build','leadership'], kind:'Education technology',
        summary:'Financial education work at the intersection of curriculum and technology.',
        evidence:['MCF × Infosys hackathon winner','700+ students aided','FinTech curriculum development','Finance + technology + AI'],
        sources:[]
      },
      {
        id:'deca', name:'DECA', role:'VP of Career Development · VP of Leadership', period:'2025–2026', tags:['finance','leadership'], kind:'Competition & leadership',
        summary:'Wylie DECA chapter leadership and accounting competition.',
        evidence:['Chapter grew to 135 members','Top 15 · VBC Accounting at ICDC','First ICDC qualifier for district','Texas DECA Rising Star'],
        sources:[{label:'About VBC Accounting',url:'https://www.deca.org/compete/virtual-business-challenge-accounting'}]
      },
      {
        id:'tcs', name:'TCS Building Better Futures', role:'Summer IoT research participant', period:'Summer research', tags:['build'], kind:'Technology research',
        summary:'Internet of Things research and data work during a summer program.',
        evidence:['Developed 5 Google Cloud datasets','Worked alongside 30 peers','IoT device development','Recognized as a top performer'],
        sources:[]
      },
      {
        id:'debate', name:'Speech & Debate', role:'National qualifier · Wylie Pirate Debate', period:'High school', tags:['leadership','beyond'], kind:'Communication',
        summary:'Speech and debate competition with Wylie Pirate Debate.',
        evidence:['NSDA Nationals qualifier','Distinction Award · Top 5% nationwide','Highest points in district','UNT John S. Gosset Award'],
        sources:[]
      },
      {
        id:'bpa', name:'Business Professionals of America', role:'National portfolio competitor', period:'High school', tags:['finance'], kind:'Investing competition',
        summary:'Competed with Shlok Patel and Adonias Tadesse in the 2026 Financial Portfolio Management Team event. The Wylie High team placed ninth in the finals.',
        evidence:['2026 national virtual event · Financial Portfolio Management Team','Wylie High School team: Atharva Naveen, Shlok Patel, Adonias Tadesse','9th of 170 in the finals'],
        sources:[{label:'BPA · 2026 rankings (PDF)',url:'https://nlc.bpa.org/wp-content/uploads/sites/114/2026/05/2026-NLC-Virtual-Event-Competition-Rankings.pdf'}]
      },
      {
        id:'fccla', name:'FCCLA', role:'FinTech advocacy competitor', period:'High school', tags:['impact','leadership'], kind:'Advocacy & competition',
        summary:'Financial technology advocacy through FCCLA competition.',
        evidence:['1st place in Texas','Top 20 at nationals','700 students aided','First-year national qualifier for Wylie High'],
        sources:[]
      },
      {
        id:'track', name:'Track & Field', role:'Pole vault · sprint', period:'Freshman–sophomore years', tags:['beyond'], kind:'Beyond the desk',
        summary:'Pole vault and sprint events during freshman and sophomore years.',
        evidence:['2× New Balance Nationals qualifier','13 ft sophomore pole-vault PR','11.6 ft freshman PR','23.35 sec sophomore 200m'],
        sources:[]
      }
    ];
    const portfolioRoute = suffix => {
      const hash = '#portfolio' + (suffix ? '/' + suffix : '');
      if (window.location.hash !== hash) {
        try { history.pushState({ page:'portfolio' }, '', hash); }
        catch (_) { window.location.hash = hash.slice(1); }
      }
    };
    const portfolioField = name => portfolioPage.querySelector(`[data-portfolio-${name}]`);
    const filteredPortfolio = () => portfolioProjects.filter(project => activePortfolioFilter === 'all' || project.tags.includes(activePortfolioFilter));
    const folderAppearance = {
      descreened:['#3d5d70','#fffdf5','DESCREENED'],
      yis:['#4c6858','#fffdf5','YOUNG INVESTORS'],
      ascent:['#aa8757','#172e26','ASCENT CAPITAL'],
      finedu:['#6d495a','#fffdf5','FINEDU'],
      deca:['#364d67','#fffdf5','DECA'],
      tcs:['#657569','#fffdf5','TCS'],
      debate:['#a16b51','#fffdf5','SPEECH & DEBATE'],
      bpa:['#5d5573','#fffdf5','BPA'],
      fccla:['#825052','#fffdf5','FCCLA'],
      track:['#b29460','#172e26','TRACK & FIELD']
    };
    const renderPortfolioList = () => {
      portfolioList.replaceChildren();
      filteredPortfolio().forEach((project,visibleIndex) => {
        const number = String(portfolioProjects.indexOf(project)+1).padStart(2,'0');
        const [color,ink,tabLabel] = folderAppearance[project.id];
        const folder = document.createElement('a');
        folder.className = 'portfolio-item';
        folder.href = '#portfolio/' + project.id;
        folder.dataset.portfolioItem = project.id;
        folder.setAttribute('aria-label',`Open ${project.name} folder`);
        folder.style.setProperty('--folder',color);
        folder.style.setProperty('--folder-ink',ink);
        folder.style.setProperty('--tab-left','0%');
        folder.style.setProperty('--folder-order',visibleIndex+1);
        const el=(tag,cls,text)=>{const node=document.createElement(tag);node.className=cls;if(text)node.textContent=text;return node;};
        const isBannerCard = ['descreened', 'deca', 'yis', 'ascent'].includes(project.id);
        folder.classList.add(isBannerCard ? 'portfolio-item--banner' : 'portfolio-item--type');
        const tab=el('span','portfolio-folder-tab',tabLabel);
        const body=el('span','portfolio-folder-body ' + (isBannerCard ? 'portfolio-folder-body--banner' : 'portfolio-folder-body--type'));
        if (isBannerCard) {
          const banner=el('img','portfolio-folder-banner');
          banner.src=project.id === 'deca' ? decaBanner : project.id === 'yis' ? yisBanner : project.id === 'ascent' ? ascentBanner : descreenedBanner;
          banner.loading='lazy';banner.decoding='async';banner.width=2048;banner.height=1152;
          banner.alt=project.id === 'deca' ? 'Collage of DECA events and teammates' : project.id === 'yis' ? 'Young Investors Society classroom gathering with organization logo' : project.id === 'ascent' ? 'Atharva Naveen reviewing financial research notes' : 'Collage of Descreened events and activities';
          body.append(banner);
        } else {
          const cover=el('span','portfolio-type-cover');
          const top=el('span','portfolio-type-top');
          top.append(el('span','',project.kind));
          const title=el('strong','portfolio-type-title',project.name);
          const bottom=el('span','portfolio-type-bottom');
          bottom.append(el('span','',project.period),el('span','portfolio-type-open','OPEN FOLDER ↗'));
          cover.append(top,title,bottom);
          body.append(cover);
        }
        folder.append(tab,body);
        folder.addEventListener('click',event=>{
          if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
          event.preventDefault();
          if(folder.classList.contains('is-opening'))return;
          const openFolder=()=>{folder.classList.remove('is-opening');selectPortfolioProject(project.id);};
          if(reducedMotion)openFolder();
          else{folder.classList.add('is-opening');window.setTimeout(openFolder,120);}
        });
        portfolioList.append(folder);
      });
      const searchInput=document.getElementById('activity-search');if(searchInput)searchInput.value='';
      const emptyState=document.getElementById('activity-empty');if(emptyState)emptyState.hidden=true;
      portfolioPage.querySelectorAll('[data-portfolio-filter]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.portfolioFilter === activePortfolioFilter)));
      portfolioField('status').textContent = `${filteredPortfolio().length} activity folders · ${activePortfolioFilter === 'all' ? 'All files' : activePortfolioFilter}`;
    };
    const showPortfolioView = view => {
      if(view === 'detail' && !portfolioIndex.hidden) portfolioIndexScroll=portfolioViewport.scrollTop;
      portfolioIndex.hidden = view !== 'index';
      portfolioDetail.hidden = view !== 'detail';
      portfolioViewport.scrollTop = view === 'detail' ? 0 : portfolioIndexScroll;
      playSurfaceMotion(view === 'detail' ? portfolioDetail : portfolioIndex);
    };
    const selectPortfolioProject = (id,{route=true}={}) => {
      const project = portfolioProjects.find(item=>item.id===id);
      if (!project) return;
      activePortfolioProject = id;
      portfolioField('kind').textContent = project.kind;
      portfolioField('file').textContent = `FILE ${String(portfolioProjects.indexOf(project)+1).padStart(2,'0')} / 10`;
      portfolioField('location').textContent = `PROJECT FILES / ${String(portfolioProjects.indexOf(project)+1).padStart(2,'0')}`;
      portfolioField('title').textContent = project.name;
      portfolioField('role').textContent = project.role;
      portfolioField('summary').textContent = project.summary;
      const photo = portfolioField('photo');
      const photoImage = portfolioField('photo-image');
      const photoCaption = portfolioField('photo-caption');
      const collage = project.id === 'descreened' ? descreenedBanner : project.id === 'deca' ? decaBanner : project.id === 'yis' ? yisBanner : project.id === 'ascent' ? ascentBanner : null;
      photo.hidden = !collage;
      if (collage) {
        photoImage.src = collage;
        photoImage.alt = project.id === 'deca' ? 'Collage of DECA teammates and events' : project.id === 'yis' ? 'Young Investors Society classroom gathering with organization logo' : project.id === 'ascent' ? 'Atharva Naveen reviewing financial research notes' : 'Collage of Descreened activities and events';
        photoCaption.textContent = project.name + ' / photo archive';
      } else { photoImage.removeAttribute('src'); photoImage.alt = ''; photoCaption.textContent = ''; }
      const sources = portfolioField('sources');
      sources.replaceChildren(...(project.sources || []).map(source => {
        const link = document.createElement('a');
        link.href = source.url;
        link.textContent = source.label + ' ↗';
        if (!source.url.startsWith('#')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
        return link;
      }));
      sources.hidden = !sources.childElementCount;
      portfolioField('period').textContent = project.period;
      const evidence = portfolioField('evidence');
      evidence.replaceChildren(...project.evidence.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
      portfolioField('status').textContent = `File ${String(portfolioProjects.indexOf(project)+1).padStart(2,'0')} · ${project.name}`;
      showPortfolioView('detail');
      if (route) { portfolioRoute(id); portfolioField('title').focus({preventScroll:true}); }
    };
    const showPortfolioIndex = ({route=true,focus=false}={}) => {
      const previousProject = activePortfolioProject;
      activePortfolioProject = null;
      showPortfolioView('index');
      portfolioField('status').textContent = `${filteredPortfolio().length} project files · ${activePortfolioFilter === 'all' ? 'All files' : activePortfolioFilter}`;
      if (route) portfolioRoute();
      if (focus) (portfolioList.querySelector(`[data-portfolio-item="${previousProject}"]`) || portfolioPage.querySelector('#portfolio-explorer-title')).focus({preventScroll:true});
    };
    const setPortfolioOpen = (open,{focus=true}={}) => {
      portfolioPage.hidden = !open;
      document.body.classList.toggle('is-portfolio-open',open);
      portfolioTriggers.forEach(button=>button.setAttribute('aria-expanded',String(open)));
      if (focus) (open ? portfolioPage.querySelector('[data-portfolio-home]') : lastPortfolioTrigger)?.focus({preventScroll:true});
    };
    const openPortfolio = trigger => {
      lastPortfolioTrigger = trigger;
      portfolioIndexScroll = 0;
      activePortfolioFilter = 'all';
      renderPortfolioList();
      showPortfolioIndex({route:false});
      setPortfolioOpen(true);
      portfolioRoute();
    };
    const closePortfolio = () => {
      setPortfolioOpen(false);
      if (window.location.hash.startsWith('#portfolio')) {
        try { history.pushState({},'',window.location.pathname+window.location.search); }
        catch (_) { window.location.hash=''; }
      }
    };
    portfolioTriggers.forEach(button=>button.addEventListener('click',()=>openPortfolio(button)));
    portfolioPage.querySelector('[data-portfolio-home]').addEventListener('click',closePortfolio);
    portfolioPage.querySelectorAll('[data-portfolio-back]').forEach(button=>button.addEventListener('click',()=>showPortfolioIndex({focus:true})));
    portfolioPage.querySelector('[data-portfolio-explore]').addEventListener('click',()=>portfolioPage.querySelector('#portfolio-explorer').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));
    portfolioPage.querySelectorAll('[data-portfolio-filter]').forEach(button=>button.addEventListener('click',()=>{
      activePortfolioFilter=button.dataset.portfolioFilter;
      renderPortfolioList();
    }));
    portfolioList.addEventListener('keydown',event=>{
      if (!['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
      const options=[...portfolioList.querySelectorAll('[data-portfolio-item]:not([hidden])')];
      if(!options.length)return;
      const index=options.indexOf(document.activeElement);
      const next=event.key==='Home'?0:event.key==='End'?options.length-1:event.key==='ArrowDown'?Math.min(index+1,options.length-1):Math.max(index-1,0);
      options[next]?.focus();event.preventDefault();
    });
    const restorePortfolioRoute = () => {
      const match=/^#portfolio(?:\/([a-z0-9-]+))?$/.exec(window.location.hash);
      setPortfolioOpen(Boolean(match),{focus:false});
      if (!match) return;
      activePortfolioFilter='all';
      renderPortfolioList();
      if (match[1] && portfolioProjects.some(project=>project.id===match[1])) selectPortfolioProject(match[1],{route:false});
      else showPortfolioIndex({route:false});
    };
    window.addEventListener('popstate',restorePortfolioRoute);
    window.addEventListener('hashchange',restorePortfolioRoute);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!portfolioPage.hidden){if(!portfolioDetail.hidden) showPortfolioIndex(); else closePortfolio();}});
    restorePortfolioRoute();

    const paintPage = document.getElementById('paint-page');
    const paintFrame = document.getElementById('paint-frame');
    const paintTriggers = [...document.querySelectorAll('[data-paint]')];
    let lastPaintTrigger = paintTriggers[0];
    let paintLoaded = false;
    paintFrame.addEventListener('load', () => {
      paintPage.querySelector('[data-paint-status]').textContent = 'Ready · draw, save, and explore';
    });
    const setPaintOpen = (open,{focus=true}={}) => {
      paintPage.hidden = !open;
      document.body.classList.toggle('is-paint-open',open);
      paintTriggers.forEach(button=>button.setAttribute('aria-expanded',String(open)));
      if (open && !paintLoaded) {
        paintLoaded = true;
        paintPage.querySelector('[data-paint-status]').textContent = 'Loading JS Paint…';
        paintFrame.src = 'https://jspaint.app/';
      }
      if (focus) (open ? paintPage.querySelector('[data-paint-home]') : lastPaintTrigger)?.focus({preventScroll:true});
    };
    const openPaint = trigger => {
      lastPaintTrigger = trigger;
      setPaintOpen(true);
      if (window.location.hash !== '#paint') {
        try { history.pushState({page:'paint'},'','#paint'); }
        catch (_) { window.location.hash='paint'; }
      }
    };
    const closePaint = () => {
      setPaintOpen(false);
      if (window.location.hash === '#paint') {
        try { history.pushState({},'',window.location.pathname+window.location.search); }
        catch (_) { window.location.hash=''; }
      }
    };
    paintTriggers.forEach(button=>button.addEventListener('click',()=>openPaint(button)));
    paintPage.querySelector('[data-paint-home]').addEventListener('click',closePaint);
    const restorePaintRoute = () => setPaintOpen(window.location.hash === '#paint',{focus:false});
    window.addEventListener('popstate',restorePaintRoute);
    window.addEventListener('hashchange',restorePaintRoute);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!paintPage.hidden)closePaint();});
    restorePaintRoute();

    const gamesPage = document.getElementById('games-page');
    const gamesViewport = document.getElementById('games-viewport');
    const arcadeCanvas = document.getElementById('arcade-canvas');
    const arcadeCtx = arcadeCanvas.getContext('2d');
    const gameTriggers = [...document.querySelectorAll('[data-games]')];
    const gameCards = [...gamesPage.querySelectorAll('.game-cartridge')];
    const gameControls = [...gamesPage.querySelectorAll('[data-game-control]')];
    const gameInfo = {
      tetris: {name:'Tetris',source:'https://github.com/LoveDaisy/tetris_game',instruction:'← → move · ↑ rotate · ↓ soft drop · Space hard drop · P pause',size:[300,600],extra:'LINES'},
      snake: {name:'Snake',source:'https://github.com/epidemian/snake',instruction:'Arrow keys or WASD to steer · P or Space to pause',size:[480,480],extra:'LENGTH'},
      pinpog: {name:'Ping Pong',source:'https://github.com/tsoding/pinpog',instruction:'A / D or ← → to move · Space to pause · F to restart',size:[640,420],extra:'HITS'},
      mines: {name:'Minesweeper',source:'https://github.com/BrandonDusseau/minesweeper-classic',instruction:'Click to open · right-click or F to flag · tap Flag for touch · arrows move cursor · Space opens',size:[480,480],extra:'MINES LEFT'},
      '2048': {name:'2048',source:'https://github.com/gabrielecirulli/2048',instruction:'Arrow keys / WASD or swipe to slide · merge matching numbers · P pause',size:[480,480],extra:'TOP TILE'},
      breakout: {name:'Breakout',source:'https://github.com/akshatjain02/Breakout',instruction:'A / D or ← → move · mouse / touch drag · Space launches · P pauses',size:[640,420],extra:'LIVES'},
      memory: {name:'Memory',source:'https://github.com/taniarascia/memory',instruction:'Tap two cards · match six pairs · arrows choose a card · Space flips',size:[480,430],extra:'MOVES',scoreLabel:'PAIRS'},
      connect4: {name:'Connect Four',source:'https://github.com/bryanbraun/connect-four',instruction:'Tap a column or use ← → and Space · you are orange · beat the blue CPU',size:[560,480],extra:'TURN',scoreLabel:'STREAK'},
      maze: {name:'Pac-Man',source:'https://github.com/philipptrenz/pacman',instruction:'Arrow keys or WASD · collect every dot · big dots let you catch ghosts · P pause',size:[510,450],extra:'LIVES'},
      invaders: {name:'Space Invaders',source:'https://github.com/dwmkerr/spaceinvaders',instruction:'A / D or ← → move · Space or FIRE shoots · touch drag · P pause',size:[640,420],extra:'LIVES'},
      flappy: {name:'Flappy Bird',source:'https://github.com/giotiskl/Canvas-Bird',instruction:'Tap the screen, Space, ↑ or FLAP · fly through gaps · P pause',size:[360,520],extra:'FLAPS'},
      rps: {name:'Rock Paper Scissors',source:'https://en.wikipedia.org/wiki/Rock_paper_scissors',instruction:'← → choose · Space or PLAY throws · tap a choice to play',size:[560,420],extra:'CPU WINS',scoreLabel:'WINS'}
    };
    const gameBest = key => {try{return Number(localStorage.getItem('to-know-arcade-'+key))||0;}catch(_){return 0;}};
    const saveGameBest = (key,value) => {try{localStorage.setItem('to-know-arcade-'+key,String(value));}catch(_){}};
    const arcadeBest={tetris:gameBest('tetris'),snake:gameBest('snake'),pinpog:gameBest('pinpog'),mines:gameBest('mines'),'2048':gameBest('2048'),breakout:gameBest('breakout'),memory:gameBest('memory'),connect4:gameBest('connect4'),maze:gameBest('maze'),invaders:gameBest('invaders'),flappy:gameBest('flappy'),rps:gameBest('rps')};
    const drawGameOverlay = (ctx,width,height,title,caption) => {
      ctx.fillStyle='rgba(4,10,20,.78)';ctx.fillRect(0,height/2-68,width,136);
      ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 29px monospace';ctx.fillText(title,width/2,height/2-13);
      ctx.font='14px monospace';ctx.fillStyle='#aee2d2';ctx.fillText(caption,width/2,height/2+25);
    };
    const tetrisShapes = [
      [[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],
      [[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]
    ];
    const tetrisColors = ['#57d5df','#f1cd57','#ab84e7','#69d494','#ee6b78','#6b91e9','#eaa36a'];
    const createTetris = () => {
      const cell=30;
      const game={name:'tetris',board:Array.from({length:20},()=>Array(10).fill(-1)),bag:[],next:0,piece:null,score:0,lines:0,level:1,dropClock:0,paused:false,over:false};
      game.pull=()=>{if(!game.bag.length)game.bag=[0,1,2,3,4,5,6].sort(()=>Math.random()-.5);return game.bag.pop();};
      game.collides=(shape,x,y)=>shape.some((row,dy)=>row.some((value,dx)=>{
        if(!value)return false;
        const px=x+dx,py=y+dy;
        return px<0||px>=10||py>=20||(py>=0&&game.board[py][px]!==-1);
      }));
      game.spawn=()=>{
        const type=game.next;game.next=game.pull();
        const shape=tetrisShapes[type].map(row=>[...row]);
        game.piece={shape,type,x:Math.floor((10-shape[0].length)/2),y:0};
        if(game.collides(shape,game.piece.x,game.piece.y))game.over=true;
      };
      game.next=game.pull();game.spawn();
      game.move=(dx,dy)=>{
        if(game.over||game.paused)return false;
        const p=game.piece;
        if(!game.collides(p.shape,p.x+dx,p.y+dy)){p.x+=dx;p.y+=dy;return true;}
        if(dy)game.lock();
        return false;
      };
      game.lock=()=>{
        const p=game.piece;
        p.shape.forEach((row,dy)=>row.forEach((value,dx)=>{
          if(value){if(p.y+dy<0)game.over=true;else game.board[p.y+dy][p.x+dx]=p.type;}
        }));
        if(game.over)return;
        let cleared=0;
        for(let y=19;y>=0;y--){if(game.board[y].every(v=>v!==-1)){game.board.splice(y,1);game.board.unshift(Array(10).fill(-1));cleared++;y++;}}
        if(cleared){game.score+=([0,100,300,500,800][cleared]||800)*game.level;game.lines+=cleared;game.level=1+Math.floor(game.lines/10);}
        game.spawn();
      };
      game.rotate=()=>{
        if(game.over||game.paused)return;
        const p=game.piece,rotated=p.shape[0].map((_,i)=>p.shape.map(row=>row[i]).reverse());
        for(const shift of [0,-1,1,-2,2]){if(!game.collides(rotated,p.x+shift,p.y)){p.shape=rotated;p.x+=shift;break;}}
      };
      game.action=action=>{
        if(game.over||game.paused)return;
        if(action==='left')game.move(-1,0);
        if(action==='right')game.move(1,0);
        if(action==='up')game.rotate();
        if(action==='down'&&game.move(0,1))game.score++;
        if(action==='drop'){
          let distance=0;while(!game.collides(game.piece.shape,game.piece.x,game.piece.y+1)){game.piece.y++;distance++;}
          game.score+=distance*2;game.lock();
        }
      };
      game.update=dt=>{
        if(game.paused||game.over)return;
        game.dropClock+=dt;
        const interval=Math.max(90,720-(game.level-1)*58);
        if(game.dropClock>=interval){game.dropClock=0;game.move(0,1);}
      };
      game.draw=ctx=>{
        ctx.fillStyle='#0a1728';ctx.fillRect(0,0,300,600);
        for(let y=0;y<20;y++)for(let x=0;x<10;x++){
          ctx.strokeStyle='#203249';ctx.lineWidth=1;ctx.strokeRect(x*cell+.5,y*cell+.5,cell,cell);
          const value=game.board[y][x];if(value!==-1)drawBlock(ctx,x,y,value,1);
        }
        if(game.piece&&!game.over){
          const p=game.piece;let ghostY=p.y;
          while(!game.collides(p.shape,p.x,ghostY+1))ghostY++;
          p.shape.forEach((row,dy)=>row.forEach((v,dx)=>{if(v&&ghostY+dy>=0)drawBlock(ctx,p.x+dx,ghostY+dy,p.type,.24);}));
          p.shape.forEach((row,dy)=>row.forEach((v,dx)=>{if(v&&p.y+dy>=0)drawBlock(ctx,p.x+dx,p.y+dy,p.type,1);}));
        }
        if(game.paused)drawGameOverlay(ctx,300,600,'PAUSED','Press P or Resume');
        if(game.over)drawGameOverlay(ctx,300,600,'GAME OVER','Press Restart');
      };
      function drawBlock(ctx,x,y,type,alpha){
        ctx.globalAlpha=alpha;ctx.fillStyle=tetrisColors[type];ctx.fillRect(x*cell+2,y*cell+2,cell-4,cell-4);
        ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x*cell+2,y*cell+2,cell-4,3);
        ctx.fillStyle='rgba(0,0,0,.27)';ctx.fillRect(x*cell+2,y*cell+cell-5,cell-4,3);ctx.globalAlpha=1;
      }
      return game;
    };
    const createSnake = () => {
      const game={name:'snake',snake:[{x:9,y:12},{x:8,y:12},{x:7,y:12}],food:null,direction:{x:1,y:0},nextDirection:{x:1,y:0},score:0,clock:0,paused:false,over:false};
      game.placeFood=()=>{let spot,tries=0;do{spot={x:Math.floor(Math.random()*24),y:Math.floor(Math.random()*24)};tries++;}while(game.snake.some(part=>part.x===spot.x&&part.y===spot.y)&&tries<1000);game.food=spot;};
      game.placeFood();
      game.action=action=>{
        const map={left:{x:-1,y:0},right:{x:1,y:0},up:{x:0,y:-1},down:{x:0,y:1}};
        const next=map[action];if(!next||game.over||game.paused)return;
        if(next.x===-game.direction.x&&next.y===-game.direction.y)return;
        game.nextDirection=next;
      };
      game.update=dt=>{
        if(game.paused||game.over)return;
        game.clock+=dt;if(game.clock<Math.max(67,128-game.score*.14))return;
        game.clock=0;game.direction=game.nextDirection;
        const head={x:game.snake[0].x+game.direction.x,y:game.snake[0].y+game.direction.y};
        const eating=head.x===game.food.x&&head.y===game.food.y;
        const collisionBody=game.snake.slice(0,eating?undefined:-1);
        if(head.x<0||head.x>=24||head.y<0||head.y>=24||collisionBody.some(part=>part.x===head.x&&part.y===head.y)){game.over=true;return;}
        game.snake.unshift(head);
        if(eating){game.score+=10;game.placeFood();}else game.snake.pop();
      };
      game.draw=ctx=>{
        ctx.fillStyle='#0c231f';ctx.fillRect(0,0,480,480);
        for(let y=0;y<24;y++)for(let x=0;x<24;x++){if((x+y)%2===0){ctx.fillStyle='#14362e';ctx.fillRect(x*20,y*20,20,20);}}
        ctx.fillStyle='#ff8267';ctx.fillRect(game.food.x*20+3,game.food.y*20+3,14,14);
        game.snake.forEach((part,i)=>{ctx.fillStyle=i?'#52d99a':'#dff98e';ctx.fillRect(part.x*20+2,part.y*20+2,16,16);if(!i){ctx.fillStyle='#14362e';ctx.fillRect(part.x*20+12,part.y*20+5,3,3);}});
        if(game.paused)drawGameOverlay(ctx,480,480,'PAUSED','Press P or Resume');
        if(game.over)drawGameOverlay(ctx,480,480,'GAME OVER','Press Restart');
      };
      return game;
    };
    const createPinPog = () => {
      const game={name:'pinpog',score:0,paused:false,over:false,moveDirection:0,paddleX:273,paddleWidth:94,ball:{x:320,y:225,vx:185,vy:-240,r:7}};
      game.action=action=>{if(action==='left')game.paddleX=Math.max(8,game.paddleX-29);if(action==='right')game.paddleX=Math.min(640-game.paddleWidth-8,game.paddleX+29);};
      game.update=dt=>{
        if(game.paused||game.over)return;
        const seconds=dt/1000,b=game.ball;
        game.paddleX=Math.max(8,Math.min(640-game.paddleWidth-8,game.paddleX+game.moveDirection*410*seconds));
        const oldY=b.y;b.x+=b.vx*seconds;b.y+=b.vy*seconds;
        if(b.x-b.r<9){b.x=9+b.r;b.vx=Math.abs(b.vx);}
        if(b.x+b.r>631){b.x=631-b.r;b.vx=-Math.abs(b.vx);}
        if(b.y-b.r<9){b.y=9+b.r;b.vy=Math.abs(b.vy);}
        const paddleY=382;
        if(b.vy>0&&oldY+b.r<=paddleY&&b.y+b.r>=paddleY&&b.x+b.r>=game.paddleX&&b.x-b.r<=game.paddleX+game.paddleWidth){
          b.y=paddleY-b.r;b.vy=-Math.min(520,Math.abs(b.vy)*1.035);
          b.vx=Math.max(-430,Math.min(430,b.vx+((b.x-(game.paddleX+game.paddleWidth/2))/(game.paddleWidth/2))*115));
          game.score++;
        }
        if(b.y-b.r>420)game.over=true;
      };
      game.draw=ctx=>{
        ctx.fillStyle='#100f1c';ctx.fillRect(0,0,640,420);
        ctx.strokeStyle='#6b638a';ctx.setLineDash([12,14]);ctx.beginPath();ctx.moveTo(320,10);ctx.lineTo(320,365);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle='#a287e5';ctx.fillRect(game.paddleX,382,game.paddleWidth,10);
        ctx.fillStyle='#e5d9ff';ctx.fillRect(game.paddleX+5,382,game.paddleWidth-10,3);
        const b=game.ball;ctx.fillStyle='#f8df88';ctx.fillRect(Math.round(b.x-b.r),Math.round(b.y-b.r),b.r*2,b.r*2);
        ctx.fillStyle='#9d8ec7';ctx.font='bold 17px monospace';ctx.textAlign='left';ctx.fillText('PINPOG / BOOT 001',18,31);
        ctx.textAlign='right';ctx.fillText(String(game.score).padStart(3,'0'),622,31);
        if(game.paused)drawGameOverlay(ctx,640,420,'PAUSED','Press Space or Resume');
        if(game.over)drawGameOverlay(ctx,640,420,'GAME OVER','Press F or Restart');
      };
      return game;
    };
    // Canvas adaptations of the linked MIT-licensed Minesweeper and 2048 projects.
    const createMinesweeper = () => {
      const side=9,count=10,cell=44,left=42,top=54;
      const game={name:'mines',board:Array.from({length:side},()=>Array.from({length:side},()=>({mine:false,near:0,open:false,flag:false}))),cursor:{x:4,y:4},score:0,flags:0,first:true,flagMode:false,paused:false,over:false,won:false};
      const neighbors=(x,y)=>{
        const cells=[];
        for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
          if(!dx&&!dy)continue;
          const nx=x+dx,ny=y+dy;
          if(nx>=0&&nx<side&&ny>=0&&ny<side)cells.push({x:nx,y:ny});
        }
        return cells;
      };
      game.seed=(safeX,safeY)=>{
        const forbidden=new Set([safeY*side+safeX,...neighbors(safeX,safeY).map(p=>p.y*side+p.x)]);
        const choices=Array.from({length:side*side},(_,i)=>i).filter(i=>!forbidden.has(i));
        for(let i=choices.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
        choices.slice(0,count).forEach(i=>game.board[Math.floor(i/side)][i%side].mine=true);
        for(let y=0;y<side;y++)for(let x=0;x<side;x++)game.board[y][x].near=neighbors(x,y).filter(p=>game.board[p.y][p.x].mine).length;
        game.first=false;
      };
      game.open=(x,y)=>{
        if(game.paused||game.over||game.board[y][x].flag)return;
        if(game.first)game.seed(x,y);
        const pending=[{x,y}];
        while(pending.length){
          const p=pending.pop(),tile=game.board[p.y][p.x];
          if(tile.open||tile.flag)continue;
          tile.open=true;
          if(tile.mine){game.over=true;break;}
          game.score++;
          if(tile.near===0)neighbors(p.x,p.y).forEach(n=>{if(!game.board[n.y][n.x].open)pending.push(n);});
        }
        if(game.score===side*side-count){game.over=true;game.won=true;}
      };
      game.mark=(x,y)=>{
        if(game.paused||game.over)return;
        const tile=game.board[y][x];
        if(tile.open||(!tile.flag&&game.flags>=count))return;
        tile.flag=!tile.flag;game.flags+=tile.flag?1:-1;
      };
      game.tap=(px,py,mark)=>{
        const x=Math.floor((px-left)/cell),y=Math.floor((py-top)/cell);
        if(x<0||x>=side||y<0||y>=side)return;
        game.cursor={x,y};
        if(mark)game.mark(x,y);else game.open(x,y);
      };
      game.action=action=>{
        if(game.paused||game.over)return;
        const c=game.cursor;
        if(action==='left')c.x=Math.max(0,c.x-1);
        if(action==='right')c.x=Math.min(side-1,c.x+1);
        if(action==='up')c.y=Math.max(0,c.y-1);
        if(action==='down')c.y=Math.min(side-1,c.y+1);
        if(action==='flag')game.mark(c.x,c.y);
        if(action==='drop'||action==='reveal')game.open(c.x,c.y);
      };
      game.update=()=>{};
      game.draw=ctx=>{
        ctx.fillStyle='#192533';ctx.fillRect(0,0,480,480);
        ctx.fillStyle='#c0c0c0';ctx.fillRect(left-5,top-5,side*cell+10,side*cell+10);
        ctx.fillStyle='#dfe8e5';ctx.font='bold 16px monospace';ctx.textAlign='left';ctx.fillText('MINES / 010',left,32);
        ctx.textAlign='right';ctx.fillText(String(count-game.flags).padStart(2,'0')+' LEFT',left+side*cell,32);
        const colors=['','#15579d','#22734c','#bf4434','#283b8a','#8d3c43','#137a78','#292929','#687486'];
        for(let y=0;y<side;y++)for(let x=0;x<side;x++){
          const tile=game.board[y][x],px=left+x*cell,py=top+y*cell,showMine=game.over&&!game.won&&tile.mine;
          ctx.fillStyle=tile.open?'#d8d8d3':'#b7b8b4';ctx.fillRect(px,py,cell,cell);
          if(!tile.open){
            ctx.fillStyle='#fff';ctx.fillRect(px,py,cell,3);ctx.fillRect(px,py,3,cell);
            ctx.fillStyle='#777';ctx.fillRect(px,py+cell-3,cell,3);ctx.fillRect(px+cell-3,py,3,cell);
          }
          ctx.strokeStyle='#92938f';ctx.lineWidth=1;ctx.strokeRect(px+.5,py+.5,cell,cell);
          ctx.font='bold 25px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
          if(tile.flag){ctx.fillStyle='#ba4938';ctx.fillText('⚑',px+cell/2,py+cell/2+2);}
          else if(tile.mine&&(tile.open||showMine)){ctx.fillStyle=tile.open?'#ba4938':'#222';ctx.fillText('✱',px+cell/2,py+cell/2+1);}
          else if(tile.open&&tile.near){ctx.fillStyle=colors[tile.near];ctx.fillText(String(tile.near),px+cell/2,py+cell/2+1);}
        }
        ctx.strokeStyle='#f5d557';ctx.lineWidth=3;ctx.strokeRect(left+game.cursor.x*cell+4,top+game.cursor.y*cell+4,cell-8,cell-8);
        if(game.paused)drawGameOverlay(ctx,480,480,'PAUSED','Press P or Resume');
        if(game.over)drawGameOverlay(ctx,480,480,game.won?'CLEARED':'BOOM',game.won?'All safe squares found':'Press Restart to try again');
      };
      return game;
    };
    const create2048 = () => {
      const side=4,cell=94,gap=8,left=40,top=52;
      const game={name:'2048',board:Array.from({length:side},()=>Array(side).fill(0)),score:0,maxTile:2,paused:false,over:false,won:false};
      game.spawn=()=>{
        const empty=[];
        for(let y=0;y<side;y++)for(let x=0;x<side;x++)if(!game.board[y][x])empty.push({x,y});
        if(!empty.length)return;
        const at=empty[Math.floor(Math.random()*empty.length)];
        game.board[at.y][at.x]=Math.random()<.9?2:4;
        game.maxTile=Math.max(game.maxTile,game.board[at.y][at.x]);
      };
      game.spawn();game.spawn();
      game.action=direction=>{
        if(game.paused||game.over||!['left','right','up','down'].includes(direction))return;
        let changed=false;
        for(let i=0;i<side;i++){
          const places=Array.from({length:side},(_,j)=>{
            if(direction==='left')return {x:j,y:i};
            if(direction==='right')return {x:side-1-j,y:i};
            if(direction==='up')return {x:i,y:j};
            return {x:i,y:side-1-j};
          });
          const values=places.map(p=>game.board[p.y][p.x]).filter(Boolean),merged=[];
          for(let j=0;j<values.length;j++){
            if(values[j]===values[j+1]){const value=values[j]*2;merged.push(value);game.score+=value;game.maxTile=Math.max(game.maxTile,value);j++;}
            else merged.push(values[j]);
          }
          while(merged.length<side)merged.push(0);
          places.forEach((p,j)=>{if(game.board[p.y][p.x]!==merged[j])changed=true;game.board[p.y][p.x]=merged[j];});
        }
        if(!changed)return;
        game.spawn();
        if(game.maxTile>=2048){game.won=true;game.over=true;return;}
        const playable=game.board.some((row,y)=>row.some((value,x)=>!value||(x<side-1&&value===row[x+1])||(y<side-1&&value===game.board[y+1][x])));
        if(!playable)game.over=true;
      };
      game.update=()=>{};
      game.draw=ctx=>{
        ctx.fillStyle='#1c2938';ctx.fillRect(0,0,480,480);
        ctx.fillStyle='#d8e4df';ctx.font='bold 16px monospace';ctx.textAlign='left';ctx.fillText('2048 / MERGE',left,32);
        ctx.textAlign='right';ctx.fillText('TOP '+game.maxTile,left+side*cell+(side-1)*gap,32);
        const colors={2:'#eee9d9',4:'#e6ddc1',8:'#efbb75',16:'#eaa066',32:'#e47b60',64:'#da6256',128:'#d8bd68',256:'#c9ad54',512:'#bca044',1024:'#ad9237',2048:'#f0d264'};
        for(let y=0;y<side;y++)for(let x=0;x<side;x++){
          const value=game.board[y][x],px=left+x*(cell+gap),py=top+y*(cell+gap);
          ctx.fillStyle=value?(colors[value]||'#ecd573'):'#425466';ctx.fillRect(px,py,cell,cell);
          if(!value)continue;
          ctx.fillStyle=value<=4?'#344354':'#172332';
          ctx.textAlign='center';ctx.textBaseline='middle';
          ctx.font='bold '+(value>=1024?29:value>=128?34:40)+'px Arial,sans-serif';
          ctx.fillText(String(value),px+cell/2,py+cell/2+2);
        }
        if(game.paused)drawGameOverlay(ctx,480,480,'PAUSED','Press P or Resume');
        if(game.over)drawGameOverlay(ctx,480,480,game.won?'2048!':'NO MOVES',game.won?'You made it':'Press Restart to try again');
      };
      return game;
    };
    // New canvas games follow the mechanics of the linked MIT-licensed GitHub projects.
    const createBreakout = () => {
      const bricks=Array.from({length:5},(_,row)=>Array.from({length:9},(_,col)=>({x:19+col*68,y:55+row*28,alive:true,row})));
      const game={name:'breakout',bricks,score:0,lives:3,paused:false,over:false,won:false,launched:false,moveDirection:0,paddleX:268,paddleWidth:104,ball:{x:320,y:364,vx:165,vy:-235,r:7}};
      game.action=action=>{
        if(game.paused||game.over)return;
        if(action==='left')game.paddleX=Math.max(8,game.paddleX-28);
        if(action==='right')game.paddleX=Math.min(640-game.paddleWidth-8,game.paddleX+28);
        if(action==='drop')game.launched=true;
      };
      game.update=dt=>{
        if(game.paused||game.over)return;
        const seconds=dt/1000,b=game.ball;
        game.paddleX=Math.max(8,Math.min(640-game.paddleWidth-8,game.paddleX+game.moveDirection*420*seconds));
        if(!game.launched){b.x=game.paddleX+game.paddleWidth/2;b.y=364;return;}
        const oldY=b.y;
        b.x+=b.vx*seconds;b.y+=b.vy*seconds;
        if(b.x-b.r<8){b.x=8+b.r;b.vx=Math.abs(b.vx);}
        if(b.x+b.r>632){b.x=632-b.r;b.vx=-Math.abs(b.vx);}
        if(b.y-b.r<8){b.y=8+b.r;b.vy=Math.abs(b.vy);}
        for(const row of bricks){
          const hit=row.find(brick=>brick.alive&&b.x+b.r>brick.x&&b.x-b.r<brick.x+58&&b.y+b.r>brick.y&&b.y-b.r<brick.y+20);
          if(hit){
            hit.alive=false;game.score+=10;
            b.vy=oldY<hit.y?-Math.abs(b.vy):Math.abs(b.vy);
            b.vx=Math.max(-360,Math.min(360,b.vx*1.01));
            if(bricks.every(r=>r.every(brick=>!brick.alive))){game.over=true;game.won=true;}
            break;
          }
        }
        if(b.vy>0&&oldY+b.r<=380&&b.y+b.r>=380&&b.x+b.r>=game.paddleX&&b.x-b.r<=game.paddleX+game.paddleWidth){
          b.y=380-b.r;b.vy=-Math.min(470,Math.abs(b.vy)*1.025);
          b.vx=Math.max(-360,Math.min(360,b.vx+(b.x-game.paddleX-game.paddleWidth/2)*2.3));
        }
        if(b.y-b.r>420){
          game.lives--;game.launched=false;
          if(!game.lives)game.over=true;
          else {b.vx=(Math.random()<.5?-1:1)*165;b.vy=-235;b.x=game.paddleX+game.paddleWidth/2;b.y=364;}
        }
      };
      game.draw=ctx=>{
        ctx.fillStyle='#161e30';ctx.fillRect(0,0,640,420);
        ctx.fillStyle='#cbd8e8';ctx.font='bold 16px monospace';ctx.textAlign='left';ctx.fillText('BREAKOUT / 001',19,31);
        ctx.textAlign='right';ctx.fillText('LIVES '+game.lives,621,31);
        const colors=['#e57651','#e5a55c','#e4cf72','#7bbfa9','#8c9cca'];
        bricks.forEach(row=>row.forEach(brick=>{if(!brick.alive)return;ctx.fillStyle=colors[brick.row];ctx.fillRect(brick.x,brick.y,58,20);ctx.fillStyle='rgba(255,255,255,.28)';ctx.fillRect(brick.x,brick.y,58,3);}));
        ctx.fillStyle='#b8d4eb';ctx.fillRect(game.paddleX,380,game.paddleWidth,11);
        ctx.fillStyle='#f8eed1';ctx.beginPath();ctx.arc(game.ball.x,game.ball.y,game.ball.r,0,Math.PI*2);ctx.fill();
        if(!game.launched&&!game.over){ctx.fillStyle='#cbd8e8';ctx.textAlign='center';ctx.font='bold 15px monospace';ctx.fillText('SPACE / LAUNCH',320,290);}
        if(game.paused)drawGameOverlay(ctx,640,420,'PAUSED','Press P or Resume');
        if(game.over)drawGameOverlay(ctx,640,420,game.won?'WALL CLEARED':'GAME OVER',game.won?'Every brick is gone':'Press Restart');
      };
      return game;
    };
    const createMemory = () => {
      const icons=['★','♫','✿','◆','☀','♥'];
      const order=[...icons,...icons];
      for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
      const left=42,top=70,cell=90,gap=12;
      const game={name:'memory',cards:order.map(icon=>({icon,open:false,matched:false})),cursor:0,first:-1,second:-1,clock:0,moves:0,score:0,paused:false,over:false,won:false};
      game.flip=index=>{
        if(game.paused||game.over||game.second!==-1)return;
        const card=game.cards[index];if(!card||card.open||card.matched)return;
        card.open=true;game.cursor=index;
        if(game.first===-1){game.first=index;return;}
        game.second=index;game.moves++;
        if(card.icon===game.cards[game.first].icon){
          card.matched=true;game.cards[game.first].matched=true;
          game.score++;game.first=-1;game.second=-1;
          if(game.score===icons.length){game.won=true;game.over=true;}
        }
      };
      game.tap=(px,py)=>{
        const x=Math.floor((px-left)/(cell+gap)),y=Math.floor((py-top)/(cell+gap));
        if(x<0||x>=4||y<0||y>=3||px>=left+x*(cell+gap)+cell||py>=top+y*(cell+gap)+cell)return;
        game.flip(y*4+x);
      };
      game.action=action=>{
        if(game.paused||game.over)return;
        if(action==='left')game.cursor=Math.max(0,game.cursor-1);
        if(action==='right')game.cursor=Math.min(11,game.cursor+1);
        if(action==='up')game.cursor=Math.max(0,game.cursor-4);
        if(action==='down')game.cursor=Math.min(11,game.cursor+4);
        if(action==='drop'||action==='reveal')game.flip(game.cursor);
      };
      game.update=dt=>{
        if(game.paused||game.second===-1)return;
        game.clock+=dt;
        if(game.clock>=680){game.cards[game.first].open=false;game.cards[game.second].open=false;game.first=-1;game.second=-1;game.clock=0;}
      };
      game.draw=ctx=>{
        ctx.fillStyle='#211d33';ctx.fillRect(0,0,480,430);
        ctx.fillStyle='#e2d9f4';ctx.font='bold 16px monospace';ctx.textAlign='left';ctx.fillText('MEMORY / SIX PAIRS',left,37);
        ctx.textAlign='right';ctx.fillText(String(game.moves).padStart(2,'0')+' MOVES',438,37);
        game.cards.forEach((card,i)=>{
          const x=left+(i%4)*(cell+gap),y=top+Math.floor(i/4)*(cell+gap),visible=card.open||card.matched;
          ctx.fillStyle=visible?(card.matched?'#ddd0a5':'#ede7d7'):'#695987';ctx.fillRect(x,y,cell,cell);
          ctx.fillStyle=visible?'#2f3044':'#d8c9ed';ctx.textAlign='center';ctx.textBaseline='middle';
          ctx.font=visible?'bold 46px Arial,sans-serif':'bold 34px monospace';
          ctx.fillText(visible?card.icon:'?',x+cell/2,y+cell/2+2);
          if(i===game.cursor){ctx.strokeStyle='#f8dc70';ctx.lineWidth=3;ctx.strokeRect(x+3,y+3,cell-6,cell-6);}
        });
        if(game.paused)drawGameOverlay(ctx,480,430,'PAUSED','Press P or Resume');
        if(game.over)drawGameOverlay(ctx,480,430,'ALL MATCHED',game.moves+' moves · press Restart');
      };
      return game;
    };
    let connectWins=0;
    const createConnectFour = () => {
      const cols=7,rows=6,cell=68,left=42,top=61;
      const game={name:'connect4',board:Array.from({length:rows},()=>Array(cols).fill(0)),cursor:3,score:connectWins,turn:'YOU',waiting:false,aiClock:0,paused:false,over:false,won:false,drawn:false};
      game.available=()=>Array.from({length:cols},(_,i)=>i).filter(i=>game.board[0][i]===0);
      game.isWin=(x,y,who)=>{
        return [[1,0],[0,1],[1,1],[1,-1]].some(([dx,dy])=>{
          let total=1;
          for(const dir of [-1,1])for(let n=1;n<4;n++){
            const nx=x+dx*n*dir,ny=y+dy*n*dir;
            if(nx<0||nx>=cols||ny<0||ny>=rows||game.board[ny][nx]!==who)break;
            total++;
          }
          return total>=4;
        });
      };
      game.wouldWin=(x,who)=>{
        const y=game.board.findLastIndex(row=>row[x]===0);if(y<0)return false;
        game.board[y][x]=who;const wins=game.isWin(x,y,who);game.board[y][x]=0;return wins;
      };
      game.drop=(x,who)=>{
        const y=game.board.findLastIndex(row=>row[x]===0);if(y<0)return;
        game.board[y][x]=who;
        if(game.isWin(x,y,who)){
          game.over=true;game.won=who===1;game.turn='DONE';game.waiting=false;
          connectWins=who===1?connectWins+1:0;game.score=connectWins;return;
        }
        if(!game.available().length){game.over=true;game.drawn=true;game.turn='DONE';game.waiting=false;connectWins=0;game.score=0;return;}
        game.waiting=who===1;game.turn=who===1?'CPU':'YOU';
      };
      game.action=action=>{
        if(game.paused||game.over||game.waiting)return;
        if(action==='left')game.cursor=Math.max(0,game.cursor-1);
        if(action==='right')game.cursor=Math.min(cols-1,game.cursor+1);
        if(action==='drop'||action==='reveal')game.drop(game.cursor,1);
      };
      game.tap=(px,py)=>{
        const x=Math.floor((px-left)/cell);
        if(x<0||x>=cols||py<top||py>top+rows*cell)return;
        game.cursor=x;game.action('drop');
      };
      game.update=dt=>{
        if(game.paused||game.over||!game.waiting)return;
        game.aiClock+=dt;if(game.aiClock<370)return;
        game.aiClock=0;
        const valid=game.available();
        const win=valid.find(x=>game.wouldWin(x,2));
        const block=valid.find(x=>game.wouldWin(x,1));
        const choice=win??block??[3,2,4,1,5,0,6].filter(x=>valid.includes(x))[Math.floor(Math.random()*Math.min(3,valid.length))];
        game.drop(choice,2);
      };
      game.draw=ctx=>{
        ctx.fillStyle='#152330';ctx.fillRect(0,0,560,480);
        ctx.fillStyle='#e3e4d5';ctx.font='bold 16px monospace';ctx.textAlign='left';ctx.fillText('CONNECT FOUR / YOU vs CPU',left,31);
        ctx.fillStyle='#f3c785';ctx.textAlign='center';ctx.fillText('▼',left+game.cursor*cell+cell/2,55);
        ctx.fillStyle='#315a84';ctx.fillRect(left,top,cols*cell,rows*cell);
        for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
          const who=game.board[y][x],cx=left+x*cell+cell/2,cy=top+y*cell+cell/2;
          ctx.beginPath();ctx.arc(cx,cy,27,0,Math.PI*2);
          ctx.fillStyle=who===1?'#ed9b5b':who===2?'#90c7e0':'#122b44';ctx.fill();
          if(who){ctx.beginPath();ctx.arc(cx-6,cy-7,8,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.22)';ctx.fill();}
        }
        if(game.paused)drawGameOverlay(ctx,560,480,'PAUSED','Press P or Resume');
        if(game.over)drawGameOverlay(ctx,560,480,game.drawn?'DRAW':game.won?'YOU WIN':'CPU WINS',game.won?'Streak '+game.score+' · press Restart':'Press Restart');
      };
      return game;
    };
    // These three original canvas adaptations take inspiration from the credited MIT-licensed projects.
    const createMazeChase = () => {
      const cols=17,rows=15,cell=30;
      const walls=Array.from({length:rows},(_,y)=>Array.from({length:cols},(_,x)=>
        x===0||y===0||x===cols-1||y===rows-1||
        (x===8&&(y<=5||y>=9))||
        ((y===3||y===11)&&((x>=3&&x<=6)||(x>=10&&x<=13)))||
        (y===7&&((x>=3&&x<=5)||(x>=11&&x<=13)))
      ));
      const key=(x,y)=>x+','+y;
      const pellets=new Set();
      for(let y=1;y<rows-1;y++)for(let x=1;x<cols-1;x++)if(!walls[y][x]&&!(x===1&&y===1))pellets.add(key(x,y));
      const powers=new Set([key(15,1),key(1,13),key(15,13)]);
      const game={name:'maze',walls,pellets,powers,player:{x:1,y:1},ghosts:[{x:15,y:13,startX:15,startY:13,color:'#ed7886',respawn:0},{x:1,y:13,startX:1,startY:13,color:'#8dd8e2',respawn:0}],direction:{x:0,y:0},nextDirection:{x:0,y:0},score:0,lives:3,power:0,safe:0,clock:0,ghostClock:0,started:false,paused:false,over:false,won:false};
      const can=(x,y)=>x>=0&&x<cols&&y>=0&&y<rows&&!walls[y][x];
      const directions=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];
      game.collisions=()=>{
        if(game.safe||game.over)return;
        for(const ghost of game.ghosts){
          if(ghost.respawn||ghost.x!==game.player.x||ghost.y!==game.player.y)continue;
          if(game.power){game.score+=50;ghost.x=ghost.startX;ghost.y=ghost.startY;ghost.respawn=800;}
          else {game.lives--;game.safe=1100;game.player={x:1,y:1};game.direction={x:0,y:0};game.nextDirection={x:0,y:0};if(!game.lives)game.over=true;break;}
        }
      };
      game.action=action=>{
        const next={left:{x:-1,y:0},right:{x:1,y:0},up:{x:0,y:-1},down:{x:0,y:1}}[action];
        if(next&&!game.paused&&!game.over){game.nextDirection=next;game.started=true;}
      };
      game.update=dt=>{
        if(game.paused||game.over||!game.started)return;
        game.power=Math.max(0,game.power-dt);game.safe=Math.max(0,game.safe-dt);
        game.ghosts.forEach(ghost=>ghost.respawn=Math.max(0,ghost.respawn-dt));
        game.clock+=dt;game.ghostClock+=dt;
        if(game.clock>=125){
          game.clock=0;
          const p=game.player,n=game.nextDirection,d=game.direction;
          if(can(p.x+n.x,p.y+n.y))game.direction=n;
          if(can(p.x+game.direction.x,p.y+game.direction.y)&&(game.direction.x||game.direction.y)){
            p.x+=game.direction.x;p.y+=game.direction.y;
            const spot=key(p.x,p.y);
            if(game.pellets.delete(spot)){game.score+=game.powers.has(spot)?50:10;if(game.powers.has(spot))game.power=6000;}
            game.collisions();
            if(!game.pellets.size){game.over=true;game.won=true;}
          }
        }
        if(game.ghostClock>=245){
          game.ghostClock=0;
          game.ghosts.forEach(ghost=>{
            if(ghost.respawn)return;
            const options=directions.filter(d=>can(ghost.x+d.x,ghost.y+d.y));
            if(!options.length)return;
            const ranked=options.sort((a,b)=>{
              const da=Math.abs(ghost.x+a.x-game.player.x)+Math.abs(ghost.y+a.y-game.player.y);
              const db=Math.abs(ghost.x+b.x-game.player.x)+Math.abs(ghost.y+b.y-game.player.y);
              return game.power?db-da:da-db;
            });
            const move=Math.random()<.63?ranked[0]:options[Math.floor(Math.random()*options.length)];
            ghost.x+=move.x;ghost.y+=move.y;
          });
          game.collisions();
        }
      };
      game.draw=ctx=>{
        ctx.fillStyle='#091425';ctx.fillRect(0,0,510,450);
        for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
          if(walls[y][x]){ctx.fillStyle='#254eae';ctx.fillRect(x*cell+2,y*cell+2,cell-4,cell-4);ctx.fillStyle='#3669d0';ctx.fillRect(x*cell+5,y*cell+5,cell-10,3);}
          else if(game.pellets.has(key(x,y))){ctx.fillStyle=powers.has(key(x,y))?'#f3a8aa':'#e6d9ab';ctx.beginPath();ctx.arc(x*cell+15,y*cell+15,powers.has(key(x,y))?6:2.5,0,Math.PI*2);ctx.fill();}
        }
        game.ghosts.forEach(ghost=>{
          if(ghost.respawn)return;
          ctx.fillStyle=game.power?'#658ed3':ghost.color;
          ctx.beginPath();ctx.arc(ghost.x*cell+15,ghost.y*cell+14,11,Math.PI,0);ctx.lineTo(ghost.x*cell+26,ghost.y*cell+25);ctx.lineTo(ghost.x*cell+4,ghost.y*cell+25);ctx.fill();
          ctx.fillStyle='#fff';ctx.fillRect(ghost.x*cell+9,ghost.y*cell+12,5,6);ctx.fillRect(ghost.x*cell+18,ghost.y*cell+12,5,6);
        });
        const p=game.player,a=game.direction.x<0?Math.PI:game.direction.y<0?-Math.PI/2:game.direction.y>0?Math.PI/2:0;
        ctx.fillStyle=game.safe&&Math.floor(game.safe/120)%2?'#fff2aa':'#f7d65e';
        ctx.beginPath();ctx.moveTo(p.x*cell+15,p.y*cell+15);ctx.arc(p.x*cell+15,p.y*cell+15,12,a+.27,a+Math.PI*2-.27);ctx.closePath();ctx.fill();
        if(!game.started){ctx.fillStyle='rgba(9,20,37,.9)';ctx.fillRect(157,207,196,36);ctx.fillStyle='#f7d65e';ctx.font='bold 15px monospace';ctx.textAlign='center';ctx.fillText('ARROWS / START',255,231);}
        if(game.paused)drawGameOverlay(ctx,510,450,'PAUSED','Press P or Resume');
        if(game.over)drawGameOverlay(ctx,510,450,game.won?'MAZE CLEARED':'GAME OVER',game.won?'Every dot collected':'Press Restart');
      };
      return game;
    };
    const createInvaders = () => {
      const buildWave=()=>Array.from({length:4},(_,row)=>Array.from({length:9},(_,col)=>({x:col*54,y:row*36,alive:true,row})));
      const game={name:'invaders',aliens:buildWave(),formationX:58,formationY:55,formationDirection:1,wave:1,shipX:320,moveDirection:0,bullets:[],enemyBullets:[],fireClock:0,enemyClock:0,score:0,lives:3,safe:0,paused:false,over:false};
      game.action=action=>{
        if(game.paused||game.over)return;
        if(action==='left')game.shipX=Math.max(22,game.shipX-28);
        if(action==='right')game.shipX=Math.min(618,game.shipX+28);
        if(action==='drop'&&game.fireClock<=0&&game.bullets.length<3){game.bullets.push({x:game.shipX,y:365});game.fireClock=220;}
      };
      game.update=dt=>{
        if(game.paused||game.over)return;
        const s=dt/1000;
        game.shipX=Math.max(22,Math.min(618,game.shipX+game.moveDirection*430*s));
        game.fireClock=Math.max(0,game.fireClock-dt);game.safe=Math.max(0,game.safe-dt);
        game.formationX+=game.formationDirection*(38+game.wave*11)*s;
        const living=game.aliens.flat().filter(a=>a.alive);
        const xs=living.map(a=>game.formationX+a.x);
        if(xs.length&&(Math.max(...xs)>602||Math.min(...xs)<22)){game.formationDirection*=-1;game.formationX+=game.formationDirection*8;game.formationY+=14;}
        game.bullets.forEach(b=>b.y-=370*s);game.bullets=game.bullets.filter(b=>b.y>-12);
        for(const bullet of game.bullets){
          const hit=living.find(a=>a.alive&&Math.abs(bullet.x-(game.formationX+a.x+16))<18&&bullet.y>game.formationY+a.y-5&&bullet.y<game.formationY+a.y+25);
          if(hit){hit.alive=false;bullet.y=-99;game.score+=10;}
        }
        game.bullets=game.bullets.filter(b=>b.y>-12);
        game.enemyClock+=dt;
        if(game.enemyClock>=Math.max(400,1100-game.wave*75)&&living.length){
          game.enemyClock=0;
          const shooter=living[Math.floor(Math.random()*living.length)];
          if(shooter.alive)game.enemyBullets.push({x:game.formationX+shooter.x+16,y:game.formationY+shooter.y+25});
        }
        game.enemyBullets.forEach(b=>b.y+=(145+game.wave*15)*s);
        game.enemyBullets=game.enemyBullets.filter(b=>{
          if(!game.safe&&Math.abs(b.x-game.shipX)<17&&b.y>363&&b.y<403){game.lives--;game.safe=1300;if(!game.lives)game.over=true;return false;}
          return b.y<425;
        });
        if(living.some(a=>a.alive&&game.formationY+a.y>345))game.over=true;
        if(!living.some(a=>a.alive)){game.wave++;game.aliens=buildWave();game.formationX=58;game.formationY=55;game.enemyBullets=[];}
      };
      game.draw=ctx=>{
        ctx.fillStyle='#0b1725';ctx.fillRect(0,0,640,420);
        for(let i=0;i<35;i++){ctx.fillStyle=i%3?'#36516a':'#708097';ctx.fillRect((i*137)%640,(i*71)%350,2,2);}
        ctx.fillStyle='#a7d9b9';ctx.font='bold 15px monospace';ctx.textAlign='left';ctx.fillText('INVADERS / WAVE '+game.wave,20,30);
        ctx.textAlign='right';ctx.fillText('LIVES '+game.lives,620,30);
        const colors=['#92c8ae','#9cbbe0','#d6a9cf','#ddaa80'];
        game.aliens.flat().forEach(a=>{
          if(!a.alive)return;
          const x=game.formationX+a.x,y=game.formationY+a.y;
          ctx.fillStyle=colors[a.row];ctx.fillRect(x+5,y,22,8);ctx.fillRect(x,y+8,32,11);ctx.fillRect(x+4,y+19,5,5);ctx.fillRect(x+23,y+19,5,5);
          ctx.fillStyle='#0b1725';ctx.fillRect(x+8,y+10,4,4);ctx.fillRect(x+21,y+10,4,4);
        });
        ctx.fillStyle='#e7dc90';game.bullets.forEach(b=>ctx.fillRect(b.x-2,b.y-10,4,12));
        ctx.fillStyle='#eaa38d';game.enemyBullets.forEach(b=>ctx.fillRect(b.x-2,b.y,4,11));
        if(!game.safe||Math.floor(game.safe/110)%2===0){ctx.fillStyle='#79d0bb';ctx.beginPath();ctx.moveTo(game.shipX,364);ctx.lineTo(game.shipX-19,399);ctx.lineTo(game.shipX+19,399);ctx.fill();}
        ctx.fillStyle='#39556a';ctx.fillRect(0,407,640,4);
        if(game.paused)drawGameOverlay(ctx,640,420,'PAUSED','Press P or Resume');
        if(game.over)drawGameOverlay(ctx,640,420,'GAME OVER','Press Restart');
      };
      return game;
    };
    const createFlappy = () => {
      const game={name:'flappy',bird:{x:91,y:245,vy:0},pipes:[],spawnClock:0,score:0,flaps:0,started:false,paused:false,over:false};
      game.addPipe=()=>game.pipes.push({x:390,gap:155+Math.random()*165,passed:false});
      game.action=action=>{
        if(!['drop','up'].includes(action)||game.paused||game.over)return;
        if(!game.started){game.started=true;game.addPipe();}
        game.flaps++;
        game.bird.vy=-325;
      };
      game.update=dt=>{
        if(game.paused||game.over||!game.started)return;
        const s=dt/1000,b=game.bird;
        b.vy+=880*s;b.y+=b.vy*s;
        game.spawnClock+=dt;if(game.spawnClock>=1650){game.spawnClock=0;game.addPipe();}
        game.pipes.forEach(pipe=>{
          pipe.x-=155*s;
          if(!pipe.passed&&pipe.x+62<b.x){pipe.passed=true;game.score++;}
          const inPipe=b.x+12>pipe.x&&b.x-12<pipe.x+62;
          if(inPipe&&(b.y-12<pipe.gap-76||b.y+12>pipe.gap+76))game.over=true;
        });
        game.pipes=game.pipes.filter(pipe=>pipe.x>-70);
        if(b.y-12<0||b.y+12>466)game.over=true;
      };
      game.draw=ctx=>{
        ctx.fillStyle='#9bd0d7';ctx.fillRect(0,0,360,520);
        ctx.fillStyle='#bce4df';for(let i=0;i<5;i++){const x=(i*93+21)%360,y=45+i*62;ctx.fillRect(x,y,40,7);ctx.fillRect(x+10,y-7,22,7);}
        game.pipes.forEach(pipe=>{
          const top=pipe.gap-76,bottom=pipe.gap+76;
          ctx.fillStyle='#378b7d';ctx.fillRect(pipe.x,0,62,top);ctx.fillRect(pipe.x,bottom,62,466-bottom);
          ctx.fillStyle='#66b49a';ctx.fillRect(pipe.x-5,top-15,72,15);ctx.fillRect(pipe.x-5,bottom,72,15);
          ctx.fillStyle='#8ac9aa';ctx.fillRect(pipe.x+7,0,7,top-15);ctx.fillRect(pipe.x+7,bottom+15,7,466-bottom-15);
        });
        const b=game.bird;
        ctx.fillStyle='#f4cf67';ctx.fillRect(b.x-13,b.y-11,26,23);
        ctx.fillStyle='#f7e7a9';ctx.fillRect(b.x-8,b.y+2,15,7);
        ctx.fillStyle='#fff';ctx.fillRect(b.x+3,b.y-7,7,7);
        ctx.fillStyle='#26343a';ctx.fillRect(b.x+7,b.y-4,3,3);
        ctx.fillStyle='#dc8555';ctx.fillRect(b.x+13,b.y+1,9,5);
        ctx.fillStyle='#678a69';ctx.fillRect(0,466,360,11);ctx.fillStyle='#ccb788';ctx.fillRect(0,477,360,43);
        for(let x=0;x<360;x+=30){ctx.fillStyle='#b6a271';ctx.fillRect(x,487,15,4);}
        ctx.textAlign='center';ctx.font='bold 36px monospace';ctx.fillStyle='#1b4a4c';ctx.fillText(String(game.score),180,60);
        if(!game.started&&!game.over){ctx.font='bold 17px monospace';ctx.fillText('TAP / SPACE TO FLAP',180,170);}
        if(game.paused)drawGameOverlay(ctx,360,520,'PAUSED','Press P or Resume');
        if(game.over)drawGameOverlay(ctx,360,520,'GAME OVER',game.score+' pipes · press Restart');
      };
      return game;
    };
    const createRockPaperScissors = () => {
      const choices=['ROCK','PAPER','SCISSORS'];
      const game={name:'rps',selected:0,player:null,cpu:null,result:'Choose your move',score:0,cpuWins:0,round:0,paused:false,over:false};
      game.play=()=>{
        game.player=game.selected;game.cpu=Math.floor(Math.random()*3);game.round++;
        const outcome=(game.player-game.cpu+3)%3;
        if(outcome===0)game.result='DRAW — throw again';
        else if(outcome===1){game.score++;game.result='YOU WIN';}
        else {game.cpuWins++;game.result='CPU WINS';}
      };
      game.action=action=>{
        if(action==='left')game.selected=(game.selected+2)%3;
        if(action==='right')game.selected=(game.selected+1)%3;
        if(['drop','up','reveal'].includes(action))game.play();
      };
      game.tap=(x)=>{game.selected=Math.max(0,Math.min(2,Math.floor(x/(560/3))));game.play();};
      game.update=()=>{};
      game.draw=ctx=>{
        ctx.fillStyle='#f4f0e4';ctx.fillRect(0,0,560,420);
        ctx.fillStyle='#111';ctx.font='900 26px Arial';ctx.textAlign='center';ctx.fillText('ROCK · PAPER · SCISSORS',280,52);
        ctx.font='700 15px Arial';ctx.fillStyle='#666';ctx.fillText('FIRST TO HAVE THE BETTER THROW',280,78);
        choices.forEach((choice,index)=>{
          const x=31+index*172,selected=index===game.selected;
          ctx.fillStyle=selected?'#111':'#e6e6e6';ctx.fillRect(x,120,154,152);
          ctx.fillStyle=selected?'#f6e7bf':'#111';ctx.font='900 23px Arial';ctx.fillText(choice,x+77,162);
          ctx.font='900 58px Arial';ctx.fillText(choice==='ROCK'?'●':choice==='PAPER'?'▰':'✂',x+77,226);
        });
        ctx.fillStyle='#111';ctx.fillRect(31,302,498,2);
        ctx.font='900 22px Arial';ctx.fillStyle='#111';ctx.fillText(game.result,280,342);
        if(game.player!==null){ctx.font='700 15px Arial';ctx.fillStyle='#555';ctx.fillText(`YOU: ${choices[game.player]}     CPU: ${choices[game.cpu]}`,280,374);}
        ctx.font='700 12px Arial';ctx.fillStyle='#777';ctx.fillText('ARROWS TO CHOOSE · SPACE TO THROW',280,402);
      };
      return game;
    };
    const gameFactories={tetris:createTetris,snake:createSnake,pinpog:createPinPog,mines:createMinesweeper,'2048':create2048,breakout:createBreakout,memory:createMemory,connect4:createConnectFour,maze:createMazeChase,invaders:createInvaders,flappy:createFlappy,rps:createRockPaperScissors};
    const gameStates={};
    let activeGameName='tetris';
    let lastGameTrigger=gameTriggers[0];
    let arcadeAnimation=0,arcadeLastTime=0;
    const gamePlayer=gamesPage.querySelector('.game-player');
    const gameLibraryStage=gamesPage.querySelector('.games-library-stage');
    const gamesShelf=gamesPage.querySelector('.games-shelf');
    const moreGamesButton=gamesPage.querySelector('[data-more-games]');
    moreGamesButton?.addEventListener('click',()=>{
      const expanded=gamesShelf.classList.toggle('is-expanded');
      moreGamesButton.setAttribute('aria-expanded',String(expanded));
      moreGamesButton.textContent=expanded?'Show featured games ↑':'Show 6 more games ↓';
    });
    const gameNumber=name=>`${String(gameCards.findIndex(card=>card.dataset.game===name)+1).padStart(2,'0')} / ${String(gameCards.length).padStart(2,'0')}`;
    const currentGame=()=>gameStates[activeGameName];
    const gameField=name=>gamesPage.querySelector(`[data-game-${name}]`);
    const syncArcadeHud=()=>{
      const game=currentGame();if(!game)return;
      const best=Math.max(arcadeBest[activeGameName],game.score);
      if(best>arcadeBest[activeGameName]){arcadeBest[activeGameName]=best;saveGameBest(activeGameName,best);}
      gameField('score').textContent=String(game.score);
      gameField('best').textContent=String(best);
      gameField('extra').textContent=String(activeGameName==='tetris'?game.lines:activeGameName==='snake'?game.snake.length:activeGameName==='mines'?10-game.flags:activeGameName==='2048'?game.maxTile:['breakout','maze','invaders'].includes(activeGameName)?game.lives:activeGameName==='memory'?game.moves:activeGameName==='connect4'?game.turn:activeGameName==='flappy'?game.flaps:activeGameName==='rps'?game.cpuWins:game.score);
      gameField('pause').textContent=game.paused?'Resume':'Pause';
      const flagButton=gamesPage.querySelector('[data-game-flag]');
      flagButton.hidden=activeGameName!=='mines';
      if(activeGameName==='mines'){flagButton.textContent=game.flagMode?'Flag: on':'Flag: off';flagButton.setAttribute('aria-pressed',String(game.flagMode));}
      if(activeGameName==='snake'){
        const x=game.snake[0].x;
        gamesPage.querySelector('[data-snake-url]').textContent='·'.repeat(x)+'◆'+'·'.repeat(23-x);
      }
      gamesPage.querySelector('[data-games-status]').textContent=game.over?`${gameInfo[activeGameName].name} · game over`:game.paused?`${gameInfo[activeGameName].name} · paused`:`${gameInfo[activeGameName].name} · playing`;
    };
    const arcadeFrame=time=>{
      if(gamesPage.hidden){arcadeAnimation=0;return;}
      const dt=Math.min(60,Math.max(0,time-arcadeLastTime));arcadeLastTime=time;
      currentGame().update(dt);currentGame().draw(arcadeCtx);syncArcadeHud();
      arcadeAnimation=requestAnimationFrame(arcadeFrame);
    };
    const startArcadeAnimation=()=>{if(arcadeAnimation)return;arcadeLastTime=performance.now();arcadeAnimation=requestAnimationFrame(arcadeFrame);};
    const stopArcadeAnimation=()=>{if(arcadeAnimation)cancelAnimationFrame(arcadeAnimation);arcadeAnimation=0;};
    const setActiveGame=(name,{route=true}={})=>{
      if(!gameInfo[name])return;
      activeGameName=name;
      if(!gameStates[name])gameStates[name]=gameFactories[name]();
      const info=gameInfo[name];
      arcadeCanvas.width=info.size[0];arcadeCanvas.height=info.size[1];
      arcadeCanvas.setAttribute('aria-label',`Playable ${info.name} board`);
      gamesPage.querySelector('.games-screen').dataset.game=name;
      gameCards.forEach(card=>card.setAttribute('aria-pressed',String(card.dataset.game===name)));
      const shelf=gamesPage.querySelector('.games-shelf'),selected=gameCards.find(card=>card.dataset.game===name);
      if(selected&&!gamesPage.hidden){
        const shelfBox=shelf.getBoundingClientRect(),cardBox=selected.getBoundingClientRect();
        shelf.scrollLeft+=cardBox.left-shelfBox.left-(shelf.clientWidth-selected.clientWidth)/2;
      }
      gameField('name').textContent=info.name;
      gameField('score-label').textContent=info.scoreLabel||'SCORE';
      gameField('extra-label').textContent=info.extra;
      gameField('instruction').textContent=info.instruction;
      gameField('source').href=info.source;
      gamesPage.querySelector('[data-game-urlbar]').hidden=name!=='snake';
      gameControls.forEach(button=>button.hidden=(
        ['snake','2048','maze'].includes(name)&&button.dataset.gameControl==='drop'
      )||(
        ['pinpog','breakout','connect4','invaders','rps'].includes(name)&&!['left','right',...(name==='pinpog'?[]:['drop'])].includes(button.dataset.gameControl)
      )||(name==='flappy'&&button.dataset.gameControl!=='drop'));
      const dropButton=gamesPage.querySelector('[data-game-control="drop"]');
      dropButton.textContent=({mines:'OPEN',memory:'FLIP',connect4:'PLACE',breakout:'LAUNCH',invaders:'FIRE',flappy:'FLAP',rps:'PLAY'})[name]||'DROP';
      dropButton.setAttribute('aria-label',({mines:'Open selected square',memory:'Flip selected card',connect4:'Place a disc',breakout:'Launch the ball',invaders:'Fire laser',flappy:'Flap',rps:'Play selected Rock Paper Scissors move'})[name]||'Hard drop');
      syncArcadeHud();currentGame().draw(arcadeCtx);
      if(route&&window.location.hash!==`#games/${name}`){try{history.pushState({page:'games'},'',`#games/${name}`);}catch(_){window.location.hash=`games/${name}`;}}
    };
    const launchGame=(name=activeGameName,{route=true,focus=true}={})=>{
      gamePlayer.dataset.mode='play';
      gameLibraryStage.dataset.mode='play';
      setActiveGame(name,{route});
      startArcadeAnimation();
      if(focus)arcadeCanvas.focus({preventScroll:true});
    };
    const showGameLibrary=({route=true,focus=true}={})=>{
      stopArcadeAnimation();
      gamePlayer.dataset.mode='browse';
      gameLibraryStage.dataset.mode='browse';
      const shelf=gamesPage.querySelector('.games-shelf'),selected=gameCards.find(card=>card.dataset.game===activeGameName);
      if(selected){const shelfBox=shelf.getBoundingClientRect(),cardBox=selected.getBoundingClientRect();shelf.scrollLeft+=cardBox.left-shelfBox.left-(shelf.clientWidth-selected.clientWidth)/2;}
      if(route&&window.location.hash!=='#games'){try{history.pushState({page:'games'},'','#games');}catch(_){window.location.hash='games';}}
      if(focus)selected?.focus({preventScroll:true});
    };
    const setGamesOpen=(open,{focus=true}={})=>{
      gamesPage.hidden=!open;document.body.classList.toggle('is-games-open',open);
      gameTriggers.forEach(button=>button.setAttribute('aria-expanded',String(open)));
      if(open){
        const directGame=/^#games\/(tetris|snake|pinpog|mines|2048|breakout|memory|connect4|maze|invaders|flappy|rps)$/.exec(window.location.hash);
        if(directGame)launchGame(directGame[1],{route:false,focus:false});
        else {gamePlayer.dataset.mode='browse';gameLibraryStage.dataset.mode='browse';setActiveGame(activeGameName,{route:false});stopArcadeAnimation();}
      }
      else stopArcadeAnimation();
      if(focus)(open?gameCards.find(card=>card.dataset.game===activeGameName):lastGameTrigger)?.focus({preventScroll:true});
    };
    const openGames=trigger=>{
      lastGameTrigger=trigger;
      gamesViewport.scrollTop=0;
      setGamesOpen(true);
      if(!window.location.hash.startsWith('#games')){try{history.pushState({page:'games'},'','#games');}catch(_){window.location.hash='games';}}
    };
    const closeGames=()=>{
      setGamesOpen(false);
      if(window.location.hash.startsWith('#games')){try{history.pushState({},'',window.location.pathname+window.location.search);}catch(_){window.location.hash='';}}
    };
    gameTriggers.forEach(button=>button.addEventListener('click',()=>openGames(button)));
    gamesPage.querySelector('[data-games-home]').addEventListener('click',closeGames);
    gameCards.forEach(card=>{
      card.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'&&gamePlayer.dataset.mode==='browse')setActiveGame(card.dataset.game,{route:false});});
      card.addEventListener('focus',()=>{if(gamePlayer.dataset.mode==='browse')setActiveGame(card.dataset.game,{route:false});});
      card.addEventListener('click',()=>launchGame(card.dataset.game));
    });
    gamesPage.querySelector('[data-game-back]').addEventListener('click',()=>showGameLibrary());
    gamesPage.querySelector('[data-game-restart]').addEventListener('click',()=>{gameStates[activeGameName]=gameFactories[activeGameName]();syncArcadeHud();});
    gamesPage.querySelector('[data-game-pause]').addEventListener('click',()=>{const game=currentGame();if(!game.over)game.paused=!game.paused;syncArcadeHud();});
    gamesPage.querySelector('[data-game-flag]').addEventListener('click',()=>{if(activeGameName!=='mines')return;currentGame().flagMode=!currentGame().flagMode;syncArcadeHud();});
    const arcadeAction=action=>{currentGame()?.action(action);syncArcadeHud();};
    const heldKeys=new Set();
    document.addEventListener('keydown',event=>{
      if(gamesPage.hidden)return;
      if(gamesPage.querySelector('dialog[open]')||document.querySelector('#site-search-dialog[open]'))return;
      if(gamePlayer.dataset.mode==='browse'){
        if(event.key==='Escape'){closeGames();return;}
        if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
          const index=gameCards.findIndex(card=>card.dataset.game===activeGameName);
          gameCards[(index+(event.key==='ArrowRight'?1:-1)+gameCards.length)%gameCards.length].focus({preventScroll:true});
          event.preventDefault();return;
        }
        if(event.key==='Enter'&&(document.activeElement===document.body||document.activeElement.closest('.games-shelf'))){launchGame();event.preventDefault();}
        return;
      }
      if(event.key==='Escape'){showGameLibrary();return;}
      const key=event.key.toLowerCase();
      if(['pinpog','breakout','invaders'].includes(activeGameName)&&['a','d','arrowleft','arrowright'].includes(key)){
        heldKeys.add(key);currentGame().moveDirection=(heldKeys.has('d')||heldKeys.has('arrowright')?1:0)-(heldKeys.has('a')||heldKeys.has('arrowleft')?1:0);
        event.preventDefault();return;
      }
      if(activeGameName==='mines'&&key==='f'){if(!event.repeat)arcadeAction('flag');event.preventDefault();return;}
      if(activeGameName==='flappy'&&['arrowup','w'].includes(key)){if(!event.repeat)arcadeAction('drop');event.preventDefault();return;}
      if(['mines','breakout','memory','connect4','invaders','flappy','rps'].includes(activeGameName)&&event.code==='Space'){if(!event.repeat||activeGameName==='invaders')arcadeAction(activeGameName==='mines'?'reveal':'drop');event.preventDefault();return;}
      if(key==='p'||(event.code==='Space'&&activeGameName!=='tetris')){
        if(!event.repeat&&!currentGame().over)currentGame().paused=!currentGame().paused;
        event.preventDefault();return;
      }
      if(activeGameName==='pinpog'&&key==='f'){gameStates.pinpog=createPinPog();event.preventDefault();return;}
      const action={arrowleft:'left',a:'left',arrowright:'right',d:'right',arrowup:'up',w:'up',arrowdown:'down',s:'down'}[key];
      if(action){if(!event.repeat||activeGameName!=='snake')arcadeAction(action);event.preventDefault();return;}
      if(event.code==='Space'&&activeGameName==='tetris'){if(!event.repeat)arcadeAction('drop');event.preventDefault();}
    });
    document.addEventListener('keyup',event=>{
      if(!['pinpog','breakout','invaders'].includes(activeGameName)||!currentGame())return;
      heldKeys.delete(event.key.toLowerCase());
      currentGame().moveDirection=(heldKeys.has('d')||heldKeys.has('arrowright')?1:0)-(heldKeys.has('a')||heldKeys.has('arrowleft')?1:0);
    });
    gameControls.forEach(button=>{
      let timer=0;
      const release=()=>{if(timer)clearInterval(timer);timer=0;button.classList.remove('is-holding');if(['pinpog','breakout','invaders'].includes(activeGameName)&&currentGame())currentGame().moveDirection=0;};
      button.addEventListener('pointerdown',event=>{
        if(event.button!==0)return;
        event.preventDefault();button.setPointerCapture?.(event.pointerId);button.classList.add('is-holding');
        const action=button.dataset.gameControl;
        if(['pinpog','breakout','invaders'].includes(activeGameName)&&action!=='drop')currentGame().moveDirection=action==='left'?-1:1;
        else {arcadeAction(action);if(activeGameName==='tetris'&&['left','right','down'].includes(action))timer=setInterval(()=>arcadeAction(action),135);if(activeGameName==='invaders'&&action==='drop')timer=setInterval(()=>arcadeAction('drop'),220);}
      });
      button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
    });
    let swipeStart=null;
    arcadeCanvas.addEventListener('pointerdown',event=>{
      if(['snake','2048','maze'].includes(activeGameName))swipeStart={x:event.clientX,y:event.clientY};
      if(activeGameName==='mines'){
        event.preventDefault();arcadeCanvas.focus({preventScroll:true});
        const bounds=arcadeCanvas.getBoundingClientRect();
        currentGame().tap((event.clientX-bounds.left)*480/bounds.width,(event.clientY-bounds.top)*480/bounds.height,event.button===2||currentGame().flagMode);
        syncArcadeHud();
      }
      if(['memory','connect4'].includes(activeGameName)){
        event.preventDefault();arcadeCanvas.focus({preventScroll:true});
        const bounds=arcadeCanvas.getBoundingClientRect();
        const width=gameInfo[activeGameName].size[0],height=gameInfo[activeGameName].size[1];
        currentGame().tap((event.clientX-bounds.left)*width/bounds.width,(event.clientY-bounds.top)*height/bounds.height);
        syncArcadeHud();
      }
      if(activeGameName==='rps'){
        event.preventDefault();arcadeCanvas.focus({preventScroll:true});
        const bounds=arcadeCanvas.getBoundingClientRect();
        currentGame().tap((event.clientX-bounds.left)*560/bounds.width);
        syncArcadeHud();
      }
      if(activeGameName==='flappy'){event.preventDefault();arcadeAction('drop');}
      if(['breakout','invaders'].includes(activeGameName))arcadeCanvas.setPointerCapture?.(event.pointerId);
    });
    arcadeCanvas.addEventListener('contextmenu',event=>{if(activeGameName==='mines')event.preventDefault();});
    arcadeCanvas.addEventListener('pointerup',event=>{
      if(!['snake','2048','maze'].includes(activeGameName)||!swipeStart)return;
      const dx=event.clientX-swipeStart.x,dy=event.clientY-swipeStart.y;swipeStart=null;
      if(Math.max(Math.abs(dx),Math.abs(dy))<20)return;
      arcadeAction(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up');
    });
    const movePinPogPointer=event=>{
      if(!['pinpog','breakout','invaders'].includes(activeGameName)||!currentGame()||currentGame().over)return;
      if(event.pointerType==='mouse'&&event.type==='pointermove'&&event.buttons!==1)return;
      const bounds=arcadeCanvas.getBoundingClientRect();
      if(activeGameName==='invaders')currentGame().shipX=Math.max(22,Math.min(618,(event.clientX-bounds.left)*640/bounds.width));
      else currentGame().paddleX=Math.max(8,Math.min(640-currentGame().paddleWidth-8,(event.clientX-bounds.left)*640/bounds.width-currentGame().paddleWidth/2));
    };
    arcadeCanvas.addEventListener('pointerdown',movePinPogPointer);
    arcadeCanvas.addEventListener('pointermove',movePinPogPointer);
    const restoreGamesRoute=()=>{
      const match=/^#games(?:\/(tetris|snake|pinpog|mines|2048|breakout|memory|connect4|maze|invaders|flappy))?$/.exec(window.location.hash);
      if(match?.[1])activeGameName=match[1];
      setGamesOpen(Boolean(match),{focus:false});
    };
    window.addEventListener('popstate',restoreGamesRoute);
    window.addEventListener('hashchange',restoreGamesRoute);
    restoreGamesRoute();

    const questionsPage = document.getElementById('questions-page');
    const questionsCanvas = document.getElementById('questions-canvas');
    const questionsCopy = document.getElementById('questions-copy');
    const questionsSlider = document.getElementById('questions-slider');
    const questionsTriggers = [...document.querySelectorAll('[data-questions]')];
    const questionsAnswer = document.getElementById('questions-answer');
    let lastQuestionsTrigger = questionsTriggers[0];
    const questionStorageKey = 'atharva-big-question-fate-choice';
    const renderQuestionAnswer = value => {
      const choice = Math.max(0,Math.min(100,Math.round(Number(value)||0)));
      questionsSlider.value = String(choice);
      questionsAnswer.textContent = `FATE ${100-choice}% / CHOICE ${choice}%`;
      questionsSlider.setAttribute('aria-valuetext',`${100-choice} percent fate, ${choice} percent choice`);
      try { localStorage.setItem(questionStorageKey,String(choice)); } catch (_) {}
    };
    const setQuestionsOpen=(open,{focus=true}={})=>{
      questionsPage.hidden=!open;
      document.body.classList.toggle('is-questions-open',open);
      questionsTriggers.forEach(button=>button.setAttribute('aria-expanded',String(open)));
      if(focus)(open?questionsSlider:lastQuestionsTrigger)?.focus({preventScroll:true});
    };
    const openQuestions=trigger=>{
      lastQuestionsTrigger=trigger;
      setQuestionsOpen(true);
      if(!window.location.hash.startsWith('#questions')){
        try{history.pushState({page:'questions'},'','#questions');}
        catch(_){window.location.hash='questions';}
      }
    };
    const closeQuestions=()=>{
      setQuestionsOpen(false);
      if(window.location.hash.startsWith('#questions')){
        try{history.pushState({},'',window.location.pathname+window.location.search);}
        catch(_){window.location.hash='';}
      }
    };
    questionsTriggers.forEach(button=>button.addEventListener('click',()=>openQuestions(button)));
    questionsPage.querySelector('[data-questions-home]').addEventListener('click',closeQuestions);
    questionsSlider.addEventListener('input',()=>renderQuestionAnswer(questionsSlider.value));
    document.addEventListener('keydown',event=>{if(!questionsPage.hidden&&event.key==='Escape')closeQuestions();});
    const restoreQuestionsRoute=()=>setQuestionsOpen(window.location.hash==='#questions',{focus:false});
    window.addEventListener('popstate',restoreQuestionsRoute);
    window.addEventListener('hashchange',restoreQuestionsRoute);
    let savedQuestion = 50;
    try { savedQuestion = localStorage.getItem(questionStorageKey) ?? 50; } catch (_) {}
    renderQuestionAnswer(savedQuestion);
    restoreQuestionsRoute();
    const musicPage=document.getElementById('music-page');
    const musicTriggers=[...document.querySelectorAll('[data-music]')];
    const musicTrackGrid=document.getElementById('music-track-grid');
    const musicEmbed=document.getElementById('music-embed');
    const musicSearch=document.getElementById('music-search');
    const musicCover=document.getElementById('music-feature-cover');
    const musicSpotifyLink=document.getElementById('music-open-link');
    const musicTracks=[{"title":"Tumblr Girls","artist":"G-Eazy ft. Christoph Andersson","spotify":"4Fv6wNYUixnYkj3Dgfrls8","cover":"assets/generated/09a63ac73059381a3150.jpg","section":"Original 14"},{"title":"Lady Killers II","artist":"G-Eazy","spotify":"068AyhyvE67qMRsMXLqAnd","cover":"assets/generated/19c13b9217b36fb1e628.jpg","section":"Original 14"},{"title":"Don't Let Me Down","artist":"The Chainsmokers ft. Daya","spotify":"1i1fxkWeaMmKEB4T7zqbzK","cover":"assets/generated/3d595ceead550d62f64f.jpg","section":"Original 14"},{"title":"Reflections","artist":"The Neighbourhood","spotify":"2xql0pid3EUwW38AsywxhV","cover":"assets/generated/ba4837585e5f04781251.jpg","section":"Original 14"},{"title":"Softcore","artist":"The Neighbourhood","spotify":"2K7xn816oNHJZ0aVqdQsha","cover":"assets/generated/ba4837585e5f04781251.jpg","section":"Original 14"},{"title":"Swim","artist":"Chase Atlantic","spotify":"3M0lSi5WW79CXQamgSBIjx","cover":"assets/generated/ae32df32c48963b2d582.jpg","section":"Original 14"},{"title":"Friends","artist":"Chase Atlantic","spotify":"2jQiSYrwJehQAcuaaQrXnS","cover":"assets/generated/4b626b269e4c760f3420.jpg","section":"Original 14"},{"title":"Night Changes","artist":"One Direction","spotify":"5O2P9iiztwhomNh8xkR9lJ","cover":"assets/generated/84b3ed4dbe0c38da5434.jpg","section":"Original 14"},{"title":"Sorry","artist":"Justin Bieber","spotify":"09CtPGIpYB4BrO8qb1RGsF","cover":"assets/generated/97788bcb01b116f1de27.jpg","section":"Original 14"},{"title":"Lean On","artist":"Major Lazer & DJ Snake ft. MØ","spotify":"2YWjW3wwQIBLNhxWKBQd16","cover":"assets/generated/736000eeecfab0ec169d.jpg","section":"Original 14"},{"title":"Attention","artist":"Charlie Puth","spotify":"5cF0dROlMOK5uNZtivgu50","cover":"assets/generated/9f7aba928fe33e394fa7.jpg","section":"Original 14"},{"title":"Closer","artist":"The Chainsmokers ft. Halsey","spotify":"7BKLCZ1jbUBVqRi2FVlTVw","cover":"assets/generated/3df312fafae8c0864e6f.jpg","section":"Original 14"},{"title":"Let Me Love You","artist":"DJ Snake ft. Justin Bieber","spotify":"0lYBSQXN6rCTvUZvg9S0lU","cover":"assets/generated/0b61f4e583e1db15ea2c.jpg","section":"Original 14"},{"title":"Heat Waves","artist":"Glass Animals","spotify":"3USxtqRwSYz57Ewm6wWRMp","cover":"assets/generated/f7493b24fbe2c2b420f0.jpg","section":"Original 14"},{"title":"Sweater Weather","artist":"The Neighbourhood","section":"After hours","spotify":"0cQVqPuHQP4KEwc7ZUQmj6","cover":"assets/generated/ea04c91d3764f33d37a6.jpg"},{"title":"Daddy Issues","artist":"The Neighbourhood","section":"After hours","spotify":"5E30LdtzQTGqRvNd7l6kG5","cover":"assets/generated/04d06e82fee0d6b0fcd5.jpg"},{"title":"You Get Me So High","artist":"The Neighbourhood","section":"After hours","spotify":"7zwn1eykZtZ5LODrf7c0tS","cover":"assets/generated/b2e06c17a5a5368dfb8a.jpg"},{"title":"The Beach","artist":"The Neighbourhood","section":"After hours","spotify":"2u0CelO5c81XS7z3dGpHbS","cover":"assets/generated/04d06e82fee0d6b0fcd5.jpg"},{"title":"Cry Baby","artist":"The Neighbourhood","section":"After hours","spotify":"0EfsDEYaSjGYd66Pr881nq","cover":"assets/generated/04d06e82fee0d6b0fcd5.jpg"},{"title":"Stargazing","artist":"The Neighbourhood","section":"After hours","spotify":"0VF7YLIxSQKyNiFL3X6MmN","cover":"assets/generated/08d20e8c64d3bd9257de.jpg"},{"title":"Void","artist":"The Neighbourhood","section":"After hours","spotify":"2wXioTynVwrEWYRv6R6vEj","cover":"assets/generated/b2e06c17a5a5368dfb8a.jpg"},{"title":"Into It","artist":"Chase Atlantic","section":"After hours","spotify":"4HwDCXsMBC7SUdp2WT4MZP","cover":"assets/generated/cab9d1f5448f549a60ff.jpg"},{"title":"Slow Down","artist":"Chase Atlantic","section":"After hours","spotify":"5lT5IZWW3JQErXELJpQgJ9","cover":"assets/generated/97d788aab95f552175b9.jpg"},{"title":"HEAVEN AND BACK","artist":"Chase Atlantic","section":"After hours","spotify":"1JdQibdvxgcrB8Rv1KFndw","cover":"assets/generated/18addcff28b7f33235c3.jpg"},{"title":"Meddle About","artist":"Chase Atlantic","section":"After hours","spotify":"1x5gfSHfhWpMFKKqbuDe9G","cover":"assets/generated/290e12a53d8ec8e2ab8a.jpg"},{"title":"Right Here","artist":"Chase Atlantic","section":"After hours","spotify":"2KtS31kaWNHs12Q5B43Ixh","cover":"assets/generated/a283be6954dedaf8e488.jpg"},{"title":"OHMAMI","artist":"Chase Atlantic","section":"After hours","spotify":"41NB5v7ulnUQg2Q6Op0Gm9","cover":"assets/generated/d10fca68360903632eca.jpg"},{"title":"Somebody Else","artist":"The 1975","section":"After hours","spotify":"5hc71nKsUgtwQ3z52KEKQk","cover":"assets/generated/d6252f1785dede9ee4ef.jpg"},{"title":"Robbers","artist":"The 1975","section":"After hours","spotify":"73jVPicY2G9YHmzgjk69ae","cover":"assets/generated/5047666d343748d55a00.jpg"},{"title":"The Sound","artist":"The 1975","section":"After hours","spotify":"7h6lpVuSGPW6RNjDXKpYDh","cover":"assets/generated/62b6083e4a520af3b28b.jpg"},{"title":"Chocolate","artist":"The 1975","section":"After hours","spotify":"44Ljlpy44mHvLJxcYUvTK0","cover":"assets/generated/e75b945616625ca8c769.jpg"},{"title":"Sex","artist":"The 1975","section":"After hours","spotify":"0wIFAHbaUucA8mog7Y2IDD","cover":"assets/generated/e75b945616625ca8c769.jpg"},{"title":"Sunset Lover","artist":"Petit Biscuit","section":"After hours","spotify":"0j8GjVLylsc0vHducg7iXo","cover":"assets/generated/ef3d2425d6c1251c8dcc.jpg"},{"title":"Midnight City","artist":"M83","section":"After hours","spotify":"6M9DkAAuh4ibDchrc8GBAn","cover":"assets/generated/ed74c82af6650d43ed72.jpg"},{"title":"Electric Feel","artist":"MGMT","section":"After hours","spotify":"4kVKI2SZrd3IU0qR8evtZe","cover":"assets/generated/4241573501d4afb0f49e.jpg"},{"title":"Walking On A Dream","artist":"Empire of the Sun","section":"After hours","spotify":"4LAI2MyPRJqkmZoJz8dTsZ","cover":"assets/generated/1596768ffe2f0004ac9e.jpg"},{"title":"Stolen Dance","artist":"Milky Chance","section":"After hours","spotify":"5dJqzw3HMhI4li3OwF0Fqn","cover":"assets/generated/06086849e2b58ee24f92.jpg"},{"title":"Riptide","artist":"Vance Joy","section":"After hours","spotify":"46UWnqyQXoaLMEtwswh0pe","cover":"assets/generated/5206db7b972594ebf3cd.jpg"},{"title":"Cold Water","artist":"Major Lazer & Justin Bieber ft. MØ","section":"After hours","spotify":"6nCZ5qSevoKw4hQY0jzshb","cover":"assets/generated/2ee4ec03494a82e524e1.jpg"},{"title":"Light It Up - Remix","artist":"Major Lazer ft. Nyla & Fuse ODG","section":"After hours","spotify":"1qFSPn37zEeCyRiVpkW9dt","cover":"assets/generated/d1efb783946a8724329e.jpg"},{"title":"Roses","artist":"The Chainsmokers ft. ROZES","section":"After hours","spotify":"7HKJjMrfNJxf2BehaOTxcU","cover":"assets/generated/f5a29cf2eeff8c17c514.jpg"},{"title":"Paris","artist":"The Chainsmokers","section":"After hours","spotify":"5gCotvwAoMVtMUCkvLRMyK","cover":"assets/generated/be0d0bff43efc8989d93.jpg"},{"title":"Something Just Like This","artist":"The Chainsmokers & Coldplay","section":"After hours","spotify":"6RUKPb4LETWmmr3iAEQktW","cover":"assets/generated/225617404987df6a2860.jpg"},{"title":"All We Know","artist":"The Chainsmokers ft. Phoebe Ryan","section":"After hours","spotify":"1zh6aNx5bqmPZiaZlc0YLd","cover":"assets/generated/28c43607968390459659.jpg"},{"title":"I Feel It Coming","artist":"The Weeknd ft. Daft Punk","section":"After hours","spotify":"5Ciutx0AwX61yFUrNPhsYT","cover":"assets/generated/857d9a2f992e9f93f6ad.jpg"},{"title":"Starboy","artist":"The Weeknd ft. Daft Punk","section":"After hours","spotify":"2xz2VGqHdgbqeam5R4ZHi6","cover":"assets/generated/43b849563b8e15b0c411.jpg"},{"title":"The Hills","artist":"The Weeknd","section":"After hours","spotify":"7fQPZh8iFu8Whd9FYSKVgX","cover":"assets/generated/486f2aa115e591d62530.jpg"},{"title":"Blinding Lights","artist":"The Weeknd","section":"After hours","spotify":"3HmaCu87HUTDoBZo45LvJt","cover":"assets/generated/b991b0331a775c709e92.jpg"},{"title":"Die For You","artist":"The Weeknd","section":"After hours","spotify":"39HYnT8jBPc0aCBSsTqC1g","cover":"assets/generated/f185a29e56debd31b881.jpg"},{"title":"Firestone","artist":"Kygo ft. Conrad Sewell","section":"After hours","spotify":"4SD4ZfOcyinZsaP1Ai7o3c","cover":"assets/generated/5bd71058e44a64adc617.jpg"},{"title":"Stole the Show","artist":"Kygo ft. Parson James","section":"After hours","spotify":"2hCmglZSL2v2NhqwLPJhPs","cover":"assets/generated/a68ac31e058049a69a68.jpg"},{"title":"It Ain't Me","artist":"Kygo & Selena Gomez","section":"After hours","spotify":"0WYmBetdfnlgB9zotot4HX","cover":"assets/generated/bfdadd3248453386d805.jpg"},{"title":"Middle","artist":"DJ Snake ft. Bipolar Sunshine","section":"After hours","spotify":"74IsgFQFWB73yTqq0Fl3Yx","cover":"assets/generated/c6ce4fbc0e4a9b8b2f3e.jpg"},{"title":"You Know You Like It","artist":"DJ Snake & AlunaGeorge","section":"After hours","spotify":"6vGsIl9C9mM5gX68QMcWKA","cover":"assets/generated/ce6ff611d4f5bdbc26de.jpg"},{"title":"We Don't Talk Anymore","artist":"Charlie Puth ft. Selena Gomez","section":"After hours","spotify":"6MTA8T5NK6m7NNntL740Sp","cover":"assets/generated/0bcc5bfc982349a6b331.jpg"},{"title":"Stay","artist":"Zedd & Alessia Cara","section":"After hours","spotify":"4AlATGEY1OC4WblgV5sKXo","cover":"assets/generated/5285fc756f39193a0f07.jpg"},{"title":"The Middle","artist":"Zedd, Maren Morris & Grey","section":"After hours","spotify":"7yXqwZUByzCvHEmQvK4uim","cover":"assets/generated/34df30062291ef8d56b6.jpg"},{"title":"Youngblood","artist":"5 Seconds of Summer","section":"After hours","spotify":"2iUXsYOEPhVqEBwsqP70rE","cover":"assets/generated/57115bc74e454fec6df0.jpg"},{"title":"Good Life","artist":"OneRepublic","section":"After hours","spotify":"5FbfPxWMDM3yEnNUJS0HLQ","cover":"assets/generated/ce09b9d2b7a9ab791b52.jpg"},{"title":"Feel It Still","artist":"Portugal. The Man","section":"After hours","spotify":"6QgjcU0zLnzq5OrUoSZ3OK","cover":"assets/generated/79555b151c096e73ab7b.jpg"},{"title":"Love Me Again","artist":"John Newman","section":"FIFA feeling","spotify":"2ZE2C90zCjaJ4cfc7BAnk2","cover":"assets/generated/27e9fe1c8c1ff5316d83.jpg"},{"title":"The Nights","artist":"Avicii","section":"FIFA feeling","spotify":"0gQuMoffsOCMfwr2D8FZGf","cover":"assets/generated/793e9f7777380e21973b.jpg"},{"title":"On Top Of The World","artist":"Imagine Dragons","section":"FIFA feeling","spotify":"4b6eGreJ0nJvjDH4aTK9tr","cover":"assets/generated/874767b90d3e8d4fd0e4.jpg"},{"title":"Dreaming","artist":"Smallpools","section":"FIFA feeling","spotify":"1uR8aTBb93lSq8zZGNnwim","cover":"assets/generated/792c36417ca6e0b13800.jpg"},{"title":"Kids","artist":"MGMT","section":"FIFA feeling","spotify":"7LNesBoGoJUmIOf6y3I8l3","cover":"assets/generated/35f80977a8a0d8d75ae7.jpg"},{"title":"Young Folks","artist":"Peter Bjorn and John","section":"FIFA feeling","spotify":"2f14Vwn28w1soYnolluueL","cover":"assets/generated/7ee3d2edb1ede20aa50f.jpg"},{"title":"Jerk It Out","artist":"Caesars","section":"FIFA feeling","spotify":"1bx7OUl2UmAnA5oZkm9If7","cover":"assets/generated/d5fa4519d18c6c0c8c40.jpg"},{"title":"Song 2","artist":"Blur","section":"FIFA feeling","spotify":"4F64QXRV1EGHSm5jIeMmcQ","cover":"assets/generated/c9355973ed5586ec3ec8.jpg"},{"title":"Supermassive Black Hole","artist":"Muse","section":"FIFA feeling","spotify":"3lPr8ghNDBLc2uZovNyLs9","cover":"assets/generated/aa569f112d3d42f3791a.jpg"},{"title":"Way down We Go","artist":"KALEO","section":"FIFA feeling","spotify":"3a60XzasqF3i8xD1ACZREP","cover":"assets/generated/7e6816e3b13e2bac194d.jpg"},{"title":"My Type","artist":"Saint Motel","section":"FIFA feeling","spotify":"4T2yCX6NAVyxgg9jEOi6eQ","cover":"assets/generated/0a67aabbdeb2a0b9edaa.jpg"},{"title":"Wavin' Flag - Coca-Cola Celebration Mix","artist":"K'NAAN","section":"FIFA feeling","spotify":"1Qe08zIfNXSc98xvfQbkzW","cover":"assets/generated/8aac34b03261d9c4384e.jpg"},{"title":"Big City Life","artist":"Mattafix","section":"FIFA feeling","spotify":"6ogLCBRFJCVD8d5oWmOHwE","cover":"assets/generated/b195116085b101f92ec8.jpg"},{"title":"Live in the Moment","artist":"Portugal. The Man","section":"FIFA feeling","spotify":"60eOMEt3WNVX1m1jmApmnX","cover":"assets/generated/79555b151c096e73ab7b.jpg"},{"title":"Walk","artist":"Kwabs","section":"FIFA feeling","spotify":"4Et6yhRb5BsqqVsLnpVrqz","cover":"assets/generated/2947e6cba4b3ae712504.jpg"},{"title":"Soy Yo","artist":"Bomba Estéreo","section":"FIFA feeling","spotify":"3GPfCu12iG4AHWUY1R6OKQ","cover":"assets/generated/af595192b265673a0e0b.jpg"},{"title":"I Can Talk","artist":"Two Door Cinema Club","section":"FIFA feeling","spotify":"3InbeZjHjrCOZKAwq8QR0E","cover":"assets/generated/6a97462a21994dc752b5.jpg"},{"title":"Club Foot","artist":"Kasabian","section":"FIFA feeling","spotify":"6HyZTNkluWaUkvbwGznH6S","cover":"assets/generated/9d4bcef2a0a4e3da5ee0.jpg"},{"title":"Tighten Up","artist":"The Black Keys","section":"FIFA feeling","spotify":"2KkOWKhpHhK4SPjgXYbsoh","cover":"assets/generated/b3b3ffcd8f908593e320.jpg"},{"title":"Mess Is Mine","artist":"Vance Joy","section":"FIFA feeling","spotify":"6Ao32SBAlgb7SFS3e751NI","cover":"assets/generated/b3b03ec0c4228384c06d.jpg"},{"title":"Always Where I Need To Be","artist":"The Kooks","section":"FIFA feeling","spotify":"163hn6ThkQlc4sA7MhX3N0","cover":"assets/generated/0d93da0d2affda914d36.jpg"},{"title":"Helicopter","artist":"Bloc Party","section":"FIFA feeling","spotify":"4vzULL7RuXGIRa7bwdy7Ym","cover":"assets/generated/551e531f53f051d7ee90.jpg"},{"title":"&Run","artist":"Sir Sly","section":"FIFA feeling","spotify":"0w4m3Xp4svlIoyL94Zjlyd","cover":"assets/generated/7b08e92565d5222b9411.jpg"},{"title":"Call It What You Want","artist":"Foster The People","section":"FIFA feeling","spotify":"3u1Er1rkjn1oSz1xdZH3ZD","cover":"assets/generated/d395be64c1c52f922f5b.jpg"},{"title":"Machu Picchu","artist":"The Strokes","section":"FIFA feeling","spotify":"21UC1TVqPeB5Cst4Bowdac","cover":"assets/generated/265a6eaf48a0246b124b.jpg"},{"title":"Rhinestone Eyes","artist":"Gorillaz","section":"FIFA feeling","spotify":"1DodPaZK0N8rEGK4LacgV0","cover":"assets/generated/1e34b639e17d5e1b45da.jpg"},{"title":"Baianá","artist":"Bakermat","section":"FIFA feeling","spotify":"780be5fB7823aHG06mwTat","cover":"assets/generated/9d47907c7bef4a1d0e21.jpg"},{"title":"Blue World","artist":"Mac Miller","section":"FIFA feeling","spotify":"44amdpYx3W1amsEr1JwgXt","cover":"assets/generated/5564c20b840f883a1052.jpg"},{"title":"Ojitos Lindos","artist":"Bad Bunny & Bomba Estéreo","section":"FIFA feeling","spotify":"3k3NWokhRRkEPhCzPmV8TW","cover":"assets/generated/0134b4ec817485615d5e.jpg"},{"title":"you should see me in a crown","artist":"Billie Eilish","section":"FIFA feeling","spotify":"4Eh3iXxgpdy6e3pCs0d48I","cover":"assets/generated/1d338cd374a1fc211d47.jpg"},{"title":"Inner Light","artist":"Elderbrook & Bob Moses","section":"FIFA feeling","spotify":"40tPP3K10yMZxwnT65REKj","cover":"assets/generated/7c09fa47e56f5e747c8f.jpg"},{"title":"Feels Like Summer","artist":"Childish Gambino","section":"FIFA feeling","spotify":"2jqYuY9xAyTwIZqv4cCUCO","cover":"assets/generated/fc7af98fc714a9b6c764.jpg"},{"title":"Supercut","artist":"Lorde","section":"FIFA feeling","spotify":"17wt1aiPI0IWpny4vKn8ps","cover":"assets/generated/f4d3d870446b34d9f39b.jpg"},{"title":"Is It True","artist":"Tame Impala","section":"FIFA feeling","spotify":"6RZmhpvukfyeSURhf4kZ0d","cover":"assets/generated/8ddcd99b80cdb237ab40.jpg"},{"title":"Genius","artist":"LSD ft. Sia, Diplo & Labrinth","section":"FIFA feeling","spotify":"4xigPf2sigSPmuFH3qCelB","cover":"assets/generated/dd960b9cac530f9b97a8.jpg"},{"title":"I Don't Wanna Talk (I Just Wanna Dance)","artist":"Glass Animals","section":"FIFA feeling","spotify":"3gjtuXWdwAadfzSW9rF1Rg","cover":"assets/generated/4ecace32a64f395fda67.jpg"},{"title":"She’s Gone, Dance On","artist":"Disclosure","section":"FIFA feeling","spotify":"29I9dv9Nq704w0Oc5yFGsR","cover":"assets/generated/5475066bf2ecb2e0f608.jpg"},{"title":"We Are One (Ole Ola)","artist":"Pitbull ft. Jennifer Lopez & Claudia Leitte","section":"FIFA feeling","spotify":"5FtepG5CPbCaKE3GqZSU19","cover":"assets/generated/b870593459aac7dad28b.jpg"},{"title":"Colors","artist":"Jason Derulo","section":"FIFA feeling","spotify":"7wD6iRghe6SnKHkvHqpnC5","cover":"assets/generated/faa53b19c730cd5eeed8.jpg"},{"title":"Black & Gold","artist":"Sam Sparro","section":"FIFA feeling","spotify":"6S7Rjeqy8oIhlvJj6jR0W3","cover":"assets/generated/b9270c256dd6b726efee.jpg"}];
    let musicSelected=0;
    let lastMusicTrigger=null;
    const musicButtons=musicTracks.map((track,index)=>{
      const button=document.createElement('button');
      button.type='button';
      button.className='music-track';
      button.setAttribute('aria-label',`Select ${track.title} by ${track.artist}`);
      button.setAttribute('aria-pressed','false');
      const cover=document.createElement('img');
      cover.src=track.cover;
      cover.alt='';
      cover.loading='lazy';
      const copy=document.createElement('span');
      copy.className='music-track-copy';
      const title=document.createElement('strong');
      title.textContent=track.title;
      const artist=document.createElement('em');
      artist.textContent=track.artist;
      copy.append(title,artist);
      button.append(cover,copy);
      button.addEventListener('click',()=>selectMusicTrack(index));
      return button;
    });
    musicTrackGrid.append(...musicButtons);
    const matchingMusicIndexes=()=>musicTracks.map((track,index)=>({track,index})).filter(({track})=>
      `${track.title} ${track.artist}`.toLocaleLowerCase().includes(musicSearch.value.trim().toLocaleLowerCase())
    ).map(({index})=>index);
    const refreshMusicLibrary=()=>{
      const matches=new Set(matchingMusicIndexes());
      musicButtons.forEach((button,index)=>button.hidden=!matches.has(index));
      document.getElementById('music-empty').hidden=matches.size>0;
      document.getElementById('music-results').textContent=`Showing ${matches.size} ${matches.size===1?'song':'songs'}`;
      musicTrackGrid.scrollTop=0;
    };
    const selectMusicTrack=index=>{
      musicSelected=(index+musicTracks.length)%musicTracks.length;
      const track=musicTracks[musicSelected];
      musicButtons.forEach((button,position)=>button.setAttribute('aria-pressed',String(position===musicSelected)));
      musicCover.src=track.cover;
      musicCover.alt=`Cover artwork for ${track.title}`;
      document.getElementById('music-feature-title').textContent=track.title;
      document.getElementById('music-feature-artist').textContent=track.artist;
      document.getElementById('music-status-text').textContent=`Selected · ${track.title} / ${track.artist}`;
      musicSpotifyLink.href=`https://open.spotify.com/track/${track.spotify}`;
      if(!musicPage.hidden){
        musicEmbed.title=`Listen to ${track.title} by ${track.artist} on Spotify`;
        musicEmbed.src=`https://open.spotify.com/embed/track/${track.spotify}?utm_source=generator`;
        if(!reducedMotion){
          const feature=musicPage.querySelector('.music-feature');
          feature.classList.remove('is-switching');
          void feature.offsetWidth;
          feature.classList.add('is-switching');
          window.setTimeout(()=>feature.classList.remove('is-switching'),380);
        }
      }
    };
    musicPage.querySelector('[data-music-prev]').addEventListener('click',()=>selectMusicTrack(musicSelected-1));
    musicPage.querySelector('[data-music-next]').addEventListener('click',()=>selectMusicTrack(musicSelected+1));
    musicPage.querySelector('[data-music-shuffle]').addEventListener('click',()=>{
      const matches=matchingMusicIndexes();
      const choices=matches.filter(index=>index!==musicSelected);
      if(choices.length)selectMusicTrack(choices[Math.floor(Math.random()*choices.length)]);
      else if(matches.length)selectMusicTrack(matches[0]);
    });
    musicSearch.addEventListener('input',refreshMusicLibrary);
    const setMusicOpen=(open,{focus=false}={})=>{
      const wasOpen=!musicPage.hidden;
      musicPage.hidden=!open;
      document.body.classList.toggle('is-music-open',open);
      musicTriggers.forEach(button=>button.setAttribute('aria-expanded',String(open)));
      if(open&&!wasOpen){
        selectMusicTrack(musicSelected);
        if(focus)musicPage.querySelector('[data-music-home]').focus({preventScroll:true});
      }else if(!open&&wasOpen){
        musicEmbed.src='about:blank';
      }
    };
    musicTriggers.forEach(button=>button.addEventListener('click',()=>{
      lastMusicTrigger=button;
      window.location.hash='music';
      setMusicOpen(true,{focus:true});
    }));
    const closeMusic=()=>{
      setMusicOpen(false);
      if(window.location.hash==='#music'){
        try{history.pushState({},'',window.location.pathname+window.location.search);}
        catch(_){window.location.hash='';}
      }
      lastMusicTrigger?.focus({preventScroll:true});
      syncGuide();
    };
    musicPage.querySelector('[data-music-home]').addEventListener('click',closeMusic);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!musicPage.hidden)closeMusic();});
    const restoreMusicRoute=()=>setMusicOpen(window.location.hash==='#music');
    window.addEventListener('hashchange',restoreMusicRoute);
    window.addEventListener('popstate',restoreMusicRoute);
    selectMusicTrack(0);
    refreshMusicLibrary();
    restoreMusicRoute();

    const guestbookPage=document.getElementById('guestbook-page');
    const guestbookForm=document.getElementById('guestbook-form');
    const guestbookCanvas=document.getElementById('guestbook-canvas');
    const guestbookContext=guestbookCanvas.getContext('2d');
    const guestbookNotes=document.getElementById('guestbook-notes');
    const guestbookStatus=document.getElementById('guestbook-status');
    const guestbookSpeech=document.getElementById('guestbook-speech');
    const guestbookMascot=document.getElementById('guestbook-mascot');
    guestbookMascot.querySelector('img').src=document.querySelector('#mascot-button img').src;
    const guestbookStorageKey='atharva-guestbook-v1';
    const guestbookSize=24;
    const guestbookPixels=new Map();
    let guestbookInk='#20243a';
    let guestbookDrawing=false;
    let guestbookPrevious=null;
    let guestbookKeyboard=[12,12];
    let guestbookKeyboardActive=false;
    let guestbookEntries=[];
    let guestbookSpeechTimer=0;
    try {
      const saved=JSON.parse(localStorage.getItem(guestbookStorageKey)||'[]');
      if(Array.isArray(saved))guestbookEntries=saved.filter(entry=>entry&&typeof entry.id==='string'&&typeof entry.name==='string'&&typeof entry.message==='string'&&typeof entry.date==='string'&&(!entry.doodle||/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(entry.doodle))).slice(0,24);
    } catch (_) {}
    const drawGuestbookPixels=()=>{
      guestbookContext.fillStyle='#fff';
      guestbookContext.fillRect(0,0,guestbookSize,guestbookSize);
      for(const [index,color] of guestbookPixels){
        guestbookContext.fillStyle=color;
        guestbookContext.fillRect(index%guestbookSize,Math.floor(index/guestbookSize),1,1);
      }
      if(guestbookKeyboardActive){
        guestbookContext.fillStyle='#000080';
        guestbookContext.fillRect(guestbookKeyboard[0],guestbookKeyboard[1],1,1);
      }
    };
    const paintGuestbookPixel=(x,y)=>{
      const index=y*guestbookSize+x;
      if(guestbookInk==='#ffffff')guestbookPixels.delete(index);
      else guestbookPixels.set(index,guestbookInk);
    };
    const guestbookPoint=event=>{
      const rect=guestbookCanvas.getBoundingClientRect();
      return [
        Math.max(0,Math.min(guestbookSize-1,Math.floor((event.clientX-rect.left)*guestbookSize/rect.width))),
        Math.max(0,Math.min(guestbookSize-1,Math.floor((event.clientY-rect.top)*guestbookSize/rect.height)))
      ];
    };
    const guestbookLine=(from,to)=>{
      let [x0,y0]=from;
      const [x1,y1]=to;
      const dx=Math.abs(x1-x0),dy=Math.abs(y1-y0);
      const sx=x0<x1?1:-1,sy=y0<y1?1:-1;
      let error=dx-dy;
      while(true){
        paintGuestbookPixel(x0,y0);
        if(x0===x1&&y0===y1)break;
        const step=2*error;
        if(step>-dy){error-=dy;x0+=sx;}
        if(step<dx){error+=dx;y0+=sy;}
      }
      drawGuestbookPixels();
    };
    guestbookCanvas.addEventListener('pointerdown',event=>{
      if(event.button!==0&&event.pointerType==='mouse')return;
      guestbookDrawing=true;
      guestbookKeyboardActive=false;
      guestbookPrevious=guestbookPoint(event);
      guestbookCanvas.setPointerCapture(event.pointerId);
      guestbookLine(guestbookPrevious,guestbookPrevious);
      event.preventDefault();
    });
    guestbookCanvas.addEventListener('pointermove',event=>{
      if(!guestbookDrawing)return;
      const point=guestbookPoint(event);
      guestbookLine(guestbookPrevious,point);
      guestbookPrevious=point;
    });
    const stopGuestbookDrawing=()=>{guestbookDrawing=false;guestbookPrevious=null;};
    guestbookCanvas.addEventListener('pointerup',stopGuestbookDrawing);
    guestbookCanvas.addEventListener('pointercancel',stopGuestbookDrawing);
    guestbookCanvas.addEventListener('focus',()=>{guestbookKeyboardActive=true;drawGuestbookPixels();});
    guestbookCanvas.addEventListener('blur',()=>{guestbookKeyboardActive=false;drawGuestbookPixels();});
    guestbookCanvas.addEventListener('keydown',event=>{
      const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
      if(directions[event.key]){
        event.preventDefault();
        guestbookKeyboard=guestbookKeyboard.map((value,index)=>Math.max(0,Math.min(guestbookSize-1,value+directions[event.key][index])));
        drawGuestbookPixels();
      }else if(event.key===' '||event.key==='Enter'){
        event.preventDefault();
        paintGuestbookPixel(...guestbookKeyboard);
        drawGuestbookPixels();
      }
    });
    guestbookPage.querySelectorAll('[data-guestbook-color]').forEach(button=>button.addEventListener('click',()=>{
      guestbookInk=button.dataset.guestbookColor;
      guestbookPage.querySelectorAll('[data-guestbook-color]').forEach(color=>color.setAttribute('aria-pressed',String(color===button)));
    }));
    guestbookPage.querySelector('[data-guestbook-clear]').addEventListener('click',()=>{
      guestbookPixels.clear();
      drawGuestbookPixels();
      guestbookStatus.textContent='Doodle cleared. Your note is still here.';
    });
    const saveGuestbookEntries=()=>{
      try { localStorage.setItem(guestbookStorageKey,JSON.stringify(guestbookEntries));return true; }
      catch (_) { return false; }
    };
    const renderGuestbookEntries=(arrivingId='')=>{
      guestbookNotes.replaceChildren();
      guestbookPage.querySelector('[data-guestbook-count]').textContent=String(guestbookEntries.length).padStart(2,'0');
      guestbookPage.querySelector('[data-guestbook-foot]').textContent=guestbookEntries.length+' note'+(guestbookEntries.length===1?'':'s')+' pinned on this device';
      if(!guestbookEntries.length){
        const empty=document.createElement('div');
        empty.className='guestbook-empty';
        const heading=document.createElement('strong');
        heading.textContent='The first note goes here.';
        const hint=document.createElement('span');
        hint.textContent='A hello or a tiny doodle is plenty.';
        empty.append(heading,hint);
        guestbookNotes.append(empty);
        return;
      }
      guestbookEntries.forEach(entry=>{
        const card=document.createElement('article');
        card.className='guestbook-note'+(entry.id===arrivingId?' is-arriving':'');
        if(entry.doodle){
          const image=document.createElement('img');
          image.src=entry.doodle;
          image.alt='Pixel doodle by '+entry.name;
          card.append(image);
        }
        if(entry.message){
          const message=document.createElement('p');
          message.textContent=entry.message;
          card.append(message);
        }
        const footer=document.createElement('footer');
        const name=document.createElement('span');
        name.textContent=entry.name;
        const date=document.createElement('time');
        date.textContent=entry.date;
        footer.append(name,date);
        card.append(footer);
        const remove=document.createElement('button');
        remove.type='button';
        remove.className='guestbook-note-remove';
        remove.textContent='×';
        remove.setAttribute('aria-label','Remove note by '+entry.name);
        remove.addEventListener('click',()=>{
          guestbookEntries=guestbookEntries.filter(note=>note.id!==entry.id);
          const saved=saveGuestbookEntries();
          renderGuestbookEntries();
          guestbookStatus.textContent=saved?'Note removed from this browser.':'Note removed for this visit.';
        });
        card.append(remove);
        guestbookNotes.append(card);
      });
    };
    const speakGuestbook=(message)=>{
      guestbookSpeech.textContent=message;
      window.clearTimeout(guestbookSpeechTimer);
      guestbookSpeechTimer=window.setTimeout(()=>{guestbookSpeech.textContent='Leave me a note!';},3000);
    };
    guestbookMascot.addEventListener('click',()=>{
      guestbookPage.querySelector('#guestbook-message').focus();
      speakGuestbook('What should I pin?');
    });
    guestbookForm.addEventListener('submit',event=>{
      event.preventDefault();
      const message=guestbookPage.querySelector('#guestbook-message').value.trim().slice(0,160);
      const name=guestbookPage.querySelector('#guestbook-name').value.trim().slice(0,24)||'A visitor';
      if(!message&&!guestbookPixels.size){
        guestbookStatus.textContent='Write a note or draw a pixel first.';
        guestbookPage.querySelector('#guestbook-message').focus();
        return;
      }
      guestbookKeyboardActive=false;
      drawGuestbookPixels();
      const doodle=guestbookPixels.size?guestbookCanvas.toDataURL('image/png'):'';
      const id=String(Date.now())+'-'+Math.floor(Math.random()*1000000);
      guestbookEntries.unshift({id,name,message,date:new Date().toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}),doodle});
      guestbookEntries=guestbookEntries.slice(0,24);
      const saved=saveGuestbookEntries();
      renderGuestbookEntries(id);
      if(window.matchMedia('(max-width:850px)').matches)guestbookPage.querySelector('.guestbook-board').scrollIntoView({behavior:'auto',block:'start'});
      guestbookForm.reset();
      guestbookPixels.clear();
      drawGuestbookPixels();
      guestbookStatus.textContent=saved?'Pinned! This note is saved in your browser.':'Pinned for this visit. Browser storage is unavailable.';
      speakGuestbook('Pinned it!');
      guestbookMascot.classList.remove('is-pinning');
      void guestbookMascot.offsetWidth;
      guestbookMascot.classList.add('is-pinning');
      window.setTimeout(()=>guestbookMascot.classList.remove('is-pinning'),700);
    });
    const guestbookTriggers=[...document.querySelectorAll('[data-guestbook]')];
    let lastGuestbookTrigger=null;
    const setGuestbookOpen=(open,{focus=true}={})=>{
      guestbookPage.hidden=!open;
      document.body.classList.toggle('is-guestbook-open',open);
      guestbookTriggers.forEach(button=>button.setAttribute('aria-expanded',String(open)));
      if(open&&focus)guestbookPage.querySelector('[data-guestbook-home]').focus({preventScroll:true});
    };
    guestbookTriggers.forEach(button=>button.addEventListener('click',()=>{
      lastGuestbookTrigger=button;
      window.location.hash='guestbook';
      setGuestbookOpen(true);
    }));
    const closeGuestbook=()=>{
      setGuestbookOpen(false,{focus:false});
      if(window.location.hash==='#guestbook'){
        try { history.pushState({},'',window.location.pathname+window.location.search); }
        catch (_) { window.location.hash=''; }
      }
      syncGuide();
      lastGuestbookTrigger?.focus({preventScroll:true});
    };
    guestbookPage.querySelector('[data-guestbook-home]').addEventListener('click',closeGuestbook);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!guestbookPage.hidden)closeGuestbook();});
    const restoreGuestbookRoute=()=>setGuestbookOpen(window.location.hash==='#guestbook',{focus:false});
    window.addEventListener('hashchange',restoreGuestbookRoute);
    window.addEventListener('popstate',restoreGuestbookRoute);
    drawGuestbookPixels();
    renderGuestbookEntries();
    restoreGuestbookRoute();
    // Original, locally synthesized UI sounds. Nothing is loaded or played before a gesture.
    const soundControls=[...document.querySelectorAll('[data-sound-toggle]')];
    const AudioEngine=window.AudioContext||window.webkitAudioContext;
    let soundEnabled=false;
    try{soundEnabled=localStorage.getItem('to-know-sound')==='on';}catch(_){}
    let audioContext=null;
    let audioMaster=null;
    let ambientStarted=false;
    let sliderLastTick=-Infinity;
    let lastClickSound=-Infinity;
    let lastInteraction=0;
    const updateSoundControls=()=>{
      soundControls.forEach(button=>{
        button.disabled=!AudioEngine;
        button.setAttribute('aria-pressed',String(soundEnabled&&Boolean(AudioEngine)));
        button.setAttribute('aria-label',`Turn website sounds ${soundEnabled?'off':'on'}`);
        button.title=`Sound ${soundEnabled?'on':'off'} · click to ${soundEnabled?'mute':'play'}`;
        const label=button.querySelector('[data-sound-label]');
        if(label)label.textContent=`Sound: ${soundEnabled&&AudioEngine?'On':'Off'}`;
      });
      document.querySelectorAll('[data-help-sound]').forEach(label=>{
        label.textContent=soundEnabled&&AudioEngine?'On':'Off';
        label.closest('button')?.setAttribute('aria-label',`Sound ${soundEnabled?'on':'off'}. Click to toggle`);
      });
    };
    const unlockAudio=()=>{
      if(!AudioEngine||!soundEnabled)return false;
      if(!audioContext){
        try{
          audioContext=new AudioEngine();
          audioMaster=audioContext.createGain();
          audioMaster.gain.value=.58;
          audioMaster.connect(audioContext.destination);
        }catch(_){return false;}
      }
      if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
      if(!ambientStarted){
        ambientStarted=true;

      }
      return true;
    };
    const playTone=(frequency,length=.1,volume=.012,type='triangle',delay=0)=>{
      if(!soundEnabled||!audioContext||!audioMaster||document.hidden)return;
      const at=audioContext.currentTime+delay;
      const oscillator=audioContext.createOscillator();
      const filter=audioContext.createBiquadFilter();
      const envelope=audioContext.createGain();
      oscillator.type=type;
      oscillator.frequency.setValueAtTime(frequency,at);
      filter.type='lowpass';
      filter.frequency.setValueAtTime(1350,at);
      filter.Q.value=.35;
      envelope.gain.setValueAtTime(.0001,at);
      envelope.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),at+.008);
      envelope.gain.exponentialRampToValueAtTime(.0001,at+length);
      oscillator.connect(filter);filter.connect(envelope);envelope.connect(audioMaster);
      oscillator.start(at);oscillator.stop(at+length+.02);
    };
    const playAmbientPhrase=()=>{
      if(!soundEnabled||!audioContext||document.hidden||performance.now()-lastInteraction<5000)return;
      if(/^#(?:games|paint|music)/.test(window.location.hash))return;
      const route=window.location.hash;
      const notes=route.startsWith('#jeans')?[262,330,392,330,294,349,330,262]
        :route.startsWith('#sports')?[294,370,440,370,330,392,370,294]
        :route.startsWith('#questions')?[220,262,330,262,247,294,262,220]
        :[262,330,392,330,294,349,330,262];
      notes.forEach((note,i)=>playTone(note,.18,.009,'triangle',i*.27));
      playTone(notes[0]/2,.7,.004,'sine',0);
      playTone(notes[0]/2,.55,.003,'sine',1.08);
    };
    const playUiSound=kind=>{
      if(!soundEnabled||!unlockAudio())return;
      lastInteraction=performance.now();
      if(kind==='open'){
        playTone(262,.12,.019,'triangle');
        playTone(330,.12,.016,'triangle',.09);
        playTone(392,.2,.014,'sine',.18);
      }else if(kind==='close'){
        playTone(392,.1,.013,'triangle');
        playTone(262,.16,.012,'sine',.085);
      }else if(kind==='select'){
        playTone(330,.095,.014,'triangle');
        playTone(392,.13,.008,'sine',.055);
      }else if(kind==='tick'){
        playTone(294,.035,.004,'sine');
      }else{
        playTone(260,.038,.01,'triangle');
      }
    };
    const toggleSiteSound=()=>{
      if(!AudioEngine)return;
      soundEnabled=!soundEnabled;
      try{localStorage.setItem('to-know-sound',soundEnabled?'on':'off');}catch(_){}
      updateSoundControls();
      if(audioMaster&&audioContext)audioMaster.gain.setTargetAtTime(soundEnabled ? .58 : 0,audioContext.currentTime,.025);
      if(soundEnabled)playUiSound('open');
    };
    soundControls.forEach(button=>button.addEventListener('click',toggleSiteSound));
    document.addEventListener('click',event=>{
      const target=event.target instanceof Element?event.target.closest('button,a,[role="button"]'):null;
      if(!target||target.hasAttribute('data-sound-toggle'))return;
      const now=performance.now();
      if(now-lastClickSound<75)return;
      lastClickSound=now;
      if(target.matches('[data-jeans],[data-sports],[data-writing],[data-portfolio],[data-paint],[data-games],[data-questions],[data-guestbook],[data-music]'))playUiSound('open');
      else if(target.matches('[data-jeans-home],[data-sports-home],[data-writing-home],[data-portfolio-home],[data-paint-home],[data-games-home],[data-questions-home],[data-guestbook-home],[data-music-home]'))playUiSound('close');
      else if(target.matches('.jean-select,.sports-item,.game-cartridge,.portfolio-filter,.writing-card'))playUiSound('select');
      else playUiSound('tap');
    });
    const soundSlider=document.getElementById('questions-slider');
    soundSlider.addEventListener('input',()=>{
      const now=performance.now();
      if(now-sliderLastTick<135)return;
      sliderLastTick=now;
      playUiSound('tick');
    });
    document.addEventListener('keydown',event=>{
      if(event.repeat||!soundEnabled||document.getElementById('questions-page').hidden)return;
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
      const now=performance.now();
      if(now-sliderLastTick<135)return;
      sliderLastTick=now;
      playUiSound('tick');
    });
    updateSoundControls();
    const mascotButton=document.getElementById('mascot-button');
    const helper=document.querySelector('.helper');
    const helperPanel=document.getElementById('helper-panel');
    const helperMessage=document.getElementById('helper-message');
    const helperSection=document.getElementById('helper-section');
    const guideTitles={home:'HOME',start:'START HERE',personal:'PERSONAL',jeans:'JEANS ARCHIVE',sports:'SPORTS ARCHIVE',writing:'WRITING',portfolio:'PORTFOLIO',paint:'PAINT',games:'ARCADE',music:'MIXTAPE',guestbook:'NOTE TO SELF',questions:'BIG QUESTIONS'};
    let guideRoute='home';
    const currentGuideRoute=()=>{
      const route=window.location.hash.slice(1).split('/')[0];
      return Object.hasOwn(guideTitles,route)?route:'home';
    };
    const syncGuide=()=>{
      guideRoute=currentGuideRoute();
      helperSection.textContent=guideTitles[guideRoute];
      document.body.classList.toggle('is-guide-subpage',guideRoute!=='home');
      helperMessage.textContent='OPEN SITE MAP';
      helperPanel.querySelectorAll('[data-helper-route]').forEach(button=>{
        if(button.dataset.helperRoute===guideRoute)button.setAttribute('aria-current','page');
        else button.removeAttribute('aria-current');
      });
    };
    const waveMascot=()=>{
      mascotButton.classList.remove('is-waving');
      void mascotButton.offsetWidth;
      mascotButton.classList.add('is-waving');
      window.setTimeout(()=>mascotButton.classList.remove('is-waving'),520);
    };
    const openMascotGuide=()=>{
      closeMenu();
      closeMobileMenu();
      syncGuide();
      helperPanel.hidden=false;
      helper.classList.add('is-open');
      mascotButton.setAttribute('aria-expanded','true');
      waveMascot();
      helperPanel.querySelector('[data-helper-route="home"]').focus({preventScroll:true});
    };
    const closeMascotGuide=({restoreFocus=true}={})=>{
      if(helperPanel.hidden)return;
      helperPanel.hidden=true;
      helper.classList.remove('is-open');
      mascotButton.setAttribute('aria-expanded','false');
      if(restoreFocus)mascotButton.focus({preventScroll:true});
    };
    mascotButton.addEventListener('click',()=>helperPanel.hidden?openMascotGuide():closeMascotGuide());
    document.getElementById('helper-close').addEventListener('click',()=>closeMascotGuide());
    helperPanel.querySelectorAll('[data-helper-route]').forEach(button=>button.addEventListener('click',()=>{
      const route=button.dataset.helperRoute;
      closeMascotGuide();
      if(currentGuideRoute()!==route)window.location.hash=route==='home'?'':route;
      syncGuide();
    }));
    document.addEventListener('keydown',event=>{
      if(event.key==='F1'){event.preventDefault();if(helperPanel.hidden)openMascotGuide();else closeMascotGuide();}
      else if(event.key==='Escape'&&!helperPanel.hidden){event.preventDefault();event.stopImmediatePropagation();closeMascotGuide();}
    },true);
    document.addEventListener('pointerdown',event=>{
      if(!helperPanel.hidden&&!helper.contains(event.target))closeMascotGuide({restoreFocus:false});
    });
    window.addEventListener('hashchange',syncGuide);
    window.addEventListener('popstate',syncGuide);
    document.addEventListener('click',event=>{
      if(event.target instanceof Element && event.target.closest('[data-jeans],[data-sports],[data-writing],[data-portfolio],[data-paint],[data-games],[data-questions],[data-guestbook],[data-music],[data-jeans-home],[data-sports-home],[data-writing-home],[data-portfolio-home],[data-paint-home],[data-games-home],[data-questions-home],[data-guestbook-home],[data-music-home]')){
        window.setTimeout(syncGuide,0);
      }
    });
    syncGuide();

    // A small achievement cabinet for the curious; nothing changes until a secret is found.
    const secretDefinitions={
      konami:{title:'KONAMI // 1UP',detail:'Old-school cheat code accepted. The Paint window celebrates.'},
      mascot:{title:'MASCOT SIGNAL',detail:'Five quick taps and he waves back.'},
      denim:{title:'DENIM WASH // SPECIAL',detail:'Three quick taps on one pair unlock the secret wash.'},
      usa:{title:'USA / LOCKER ROOM NOTE',detail:'A hidden detail in the sports archive.'},
      paper:{title:'MARGIN NOTE FOUND',detail:'The A paper remembers its first draft.'},
      arcade:{title:'1UP // EXTRA LIFE',detail:'Three taps on the arcade title bar. Game on.'},
      record:{title:'NEEDLE DROP',detail:'A quick triple-tap spins the record.'},
      heart:{title:'PIXEL HEART STAMPED',detail:'Double-click the guestbook doodle pad for a tiny heart.'},
      questions:{title:'BIG QUESTIONS',detail:'You found the fate and choice slider.'},
      portfolio:{title:'PROJECT FILE / FOUND',detail:'The portfolio cover had a little stamp hiding in it.'}
    };
    const secretStorageKey='atharva-paint-secrets-v1';
    let foundSecrets=[];
    try{
      const saved=JSON.parse(localStorage.getItem(secretStorageKey)||'[]');
      if(Array.isArray(saved))foundSecrets=[...new Set(saved.filter(key=>Object.hasOwn(secretDefinitions,key)))];
    }catch(_){}
    const secretToast=document.getElementById('secret-toast');
    let secretToastTimer=0;
    const revealSecret=key=>{
      const secret=secretDefinitions[key];
      if(!secret||foundSecrets.includes(key))return;
      foundSecrets.push(key);
      try{localStorage.setItem(secretStorageKey,JSON.stringify(foundSecrets));}catch(_){}
      document.getElementById('secret-toast-title').textContent=secret.title;
      document.getElementById('secret-toast-detail').textContent=secret.detail;
      document.getElementById('secret-toast-count').textContent=`SECRETS FOUND ${String(foundSecrets.length).padStart(2,'0')} / ${Object.keys(secretDefinitions).length}`;
      secretToast.hidden=false;
      window.clearTimeout(secretToastTimer);
      secretToastTimer=window.setTimeout(()=>{secretToast.hidden=true;},4800);
    };
    document.getElementById('secret-toast-close').addEventListener('click',()=>{window.clearTimeout(secretToastTimer);secretToast.hidden=true;});
    const bindQuickTapSecret=(selector,key,{count=3,within=2200,eligible=()=>true,onFound=()=>{}}={})=>{
      const taps=new WeakMap();
      document.addEventListener('click',event=>{
        const source=event.target instanceof Element?event.target:null;
        const item=source?.closest(selector);
        if(!item||!eligible(item))return;
        const now=performance.now();
        const previous=taps.get(item);
        const next=previous&&now-previous.at<=within?previous.count+1:1;
        taps.set(item,{count:next,at:now});
        if(next>=count){taps.delete(item);onFound(item);revealSecret(key);}
      });
    };
    const easterCode=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let codeEntry=[];
    document.addEventListener('keydown',event=>{
      if(event.repeat||event.ctrlKey||event.metaKey||event.altKey)return;
      const target=event.target;
      if(target instanceof Element&&target.closest('input,textarea,select,[contenteditable="true"],[role="textbox"]')){codeEntry=[];return;}
      const key=event.key.length===1?event.key.toLowerCase():event.key;
      codeEntry.push(key);
      if(codeEntry.length>easterCode.length)codeEntry.shift();
      if(codeEntry.length===easterCode.length&&codeEntry.every((value,index)=>value===easterCode[index])){
        codeEntry=[];revealSecret('konami');
        const burst=document.getElementById('secret-burst');
        if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
          burst.replaceChildren();burst.hidden=false;
          const colors=['#f1cd57','#ea7354','#45a6a0','#718ce0','#d77cc6','#86c968'];
          for(let i=0;i<26;i++){
            const pixel=document.createElement('span');pixel.textContent=i%3===0?'✦':'■';
            pixel.style.setProperty('--secret-x',`${Math.random()*100}%`);
            pixel.style.setProperty('--secret-drift',`${Math.round(Math.random()*160-80)}px`);
            pixel.style.setProperty('--secret-delay',`${(Math.random()*.45).toFixed(2)}s`);
            pixel.style.setProperty('--secret-color',colors[i%colors.length]);burst.append(pixel);
          }
          window.setTimeout(()=>{burst.hidden=true;burst.replaceChildren();},2300);
        }
      }else if(!easterCode.slice(0,codeEntry.length).every((value,index)=>value===codeEntry[index])){
        codeEntry=key===easterCode[0]?[key]:[];
      }
    });
    bindQuickTapSecret('#mascot-button','mascot',{count:5,within:6500,onFound:()=>waveMascot()});
    bindQuickTapSecret('.jeans-pair-button','denim',{count:3,within:2200});
    bindQuickTapSecret('.sports-notes-visual img','usa',{count:5,within:5000,eligible:item=>item.closest('.sports-notes')?.querySelector('#sports-notes-name')?.textContent==='USA National Team Jersey'});
    bindQuickTapSecret('.writing-title-icon','paper',{count:3,within:2400});
    bindQuickTapSecret('.games-titlebar strong','arcade',{count:3,within:2400});
    bindQuickTapSecret('.music-art-stack','record',{count:3,within:2200,onFound:()=>{
      const disc=document.querySelector('.music-disc');disc.classList.remove('is-secret-spinning');void disc.offsetWidth;disc.classList.add('is-secret-spinning');
      window.setTimeout(()=>disc.classList.remove('is-secret-spinning'),850);
    }});
    bindQuickTapSecret('.portfolio-paper-front','portfolio',{count:3,within:2400,onFound:item=>{
      item.classList.remove('is-secret-stamped');void item.offsetWidth;item.classList.add('is-secret-stamped');
      window.setTimeout(()=>item.classList.remove('is-secret-stamped'),2400);
    }});
    const heartRows=['01100110','11111111','11111111','11111111','01111110','00111100','00011000'];
    let lastGuestbookTap=0,lastHeartStampAt=-1000;
    const stampGuestbookHeart=()=>{
      const now=performance.now();
      if(now-lastHeartStampAt<450)return;
      lastHeartStampAt=now;
      const ink=guestbookInk;guestbookInk='#b04325';
      heartRows.forEach((row,y)=>[...row].forEach((pixel,x)=>{if(pixel==='1')paintGuestbookPixel(8+x,8+y);}));
      guestbookInk=ink;drawGuestbookPixels();
      guestbookStatus.textContent='A tiny heart appeared. Pin the doodle to keep it.';
      speakGuestbook('A little heart! Pin it to the board.');revealSecret('heart');
    };
    guestbookCanvas.addEventListener('dblclick',stampGuestbookHeart);
    guestbookCanvas.addEventListener('pointerup',event=>{
      if(event.pointerType==='mouse')return;
      const now=performance.now();
      if(now-lastGuestbookTap<=380){lastGuestbookTap=0;stampGuestbookHeart();}
      else lastGuestbookTap=now;
    });
    const questionEdges=[];
    questionsSlider.addEventListener('change',()=>{
      const value=Number(questionsSlider.value),last=Number(questionsSlider.max);
      if(value!==0&&value!==last){questionEdges.length=0;return;}
      if(questionEdges.at(-1)!==value)questionEdges.push(value);
      while(questionEdges.length>3)questionEdges.shift();
      if(questionEdges.join(',')===`${last},0,${last}`){questionEdges.length=0;revealSecret('questions');}
    });
    // Cross-section navigation and search. Uses the existing project and essay records.
    const startPage=document.getElementById('start-page');
    const personalPage=document.getElementById('personal-page');
    const setHubOpen=(page,open)=>{page.hidden=!open;};
    const sectionPages = {start:startPage,portfolio:portfolioPage,writing:writingPage,personal:personalPage,jeans:jeansPage,sports:sportsPage,paint:paintPage,games:gamesPage,questions:questionsPage,music:musicPage,guestbook:guestbookPage};
    const sectionLabels = {home:'Home',start:'Start Here',portfolio:'Activities',writing:'Writing',personal:'Personal',jeans:'Jeans',sports:'Sports',paint:'Paint',games:'Arcade',questions:'Big Questions',music:'Mixtape',guestbook:'Note to Self'};
    const sectionSetters = {start:open=>setHubOpen(startPage,open),portfolio:setPortfolioOpen,writing:setWritingOpen,personal:open=>setHubOpen(personalPage,open),jeans:setJeansPageOpen,sports:setSportsPageOpen,paint:setPaintOpen,games:setGamesOpen,questions:setQuestionsOpen,music:setMusicOpen,guestbook:setGuestbookOpen};
    let previousUiRoute = null;
    const refreshUiRoute = () => {
      const route = location.hash.slice(1).split('/')[0] || 'home';
      for (const [key,page] of Object.entries(sectionPages)) {
        if(key!==route && !page.hidden) sectionSetters[key](false,{focus:false});
      }
      const active = sectionPages[route];
      if((route==='start'||route==='personal')&&active?.hidden)sectionSetters[route](true);
      const home = document.querySelector('main');
      home.inert = Boolean(active && route!=='jeans');
      hotspotLayer.inert = Boolean(active);
      document.querySelector('.site-find-button--home').hidden = Boolean(active);
      if(route!==previousUiRoute){
        playSurfaceMotion(active || home);
        if(route==='home' && previousUiRoute && previousUiRoute!=='home'){document.querySelector(`.hotspot[data-${previousUiRoute}]`)?.focus({preventScroll:true});}
        previousUiRoute=route;
      }
      const project = route==='portfolio' ? portfolioProjects.find(p=>p.id===location.hash.split('/')[1]) : null;
      document.title = (project?.name || (route==='home'?'':sectionLabels[route])) ? `${project?.name || sectionLabels[route]} | Atharva Naveen` : 'Atharva Naveen | Projects & Living Résumé';
    };
    // Keep keyboard, programmatic, and browser navigation in sync.
    for(const method of ['pushState','replaceState']){
      const original=history[method].bind(history);
      history[method]=(...args)=>{original(...args);queueMicrotask(refreshUiRoute);};
    }
    // Direct clicks use pushState, which does not emit hashchange.
    document.addEventListener('click',()=>queueMicrotask(refreshUiRoute));
    window.addEventListener('hashchange',refreshUiRoute);
    window.addEventListener('popstate',refreshUiRoute);

    const searchDialog=document.getElementById('site-search-dialog');
    const siteSearch=document.getElementById('site-search-input');
    const searchResults=document.getElementById('site-search-results');
    const searchEntries=[
      ...Object.entries(sectionLabels).map(([id,title])=>({title,kind:'Section',href:id==='home'?'#':'#'+id})),
      ...portfolioProjects.map(p=>({title:p.name,kind:'Activity',href:'#portfolio/'+p.id,terms:p.role+' '+p.kind})),
      ...Object.entries(writingDetails).map(([id,p])=>({title:p.title,kind:'Essay',href:'#writing/'+id,terms:p.contest}))
    ];
    const normalizeSearch=value=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const drawSiteSearch=()=>{
      const words=normalizeSearch(siteSearch.value.trim()).split(/\s+/).filter(Boolean);
      const pool=words.length ? searchEntries : searchEntries.filter(p=>p.kind==='Section');
      const matches=pool.filter(p=>words.every(word=>normalizeSearch(p.title+' '+p.kind+' '+(p.terms||'')).includes(word)));
      searchResults.replaceChildren();
      matches.slice(0,20).forEach(p=>{
        const li=document.createElement('li');const a=document.createElement('a');a.href=p.href;
        const title=document.createElement('span');title.textContent=p.title;const type=document.createElement('small');type.textContent=p.kind;
        a.append(title,type);li.append(a);searchResults.append(li);
      });
      if(!matches.length){const li=document.createElement('li');li.className='search-no-results';li.textContent='No matches. Try an activity, section, or essay title.';searchResults.append(li);}
      document.getElementById('site-search-status').textContent=matches.length+' results';
    };
    const openSiteSearch=()=>{if(searchDialog.open)return;closeMascotGuide({restoreFocus:false});siteSearch.value='';drawSiteSearch();searchDialog.showModal();siteSearch.focus();};
    document.querySelectorAll('[data-site-find]').forEach(b=>b.addEventListener('click',openSiteSearch));
    searchDialog.querySelector('[data-search-close]').addEventListener('click',()=>searchDialog.close());
    searchDialog.addEventListener('click',event=>{if(event.target===searchDialog){const r=searchDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)searchDialog.close();}});
    searchDialog.addEventListener('keydown',event=>{
      if(event.key==='ArrowDown'&&event.target===siteSearch){event.preventDefault();searchResults.querySelector('a')?.focus();}
      if(event.key==='Enter'&&event.target===siteSearch){event.preventDefault();searchResults.querySelector('a')?.click();}
    });
    searchDialog.addEventListener('click',event=>{
      if(!event.target.closest('a'))return;
      searchDialog.close();
      requestAnimationFrame(()=>{const route=location.hash.slice(1).split('/')[0];const page=sectionPages[route];const heading=page ? [...page.querySelectorAll('h1,h2,h3')].find(h=>h.getClientRects().length>0) : null;if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}});
    });
    siteSearch.addEventListener('input',drawSiteSearch);
    document.addEventListener('keydown',event=>{
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSiteSearch();}
      if(searchDialog.open&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();searchDialog.close();}
    },true);
    const activitySearch=document.getElementById('activity-search');
    activitySearch.addEventListener('input',()=>{
      const words=normalizeSearch(activitySearch.value).split(/\s+/).filter(Boolean);let count=0;
      portfolioList.querySelectorAll('[data-portfolio-item]').forEach(card=>{
        const p=portfolioProjects.find(p=>p.id===card.dataset.portfolioItem);
        const text=normalizeSearch([p.name,p.role,p.kind,...p.tags].join(' '));
        card.hidden=!words.every(word=>text.includes(word));if(!card.hidden)count++;
      });
      document.getElementById('activity-empty').hidden=count>0;
      document.getElementById('activity-search-status').textContent=count+' activities';
    });
    const neighbors=document.createElement('div');neighbors.className='activity-neighbors';
    for(const [direction,label] of [[-1,'← Previous activity'],[1,'Next activity →']]){
      const button=document.createElement('button');button.type='button';button.className='portfolio-back';button.textContent=label;
      button.addEventListener('click',()=>{const index=portfolioProjects.findIndex(p=>p.id===activePortfolioProject);const next=portfolioProjects[index+direction];if(next)selectPortfolioProject(next.id);});
      neighbors.append(button);
    }
    document.querySelector('.portfolio-detail-actions').append(neighbors);
    new MutationObserver(()=>{const index=portfolioProjects.findIndex(p=>p.id===activePortfolioProject);neighbors.children[0].disabled=index<=0;neighbors.children[1].disabled=index>=portfolioProjects.length-1;}).observe(portfolioField('title'),{childList:true});
    refreshUiRoute();
