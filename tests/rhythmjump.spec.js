import { test, expect } from '@playwright/test';

test('Rhythm Jump-Seite lädt ohne Fehler', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/games/rhythmjump/');
  await expect(page.locator('canvas')).toBeVisible();
  expect(errors).toHaveLength(0);
});

test('Rhythm Jump: Zurück-Button führt zur Startseite', async ({ page }) => {
  await page.goto('/games/rhythmjump/');
  await page.locator('.back-btn').click();
  await expect(page).toHaveURL(/\/$|index\.html/);
});

test('Rhythm Jump: Spiel startet bei Leertaste', async ({ page }) => {
  await page.goto('/games/rhythmjump/');
  await page.keyboard.press('Space');
  await expect(page.locator('#hint')).toHaveText('');
});
