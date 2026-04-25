const { test, expect } = require('@playwright/test');

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
