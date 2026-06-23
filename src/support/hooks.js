
const { Before, After } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('@playwright/test');
const { setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(60 * 1000);

Before(async function () {
  const browserName = process.env.BROWSER || 'chromium';

  const browserType = {
    chromium,
    firefox,
    webkit
  }[browserName];

  this.browser = await browserType.launch({
    
  });

  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (scenario) {
  if (scenario.result.status === 'FAILED') {
    await this.page.screenshot({
      path: `screenshots/${scenario.pickle.name}.png`,
      fullPage: true
    });
  }

  await this.page.close();
  await this.context.close();
  await this.browser.close();
});