import express, { Express } from "express";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import { Product } from "./types";

dotenv.config();

const client = new pg.Client({
  connectionString: process.env.PGURI,
});

client.connect();

const app: Express = express(),
  port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(cors());

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

app.use(express.static(path.join(path.resolve(), "public")));

app.listen(port, () => {
  console.log(`Ready on http://localhost:${port}`);
});
