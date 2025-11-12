/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: 'tests',
  testMatch: /.*\.js$/, // biar 01_Data.js ikut discan
  testIgnore: [],

  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off'
  },

  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } }
  ],

  reporter: [['html', { open: 'never' }]]
};
module.exports = config;
