import { CartProvider } from "../../CartContext";
import App from "../../src/App";

describe("Product details component", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api", { fixture: "products.json" }).as("getProducts");
    cy.intercept("POST", "/api/add", { fixture: "cartItems.json" }).as(
      "addToCart"
    );

    cy.mount(
      <CartProvider>
        <App />
      </CartProvider>
    );
  });

  it("navigates to details about product when clicking on image", () => {
    cy.wait("@getProducts");
    cy.get(".ProductImage").first().click();
    cy.url().should("include", "/products/");
    cy.get(".ProductDetails").should("exist");

    cy.intercept("POST", "/api/cart/add", (req) => {
      req.reply({ status: 200, body: {} });
    }).as("addToCart");

    cy.get(".Checkout").click();
    cy.wait("@addToCart");
    cy.get(".Navbar .CartBtn").should("contain", "1");
  });
});
