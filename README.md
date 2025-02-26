# Automated Testing with Cypress + Cucumber + Allure for Magento

This repository contains automated tests for the [Magento Demo](https://magento.softwaretestingboard.com/) website. The purpose of this project is to provide a practical and learning-focused approach to automation testing.

## Getting Started

Follow these steps to get started with the project:

1. Clone the repository:

   ```bash
   git clone https://github.com/ahmadrymera/magentoCypress
   ```

2. Navigate to the repository:

   ```bash
   cd magentoCypress
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

Optional:
4. Update your Google Chrome to the latest version
5. Log in as a registered user and remove all items in your cart
6. Change the email and password for the login step with yours

## Running Tests

Use the following npm scripts to execute tests and generate Allure reports:

```bash
npx cypress open        # Open Cypress GUI
npm run test:all       # Run all tests in headless mode using Chrome browser
npm run allure:report   # Generate Allure report
npm run allure:open   # Generate Allure report
npm run allure:clear    # Clear previous Allure results and screenshots
```

## Test Structure

The automated tests utilize Cypress with Cucumber for behavior-driven development (BDD) and Allure for comprehensive reporting. Test scenarios are defined in `.feature` files located in the `cypress/tests` directory. Step definitions are defined in `.js` files located in the `cypress/step_definitions` directory.

## Contributing

Contributions to enhance and expand the test suite are welcome. Feel free to open issues or pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Testing! 🚀**
