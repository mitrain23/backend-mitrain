-- DropIndex
DROP INDEX `mitras_categoryName_fkey` ON `mitras`;

-- AlterTable
ALTER TABLE `posts` MODIFY `priceMin` VARCHAR(191) NULL,
    MODIFY `priceMax` VARCHAR(191) NULL;
