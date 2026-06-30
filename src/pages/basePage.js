const EnvManager = require('../config/envManager');
class BasePage {
    constructor(page) {
        this.page = page;
    }

    async launchApplication() {
        const url = EnvManager.getBaseUrl();
        
         if (!url) {
            throw new Error('BASE_URL is missing. Please check .env, Jenkinsfile, Docker, or Kubernetes env.');
        }

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(`Launching URL: ${url}, Attempt: ${attempt}`);
                await this.page.goto(url, {
                    waitUntil: 'domcontentloaded',
                    timeout: 60000
                });
                return;
            } catch (error) {
                console.log(`Launch failed on attempt ${attempt}: ${error.message}`);

                if (attempt === 3) {
                    throw error;
                }

                await this.page.waitForTimeout(3000);
            }
        }    
    }
}

module.exports = BasePage;