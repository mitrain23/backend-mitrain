/*
  Warnings:

  - Added the required column `merchant_name` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `posts` ADD COLUMN `merchant_name` VARCHAR(100) NOT NULL;
