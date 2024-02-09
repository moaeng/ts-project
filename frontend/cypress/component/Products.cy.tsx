import { CartProvider } from "../../CartContext";
import App from "../../src/App";

describe("Products component", () => {
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

  it("renders all products with add to cart button", () => {
    cy.wait("@getProducts");

    cy.get(".Products").should("exist");

    cy.get(".Product").should("have.length.gt", 0);

    cy.get(".ProductImage").should("be.visible");
    cy.intercept("POST", "/api/add", (req) => {
      req.reply({ status: 200, body: {} });
    }).as("addToCart");
    cy.get(".AddToCartBtn").click();

    cy.get(".Navbar .CartBtn").should("contain", "1");
  });
});
