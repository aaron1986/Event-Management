// @ts-check
import { test, expect } from '@playwright/test';

test.describe("Home Page", () => {
  test.beforeEach(async ({page}) =>{
    await page.goto('https://northcodersevents.netlify.app/')
  })

  test("Title", async({page, request}) => {
  
    //check title is correct
    await expect(page).toHaveTitle("Northcoders Events");
  })

})