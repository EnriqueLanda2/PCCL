-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "full_name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privileges" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "code" VARCHAR(160) NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "module_id" UUID NOT NULL,

    CONSTRAINT "privileges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_modules" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "name" VARCHAR(120) NOT NULL,

    CONSTRAINT "system_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_privileges" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "role_id" UUID NOT NULL,
    "privilege_id" UUID NOT NULL,

    CONSTRAINT "role_privileges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "title" VARCHAR(140) NOT NULL,
    "description" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "level" VARCHAR(40) NOT NULL DEFAULT 'basic',

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "title" VARCHAR(140) NOT NULL,
    "content" TEXT NOT NULL,
    "content_type" VARCHAR(20) NOT NULL DEFAULT 'text',
    "course_id" UUID NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscriptions" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "user_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'enrolled',
    "progress_percentage" DECIMAL(5,2),
    "completed_at" TIMESTAMP(6),

    CONSTRAINT "inscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "inscription_id" UUID NOT NULL,
    "lessons_completed" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "evaluations_completed" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "average_score" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "progress_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "last_access_at" TIMESTAMP(6),

    CONSTRAINT "progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "inscription_id" UUID NOT NULL,
    "certificate_number" VARCHAR(100) NOT NULL,
    "issued_at" TIMESTAMP(6) NOT NULL,
    "expires_at" TIMESTAMP(6),
    "status" VARCHAR(20) NOT NULL DEFAULT 'valid',
    "pdf_url" TEXT,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "method" VARCHAR(12) NOT NULL,
    "endpoint" VARCHAR(255) NOT NULL,
    "transaction_type" VARCHAR(30) NOT NULL,
    "actor_scope" VARCHAR(20) NOT NULL DEFAULT 'anonymous',
    "actor_identifier" VARCHAR(140),
    "browser" VARCHAR(150),
    "description" TEXT NOT NULL,
    "status_code" INTEGER,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "califications" (
    "id" UUID NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "title" VARCHAR(140) NOT NULL,
    "content" TEXT NOT NULL,
    "type" VARCHAR(20) NOT NULL DEFAULT 'quiz',
    "total_points" INTEGER NOT NULL DEFAULT 10,
    "max_attempts" INTEGER NOT NULL DEFAULT 1,
    "lesson_id" UUID NOT NULL,

    CONSTRAINT "califications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "privileges_code_key" ON "privileges"("code");

-- CreateIndex
CREATE UNIQUE INDEX "system_modules_key_key" ON "system_modules"("key");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_privileges_role_id_privilege_id_key" ON "role_privileges"("role_id", "privilege_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certificate_number_key" ON "certificates"("certificate_number");

-- AddForeignKey
ALTER TABLE "privileges" ADD CONSTRAINT "privileges_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "system_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_privileges" ADD CONSTRAINT "role_privileges_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_privileges" ADD CONSTRAINT "role_privileges_privilege_id_fkey" FOREIGN KEY ("privilege_id") REFERENCES "privileges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress" ADD CONSTRAINT "progress_inscription_id_fkey" FOREIGN KEY ("inscription_id") REFERENCES "inscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_inscription_id_fkey" FOREIGN KEY ("inscription_id") REFERENCES "inscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "califications" ADD CONSTRAINT "califications_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
