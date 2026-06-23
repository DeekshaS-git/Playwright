const EnvManager = require('../config/envManager');
class basePage {
    constructor(page) {
        this.page = page;
    }

    async launchApplication() {
        await this.page.goto(EnvManager.getBaseUrl());
    }
}

module.exports = basePage;