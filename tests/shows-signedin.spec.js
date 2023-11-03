// @ts-check
import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test('has title', async ({ page }) => {
  await page.goto(process.env.LOCAL_URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Trending/);
});

test('check menu is 5 items long when logged in', async ({ page }) => {
  console.log('check menu is 5 items long when logged in');
  console.log(
    'cookies',
    (await page.context().cookies()).filter(
      (c) => c.name.indexOf('next-auth') > -1,
    ),
  );
  console.log('storageState:', await page.context().storageState());

  await page.goto(process.env.LOCAL_URL);
  if (!(await page.getByRole('link', { name: 'TV Shows' }).isVisible())) {
    // click on the menu opener
    page.getByRole('button', { name: 'Open main menu' }).click();
  }

  await expect(page.getByRole('link', { name: /movies/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /tv shows/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /sign out/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /my profile/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /my shows/i })).toBeVisible();
});

test('check tv shows load', async ({ page }) => {
  await page.goto(process.env.LOCAL_URL);
  // if we're on mobile device, the menu is not visible
  if (!(await page.getByRole('link', { name: 'TV Shows' }).isVisible())) {
    // click on the menu opener
    page.getByRole('button', { name: 'Open main menu' }).click();
  }

  // click the tv shows link
  await page.getByRole('link', { name: 'TV Shows' }).click();

  // assert we have the animation genre loaded
  await expect(page.getByText('Animation')).toBeVisible({ timeout: 10000 });
});

test('check footer is visible', async ({ page }) => {
  await page.goto(process.env.LOCAL_URL);
  await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Repo' })).toBeVisible();
});

test('check switching to dark mode is ok', async ({ page }) => {
  await page.goto(process.env.LOCAL_URL);
  await expect(page.getByRole('button', { name: /switch/i })).toBeVisible();
  await page.getByRole('button', { name: /switch/i }).click();
  await expect(page.getByRole('link', { name: /contact/i })).toBeVisible();
  await expect(page.locator('xpath=//html/body')).toHaveClass(/bg-gray/);
  await expect(page.locator('xpath=//html/body')).toHaveClass(/text-gray/);
});

test('check my shows load', async ({ page }) => {
  await page.goto(process.env.LOCAL_URL);
  await page.waitForTimeout(1000);
  // if we're on mobile device, the menu is not visible
  if (!(await page.getByRole('link', { name: 'My Shows' }).isVisible())) {
    // click on the menu opener
    page.getByRole('button', { name: 'Open main menu' }).click();
  }

  // click the tv shows link
  await page.getByRole('link', { name: 'My Shows' }).click();

  // assert we have the animation genre loaded
  await expect(page.getByText('My List')).toBeVisible({ timeout: 10000 });
});
