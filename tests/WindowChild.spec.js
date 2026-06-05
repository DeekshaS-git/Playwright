const {test,expect} = require('@playwright/test');

test('Child Window test', async ({browser}) => //test case name, function//
{   
    const context = await browser.newContext(); //default browser context, incognito mode//
    const page = await context.newPage();
    const link = page.locator("[href*='documents-request']");
    const userName = page.locator('#username');
    
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    await expect(link).toHaveAttribute('class', 'blinkingText'); // Verify the link has the expected class attribute
    
    const [newPage] = await Promise.all([
    context.waitForEvent('page'),// duty is to listen for any new page b4 opening of new page. 
    //so donot write it after licking link, write it before clicking link.
    link.click(),
])
    //3 states of promise : pending, rejected and fulfilled. 
    // When await is not used by default it is in pending state. 
    // When we use await, it will wait for the promise to be fulfilled and 
    // then move to next line of code. If the promise is rejected, 
    // it will throw an error. This is called as promise chaining 
    // as it's asynchqronous in nature.

    // When we use Promise.all, it will wait for all the promises to be fulfilled by creating it in 
    // array and then move to next line of code. 
    // If any of the promise is rejected, it will throw an error. 
    await newPage.locator(".red").waitFor(); // Wait for the element with class "red" to be visible on the new page
    const text =await newPage.locator(".red").textContent();
    console.log("Text is ",text);
    const arrayText = text.split('@');
    const domain = arrayText[1].split(' ')[0];
    //console.log("Split Text:", domain);
    await userName.fill(domain);
    await page.pause(); // helpful for debugging and inspecting the page state at this point    
    console.log("Username filled:", await userName.inputValue());
    await page.screenshot({ path: 'screenshot7.png' }); // Take a screenshot of the page
   //innerText() is usually more reliable for visible text.
   
   
   
    // Here we are using then() method to get the text content of the element 
    // with class "red" and log it to the console. 
    // This is because the new page is opened asynchronously 
    // and we need to wait for it to load before we can access its elements. 
    
    //--------------------------------------------------------------------------------//
    //1. textContent(): extracts the text content of locator when it's 
    // attached to DOM when page opens
    //2. inputValue(): extracts the dynamic value of input field what it has feeded
    
});
