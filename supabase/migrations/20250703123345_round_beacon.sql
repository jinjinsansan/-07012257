/*
  # コメント既読機能の追加

  1. 変更内容
    - diary_entriesテーブルに以下のフィールドを追加
      - `comment_read_at` (timestamptz) - コメントを既読した日時
      - `commented_at` (timestamptz) - コメントが追加された日時
    - 過去データの`commented_at`を更新
    - 未読コメント数を取得するRPC関数を追加

  2. 目的
    - カウンセラーコメントの既読管理機能を追加
    - ユーザーが未読のコメントを確認できるようにする
    - 未読コメント数を表示できるようにする
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

-- 5. コメント
COMMENT ON COLUMN diary_entries.comment_read_at IS 'カウンセラーコメントを既読した日時';
COMMENT ON COLUMN diary_entries.commented_at IS 'カウンセラーコメントが追加された日時';
COMMENT ON FUNCTION unread_comment_count IS 'ユーザーの未読コメント数を取得する関数';