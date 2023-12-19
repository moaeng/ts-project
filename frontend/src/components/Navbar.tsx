import { Link } from "react-router-dom";
import "./Navbar.scss";

function Navbar() {
  return (
    <div className="Navbar">
      <h1 className="Logo">Shop</h1>
      <ul className="List">
        <li className="ListItem">
          <Link to="/">Account</Link>
        </li>
        <li className="ListItem">
          <Link to="/">Cart</Link>
        </li>
      </ul>
    </div>
  );
}
export default Navbar;
