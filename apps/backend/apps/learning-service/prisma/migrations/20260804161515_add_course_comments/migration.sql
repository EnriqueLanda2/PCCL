-- CreateTable
CREATE TABLE "course_comments" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "course_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "liked_by" UUID[] DEFAULT ARRAY[]::UUID[],

    CONSTRAINT "course_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "course_comments_course_id_idx" ON "course_comments"("course_id");

-- AddForeignKey
ALTER TABLE "course_comments" ADD CONSTRAINT "course_comments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
