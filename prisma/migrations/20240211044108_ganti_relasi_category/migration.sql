-- DropForeignKey
ALTER TABLE `mitras` DROP FOREIGN KEY `mitras_categoryName_fkey`;

-- DropForeignKey
ALTER TABLE `Subcategory` DROP FOREIGN KEY `Subcategory_categoryName_fkey`;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_category_fkey` FOREIGN KEY (`category`) REFERENCES `Category`(`categoryName`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subcategory` ADD CONSTRAINT `Subcategory_categoryName_fkey` FOREIGN KEY (`categoryName`) REFERENCES `Category`(`categoryName`) ON DELETE CASCADE ON UPDATE CASCADE;
