import express, { Express } from "express";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import { Product, CartItem } from "../types";

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

app.post(
  "/api/add",
  async (request: express.Request, response: express.Response) => {
    const { user_id, product_id, quantity } = request.body;
    try {
      const result = await client.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity, subtotal) VALUES ((SELECT cart_id FROM carts WHERE user_id = $1), $2, $3, (SELECT price FROM products WHERE product_id = $2) * $3) RETURNING *",
        [user_id, product_id, quantity]
      );

      // Extract the inserted row from the result.rows array
      const newCartItem = result.rows[0];

      // Send success response with inserted data
      response.status(201).json(newCartItem);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

app.use(express.static(path.join(path.resolve(), "public")));

app.listen(port, () => {
  console.log(`Ready on http://localhost:${port}`);
});
