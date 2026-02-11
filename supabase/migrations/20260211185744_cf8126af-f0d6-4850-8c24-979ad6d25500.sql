
-- Create a sequence for player IDs
CREATE SEQUENCE IF NOT EXISTS player_id_seq START WITH 1;

-- Update existing profiles with sequential IDs based on creation order
WITH ordered_profiles AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM profiles
)
UPDATE profiles 
SET player_id = 'SV-' || ordered_profiles.rn
FROM ordered_profiles
WHERE profiles.id = ordered_profiles.id;

-- Set the sequence to continue after the last assigned number
SELECT setval('player_id_seq', COALESCE((SELECT COUNT(*) FROM profiles), 0));

-- Update the default value for player_id column
ALTER TABLE profiles ALTER COLUMN player_id SET DEFAULT 'SV-' || nextval('player_id_seq');
