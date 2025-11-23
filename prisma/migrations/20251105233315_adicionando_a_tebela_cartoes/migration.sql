-- CreateTable
CREATE TABLE `cartoes` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `bandeira` VARCHAR(191) NOT NULL,
    `banco` VARCHAR(191) NOT NULL,
    `limite_total` INTEGER NOT NULL,
    `dia_fechamento` DATETIME(3) NOT NULL,
    `dia_vencimento` DATETIME(3) NOT NULL,
    `ativo` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cartoes` ADD CONSTRAINT `cartoes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
