const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");
const fs = require("fs");

async function setupNodeEvents(on, config) {
  // Prepare for Cypress cucumber preprocessor
  // See: https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/examples/esbuild-cjs/cypress.config.js
  await preprocessor.addCucumberPreprocessorPlugin(on, config);
  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin.default(config)],
    })
  );

  allureWriter(on, config);
  // Delete videos when there's no error so we don't need to compress and upload them.
  // See: https://docs.cypress.io/api/plugins/after-spec-api#Delete-the-recorded-video-if-the-spec-passed
  on("after:spec", (spec, results) => {
    // Do we have failures?
    if (results && results.video && results.stats.failures === 0) {
      // delete the video if the spec passed
      fs.unlinkSync(results.video);
    }
  });

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://magento.softwaretestingboard.com",
    chromeWebSecurity: false,
    trashAssetsBeforeRuns: true,
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/tests/**/*.feature",
    setupNodeEvents,
    allure: true,
    viewportWidth: 1920,
    viewportHeight: 1080
  },
  setupNodeEvents(on, config) {
    on("before:browser:launch", (browser = {}, launchOptions) => {
      if (browser.family === "chromium" && browser.name !== "electron") {
        launchOptions.args.push("--start-fullscreen");

        return launchOptions;
      }

      if (browser.name === "electron") {
        launchOptions.preferences.fullscreen = true;

        return launchOptions;
      }
    });
    on('file:preprocessor', webpackPreprocessor);
    allureWriter(on, config);
    return config;
  },
  
});
