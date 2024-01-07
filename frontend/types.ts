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
