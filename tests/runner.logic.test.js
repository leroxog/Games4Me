import { describe, it, expect } from 'vitest';
import { createPlayer, updatePlayer, jump, collidesWithObstacle, anyCollision, moveObstacles, calcSpeed, GROUND, JUMP_FORCE } from '../games/runner/logic.js';

describe('Runner – createPlayer', () => {
  it('startet auf dem Boden', () => {
    const p = createPlayer();
    expect(p.y).toBe(GROUND);
    expect(p.onGround).toBe(true);
  });
});

describe('Runner – jump', () => {
  it('springt wenn auf dem Boden', () => {
    const p = createPlayer();
    const jumped = jump(p);
    expect(jumped.vy).toBe(JUMP_FORCE);
    expect(jumped.onGround).toBe(false);
  });

  it('kein Doppelsprung möglich', () => {
    const p = { ...createPlayer(), onGround: false, vy: JUMP_FORCE };
    const result = jump(p);
    expect(result.vy).toBe(JUMP_FORCE);
  });
});

describe('Runner – updatePlayer', () => {
  it('fällt durch Gravitation', () => {
    const p = { ...createPlayer(), y: 50, vy: 0, onGround: false };
    const updated = updatePlayer(p);
    expect(updated.y).toBeGreaterThan(50);
  });

  it('landet auf dem Boden', () => {
    const p = { ...createPlayer(), y: GROUND - 1, vy: 5, onGround: false };
    const updated = updatePlayer(p);
    expect(updated.y).toBe(GROUND);
    expect(updated.onGround).toBe(true);
  });
});

describe('Runner – Kollision', () => {
  it('erkennt Kollision mit Hindernis', () => {
    const player = { x: 50, y: 100, w: 28, h: 32 };
    const obstacle = { x: 60, y: 90, w: 18, h: 40 };
    expect(collidesWithObstacle(player, obstacle)).toBe(true);
  });

  it('keine Kollision wenn Hindernis dahinter', () => {
    const player = { x: 50, y: 100, w: 28, h: 32 };
    const obstacle = { x: 200, y: 100, w: 18, h: 40 };
    expect(collidesWithObstacle(player, obstacle)).toBe(false);
  });

  it('anyCollision gibt false zurück bei leerer Liste', () => {
    expect(anyCollision(createPlayer(), [])).toBe(false);
  });
});

describe('Runner – moveObstacles', () => {
  it('verschiebt Hindernisse nach links', () => {
    const obs = [{ x: 100, w: 18, h: 30 }];
    const result = moveObstacles(obs, 5);
    expect(result[0].x).toBe(95);
  });

  it('entfernt Hindernisse die links raus sind', () => {
    const obs = [{ x: -20, w: 18, h: 30 }];
    expect(moveObstacles(obs, 0)).toHaveLength(0);
  });
});

describe('Runner – calcSpeed', () => {
  it('beginnt mit Geschwindigkeit 4', () => {
    expect(calcSpeed(0)).toBe(4);
  });
  it('erhöht Geschwindigkeit mit Score', () => {
    expect(calcSpeed(300)).toBeGreaterThan(4);
  });
});
