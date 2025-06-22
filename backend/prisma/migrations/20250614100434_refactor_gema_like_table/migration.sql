/*
  Warnings:

  - You are about to drop the column `likesCount` on the `gemas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `gemas` DROP COLUMN `likesCount`;

-- CreateTable
CREATE TABLE `GemaLike` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `gemaId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GemaLike_userId_gemaId_key`(`userId`, `gemaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GemaLike` ADD CONSTRAINT `GemaLike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GemaLike` ADD CONSTRAINT `GemaLike_gemaId_fkey` FOREIGN KEY (`gemaId`) REFERENCES `Gemas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
