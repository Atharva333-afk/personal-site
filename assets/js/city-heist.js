/*
 * City Heist '97
 *
 * An original, canvas-only top-down crime sandbox for the personal site arcade.
 * It borrows the broad language of early top-down action games, but all art,
 * map data, characters, missions, and code are original and generated here.
 */
(function () {
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const key = (x, y) => `${x},${y}`;

  window.createCityHeist = function createCityHeist() {
    const WIDTH = 880;
    const HEIGHT = 600;
    const WORLD_WIDTH = 1760;
    const WORLD_HEIGHT = 1200;
    const ROAD_WIDTH = 112;
    const verticalRoads = [160, 520, 880, 1240, 1600];
    const horizontalRoads = [150, 450, 750, 1050];
    const parks = [
      { x: 584, y: 204, w: 238, h: 183, label: 'RIVER PARK', color: '#456d4e' },
      { x: 1304, y: 804, w: 236, h: 180, label: 'SOUTH COMMON', color: '#51744b' }
    ];
    const buildingColors = ['#a96d54', '#bd8b5e', '#717c86', '#9f735e', '#7b6d84', '#aa7d4f'];
    const buildingAccents = ['#e7c79a', '#e2d1ae', '#b8d2d0', '#f0c088', '#d9bdd8', '#d4e1b3'];
    const buildings = [];

    const makeBuildings = () => {
      for (let ix = 0; ix < verticalRoads.length - 1; ix += 1) {
        for (let iy = 0; iy < horizontalRoads.length - 1; iy += 1) {
          const left = verticalRoads[ix] + ROAD_WIDTH / 2 + 18;
          const top = horizontalRoads[iy] + ROAD_WIDTH / 2 + 18;
          const right = verticalRoads[ix + 1] - ROAD_WIDTH / 2 - 18;
          const bottom = horizontalRoads[iy + 1] - ROAD_WIDTH / 2 - 18;
          const isPark = parks.some((park) => park.x > left - 20 && park.x < right + 20 && park.y > top - 20 && park.y < bottom + 20);
          if (isPark) continue;
          const split = (ix + iy) % 3 === 0;
          const gap = split ? 11 : 0;
          if (split) {
            const mid = (left + right) / 2;
            buildings.push({ x: left, y: top, w: mid - left - gap, h: bottom - top, color: buildingColors[(ix + iy) % buildingColors.length], accent: buildingAccents[(ix + iy) % buildingAccents.length], label: ['MOTEL', 'WAREHOUSE', 'ARCADE', 'OFFICES'][iy] });
            buildings.push({ x: mid + gap, y: top + 15, w: right - mid - gap, h: bottom - top - 15, color: buildingColors[(ix + iy + 2) % buildingColors.length], accent: buildingAccents[(ix + iy + 2) % buildingAccents.length], label: ['PRINTS', 'DINER', 'LAUNDROMAT', 'STORAGE'][ix] });
          } else {
            buildings.push({ x: left, y: top, w: right - left, h: bottom - top, color: buildingColors[(ix + iy) % buildingColors.length], accent: buildingAccents[(ix + iy) % buildingAccents.length], label: ['BLOCK', 'MART', 'CLUB', 'STUDIOS'][(ix + iy) % 4] });
          }
        }
      }
      buildings.push({ x: 22, y: 238, w: 91, h: 171, color: '#69727b', accent: '#b6ced1', label: 'POLICE' });
      buildings.push({ x: 22, y: 838, w: 91, h: 161, color: '#7f675e', accent: '#e0ba96', label: 'GARAGE' });
      buildings.push({ x: 1644, y: 235, w: 90, h: 174, color: '#926255', accent: '#eac18d', label: 'HOTEL' });
      buildings.push({ x: 1644, y: 840, w: 90, h: 160, color: '#536d77', accent: '#b9e0dc', label: 'DOCKS' });
    };
    makeBuildings();

    const missionSpots = {
      pickup: { x: 880, y: 150, color: '#f6c84b', label: 'PAYPHONE', icon: 'P' },
      drop: { x: 1560, y: 1050, color: '#7ee3a0', label: 'SAFEHOUSE', icon: 'S' },
      escape: { x: 160, y: 1050, color: '#9fb8ff', label: 'CHOP SHOP', icon: 'C' }
    };

    const game = {
      name: 'cityheist',
      score: 0,
      cash: 160,
      health: 100,
      wanted: 0,
      paused: false,
      over: false,
      completed: false,
      started: false,
      keys: Object.create(null),
      player: { x: 520, y: 445, angle: 0, radius: 14, invincible: 0 },
      vehicle: null,
      vehicles: [],
      pedestrians: [],
      police: [],
      bullets: [],
      pickups: [],
      camera: { x: 0, y: 0 },
      heatClock: 0,
      lastCrimeAt: 0,
      message: 'GET TO THE PAYPHONE · PRESS E TO START THE JOB',
      messageClock: 9000,
      mission: { stage: 'pickup', label: 'Answer the payphone', complete: false },
      fireClock: 0,
      policeClock: 0,
      shake: 0,
      flash: 0,
      time: 0
    };

    const makeVehicle = (x, y, angle, color, type, traffic) => ({
      x, y, angle, color, type: type || 'sedan', traffic: Boolean(traffic), speed: traffic ? 55 : 0,
      player: false, stolen: false, health: 100, turnClock: 0
    });
    game.vehicles = [
      makeVehicle(270, 150, 0, '#d55e4d', 'sedan', true),
      makeVehicle(740, 150, Math.PI, '#4e83a8', 'wagon', true),
      makeVehicle(1110, 450, Math.PI / 2, '#d9b44e', 'taxi', true),
      makeVehicle(1380, 750, -Math.PI / 2, '#8774b8', 'wagon', true),
      makeVehicle(520, 750, Math.PI, '#4eaa7d', 'sedan', true),
      makeVehicle(1480, 1050, 0, '#db6c91', 'sedan', false),
      makeVehicle(720, 450, Math.PI, '#e4e0c1', 'wagon', false),
      makeVehicle(250, 1050, Math.PI, '#6c8a99', 'taxi', false),
      makeVehicle(1280, 150, 0, '#9f5a43', 'sedan', false),
      makeVehicle(940, 750, Math.PI / 2, '#c7d5d2', 'wagon', false)
    ];

    const makePedestrian = (x, y, color, dx, dy) => ({ x, y, color, dx: dx || 0, dy: dy || 0, step: 0, alive: true, panic: 0, hitClock: 0 });
    game.pedestrians = [
      makePedestrian(360, 150, '#e0a477', 1, 0), makePedestrian(425, 150, '#7195ba', -1, 0),
      makePedestrian(650, 450, '#d67f76', 0, 1), makePedestrian(760, 450, '#e2c15e', 0, -1),
      makePedestrian(1110, 640, '#75b68e', 1, 0), makePedestrian(1170, 640, '#b48ac4', -1, 0),
      makePedestrian(1410, 1050, '#d49768', -1, 0), makePedestrian(1490, 1050, '#6da7b6', 1, 0),
      makePedestrian(590, 280, '#9c79a7', 0, 1), makePedestrian(780, 300, '#e2a864', 0, -1),
      makePedestrian(1310, 900, '#7ea27e', 1, 0), makePedestrian(1430, 900, '#c8797c', -1, 0)
    ];
    game.pickups = [
      { x: 330, y: 150, value: 30, active: true }, { x: 715, y: 450, value: 45, active: true },
      { x: 1110, y: 750, value: 35, active: true }, { x: 1470, y: 1050, value: 60, active: true },
      { x: 160, y: 750, value: 40, active: true }, { x: 1240, y: 150, value: 50, active: true }
    ];

    const roadContains = (x, y) => verticalRoads.some((road) => Math.abs(x - road) < ROAD_WIDTH / 2) || horizontalRoads.some((road) => Math.abs(y - road) < ROAD_WIDTH / 2);
    const circleRectHit = (x, y, radius, rect) => {
      const nearestX = clamp(x, rect.x, rect.x + rect.w);
      const nearestY = clamp(y, rect.y, rect.y + rect.h);
      return Math.hypot(x - nearestX, y - nearestY) < radius;
    };
    const isBlocked = (x, y, radius) => buildings.some((building) => circleRectHit(x, y, radius, building));
    const moveWithCollision = (entity, dx, dy, radius) => {
      const nextX = clamp(entity.x + dx, radius + 4, WORLD_WIDTH - radius - 4);
      const nextY = clamp(entity.y + dy, radius + 4, WORLD_HEIGHT - radius - 4);
      if (!isBlocked(nextX, entity.y, radius)) entity.x = nextX;
      if (!isBlocked(entity.x, nextY, radius)) entity.y = nextY;
    };
    const activeEntity = () => game.vehicle || game.player;
    const entityRadius = () => game.vehicle ? 21 : game.player.radius;
    const setMessage = (message, duration) => {
      game.message = message;
      game.messageClock = duration || 3400;
    };
    const addScore = (points, cash) => {
      game.score += points;
      game.cash += cash || 0;
    };
    const wantedUp = (amount, reason) => {
      game.wanted = clamp(Math.max(game.wanted, game.wanted + amount), 0, 5);
      game.heatClock = 0;
      game.lastCrimeAt = game.time;
      game.flash = 170;
      if (reason) setMessage(`${reason} · HEAT ${game.wanted}`, 2400);
    };
    const targetPosition = () => activeEntity();
    const missionSpot = () => game.mission.stage === 'pickup' ? missionSpots.pickup : game.mission.stage === 'deliver' ? missionSpots.drop : game.mission.stage === 'escape' ? missionSpots.escape : null;
    const nearestVehicle = () => {
      let closest = null;
      let closestDistance = 64;
      game.vehicles.forEach((vehicle) => {
        if (vehicle.player || vehicle.health <= 0) return;
        const d = distance(game.player, vehicle);
        if (d < closestDistance) { closest = vehicle; closestDistance = d; }
      });
      return closest;
    };

    const enterVehicle = () => {
      if (game.over || game.paused) return;
      if (game.vehicle) {
        const vehicle = game.vehicle;
        const exitX = vehicle.x + Math.cos(vehicle.angle + Math.PI / 2) * 32;
        const exitY = vehicle.y + Math.sin(vehicle.angle + Math.PI / 2) * 32;
        if (!isBlocked(exitX, exitY, game.player.radius)) {
          game.player.x = exitX;
          game.player.y = exitY;
          game.player.angle = vehicle.angle;
          vehicle.player = false;
          game.vehicle = null;
          setMessage('ON FOOT · E TO TAKE A CAR', 2400);
        }
        return;
      }
      const vehicle = nearestVehicle();
      if (!vehicle) {
        setMessage('MOVE CLOSER TO A CAR', 1700);
        return;
      }
      game.vehicle = vehicle;
      vehicle.player = true;
      vehicle.traffic = false;
      if (!vehicle.stolen) {
        vehicle.stolen = true;
        wantedUp(1, 'CAR STOLEN');
      } else {
        setMessage('BACK IN THE DRIVER\'S SEAT', 1900);
      }
      game.started = true;
    };

    const interact = () => {
      if (game.over || game.paused) return;
      const entity = activeEntity();
      const spot = missionSpot();
      if (spot && distance(entity, spot) < 58) {
        if (game.mission.stage === 'pickup') {
          game.mission.stage = 'deliver';
          game.mission.label = 'Deliver the package to the safehouse';
          addScore(100, 80);
          setMessage('PACKAGE LIFTED · NOW GET IT TO THE SAFEHOUSE', 4400);
          game.flash = 260;
          return;
        }
        if (game.mission.stage === 'deliver') {
          game.mission.stage = 'escape';
          game.mission.label = 'Lose the heat, then reach the chop shop';
          addScore(250, 220);
          wantedUp(2, 'THE DROP WENT LOUD');
          setMessage('THE DROP WENT LOUD · LOSE THE COPS', 4200);
          return;
        }
        if (game.mission.stage === 'escape') {
          if (game.wanted > 0) {
            setMessage('LOSE THE HEAT FIRST · THE GARAGE IS HOT', 2900);
          } else {
            game.mission.stage = 'complete';
            game.mission.complete = true;
            game.mission.label = 'Job complete · free roam';
            game.completed = true;
            addScore(700, 900);
            setMessage('JOB COMPLETE · +$900 · FREE ROAM UNLOCKED', 5200);
            game.flash = 500;
          }
          return;
        }
      }
      enterVehicle();
    };

    const fire = (angle) => {
      if (game.over || game.paused || game.fireClock > 0) return;
      const entity = activeEntity();
      const direction = Number.isFinite(angle) ? angle : entity.angle || 0;
      game.bullets.push({ x: entity.x + Math.cos(direction) * 24, y: entity.y + Math.sin(direction) * 24, vx: Math.cos(direction) * 470, vy: Math.sin(direction) * 470, life: 760 });
      game.fireClock = game.vehicle ? 175 : 230;
      game.player.angle = direction;
      wantedUp(1, 'GUNSHOT');
      game.shake = 3;
    };

    game.setKey = (action, pressed) => {
      game.keys[action] = pressed;
      if (pressed) game.started = true;
    };
    game.action = (action) => {
      if (action === 'drop' || action === 'fire') fire();
      if (action === 'interact') interact();
      if (action === 'left' || action === 'right' || action === 'up' || action === 'down') game.setKey(action, true);
    };
    game.tap = (canvasX, canvasY) => {
      const worldX = canvasX + game.camera.x;
      const worldY = canvasY + game.camera.y;
      const target = { x: worldX, y: worldY };
      const vehicle = game.vehicle;
      if (!vehicle && nearestVehicle() && distance(game.player, nearestVehicle()) < 66 && distance(nearestVehicle(), target) < 85) {
        enterVehicle();
        return;
      }
      const spot = missionSpot();
      if (spot && distance(target, spot) < 82 && distance(activeEntity(), spot) < 86) {
        interact();
        return;
      }
      fire(Math.atan2(worldY - activeEntity().y, worldX - activeEntity().x));
    };

    const spawnPolice = () => {
      if (game.police.length >= Math.max(1, Math.min(5, game.wanted + 1))) return;
      const target = activeEntity();
      const spawnPoints = [
        { x: clamp(target.x + 420, 80, WORLD_WIDTH - 80), y: clamp(target.y - 360, 80, WORLD_HEIGHT - 80) },
        { x: clamp(target.x - 420, 80, WORLD_WIDTH - 80), y: clamp(target.y + 310, 80, WORLD_HEIGHT - 80) },
        { x: clamp(target.x + 280, 80, WORLD_WIDTH - 80), y: clamp(target.y + 360, 80, WORLD_HEIGHT - 80) },
        { x: clamp(target.x - 280, 80, WORLD_WIDTH - 80), y: clamp(target.y - 360, 80, WORLD_HEIGHT - 80) }
      ];
      const point = spawnPoints[game.police.length % spawnPoints.length];
      game.police.push({ x: point.x, y: point.y, angle: 0, speed: 92 + game.wanted * 12, health: 100, hitClock: 0, siren: 0 });
    };

    const updateTraffic = (seconds) => {
      game.vehicles.forEach((vehicle) => {
        if (!vehicle.traffic || vehicle.player || vehicle.health <= 0) return;
        vehicle.turnClock += seconds;
        vehicle.x += Math.cos(vehicle.angle) * vehicle.speed * seconds;
        vehicle.y += Math.sin(vehicle.angle) * vehicle.speed * seconds;
        if (vehicle.x < 25 || vehicle.x > WORLD_WIDTH - 25 || vehicle.y < 25 || vehicle.y > WORLD_HEIGHT - 25 || !roadContains(vehicle.x, vehicle.y)) {
          vehicle.angle += Math.PI / 2;
          vehicle.x = clamp(vehicle.x, 25, WORLD_WIDTH - 25);
          vehicle.y = clamp(vehicle.y, 25, WORLD_HEIGHT - 25);
        }
        if (vehicle.turnClock > 5.5 && (Math.abs(Math.cos(vehicle.angle)) > .7 ? horizontalRoads : verticalRoads).some((road) => Math.abs((Math.abs(Math.cos(vehicle.angle)) > .7 ? vehicle.y : vehicle.x) - road) < 8)) {
          vehicle.turnClock = 0;
          if (Math.random() < .28) vehicle.angle += Math.PI / 2;
        }
      });
    };

    const updatePedestrians = (seconds) => {
      game.pedestrians.forEach((pedestrian) => {
        if (!pedestrian.alive) return;
        pedestrian.hitClock = Math.max(0, pedestrian.hitClock - seconds);
        pedestrian.panic = Math.max(0, pedestrian.panic - seconds);
        if (pedestrian.panic > 0) {
          const away = Math.atan2(pedestrian.y - activeEntity().y, pedestrian.x - activeEntity().x);
          pedestrian.x += Math.cos(away) * 70 * seconds;
          pedestrian.y += Math.sin(away) * 70 * seconds;
        } else {
          pedestrian.x += pedestrian.dx * 16 * seconds;
          pedestrian.y += pedestrian.dy * 16 * seconds;
        }
        if (pedestrian.x < 125 || pedestrian.x > WORLD_WIDTH - 125) pedestrian.dx *= -1;
        if (pedestrian.y < 105 || pedestrian.y > WORLD_HEIGHT - 105) pedestrian.dy *= -1;
      });
    };

    const updatePlayer = (seconds) => {
      const left = game.keys.left ? 1 : 0;
      const right = game.keys.right ? 1 : 0;
      const up = game.keys.up ? 1 : 0;
      const down = game.keys.down ? 1 : 0;
      if (game.vehicle) {
        const vehicle = game.vehicle;
        const steer = right - left;
        if (up) vehicle.speed = clamp(vehicle.speed + 230 * seconds, -95, 300);
        else if (down) vehicle.speed = clamp(vehicle.speed - 260 * seconds, -115, 300);
        else vehicle.speed *= Math.pow(.12, seconds);
        vehicle.angle += steer * (1.1 + Math.min(1.2, Math.abs(vehicle.speed) / 180)) * seconds * (vehicle.speed >= 0 ? 1 : -1);
        const oldX = vehicle.x;
        const oldY = vehicle.y;
        moveWithCollision(vehicle, Math.cos(vehicle.angle) * vehicle.speed * seconds, Math.sin(vehicle.angle) * vehicle.speed * seconds, 21);
        if (Math.abs(vehicle.x - oldX) < .1 && Math.abs(vehicle.y - oldY) < .1 && Math.abs(vehicle.speed) > 80) {
          vehicle.speed *= -.35;
          game.shake = 7;
          setMessage('CRUNCH · WATCH THE BUILDINGS', 1100);
        }
        game.player.x = vehicle.x;
        game.player.y = vehicle.y;
        game.player.angle = vehicle.angle;
        if (Math.abs(vehicle.speed) > 100) {
          game.pedestrians.forEach((pedestrian) => {
            if (!pedestrian.alive || pedestrian.hitClock > 0 || distance(vehicle, pedestrian) > 27) return;
            pedestrian.alive = false;
            pedestrian.hitClock = 1.4;
            addScore(75, 25);
            wantedUp(1, 'CIVILIAN HIT');
          });
        }
      } else {
        const length = Math.hypot(right - left, down - up) || 1;
        if (length > 1 || right || left || up || down) {
          const dx = (right - left) / length;
          const dy = (down - up) / length;
          game.player.angle = Math.atan2(dy, dx);
          moveWithCollision(game.player, dx * 145 * seconds, dy * 145 * seconds, game.player.radius);
        }
      }
      game.player.invincible = Math.max(0, game.player.invincible - seconds);
    };

    const updateBullets = (seconds) => {
      game.bullets.forEach((bullet) => {
        bullet.x += bullet.vx * seconds;
        bullet.y += bullet.vy * seconds;
        bullet.life -= seconds * 1000;
        if (isBlocked(bullet.x, bullet.y, 2)) bullet.life = 0;
        game.pedestrians.forEach((pedestrian) => {
          if (!pedestrian.alive || bullet.life <= 0 || distance(bullet, pedestrian) > 16) return;
          pedestrian.alive = false;
          pedestrian.panic = 0;
          bullet.life = 0;
          addScore(90, 30);
          wantedUp(1, 'CIVILIAN DOWN');
        });
        game.police.forEach((officer) => {
          if (bullet.life <= 0 || distance(bullet, officer) > 20) return;
          officer.health -= 55;
          bullet.life = 0;
          wantedUp(1);
          if (officer.health <= 0) {
            addScore(180, 100);
            setMessage('COP CAR DISABLED · KEEP MOVING', 1900);
          }
        });
      });
      game.bullets = game.bullets.filter((bullet) => bullet.life > 0 && bullet.x > 0 && bullet.x < WORLD_WIDTH && bullet.y > 0 && bullet.y < WORLD_HEIGHT);
      game.fireClock = Math.max(0, game.fireClock - seconds * 1000);
    };

    const updatePolice = (seconds) => {
      if (game.wanted > 0) {
        game.policeClock += seconds;
        if (game.policeClock > .8) { game.policeClock = 0; spawnPolice(); }
      } else {
        game.police = [];
      }
      const target = activeEntity();
      game.police.forEach((officer) => {
        if (officer.health <= 0) return;
        officer.siren += seconds;
        const angle = Math.atan2(target.y - officer.y, target.x - officer.x);
        officer.angle = angle;
        const speed = officer.speed + Math.sin(officer.siren * 8) * 7;
        moveWithCollision(officer, Math.cos(angle) * speed * seconds, Math.sin(angle) * speed * seconds, 18);
        officer.hitClock = Math.max(0, officer.hitClock - seconds);
        if (distance(officer, target) < (game.vehicle ? 42 : 29) && officer.hitClock <= 0 && game.player.invincible <= 0) {
          game.health = clamp(game.health - (game.vehicle ? 8 : 18), 0, 100);
          game.player.invincible = 1.05;
          game.shake = 10;
          officer.hitClock = 1.15;
          setMessage(game.vehicle ? 'POLICE RAM · KEEP DRIVING' : 'THE COPS ARE ON YOU', 1200);
          if (!game.health) game.over = true;
        }
      });
      game.police = game.police.filter((officer) => officer.health > 0);
    };

    const updatePickups = () => {
      const entity = activeEntity();
      game.pickups.forEach((pickup) => {
        if (!pickup.active || distance(pickup, entity) > 25) return;
        pickup.active = false;
        addScore(pickup.value, pickup.value);
        setMessage(`CASH FOUND · +$${pickup.value}`, 1700);
      });
    };

    const updateHeat = (seconds) => {
      game.heatClock += seconds;
      const policeNear = game.police.some((officer) => distance(officer, activeEntity()) < 290);
      if (game.wanted > 0 && !policeNear && game.time - game.lastCrimeAt > 5.5 && game.heatClock > 5.5) {
        game.wanted -= 1;
        game.heatClock = 0;
        setMessage(game.wanted ? `HEAT COOLING · ${game.wanted} STAR${game.wanted === 1 ? '' : 'S'} LEFT` : 'HEAT LOST · GET TO THE GARAGE', 2500);
      }
    };

    game.update = (dt) => {
      if (game.paused || game.over) return;
      const seconds = Math.min(0.05, Math.max(0, dt / 1000));
      game.time += seconds;
      game.messageClock = Math.max(0, game.messageClock - dt);
      game.flash = Math.max(0, game.flash - dt);
      game.shake = Math.max(0, game.shake - dt * .035);
      updatePlayer(seconds);
      updateTraffic(seconds);
      updatePedestrians(seconds);
      updateBullets(seconds);
      updatePolice(seconds);
      updatePickups();
      updateHeat(seconds);
      game.mission.label = game.mission.stage === 'pickup' ? 'Answer the payphone' : game.mission.stage === 'deliver' ? 'Deliver the package to the safehouse' : game.mission.stage === 'escape' ? 'Lose the heat, then reach the chop shop' : 'Job complete · free roam';
    };

    const drawRoads = (ctx) => {
      ctx.fillStyle = '#2f554b';
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      ctx.fillStyle = '#355d54';
      ctx.fillRect(0, 0, WORLD_WIDTH, 52);
      ctx.fillStyle = '#28443f';
      verticalRoads.forEach((road) => ctx.fillRect(road - ROAD_WIDTH / 2, 0, ROAD_WIDTH, WORLD_HEIGHT));
      horizontalRoads.forEach((road) => ctx.fillRect(0, road - ROAD_WIDTH / 2, WORLD_WIDTH, ROAD_WIDTH));
      ctx.strokeStyle = 'rgba(213,198,133,.48)';
      ctx.lineWidth = 3;
      ctx.setLineDash([22, 21]);
      verticalRoads.forEach((road) => { ctx.beginPath(); ctx.moveTo(road, 0); ctx.lineTo(road, WORLD_HEIGHT); ctx.stroke(); });
      horizontalRoads.forEach((road) => { ctx.beginPath(); ctx.moveTo(0, road); ctx.lineTo(WORLD_WIDTH, road); ctx.stroke(); });
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(230,213,158,.65)';
      verticalRoads.forEach((road) => horizontalRoads.forEach((cross) => {
        for (let stripe = -2; stripe <= 2; stripe += 1) {
          ctx.fillRect(road - ROAD_WIDTH / 2 + 15 + stripe * 14, cross - ROAD_WIDTH / 2 + 7, 8, 22);
          ctx.fillRect(road - ROAD_WIDTH / 2 + 15 + stripe * 14, cross + ROAD_WIDTH / 2 - 29, 8, 22);
          ctx.fillRect(road - ROAD_WIDTH / 2 + 7, cross - ROAD_WIDTH / 2 + 15 + stripe * 14, 22, 8);
          ctx.fillRect(road + ROAD_WIDTH / 2 - 29, cross - ROAD_WIDTH / 2 + 15 + stripe * 14, 22, 8);
        }
      }));
      ctx.fillStyle = '#447268';
      ctx.fillRect(0, 1125, WORLD_WIDTH, 75);
      ctx.fillStyle = '#2a5149';
      for (let x = 0; x < WORLD_WIDTH; x += 42) ctx.fillRect(x, 1138 + (x % 3) * 3, 24, 4);
    };

    const drawParks = (ctx) => {
      parks.forEach((park) => {
        ctx.fillStyle = park.color;
        ctx.fillRect(park.x, park.y, park.w, park.h);
        ctx.strokeStyle = '#7ca064';
        ctx.lineWidth = 5;
        ctx.strokeRect(park.x + 8, park.y + 8, park.w - 16, park.h - 16);
        ctx.fillStyle = '#a3bd75';
        for (let x = park.x + 22; x < park.x + park.w - 18; x += 47) {
          for (let y = park.y + 24; y < park.y + park.h - 16; y += 47) {
            ctx.fillRect(x, y, 7, 7);
            ctx.fillRect(x - 3, y + 7, 13, 4);
          }
        }
        ctx.fillStyle = 'rgba(15,45,38,.7)';
        ctx.font = '700 11px monospace';
        ctx.fillText(park.label, park.x + 16, park.y + park.h - 16);
      });
    };

    const drawBuildings = (ctx) => {
      buildings.forEach((building) => {
        ctx.fillStyle = 'rgba(8,22,24,.3)';
        ctx.fillRect(building.x + 8, building.y + 9, building.w, building.h);
        ctx.fillStyle = building.color;
        ctx.fillRect(building.x, building.y, building.w, building.h);
        ctx.fillStyle = building.accent;
        ctx.fillRect(building.x + 9, building.y + 9, building.w - 18, 9);
        ctx.fillStyle = 'rgba(24,37,43,.32)';
        ctx.fillRect(building.x + 10, building.y + 29, building.w - 20, 3);
        const columns = Math.max(2, Math.floor(building.w / 39));
        const rows = Math.max(2, Math.floor(building.h / 44));
        for (let row = 0; row < rows; row += 1) {
          for (let column = 0; column < columns; column += 1) {
            ctx.fillStyle = row % 3 === 1 ? '#c3d8c9' : '#5b7180';
            ctx.fillRect(building.x + 16 + column * ((building.w - 26) / columns), building.y + 48 + row * 39, 13, 12);
          }
        }
        ctx.fillStyle = '#20343a';
        ctx.font = '700 9px monospace';
        ctx.fillText(building.label, building.x + 12, building.y + building.h - 12);
      });
    };

    const drawMissionMarker = (ctx) => {
      const spot = missionSpot();
      if (!spot) return;
      const pulse = 14 + Math.sin(game.time * 4) * 4;
      ctx.strokeStyle = spot.color;
      ctx.lineWidth = 4;
      ctx.globalAlpha = .48;
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, pulse + 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = spot.color;
      ctx.fillRect(spot.x - 14, spot.y - 14, 28, 28);
      ctx.fillStyle = '#172524';
      ctx.font = '900 15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(spot.icon, spot.x, spot.y + 5);
      ctx.font = '700 10px monospace';
      ctx.fillText(spot.label, spot.x, spot.y - 23);
      ctx.textAlign = 'left';
    };

    const drawVehicle = (ctx, vehicle) => {
      ctx.save();
      ctx.translate(vehicle.x, vehicle.y);
      ctx.rotate(vehicle.angle);
      const police = vehicle.isPolice;
      const length = police ? 47 : vehicle.type === 'taxi' ? 51 : 46;
      const height = police ? 24 : 23;
      ctx.fillStyle = 'rgba(6,18,20,.45)';
      ctx.fillRect(-length / 2 + 5, -height / 2 + 5, length, height);
      ctx.fillStyle = police ? '#e7e9e5' : vehicle.color;
      ctx.fillRect(-length / 2, -height / 2, length, height);
      ctx.fillStyle = police ? '#265193' : '#283c43';
      ctx.fillRect(-12, -height / 2 + 4, 24, height - 8);
      ctx.fillStyle = '#a8d7d0';
      ctx.fillRect(-9, -height / 2 + 6, 8, height - 12);
      ctx.fillRect(2, -height / 2 + 6, 8, height - 12);
      ctx.fillStyle = '#f4dc88';
      ctx.fillRect(length / 2 - 4, -height / 2 + 4, 4, 6);
      ctx.fillStyle = '#d55c5e';
      ctx.fillRect(length / 2 - 4, height / 2 - 10, 4, 6);
      if (police) {
        ctx.fillStyle = Math.sin(vehicle.siren * 12) > 0 ? '#e76e6e' : '#74b9ec';
        ctx.fillRect(-6, -height / 2 - 5, 12, 5);
      }
      if (vehicle.stolen && !police) {
        ctx.fillStyle = '#f7df8a';
        ctx.fillRect(-length / 2 + 7, -height / 2 - 4, 4, 4);
      }
      ctx.restore();
    };

    const drawCharacter = (ctx, character, isPlayer) => {
      if (isPlayer && game.player.invincible > 0 && Math.floor(game.player.invincible * 14) % 2) return;
      ctx.save();
      ctx.translate(character.x, character.y);
      ctx.rotate(character.angle || 0);
      ctx.fillStyle = 'rgba(8,18,20,.38)';
      ctx.fillRect(-10, 9, 20, 7);
      ctx.fillStyle = isPlayer ? '#f2ba70' : character.color;
      ctx.fillRect(-9, -7, 18, 23);
      ctx.fillStyle = isPlayer ? '#3e5e9b' : '#e3be8c';
      ctx.fillRect(-7, -14, 14, 10);
      ctx.fillStyle = isPlayer ? '#f0d7a7' : '#2d3840';
      ctx.fillRect(-5, -11, 3, 3);
      ctx.fillRect(3, -11, 3, 3);
      if (isPlayer) {
        ctx.fillStyle = '#252c32';
        ctx.fillRect(7, -2, 13, 5);
      }
      ctx.restore();
    };

    const drawPickup = (ctx, pickup) => {
      if (!pickup.active) return;
      const bob = Math.sin(game.time * 5 + pickup.x) * 3;
      ctx.fillStyle = '#f4d16b';
      ctx.fillRect(pickup.x - 8, pickup.y - 8 + bob, 16, 16);
      ctx.fillStyle = '#936f3e';
      ctx.fillRect(pickup.x - 3, pickup.y - 3 + bob, 6, 6);
      ctx.strokeStyle = '#fff0a5';
      ctx.strokeRect(pickup.x - 11, pickup.y - 11 + bob, 22, 22);
    };

    const drawMinimap = (ctx) => {
      const x = WIDTH - 148;
      const y = 62;
      const w = 132;
      const h = 90;
      ctx.fillStyle = 'rgba(7,17,22,.9)';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#8aa79b';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = '#33554c';
      ctx.fillRect(x + 5, y + 5, w - 10, h - 10);
      ctx.fillStyle = '#253e3b';
      verticalRoads.forEach((road) => ctx.fillRect(x + (road / WORLD_WIDTH) * w - 3, y + 5, 6, h - 10));
      horizontalRoads.forEach((road) => ctx.fillRect(x + 5, y + (road / WORLD_HEIGHT) * h - 3, w - 10, 6));
      const target = activeEntity();
      ctx.fillStyle = '#eff0c8';
      ctx.fillRect(x + (target.x / WORLD_WIDTH) * w - 2, y + (target.y / WORLD_HEIGHT) * h - 2, 5, 5);
      game.police.forEach((officer) => {
        ctx.fillStyle = '#f07070';
        ctx.fillRect(x + (officer.x / WORLD_WIDTH) * w - 2, y + (officer.y / WORLD_HEIGHT) * h - 2, 4, 4);
      });
      const spot = missionSpot();
      if (spot) {
        ctx.fillStyle = spot.color;
        ctx.fillRect(x + (spot.x / WORLD_WIDTH) * w - 2, y + (spot.y / WORLD_HEIGHT) * h - 2, 5, 5);
      }
      ctx.fillStyle = '#b4c7ba';
      ctx.font = '700 9px monospace';
      ctx.fillText('CITY MAP', x + 8, y + h - 8);
    };

    const drawHud = (ctx) => {
      ctx.fillStyle = 'rgba(7,17,22,.92)';
      ctx.fillRect(0, 0, WIDTH, 52);
      ctx.fillStyle = '#f3d274';
      ctx.font = '900 18px monospace';
      ctx.fillText("CITY HEIST '97", 17, 22);
      ctx.fillStyle = '#b5c6bd';
      ctx.font = '700 10px monospace';
      ctx.fillText(game.vehicle ? 'IN VEHICLE' : 'ON FOOT', 18, 39);
      ctx.fillStyle = '#f3d274';
      ctx.font = '900 16px monospace';
      ctx.fillText(`$${String(game.cash).padStart(4, '0')}`, 183, 24);
      ctx.fillStyle = '#91aca0';
      ctx.font = '700 10px monospace';
      ctx.fillText('CASH', 184, 39);
      ctx.fillStyle = '#b5c6bd';
      ctx.fillText('HEALTH', 287, 18);
      ctx.fillStyle = '#263a3d';
      ctx.fillRect(287, 25, 112, 10);
      ctx.fillStyle = game.health > 35 ? '#70d39a' : '#ec8d66';
      ctx.fillRect(287, 25, 112 * (game.health / 100), 10);
      ctx.strokeStyle = '#91aca0';
      ctx.strokeRect(287, 25, 112, 10);
      ctx.fillStyle = '#b5c6bd';
      ctx.font = '700 10px monospace';
      ctx.fillText('HEAT', 426, 18);
      ctx.font = '900 19px monospace';
      ctx.fillStyle = game.wanted ? '#f4cf68' : '#40585a';
      ctx.fillText('★'.repeat(game.wanted) + '☆'.repeat(5 - game.wanted), 426, 38);
      ctx.fillStyle = '#b5c6bd';
      ctx.font = '700 10px monospace';
      ctx.fillText('WEAPON', 610, 18);
      ctx.fillStyle = '#f1e3b1';
      ctx.font = '900 15px monospace';
      ctx.fillText('9MM', 610, 38);
      ctx.fillStyle = '#b5c6bd';
      ctx.fillText('SCORE', 712, 18);
      ctx.fillStyle = '#f3d274';
      ctx.font = '900 15px monospace';
      ctx.fillText(String(game.score).padStart(5, '0'), 712, 38);
      drawMinimap(ctx);
      ctx.fillStyle = 'rgba(7,17,22,.92)';
      ctx.fillRect(14, HEIGHT - 61, WIDTH - 28, 45);
      ctx.fillStyle = '#f3d274';
      ctx.font = '700 10px monospace';
      ctx.fillText('JOB', 26, HEIGHT - 43);
      ctx.fillStyle = '#eef0d9';
      ctx.font = '700 14px monospace';
      ctx.fillText(game.mission.label.toUpperCase(), 26, HEIGHT - 23);
      ctx.fillStyle = '#9db6a7';
      ctx.font = '700 10px monospace';
      ctx.fillText('WASD / ARROWS MOVE  ·  E ENTER / INTERACT  ·  SPACE FIRE  ·  P PAUSE', 470, HEIGHT - 34);
      if (game.messageClock > 0) {
        const width = Math.min(630, Math.max(270, game.message.length * 8.4 + 34));
        ctx.fillStyle = 'rgba(242,210,116,.96)';
        ctx.fillRect((WIDTH - width) / 2, HEIGHT - 112, width, 29);
        ctx.fillStyle = '#1b2829';
        ctx.font = '900 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(game.message, WIDTH / 2, HEIGHT - 93);
        ctx.textAlign = 'left';
      }
    };

    const drawOverlay = (ctx, title, caption) => {
      ctx.fillStyle = 'rgba(5,12,17,.76)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f3d274';
      ctx.font = '900 38px monospace';
      ctx.fillText(title, WIDTH / 2, HEIGHT / 2 - 14);
      ctx.fillStyle = '#e8f0d9';
      ctx.font = '700 14px monospace';
      ctx.fillText(caption, WIDTH / 2, HEIGHT / 2 + 24);
      ctx.textAlign = 'left';
    };

    game.draw = (ctx) => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      const target = activeEntity();
      const desiredX = clamp(target.x - WIDTH / 2, 0, WORLD_WIDTH - WIDTH);
      const desiredY = clamp(target.y - HEIGHT / 2, 0, WORLD_HEIGHT - HEIGHT);
      game.camera.x += (desiredX - game.camera.x) * .13;
      game.camera.y += (desiredY - game.camera.y) * .13;
      const shakeX = game.shake ? (Math.random() - .5) * game.shake : 0;
      const shakeY = game.shake ? (Math.random() - .5) * game.shake : 0;
      ctx.save();
      ctx.translate(-Math.round(game.camera.x) + shakeX, -Math.round(game.camera.y) + shakeY);
      drawRoads(ctx);
      drawParks(ctx);
      drawBuildings(ctx);
      drawMissionMarker(ctx);
      game.pickups.forEach((pickup) => drawPickup(ctx, pickup));
      game.vehicles.forEach((vehicle) => { if (vehicle.health > 0 && !vehicle.player) drawVehicle(ctx, vehicle); });
      game.police.forEach((officer) => { officer.isPolice = true; drawVehicle(ctx, officer); });
      game.pedestrians.forEach((pedestrian) => { if (pedestrian.alive) drawCharacter(ctx, pedestrian, false); });
      game.bullets.forEach((bullet) => {
        ctx.fillStyle = '#f5e19a';
        ctx.fillRect(bullet.x - 3, bullet.y - 3, 6, 6);
      });
      if (!game.vehicle) drawCharacter(ctx, game.player, true);
      if (game.vehicle && game.vehicle.health > 0) drawVehicle(ctx, game.vehicle);
      ctx.restore();
      drawHud(ctx);
      if (game.flash > 0) {
        ctx.fillStyle = `rgba(245,215,120,${Math.min(.16, game.flash / 1700)})`;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      }
      if (game.paused) drawOverlay(ctx, 'PAUSED', 'PRESS P OR RESUME');
      if (game.over) drawOverlay(ctx, 'BUSTED', 'RESTART THE JOB AND TRY A CLEANER GETAWAY');
    };

    return game;
  };
})();
