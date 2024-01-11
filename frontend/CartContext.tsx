import React, { createContext, useReducer, useContext, ReactNode } from "react";

export interface Product {
  product_id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
}

export interface CartItem {
  cart_item_id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  subtotal: number;
  product: Product; // Add a nested product field
}
type CartContextType = {
  cart: CartItem[];
  updateCart: (newCart: CartItem[]) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

const cartReducer = (
  state: CartItem[],
  action: { type: string; payload: CartItem[] }
): CartItem[] => {
  switch (action.type) {
    case "UPDATE_CART":
      return action.payload;
    default:
      return state;
  }
};
const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatchCart] = useReducer(cartReducer, []);

  const updateCart = (newCart: CartItem[]) => {
    dispatchCart({ type: "UPDATE_CART", payload: newCart });
  };

  return (
    <CartContext.Provider value={{ cart, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };
