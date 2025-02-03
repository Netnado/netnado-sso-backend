/*
  Warnings:

  - Added the required column `public_key` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Made the column `private_key` on table `Account` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "public_key" TEXT NOT NULL,
ALTER COLUMN "private_key" SET NOT NULL;
