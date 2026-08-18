-- AlterTable
ALTER TABLE "evaluations" ADD COLUMN     "phase_id" UUID,
ADD COLUMN     "phase_position" VARCHAR(10) NOT NULL DEFAULT 'end';

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_phase_id_fkey" FOREIGN KEY ("phase_id") REFERENCES "phases"("id") ON DELETE SET NULL ON UPDATE CASCADE;
