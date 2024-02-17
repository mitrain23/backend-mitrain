/*
  Warnings:

  - Added the required column `experience` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `mitras_categoryName_fkey` ON `mitras`;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `experience` VARCHAR(191) NOT NULL;
