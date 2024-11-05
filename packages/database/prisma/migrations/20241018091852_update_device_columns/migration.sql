/*
  Warnings:

  - A unique constraint covering the columns `[serial_number]` on the table `device` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "device" ADD COLUMN     "expired_warranty_at" TIMESTAMP(3),
ADD COLUMN     "used_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "device_serial_number_key" ON "device"("serial_number");
