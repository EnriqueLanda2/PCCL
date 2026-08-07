ALTER TABLE "orders"
  ADD COLUMN "access_type" VARCHAR(20) NOT NULL DEFAULT 'permanent',
  ADD COLUMN "access_ends_at" TIMESTAMP(6);
