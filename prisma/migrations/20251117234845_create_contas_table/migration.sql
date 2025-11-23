/*
  Warnings:

  - You are about to drop the column `ativo` on the `cartoes` table. All the data in the column will be lost.
  - You are about to drop the column `banco` on the `cartoes` table. All the data in the column will be lost.
  - You are about to drop the column `bandeira` on the `cartoes` table. All the data in the column will be lost.
  - You are about to drop the column `dia_fechamento` on the `cartoes` table. All the data in the column will be lost.
  - You are about to drop the column `dia_vencimento` on the `cartoes` table. All the data in the column will be lost.
  - You are about to drop the column `limite_total` on the `cartoes` table. All the data in the column will be lost.
  - Added the required column `active` to the `cartoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closing_day` to the `cartoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `due_date` to the `cartoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flag` to the `cartoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_account` to the `cartoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_limit` to the `cartoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cartoes` DROP COLUMN `ativo`,
    DROP COLUMN `banco`,
    DROP COLUMN `bandeira`,
    DROP COLUMN `dia_fechamento`,
    DROP COLUMN `dia_vencimento`,
    DROP COLUMN `limite_total`,
    ADD COLUMN `active` BOOLEAN NOT NULL,
    ADD COLUMN `closing_day` DATETIME(3) NOT NULL,
    ADD COLUMN `due_date` DATETIME(3) NOT NULL,
    ADD COLUMN `flag` VARCHAR(191) NOT NULL,
    ADD COLUMN `payment_account` VARCHAR(191) NOT NULL,
    ADD COLUMN `total_limit` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `contas` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `initial_balance` INTEGER NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contas` ADD CONSTRAINT `contas_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
