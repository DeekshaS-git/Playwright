const {test,expect} = require('@playwright/test');

test('LoginRsa test', async ({page}) => //test case name, function//
{   
    const email = page.locator('#userEmail');
    const login = page.locator('#login');
    const password = page.locator('#userPassword');
    const products = page.locator('.card-body');
    const productName = "iphone 13 pro";
    const cart = page.locator("[routerlink*='cart']");
    const cartPage = page.locator(".cart");
    const table = page.locator("table tr");
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    console.log(await page.title()); // Log the page title to the console

    await email.fill('deekshasharma@ymail.com');
    await password.fill('Deeksha@123');

    await login.click();
    await page.waitForTimeout(2000);
    console.log(await page.title()); // Log the page title to the console
    await page.waitForLoadState('networkidle'); // Wait for the network to be idle before proceeding
    await products.first().waitFor(); // Wait for the single or few products to be visible on the page 
   
   //console.log(await products.first().textContent());
    //-----Getting count and all items in a page -----------
    const items = await products.allTextContents();
    console.log(items);
    const count = await products.count();
    console.log("Count of products is ",count);
    for (let i=0; i<count; ++i)
    {
        console.log(await products.nth(i).locator("b").textContent()); //dynamic search
        // To get the name of the product which is in <b> tag, we are 
        // using locator with nth(i) to get the index of the product 
        // and then using locator("b") to get the text content of the <b> tag.

        if (await products.nth(i).locator("b").textContent() === productName)
        {
            await products.nth(i).locator("text= Add To Cart").click();
            console.log("Product added to cart");
            await page.screenshot({ path: 'screenshot8.png' }); // Take a screenshot of the page
            break;
        }
        //await page.pause(); // helpful for debugging and inspecting the page state at this point
    }
    await cart.click();
    await page.locator("div li").first().waitFor(); // Wait for the cart items to be visible on the cart page
    const bool = await page.locator('h3:has-text("'+productName+'")').isVisible();
    expect(bool).toBeTruthy; // Verify the product is added to the cart

    await page.locator('button:has-text("Checkout")').click();
    await expect (page.locator("text=' Payment Method '")).toHaveText(' Payment Method '); 

    //<----Enter card details and place order---->
    await page.locator("[type='text']").nth(1).fill('356');
    await page.locator("[type='text']").nth(2).fill('Deeksha Sharma');
//<----Auto-suggest dropdown handling---->

    await page.locator("[placeholder='Select Country']").pressSequentially("Ind");

    const options = await page.locator(".ta-results");
    await options.waitFor(); // Wait for the country options to be visible
    const optionsCount = await options.locator("button").count(); // Select the first country option
    for (let i=0; i<optionsCount; ++i)
    {
        const text = await options.locator("button").nth(i).textContent();
            if (text === " India")
            {
                await options.locator("button").nth(i).click();
                break;
            }
    }
    
    await page.locator('.action__submit').click();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    

    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    const cleanOrderId = orderId.trim().replace(/\|/g, "").trim(); // Remove pipes and whitespace
    console.log("Order ID is ", cleanOrderId);

    //<---Getting all the orders and verifying the order id in Order page--->
   //--------getting rows---------------
    await page.locator("button[routerlink*='myorders']").click();  
    await page.locator("table tr").first().waitFor();   
    const rows = await page.locator("table tr");
    const rowCount = await rows.count();
    console.log("Number:", rowCount);

    //---------getting columns of one row----------------
    const columns = await page.locator("table tr").nth(2).locator("th,td");
    const columnCount = await columns.count();
    console.log("Col Number:", columnCount);

    //---------print whole table----------------
    
    //await page.pause();
    const row = await page.locator("table tr");
    const rowCoun = await row.count();
    for (let i=0; i<rowCoun; ++i)
    {
        const col = row.nth(i).locator("th, td");
        const colCount = await col.count();
            for (let j=0; j<colCount; ++j)
            {
                const table = await col.nth(j).textContent();
                console.log(table);
            }
    }

    //--------print specific cell data-------------------------
    const txt = await table.nth(1).locator("td").nth(1).textContent();
    console.log("First cell data is ", txt);
   
    //---------verifying order id-----------------
    for (let i=0; i<rowCount; ++i)
    {
        const orderNo = await rows.nth(i).locator("th, td").allTextContents();
        if (orderNo.includes(cleanOrderId))
        {
            await rows.nth(i).locator("button").first().click();
            await expect(page.locator(".email-title")).toHaveText(" order summary ");
            
           const orderId = await (page.locator(".col-text")).textContent();
            expect(orderId.includes(cleanOrderId)).toBeTruthy
            //await expect(page.locator(".col-text")).toBeVisible(cleanOrderId);

            console.log("assertion passed");
            //await expect(page.locator)
            break;
        }
    }
    

    
});