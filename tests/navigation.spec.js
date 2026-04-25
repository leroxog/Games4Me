import { test, expect } from '@playwright/test';

test('Startseite lädt korrekt', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Games4Me/);
});

test('Alle 4 Spielkacheln sind sichtbar', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('card-snake')).toBeVisible();
  await expect(page.getByTestId('card-tetris')).toBeVisible();
  await expect(page.getByTestId('card-runner')).toBeVisible();
  await expect(page.getByTestId('card-rhythmjump')).toBeVisible();
});

test('Klick auf Snake öffnet Snake-Seite', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('card-snake').click();
  await expect(page).toHaveURL(/snake/);
  await expect(page.locator('canvas')).toBeVisible();
});

test('Klick auf Tetris öffnet Tetris-Seite', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('card-tetris').click();
  await expect(page).toHaveURL(/tetris/);
  await expect(page.locator('canvas')).toBeVisible();
});

test('Klick auf Runner öffnet Runner-Seite', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('card-runner').click();
  await expect(page).toHaveURL(/runner/);
  await expect(page.locator('canvas')).toBeVisible();
});

test('Klick auf Rhythm Jump öffnet Rhythm-Seite', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('card-rhythmjump').click();
  await expect(page).toHaveURL(/rhythmjump/);
  await expect(page.locator('canvas')).toBeVisible();
});
