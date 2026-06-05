const {test,expect} = require('@playwright/test');

test('Register test', async ({page}) => //test case name, function//
{   
    
    const firstName = page.locator('#firstName');
    const lastName = page.locator('input[id="lastName"]');
    const email = page.locator('#userEmail');
    const phoneNumber = page.locator('input[id="userMobile"]');
    const password = page.locator('#userPassword');
    const confirmPassword = page.locator('#confirmPassword');
    const occupationDd = page.locator('select.custom-select');
    //const gender = page.locator('input[formcontrolname="gender"]');
    const registerLink = page.getByText('Register here');
    const registerButton = page.locator('#login');
    const login = page.locator('#login');
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    console.log(await page.title()); // Log the page title to the console
    await registerLink.click();
    await firstName.fill('Deeksha');
    await lastName.fill('Sharma');
    await email.fill('deekshasharma@ymail.com');
    await phoneNumber.fill('9550602121');
    await occupationDd.selectOption('Engineer');
    //await page.pause(); // helpful for debugging and inspecting the page state at this point
    // Select Male and verify it's checked
    await page.locator('input[formcontrolname="gender"][value="Male"]').click();
     //assertions
    expect (await page.locator('input[formcontrolname="gender"][value="Male"]')).toBeChecked();
   
    await password.fill('Deeksha@123');
    await confirmPassword.fill('Deeksha@123');
    await page.locator('input[formcontrolname="required"]').click();
    expect (await page.locator('input[formcontrolname="required"]')).toBeChecked();

    await registerButton.click();
    await page.waitForTimeout(2000);

    //-------------------------------LOGIN-----------------------------------------------
    await email.fill('deekshasharma@ymail.com');
    await password.fill('Deeksha@123');

    await login.click();
    await page.waitForTimeout(2000);
    console.log(await page.title()); // Log the page title to the console


});


