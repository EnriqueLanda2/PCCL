-- AlterTable
ALTER TABLE "certificates" ADD COLUMN     "user_id" UUID;

-- CreateIndex
CREATE INDEX "certificates_user_id_idx" ON "certificates"("user_id");
