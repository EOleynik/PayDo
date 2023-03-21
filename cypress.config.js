const { defineConfig } = require('cypress')

module.exports = defineConfig({
  waitForAnimations: true,
  chromeWebSecurity: false,
  projectId: 's4n8mx',
  viewportHeight: 1080,
  viewportWidth: 1920,
  watchForFileChanges: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://account.paydo.com/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
