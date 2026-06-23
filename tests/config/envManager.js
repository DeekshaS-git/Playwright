require('dotenv').config();

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