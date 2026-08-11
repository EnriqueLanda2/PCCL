CREATE TABLE "course_reviews" (
  "id" UUID NOT NULL,
  "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" VARCHAR(100),
  "updated_by" VARCHAR(100),
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) NOT NULL,
  "course_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  CONSTRAINT "course_reviews_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "course_reviews_course_id_user_id_key" ON "course_reviews"("course_id", "user_id");
CREATE INDEX "course_reviews_course_id_idx" ON "course_reviews"("course_id");
CREATE INDEX "course_reviews_user_id_idx" ON "course_reviews"("user_id");

ALTER TABLE "course_reviews"
  ADD CONSTRAINT "course_reviews_course_id_fkey"
  FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "evaluations"
  ADD COLUMN "topic" VARCHAR(120),
  ADD COLUMN "kind" VARCHAR(20) NOT NULL DEFAULT 'kahoot',
  ADD COLUMN "passing_score" INTEGER NOT NULL DEFAULT 70,
  ADD COLUMN "questions" JSONB;
