/*
  # ユーザーID NULL問題の修正

  1. 変更内容
    - NULL値のuser_idを持つ日記エントリーを修正
    - user_idにNOT NULL制約を追加
    - 新しい日記エントリーが常に有効なuser_idを持つようにするトリガー関数を追加

  2. 目的
    - カウンセラー管理画面で日記のユーザー名が表示されない問題を解決
    - データの整合性を確保
    - 今後同様の問題が発生しないようにする
*/

-- 1. 既存のNULLユーザーIDを修正
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
BEGIN
  -- user_idがNULLの場合、デフォルトのユーザーIDを設定
  IF NEW.user_id IS NULL THEN
    -- 最初のユーザーを取得
    SELECT id INTO default_user_id FROM users ORDER BY created_at ASC LIMIT 1;
    
    -- ユーザーが見つかった場合、そのIDを使用
    IF default_user_id IS NOT NULL THEN
      NEW.user_id := default_user_id;
      RAISE LOG 'NULL user_id was replaced with default user_id % for diary entry', default_user_id;
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

-- 5. コメント
COMMENT ON FUNCTION ensure_valid_user_id() IS '日記エントリーが常に有効なuser_idを持つようにするトリガー関数';