/*
  Warnings:

  - You are about to drop the column `district` on the `CompanyAddress` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `CompanyAddress` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `CompanyAddress` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Location` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyAddress" DROP COLUMN "district",
DROP COLUMN "province",
DROP COLUMN "state",
ADD COLUMN     "city_block" TEXT,
ADD COLUMN     "city_district" TEXT,
ADD COLUMN     "country_code" TEXT,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "postcode" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "road" TEXT,
ADD COLUMN     "suburb" TEXT,
ALTER COLUMN "country" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "district",
DROP COLUMN "province",
DROP COLUMN "state",
ADD COLUMN     "city_block" TEXT,
ADD COLUMN     "city_district" TEXT,
ADD COLUMN     "country_code" TEXT,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "postcode" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "road" TEXT,
ADD COLUMN     "suburb" TEXT,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;
