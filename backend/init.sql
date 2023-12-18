CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(60) NOT NULL
);

CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 0
);

CREATE TABLE carts (
  cart_id SERIAL PRIMARY KEY,
  user_id INT UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE cart_items (
  cart_item_id SERIAL PRIMARY KEY,
  cart_id INT REFERENCES carts(cart_id),
  product_id INT REFERENCES products(product_id),
  quantity INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);

CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10, 2) NOT NULL
);

INSERT INTO users (username, email, password_hash)
VALUES ('john_doe', 'john@example.com', 'hashed_password');

INSERT INTO products (name, description, price)
VALUES ('Product 1', 'Description of Product 1', 19.99);

INSERT INTO cart_items (cart_id, product_id, quantity, subtotal)
VALUES (1, 1, 2, (SELECT price FROM products WHERE product_id = 1) * 2);

INSERT INTO cart_items (cart_id, product_id, quantity, subtotal)
VALUES (2, 2, 3, (SELECT price FROM products WHERE product_id = 2) * 3);