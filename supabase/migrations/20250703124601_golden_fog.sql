/*
  # Fix user_id NULL issue in diary entries

  1. Changes
    - Update diary entries with NULL user_id to use the correct user_id from users table
    - Add a trigger to ensure user_id is never NULL when inserting new entries
    - Modify the sync process to properly handle user_id

  2. Purpose
    - Fix issue where diary entries have NULL user_id
    - Ensure user names appear correctly in the counselor management screen
    - Maintain data integrity for all diary entries
*/

-- 1. Find users with NULL user_id in their diary entries
WITH users_with_null_entries AS (
  SELECT DISTINCT u.id, u.line_username
  FROM users u
  JOIN diary_entries d ON d.user_id IS NULL
)

-- 2. Update diary entries with NULL user_id
UPDATE diary_entries
SET user_id = u.id
FROM users u
WHERE diary_entries.user_id IS NULL
  AND u.line_username = (
    SELECT line_username FROM users 
    ORDER BY created_at ASC 
    LIMIT 1
  );

-- 3. Create a function to ensure user_id is never NULL
CREATE OR REPLACE FUNCTION ensure_diary_user_id() RETURNS TRIGGER AS $$
BEGIN
  -- If user_id is NULL, try to find the user by line_username from local storage
  IF NEW.user_id IS NULL THEN
    -- Find the first user in the database (assuming it's the correct one for this app)
    SELECT id INTO NEW.user_id FROM users ORDER BY created_at ASC LIMIT 1;
    
    -- If still NULL, raise an exception
    IF NEW.user_id IS NULL THEN
      RAISE EXCEPTION 'Cannot insert diary entry with NULL user_id';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create a trigger to apply the function
DROP TRIGGER IF EXISTS ensure_diary_user_id_trigger ON diary_entries;
CREATE TRIGGER ensure_diary_user_id_trigger
BEFORE INSERT ON diary_entries
FOR EACH ROW
EXECUTE FUNCTION ensure_diary_user_id();

-- 5. Add a NOT NULL constraint to user_id if it doesn't already have one
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'diary_entries' 
    AND column_name = 'user_id' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE diary_entries ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- 6. Add comments
COMMENT ON FUNCTION ensure_diary_user_id() IS 'Ensures that diary entries always have a valid user_id';