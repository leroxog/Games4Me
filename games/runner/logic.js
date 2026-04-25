export const GRAVITY = 0.55;
export const JUMP_FORCE = -11;
export const GROUND = 120;

export function createPlayer() {
  return { x: 50, y: GROUND, w: 28, h: 32, vy: 0, onGround: true };
}

export function updatePlayer(player) {
  const vy  = player.vy + GRAVITY;
  const y   = player.y + vy;
  const onGround = y >= GROUND;
  return {
    ...player,
    vy: onGround ? 0 : vy,
    y:  onGround ? GROUND : y,
    onGround,
  };
}

export function jump(player) {
  if (!player.onGround) return player;
  return { ...player, vy: JUMP_FORCE, onGround: false };
}

export function collidesWithObstacle(player, obstacle) {
  return (
    player.x + player.w - 4 > obstacle.x + 4 &&
    player.x + 4 < obstacle.x + obstacle.w - 4 &&
    player.y + player.h - 4 > obstacle.y + 4
  );
}

export function anyCollision(player, obstacles) {
  return obstacles.some(o => collidesWithObstacle(player, o));
}

export function moveObstacles(obstacles, speed) {
  return obstacles
    .map(o => ({ ...o, x: o.x - speed }))
    .filter(o => o.x + o.w > 0);
}

export function calcSpeed(score) {
  return 4 + Math.floor(score / 300) * 0.5;
}
