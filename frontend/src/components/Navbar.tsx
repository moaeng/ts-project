import { Link } from "react-router-dom";
import "./Navbar.scss";
import { useEffect, useState } from "react";
import { useCart } from "../../CartContext";
import { CartItem } from "../../types";

function Navbar() {
  const { cart } = useCart();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/cart");
        if (response.ok) {
          const data = await response.json();
          const itemCount = data.cartItems.reduce(
            (acc: number, item: CartItem) => acc + item.quantity,
            0
          );
          setCartCount(itemCount);
        } else {
          console.error("Failed to fetch cart items");
        }
      } catch (error) {
        console.error("Error fetching cart items", error);
      }
    };
    fetchCartItems();
  }, [cart]);

  return (
    <>
      <div className="Navbar">
        <Link to="/" className="Logo">
          Naturally
        </Link>
        <div className="List">
          <div className="ListItem">
            <p>cart</p>
            <button className="CartBtn">
              <Link to="/cart"> {cartCount} </Link>
            </button>
          </div>
        </div>
      </div>
      <div className="Divider"></div>
    </>
  );
}
export default Navbar;
