/*
  Warnings:

  - You are about to drop the column `icon` on the `contas` table. All the data in the column will be lost.
  - Added the required column `logo` to the `contas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contas` DROP COLUMN `icon`,
    ADD COLUMN `logo` VARCHAR(191) NOT NULL,
    MODIFY `initial_balance` INTEGER NULL,
    MODIFY `color` VARCHAR(191) NULL;
