describe("TDD E2E testing", () => {
  it("should interact with FE, BE and DB", () => {
    cy.visit("http://localhost/");
    cy.get(".Products").should("exist");

    cy.request({
      method: "GET",
      url: "http://localhost/api",
    }).as("getProducts");

    cy.get(".ImageContainer button.CartBtn").first().click();

    cy.get(".Navbar .CartBtn a").should("contain", 2);

    cy.reload();

    cy.get(".Navbar .CartBtn a").click();

    cy.get(".Cart").should("exist");

    cy.get(".RemoveBtn").first().click();

    cy.get(".CartItem").should("have.length", 1);
  });
});
