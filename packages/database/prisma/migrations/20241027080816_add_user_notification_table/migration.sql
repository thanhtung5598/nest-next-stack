-- CreateTable
CREATE TABLE "user_notification" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "checked_at" TIMESTAMP(3),
    "notified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "target_uri" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT,

    CONSTRAINT "user_notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
