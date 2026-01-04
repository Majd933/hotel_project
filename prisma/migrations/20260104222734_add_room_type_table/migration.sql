/*
  Warnings:

  - You are about to drop the column `beds` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `descKey` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `guests` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `typeKey` on the `rooms` table. All the data in the column will be lost.
  - Added the required column `roomTypeId` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Made the column `roomNumber` on table `rooms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "beds",
DROP COLUMN "descKey",
DROP COLUMN "features",
DROP COLUMN "guests",
DROP COLUMN "image",
DROP COLUMN "price",
DROP COLUMN "size",
DROP COLUMN "typeKey",
ADD COLUMN     "roomTypeId" INTEGER NOT NULL,
ALTER COLUMN "roomNumber" SET NOT NULL;

-- CreateTable
CREATE TABLE "room_types" (
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

    CONSTRAINT "room_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "room_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
