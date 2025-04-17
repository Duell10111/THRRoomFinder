-- CreateEnum
CREATE TYPE "Site" AS ENUM ('RO');

-- AlterTable
ALTER TABLE "building" ADD COLUMN     "site" "Site";

-- AlterTable
ALTER TABLE "room" ADD COLUMN     "display_name" TEXT;
