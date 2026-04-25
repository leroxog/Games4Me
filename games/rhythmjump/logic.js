export const GRAVITY = 0.55;
export const JUMP_FORCE = -10;
export const GROUND = 110;
export const BEAT = 60;

export function createPlayer() {
  return { x: 60, y: GROUND, size: 28, vy: 0, onGround: true, rotation: 0 };
}

export function updatePlayer(player) {
  const vy  = player.vy + GRAVITY;
  const y   = player.y + vy;
  const onGround = y >= GROUND;
  const rotation = onGround ? 0 : player.rotation + 0.12;
  return {
    ...player,
    vy: onGround ? 0 : vy,
    y:  onGround ? GROUND : y,
    onGround,
    rotation,
  };
}

export function jump(player) {
  if (!player.onGround) return player;
  return { ...player, vy: JUMP_FORCE, onGround: false };
}

export function collidesWithSpike(player, spike) {
  return (
    player.x + player.size - 6 > spike.x + 4 &&
    player.x + 6 < spike.x + spike.w - 4 &&
    player.y + player.size - 4 > spike.y + 4
  );
}

export function anyCollision(player, spikes) {
  return spikes.some(s => collidesWithSpike(player, s));
}

export function moveSpikes(spikes, speed) {
  return spikes
    .map(s => ({ ...s, x: s.x - speed }))
    .filter(s => s.x + s.w > 0);
}

export function shouldSpawn(frame) {
  return frame % BEAT === 0;
}
