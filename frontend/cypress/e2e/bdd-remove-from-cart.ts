import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";

Given("the user has items in the cart", () => {
  cy.visit("http://localhost/");
  cy.request({
    method: "POST",
    url: "http://localhost/api/add",
    body: {
      cart_id: 1,
      product_id: 2,
      quantity: 1,
    },
  }).as("setupCart");
});

When("the user removes a product from the cart", () => {
  // Click on the cart button in the navbar to navigate to /cart
  cy.get(".Navbar .CartBtn").click();

  // Wait for the cart to load and ensure it exists
  cy.get(".Cart").should("exist");

  // Wait for a short delay before attempting to click on the remove button
  cy.wait(1000); // Adjust the delay time as needed

  // Click on the remove button for the first cart item
  cy.get(".ImageContainer .RemoveBtn").first().click();
});

Then("the cart should display the updated item count", () => {
  // Verify that the cart item count is updated after removing an item
  cy.get(".Navbar .CartBtn").should("contain", "1"); // Adjust the expected item count as necessary
});
