const { chromium, firefox, webkit } = require('playwright');
const EnvManager = require('../config/envManager');

class BrowserFactory {
  static async launchBrowser() {
    const browserName = EnvManager.getBrowser();

    const options = {
      headless: EnvManager.isnotHeadless()
    };

    if (browserName === 'firefox') {
      return await firefox.launch(options);
    }

    if (browserName === 'webkit') {
      return await webkit.launch(options);
    }

    return await chromium.launch(options);
  }
}

module.exports = BrowserFactory;