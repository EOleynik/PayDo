const { defineConfig } = require('cypress')
const fs = require("fs");
const getCompareSnapshotsPlugin = require('./dist/plugin.js');

module.exports = defineConfig({
  screenshotsFolder: '../cypress/snapshots/actual',
  trashAssetsBeforeRuns: true,
  video: false,
  waitForAnimations: true,
  chromeWebSecurity: false,
  projectId: 's4n8mx',
  viewportHeight: 1080,
  viewportWidth: 1920,
  watchForFileChanges: false,
  enw:{
    failSilently: false,
    "ALWAYS_GENERATE_DIFF": false,
    "ALLOW_VISUAL_REGRESSION_TO_FAIL": true},
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    baseUrl: 'https://account.paydo.com/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {

      //getCompareSnapshotsPlugin(on, config),

      on("task", {
        deleteScreenshot () {
          return null
        },
        deleteReport (report) {
          return null
        },
        copyScreenshot (screenshot) {
          return null
        },
        compareSnapshotsPlugin () {
          return null
        },
        doesExist:path => fs.existsSync(path),
        generateReport () {
          return null
        }
      })

    }
  }

})
