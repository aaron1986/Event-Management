// @ts-check
import { test, expect } from '@playwright/test';

async function loginUser(page) {
  await page.goto('https://northcodersevents.netlify.app/');
  await page.getByRole('link', { name: 'Log In' }).click();
  await page.getByPlaceholder('Enter your email').fill('admin_event_management@admin.com');
  await page.getByPlaceholder('Enter your password').fill('admin@EVENTS2025');
  await page.getByPlaceholder('Retype your password').fill('admin@EVENTS2025');
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

  test.skip('Title', async ({ page }) => {
    await expect(page).toHaveTitle('Northcoders Events');
  }); //End of title Test

  test.skip('Nav Links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
    await expect(page.getByText('Log Out')).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Create Event' })).not.toBeVisible();
  }); //End of Nav Links Test

  test.describe('Log In Authentication', () => {
    test('authenticated nav links', async ({ page }) => {
      await loginUser(page);
      await expect(page.getByRole('link', { name: 'Create Event' })).toBeVisible();
      await expect(page.getByText('Log Out')).toBeVisible();

      await page.getByRole('link', { name: 'Create Event' }).click();
      await expect(page).toHaveURL('https://northcodersevents.netlify.app/create-event');
    });
  }); //End of Log In Authentication Test

  test.describe('Create Event', () => {
    test.skip('User can create a new event', async ({ page }) => {
      await loginUser(page);
      await createEvent(page, {
        heading: 'Playwright New Test Event',
        location: 'Online',
        description: 'This is a test event created by Playwright.',
        imageUrl: 'https://images.squarespace-cdn.com/content/v1/56acc1138a65e2a286012c54/1476623632079-BBAERA9UGQ0EODC6680U/pixabaytest6-7.jpg?format=1000w',
        dateTime: '2025-12-01T18:00'
      });
    });
  }); //End of Create Event Test

  test.describe('Edit Event', () => {
    test.skip('User can edit an event', async ({ page }) => {
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
  }); //End of Edit Test


  test.describe("FORM VALIDATION", () => {
  test.skip("Shows errors when submitting empty login form", async ({ page }) => {
    await page.goto('https://northcodersevents.netlify.app/');
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.locator('.error-message')).toContainText([
      'Email is required.',
      'Password is required.',
      'Please confirm your password.'
    ]);
  });

  test.skip("Shows error for invalid email format", async ({ page }) => {
    await page.goto('https://northcodersevents.netlify.app/');
    await page.getByRole('link', { name: 'Log In' }).click();

    await page.getByPlaceholder('Enter your email').fill('invalidemail');
    await page.getByPlaceholder('Enter your password').fill('123456');
    await page.getByPlaceholder('Retype your password').fill('123456');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.locator('.error-message')).toContainText(['Invalid email address.']);
  });

  test.skip("Shows error for password less than 6 characters", async ({ page }) => {
    await page.goto('https://northcodersevents.netlify.app/');
    await page.getByRole('link', { name: 'Log In' }).click();

    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Enter your password').fill('123');
    await page.getByPlaceholder('Retype your password').fill('123');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.locator('.error-message')).toContainText([
      'Password must be at least 6 characters.'
    ]);
  });

  test.skip("Shows error when passwords do not match", async ({ page }) => {
    await page.goto('https://northcodersevents.netlify.app/');
    await page.getByRole('link', { name: 'Log In' }).click();

    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Enter your password').fill('123456');
    await page.getByPlaceholder('Retype your password').fill('654321');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.locator('.error-message')).toContainText([
      'Passwords do not match.'
    ]);
  });
});

test.describe('Event Sign Up', () => {
  test.only('User can sign up for an event', async ({ page }) => {
    await loginUser(page);
    await page.goto('https://northcodersevents.netlify.app/');
    const signUpButton = page.getByRole('button', { name: 'Sign Up' }).first();
    await expect(signUpButton).toBeVisible();
    await signUpButton.click();

    const updatedButton = page.getByRole('button', { name: 'Already Signed Up' }).first();
    await expect(updatedButton).toBeVisible();
    await expect(updatedButton).toBeDisabled();

    const countText = await page.locator('text=/people signed up/').first().innerText();
    const match = countText.match(/\d+/);
    expect(Number(match?.[0])).toBeGreaterThan(0);
  });
}); //End of Sign Up Button Test



}); //End of test describe('Home Page')
