-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "private_key" TEXT,
    "phone_number" TEXT,
    "username" TEXT NOT NULL,
    "nickname" TEXT,
    "fullname" TEXT,
    "avatar_url" TEXT,
    "cover_photo_url" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "address" TEXT,
    "postal_code" TEXT,
    "timezone" TEXT,
    "status_id" INTEGER NOT NULL,
    "auth_provider_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "when_to_apply" TEXT,
    "how_to_reset" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountSession" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "refresh_token_expire" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_refresh_tokens" TEXT[],
    "device" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "last_active" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_public_id_key" ON "Account"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AccountStatus_name_key" ON "AccountStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AuthProvider_name_key" ON "AuthProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AccountRole_name_key" ON "AccountRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AccountSession_refresh_token_key" ON "AccountSession"("refresh_token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "AccountStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_auth_provider_id_fkey" FOREIGN KEY ("auth_provider_id") REFERENCES "AuthProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "AccountRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountSession" ADD CONSTRAINT "AccountSession_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
