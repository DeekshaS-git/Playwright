# Environment-Specific Configurations

## Example .env Files for Different Environments

### .env.local (Development)
```bash
# Development environment configuration
ENVIRONMENT=local
BASE_URL=http://localhost:3000
HEADLESS=false
BROWSER=chromium
DEBUG=true
SCREENSHOT_ON_FAILURE=false
VIDEO_RECORDING=off
```

### .env.staging (Staging)
```bash
# Staging environment configuration
ENVIRONMENT=staging
BASE_URL=https://staging.rahulshettyacademy.com
HEADLESS=true
BROWSER=chromium
DEBUG=false
SCREENSHOT_ON_FAILURE=true
VIDEO_RECORDING=retain-on-failure
TIMEOUT=60000
```

### .env.production (Production)
```bash
# Production environment configuration
ENVIRONMENT=production
BASE_URL=https://rahulshettyacademy.com
HEADLESS=true
BROWSER=chromium
DEBUG=false
SCREENSHOT_ON_FAILURE=true
VIDEO_RECORDING=retain-on-failure
TIMEOUT=120000
PARALLEL_WORKERS=4
```

## Jenkins Environment Variables

Set these in Jenkins Manage Jenkins > Configure System > Environment variables:

```
JENKINS_JAVA_OPTIONS=-Xmx2g -Xms512m
NODE_ENV=ci
CI=true
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=false
```

## Dynamic Jenkinsfile Configuration

You can create a configurable Jenkinsfile that uses environment-specific settings:

```groovy
pipeline {
    agent any
    
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['local', 'staging', 'production'],
            description: 'Target environment'
        )
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Browser to test'
        )
    }
    
    environment {
        CI = 'true'
    }
    
    stages {
        stage('Setup') {
            steps {
                script {
                    // Load environment-specific config
                    env.BASE_URL = sh(
                        script: "echo \${${params.ENVIRONMENT.toUpperCase()}_BASE_URL}",
                        returnStdout: true
                    ).trim()
                    
                    echo "🎯 Environment: ${params.ENVIRONMENT}"
                    echo "🌐 Base URL: ${env.BASE_URL}"
                    echo "🔷 Browser: ${params.BROWSER}"
                }
                
                sh 'npm install'
                sh 'npx playwright install'
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    def browserArgs = params.BROWSER == 'all' ? '' : "--project=${params.BROWSER}"
                    
                    sh """
                        export BASE_URL=${env.BASE_URL}
                        npm run test:ci ${browserArgs}
                    """
                }
            }
        }
    }
    
    post {
        always {
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: "${params.ENVIRONMENT} - Playwright Report",
                keepAll: true
            ])
            
            junit testResults: 'test-results/**/*.xml', 
                   allowEmptyResults: true
        }
    }
}
```

## Database Seeding for Different Environments

Create scripts for environment-specific test data:

### scripts/seed-data.js
```javascript
const fs = require('fs');

const environments = {
    local: {
        baseUrl: 'http://localhost:3000',
        apiUrl: 'http://localhost:3001/api',
        credentials: {
            username: 'testuser@local',
            password: 'TestPassword123'
        }
    },
    staging: {
        baseUrl: 'https://staging-app.com',
        apiUrl: 'https://staging-api.com',
        credentials: {
            username: process.env.STAGING_USERNAME,
            password: process.env.STAGING_PASSWORD
        }
    },
    production: {
        baseUrl: 'https://app.com',
        apiUrl: 'https://api.com',
        credentials: {
            username: process.env.PROD_USERNAME,
            password: process.env.PROD_PASSWORD
        }
    }
};

module.exports = environments[process.env.ENVIRONMENT || 'local'];
```

## Test Data Management

### test-data/users.json
```json
{
    "local": {
        "validUser": {
            "email": "deekshasharma@ymail.com",
            "password": "Deeksha@123"
        },
        "invalidUser": {
            "email": "invalid@ymail.com",
            "password": "wrongpassword"
        }
    },
    "staging": {
        "validUser": {
            "email": "qa-staging@example.com",
            "password": "StagingPass123"
        },
        "invalidUser": {
            "email": "invalid-staging@example.com",
            "password": "wrongpassword"
        }
    },
    "production": {
        "validUser": {
            "email": "qa-prod@example.com",
            "password": "ProdPass123"
        },
        "invalidUser": {
            "email": "invalid-prod@example.com",
            "password": "wrongpassword"
        }
    }
}
```

## Using Environment-Specific Config in Tests

### tests/Login.spec.js (Updated)
```javascript
const { test, expect } = require('@playwright/test');
const testData = require('../test-data/users.json');
const config = require('../scripts/seed-data');

const env = process.env.ENVIRONMENT || 'local';
const users = testData[env];

test('Login with valid credentials', async ({ page }) => {
    await page.goto(`${config.baseUrl}/login`);
    
    await page.fill('input[type="email"]', users.validUser.email);
    await page.fill('input[type="password"]', users.validUser.password);
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/dashboard/);
});

test('Login with invalid credentials', async ({ page }) => {
    await page.goto(`${config.baseUrl}/login`);
    
    await page.fill('input[type="email"]', users.invalidUser.email);
    await page.fill('input[type="password"]', users.invalidUser.password);
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error-message')).toBeVisible();
});
```

## CI-CD Specific Variables

### For Different CI Providers

**Jenkins:**
```bash
NODE_ENV=ci
CI=true
BUILD_ID=${BUILD_ID}
BUILD_NUMBER=${BUILD_NUMBER}
```

**GitHub Actions:**
```bash
NODE_ENV=ci
CI=true
GITHUB_RUN_ID=${GITHUB_RUN_ID}
```

**GitLab CI:**
```bash
NODE_ENV=ci
CI=true
CI_PIPELINE_ID=${CI_PIPELINE_ID}
```

---

## Best Practices

1. **Never commit secrets** - Use Jenkins credentials or environment variables
2. **Use .env.example** - Document required variables without values
3. **Environment parity** - Keep test data consistent across environments
4. **Version control** - Don't add .env files to git (add to .gitignore)
5. **Rotation** - Regularly rotate credentials in production environment

---

## Testing Different Environments

```bash
# Test local environment
ENVIRONMENT=local npm run test

# Test staging environment
ENVIRONMENT=staging npm run test

# Test production environment
ENVIRONMENT=production npm run test
```

This structure allows you to seamlessly switch between environments while maintaining the same test suite!
