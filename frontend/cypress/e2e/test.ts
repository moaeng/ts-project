import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";

Given("the user is on the product page", () => {
  cy.visit("http://localhost/");
});

When("the user adds a product to the cart", () => {
  cy.get(".Product").first().find(".CartBtn").click();
});

Then("the cart should display the updated item count", () => {
  cy.get(".Navbar .Cart").should("contain", "1");
});

Given("the user has items in the cart", () => {
  cy.request({
    method: "POST",
    url: "http://localhost/api/cart/add",
    body: {
      cart_id: 1,
      product_id: 2,
      quantity: 1,
    },
  }).as("setupCart");
  cy.wait("@setupCart").its("status").should("eq", 201);
});

When("the user removes a product from the cart", () => {
  cy.get(".Cart .RemoveBtn").first().click();
});

Then("the cart should display the updated item count", () => {
  cy.get(".Navbar .Cart");
});
