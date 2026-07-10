-- CreateTable
CREATE TABLE "live_sessions" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "title" VARCHAR(140) NOT NULL,
    "host_name" VARCHAR(120) NOT NULL,
    "scheduled_at" TIMESTAMP(6) NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 60,
    "join_url" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    "course_id" UUID,

    CONSTRAINT "live_sessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "live_sessions" ADD CONSTRAINT "live_sessions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
