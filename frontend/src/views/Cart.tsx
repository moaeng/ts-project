import { useEffect } from "react";
import { useCart } from "../../CartContext";
import {
  fetchCartItemsService,
  removeFromCartService,
} from "../../services/cartServices";
import { X } from "lucide-react";
import "./Cart.scss";
import { Link } from "react-router-dom";

const Cart: React.FC = () => {
  const { cart, updateCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      await fetchCartItemsService({ updateCart });
    };
    fetchData();
  }, []);

  const handleRemoveFromCart = async (cartItemId: number) => {
    await removeFromCartService({ cart, cartItemId, updateCart });
  };

  return (
    <div className="Cart">
      <h2 className="CartHeading">Your cart</h2>
      {cart.map((item) => (
        <>
          <div className="CartItem" key={item.cart_item_id}>
            <div className="ProductInfo">
              <h2 className="ProductName">{item.product.name}</h2>
              <span>€{item.product.price}</span>
            </div>

            <div className="ImageContainer">
              <Link to={`/products/${item.product.product_id}`}>
                <img
                  src={item.product.image_url}
                  className="ProductImage"
                ></img>
              </Link>
              <button
                className="RemoveBtn"
                onClick={() => handleRemoveFromCart(item.cart_item_id)}
              >
                <X />
              </button>
            </div>

            <p className="ProductDesc">{item.product.description}</p>
          </div>
          <div className="SmallDivider"></div>
        </>
      ))}

      <button className="Checkout">Checkout</button>
    </div>
  );
};
export default Cart;
