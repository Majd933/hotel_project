-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "typeKey" TEXT NOT NULL,
    "descKey" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "guests" INTEGER NOT NULL,
    "beds" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "features" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);
