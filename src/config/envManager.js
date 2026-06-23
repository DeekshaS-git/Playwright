const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
});

class EnvManager {
  static getBrowser() {
    return process.env.BROWSER || 'chromium';
  }

  static isHeadless() {
    return process.env.HEADLESS === 'true';
  }

  static getBaseUrl() {
    return process.env.BASE_URL;
  }
}

module.exports = EnvManager;