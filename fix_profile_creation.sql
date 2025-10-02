-- Fix profile creation issues
-- This script addresses the 409 Conflict error when creating profiles

-- First, let's check if there are any existing profiles that might be causing conflicts
SELECT id, email, full_name, created_at FROM profiles WHERE id = 'cb53e399-3ebd-4a54-a365-893fa2de84ed';

-- Drop any existing problematic constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_email_key;

-- Ensure the primary key is properly set
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_pkey;
ALTER TABLE profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

-- Make sure RLS is properly configured
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create comprehensive RLS policies
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

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
