import { test, expect, devices } from '@playwright/test';

test('Runner-Seite lädt ohne Fehler', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/games/runner/');
  await expect(page.locator('canvas')).toBeVisible();
  expect(errors).toHaveLength(0);
});

test('Runner: Zurück-Button führt zur Startseite', async ({ page }) => {
  await page.goto('/games/runner/');
  await page.locator('.back-btn').click();
  await expect(page).toHaveURL(/\/$|index\.html/);
});

test('Runner: Spiel startet bei Leertaste', async ({ page }) => {
  await page.goto('/games/runner/');
  await page.keyboard.press('Space');
  await expect(page.locator('#hint')).toHaveText('');
});

test('Runner: Kein Jump-Button vorhanden', async ({ page }) => {
  await page.goto('/games/runner/');
  await expect(page.locator('#jump-btn')).toHaveCount(0);
});

test('Runner: Spiel startet per Touch auf Canvas', async ({ browser }) => {
  const ctx = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  await page.goto('/games/runner/');

  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('#hint')).toHaveText('');
  await ctx.close();
});
