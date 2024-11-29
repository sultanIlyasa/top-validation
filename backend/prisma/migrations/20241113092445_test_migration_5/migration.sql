-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_analystId_fkey";

-- AlterTable
ALTER TABLE "Schedule" ALTER COLUMN "analystId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_analystId_fkey" FOREIGN KEY ("analystId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
