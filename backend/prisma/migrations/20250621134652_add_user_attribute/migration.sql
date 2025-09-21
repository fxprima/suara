-- AlterTable
ALTER TABLE `users` ADD COLUMN `biography` MEDIUMTEXT NULL,
    ADD COLUMN `location` VARCHAR(191) NULL,
    ADD COLUMN `website` VARCHAR(191) NULL;
