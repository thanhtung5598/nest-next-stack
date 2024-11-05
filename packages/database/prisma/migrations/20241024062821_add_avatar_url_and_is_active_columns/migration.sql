-- AlterTable
ALTER TABLE "user" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
