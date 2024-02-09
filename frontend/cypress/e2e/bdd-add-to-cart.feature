Feature: Add to cart

Scenario: User adds a product to the cart
    Given the user is on the product page
    When the user adds a product to the cart
    Then the cart should display the updated item count