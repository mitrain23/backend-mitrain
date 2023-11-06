-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `phoneIntWhatsapp` VARCHAR(15) NOT NULL,
    `phoneIntContact` VARCHAR(15) NOT NULL,
    `isPremium` BOOLEAN NULL,
    `isMitra` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mitras` (
    `id` VARCHAR(191) NOT NULL,
    `categoryName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `experience` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `priceMin` VARCHAR(191) NOT NULL,
    `priceMax` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `isLiked` BOOLEAN NULL,
    `phoneIntWhatsapp` VARCHAR(15) NOT NULL,
    `phoneIntContact` VARCHAR(15) NOT NULL,
    `mitraId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `postId` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `categoryName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_categoryName_key`(`categoryName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subcategory` (
    `id` VARCHAR(191) NOT NULL,
    `subcategoryName` VARCHAR(191) NOT NULL,
    `categoryName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Subcategory_subcategoryName_key`(`subcategoryName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mitras` ADD CONSTRAINT `mitras_id_fkey` FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mitras` ADD CONSTRAINT `mitras_categoryName_fkey` FOREIGN KEY (`categoryName`) REFERENCES `Category`(`categoryName`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_mitraId_fkey` FOREIGN KEY (`mitraId`) REFERENCES `mitras`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subcategory` ADD CONSTRAINT `Subcategory_categoryName_fkey` FOREIGN KEY (`categoryName`) REFERENCES `Category`(`categoryName`) ON DELETE RESTRICT ON UPDATE CASCADE;
