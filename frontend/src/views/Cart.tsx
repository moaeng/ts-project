import { useEffect } from "react";
import { useCart } from "../../CartContext";
import { X } from "lucide-react";

const Cart: React.FC = () => {
  const { cart, updateCart } = useCart();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/cart");
        if (response.ok) {
          const data = await response.json();
          const cartItems = data.cartItems || [];
          updateCart(cartItems);
        }
      } catch (error) {
        console.error("Error fetching cart items", error);
      }
    };
    fetchCartItems();
  }, []);

  const removeFromCart = async (productId: number) => {
    try {
      const response = await fetch(`/api/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const removedCartItem = data.removedCartItem;
        const updatedCart = [...cart];

        const indexToRemove = updatedCart.findIndex(
          (item) => item.product_id === removedCartItem.product_id
        );

        if (indexToRemove !== -1) {
          updatedCart.splice(indexToRemove, 1);
        }

        updateCart(updatedCart);
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to remove item from cart. Server error: ",
          errorData.error
        );
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };
  /*  const groupItemsById = () => {
    const groupedItems: { [key: number]: number } = {};

    cart.forEach((item) => {
      const productId = item.product_id;

      if (groupedItems[productId]) {
        groupedItems[productId]++;
      } else {
        groupedItems[productId] = 1;
      }
    });
    return groupedItems;
  }; */

  return (
    <div className="Cart">
      <h2 className="CartHeading">Your cart</h2>
      {cart.map((item) => (
        <div className="CartItem" key={item.cart_item_id}>
          <p>{item.product.name}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Price: {item.product.price}</p>
          {/* Add more details as needed */}
          <button
            className="RemoveBtn"
            onClick={() => removeFromCart(item.cart_item_id)}
          >
            <X />
          </button>
        </div>
      ))}
    </div>
  );
};
export default Cart;
