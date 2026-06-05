// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config= ({ 
  testDir: './tests',
  timeout: 40 * 1000,
  expect: {
    timeout: 5000,
  },
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    [['html', { outputFolder: 'playwright-report', open: 'never' }]],,
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['list']
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    browserName: 'chromium',
    headless: process.env.CI ? false : false,
    viewport: null,  // {width:720, height:720} -- the screen size you want to run
    //...devices['iphone 11']-- array of devices
    launchOptions: {
      args: process.env.CI ? ['--disable-dev-shm-usage'] : ['--start-maximized']
    },
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    trace: process.env.CI ? 'on-first-retry' : 'off',
  },
  
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
module.exports = config; // available across all file in project, can be imported in any file, commonjs export syntax//

/* -If SSL cert issue , put : ignoreHTTPSErrors: true, 
as wells "Allow location then -permissions:['geolocation']" 
  - Rather than ss, if we wnat video recording then in use property, 
  use video: 'on-first-retry'
  "retain-on-failure" -- record when test case fails, 
  "on" -- record all the time, 
  "off" -- record none of the time.
-- generate logs in PW -- traces: 'on' in use property,
--When tests are flaky, we can use retries: 1 or 2 in config to retry the test 
case 2 times before marking it as failed.
  */