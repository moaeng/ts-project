import { useEffect } from "react";
import { useAppContext } from "../../AppContext";

const Products: React.FC = () => {
  const { cartItems, updateCartItems, products, updateProducts } =
    useAppContext();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch("/api");
        const data = await response.json();
        updateProducts(data);
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
          user_id: 5,
          product_id: productId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        const newCartItem = await response.json();
        const updatedCartItems = [...cartItems, newCartItem];
        updateCartItems(updatedCartItems);
        console.log(updatedCartItems);
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
        <div key={product.product_id}>
          <p>{product.name}</p>
          <button onClick={() => addToCart(product.product_id)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};
export default Products;
