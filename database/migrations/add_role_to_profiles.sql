-- Migration to add role column to profiles table
-- This migration adds support for role-based access control

-- Add role column to profiles table
ALTER TABLE profiles 
ADD COLUMN role TEXT DEFAULT 'producer' 
CHECK (role IN ('producer', 'investor', 'institution', 'knowledge_builder'));

-- Create index on role for better performance
CREATE INDEX idx_profiles_role ON profiles(role);

-- Update existing records to have default role
UPDATE profiles 
SET role = 'producer' 
WHERE role IS NULL;

-- Add comment to document the column
COMMENT ON COLUMN profiles.role IS 'User role for access control and personalization';
