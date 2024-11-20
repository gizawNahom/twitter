-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "profilePic" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
