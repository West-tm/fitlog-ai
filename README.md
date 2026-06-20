# FitLog AI

テキスト入力から始める AI フィードバック・ログ管理ツール。
日々の体重・食事・筋トレをテキストで記録し、Gemini API がパーソナライズされたフィードバックを生成します。

## デモ

- **URL:** https://fitlog-ai-puce.vercel.app/auth/signin
- **メール:** demo@example.com
- **パスワード:** demo@exa

> ⚠️ デモアカウントは共有です。入力内容は他の閲覧者にも見える可能性があるため、個人情報は入力しないでください。

---

## 概要

### ターゲット

身体データ（体重・食事・筋トレ）を 1 箇所にまとめて AI のアドバイスが欲しい人。

### 課題

- 入力項目が多いアプリは面倒で挫折する
- 複数アプリの数値を自分で比較・分析するのが大変
- 現状は ChatGPT への手動コピペで運用している

### 解決策

1 つのテキストエリアにその日の体重・食事・筋トレをメモ帳感覚で書くだけで、AI が内容を読み取り翌日のアクションプランを提案する。

---

## 利用の流れ

1. サインアップ、またはデモアカウントでログイン
2. 「指示文」→「新規作成」から指示文を保存（例：「増量中なので強気な提案を」）
3. 作成した「指示文」が保存され、「指示文 一覧」にリスト表示される
   リストの各リンク先から詳細の確認、編集・削除ができる
4. 「AI回答」→「新規作成」からメッセージを入力し、AI 回答を生成
5. 生成されたAI回答が保存され、「AI回答 一覧」にリスト表示される
   リストの各リンク先から詳細の確認、編集（AI回答の再生成）・削除ができる

---

## 機能

### v0.1（現在）

- 認証：ログイン・サインアップ・ログアウト
- 指示文管理：AI 回答生成時に使用する指示文の作成・詳細・編集・削除
- AI 連携：指示文＋メッセージを Gemini API に送信してAIフィードバックを生成・保存・再生成・削除
- AI回答の生成用メッセージ管理：テキスト形式で記録・編集・削除

### v1.0（予定）

- Google Health API 連携（体重推移・睡眠・歩数・消費カロリーの自動取得）
- Web ダッシュボード（Recharts でグラフ表示）
- 筋トレ管理（Markdown 記録・ボリューム推移グラフ）
- データ CSV / Markdown エクスポート

---

## ER図

```mermaid
erDiagram
  User ||--o{ Prompt : creates
  User ||--o{ Message : creates
  User ||--o{ Feedback : creates

  Prompt o|--o{ Feedback : used_for
  Message ||--o{ Feedback : generates

  User {
    String id PK
    DateTime updatedAt
  }

  Prompt {
    String id PK
    String title
    String content
    DateTime createdAt
    DateTime updatedAt
    String userId FK
  }

  Message {
    String id PK
    String content
    DateTime createdAt
    DateTime updatedAt
    String userId FK
  }

  Feedback {
    String id PK
    String content
    DateTime createdAt
    DateTime updatedAt
    String userId FK
    String promptId FK
    String promptSnapshot
    String messageId FK
  }
```

---

## 技術スタック

| カテゴリ         | 技術                                            |
| ---------------- | ----------------------------------------------- |
| フロントエンド   | Next.js / TypeScript / Tailwind CSS / shadcn/ui |
| フォーム         | useActionState / react-hook-form / Zod          |
| バックエンド     | Supabase（Auth・DB）/ Prisma ORM                |
| AI               | Gemini API                                      |
| グラフ（v1.0〜） | Recharts                                        |
| デプロイ         | Vercel                                          |

---

## 外部 API

| API                            | 用途                                             |
| ------------------------------ | ------------------------------------------------ |
| Gemini API（gemini-2.5-flash） | 指示文とメッセージを元に AI フィードバックを生成 |
| Google Health API（v1.0〜）    | 体重・睡眠・活動データの自動取得                 |

---

## 開発支援・品質管理

- CodeRabbit：PR 差分の自動レビューにより、バグリスク・可読性・保守性の確認を補助

---

## ローカル開発

```bash
git clone https://github.com/West-tm/fitlog-ai.git
cd fitlog-ai
npm install
cp .env.example .env.local
```

`.env.local` に以下の環境変数を設定してください。

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `GEMINI_API_KEY`

```bash
npx prisma generate
npm run dev
```

Windows PowerShell の場合:

```powershell
Copy-Item .env.example .env.local
```

[http://localhost:3000](http://localhost:3000) でアクセス
