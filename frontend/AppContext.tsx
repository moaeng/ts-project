import React, { ReactNode, createContext, useContext, useState } from "react";

export interface Product {
  product_id: number;
  name: string;
  description: string | null;
  price: number;
}

export interface CartItem {
  cart_item_id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  subtotal: number;
}

interface ContextProps {
  cartItems: CartItem[];
  products: Product[];
  updateCartItems: (newCartItems: CartItem[]) => void;
  updateProducts: (newProducts: Product[]) => void;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<ContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const updateCartItems = (newCartItems: CartItem[]) => {
    setCartItems(newCartItems);
  };

  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  return (
    <AppContext.Provider
      value={{ cartItems, updateCartItems, products, updateProducts }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};
