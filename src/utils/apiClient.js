require('dotenv').config();
const { request } = require('@playwright/test');

class APIClient {
  async init() {
    this.apiContext = await request.newContext({
      baseURL: process.env.API_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json'
      }
    });
  }

  async get(endpoint) {
    return await this.apiContext.get(endpoint);
  }

  async post(endpoint, payload) {
    return await this.apiContext.post(endpoint, { data: payload });
  }

  async dispose() {
    await this.apiContext.dispose();
  }
}

module.exports = APIClient;