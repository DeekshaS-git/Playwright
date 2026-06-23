# Quick Start: Jenkins CI-CD Setup

## 5-Minute Quick Start

### Step 1: Verify Files Created
Your repository should now contain:
- ✅ `Jenkinsfile` - CI-CD pipeline definition
- ✅ `package.json` - Updated with test scripts
- ✅ `playwright.config.js` - Updated for CI mode
- ✅ `.npmrc` - NPM configuration
- ✅ `JENKINS_SETUP.md` - Complete setup guide
- ✅ `ADVANCED_JENKINSFILE.md` - Advanced examples

### Step 2: Verify Locally (Before Jenkins)

```bash
# Test locally with CI environment
export CI=true
npm install
npx playwright install
npm run test:ci
```

Expected output:
- ✅ Tests run in headless mode
- ✅ Screenshots on failure
- ✅ HTML report generated in `playwright-report/`
- ✅ JUnit XML results in `test-results/`

### Step 3: Jenkins Setup (5 Steps)

1. **Install Jenkins Plugins**
   - Go to: Manage Jenkins > Manage Plugins
   - Install: Pipeline, Git, HTML Publisher, JUnit
   - Restart Jenkins

2. **Configure Node.js**
   - Go to: Manage Jenkins > Global Tool Configuration
   - Add NodeJS 18.x
   - Set "Install automatically"

3. **Create Pipeline Job**
   - Click "New Item"
   - Name: `Playwright-Tests`
   - Select: Pipeline
   - Click OK

4. **Configure Pipeline**
   - In Pipeline section, select: Pipeline script from SCM
   - SCM: Git
   - Repository URL: Your git repo URL
   - Script Path: `Jenkinsfile`

5. **Build**
   - Click "Build Now"
   - Wait for completion
   - View results in "Playwright Test Report"

### Step 4: Connect to Git (Optional but Recommended)

**For Automatic Builds on Push:**

1. Go to your Git repository (GitHub/GitLab)
2. Add webhook:
   - **GitHub**: Settings > Webhooks > Add webhook
   - URL: `http://your-jenkins-url/github-webhook/`
   - Events: push, pull_request

3. In Jenkins job: Enable "GitHub hook trigger"

### Step 5: View Reports

After build completes:
- **HTML Report**: Click "Playwright Test Report" link on job page
- **Test Results**: View in Jenkins UI
- **Artifacts**: Download from Build > Artifacts

---

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| Browsers not found | Run: `npx playwright install` in Jenkins build |
| Timeout errors | Increase `timeout` in `playwright.config.js` |
| Memory issues | Add `-Xmx2g` to NODE_OPTIONS env var |
| No reports generated | Check `playwright-report/` directory exists |
| Tests fail in CI only | Ensure `headless: true` is set for CI mode |

---

## Common Commands

```bash
# Run all tests
npm run test

# Run with UI
npm run test:ui

# Run in debug mode
npm run test:debug

# Run specific test
npm run test -- --grep "Login"

# View HTML report
npm run test:report

# Clean up
rm -rf playwright-report test-results screenshots
```

---

## Next Steps

1. **Configure Notifications**: See "Notifications" section in JENKINS_SETUP.md
2. **Parallel Testing**: See ADVANCED_JENKINSFILE.md for multi-browser setup
3. **Performance Tracking**: Add metrics collection for trending
4. **Slack Integration**: Connect to #qa-team channel for alerts
5. **Scheduled Builds**: Set up nightly test runs

---

## Support

- 📖 Full guide: `JENKINS_SETUP.md`
- 🚀 Advanced examples: `ADVANCED_JENKINSFILE.md`
- 🎯 Playwright docs: https://playwright.dev
- 🏗️ Jenkins docs: https://www.jenkins.io/doc/

---

**Ready to go!** 🎉 Start with Step 2 to verify locally, then proceed to Jenkins setup.
