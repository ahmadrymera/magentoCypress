const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const { allureCypress } = require("allure-cypress/reporter");
const fs = require("fs");

async function setupNodeEvents(on, config) {
  // Setup Cucumber Preprocessor
  await preprocessor.addCucumberPreprocessorPlugin(on, config);
  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin.default(config)],
    })
  );

  // Setup Allure Reporter
  allureCypress(on, config);

  // Remove video if not failure
  on("after:spec", (spec, results) => {
    if (results && results.video && results.stats.failures === 0) {
      fs.unlinkSync(results.video);
    }
  });

  // Fullscreen browser
  on("before:browser:launch", (browser = {}, launchOptions) => {
    if (browser.family === "chromium" && browser.name !== "electron") {
      launchOptions.args.push("--start-fullscreen");
    }
    if (browser.name === "electron") {
      launchOptions.preferences.fullscreen = true;
    }
    return launchOptions;
  });

  return config;
}

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://magento.softwaretestingboard.com",
    chromeWebSecurity: false,
    trashAssetsBeforeRuns: true,
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/tests/**/*.feature",
    viewportWidth: 1920,
    viewportHeight: 1080,
    env: {
      allure: true,
      allureResultsPath: "allure-results",
      allureReuseAfterSpec: true,
    },
    setupNodeEvents,
  },
});