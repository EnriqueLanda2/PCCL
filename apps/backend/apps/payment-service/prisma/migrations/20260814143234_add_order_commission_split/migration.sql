-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "instructor_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "platform_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "source" VARCHAR(30) NOT NULL DEFAULT 'organic';
