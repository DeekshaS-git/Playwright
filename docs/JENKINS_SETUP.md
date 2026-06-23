# Jenkins CI-CD Setup Guide for Playwright Test Framework

## Overview
This guide provides step-by-step instructions to set up a complete CI-CD pipeline using Jenkins for your Playwright test framework.

## Prerequisites
- Jenkins server (v2.300+) installed and running
- Node.js (v18+) and npm installed on Jenkins agent/controller
- Playwright browser binaries
- Git repository with your test code

## Jenkins Installation & Configuration

### 1. Jenkins Plugins Required
Install the following plugins via **Manage Jenkins > Manage Plugins**:

- **Pipeline** (Declarative Pipeline)
- **Git plugin**
- **HTML Publisher Plugin**
- **JUnit plugin** (for test result parsing)
- **Node and Label parameter plugin** (optional)
- **Log Parser Plugin** (optional, for better logging)
- **Email Extension Plugin** (for notifications)
- **Slack Notification Plugin** (for Slack integration)

### 2. Node.js Configuration in Jenkins

1. Go to **Manage Jenkins > Global Tool Configuration**
2. Scroll to **NodeJS**
3. Click **Add NodeJS**
   - Name: `NodeJS-18` (or your preferred version)
   - Version: `18.x` (LTS recommended)
   - Check "Install automatically"
4. Save

## Project Setup

### 3. Create Jenkins Job

#### Option A: Pipeline Job (Recommended)
1. Click **New Item**
2. Enter job name: `Playwright-Tests`
3. Select **Pipeline**
4. Click **OK**

#### Option B: Freestyle Job
1. Click **New Item**
2. Enter job name: `Playwright-Tests`
3. Select **Freestyle job**
4. Click **OK**

### 4. Pipeline Configuration

**For Pipeline Job:**

1. In **Pipeline** section, choose:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: Your Git repository URL
   - **Branch**: `*/main` (or your default branch)
   - **Script Path**: `Jenkinsfile` (default)

2. Save and Build

**For Freestyle Job:**

1. **Source Code Management**:
   - Select **Git**
   - Repository URL: Your Git repository URL
   - Branch: `*/main`

2. **Build Environment**:
   - Check **Use secret text(s) or file(s)**
   - Select **NodeJS Installation**: `NodeJS-18`

3. **Build** section:
   - Add build step: **Execute shell**
   ```bash
   npm install
   npx playwright install
   npm run test:ci
   ```

4. **Post-build Actions**:
   - **Publish HTML Reports**:
     - HTML directory: `playwright-report`
     - Index page: `index.html`
     - Report title: `Playwright Test Report`
   
   - **Publish JUnit test result report**:
     - Test report XMLs: `test-results/**/*.xml`

5. Save

## Jenkinsfile Explanation

The included `Jenkinsfile` contains:

```
Stages:
├── Checkout - Pulls code from Git
├── Install Dependencies - Installs npm packages & Playwright browsers
├── Run Tests - Executes Playwright tests
└── Post Actions - Publishes reports & archives artifacts
```

**Key Features:**
- ✅ HTML report generation
- ✅ JUnit XML test results
- ✅ Screenshot & artifact archiving
- ✅ Build cleanup
- ✅ Success/Failure notifications

## Configuration Details

### Environment Variables

The Jenkinsfile uses these environment variables:
- `NODE_ENV=ci` - Sets CI mode
- `CI=true` - Triggers CI-specific behavior in playwright.config.js

### Playwright Configuration for CI

The `playwright.config.js` automatically adjusts for CI:
- **Headless Mode**: Enabled in CI
- **Screenshots**: Captured on failure only
- **Videos**: Recorded on test retry
- **Traces**: Enabled for debugging
- **Reporter Format**: HTML + JUnit XML

## Git Integration

### 1. Connect Jenkins to Repository

**For GitHub:**
1. Go to job **Configuration**
2. Under **Build Triggers**, check **GitHub hook trigger for GITScm polling**
3. Set webhook in GitHub repo: `Settings > Webhooks > Add webhook`
4. Payload URL: `http://your-jenkins-server/github-webhook/`
5. Events: `push` & `pull_request`

**For GitLab:**
1. Go to job **Configuration**
2. Under **Build Triggers**, check **Build when a change is pushed to GitLab**
3. Set webhook in GitLab: `Settings > Webhooks`
4. URL: `http://your-jenkins-server/project/Playwright-Tests`

### 2. Branch Configuration

Edit Jenkinsfile to configure multiple branches:
```groovy
pipeline {
    parameters {
        choice(name: 'BRANCH', choices: ['main', 'develop'], description: 'Select branch')
    }
}
```

## Reports & Artifacts

### Test Reports Location
- **HTML Report**: `playwright-report/index.html`
- **JUnit XML**: `test-results/results.xml`
- **Screenshots**: `screenshots/` (on failure)
- **Videos**: `test-results/` (on retry)

### Accessing Reports
1. After test completion, click **Playwright Test Report** on job page
2. Or go to **Build > Artifacts** to download reports

## Notifications

### Email Notifications

Add to Jenkinsfile:
```groovy
post {
    failure {
        emailext(
            subject: "Tests Failed: ${JOB_NAME} - ${BUILD_NUMBER}",
            body: "Build ${BUILD_URL} failed",
            to: "your-email@example.com"
        )
    }
}
```

### Slack Notifications

Add to Jenkinsfile:
```groovy
post {
    always {
        slackSend(
            color: currentBuild.result == 'SUCCESS' ? 'good' : 'danger',
            message: "Test Results: ${JOB_NAME} #${BUILD_NUMBER}"
        )
    }
}
```

## Advanced Configuration

### 1. Parallel Test Execution

Modify Jenkinsfile to run tests in parallel:
```groovy
stages {
    stage('Run Tests - Parallel') {
        parallel {
            stage('Chrome') {
                steps {
                    sh 'npm run test -- --project=chromium'
                }
            }
            stage('Firefox') {
                steps {
                    sh 'npm run test -- --project=firefox'
                }
            }
        }
    }
}
```

### 2. Test Result Trending

1. Install **Plot Plugin**
2. Add post-build step to track metrics over time

### 3. Scheduled Builds (Nightly Tests)

1. Go to job **Configuration**
2. Under **Build Triggers**, check **Build periodically**
3. Enter cron expression: `H 2 * * *` (2 AM daily)

### 4. Integration with Test Management

For Xray/TestRail integration, add:
```groovy
stage('Export Results') {
    steps {
        sh 'npm run export-results'
    }
}
```

## Troubleshooting

### Issue: `Playwright browser not found`
**Solution**: Add to Jenkinsfile before tests:
```bash
npm install
npx playwright install chromium
```

### Issue: `Out of memory during tests`
**Solution**: Configure Jenkins agent memory:
```groovy
environment {
    NODE_OPTIONS = "-Xmx2g"
}
```

### Issue: `Tests timeout in CI`
**Solution**: Increase timeout in playwright.config.js:
```javascript
timeout: 60 * 1000, // Increased to 60 seconds
```

### Issue: `Screenshots not captured`
**Solution**: Ensure screenshot setting in playwright.config.js:
```javascript
use: {
    screenshot: 'only-on-failure'
}
```

## Performance Optimization

1. **Cache npm modules**: Use Jenkins artifact caching
2. **Reuse browser cache**: Store Playwright browsers across builds
3. **Parallel execution**: Run tests across multiple agents
4. **Fail fast**: Stop test suite on first failure with `--failOnConsoleError`

## Security Best Practices

1. **Use Jenkins Credentials** for sensitive data
2. **Enable script approval** for Pipeline jobs
3. **Restrict job permissions** to authorized users
4. **Encrypt secrets** in environment variables
5. **Use HTTPS** for Jenkins server

## Maintenance

### Regular Tasks

- **Weekly**: Review test failure trends
- **Monthly**: Update Playwright version
- **Quarterly**: Clean old build artifacts
- **Yearly**: Review and update pipeline security

### Useful Commands

```bash
# View available Jenkins CLI commands
java -jar jenkins-cli.jar -s http://localhost:8080 help

# Trigger job from command line
java -jar jenkins-cli.jar -s http://localhost:8080 build "Playwright-Tests"
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Playwright Test Reporters](https://playwright.dev/docs/test-reporters)
- [Jenkins Global Tool Configuration](https://www.jenkins.io/doc/book/managing/tool-installation/)

---

**For support or issues**, refer to the project README or Jenkins logs at: `$JENKINS_HOME/logs/`
