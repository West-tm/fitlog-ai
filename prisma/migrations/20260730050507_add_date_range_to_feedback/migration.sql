-- 1. いったん NULL 可で追加
ALTER TABLE "Feedback" ADD COLUMN "startDate" DATE,
ADD COLUMN "endDate" DATE;

-- 2. 既存行を埋める（仮の値でも可）
UPDATE "Feedback"
SET "startDate" = DATE("createdAt"),
    "endDate" = DATE("createdAt")
WHERE "startDate" IS NULL;

-- 3. NOT NULL にする
ALTER TABLE "Feedback" ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "endDate" SET NOT NULL;