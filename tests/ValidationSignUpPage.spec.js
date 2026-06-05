const {test,expect} = require('@playwright/test');

test('First test', async ({browser}) => //test case name, function//
    {
        const context = await browser.newContext(); //default browser context, incognito mode//
        const page = await context.newPage();
        await page.goto('https://www.google.com');
    });   
    
test.only('First Page test', async ({page}) => //test case name, function//
    {
        await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
        await expect(page).toHaveURL(/rahulshettyacademy/); // Verify the page navigated to the correct URL

        await page.getByRole('link', { name: 'Register here' }).click();
        await page.waitForTimeout(2000); 
        //await page.getByRole('button', { name: 'CONTINUE' }).click();
        //await page.waitForTimeout(2000); 
        

        await page.waitForTimeout(2000); // Wait for 2 seconds to allow the error message to appear
        await expect(
            page.getByText('Please enter a valid Mobile number', { exact: true })
          ).toBeVisible({timeout: 10000}); // Verify the error message is visible
          await page.screenshot({ path: 'screenshot.png' }); // Take a screenshot of the page
        await page.locator('input[maxlength="10"][type="text"]').click();  
        await page.waitForTimeout(2000); 
        await page.locator('input[maxlength="10"][type="text"]').fill('3853749875');
        await page.screenshot({ path: 'screenshot1.png' });
        await page.getByRole('button', { name: 'CONTINUE' }).click();
        await page.waitForTimeout(2000); // Wait for 2 seconds to allow the error message to appear
        console.log(page.getByText('Please enter a valid Mobile number').textContent()); // Log the error message text to the console
        await expect(
            page.getByText('Please enter a valid Mobile number')
          ).toContainText('Please '); // Verify the error message is visible
          await page.screenshot({ path: 'screenshot2.png' });
    });        