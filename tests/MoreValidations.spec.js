const {test,expect} = require('@playwright/test');

test('More Validations test', async ({page}) =>{

    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    // await page.goto('https://www.google.com/');
    // await page.goBack();
    // await page.reload();
    // await page.goForward();
//-------------------------------ALERTS-------------------------------

    // page.on('dialog',dialog => dialog.accept());//event to be occur
    // page.on('dialog',dialog => dialog.dismiss());

//-------------------------------HOVER-------------------------------

    //await page.locator('#mousehover').hover();

////-------------------------------FRAMES------------------------------- 
// const framePage= await page.frameLocator('#courses-iframe');
// await framePage.locator("li a[href*='lifetime-access']:visible").click();

// const textCheck = await framePage.locator('.text h2').textContent();
// console.log(textCheck.split(" ")[1]);
    
////-------------------------------Screenshots------------------------------- 
await expect(page.locator('#displayed-text')).toBeVisible();
await page.locator('#displayed-text').screenshot({ path: 'screenshot10.png' });
await page.locator('#hide-textbox').click();
await page.screenshot({ path: 'screenshot9.png' }); // Take a screenshot of the page
await expect(page.locator('#displayed-text')).not.toBeVisible();

////-------------------------------VISUAL TESTING------------------------------- 
// screenshot taken , store it and now whenevr u run it again. we can compare it 
// with last one

});

test.only('Visual Testing', async ({page}) => {
   await page.goto('https://www.google.com/');
   expect(await page.screenshot()).toMatchSnapshot('landing.png');

});