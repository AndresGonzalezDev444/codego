-- Add hearts to profiles
ALTER TABLE profiles 
ADD COLUMN hearts integer DEFAULT 5,
ADD COLUMN last_heart_regen_at timestamptz DEFAULT now();

-- Update existing profiles
UPDATE profiles SET hearts = 5, last_heart_regen_at = now();
