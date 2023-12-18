import express, { Express } from "express";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import { Product, CartItem } from "./types";

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

// Get product by id
app.get(
  "/api/:id",
  async (request: express.Request, response: express.Response) => {
    const productId = parseInt(request.params.id, 10);
    try {
      const { rows } = await client.query<Product>(
        "SELECT * FROM products WHERE product_id = $1",
        [productId]
      );
      const product: Product | undefined = rows[0];

      if (product) {
        response.json(product);
      } else {
        response.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      console.error("Error getting product by ID: ", error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

// Add item to cart
app.post(
  "/api/cart/add",
  async (request: express.Request, response: express.Response) => {
    const { cart_id, product_id, quantity } = request.body;

    try {
      const { rows } = await client.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity, subtotal) VALUES ($1, $2, $3, (SELECT price FROM products WHERE product_id = $2) * $3) RETURNING *",
        [cart_id, product_id, quantity]
      );

      const newItem: CartItem = rows[0];
      response.status(201).json(newItem);
    } catch (error) {
      console.error("Error adding item to cart: ", error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

app.delete(
  "/api/cart/remove/:cartItemId",
  async (request: express.Request, response: express.Response) => {
    const cartItemId = parseInt(request.params.cartItemId, 10);

    try {
      const { rowCount } = await client.query(
        "DELETE FROM cart_items WHERE cart_item_id = $1",
        [cartItemId]
      );

      if (rowCount ? rowCount > 0 : 0) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "Item not found in the cart" });
      }
    } catch (error) {
      console.error("Error removing item from cart: ", error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

app.use(express.static(path.join(path.resolve(), "public")));

app.listen(port, () => {
  console.log(`Ready on http://localhost:${port}`);
});
