const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function download(url, name) {
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name;
  document.body.append(anchor); anchor.click(); anchor.remove();
}
function downloadCanvas(canvas, name, toast) {
  canvas.toBlob(blob => {
    if (!blob) { toast('The image could not be downloaded. Please try again.'); return; }
    const url = URL.createObjectURL(blob); download(url, name); setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, 'image/png');
}

// Pointer coordinates follow the actual canvas dimensions at every screen size.
function drawingSurface(canvas, {color = '#252b26', size = 7, onChange = () => {}} = {}) {
  const controller = new AbortController();
  const ctx = canvas.getContext('2d', {willReadFrequently:true});
  let ink = color, brush = size, drawing = false, previous, dirty = false;
  let pointerPosition = {x:canvas.width/2,y:canvas.height/2};
  const history = [];
  const fill = () => { ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height); };
  fill();
  const snapshot = () => { if(history.length>=12)history.shift();history.push({pixels:ctx.getImageData(0,0,canvas.width,canvas.height),dirty}); };
  const point = event => {const r=canvas.getBoundingClientRect();return {x:(event.clientX-r.left)*canvas.width/r.width,y:(event.clientY-r.top)*canvas.height/r.height};};
  const mark = (from,to) => {ctx.beginPath();ctx.lineWidth=brush;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=ink;ctx.moveTo(from.x,from.y);ctx.lineTo(to.x+.01,to.y+.01);ctx.stroke();dirty=true;onChange();};
  canvas.addEventListener('pointerdown',event=>{if(event.button!==0&&event.pointerType==='mouse')return;event.preventDefault();snapshot();drawing=true;previous=point(event);pointerPosition=previous;canvas.setPointerCapture(event.pointerId);canvas.focus({preventScroll:true});mark(previous,previous);},{signal:controller.signal});
  canvas.addEventListener('pointermove',event=>{if(!drawing)return;const next=point(event);mark(previous,next);previous=next;pointerPosition=next;},{signal:controller.signal});
  const stop=()=>{drawing=false;};
  canvas.addEventListener('pointerup',stop,{signal:controller.signal});
  canvas.addEventListener('pointercancel',stop,{signal:controller.signal});
  canvas.addEventListener('lostpointercapture',stop,{signal:controller.signal});
  canvas.addEventListener('keydown',event=>{
    const offsets={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]};
    if(offsets[event.key]){event.preventDefault();pointerPosition.x=Math.max(0,Math.min(canvas.width,pointerPosition.x+offsets[event.key][0]));pointerPosition.y=Math.max(0,Math.min(canvas.height,pointerPosition.y+offsets[event.key][1]));if(event.shiftKey){snapshot();mark(previous||pointerPosition,pointerPosition);}previous={...pointerPosition};}
    if(event.code==='Space'){event.preventDefault();snapshot();mark(pointerPosition,pointerPosition);}
  },{signal:controller.signal});
  return {setColor:value=>{ink=value;},setSize:value=>{brush=value;},clear:()=>{snapshot();fill();dirty=false;onChange();},undo:()=>{const last=history.pop();if(last){ctx.putImageData(last.pixels,0,0);dirty=last.dirty;onChange();}},isDirty:()=>dirty,dispose:()=>controller.abort()};
}
export function mountDrawing(root, toast) {
  const canvas = $('#drawing-canvas',root);
  if(matchMedia('(max-width:600px)').matches){canvas.width=900;canvas.height=900;}
  const status=$('[data-draw-status]',root);
  const drawing=drawingSurface(canvas,{onChange:()=>{status.textContent='Your canvas, your call.';}});
  const controller=new AbortController();const signal=controller.signal;
  $$('[data-draw-color]',root).forEach(button=>button.addEventListener('click',()=>{drawing.setColor(button.dataset.drawColor);$$('[data-draw-color]',root).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));status.textContent=`${button.getAttribute('aria-label')} selected.`;},{signal}));
  $('#brush-size',root).addEventListener('change',event=>drawing.setSize(Number(event.target.value)),{signal});
  $('[data-draw-undo]',root).addEventListener('click',()=>{drawing.undo();status.textContent='Last mark undone.';},{signal});
  $('[data-draw-clear]',root).addEventListener('click',()=>{drawing.clear();status.textContent='A fresh page. Undo brings your drawing back.';},{signal});
  $('[data-draw-download]',root).addEventListener('click',()=>downloadCanvas(canvas,'a-little-something.png',toast),{signal});
  return()=>{drawing.dispose();controller.abort();};
}

const photoFilters={original:'none',flash:'brightness(1.12) contrast(1.15) saturate(1.1)',warm:'sepia(.32) saturate(.88) contrast(1.04)',blue:'sepia(.18) hue-rotate(155deg) saturate(.75)',noir:'grayscale(1) contrast(1.2)',faded:'sepia(.2) saturate(.65) contrast(.8) brightness(1.1)',vhs:'saturate(1.5) contrast(1.08) hue-rotate(12deg)',pixel:'saturate(.8) contrast(1.12)'};
export function mountCamera(root,toast) {
  const controller=new AbortController();const signal=controller.signal;
  const video=$('#camera-video',root),image=$('#camera-image',root),start=$('#camera-start',root),stopButton=$('#camera-stop',root),capture=$('#camera-capture',root),status=$('#camera-status',root),placeholder=$('.camera-empty',root);
  let stream=null,filter='original',importUrl=null,source=null,alive=true,starting=false,selected=0;
  const frames=[];
  function stopCamera(){stream?.getTracks().forEach(t=>t.stop());stream=null;video.srcObject=null;video.hidden=true;stopButton.hidden=true;start.disabled=false;start.textContent='Start camera';if(source===video){source=null;capture.disabled=true;placeholder.hidden=false;} }
  const look=()=>{[video,image].forEach(el=>{el.style.filter=photoFilters[filter];el.style.imageRendering=filter==='pixel'?'pixelated':'auto';});};
  start.addEventListener('click',async()=>{
    if(starting||stream)return;starting=true;start.disabled=true;status.textContent='Waiting for camera permission…';
    try{
      if(!navigator.mediaDevices?.getUserMedia)throw new Error('unsupported');
      const cameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:1280},height:{ideal:960}},audio:false});
      if(!alive){cameraStream.getTracks().forEach(t=>t.stop());return;}
      stream=cameraStream;video.srcObject=stream;
      await video.play();if(!alive)return;
      source=video;video.hidden=false;image.hidden=true;placeholder.hidden=true;capture.disabled=false;stopButton.hidden=false;start.textContent='Camera on';
      status.textContent='Camera is on. Choose a look, then press the shutter.';
    }catch(error){
      if(!alive)return;stopCamera();
      status.textContent=error.name==='NotAllowedError'?'Camera access wasn’t allowed. You can import a photo instead.':error.name==='NotFoundError'?'No camera was found. You can import a photo instead.':'The camera couldn’t start. Try importing a photo.';
    }finally{starting=false;if(alive)start.disabled=!!stream;}
  },{signal});
  stopButton.addEventListener('click',()=>{stopCamera();status.textContent='Camera is off. Import a photo or start it again.';},{signal});
  $('#camera-file',root).addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    if(!file.type.startsWith('image/')){status.textContent='Please choose an image file.';return;}
    stopCamera();if(importUrl)URL.revokeObjectURL(importUrl);importUrl=URL.createObjectURL(file);
    image.src=importUrl;
    try{await image.decode();if(!alive)return;source=image;image.hidden=false;placeholder.hidden=true;capture.disabled=false;look();status.textContent='Photo loaded. Choose a look and press the shutter to save a frame.';}
    catch{image.hidden=true;capture.disabled=true;source=null;placeholder.hidden=false;status.textContent='That photo couldn’t be opened. Try a JPEG, PNG, or WebP image.';}
    event.target.value='';
  },{signal});
  $$('[data-camera-filter]',root).forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.cameraFilter;$$('[data-camera-filter]',root).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));look();},{signal}));
  function showFrame(index){
    selected=index;const frame=frames[index];$('#camera-shot',root).src=frame.url;$('.camera-shot',root).hidden=false;
    $$('.camera-roll button',root).forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
  }
  capture.addEventListener('click',()=>{
    if(!source)return;
    const width=source===video?video.videoWidth:image.naturalWidth,height=source===video?video.videoHeight:image.naturalHeight;if(!width||!height)return;
    const canvas=document.createElement('canvas');canvas.width=Math.min(width,1600);canvas.height=Math.round(canvas.width*height/width);
    const ctx=canvas.getContext('2d');ctx.filter=photoFilters[filter];
    if(filter==='pixel'){
      const small=document.createElement('canvas');small.width=100;small.height=Math.max(1,Math.round(100*height/width));small.getContext('2d').drawImage(source,0,0,small.width,small.height);ctx.imageSmoothingEnabled=false;ctx.drawImage(small,0,0,canvas.width,canvas.height);
    }else ctx.drawImage(source,0,0,canvas.width,canvas.height);
    canvas.toBlob(blob=>{
      if(!blob||!alive)return;
      const url=URL.createObjectURL(blob);frames.push({url,filter});
      if(frames.length>24){URL.revokeObjectURL(frames.shift().url);}
      $('.camera-roll',root).innerHTML=frames.map((frame,i)=>`<button data-frame="${i}" aria-label="View photo ${i+1}" aria-pressed="false"><img src="${frame.url}" alt="Captured photo ${i+1}" width="120" height="90"></button>`).join('');
      showFrame(frames.length-1);status.textContent=`Frame ${frames.length} captured with ${filter==='original'?'the original look':filter+' filter'}. Ready to download.`;
    },'image/png');
  },{signal});
  $('.camera-roll',root).addEventListener('click',event=>{const b=event.target.closest('[data-frame]');if(b)showFrame(Number(b.dataset.frame));},{signal});
  $('#camera-download',root).addEventListener('click',()=>{if(frames[selected])download(frames[selected].url,`atharva-camera-${String(selected+1).padStart(2,'0')}-${frames[selected].filter}.png`);},{signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&stream){stopCamera();status.textContent='Camera turned off while you were away.';}},{signal});
  return()=>{alive=false;controller.abort();stopCamera();if(importUrl)URL.revokeObjectURL(importUrl);frames.forEach(frame=>URL.revokeObjectURL(frame.url));};
}

export function mountGuestbook(root,mascot,toast) {
  const controller=new AbortController();const signal=controller.signal;
  const key='atharva-guestbook-v1',form=$('.guestbook-form',root),board=$('.guestbook-notes',root),status=$('.guestbook-status',root),canvas=$('#guest-doodle',root);
  let entries=[];
  try{const previous=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(previous))entries=previous.filter(e=>e&&typeof e.id==='string'&&typeof e.name==='string'&&typeof e.message==='string'&&typeof e.date==='string').slice(0,24);}catch{}
  const doodle=drawingSurface(canvas,{size:4});
  function renderNotes(){
    board.innerHTML=entries.length?entries.map(entry=>{
      const date=new Date(entry.date);const formatted=Number.isNaN(date.getTime())?'':date.toLocaleDateString(undefined,{month:'short',day:'numeric'});
      const image=typeof entry.doodle==='string'&&/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(entry.doodle)&&entry.doodle.length<700000?entry.doodle:null;
      return `<article class="guest-note"><button class="note-delete" data-note-delete="${escape(entry.id)}" aria-label="Delete note by ${escape(entry.name)}">×</button><span class="eyebrow">A small keepsake</span>${image?`<img src="${image}" alt="Doodle by ${escape(entry.name)}" width="250" height="125">`:''}<p class="note-message">${escape(entry.message)}</p><span class="note-author">${escape(entry.name)} · ${formatted}</span></article>`;
    }).join(''):`<div class="guestbook-empty"><img src="${mascot}" alt="The original pixel mascot" width="65" height="65"><h2>The board is open.</h2><p>Leave the first note. A few words will do.</p></div>`;
  }
  function persist(next){try{localStorage.setItem(key,JSON.stringify(next));entries=next;renderNotes();return true;}catch{status.textContent='Your browser couldn’t save the note. Try a shorter note or clear an older entry.';return false;}}
  $('[data-doodle-clear]',root).addEventListener('click',()=>doodle.clear(),{signal});
  form.addEventListener('submit',event=>{
    event.preventDefault();const name=$('#guest-name',root).value.trim() || 'A visitor',message=$('#guest-message',root).value.trim();
    if(!message){status.textContent='Add a note before pinning.';$('#guest-message',root).focus();return;}
    if(entries.length>=24){status.textContent='The board has 24 notes. Remove an older one to make room.';return;}
    const entry={id:crypto.randomUUID?.()||String(Date.now()),name:name.slice(0,35),message:message.slice(0,240),date:new Date().toISOString(),doodle:doodle.isDirty()?canvas.toDataURL('image/png'):null};
    if(persist([entry,...entries])){form.reset();doodle.clear();status.textContent='Pinned in this browser. This note hasn’t been sent or shared.';toast('A little trace, saved.');}
  },{signal});
  board.addEventListener('click',event=>{const button=event.target.closest('[data-note-delete]');if(button&&persist(entries.filter(entry=>entry.id!==button.dataset.noteDelete))){toast('Note removed from this browser.');}},{signal});
  renderNotes();return()=>{controller.abort();doodle.dispose();};
}
