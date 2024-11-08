/*
  Warnings:

  - You are about to drop the column `city_block` on the `CompanyAddress` table. All the data in the column will be lost.
  - You are about to drop the column `city_district` on the `CompanyAddress` table. All the data in the column will be lost.
  - You are about to drop the column `country_code` on the `CompanyAddress` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `CompanyAddress` table. All the data in the column will be lost.
  - You are about to drop the column `neighborhood` on the `CompanyAddress` table. All the data in the column will be lost.
  - You are about to drop the column `road` on the `CompanyAddress` table. All the data in the column will be lost.
  - You are about to drop the column `suburb` on the `CompanyAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "positions" TEXT;

-- AlterTable
ALTER TABLE "CompanyAddress" DROP COLUMN "city_block",
DROP COLUMN "city_district",
DROP COLUMN "country_code",
DROP COLUMN "displayName",
DROP COLUMN "neighborhood",
DROP COLUMN "road",
DROP COLUMN "suburb",
ADD COLUMN     "companyAddress" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "province" TEXT;
