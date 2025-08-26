-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    category VARCHAR(100) DEFAULT 'flowers',
    featured BOOLEAN DEFAULT false,
    description TEXT,
    color VARCHAR(50),
    type VARCHAR(100),
    stock INTEGER DEFAULT 10,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    delivery_address TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- Insert sample products data
INSERT INTO products (name, price, image, category, featured, description, color, type, stock) VALUES
('Red Rose', 45500, '/images/flowers/red/red-1.jpg', 'flowers', true, 'Beautiful red rose from Akazuba Florist. Perfect for any occasion.', 'red', 'Rose', 10),
('Red Tulip', 32500, '/images/flowers/red/red-2.jpg', 'flowers', true, 'Beautiful red tulip from Akazuba Florist. Perfect for any occasion.', 'red', 'Tulip', 10),
('Red Carnation', 26000, '/images/flowers/red/red-3.jpg', 'flowers', false, 'Beautiful red carnation from Akazuba Florist. Perfect for any occasion.', 'red', 'Carnation', 10),
('Red Poppy', 23400, '/images/flowers/red/red-4.jpg', 'flowers', false, 'Beautiful red poppy from Akazuba Florist. Perfect for any occasion.', 'red', 'Poppy', 10),
('Red Geranium', 19500, '/images/flowers/red/red-5.jpg', 'flowers', false, 'Beautiful red geranium from Akazuba Florist. Perfect for any occasion.', 'red', 'Geranium', 10),
('Red Chrysanthemum', 28600, '/images/flowers/red/red-6.jpg', 'flowers', false, 'Beautiful red chrysanthemum from Akazuba Florist. Perfect for any occasion.', 'red', 'Chrysanthemum', 10),
('Red Dahlia', 36400, '/images/flowers/red/red-7.jpg', 'flowers', false, 'Beautiful red dahlia from Akazuba Florist. Perfect for any occasion.', 'red', 'Dahlia', 10),
('Pink Rose', 41600, '/images/flowers/pink/pink-1.jpg', 'flowers', true, 'Beautiful pink rose from Akazuba Florist. Perfect for any occasion.', 'pink', 'Rose', 10),
('Pink Peony', 52000, '/images/flowers/pink/pink-2.jpg', 'flowers', true, 'Beautiful pink peony from Akazuba Florist. Perfect for any occasion.', 'pink', 'Peony', 10),
('Pink Cherry Blossom', 39000, '/images/flowers/pink/pink-3.jpg', 'flowers', false, 'Beautiful pink cherry blossom from Akazuba Florist. Perfect for any occasion.', 'pink', 'Cherry Blossom', 10),
('White Lily', 39000, '/images/flowers/white/white-1.jpg', 'flowers', true, 'Beautiful white lily from Akazuba Florist. Perfect for any occasion.', 'white', 'Lily', 10),
('White Rose', 39000, '/images/flowers/white/white-2.jpg', 'flowers', true, 'Beautiful white rose from Akazuba Florist. Perfect for any occasion.', 'white', 'Rose', 10),
('White Daisy', 19500, '/images/flowers/white/white-3.jpg', 'flowers', false, 'Beautiful white daisy from Akazuba Florist. Perfect for any occasion.', 'white', 'Daisy', 10),
('Yellow Sunflower', 26000, '/images/flowers/yellow/yellow-1.jpg', 'flowers', true, 'Beautiful yellow sunflower from Akazuba Florist. Perfect for any occasion.', 'yellow', 'Sunflower', 10),
('Yellow Rose', 36400, '/images/flowers/yellow/yellow-2.jpg', 'flowers', true, 'Beautiful yellow rose from Akazuba Florist. Perfect for any occasion.', 'yellow', 'Rose', 10),
('Orange Marigold', 19500, '/images/flowers/orange/orange-1.jpg', 'flowers', true, 'Beautiful orange marigold from Akazuba Florist. Perfect for any occasion.', 'orange', 'Marigold', 10),
('Mixed Bouquet', 78000, '/images/flowers/mixed/mixed-1.jpg', 'flowers', true, 'Beautiful mixed bouquet from Akazuba Florist. Perfect for any occasion.', 'mixed', 'Mixed', 10)
ON CONFLICT (id) DO NOTHING;

-- Insert sample orders data
INSERT INTO orders (order_number, customer_name, customer_phone, customer_email, delivery_address, total_amount, status, payment_status) VALUES
('#001', 'Marie Uwimana', '+250 789 123 456', 'marie.uwimana@email.com', 'Kigali, Rwanda - Remera', 91000, 'delivered', 'paid'),
('#002', 'Jean Pierre Ndayisaba', '+250 789 456 789', 'jean.pierre@email.com', 'Kigali, Rwanda - Kacyiru', 52000, 'pending', 'pending'),
('#003', 'Claire Mutoni', '+250 789 789 123', 'claire.mutoni@email.com', 'Kigali, Rwanda - Kimironko', 117000, 'processing', 'paid'),
('#004', 'David Nshuti', '+250 789 123 789', 'david.nshuti@email.com', 'Kigali, Rwanda - Nyarutarama', 26000, 'delivered', 'paid'),
('#005', 'Grace Uwase', '+250 789 456 123', 'grace.uwase@email.com', 'Kigali, Rwanda - Gisozi', 78000, 'processing', 'paid'),
('#006', 'Emmanuel Nkurunziza', '+250 789 789 456', 'emmanuel.nkurunziza@email.com', 'Kigali, Rwanda - Kabeza', 65000, 'pending', 'pending')
ON CONFLICT (order_number) DO NOTHING;

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 45500),
(2, 9, 1, 52000),
(3, 11, 3, 39000),
(4, 14, 1, 26000),
(5, 17, 1, 78000),
(6, 2, 2, 32500)
ON CONFLICT DO NOTHING; 