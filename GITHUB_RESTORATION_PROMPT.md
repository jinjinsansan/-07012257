# かんじょうにっき - GitHub連携後の復元プロンプト

## 🎯 このプロンプトの使用方法
このプロンプトを新しいBoltチャットで使用することで、GitHubリポジトリから完全な状態でプロジェクトを復元できます。

---

## 📋 プロジェクト復元指示

以下の内容で「かんじょうにっき」プロジェクトを復元してください：

### 🚀 基本情報
- **プロジェクト名**: かんじょうにっき（感情日記アプリ）
- **開発者**: 一般社団法人NAMIDAサポート協会
- **技術スタック**: React + TypeScript + Vite + Tailwind CSS + Supabase
- **最終更新**: 2025年7月1日
- **デプロイURL**: https://apl.namisapo2.love

### ⚠️ 重要な制約事項（必須遵守）
```
# Bolt への指示
- pages ディレクトリ以外は変更しないこと
- Tailwind 設定ファイルに手を加えないこと
- 新しい依存パッケージはインストールしないこと
- supabase/migrations/ 内のファイルは変更しないこと
```

### 📦 必要な依存関係
```json
{
  "dependencies": {
    "@radix-ui/react-tabs": "^1.1.12",
    "@supabase/supabase-js": "^2.39.0",
    "clsx": "^2.1.1",
    "dayjs": "^1.11.13",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

### 🔧 環境変数設定
`.env.example`ファイルを作成し、以下の内容を設定：
```env
# Supabase設定
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# ローカルモード設定（オプション）
VITE_LOCAL_MODE=false

# メンテナンスモード設定（オプション）
VITE_MAINTENANCE_MODE=false
VITE_MAINTENANCE_MESSAGE=システムメンテナンス中です
VITE_MAINTENANCE_END_TIME=2025-01-22T10:00:00Z
```

## 🌟 実装済み機能一覧

### ✅ ユーザー向け機能
1. **感情日記システム**
   - 8種類のネガティブ感情（恐怖、悲しみ、怒り、悔しい、無価値感、罪悪感、寂しさ、恥ずかしさ）
   - 4種類のポジティブ感情（嬉しい、感謝、達成感、幸せ）
   - 出来事と気づきの記録
   - 無価値感選択時の自己肯定感・無価値感スコア入力
   - 日記の作成・編集・削除機能

2. **無価値感推移グラフ**
   - 自己肯定感と無価値感の推移をグラフで可視化
   - 期間フィルター（1週間・1ヶ月・全期間）
   - SNSシェア機能（通常シェア、X/Twitterシェア）
   - 感情の出現頻度表示

3. **高度な検索機能**
   - キーワード検索（出来事・気づき）
   - 感情別フィルター
   - 日付範囲検索
   - 直近5日分の日記表示

4. **カウンセラーコメント表示**
   - カウンセラーからのフィードバック表示
   - カウンセラー名の表示
   - 検索画面でのコメント表示

5. **データバックアップ・復元**
   - ローカルデータのJSONバックアップ
   - バックアップファイルからの復元
   - 端末変更時のデータ移行サポート

6. **シェア機能強化**
   - 日記内容のプレビュー表示
   - 感情に対応する絵文字の追加
   - X/Twitterへの直接シェア機能
   - プライバシーに配慮した内容表示

7. **レスポンシブデザイン**
   - 全デバイス対応（PC・タブレット・スマートフォン）
   - 日本語フォント最適化（Noto Sans JP）

### ✅ 管理者向け機能
1. **カウンセラー管理画面**
   - 日記一覧・詳細表示
   - 高度な検索・フィルター機能
   - カレンダー検索機能
   - カウンセラーメモ機能
   - 担当者割り当て機能
   - 緊急度管理（高・中・低）
   - 統計ダッシュボード

2. **カウンセラーコメント機能**
   - ユーザーに表示/非表示の切り替え
   - カウンセラー名の表示
   - メモ編集機能

3. **カウンセラー管理**
   - カウンセラーアカウント管理
   - 担当案件表示
   - 統計情報表示

4. **メンテナンスモード**
   - システム保守時の適切な案内
   - 進捗表示機能
   - 環境変数による制御

### 🆕 新機能（2025年7月1日実装）
1. **自動同期システム**
   - アプリ起動時の自動ユーザー作成・確認
   - 5分間隔でのローカルデータ自動同期
   - 手動同期オプション
   - エラーハンドリングと状態表示

2. **同意履歴管理**
   - プライバシーポリシー同意の完全追跡
   - 法的要件に対応した履歴保存
   - CSV出力機能
   - 管理画面での一覧・検索機能

3. **デバイス認証システム**
   - デバイスフィンガープリント生成・照合
   - PIN番号認証（6桁）
   - 秘密の質問による復旧機能
   - アカウントロック機能（5回失敗で24時間ロック）
   - セキュリティイベントログ
   - デバイス認証管理画面
   - セキュリティダッシュボード

4. **データバックアップ・復元機能**
   - ローカルデータのJSONバックアップ
   - バックアップファイルからの復元
   - 端末変更時のデータ移行サポート

5. **ポジティブ感情対応**
   - 嬉しい、感謝、達成感、幸せなどのポジティブ感情を追加
   - 感情選択UIの改善（ネガティブ/ポジティブのセクション分け）
   - 感情タイプ説明ページの拡充

## 🗄️ データベース構成

### Supabaseテーブル
1. **users**: ユーザー情報
   - id (uuid, primary key)
   - line_username (text, unique)
   - created_at (timestamp)

2. **diary_entries**: 日記エントリー
   - id (uuid, primary key)
   - user_id (uuid, foreign key)
   - date (date)
   - emotion (text)
   - event (text)
   - realization (text)
   - self_esteem_score (integer)
   - worthlessness_score (integer)
   - created_at (timestamp)
   - counselor_memo (text)
   - is_visible_to_user (boolean)
   - counselor_name (text)
   - assigned_counselor (text)
   - urgency_level (text)

3. **counselors**: カウンセラー情報
   - id (uuid, primary key)
   - name (text)
   - email (text, unique)
   - is_active (boolean)
   - created_at (timestamp)

4. **chat_rooms**: チャットルーム
   - id (uuid, primary key)
   - user_id (uuid, foreign key)
   - counselor_id (uuid, foreign key)
   - status (text)
   - created_at (timestamp)

5. **messages**: メッセージ
   - id (uuid, primary key)
   - chat_room_id (uuid, foreign key)
   - sender_id (uuid, foreign key)
   - counselor_id (uuid, foreign key)
   - content (text)
   - is_counselor (boolean)
   - created_at (timestamp)

6. **consent_histories**: 同意履歴
   - id (uuid, primary key)
   - line_username (text)
   - consent_given (boolean)
   - consent_date (timestamp)
   - ip_address (text)
   - user_agent (text)
   - created_at (timestamp)

### データベースマイグレーション
`supabase/migrations/`ディレクトリ内のSQLファイルがすべてのテーブル作成とRLS設定を含みます。

## 👥 カウンセラーアカウント
以下のアカウントでカウンセラーログインが可能：

| 名前 | メールアドレス | パスワード |
|------|----------------|------------|
| 心理カウンセラー仁 | jin@namisapo.com | counselor123 |
| 心理カウンセラーAOI | aoi@namisapo.com | counselor123 |
| 心理カウンセラーあさみ | asami@namisapo.com | counselor123 |
| 心理カウンセラーSHU | shu@namisapo.com | counselor123 |
| 心理カウンセラーゆーちゃ | yucha@namisapo.com | counselor123 |
| 心理カウンセラーSammy | sammy@namisapo.com | counselor123 |

## 📁 重要なファイル構成

### 新規追加されたファイル
```
src/
├── hooks/
│   └── useAutoSync.ts              # 自動同期フック
├── components/
│   ├── ui/
│   │   └── tabs.tsx                # Radix UIタブコンポーネント
│   ├── AutoSyncSettings.tsx        # 自動同期設定UI
│   ├── ConsentHistoryManagement.tsx # 同意履歴管理UI
│   ├── DataBackupRecovery.tsx      # データバックアップ・復元
│   ├── UserDataManagement.tsx      # ユーザーデータ管理
│   ├── DeviceAuthLogin.tsx         # デバイス認証ログイン
│   ├── DeviceAuthRegistration.tsx  # デバイス認証登録
│   ├── DeviceAuthManagement.tsx    # デバイス認証管理画面
│   └── SecurityDashboard.tsx       # セキュリティダッシュボード
└── lib/
    ├── deviceAuth.ts               # デバイス認証システム
    └── cleanupTestData.ts          # テストデータ削除ロジック
```

### 主要な変更があったファイル
```
src/
├── App.tsx                         # 自動同期フック追加、UI改善、データ管理メニュー追加
├── lib/supabase.ts                 # 同意履歴サービス追加、本番環境対応
├── hooks/useSupabase.ts            # 自動同期対応
├── components/
│   ├── AdminPanel.tsx              # カウンセラーコメント機能追加
│   ├── DataMigration.tsx           # 自動同期タブ追加、統計表示
│   ├── PrivacyConsent.tsx          # 同意履歴記録機能追加
├── hooks/useMaintenanceStatus.ts   # パフォーマンス改善
├── pages/
│   ├── DiaryPage.tsx               # ポジティブ感情対応
│   ├── DiarySearchPage.tsx         # カウンセラーコメント表示
│   ├── EmotionTypes.tsx            # ポジティブ感情追加
│   └── NextSteps.tsx               # ポジティブ感情説明追加
```

## 🎯 重要な実装ポイント

### 1. 自動同期システム
- アプリ起動時に自動的にSupabaseユーザーを作成
- 5分間隔で自動的にデータを同期
- ユーザーは同期設定画面で自動同期のON/OFFを切り替え可能
- 同期状態と最終同期時間を表示

### 2. ポジティブ感情対応
- ポジティブな感情（嬉しい、感謝、達成感、幸せ）を追加
- 無価値感と同様にスコア入力が可能
- 無価値感推移グラフにポジティブ感情のスコアも表示

### 3. カウンセラーコメント機能
- カウンセラーが日記にコメントを追加可能
- ユーザーに表示するかどうかを選択可能
- カウンセラー名を表示してフィードバックの信頼性を向上

### 4. データバックアップ・復元
- ユーザーデータをJSONファイルとしてバックアップ
- バックアップファイルからデータを復元
- 端末変更時のデータ移行をサポート

### 5. データフロー
```
アプリ起動 → 自動同期初期化 → ユーザー作成（必要な場合）→ 5分間隔で自動同期
→ ユーザーは同期設定画面で設定変更可能 → 管理者は全データにアクセス可能
```

## 🚀 デプロイ設定

### Netlify設定
- **ビルドコマンド**: `npm run build`
- **公開ディレクトリ**: `dist`
- **リダイレクト**: `netlify.toml`で設定済み

### 必要なファイル
```
netlify.toml:
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## 🔍 テストデータ
アプリには20日分のテストデータが自動生成される機能が実装されています。初回起動時に自動的に生成されます。

## 📞 サポート情報
- **開発者**: 一般社団法人NAMIDAサポート協会
- **メール**: info@namisapo.com
- **受付時間**: 平日 9:00-17:00

---

## 🎯 復元後の確認事項

1. **環境確認**: `npm run dev`でローカル環境が正常に動作することを確認
2. **Supabase接続**: 環境変数を設定してSupabase接続を確認
3. **自動同期テスト**: 新しいユーザーでアプリを開いて自動同期をテスト
4. **機能テスト**: 日記作成、検索、管理画面の動作確認
5. **カウンセラーログイン**: 管理画面へのアクセス確認
6. **デバイス認証**: 管理画面の「デバイス認証」「セキュリティ」タブの確認
7. **カウンセラーコメント**: コメント表示機能の確認
8. **データバックアップ**: バックアップ作成と復元機能の確認
9. **ポジティブ感情**: ポジティブ感情の選択とスコア入力の確認
10. **無価値感推移グラフ**: ポジティブ感情を含むグラフ表示の確認

このプロンプトを使用することで、かんじょうにっきプロジェクトを完全な状態で復元し、すべての機能が正常に動作する状態にできます。