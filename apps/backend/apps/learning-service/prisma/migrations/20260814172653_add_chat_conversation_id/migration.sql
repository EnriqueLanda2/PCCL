/*
  Warnings:

  - Added the required column `conversation_id` to the `chat_messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "chat_messages_user_id_lesson_id_idx";

-- AlterTable
ALTER TABLE "chat_messages" ADD COLUMN     "conversation_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "chat_messages_user_id_conversation_id_idx" ON "chat_messages"("user_id", "conversation_id");
