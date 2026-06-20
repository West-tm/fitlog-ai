ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_noteId_fkey";

ALTER TABLE "Note" RENAME TO "Message";
ALTER TABLE "Message" RENAME CONSTRAINT "Note_pkey" TO "Message_pkey";
ALTER TABLE "Message" RENAME CONSTRAINT "Note_userId_fkey" TO "Message_userId_fkey";

ALTER TABLE "Feedback" RENAME COLUMN "noteId" TO "messageId";

ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_messageId_fkey"
FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;