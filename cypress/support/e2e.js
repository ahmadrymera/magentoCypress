// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import "allure-cypress"

// Alternatively you can use CommonJS syntax:
// require('./commands')

/**
 * Take a full page screenshot when the test is failed on headless mode.
 *
 * Note: only the `After` hook Cypress Cucumber Preprocessor is designed not to run when the test is failed. But because
 * we use the afterEach hook from Cypress here, this code will still run.
 *
 * See: https://github.com/badeball/cypress-cucumber-preprocessor/issues/824
 */
afterEach(function () {
  if (this.currentTest.state === 'failed' && !Cypress.config('isInteractive')) {
    // Force all fixed & sticky window to be normal so it shows good in the screenshot
    cy.window().then((win) => {
      const x = win.document.querySelectorAll('*');
      for (let i = 0; i < x.length; i++) {
        const elementStyle = getComputedStyle(x[i]);
        if (elementStyle.position == 'fixed' || elementStyle.position == 'sticky') {
          x[i].style.position = 'absolute';
        }
      }
    });

    // Get the full page screenshot
    cy.screenshot();
  }
});

Cypress.on('uncaught:exception', (err, runnable) => {
  // we expect a 3rd party library error with message 'list not defined'
  // and don't want to fail the test so we return false
  if (err.message.includes('AddFotoramaVideoEvents is not a function') || err.message.includes('Cannot read properties of undefined')) {
    return false
  }
  // we still want to ensure there are no other unexpected
  // errors, so we let them fail the test
})