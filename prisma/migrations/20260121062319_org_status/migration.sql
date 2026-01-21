-- CreateEnum
CREATE TYPE "OrgStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING');

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "logo" TEXT,
ADD COLUMN     "status" "OrgStatus" NOT NULL DEFAULT 'ACTIVE';
