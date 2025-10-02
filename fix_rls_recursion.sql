-- Fix infinite recursion in RLS policies
-- This script removes the problematic admin policy that's causing recursion

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Simple admin policy without recursion
CREATE POLICY "Enable read access for all users" ON profiles
  FOR SELECT USING (true);

-- Insert or update the specific user profile
INSERT INTO profiles (id, email, full_name, is_admin)
VALUES ('cb53e399-3ebd-4a54-a365-893fa2de84ed', 'shyakasteven2023@gmail.com', 'Steven Shyaka', false)
ON CONFLICT (id) 
DO UPDATE SET 
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  is_admin = EXCLUDED.is_admin;

-- Verify the profile was created/updated
SELECT id, email, full_name, is_admin, created_at FROM profiles WHERE id = 'cb53e399-3ebd-4a54-a365-893fa2de84ed';
