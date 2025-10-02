/*
  # Florist Shop Database Schema

  ## Overview
  Creates a complete e-commerce database for an online florist shop selling flowers and perfumes.
  Includes user authentication, product management, shopping cart, and CMS for site content.

  ## New Tables
  
  ### 1. `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique, not null)
  - `full_name` (text)
  - `is_admin` (boolean, default false)
  - `created_at` (timestamptz, default now())
  
  ### 2. `categories`
  - `id` (uuid, primary key)
  - `name` (text, unique, not null) - e.g., "Flowers", "Perfumes"
  - `description` (text)
  - `slug` (text, unique, not null)
  - `image_url` (text)
  - `created_at` (timestamptz, default now())
  
  ### 3. `products`
  - `id` (uuid, primary key)
  - `category_id` (uuid, references categories)
  - `name` (text, not null)
  - `description` (text)
  - `price` (numeric, not null)
  - `image_url` (text)
  - `stock_quantity` (integer, default 0)
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
  
  ### 4. `cart_items`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `product_id` (uuid, references products)
  - `quantity` (integer, not null, default 1)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
  
  ### 5. `site_content`
  - `id` (uuid, primary key)
  - `page` (text, unique, not null) - e.g., "home", "about"
  - `section` (text, not null) - e.g., "hero", "mission"
  - `content` (text)
  - `updated_at` (timestamptz, default now())
  - `updated_by` (uuid, references auth.users)

  ## Security (Row Level Security)
  
  ### Profiles Table
  - Users can read all profiles
  - Users can update only their own profile (except is_admin field)
  - Only admins can modify is_admin field
  
  ### Categories Table
  - Everyone can read categories
  - Only admins can insert, update, or delete categories
  
  ### Products Table
  - Everyone can read active products
  - Only admins can insert, update, or delete products
  
  ### Cart Items Table
  - Users can only see their own cart items
  - Users can insert, update, and delete their own cart items
  
  ### Site Content Table
  - Everyone can read site content
  - Only admins can update site content

  ## Important Notes
  1. All tables have RLS enabled for security
  2. Admins are identified by the `is_admin` flag in profiles
  3. Products can be marked inactive instead of deleted
  4. Cart items have a unique constraint per user-product combination
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  is_admin boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id AND is_admin = false);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  slug text UNIQUE NOT NULL,
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true)
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  image_url text DEFAULT '',
  stock_quantity integer DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Anyone can read active products"
  ON products FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can read all products"
  ON products FOR SELECT
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true)
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Cart items policies
CREATE POLICY "Users can read own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create site_content table
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  section text NOT NULL,
  content text DEFAULT '',
  updated_at timestamptz DEFAULT now() NOT NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(page, section)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number text UNIQUE NOT NULL DEFAULT 'ORD-' || extract(epoch from now())::text,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  delivery_city text DEFAULT 'Kigali',
  payment_method text NOT NULL CHECK (payment_method IN ('momo', 'bk', 'cash')),
  subtotal numeric(10, 2) NOT NULL,
  delivery_fee numeric(10, 2) DEFAULT 0,
  total numeric(10, 2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes text DEFAULT '',
  payment_proof_url text DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, product_id)
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Site content policies
CREATE POLICY "Anyone can read site content"
  ON site_content FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can insert site content"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Only admins can update site content"
  ON site_content FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true)
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Only admins can delete site content"
  ON site_content FOR DELETE
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

-- Enable RLS for orders and order_items
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all orders"
  ON orders FOR SELECT
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

-- Order items policies
CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Admins can read all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

-- Enable RLS for wishlist
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Wishlist policies
CREATE POLICY "Users can read own wishlist"
  ON wishlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist items"
  ON wishlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist items"
  ON wishlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default categories
INSERT INTO categories (name, slug, description, image_url) 
VALUES 
  ('Flowers', 'flowers', 'Fresh and beautiful flowers for every occasion', 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Perfumes', 'perfumes', 'Premium fragrances for men and women', 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT (slug) DO NOTHING;

-- Insert default site content
INSERT INTO site_content (page, section, content) 
VALUES 
  ('home', 'hero_title', 'Welcome to AKAZUBA FLORIST'),
  ('home', 'hero_subtitle', 'Discover premium flowers and perfumes delivered to your door in Rwanda'),
  ('about', 'mission', 'Our mission is to bring joy and beauty into your life through carefully curated flowers and fragrances. Each product is selected with care to ensure the highest quality and customer satisfaction.'),
  ('about', 'story', 'Founded with a passion for natural beauty, we have been serving Rwanda for years with the finest flowers and perfumes from around the world.'),
  ('contact', 'email', 'info.akazubaflorist@gmail.com'),
  ('contact', 'location', 'Kigali, Rwanda'),
  ('contact', 'phone', '+250 XXX XXX XXX')
ON CONFLICT (page, section) DO NOTHING;

-- Insert sample products
DO $$
DECLARE
  flowers_cat_id uuid;
  perfumes_cat_id uuid;
BEGIN
  SELECT id INTO flowers_cat_id FROM categories WHERE slug = 'flowers' LIMIT 1;
  SELECT id INTO perfumes_cat_id FROM categories WHERE slug = 'perfumes' LIMIT 1;

  INSERT INTO products (category_id, name, description, price, image_url, stock_quantity) 
  VALUES 
    (flowers_cat_id, 'Red Roses Bouquet', 'A classic bouquet of 12 stunning red roses', 55000, 'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=800', 50),
    (flowers_cat_id, 'Mixed Spring Flowers', 'Vibrant mix of seasonal spring flowers', 48000, 'https://images.pexels.com/photos/1086826/pexels-photo-1086826.jpeg?auto=compress&cs=tinysrgb&w=800', 30),
    (flowers_cat_id, 'White Lilies', 'Elegant white lilies arrangement', 65000, 'https://images.pexels.com/photos/1203504/pexels-photo-1203504.jpeg?auto=compress&cs=tinysrgb&w=800', 25),
    (flowers_cat_id, 'Sunflower Bunch', 'Bright and cheerful sunflowers', 42000, 'https://images.pexels.com/photos/133464/pexels-photo-133464.jpeg?auto=compress&cs=tinysrgb&w=800', 40),
    (perfumes_cat_id, 'Floral Essence', 'Delicate floral fragrance for women', 96000, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=800', 60),
    (perfumes_cat_id, 'Ocean Breeze', 'Fresh aquatic scent for men', 108000, 'https://images.pexels.com/photos/3709370/pexels-photo-3709370.jpeg?auto=compress&cs=tinysrgb&w=800', 45),
    (perfumes_cat_id, 'Midnight Oud', 'Rich and woody oriental perfume', 156000, 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800', 35),
    (perfumes_cat_id, 'Citrus Bloom', 'Light and refreshing citrus fragrance', 84000, 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=800', 55)
  ON CONFLICT DO NOTHING;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_site_content_page ON site_content(page, section);