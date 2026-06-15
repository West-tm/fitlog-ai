/*
  Warnings:

  - Added the required column `promptSnapshot` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_promptId_fkey";

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "promptSnapshot" TEXT NOT NULL,
ALTER COLUMN "promptId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
