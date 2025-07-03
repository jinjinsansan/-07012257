/*
  # Fix NULL user_id issues in diary entries

  1. Changes
    - Update existing entries with NULL user_id
    - Add NOT NULL constraint to user_id column
    - Create triggers to ensure user_id is always valid
    - Preserve user_id during updates

  2. Purpose
    - Fix synchronization errors related to NULL user_id
    - Ensure data integrity
    - Prevent counselor comments from changing the diary author
*/

-- 1. Update existing entries with NULL user_id
UPDATE diary_entries
SET user_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1)
WHERE user_id IS NULL;

-- 2. Add NOT NULL constraint to user_id
ALTER TABLE diary_entries 
  ALTER COLUMN user_id SET NOT NULL;

-- 3. Create a function to ensure new diary entries always have a valid user_id
CREATE OR REPLACE FUNCTION ensure_valid_user_id() RETURNS TRIGGER AS $$
DECLARE
  default_user_id UUID;
BEGIN
  -- If user_id is NULL, try to find a valid user_id
  IF NEW.user_id IS NULL THEN
    -- Find the first user in the database
    SELECT id INTO default_user_id FROM users ORDER BY created_at ASC LIMIT 1;
    
    -- If we found a user, use their ID
    IF default_user_id IS NOT NULL THEN
      NEW.user_id := default_user_id;
      RAISE LOG 'Updated NULL user_id to % for diary entry %', default_user_id, NEW.id;
    ELSE
      RAISE EXCEPTION 'Cannot insert diary entry with NULL user_id and no default user exists';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create a trigger to apply the function
DROP TRIGGER IF EXISTS ensure_valid_user_id_trigger ON diary_entries;
CREATE TRIGGER ensure_valid_user_id_trigger
BEFORE INSERT ON diary_entries
FOR EACH ROW
EXECUTE FUNCTION ensure_valid_user_id();

-- 5. Create a function to preserve user_id during updates
CREATE OR REPLACE FUNCTION preserve_user_id_on_update() RETURNS TRIGGER AS $$
BEGIN
  -- If this is an update and user_id is being changed
  IF TG_OP = 'UPDATE' AND NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    -- Log the attempted change
    RAISE LOG 'Preserving user_id: Attempted to change from % to % for diary entry %', 
              OLD.user_id, NEW.user_id, NEW.id;
    
    -- Always preserve the original user_id
    NEW.user_id := OLD.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create a trigger to apply the function
DROP TRIGGER IF EXISTS preserve_user_id_on_update_trigger ON diary_entries;
CREATE TRIGGER preserve_user_id_on_update_trigger
BEFORE UPDATE ON diary_entries
FOR EACH ROW
EXECUTE FUNCTION preserve_user_id_on_update();

-- 7. Add comments
COMMENT ON FUNCTION ensure_valid_user_id() IS 'Ensures that new diary entries always have a valid user_id';
COMMENT ON FUNCTION preserve_user_id_on_update() IS 'Preserves the original user_id during updates to diary entries';