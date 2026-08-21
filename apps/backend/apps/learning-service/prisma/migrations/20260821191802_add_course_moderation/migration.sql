-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "moderated_at" TIMESTAMP(6),
ADD COLUMN     "moderated_by" VARCHAR(100),
ADD COLUMN     "moderation_note" TEXT;

-- CreateTable
CREATE TABLE "alexa_trivia_results" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "alexa_user_id" VARCHAR(200) NOT NULL,
    "course_id" UUID,
    "topic" VARCHAR(140) NOT NULL,
    "total" INTEGER NOT NULL,
    "correct" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,

    CONSTRAINT "alexa_trivia_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "alexa_trivia_results_user_id_idx" ON "alexa_trivia_results"("user_id");
