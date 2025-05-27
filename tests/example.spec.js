// @ts-check
import { test, expect } from '@playwright/test';

async function loginUser(page) {
  await page.goto('https://northcodersevents.netlify.app/');
  await page.getByRole('link', { name: 'Log In' }).click();
  await page.getByPlaceholder('Enter your email').fill('aaronbrucesmith86@gmail.com');
  await page.getByPlaceholder('Enter your password').fill('1234567');
  await page.getByPlaceholder('Retype your password').fill('1234567');
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForURL('https://northcodersevents.netlify.app/');
}

async function createEvent(page, { heading, location, description, imageUrl, dateTime }) {
  await page.getByRole('link', { name: 'Create Event' }).click();
  await page.waitForURL('**/create-event');

  await page.getByPlaceholder('Heading').fill(heading);
  await page.getByPlaceholder('Location').fill(location);
  await page.getByPlaceholder('Description').fill(description);
  await page.getByPlaceholder('Image URL').fill(imageUrl);
  await page.locator('input[type="datetime-local"]').fill(dateTime);
  await page.getByRole('button', { name: /create event/i }).click();

  await page.waitForURL('https://northcodersevents.netlify.app/');
}

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://northcodersevents.netlify.app/');
  });

  test('Title', async ({ page }) => {
    await expect(page).toHaveTitle('Northcoders Events');
  });

  test('Nav Links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
    await expect(page.getByText('Log Out')).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Create Event' })).not.toBeVisible();
  });

  test.describe('Log In Authentication', () => {
    test.skip('authenticated nav links', async ({ page }) => {
      await loginUser(page);
      await expect(page.getByRole('link', { name: 'Create Event' })).toBeVisible();
      await expect(page.getByText('Log Out')).toBeVisible();

      await page.getByRole('link', { name: 'Create Event' }).click();
      await expect(page).toHaveURL('**/create-event');
    });
  });

  test.describe('Create Event', () => {
    test.skip('User can create a new event', async ({ page }) => {
      await loginUser(page);
      await createEvent(page, {
        heading: 'Playwright Test Event',
        location: 'Online',
        description: 'This is a test event created by Playwright.',
        imageUrl: 'https://images.squarespace-cdn.com/content/v1/56acc1138a65e2a286012c54/1476623632079-BBAERA9UGQ0EODC6680U/pixabaytest6-7.jpg?format=1000w',
        dateTime: '2025-12-01T18:00'
      });
    });
  });

  test.describe('Edit Event', () => {
    test('User can edit an event', async ({ page }) => {
      await loginUser(page);
      await page.getByRole('button', { name: 'Edit' }).first().click();
      await page.waitForURL('**/edit-event/**');

      await expect(page.getByLabel('Heading:')).toBeVisible();

      await page.getByLabel('Heading:').fill('Updated Event Title');
      await page.getByLabel('Location:').fill('Updated Location');
      await page.getByLabel('Description:').fill('Updated event description.');
      await page.getByLabel('Image URL:').fill('https://upload.wikimedia.org/wikipedia/commons/a/ae/Test2-Icon.png');
      await page.getByLabel('Date:').fill('2025-12-25');

      await page.getByRole('button', { name: 'Save' }).click();
      await page.waitForURL('https://northcodersevents.netlify.app/');
    });
  });
});
