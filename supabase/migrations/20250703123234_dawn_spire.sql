/*
  # コメント既読機能の追加

  1. 変更内容
    - `diary_entries`テーブルに以下のフィールドを追加
      - `comment_read_at` (timestamp) - コメントが既読になった時間
      - `commented_at` (timestamp) - コメントが追加された時間

  2. 目的
    - カウンセラーコメントの既読状態を管理
    - 未読コメントの数を表示
    - ユーザーエクスペリエンスの向上
*/

-- 1. 既読時間カラムの追加
ALTER TABLE diary_entries
ADD COLUMN IF NOT EXISTS comment_read_at timestamptz;

-- 2. コメント時間カラムの追加
ALTER TABLE diary_entries
ADD COLUMN IF NOT EXISTS commented_at timestamptz;

-- 3. 過去データで commented_at が NULL の行を更新
UPDATE diary_entries
SET    commented_at = COALESCE(updated_at, created_at)
WHERE  commented_at IS NULL;

-- 4. 未読コメント数を返す RPC
CREATE OR REPLACE FUNCTION unread_comment_count(uid uuid)
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT count(*)
  FROM diary_entries
  WHERE user_id = uid
    AND commented_at IS NOT NULL
    AND (comment_read_at IS NULL OR commented_at > comment_read_at);
$$;

COMMIT;