import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('check menu is 3 items long when not logged in', async ({ page }) => {
  await page.goto(process.env.LOCAL_URL);

  if (!(await page.getByRole('link', { name: 'TV Shows' }).isVisible())) {
    // click on the menu opener
    page.getByRole('button', { name: 'Open main menu' }).click();
  }

  await expect(page.getByRole('link', { name: /movies/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /tv shows/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
});
