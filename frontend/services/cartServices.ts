import { CartItem } from "../types";

export interface FetchCartItemsService {
  updateCart: (newCart: CartItem[]) => void;
}

export interface RemoveFromCartService {
  cart: CartItem[];
  cartItemId: number;
  updateCart: (newCart: CartItem[]) => void;
}

export const fetchCartItemsService = async ({
  updateCart,
}: FetchCartItemsService): Promise<void> => {
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

export const addToCartService = async (
  productId: number,
  updateCart: (newCart: CartItem[]) => void,
  cart: CartItem[]
): Promise<void> => {
  try {
    const response = await fetch("/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: 1,
      }),
    });

    if (response.ok) {
      const newCartItem = await response.json();
      updateCart([...cart, newCartItem]);
      console.log("cartItems", newCartItem);
    } else {
      const errorData = await response.json();
      console.error(
        "Failed to add product to cart. Server error:",
        errorData.error
      );
    }
  } catch (error) {
    console.error("Error adding product to cart", error);
  }
};

export const removeFromCartService = async ({
  cart,
  cartItemId,
  updateCart,
}: RemoveFromCartService): Promise<void> => {
  try {
    const response = await fetch("/api/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart_item_id: cartItemId,
      }),
    });

    if (response.ok) {
      const updatedCart = cart.filter(
        (item) => item.cart_item_id !== cartItemId
      );
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
