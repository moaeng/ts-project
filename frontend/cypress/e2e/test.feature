Feature: Add to and remove from cart

Scenario: User adds a product to the cart
    Given the user is on the product page
    When the user adds a product to the cart
    Then the cart should display the updated item count

Scenario: User removes a product from the cart
    Given the user has items in the cart
    When the user removes a product from the cart
    Then the cart should display the updated item count