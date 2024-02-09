import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";

before(() => {
  // Before the test, send a DELETE request to clear the cart
  cy.request("DELETE", "http://localhost/api/cart/clear");
});

Given("the user is on the product page", () => {
  cy.visit("http://localhost/");
});

When("the user adds a product to the cart", () => {
  cy.get(".Product").first().find(".AddToCartBtn").click();
});

Then("the cart should display the updated item count", () => {
  cy.get(".Navbar .CartBtn").should("contain", "1"); // Update the expected item count as necessary
});
