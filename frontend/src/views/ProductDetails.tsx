import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../types";
import "./ProductDetails.scss";
import { addToCartService } from "../../services/cartServices";
import { useCart } from "../../CartContext";

const ProductDetails: React.FC = () => {
  const { cart, updateCart } = useCart();

  const { id } = useParams<{ id: string }>();
  console.log("Received id from useParams:", id);

  const productId = parseInt(id!, 10);

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        console.log("Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched product details:", data);
          setProduct(data);
        } else {
          console.error(
            "Failed to fetch product details. Status:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching product details: ", error);
      }
    };

    if (!isNaN(productId)) {
      fetchProductDetails();
    }
  }, [productId]);

  const addToCart = async (productId: number) => {
    await addToCartService(productId, updateCart, cart);
  };

  return (
    <div className="ProductDetails">
      {product ? (
        <>
          <div className="ProductInfo">
            <h2 className="ProductName">{product.name}</h2>{" "}
            <span>€{product.price}</span>
          </div>
          <div className="ImageContainer">
            <img src={product.image_url} className="ProductImage" />
          </div>
          <p className="ProductDesc">{product.description}</p>
          <button
            className="Checkout"
            onClick={() => addToCart(product.product_id)}
          >
            Add to cart
          </button>
        </>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  );
};

export default ProductDetails;
