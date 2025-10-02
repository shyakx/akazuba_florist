-- Create Admin User for AKAZUBA FLORIST
-- Supabase Project: https://nkwzphdlblyzlczwmfhm.supabase.co
-- Run this in your Supabase SQL Editor

-- First, let's create a user in the auth.users table
-- Note: You'll need to create this user through Supabase Auth first, then update their profile

-- Method 1: If you already have a user account, update their profile to be admin
-- Update the real admin email to be admin
UPDATE profiles 
SET is_admin = true 
WHERE email = 'info.akazubaflorist@gmail.com';

-- Method 2: Create a new admin user profile (after creating auth user)
-- You'll need to get the user ID from auth.users first
INSERT INTO profiles (id, email, full_name, is_admin, created_at)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'info.akazubaflorist@gmail.com'), 
  'info.akazubaflorist@gmail.com', 
  'AKAZUBA FLORIST Admin', 
  true, 
  now()
);

-- Method 3: Create a test admin user (for development)
-- This creates a profile entry - you'll still need to create the auth user
INSERT INTO profiles (id, email, full_name, is_admin, created_at)
VALUES (
  gen_random_uuid(), 
  'info.akazubaflorist@gmail.com', 
  'AKAZUBA FLORIST Admin', 
  true, 
  now()
)
ON CONFLICT (email) DO UPDATE SET
  is_admin = true,
  full_name = 'AKAZUBA FLORIST Admin';

-- Verify the admin user was created
SELECT id, email, full_name, is_admin, created_at 
FROM profiles 
WHERE is_admin = true;

-- Check all users
SELECT id, email, full_name, is_admin, created_at 
FROM profiles 
ORDER BY created_at DESC;
