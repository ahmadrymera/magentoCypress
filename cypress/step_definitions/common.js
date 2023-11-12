// Importing necessary types and functions from Cypress and cucumber preprocessor
/// <reference types="cypress" />
const { Given, Then, When, Step } = require("@badeball/cypress-cucumber-preprocessor");

// Declaring variables to store product data, guest data, and user status
let products, guestData, isGuest;

// Hardcoded customer data for a registered user
let customerData = {
  Email: "gerardo.kling40@ethereal.email",
  FirstName: "Gerardo",
  LastName: "Kling",
  Address: "Goosebump 78 st",
  City: "California",
  State: "California",
  Zip: "82899",
  PhoneNumber: 920000390,
};

// Setting up intercepts for common URLs before each test
beforeEach(() => {
  cy.intercept(
    "/pub/static/version1695896754/frontend/Magento/luma/en_US/Magento_Captcha/template/checkout/captcha.html"
  ).as("Magento_Captcha");
  cy.intercept("/pub/static/version1695896754/frontend/Magento/luma/en_US/Magento_Ui/**").as("Magento_Ui");
  cy.intercept("/pub/static/version1695896754/frontend/Magento/luma/en_US/Magento_Checkout/**").as("Magento_Checkout");
});

// Function to check products in the cart
function checkProducts() {
  for (let i = 0; i < products.length; i++) {
    // Assertions for product details in the cart
    cy.get(".product-item-name").eq(i).should("contain.text", products[i].ProductName);
    cy.get(".details-qty > .value").eq(i).should("contain.text", products[i].Qty);
    // Expanding product details to check size and color
    cy.get(`:nth-child(${i + 1}) > :nth-child(1) > .product-item-details > .product > .toggle > span`).click({
      force: true,
    });
    // Assertions for size and color in the expanded product details
    cy.get(
      `:nth-child(${
        i + 1
      }) > :nth-child(1) > .product-item-details > .product > .content > .item-options > :nth-child(2)`
    ).should("contain.text", products[i].Size);
    cy.get(
      `:nth-child(${
        i + 1
      }) > :nth-child(1) > .product-item-details > .product > .content > .item-options > :nth-child(4)`
    ).should("contain.text", products[i].Color);
  }
}

// Step for user login
Given("the user logged in with the following data:", (dataTable) => {
  const data = dataTable.rowsHash();
  isGuest = true;
  if (data["email"] == "guest") {
    // Navigate to the home page for guest login
    cy.visit("/");
    cy.wait("@Magento_Captcha");
  } else {
    // Log in as a registered user
    isGuest = false;
    cy.visit("/customer/account/login/");
    cy.wait("@Magento_Captcha");
    cy.get("#email").type(data["email"]);
    cy.get("#pass").type(data["password"]);
    cy.get("#send2").click();
    cy.wait("@Magento_Ui");
    cy.get(".block-dashboard-info").should("be.visible");
    cy.url().should("include", "/customer/account/");
  }
});

// Step for adding items to the cart
When("the user puts the following items into the cart:", (dataTable) => {
  // Extract product data from the table and add products to the cart
  products = dataTable.hashes();
  for (const product of products) {
    cy.visit("/" + product.ProductName.replace(/\W+/g, "-") + ".html");
    cy.wait("@Magento_Captcha");
    cy.get(`[aria-label="${product.Size}"]`, { timeout: 60000 }).click();
    cy.get(`[aria-label="${product.Color}"]`).click();
    cy.get("#qty").clear().type(product.Qty);
    cy.get("#product-addtocart-button").click();
    cy.wait("@Magento_Ui");
    cy.get(".message-success > div", { timeout: 60000 }).should(
      "contain.text",
      `\nYou added ${product.ProductName} to your shopping cart.`
    );
  }
});

// Step for navigating to the checkout page
When("the user is navigating to the checkout page", () => {
  // Navigate to the checkout page
  cy.visit("/checkout/#shipping");
  cy.wait(["@Magento_Ui", "@Magento_Checkout"]);
  cy.get("#checkout-loader", { timeout: 60000 }).should("not.exist");
});

// Step for selecting shipping method
When("the user is selecting {string} Shipping option", (shipping) => {
  // Select the shipping option based on the parameter
  cy.get("#checkout-shipping-method-load").scrollIntoView();
  cy.get(`input[value='${shipping === "Flat Rate" ? "flatrate_flatrate" : "tablerate_bestway"}']`).click();
});

// Step for filling checkout data
When("the user is filling checkout data with the following data:", (dataTable) => {
  // Extract guest data from the table and fill in the checkout form
  guestData = dataTable.rowsHash();
  cy.get("#customer-email").type(guestData.Email);
  cy.get('[name="firstname"]').type(guestData.FirstName);
  cy.get('[name="lastname"]').type(guestData.LastName);
  cy.get('[name="street[0]"]').type(guestData.Address);
  cy.get('[name="city"]').type(guestData.City);
  cy.get("select").eq(0).select(guestData.State);
  cy.get('[name="postcode"]').type(guestData.Zip);
  cy.get('[name="telephone"]').type(guestData.PhoneNumber);
});

// Step for verifying items in the checkout page
Then("the items in the checkout page should be correct", () => {
  // Expand the order summary and click the "Next" button
  cy.get(".block > .title").click();
  cy.wait(["@Magento_Ui", "@Magento_Checkout"]);
  cy.get(".button").contains("Next").click();
});

// Step for verifying items in the payment page
Then("the items in the payment page should be correct", () => {
  // Check products on the payment page
  cy.url().should("include", "/checkout/#payment");
  checkProducts();
});

// Step for verifying address consistency
Then("the address should be same with the checkout data", () => {
  cy.url().then((url) => {
    const isOrderPage = url.includes("/sales/order/view/order_id/");
    if (isOrderPage) {
      // Verify address on the order page
      cy.get(".box-order-shipping-address > .box-content > address").should(
        "contain.text",
        isGuest === false ? customerData.Address : guestData.Address
      );
    } else {
      // Verify address on the checkout page
      cy.get(".ship-to > .shipping-information-content").should(
        "contain.text",
        isGuest === true ? guestData.Address : customerData.Address
      );
    }
  });
});

// Step for completing the order and verifying success
Then("the order should be successful", () => {
  // Click "Place Order" and verify the success page
  cy.wait(["@Magento_Ui", "@Magento_Checkout"]);
  cy.get(".payment-method-content > :nth-child(4) > div.primary > .action").contains("Place Order").click();
  cy.url().should("include", "/checkout/onepage/success/");
  cy.get(".checkout-success", { timeout: 60000 }).should("be.visible");
});

// Step for verifying items in the order page
Then("the items in the order page should be correct", () => {
  // View order details and verify items on the order details page
  cy.get(".order-number > strong").click();
  cy.wait("@Magento_Ui");
  cy.url().should("include", "/sales/order/view/order_id/");
  cy.get(".order-details-items").should("be.visible");
  for (let i = 0; i < products.length; i++) {
    // Verify items on the order details page
    cy.get("tbody").find(".col.name > .product").should("contain.text", products[i].ProductName);
    cy.get("tbody").find(".qty > .items-qty > .item > .content").should("contain.text", products[i].Qty);
    cy.get("tbody").find(".col.name > .item-options > :nth-child(2)").should("contain.text", products[i].Size);
    cy.get("tbody").find(".col.name > .item-options > :nth-child(4)").should("contain.text", products[i].Color);
  }
});
