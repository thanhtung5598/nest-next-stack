/*
  Warnings:

  - The primary key for the `department_device` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `department_device` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `department_device` table. All the data in the column will be lost.
  - The primary key for the `user_device` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_device` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `user_device` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "department_device" DROP CONSTRAINT "department_device_pkey",
DROP COLUMN "id",
DROP COLUMN "status",
ADD CONSTRAINT "department_device_pkey" PRIMARY KEY ("device_id");

-- AlterTable
ALTER TABLE "device" ADD COLUMN     "brand_id" INTEGER;

-- AlterTable
ALTER TABLE "user_device" DROP CONSTRAINT "user_device_pkey",
DROP COLUMN "id",
DROP COLUMN "status",
ADD CONSTRAINT "user_device_pkey" PRIMARY KEY ("device_id");

-- CreateTable
CREATE TABLE "brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brand_code_key" ON "brand"("code");

-- AddForeignKey
ALTER TABLE "device" ADD CONSTRAINT "device_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
