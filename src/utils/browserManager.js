const { chromium } = require('@playwright/test');

class BrowserManager {

    static async launchBrowser() {

        const browser = await chromium.launch({
            headless: false
        });

        const context = await browser.newContext();

        const page = await context.newPage();

        return { browser, page };
    }
}

module.exports = BrowserManager;