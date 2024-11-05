/*
  Warnings:

  - The primary key for the `borrow_request` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `borrow_request` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "borrow_request" DROP CONSTRAINT "borrow_request_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'requesting',
ADD CONSTRAINT "borrow_request_pkey" PRIMARY KEY ("id");
