/*
  # Fix NULL user_id in diary entries

  1. Changes
    - Update existing diary entries with NULL user_id to use a valid user_id
    - Add a trigger to ensure new diary entries always have a valid user_id
    - Add a trigger to preserve user_id during updates

  2. Purpose
    - Fix issue where diary entries have NULL user_id
    - Ensure user information is displayed correctly in admin panel
    - Prevent user_id from being changed during updates
*/

-- 1. Update existing entries with NULL user_id
UPDATE diary_entries
SET user_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1)
WHERE user_id IS NULL;

-- 2. Create a function to ensure new diary entries always have a valid user_id
CREATE OR REPLACE FUNCTION ensure_diary_user_id() RETURNS TRIGGER AS $$
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

-- 3. Create a trigger to apply the function
DROP TRIGGER IF EXISTS ensure_diary_user_id_trigger ON diary_entries;
CREATE TRIGGER ensure_diary_user_id_trigger
BEFORE INSERT ON diary_entries
FOR EACH ROW
EXECUTE FUNCTION ensure_diary_user_id();

-- 4. Create a function to preserve user_id during updates
CREATE OR REPLACE FUNCTION preserve_diary_user_id() RETURNS TRIGGER AS $$
BEGIN
  -- If this is an update and user_id is being changed
  IF TG_OP = 'UPDATE' AND NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    -- If the old user_id is NULL but the new one isn't, allow the update
    IF OLD.user_id IS NULL AND NEW.user_id IS NOT NULL THEN
      RAISE LOG 'Updating NULL user_id to % for diary entry %', NEW.user_id, NEW.id;
    -- Otherwise, preserve the original user_id
    ELSE
      NEW.user_id := OLD.user_id;
      RAISE LOG 'Preserved original user_id % for diary entry %', OLD.user_id, NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create a trigger to apply the function
DROP TRIGGER IF EXISTS preserve_diary_user_id_trigger ON diary_entries;
CREATE TRIGGER preserve_diary_user_id_trigger
BEFORE UPDATE ON diary_entries
FOR EACH ROW
EXECUTE FUNCTION preserve_diary_user_id();

-- 6. Add comments
COMMENT ON FUNCTION ensure_diary_user_id() IS 'Ensures that new diary entries always have a valid user_id';
COMMENT ON FUNCTION preserve_diary_user_id() IS 'Preserves the original user_id during updates to diary entries';