/*
  Warnings:

  - The values [CANCELLED] on the enum `ScheduleStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `expiredDate` to the `VideoCall` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoUrl` to the `VideoCall` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ScheduleStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'RESCHEDULED', 'COMPLETED');
ALTER TABLE "Schedule" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Schedule" ALTER COLUMN "status" TYPE "ScheduleStatus_new" USING ("status"::text::"ScheduleStatus_new");
ALTER TYPE "ScheduleStatus" RENAME TO "ScheduleStatus_old";
ALTER TYPE "ScheduleStatus_new" RENAME TO "ScheduleStatus";
DROP TYPE "ScheduleStatus_old";
ALTER TABLE "Schedule" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;

-- AlterTable
ALTER TABLE "VideoCall" ADD COLUMN     "callImageURL" TEXT[],
ADD COLUMN     "expiredDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "videoUrl" TEXT NOT NULL;
