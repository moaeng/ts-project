DROP TABLE IF EXISTS users;

CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 0
);

CREATE TABLE carts (
  cart_id SERIAL PRIMARY KEY,
);

CREATE TABLE cart_items (
  cart_item_id SERIAL PRIMARY KEY,
  cart_id INT REFERENCES carts(cart_id),
  product_id INT REFERENCES products(product_id),
  quantity INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);

-- Inserting data into the 'products' table
INSERT INTO products (name, description, price, quantity)
VALUES
  ('Product A', 'Description for Product A', 19.99, 50),
  ('Product B', 'Description for Product B', 29.99, 30),
  ('Product C', 'Description for Product C', 14.99, 100);
