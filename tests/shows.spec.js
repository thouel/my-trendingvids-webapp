// @ts-check
const { test, expect } = require('@playwright/test');
const { todo } = require('node:test');

let page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('http://localhost:3000/');
});

test.afterAll(async () => await page.close());

test('has title', async () => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Trending/);
});

test('check menu is 3 items long when not logged in', async () => {
  if (!(await page.getByRole('link', { name: 'TV Shows' }).isVisible())) {
    // click on the menu opener
    page.getByRole('button', { name: 'Open main menu' }).click();
  }

  await expect(page.getByRole('link', { name: /movies/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /tv shows/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
});

test('check tv shows load', async () => {
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

test('check footer is visible', async () => {
  await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Repo' })).toBeVisible();
});

test('check switching to dark mode is ok', async () => {
  await expect(page.getByRole('button', { name: /switch/i })).toBeVisible();
  await page.getByRole('button', { name: /switch/i }).click();
  await expect(page.getByRole('link', { name: /contact/i })).toBeVisible();
  await expect(page.locator('xpath=//html/body')).toHaveClass(/bg-gray/);
  await expect(page.locator('xpath=//html/body')).toHaveClass(/text-gray/);
});

test('signin with github', async () => {
  if (!(await page.getByRole('link', { name: 'Sign in' }).isVisible())) {
    // click on the menu opener
    page.getByRole('button', { name: 'Open main menu' }).click();
  }

  await page.getByRole('link', { name: 'Sign in' }).click();

  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /twitch/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /github/i })).toBeVisible();
});
