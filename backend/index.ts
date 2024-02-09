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

// Get specific product
app.get(
  "/api/products/:id",
  async (request: express.Request, response: express.Response) => {
    try {
      const productId = parseInt(request.params.id);
      console.log("Received product ID", productId);
      const { rows } = await client.query<Product>(
        "SELECT * FROM products WHERE product_id = $1",
        [productId]
      );

      if (rows.length === 0) {
        response.status(404).json({ error: "Product not found" });
      } else {
        const product: Product = rows[0];
        response.json(product);
      }
    } catch (error) {
      console.error("Error getting specific product: ", error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

// Add to cart
app.post(
  "/api/add",
  async (request: express.Request, response: express.Response) => {
    const { product_id, quantity } = request.body;
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
        "INSERT INTO cart_items (product_id, quantity, subtotal) VALUES ($1, $2, $3) RETURNING *",
        [product_id, quantity, subtotal]
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
      const result = await client.query(`
      SELECT cart_items.*, products.name, products.description, products.price, products.image_url
      FROM cart_items
      JOIN products ON cart_items.product_id = products.product_id
    `);
      const cartItems = result.rows.map((item) => ({
        cart_item_id: item.cart_item_id,
        cart_id: item.cart_id,
        quantity: item.quantity,
        subtotal: item.subtotal,
        product: {
          product_id: item.product_id,
          name: item.name,
          description: item.description,
          price: item.price,
          image_url: item.image_url,
        },
      }));
      response.json({ cartItems });
    } catch (error) {
      console.error("Error getting cart items: ", error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

// Clear cart

app.delete(
  "/api/cart/clear",
  async (_request: express.Request, response: express.Response) => {
    try {
      // Delete all cart items from the database
      await client.query(`DELETE FROM cart_items`);

      response.status(204).send(); // Respond with success (204 No Content) if successful
    } catch (error) {
      console.error("Error clearing cart items: ", error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

// Remove one item from cart

app.delete(
  "/api/remove",
  async (request: express.Request, response: express.Response) => {
    const { cart_item_id } = request.body;
    try {
      const cartItem = await client.query<CartItem>(
        "SELECT * FROM cart_items WHERE cart_item_id = $1",
        [cart_item_id]
      );

      if (cartItem.rows.length === 0) {
        return response.status(404).json({ error: "Cart item not found" });
      }

      const result = await client.query<CartItem>(
        "DELETE FROM cart_items WHERE cart_item_id = $1 RETURNING *",
        [cart_item_id]
      );

      const removedCartItem = result.rows[0];

      response.status(200).json({ removedCartItem });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  }
);

app.use(express.static(path.join(path.resolve(), "public")));

app.listen(port, () => {
  console.log(`Ready on http://localhost:${port}`);
});
