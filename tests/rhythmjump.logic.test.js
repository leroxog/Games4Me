import { describe, it, expect } from 'vitest';
import { createPlayer, updatePlayer, jump, collidesWithSpike, anyCollision, moveSpikes, shouldSpawn, GROUND, JUMP_FORCE, BEAT } from '../games/rhythmjump/logic.js';

describe('RhythmJump – createPlayer', () => {
  it('startet auf dem Boden', () => {
    const p = createPlayer();
    expect(p.y).toBe(GROUND);
    expect(p.onGround).toBe(true);
  });

  it('rotation startet bei 0', () => {
    expect(createPlayer().rotation).toBe(0);
  });
});

describe('RhythmJump – jump', () => {
  it('springt wenn auf dem Boden', () => {
    const p = createPlayer();
    const jumped = jump(p);
    expect(jumped.vy).toBe(JUMP_FORCE);
    expect(jumped.onGround).toBe(false);
  });

  it('kein Doppelsprung', () => {
    const p = { ...createPlayer(), onGround: false };
    const result = jump(p);
    expect(result.onGround).toBe(false);
    expect(result.vy).not.toBe(JUMP_FORCE);
  });
});

describe('RhythmJump – updatePlayer', () => {
  it('rotation ändert sich beim Springen', () => {
    const p = { ...createPlayer(), y: 50, onGround: false, vy: -5, rotation: 0 };
    const updated = updatePlayer(p);
    expect(updated.rotation).toBeGreaterThan(0);
  });

  it('rotation reset bei Landung', () => {
    const p = { ...createPlayer(), y: GROUND - 1, vy: 5, onGround: false, rotation: 1.5 };
    const updated = updatePlayer(p);
    expect(updated.rotation).toBe(0);
    expect(updated.onGround).toBe(true);
  });
});

describe('RhythmJump – Kollision', () => {
  it('erkennt Kollision mit Spike', () => {
    const player = { x: 60, y: GROUND, size: 28 };
    const spike  = { x: 72, y: GROUND - 20, w: 22, h: 28 };
    expect(collidesWithSpike(player, spike)).toBe(true);
  });

  it('keine Kollision wenn Spike weit weg', () => {
    const player = { x: 60, y: GROUND, size: 28 };
    const spike  = { x: 300, y: GROUND - 20, w: 22, h: 28 };
    expect(collidesWithSpike(player, spike)).toBe(false);
  });

  it('anyCollision gibt false bei leerer Liste', () => {
    expect(anyCollision(createPlayer(), [])).toBe(false);
  });
});

describe('RhythmJump – moveSpikes', () => {
  it('verschiebt Spikes nach links', () => {
    const spikes = [{ x: 200, w: 22, h: 28 }];
    const result = moveSpikes(spikes, 4);
    expect(result[0].x).toBe(196);
  });

  it('entfernt Spikes die raus sind', () => {
    const spikes = [{ x: -30, w: 22, h: 28 }];
    expect(moveSpikes(spikes, 0)).toHaveLength(0);
  });
});

describe('RhythmJump – shouldSpawn', () => {
  it(`spawnt auf Beat-Intervall (${BEAT})`, () => {
    expect(shouldSpawn(BEAT)).toBe(true);
    expect(shouldSpawn(BEAT * 2)).toBe(true);
  });

  it('spawnt nicht zwischen den Beats', () => {
    expect(shouldSpawn(1)).toBe(false);
    expect(shouldSpawn(BEAT - 1)).toBe(false);
  });
});
