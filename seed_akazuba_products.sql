-- 🌸 AKAZUBA FLORIST - Real Product Database Seeding
-- This script adds your actual products with real image paths

-- Insert Categories (if not exists)
INSERT INTO categories (name, description, slug, image_url) VALUES
('Flowers', 'Fresh and beautiful flowers for all occasions', 'flowers', '/images/products/flowers/red-2.jpg'),
('Perfumes', 'Premium fragrances and scents', 'perfumes', '/images/products/perfumes/perfume-2.jpg'),
('Bouquets', 'Carefully arranged flower bouquets and packages', 'bouquets', '/images/products/flowers/mixed-4.jpg'),
('Gifts', 'Special gift packages with chocolates and balloons', 'gifts', '/images/products/flowers/mixed-5.jpg')
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs and insert products
DO $$
DECLARE
    flowers_id UUID;
    perfumes_id UUID;
    bouquets_id UUID;
    gifts_id UUID;
BEGIN
    SELECT id INTO flowers_id FROM categories WHERE slug = 'flowers';
    SELECT id INTO perfumes_id FROM categories WHERE slug = 'perfumes';
    SELECT id INTO bouquets_id FROM categories WHERE slug = 'bouquets';
    SELECT id INTO gifts_id FROM categories WHERE slug = 'gifts';

    -- Insert Flower Products
    INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) VALUES
    
    -- Red Roses Collection
    ('Red Roses Bouquet', 'Beautiful red roses arranged in an elegant bouquet, perfect for expressing love and romance.', 30000, flowers_id, '/images/products/flowers/full rose flowers with white cover.jpg', 25, true),
    ('Red Roses Heart Shaped', 'Heart-shaped arrangement of red roses, ideal for anniversaries and special romantic occasions.', 35000, flowers_id, '/images/products/flowers/rosed heart shaped.jpg', 20, true),
    ('Red Roses with Package', 'Red roses packaged beautifully with chocolates and accompanying gifts for the perfect romantic gesture.', 40000, flowers_id, '/images/products/flowers/roses heart shaped package with nutella.jpg', 18, true),
    ('Premium Red Roses', 'Premium quality red roses, carefully selected for their beauty and freshness.', 25000, flowers_id, '/images/products/flowers/red-2.jpg', 30, true),
    ('Classic Red Roses', 'Classic red roses in elegant packaging, perfect for any romantic occasion.', 28000, flowers_id, '/images/products/flowers/red-3.jpg', 25, true),
    
    -- Pink Roses Collection
    ('Pink Roses Bouquet', 'Elegant pink roses arranged in a beautiful bouquet, symbolizing grace and admiration.', 28000, flowers_id, '/images/products/flowers/pink-1.jpg', 22, true),
    ('Pink and White Bouquet', 'Beautiful combination of pink and white roses, perfect for expressing gratitude.', 32000, flowers_id, '/images/products/flowers/pink and white bouquet.jpg', 20, true),
    ('Premium Pink Roses', 'Premium pink roses with elegant packaging, ideal for special celebrations.', 26000, flowers_id, '/images/products/flowers/pink-2.jpg', 24, true),
    ('Delicate Pink Roses', 'Delicate pink roses arranged beautifully, perfect for birthdays and celebrations.', 27000, flowers_id, '/images/products/flowers/pink-3.jpg', 23, true),
    
    -- White Roses Collection
    ('White Roses Bouquet', 'Pure white roses in elegant arrangement, perfect for weddings and new beginnings.', 30000, flowers_id, '/images/products/flowers/white-1.jpg', 20, true),
    ('White Wedding Flowers', 'Beautiful white flowers perfect for wedding ceremonies and special occasions.', 45000, flowers_id, '/images/products/flowers/wedding white flower2.jpg', 15, true),
    ('Premium White Roses', 'Premium white roses with elegant packaging, symbolizing purity and elegance.', 28000, flowers_id, '/images/products/flowers/white-2.jpg', 22, true),
    ('Classic White Roses', 'Classic white roses arranged beautifully, perfect for any special occasion.', 26000, flowers_id, '/images/products/flowers/white-3.jpg', 25, true),
    
    -- Yellow Flowers Collection
    ('Yellow Flowers Bouquet', 'Bright yellow flowers bringing sunshine and happiness to any space.', 24000, flowers_id, '/images/products/flowers/all yellow flowers with white cover(coat).jpg', 20, true),
    ('Yellow and Pink Mix', 'Beautiful combination of yellow and pink flowers for home decoration.', 26000, flowers_id, '/images/products/flowers/home decor flowers in glass yellow and pink colors.jpg', 18, true),
    ('Sunny Yellow Roses', 'Bright yellow roses perfect for bringing joy and happiness.', 25000, flowers_id, '/images/products/flowers/yellow-1.jpg', 22, true),
    
    -- Mixed Flower Collections
    ('Mixed Color Bouquet', 'Beautiful mixed color bouquet with red, pink, white, and yellow flowers.', 32000, bouquets_id, '/images/products/flowers/mixed colors booket red coat.jpg', 20, true),
    ('Premium Mixed Bouquet', 'Premium mixed flower bouquet with various colors and textures.', 35000, bouquets_id, '/images/products/flowers/mixed-3.jpg', 18, true),
    ('Elegant Mixed Arrangement', 'Elegant mixed flower arrangement perfect for any occasion.', 30000, bouquets_id, '/images/products/flowers/mixed-4.jpg', 22, true),
    ('Colorful Mixed Bouquet', 'Colorful mixed bouquet bringing vibrancy and joy to any space.', 28000, bouquets_id, '/images/products/flowers/mixed-5.jpg', 25, true),
    ('Special Mixed Collection', 'Special mixed flower collection with premium quality blooms.', 38000, bouquets_id, '/images/products/flowers/mixed-6.jpg', 16, true),
    ('Beautiful Mixed Arrangement', 'Beautiful mixed flower arrangement with elegant packaging.', 33000, bouquets_id, '/images/products/flowers/mixed-7.jpg', 19, true),
    ('Premium Mixed Bouquet', 'Premium mixed bouquet with carefully selected flowers.', 36000, bouquets_id, '/images/products/flowers/mixed-8.jpg', 17, true),
    ('Elegant Mixed Collection', 'Elegant mixed flower collection perfect for special occasions.', 34000, bouquets_id, '/images/products/flowers/mixed-9.jpg', 18, true),
    ('Luxury Mixed Bouquet', 'Luxury mixed flower bouquet with premium quality blooms.', 40000, bouquets_id, '/images/products/flowers/mixed-10.jpg', 15, true),
    
    -- Special Arrangements
    ('Heart Shaped Bouquet', 'Romantic heart-shaped bouquet with red and white flowers.', 45000, bouquets_id, '/images/products/flowers/heart shaped red white flowers bouquet .jpg', 12, true),
    ('Basket Package', 'Beautiful basket package with mixed pink, white, yellow, and red flowers.', 50000, gifts_id, '/images/products/flowers/basket package of mixed pink white yellow and red flowers.jpg', 10, true),
    ('Bucket Flower Arrangement', 'Elegant bucket flower arrangement with white, blue flowers and balloons.', 42000, gifts_id, '/images/products/flowers/bucket flower of white blue and balloon .jpg', 14, true),
    ('Purple Bucket Flowers', 'Beautiful purple flowers arranged in an elegant bucket.', 38000, flowers_id, '/images/products/flowers/purple bucket flowers.jpg', 16, true),
    
    -- Gift Packages
    ('Rose and Chocolate Package', 'Beautiful roses packaged with chocolates and accompanying gifts.', 55000, gifts_id, '/images/products/flowers/rose bouquet packed with moet and puppet and chocolate.jpg', 8, true),
    ('Pink and Chocolate Gift', 'Elegant pink flowers with chocolate package, perfect for gifting.', 48000, gifts_id, '/images/products/flowers/pink and while flowers with chocolate package.jpg', 12, true),
    ('Purple and Chocolate Package', 'Beautiful purple flowers with chocolate package.', 45000, gifts_id, '/images/products/flowers/purple flowers with chocolate package.jpg', 10, true),
    ('Premium Gift Package', 'Premium gift package with flowers, chocolates, and special treats.', 60000, gifts_id, '/images/products/flowers/red pink and jp chenet AND CHOXOLATE PACKAGE.jpg', 6, true),
    
    -- Orange Flowers
    ('Orange Flower Bouquet', 'Vibrant orange flowers bringing warmth and energy to any space.', 26000, flowers_id, '/images/products/flowers/orange-1.jpg', 20, true),
    
    -- Perfume Products
    ('Premium Perfume Collection', 'Luxurious perfume with elegant fragrance, perfect for special occasions.', 45000, perfumes_id, '/images/products/perfumes/perfume-1.jpg', 25, true),
    ('Elegant Perfume', 'Elegant perfume with sophisticated scent, ideal for evening wear.', 42000, perfumes_id, '/images/products/perfumes/perfume-2.jpg', 22, true),
    ('Luxury Fragrance', 'Luxury fragrance with premium quality ingredients.', 48000, perfumes_id, '/images/products/perfumes/perfume-3.png', 20, true),
    ('Classic Perfume', 'Classic perfume with timeless appeal and elegant packaging.', 40000, perfumes_id, '/images/products/perfumes/perfume-4.jpeg', 24, true),
    ('Premium Scent', 'Premium scent with long-lasting fragrance.', 46000, perfumes_id, '/images/products/perfumes/perfume-5.png', 18, true),
    ('Exclusive Perfume', 'Exclusive perfume with unique fragrance blend.', 50000, perfumes_id, '/images/products/perfumes/perfume-6.jpg', 16, true),
    ('Deluxe Fragrance', 'Deluxe fragrance with sophisticated notes.', 44000, perfumes_id, '/images/products/perfumes/perfume-7.png', 21, true),
    ('Signature Perfume', 'Signature perfume with distinctive character.', 47000, perfumes_id, '/images/products/perfumes/perfume-8.jpeg', 19, true),
    ('Luxury Perfume', 'Luxury perfume with premium quality and elegant design.', 49000, perfumes_id, '/images/products/perfumes/perfume-9.png', 17, true),
    ('Premium Collection', 'Premium perfume collection with exceptional fragrance.', 52000, perfumes_id, '/images/products/perfumes/perfume-10.png', 15, true),
    ('Sauvage Perfume', 'Sauvage perfume with bold and distinctive fragrance.', 55000, perfumes_id, '/images/products/perfumes/sauvage.jpg', 12, true)
    
    ON CONFLICT DO NOTHING;
END $$;

-- Show summary of inserted products
SELECT 
    c.name as category,
    COUNT(p.id) as product_count,
    MIN(p.price) as min_price,
    MAX(p.price) as max_price,
    AVG(p.price)::INTEGER as avg_price
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
GROUP BY c.id, c.name
ORDER BY c.name;

-- Show all products with their images
SELECT 
    p.name,
    p.price,
    p.image_url,
    c.name as category,
    p.stock_quantity
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
ORDER BY c.name, p.name;
