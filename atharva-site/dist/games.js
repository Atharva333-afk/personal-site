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
    
export const gameFactories = {tetris:createTetris,snake:createSnake,pinpog:createPinPog,mines:createMinesweeper,'2048':create2048,breakout:createBreakout,memory:createMemory,connect4:createConnectFour,maze:createMazeChase,invaders:createInvaders,flappy:createFlappy};
