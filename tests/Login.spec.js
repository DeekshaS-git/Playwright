const {test,expect} = require('@playwright/test');
const {execSync} = require('child_process');

async function getOTPFromAndroid(page) {

    await page.waitForTimeout(5000); // Wait for 5 seconds to ensure the OTP is received
try{
    const output = execSync('adb shell content query --uri content://sms/inbox --projection body --sort "date DESC" --limit 1', 
        { maxBuffer: 50 * 1024 * 1024 })
        .toString();

        console.log('Latest SMS:', output);

    const otp = output.match(/(\d{6})/)[0]; // Extract the 6-digit OTP from the SMS body

    if (!otp) {
        throw new Error('OTP not found in the latest SMS');
    }
    console.log(`Received OTP: ${otp}`); // Log the OTP to the console

    return otp;
} catch (error) {
    console.error('Error fetching OTP:', error);
    throw error;
}

}

test('Login test', async ({page}) => //test case name, function//
{   
    await page.goto('https://www.flipkart.com/');
    
    await page.locator('input.xkp9Hl.ZvCKfk').click();  
    await page.waitForTimeout(2000); 
    await page.locator('input.xkp9Hl.ZvCKfk').fill('9550602121');
    await page.getByRole('button', { name: 'Request OTP' }).click();  
    await page.waitForTimeout(5000); 
    console.log(page.locator('.ntt0ZA').textContent()); // Log the error message text to the console
    await page.screenshot({ path: 'screenshot4.png' }); // Take a screenshot of the page

    //OTP from phone

    const otp = await getOTPFromAndroid(page);

    // Enter OTP
    await page.locator('input[type="text"]').fill(otp);
    await page.getByRole('button', { name: 'VERIFY' }).click();
});

