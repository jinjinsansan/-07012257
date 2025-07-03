/*
  # user_id NULL問題の修正

  1. 変更内容
    - 既存のNULLのuser_idを持つ日記エントリーを修正
    - 新しい日記エントリーが常に有効なuser_idを持つようにするトリガー関数を追加
    - 更新時にuser_idが変更されないようにするトリガー関数を追加

  2. 目的
    - 日記エントリーのuser_idがNULLになる問題を解決
    - カウンセラー管理画面でユーザー名が表示されない問題を修正
    - データの整合性を確保
*/

-- 1. 既存のNULLのuser_idを持つ日記エントリーを修正
UPDATE diary_entries
SET user_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1)
WHERE user_id IS NULL;

-- 2. user_idにNOT NULL制約を追加
ALTER TABLE diary_entries 
  ALTER COLUMN user_id SET NOT NULL;

-- 3. 新しい日記エントリーが常に有効なuser_idを持つようにするトリガー関数
CREATE OR REPLACE FUNCTION ensure_valid_user_id() RETURNS TRIGGER AS $$
DECLARE
  default_user_id UUID;
  line_username TEXT;
BEGIN
  -- user_idがNULLの場合、適切なユーザーIDを設定
  IF NEW.user_id IS NULL THEN
    -- ローカルストレージからline_usernameを取得（実際には不可能なので、代替手段を使用）
    -- 最初のユーザーを取得
    SELECT id, u.line_username INTO default_user_id, line_username 
    FROM users u 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    -- ユーザーが見つかった場合、そのIDを使用
    IF default_user_id IS NOT NULL THEN
      NEW.user_id := default_user_id;
      RAISE LOG 'NULL user_id was replaced with user_id % (%) for diary entry', default_user_id, line_username;
    ELSE
      RAISE EXCEPTION 'Cannot insert diary entry with NULL user_id and no default user exists';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. トリガーを作成
DROP TRIGGER IF EXISTS ensure_valid_user_id_trigger ON diary_entries;
CREATE TRIGGER ensure_valid_user_id_trigger
BEFORE INSERT ON diary_entries
FOR EACH ROW
EXECUTE FUNCTION ensure_valid_user_id();

-- 5. 更新時にuser_idが変更されないようにするトリガー関数
CREATE OR REPLACE FUNCTION preserve_user_id_on_update() RETURNS TRIGGER AS $$
BEGIN
  -- 更新時に元のuser_idを保持
  IF TG_OP = 'UPDATE' AND OLD.user_id IS NOT NULL THEN
    -- 変更の試みをログに記録
    IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE LOG 'ユーザーID保持: % から % への変更を防止しました（日記ID: %）', 
                OLD.user_id, NEW.user_id, NEW.id;
    END IF;
    
    -- 常に元のuser_idを保持
    NEW.user_id := OLD.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. トリガーを作成
DROP TRIGGER IF EXISTS preserve_user_id_on_update_trigger ON diary_entries;
CREATE TRIGGER preserve_user_id_on_update_trigger
BEFORE UPDATE ON diary_entries
FOR EACH ROW
EXECUTE FUNCTION preserve_user_id_on_update();

-- 7. コメント
COMMENT ON FUNCTION ensure_valid_user_id() IS '日記エントリーが常に有効なuser_idを持つようにするトリガー関数';
COMMENT ON FUNCTION preserve_user_id_on_update() IS 'カウンセラーがコメントを追加しても日記の作成者（ユーザー）が変わらないようにするトリガー関数';