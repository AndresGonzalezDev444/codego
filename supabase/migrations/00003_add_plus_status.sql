-- Add CodeGo! Plus status to profiles
ALTER TABLE profiles 
ADD COLUMN is_plus boolean DEFAULT false;

-- Optionally, give the first user Plus status for testing
-- UPDATE profiles SET is_plus = true WHERE username = 'admin';
