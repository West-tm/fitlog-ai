-- DropForeignKey (Feedback.promptId は後で DROP するので先に外す)
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_promptId_fkey";

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- Message に列を追加（まだ NULL 可）
ALTER TABLE "Message"
ADD COLUMN "chatId" TEXT,
ADD COLUMN "endDate" DATE,
ADD COLUMN "promptId" TEXT,
ADD COLUMN "startDate" DATE;

-- Feedback → Message へ生成条件をコピー（同一 message に複数ある場合は最新）
UPDATE "Message" AS m
SET
  "startDate" = f."startDate",
  "endDate" = f."endDate",
  "promptId" = f."promptId"
FROM (
  SELECT DISTINCT ON ("messageId")
    "messageId",
    "startDate",
    "endDate",
    "promptId"
  FROM "Feedback"
  ORDER BY "messageId", "createdAt" DESC
) AS f
WHERE f."messageId" = m."id";

-- Feedback が無い Message 用のフォールバック
UPDATE "Message"
SET
  "startDate" = DATE("createdAt"),
  "endDate" = DATE("createdAt")
WHERE "startDate" IS NULL OR "endDate" IS NULL;

-- 削除済み Prompt を指している場合は NULL に（FK 追加前の安全策）
UPDATE "Message" AS m
SET "promptId" = NULL
WHERE m."promptId" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "Prompt" AS p WHERE p."id" = m."promptId"
  );

-- chatId を先に振り、同じ id で Chat を作る
UPDATE "Message"
SET "chatId" = gen_random_uuid()::text
WHERE "chatId" IS NULL;

INSERT INTO "Chat" ("id", "title", "createdAt", "updatedAt", "userId")
SELECT
  m."chatId",
  CASE
    WHEN LENGTH(TRIM(m."content")) = 0 THEN '新規チャット'
    WHEN LENGTH(m."content") > 40 THEN LEFT(m."content", 40) || '...'
    ELSE m."content"
  END,
  m."createdAt",
  m."updatedAt",
  m."userId"
FROM "Message" AS m;

-- 必須化
ALTER TABLE "Message"
ALTER COLUMN "chatId" SET NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "endDate" SET NOT NULL;

-- Feedback から移した列を削除
ALTER TABLE "Feedback"
DROP COLUMN "endDate",
DROP COLUMN "promptId",
DROP COLUMN "startDate";

-- Foreign keys
ALTER TABLE "Chat"
ADD CONSTRAINT "Chat_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Message"
ADD CONSTRAINT "Message_promptId_fkey"
FOREIGN KEY ("promptId") REFERENCES "Prompt"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Message"
ADD CONSTRAINT "Message_chatId_fkey"
FOREIGN KEY ("chatId") REFERENCES "Chat"("id")
ON DELETE CASCADE ON UPDATE CASCADE;