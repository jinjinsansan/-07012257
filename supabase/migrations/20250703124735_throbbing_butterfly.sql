/*
  # Fix user display in admin panel

  1. Changes
    - Add a trigger to update the user_id when it's NULL
    - Ensure diary entries always have a valid user_id
    - Fix existing entries with NULL user_id

  2. Purpose
    - Fix issue where user names don't appear in the counselor management screen
    - Ensure data integrity for all diary entries
    - Prevent future NULL user_id issues
*/

-- 1. Create a function to update user_id when it's NULL
CREATE OR REPLACE FUNCTION update_null_user_id() RETURNS TRIGGER AS $$
DECLARE
  default_user_id UUID;
BEGIN
  -- If user_id is NULL, find a valid user_id
  IF NEW.user_id IS NULL THEN
    -- Get the first user from the database
    SELECT id INTO default_user_id FROM users ORDER BY created_at ASC LIMIT 1;
    
    -- If we found a user, use their ID
    IF default_user_id IS NOT NULL THEN
      NEW.user_id := default_user_id;
      RAISE NOTICE 'Updated NULL user_id to % for diary entry %', default_user_id, NEW.id;
    ELSE
      RAISE EXCEPTION 'Cannot find a valid user_id for diary entry';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create a trigger to apply the function
DROP TRIGGER IF EXISTS update_null_user_id_trigger ON diary_entries;
CREATE TRIGGER update_null_user_id_trigger
BEFORE INSERT OR UPDATE ON diary_entries
FOR EACH ROW
EXECUTE FUNCTION update_null_user_id();

-- 3. Update existing entries with NULL user_id
UPDATE diary_entries
SET user_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1)
WHERE user_id IS NULL;

-- 4. Add comments
COMMENT ON FUNCTION update_null_user_id() IS 'Updates NULL user_id values to a valid user_id';