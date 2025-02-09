-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "lock_expires_at" TIMESTAMP(3),
ADD COLUMN     "login_attempts_count" INTEGER NOT NULL DEFAULT 0;
