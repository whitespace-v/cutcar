-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Data" (
    "id" SERIAL NOT NULL,
    "article" BIGINT NOT NULL,
    "name" TEXT,
    "make" TEXT,
    "model" TEXT,
    "year" TEXT,
    "body" TEXT,
    "engine" TEXT,
    "top_bottom" TEXT,
    "front_rear" TEXT,
    "left_right" TEXT,
    "color" TEXT,
    "number" TEXT,
    "comment" TEXT,
    "price" INTEGER,
    "manufacturer" TEXT,
    "photo" TEXT,
    "new_used" TEXT,
    "status" TEXT,
    "arrived" BIGINT,
    "sold" BIGINT,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Data_article_key" ON "Data"("article");
