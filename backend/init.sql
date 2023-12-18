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
  price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10, 2) NOT NULL
);

CREATE TABLE order_details (
  order_detail_id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(order_id),
  product_id INT REFERENCES products(product_id),
  quantity INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);

INSERT INTO users (username, email, password_hash)
VALUES ('john_doe', 'john@example.com', 'hashed_password');

INSERT INTO products (name, description, price)
VALUES ('Product 1', 'Description of Product 1', 19.99);
