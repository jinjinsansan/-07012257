/*
  # 更新時のユーザーID保持機能の強化

  1. 変更内容
    - 日記エントリーの更新時にuser_idが変更されないようにするトリガー関数を追加
    - カウンセラーコメント追加時にuser_idが変更されないようにする

  2. 目的
    - カウンセラーがコメントを追加しても日記の作成者（ユーザー）が変わらないようにする
    - データの整合性を確保
    - 管理画面での表示問題を解決
*/

-- 1. 日記エントリーのユーザーIDを保持するためのトリガー関数
CREATE OR REPLACE FUNCTION preserve_user_id_on_update() RETURNS TRIGGER AS $$
BEGIN
  -- 更新時に元のuser_idを保持
  IF TG_OP = 'UPDATE' AND OLD.user_id IS NOT NULL THEN
    -- 変更の試みをログに記録（デバッグ用）
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

-- 2. トリガーを作成（最高優先度で実行）
DROP TRIGGER IF EXISTS preserve_user_id_on_update_trigger ON diary_entries;
CREATE TRIGGER preserve_user_id_on_update_trigger
BEFORE UPDATE ON diary_entries
FOR EACH ROW
EXECUTE FUNCTION preserve_user_id_on_update();

-- 3. コメント
COMMENT ON FUNCTION preserve_user_id_on_update() IS 'カウンセラーがコメントを追加しても日記の作成者（ユーザー）が変わらないようにするトリガー関数';