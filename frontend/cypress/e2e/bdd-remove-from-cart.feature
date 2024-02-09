Feature: Remove from cart

Scenario: User removes a product from the cart
    Given the user has items in the cart
    When the user removes a product from the cart
    Then the cart should display the updated item count