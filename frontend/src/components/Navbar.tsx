import { Link } from "react-router-dom";
import "./Navbar.scss";
import { useEffect, useState } from "react";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/cart");
        if (response.ok) {
          const data = await response.json();
          const itemCount = data.cartItems.length;
          setCartCount(itemCount);
        } else {
          console.error("Failed to fetch cart items");
        }
      } catch (error) {
        console.error("Error fetching cart items", error);
      }
    };
    fetchCartItems();
  });

  return (
    <div className="Navbar">
      <h1 className="Logo">Shop</h1>
      <ul className="List">
        <li className="ListItem">
          <Link to="/">Account</Link>
        </li>
        <li className="ListItem">
          <Link to="/">{cartCount}</Link>
        </li>
      </ul>
    </div>
  );
}
export default Navbar;
