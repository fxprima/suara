/*
  Warnings:

  - You are about to drop the column `title` on the `gemas` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Gemas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gemas` DROP COLUMN `title`,
    ADD COLUMN `parentId` VARCHAR(191) NULL,
    ADD COLUMN `repliesCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `repostCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `viewsCount` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Gemas` ADD CONSTRAINT `Gemas_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Gemas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
