describe("TDD E2E testing", () => {
  it("should interact with FE, BE and DB", () => {
    cy.visit("http://localhost/");
    cy.get(".Products").should("exist");

    cy.request({
      method: "GET",
      url: "http://localhost/api",
    }).as("getProducts");

    cy.wait("@getProducts").its("status").should("eq", 200);

    cy.request({
      method: "POST",
      url: "http://localhost/api/cart/add",
      body: {
        cart_id: 1,
        product_id: 1,
        quantity: 2,
      },
    }).as("addToCart");

    cy.wait("@addToCart").its("status").should("eq", 201);

    cy.get(".Navbar .Cart").should("contain", "2");

    cy.get(".Navbar .Cart").click();

    cy.get(".Cart").should("exist");

    cy.request({
      method: "DELETE",
      url: "http://localhost/api/cart/remove/1",
    }).as("removeFromCart");

    cy.wait("@removeFromCart").its("status").should("eq", 204);
  });
});
