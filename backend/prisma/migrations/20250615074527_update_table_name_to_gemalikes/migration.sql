/*
  Warnings:

  - You are about to drop the `gemalike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `gemalike` DROP FOREIGN KEY `GemaLike_gemaId_fkey`;

-- DropForeignKey
ALTER TABLE `gemalike` DROP FOREIGN KEY `GemaLike_userId_fkey`;

-- DropTable
DROP TABLE `gemalike`;

-- CreateTable
CREATE TABLE `GemaLikes` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `gemaId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GemaLikes_userId_gemaId_key`(`userId`, `gemaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GemaLikes` ADD CONSTRAINT `GemaLikes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GemaLikes` ADD CONSTRAINT `GemaLikes_gemaId_fkey` FOREIGN KEY (`gemaId`) REFERENCES `Gemas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
