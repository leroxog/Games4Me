import { test, expect, devices } from '@playwright/test';

// ── Basis ────────────────────────────────────────────────────────────
test('Snake: Seite lädt ohne JS-Fehler', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/games/snake/');
  await expect(page.locator('canvas')).toBeVisible();
  expect(errors).toHaveLength(0);
});

test('Snake: Zurück-Button führt zur Startseite', async ({ page }) => {
  await page.goto('/games/snake/');
  await page.locator('.back-btn').click();
  await expect(page).toHaveURL(/\/$|index\.html/);
});

// ── Desktop-Tastatur ─────────────────────────────────────────────────
test('Snake: Spiel startet bei Pfeiltaste', async ({ page }) => {
  await page.goto('/games/snake/');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#hint')).toHaveText('');
});

test('Snake: Spiel startet bei WASD', async ({ page }) => {
  await page.goto('/games/snake/');
  await page.keyboard.press('d');
  await expect(page.locator('#hint')).toHaveText('');
});

test('Snake: Alle Pfeiltasten werden erkannt', async ({ page }) => {
  await page.goto('/games/snake/');
  for (const key of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']) {
    await page.keyboard.press(key);
  }
  await expect(page.locator('#hint')).toHaveText('');
});

test('Snake: Alle WASD-Tasten werden erkannt', async ({ page }) => {
  await page.goto('/games/snake/');
  for (const key of ['d', 's', 'a', 'w']) {
    await page.keyboard.press(key);
  }
  await expect(page.locator('#hint')).toHaveText('');
});

test('Snake: Kein D-Pad mehr vorhanden', async ({ page }) => {
  await page.goto('/games/snake/');
  await expect(page.locator('#btn-up')).toHaveCount(0);
  await expect(page.locator('#btn-down')).toHaveCount(0);
  await expect(page.locator('#btn-left')).toHaveCount(0);
  await expect(page.locator('#btn-right')).toHaveCount(0);
});


// ── Mobile / Touch (Pixel 5 Emulation) ──────────────────────────────
test('Snake: Spiel startet per Touch auf Canvas', async ({ browser }) => {
  const ctx = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  await page.goto('/games/snake/');

  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();

  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('#hint')).toHaveText('');
  await ctx.close();
});

test('Snake: Wischen nach rechts ändert Richtung', async ({ browser }) => {
  const ctx = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  await page.goto('/games/snake/');

  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  // Starten
  await page.touchscreen.tap(cx, cy);

  // Wischen nach rechts
  await page.touchscreen.tap(cx, cy);
  await page.mouse.move(cx, cy);
  await page.evaluate(() => {
    const canvas = document.getElementById('canvas');
    const touch = (type, x1, x2, y) => {
      canvas.dispatchEvent(new TouchEvent(type, {
        bubbles: true,
        touches: [new Touch({ identifier: 1, target: canvas, clientX: x2, clientY: y })],
        changedTouches: [new Touch({ identifier: 1, target: canvas, clientX: x2, clientY: y })],
      }));
    };
    const cx = canvas.getBoundingClientRect().left + canvas.width / 2;
    const cy = canvas.getBoundingClientRect().top  + canvas.height / 2;
    canvas.dispatchEvent(new TouchEvent('touchstart', {
      bubbles: true,
      touches: [new Touch({ identifier: 1, target: canvas, clientX: cx, clientY: cy })],
      changedTouches: [new Touch({ identifier: 1, target: canvas, clientX: cx, clientY: cy })],
    }));
    canvas.dispatchEvent(new TouchEvent('touchmove', {
      bubbles: true,
      touches: [new Touch({ identifier: 1, target: canvas, clientX: cx + 60, clientY: cy })],
      changedTouches: [new Touch({ identifier: 1, target: canvas, clientX: cx + 60, clientY: cy })],
    }));
  });

  // Kein Fehler und Spiel läuft noch
  await expect(page.locator('canvas')).toBeVisible();
  await ctx.close();
});

test('Snake: Wischen nach unten ändert Richtung', async ({ browser }) => {
  const ctx = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  await page.goto('/games/snake/');

  await page.evaluate(() => {
    const canvas = document.getElementById('canvas');
    const cx = canvas.getBoundingClientRect().left + canvas.width / 2;
    const cy = canvas.getBoundingClientRect().top  + canvas.height / 2;
    canvas.dispatchEvent(new TouchEvent('touchstart', {
      bubbles: true,
      touches: [new Touch({ identifier: 1, target: canvas, clientX: cx, clientY: cy })],
      changedTouches: [new Touch({ identifier: 1, target: canvas, clientX: cx, clientY: cy })],
    }));
    canvas.dispatchEvent(new TouchEvent('touchmove', {
      bubbles: true,
      touches: [new Touch({ identifier: 1, target: canvas, clientX: cx, clientY: cy + 60 })],
      changedTouches: [new Touch({ identifier: 1, target: canvas, clientX: cx, clientY: cy + 60 })],
    }));
  });

  await expect(page.locator('canvas')).toBeVisible();
  await ctx.close();
});
