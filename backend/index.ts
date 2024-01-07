import express, { Express } from "express";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import { Product, CartItem } from "../frontend/types";

dotenv.config();

const client = new pg.Client({
  connectionString: process.env.PGURI,
});

client.connect();

const app: Express = express(),
  port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(cors());

// Get all products
app.get(
  "/api",
  async (_request: express.Request, response: express.Response) => {
    try {
      console.log("Get request received for products");
      const { rows } = await client.query<Product>("SELECT * FROM products");
      const products: Product[] = rows;
      response.json(products);
    } catch (error) {
      console.error("Error getting products: ", error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

// Add to cart
app.post(
  "/api/add",
  async (request: express.Request, response: express.Response) => {
    const { user_id, product_id, quantity } = request.body;
    try {
      const product = await client.query<Product>(
        "SELECT * FROM products WHERE product_id = $1",
        [product_id]
      );

      if (product.rows.length === 0) {
        return response.status(404).json({ error: "Product not found" });
      }
      const price = product.rows[0].price;
      const subtotal = price * quantity;

      const result = await client.query<CartItem>(
        "INSERT INTO cart_items (user_id, product_id, quantity, subtotal) VALUES ($1, $2, $3, $4) RETURNING *",
        [user_id, product_id, quantity, subtotal]
      );

      const newCartItem = result.rows[0];

      response.status(201).json(newCartItem);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get all cart items

app.get(
  "/api/cart",
  async (_request: express.Request, response: express.Response) => {
    try {
      const result = await client.query("SELECT * FROM cart_items");
      const cartItems = result.rows;
      response.json({ cartItems });
    } catch (error) {
      console.error("Error getting cart items: ", error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

app.use(express.static(path.join(path.resolve(), "public")));

app.listen(port, () => {
  console.log(`Ready on http://localhost:${port}`);
});
