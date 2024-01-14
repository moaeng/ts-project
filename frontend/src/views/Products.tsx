import { useEffect, useState } from "react";
import { useCart } from "../../CartContext";
import { Product } from "../../types";
import "./Products.scss";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { addToCartService } from "../../services/cartServices";

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
    await addToCartService(productId, updateCart, cart);
  };

  return (
    <div className="Products">
      {products.map((product) => (
        <div className="Product" key={product.product_id}>
          <div className="ProductHeader"></div>
          <div className="ImageContainer">
            <Link to={`/products/${product.product_id}`}>
              <img src={product.image_url} className="ProductImage"></img>
            </Link>
            <button
              className="CartBtn"
              onClick={() => addToCart(product.product_id)}
            >
              <ShoppingCart className="Icon" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Products;
