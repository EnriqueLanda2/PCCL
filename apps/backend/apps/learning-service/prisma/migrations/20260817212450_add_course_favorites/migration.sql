-- CreateTable
CREATE TABLE "course_favorites" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "user_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,

    CONSTRAINT "course_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "course_favorites_user_id_idx" ON "course_favorites"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_favorites_user_id_course_id_key" ON "course_favorites"("user_id", "course_id");

-- AddForeignKey
ALTER TABLE "course_favorites" ADD CONSTRAINT "course_favorites_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
