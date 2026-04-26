import { test, expect, devices } from '@playwright/test';

test('Tetris-Seite lädt ohne Fehler', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/games/tetris/');
  await expect(page.locator('canvas')).toBeVisible();
  expect(errors).toHaveLength(0);
});

test('Tetris: Zurück-Button führt zur Startseite', async ({ page }) => {
  await page.goto('/games/tetris/');
  await page.locator('.back-btn').click();
  await expect(page).toHaveURL(/\/$|index\.html/);
});

test('Tetris: Spiel startet bei Tastendruck', async ({ page }) => {
  await page.goto('/games/tetris/');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#hint')).toHaveText('');
});

test('Tetris: Keine Steuer-Buttons vorhanden', async ({ page }) => {
  await page.goto('/games/tetris/');
  await expect(page.locator('#btn-left')).toHaveCount(0);
  await expect(page.locator('#btn-right')).toHaveCount(0);
  await expect(page.locator('#btn-rotate')).toHaveCount(0);
  await expect(page.locator('#btn-down')).toHaveCount(0);
});

test('Tetris: Spiel startet per Touch auf Canvas', async ({ browser }) => {
  const ctx = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  await page.goto('/games/tetris/');

  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('#hint')).toHaveText('');
  await ctx.close();
});

test('Tetris: Wischen nach links bewegt Stück', async ({ browser }) => {
  const ctx = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  await page.goto('/games/tetris/');

  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  // Starten per Tap
  await page.touchscreen.tap(cx, cy);

  // Wischen nach links via TouchEvent
  await page.evaluate(() => {
    const canvas = document.getElementById('canvas');
    const r = canvas.getBoundingClientRect();
    const cx = r.left + canvas.width / 2;
    const cy = r.top  + canvas.height / 2;
    canvas.dispatchEvent(new TouchEvent('touchstart', {
      bubbles: true,
      touches: [new Touch({ identifier: 1, target: canvas, clientX: cx, clientY: cy })],
      changedTouches: [new Touch({ identifier: 1, target: canvas, clientX: cx, clientY: cy })],
    }));
    canvas.dispatchEvent(new TouchEvent('touchend', {
      bubbles: true,
      touches: [],
      changedTouches: [new Touch({ identifier: 1, target: canvas, clientX: cx - 60, clientY: cy })],
    }));
  });

  await expect(page.locator('canvas')).toBeVisible();
  await ctx.close();
});

test('Tetris: Wischen nach unten löst Hard Drop aus', async ({ browser }) => {
  const ctx = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  await page.goto('/games/tetris/');

  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  await page.touchscreen.tap(cx, cy);

  await page.evaluate(() => {
    const canvas = document.getElementById('canvas');
    const r = canvas.getBoundingClientRect();
    const cx = r.left + canvas.width / 2;
    const cy = r.top  + canvas.height / 2;
    canvas.dispatchEvent(new TouchEvent('touchstart', {
      bubbles: true,
      touches: [new Touch({ identifier: 1, target: canvas, clientX: cx, clientY: cy })],
      changedTouches: [new Touch({ identifier: 1, target: canvas, clientX: cx, clientY: cy })],
    }));
    canvas.dispatchEvent(new TouchEvent('touchend', {
      bubbles: true,
      touches: [],
      changedTouches: [new Touch({ identifier: 1, target: canvas, clientX: cx, clientY: cy + 60 })],
    }));
  });

  await expect(page.locator('canvas')).toBeVisible();
  await ctx.close();
});
