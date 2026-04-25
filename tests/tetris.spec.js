const { test, expect } = require('@playwright/test');

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
