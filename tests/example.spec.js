// @ts-check
import { test, expect } from '@playwright/test';

test.describe("Home Page", () => {
  test.beforeEach(async ({page}) =>{
    await page.goto('https://northcodersevents.netlify.app/')
  })

  test.skip("Title", async({page, request}) => {
    await expect(page).toHaveTitle("Northcoders Events");
  })

  //check nav links
  test.skip("Nav Links", async({page, request}) => {
    
    // Test "Home" and "Log In" links are visible
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();

    // "Log Out" and "Create Event" should not be visible
    await expect(page.getByText('Log Out')).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Create Event' })).not.toBeVisible();
  
  })

  test.describe("Log In Authentication", () => {

  test.skip("authenticated nav links", async ({ page }) => {

    await test.step("Visit homepage and go to login page", async () => {
      await page.goto('https://northcodersevents.netlify.app/');
      await page.getByRole('link', { name: 'Log In' }).click();
      await expect(page.getByRole('heading', { name: /login to your account/i })).toBeVisible();
    });

    await test.step("Fill in login form", async () => {
    await page.getByPlaceholder('Enter your email').fill('aaronbrucesmith86@gmail.com');
    await page.getByPlaceholder('Enter your password').fill('1234567');
    await page.getByPlaceholder('Retype your password').fill('1234567');
    await page.getByRole('button', { name: /login/i }).click();

    });

    await test.step("Verify redirected and authenticated nav is shown", async () => {
      await page.waitForURL('https://northcodersevents.netlify.app/');
      await expect(page.getByRole('link', { name: 'Create Event' })).toBeVisible();
      await expect(page.getByText('Log Out')).toBeVisible();
    });

    await test.step("Navigate to Create Event page", async () => {
      await page.getByRole('link', { name: 'Create Event' }).click();
      await expect(page).toHaveURL('https://northcodersevents.netlify.app/create-event');
    });

  });

});

test.describe('Create Event', () => {
  test.skip('User can create a new event', async ({ page }) => {
    await page.goto('https://northcodersevents.netlify.app/');
    await page.getByRole('link', { name: 'Log In' }).click();

    await page.getByPlaceholder('Enter your email').fill('aaronbrucesmith86@gmail.com');
    await page.getByPlaceholder('Enter your password').fill('1234567');
    await page.getByPlaceholder('Retype your password').fill('1234567');
    await page.getByRole('button', { name: /login/i }).click();

    await page.waitForURL('https://northcodersevents.netlify.app/');
    await page.getByRole('link', { name: 'Create Event' }).click();
    await page.waitForURL('https://northcodersevents.netlify.app/create-event');

    // 3. Fill in the Create Event form
    await page.getByPlaceholder('Heading').fill('Playwright Test Event');
    await page.getByPlaceholder('Location').fill('Online');
    await page.getByPlaceholder('Description').fill('This is a test event created by Playwright.');
    await page.getByPlaceholder('Image URL').fill('https://images.squarespace-cdn.com/content/v1/56acc1138a65e2a286012c54/1476623632079-BBAERA9UGQ0EODC6680U/pixabaytest6-7.jpg?format=1000w');
    await page.locator('input[type="datetime-local"]').fill('2025-12-01T18:00');
    await page.getByRole('button', { name: /create event/i }).click();

    await page.waitForURL('https://northcodersevents.netlify.app/');

  });
});

test.describe('Edit Event', () => {
  test('User can edit an existing event', async ({ page }) => {
    await page.goto('https://northcodersevents.netlify.app/');
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.getByPlaceholder('Enter your email').fill('aaronbrucesmith86@gmail.com');
    await page.getByPlaceholder('Enter your password').fill('1234567');
    await page.getByPlaceholder('Retype your password').fill('1234567');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL('https://northcodersevents.netlify.app/');

    // 2. Navigate directly to the edit page for a known event ID
    const testEventId = '1748012702884'; // <-- Replace with a known test event's custom ID field
    await page.goto(`https://northcodersevents.netlify.app/edit-event/${testEventId}`);

    // 4. Edit a field
    const headingInput = page.locator('input[name="heading"]');
    await headingInput.fill('Updated Event Title');

    const locationInput = page.locator('input[name="location"]');
    await locationInput.fill('Updated Location');

    // 5. Click Save
    await page.getByRole('button', { name: /save/i }).click();

    // 6. Confirm redirect to homepage
    await page.waitForURL('https://northcodersevents.netlify.app/');

    // 7. Optionally confirm the update appeared
    await expect(page.locator('text=Updated Event Title')).toBeVisible();
  });
});

})