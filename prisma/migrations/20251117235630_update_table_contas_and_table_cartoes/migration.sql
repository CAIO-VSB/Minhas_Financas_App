-- DropForeignKey
ALTER TABLE `cartoes` DROP FOREIGN KEY `cartoes_userId_fkey`;

-- DropIndex
DROP INDEX `cartoes_userId_fkey` ON `cartoes`;

-- AddForeignKey
ALTER TABLE `cartoes` ADD CONSTRAINT `cartoes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartoes` ADD CONSTRAINT `cartoes_payment_account_fkey` FOREIGN KEY (`payment_account`) REFERENCES `contas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
