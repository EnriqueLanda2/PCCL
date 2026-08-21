-- CreateTable
CREATE TABLE "assignment_submissions" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "lesson_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "user_email" VARCHAR(100),
    "file_url" TEXT NOT NULL,
    "file_name" VARCHAR(200),
    "comment" TEXT,
    "submitted_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER,
    "feedback" TEXT,
    "graded_by" VARCHAR(100),
    "graded_at" TIMESTAMP(6),

    CONSTRAINT "assignment_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "assignment_submissions_lesson_id_idx" ON "assignment_submissions"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "assignment_submissions_lesson_id_user_id_key" ON "assignment_submissions"("lesson_id", "user_id");

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
