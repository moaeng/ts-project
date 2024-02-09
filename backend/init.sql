
CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  image_url VARCHAR(255)
);

CREATE TABLE carts (
  cart_id SERIAL PRIMARY KEY
);

CREATE TABLE cart_items (
  cart_item_id SERIAL PRIMARY KEY,
  cart_id INT REFERENCES carts(cart_id),
  product_id INT REFERENCES products(product_id),
  quantity INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  CONSTRAINT unique_user_product UNIQUE (product_id)
);
  
INSERT INTO products (name, description, price, quantity, image_url)
VALUES
  ('Naturally Desk', 'Enhance your workspace with the Naturally Desk, crafted from sustainable bamboo. This spacious desk promotes eco-conscious productivity, featuring a minimalist design and ample storage for a clutter-free environment.', 19.99, 50, '/images/NaturallyDesk.png'),
  ('Naturally Table Lamp', 'Illuminate your space with the Naturally Table Lamp, an elegant fusion of functionality and eco-friendliness. This lamp boasts a base made from recycled materials and a shade crafted from sustainable fabric, creating a warm and inviting ambiance in any room.', 29.99, 30, '/images/NaturallyLamp.png'),
  ('Naturally Lounge Chair', 'Immerse yourself in the natural warmth and timeless elegance of the Naturally Lounge Chair. Crafted from ethically sourced wood, this chair brings the essence of the outdoors into your living space.', 14.99, 100, '/images/NaturallyInterior.png'),
  ('Naturally Cup', 'Elevate your sipping experience with the Naturally Cup - a perfect blend of style and sustainability.', 14.99, 100, '/images/NaturallyPackaging.png');
