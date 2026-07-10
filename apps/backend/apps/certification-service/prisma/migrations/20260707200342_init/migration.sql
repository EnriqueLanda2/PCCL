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

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certificate_number_key" ON "certificates"("certificate_number");
