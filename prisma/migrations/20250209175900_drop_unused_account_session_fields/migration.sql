/*
  Warnings:

  - You are about to drop the column `used_refresh_tokens` on the `AccountSession` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `AccountSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AccountSession" DROP COLUMN "used_refresh_tokens",
DROP COLUMN "user_agent",
ADD COLUMN     "logged_out_at" TIMESTAMP(3);
