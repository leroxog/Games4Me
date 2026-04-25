const { test, expect } = require('@playwright/test');

test('Snake-Seite lädt ohne Fehler', async ({ page }) => {
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

test('Snake: Spiel startet bei Tastendruck', async ({ page }) => {
  await page.goto('/games/snake/');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#hint')).toHaveText('');
});
