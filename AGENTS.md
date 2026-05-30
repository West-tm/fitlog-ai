# AGENTS.md

## プロジェクト概要

**FitLog AI** — テキスト入力から始める、AIフィードバック・ログ管理ツール。
自由なテキスト記述をAIに投げて健康PDCAのフィードバックをもらう最小構成（v0.1）から、
Fitbit連携・筋トレ管理・ダッシュボードを備えた本格ヘルスケアアプリ（v1.0）へと育てる
ポートフォリオ兼実用ツール。

---

## 技術スタック

| カテゴリ         | 技術                                                   |
| ---------------- | ------------------------------------------------------ |
| フロントエンド   | Next.js 16 / TypeScript / Tailwind CSS / shadcn/ui     |
| フォーム         | auth: useActionState / 主要機能: react-hook-form + zod |
| バックエンド     | Supabase（Auth・DB・Storage）                          |
| ORM              | Prisma                                                 |
| AI               | Gemini API                                             |
| グラフ（v1.0〜） | Recharts                                               |
| デプロイ         | Vercel                                                 |

---

## DB設計（v0.1）

```
users        : id, updated_at
prompts      : id, user_id, content, created_at, updated_at
notes        : id, user_id, content, created_at, updated_at
feedbacks    : id, prompt_id, note_id, content, created_at, updated_at
```

v1.0以降で `body_logs` / `sleep_logs` / `activity_logs` / `workout_logs` を追加予定。

---

## コーディングルール

- 基本は Server Components を優先する
- 必要な場合のみ `"use client"` を使う
- DBアクセスは Prisma Client を使う
- 認証・Storage は Supabase SDK を使う（fetch / axios は使わない）
- バリデーションは zod を使う
- async/await を使う
- 可読性を優先する
- 複雑な抽象化を避ける
- 小さなコンポーネントに分割する
- 過度な custom hooks を避ける
- 過度な utility 化を避ける
- premature optimization を避ける
- over-engineering を避ける

---

## 学習ルール

- コードは1行ずつ説明する
- 「どう動くか」より先に「なぜ必要か」を説明する
- 初心者向けに説明する
- tradeoff を説明する
- ベストプラクティスの理由を説明する
- App Router の動作を説明する
- Server / Client Components の違いを説明する
- `"use client"` が必要な理由を説明する
- cache / revalidate の動作を説明する
- 可能な限りファイル全体を表示する

---

## Form ルール

- **認証フォーム（ログイン・サインアップ）**: `useActionState` + Server Actions を使う
- **主要機能フォーム（ログ入力・プロンプト管理など）**: `react-hook-form` + `zod` を使う
- バリデーションエラーを説明する
- form state を説明する

---

## Prisma ルール

- Prisma singleton パターンを使う（`src/lib/prisma.ts` で `PrismaClient` を一度だけインスタンス化する）
- スキーマ変更時は `prisma migrate dev` でマイグレーションを作成する
- migration の意味と影響を説明する
- リレーションの設計意図を説明する
- スキーマ変更の理由を説明する

---

## Auth ルール

- Supabase Auth を使う
- server-side auth を優先する
- session の流れを説明する
- middleware の役割を説明する

---

## AI ルール

- Gemini API（`@google/generative-ai`）を使う
- APIキーは環境変数 `GEMINI_API_KEY` から取得する
- AI呼び出しは Server Actions または Route Handlers で行う（クライアントから直接呼ばない）
- プロンプト（`prompts`テーブル）とログ（`notes`テーブル）を組み合わせてAPIに投げる
- レスポンスは `feedbacks` テーブルに保存する
- エラーハンドリングを丁寧に行い、ユーザーにわかりやすいメッセージを返す

---

## UI ルール

- シンプルな UI を優先する
- shadcn/ui は必要最小限で使う
- Tailwind は読みやすさ重視で書く

---

## 開発フェーズ

### v0.1（Cランク・現在のターゲット）

- [ ] 認証（ログイン・サインアップ・ログアウト）
- [ ] ログのCRUD（`notes`テーブル）
- [ ] プロンプト管理（`prompts`テーブル）
- [ ] AIフィードバック生成・保存（`feedbacks`テーブル）
- [ ] Cursor rules 設定
- [ ] GitHub MCP 連携
- [ ] Claude Code カスタムコマンド 3つ以上

### v1.0（Bランク・今後）

- [ ] Fitbit API 連携
- [ ] Recharts ダッシュボード
- [ ] 筋トレ管理（Markdown記録・react-markdown表示）
- [ ] データ CSV / Markdown エクスポート

---

## 重要

- Optimize for learning and readability over cleverness.
- 学習しやすさと可読性を、賢い実装より優先する。
- Do not edit files directly. Only suggest code changes.
- ファイル編集は行わず、コード提案のみ行う。
