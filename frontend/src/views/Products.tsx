import { useEffect, useState } from "react";
import { useCart } from "../../CartContext";
import { Product } from "../../types";
import { ShoppingCart } from "lucide-react";
import "./Products.scss";

const Products: React.FC = () => {
  const { cart, updateCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch("/api");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    getProducts();
  }, []);

  const addToCart = async (productId: number) => {
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

  return (
    <div className="Products">
      {products.map((product) => (
        <div className="Product" key={product.product_id}>
          <div className="ProductHeader">
            <h2 className="ProductName">{product.name}</h2>
            <span>{product.price}</span>
          </div>
          <div className="ImageContainer">
            <img src={product.image_url} className="ProductImage"></img>
            <button
              className="CartBtn"
              onClick={() => addToCart(product.product_id)}
            >
              <ShoppingCart />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Products;
