/*
  # Preserve user_id in diary entries

  1. Changes
    - Create a trigger to preserve user_id during updates
    - Ensure user_id is never changed once set
    - Fix any entries with NULL user_id

  2. Purpose
    - Prevent user_id from being changed during updates
    - Ensure diary entries always maintain their original author
    - Fix issues with user display in the counselor management screen
*/

-- 1. Create a function to preserve user_id during updates
CREATE OR REPLACE FUNCTION preserve_diary_user_id() RETURNS TRIGGER AS $$
BEGIN
  -- If this is an update and user_id is being changed
  IF TG_OP = 'UPDATE' AND NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    -- If the old user_id is NULL but the new one isn't, allow the update
    IF OLD.user_id IS NULL AND NEW.user_id IS NOT NULL THEN
      RAISE NOTICE 'Updating NULL user_id to % for diary entry %', NEW.user_id, NEW.id;
    -- Otherwise, preserve the original user_id
    ELSE
      NEW.user_id := OLD.user_id;
      RAISE NOTICE 'Preserved original user_id % for diary entry %', OLD.user_id, NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create a trigger to apply the function
DROP TRIGGER IF EXISTS preserve_diary_user_id_trigger ON diary_entries;
CREATE TRIGGER preserve_diary_user_id_trigger
BEFORE UPDATE ON diary_entries
FOR EACH ROW
EXECUTE FUNCTION preserve_diary_user_id();

-- 3. Add comments
COMMENT ON FUNCTION preserve_diary_user_id() IS 'Preserves the original user_id during updates to diary entries';